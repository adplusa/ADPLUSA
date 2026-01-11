import { Schema, model, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  filename: string;
  originalName: string;
  s3Path: string;
  s3Url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  tags: Schema.Types.ObjectId[];
  uploadedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  s3Path: {
    type: String,
    required: true,
    unique: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  alt: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for search
mediaSchema.index({ title: 'text', alt: 'text', description: 'text' });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ mimeType: 1 });

export const Media = model<IMedia>('Media', mediaSchema);