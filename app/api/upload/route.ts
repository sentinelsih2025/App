import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: file.name,
    Body: buffer,
    ContentType: file.type,
  };

  await s3.send(new PutObjectCommand(params));

  return NextResponse.json({ message: "File uploaded successfully" });
}
