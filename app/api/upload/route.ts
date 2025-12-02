import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

// NOTE: we defer creating the S3 client until we validate required env vars
function createS3Client() {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

  if (!AWS_REGION) throw new Error("Missing AWS_REGION env var (server-side)");

  // If both keys are present create credentials explicitly, otherwise let the SDK use
  // the default provider chain (helpful during local dev with profiles or EC2/ECS roles).
  const clientConfig: any = { region: AWS_REGION };

  if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
  }

  return new S3Client(clientConfig);
}

export async function POST(req: Request) {
  try {
    // validate server-side env early and provide a helpful message
    if (!process.env.AWS_BUCKET_NAME) {
      console.error("Missing AWS_BUCKET_NAME environment variable");
      return NextResponse.json({ error: "Server misconfiguration: AWS_BUCKET_NAME is not set" }, { status: 500 });
    }

    const s3 = createS3Client();
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key = `uploads/${file.name}`;

    const putResult = await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // The result may contain useful metadata; log the key and confirmation
    console.log(`Upload successful — Bucket=${process.env.AWS_BUCKET_NAME}, Key=${key}`);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      url: fileUrl,
      key: key  // <-- THIS NEW LINE RETURNS THE S3 KEY
    });

  } catch (err) {
    // capture and surface the underlying error message (avoid printing secrets)
    console.error("UPLOAD ERROR:", err instanceof Error ? err.message : err);

    const message = err instanceof Error ? err.message : String(err);
    // return a human-friendly error message to the client (do not leak credentials or full stack)
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}

// Diagnostic route — quick check to confirm SDK can reach the bucket and
// the credentials have basic permissions. Use this from the server (dev)
// or call it from the browser (it will return concise error messages).
export async function GET() {
  try {
    if (!process.env.AWS_BUCKET_NAME) {
      console.error("Missing AWS_BUCKET_NAME environment variable");
      return NextResponse.json({ ok: false, error: "Server misconfiguration: AWS_BUCKET_NAME not set" }, { status: 500 });
    }

    const s3 = createS3Client();

    // HeadBucket is a lightweight check that tests whether the bucket exists
    // and whether the credentials allow access.
    await s3.send(new HeadBucketCommand({ Bucket: process.env.AWS_BUCKET_NAME }));

    return NextResponse.json({ ok: true, bucket: process.env.AWS_BUCKET_NAME });
  } catch (err: unknown) {
    // Log the full error to the server console in development to aid debugging
    // (we keep logs server-side to avoid leaking credentials to clients)
    console.error("S3 DIAGNOSTIC ERROR:", err);

    // Try to surface helpful non-sensitive fields back to the client
    const message = err instanceof Error ? err.message : String(err);
    const name = (err as any)?.name ?? null;
    // AWS SDK errors sometimes include a Code string and $metadata.httpStatusCode
    const awsCode = (err as any)?.Code ?? (err as any)?.name ?? null;
    const httpStatus = (err as any)?.$metadata?.httpStatusCode ?? null;

    return NextResponse.json({ ok: false, error: message, errorName: name, awsCode, httpStatus }, { status: 500 });
  }
}
