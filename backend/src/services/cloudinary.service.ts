import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary";

export class CloudinaryService {
  static isConfigured(): boolean {
    return isCloudinaryConfigured;
  }

  static async uploadImageIfConfigured(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<string | undefined> {
    if (!isCloudinaryConfigured) return undefined;
    return this.uploadImage(fileBuffer, folder);
  }

  static async uploadImage(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<string> {
    if (!isCloudinaryConfigured) {
      throw new Error("Image storage is not configured.");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `herbiva/${folder}`,
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result.secure_url);
          reject(new Error("Upload failed with no result"));
        },
      );
      uploadStream.end(fileBuffer);
    });
  }
}
