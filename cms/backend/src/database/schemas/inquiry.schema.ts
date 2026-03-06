import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions } from './base.schema';

/**
 * Contact inquiry interface
 */
export interface IInquiry extends Document, BaseSchemaFields {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  service: string;
  message: string;
  htmlContent: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes?: string;
}

/**
 * Contact inquiry schema definition
 */
const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      maxlength: [50, 'Phone cannot exceed 50 characters'],
    },
    countryCode: {
      type: String,
      trim: true,
      default: '+1',
    },
    service: {
      type: String,
      trim: true,
      default: 'General',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    htmlContent: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  baseSchemaOptions
);

/**
 * Inquiry model
 */
export const Inquiry = model<IInquiry>('Inquiry', inquirySchema);