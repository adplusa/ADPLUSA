import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  key: string;
  url: string;
  cloudFrontUrl?: string;
  cdnUrl: string; // The URL to use in frontend (CloudFront if available, otherwise S3)
  contentType: string;
  size: number;
  width: number;
  height: number;
  folder: string;
  originalName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudFrontUrl: {
      type: String,
    },
    cdnUrl: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    folder: {
      type: String,
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Image = mongoose.model<IImage>('Image', ImageSchema);
