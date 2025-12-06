import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 1. Define strict extension lists for each category
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  audio: ["mp3", "wav", "m4a", "flac", "aac", "ogg", "wma", "amr"],
  video: ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"],
  image: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff"],
  text:  ["txt", "md", "json", "csv", "log", "yaml", "xml"]
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const keyParam = url.searchParams.get('key');
    const typeParam = url.searchParams.get('type') || 'all'; // Default to 'all' if missing

    // --- CASE 1: Fetch Single File (Details + Signed URL) ---
    if (keyParam) {
      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: keyParam,
        }),
        { expiresIn: 3600 }
      );

      try {
        // Use HeadObjectCommand correctly to get metadata
        const headRes = await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: keyParam,
          })
        );
        
        return NextResponse.json({
          files: [{
            key: keyParam,
            url: signedUrl,
            size: headRes.ContentLength ?? null,
            lastModified: headRes.LastModified ? headRes.LastModified.toISOString() : null,
          }],
        });
      } catch (e) {
        // Fallback if HeadObject fails (e.g., permissions)
        console.warn("HeadObject failed, returning URL only", e);
        return NextResponse.json({
          files: [{
            key: keyParam,
            url: signedUrl,
            size: null,
            lastModified: null,
          }],
        });
      }
    }

    // --- CASE 2: List All Files & Filter by Type ---
    
    // 1. Get the list of allowed extensions for the requested type
    // If type is 'all' or unknown, we don't filter strict extensions, we allow everything.
    const allowedExts = ALLOWED_EXTENSIONS[typeParam];

    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME!,
        // IMPORTANT: Only remove this prefix if your files are NOT in an "uploads/" folder
        Prefix: "uploads/", 
      })
    );

    const files = await Promise.all(
      (list.Contents || [])
        .filter((item) => {
          // A. Filter out folders
          if (!item.Key || item.Key.endsWith("/")) return false;

          // B. Strict Type Filtering
          // If a specific type (audio/video/image) is requested, enforce extensions.
          if (allowedExts) {
            const ext = item.Key.split('.').pop()?.toLowerCase();
            if (!ext || !allowedExts.includes(ext)) {
              return false; // Skip if extension doesn't match
            }
          }
          return true;
        })
        .map(async (item) => {
          // Generate Signed URL for each item
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: item.Key!,
            }),
            { expiresIn: 3600 }
          );

          return {
            key: item.Key,
            url: signedUrl,
            size: item.Size ?? null,
            lastModified: item.LastModified ? item.LastModified.toISOString() : null,
          };
        })
    );

    return NextResponse.json({ files });

  } catch (err) {
    console.error('FILES API ERROR:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}