import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION_NAME!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Function to upload a file to S3
export const uploadToS3 = async (file: File, folder: string = "uploads"): Promise<string> => {
  if (!file) throw new Error("No file provided for upload.");

  const buffer = await file.arrayBuffer();
  // const filename = `${folder}/${Date.now()}_${file.name.replace(/ /g, "_")}`;
  const filename = `${folder}/${file.name.replace(/ /g, "_")}`;
  const bucketName = process.env.AWS_STORAGE_BUCKET_NAME!;
  
  try {
    // Send the PutObjectCommand with the params object
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
    }));

    // Return the public URL of the uploaded file
    return `https://${bucketName}.s3.${process.env.AWS_S3_REGION_NAME}.amazonaws.com/${filename}`;
  } catch (error: any) {
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};












