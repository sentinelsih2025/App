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

export async function GET() {
  try {
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Prefix: "uploads/",
      })
    );

    const files = await Promise.all(
      (list.Contents || []).map(async (item) => {
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
