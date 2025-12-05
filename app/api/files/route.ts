import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const keyParam = url.searchParams.get('key');
    const typeParam = url.searchParams.get('type'); // 'video', 'image', etc.

    // If a specific key is provided, fetch only that file
    if (keyParam) {
      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: keyParam,
        }),
        { expiresIn: 3600 }
      );

      // Get object metadata to include lastModified
      try {
        const headRes = await s3.send({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: keyParam,
        } as any);
        const lastModified = (headRes as any).LastModified ? new Date((headRes as any).LastModified).toISOString() : null;

        return NextResponse.json({
          files: [{
            key: keyParam,
            url: signedUrl,
            size: (headRes as any).ContentLength ?? null,
            lastModified,
          }],
        });
      } catch (e) {
        // If head fails, still return the file with signed URL
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

    // Otherwise, list all files with prefix
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Prefix: "uploads/",
      })
    );

    const files = await Promise.all(
      (list.Contents || [])
        .filter((item) => {
          if (!typeParam) return true; // No filter, return all
          const key = item.Key?.toLowerCase() || '';
          if (typeParam === 'video') {
            return /\.(mp4|webm|mov|avi|mkv|flv|wmv)$/i.test(key);
          }
          if (typeParam === 'image') {
            return /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff)$/i.test(key);
          }
          return true;
        })
        .map(async (item) => {
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
