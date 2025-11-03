// src/lib/s3.ts (or wherever you keep your S3 utilities)
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION_NAME,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export const deleteFileFromS3 = async (bucket: string, key: string) => {
    try {
        const deleteParams = {
            Bucket: bucket,
            Key: key,
        };
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
    } catch (error) {
        throw error; 
    }
};