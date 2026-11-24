import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "demo-account-id";
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "demo-access-key";
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "demo-secret-key";
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "viper-ai-videos";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Generate a short-lived secure download URL (expires in 15 minutes)
 * for high-resolution video master files.
 */
export async function getSecureDownloadUrl(objectKey: string, fileName?: string): Promise<string> {
  // If R2 credentials are not configured in environment, provide safe mock signed link for demonstration
  if (accessKeyId === "demo-access-key" || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4?signed_demo=true&expires=900&token=vpr_sec_${Date.now()}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ResponseContentDisposition: fileName ? `attachment; filename="${fileName}"` : undefined,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}

/**
 * Generate a presigned upload URL for admin direct video uploads
 */
export async function getPresignedUploadUrl(objectKey: string, contentType: string): Promise<string> {
  if (accessKeyId === "demo-access-key" || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    return `https://storage.googleapis.com/upload-mock?token=vpr_mock_upload_${Date.now()}`;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 600 });
}
