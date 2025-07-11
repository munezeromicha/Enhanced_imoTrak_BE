"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = void 0;
// src/utils/cloudinary.ts
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const streamifier_1 = __importDefault(require("streamifier"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Uploads a buffer to Cloudinary in the specified folder
 * @param buffer - The file buffer to upload
 * @param folder - Cloudinary folder path (default: "logos")
 * @returns A promise that resolves with the image URL
 */
const uploadBufferToCloudinary = (buffer, folder = 'logos') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'image', folder }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve({ url: result.secure_url });
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.default = cloudinary_1.v2;
