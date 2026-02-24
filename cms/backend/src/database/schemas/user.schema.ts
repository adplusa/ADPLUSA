import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BaseSchemaFields, baseSchemaOptions } from './base.schema';

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

/**
 * User document interface
 */
export interface IUser extends Document, BaseSchemaFields {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EDITOR,
      required: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  baseSchemaOptions
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Pre-save middleware to ensure username and email uniqueness
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('username')) {
    const existingUser = await User.findOne({
      username: this.username,
      _id: { $ne: this._id },
    });

    if (existingUser) {
      throw new Error(`User with username "${this.username}" already exists`);
    }
  }

  if (this.isNew || this.isModified('email')) {
    const existingUser = await User.findOne({
      email: this.email,
      _id: { $ne: this._id },
    });

    if (existingUser) {
      throw new Error(`User with email "${this.email}" already exists`);
    }
  }

  next();
});

/**
 * User model
 */
export const User = model<IUser>('User', userSchema);
