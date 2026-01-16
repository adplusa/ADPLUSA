import { Request, Response } from 'express';
import { Media } from '../database/schemas/media.schema';
import { uploadImageToS3, deleteImageFromS3 } from '../utils/s3';
import { ApiResponse } from '../types/api.types';
import sharp from 'sharp';

// Get all media
export const getMedia = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, mimeType, tags } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (mimeType) {
      if (mimeType === 'image') {
        query.mimeType = { $regex: '^image/', $options: 'i' };
      } else {
        query.mimeType = { $regex: mimeType, $options: 'i' };
      }
    }

    if (tags) {
      const tagIds = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagIds };
    }

    const [media, total] = await Promise.all([
      Media.find(query)
        .populate('tags', 'name color')
        .populate('uploadedBy', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Media.countDocuments(query)
    ]);

    const response: ApiResponse<typeof media> = {
      success: true,
      data: media,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch media' }
    });
  }
};

// Get media by ID
export const getMediaById = async (req: Request, res: Response) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('tags', 'name color')
      .populate('uploadedBy', 'username');
    
    if (!media) {
      return res.status(404).json({
        success: false,
        error: { message: 'Media not found' }
      });
    }

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch media' }
    });
  }
};

// Upload media
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { title, alt, description, tags } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' }
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title is required' }
      });
    }

    let width, height;
    let processedBuffer = file.buffer;

    // Get image dimensions if it's an image
    if (file.mimetype.startsWith('image/')) {
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        // Optimize image
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          processedBuffer = await sharp(file.buffer)
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();
        } else if (file.mimetype === 'image/png') {
          processedBuffer = await sharp(file.buffer)
            .png({ compressionLevel: 8 })
            .toBuffer();
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    // Upload to S3
    const s3Result = await uploadImageToS3({
      buffer: processedBuffer,
      originalName: file.originalname,
      folder: 'media'
    });

    // Create media record
    const media = new Media({
      title,
      filename: s3Result.key.split('/').pop(),
      originalName: file.originalname,
      s3Path: s3Result.key,
      s3Url: s3Result.url,
      mimeType: file.mimetype,
      size: processedBuffer.length,
      width,
      height,
      alt,
      description,
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
      uploadedBy: (req as any).user?.id
    });

    await media.save();
    await media.populate('tags', 'name color');
    await media.populate('uploadedBy', 'username');

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to upload media' }
    });
  }
};

// Update media
export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { title, alt, description, tags } = req.body;

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        alt, 
        description, 
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : []
      },
      { new: true, runValidators: true }
    )
    .populate('tags', 'name color')
    .populate('uploadedBy', 'username');

    if (!media) {
      return res.status(404).json({
        success: false,
        error: { message: 'Media not found' }
      });
    }

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update media' }
    });
  }
};

// Delete media
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: { message: 'Media not found' }
      });
    }

    // Delete from S3
    try {
      await deleteImageFromS3(media.s3Path);
    } catch (error) {
      console.error('Error deleting from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    await Media.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete media' }
    });
  }
};