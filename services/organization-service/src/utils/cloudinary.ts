// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Uploads a buffer to Cloudinary in the specified folder
 * @param buffer - The file buffer to upload
 * @param folder - Cloudinary folder path (default: "logos")
 * @returns A promise that resolves with the image URL
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = 'logos'
): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default cloudinary;
