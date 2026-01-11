import { Request, Response } from 'express';
import {
  generatePresignedUploadUrl,
  generateMultiplePresignedUploadUrls,
  isS3Configured,
} from '../utils/s3';

/**
 * Generate presigned URL for single file upload
 * POST /api/admin/presigned-upload
 */
export const getPresignedUploadUrl = async (req: Request, res: Response) => {
  try {
    if (!isS3Configured()) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'S3_NOT_CONFIGURED',
          message: 'S3 storage is not properly configured',
        },
      });
    }

    const { fileName, contentType, folder = 'uploads' } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'fileName and contentType are required',
        },
      });
    }

    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CONTENT_TYPE',
          message: 'Only image files are allowed',
        },
      });
    }

    const presignedData = await generatePresignedUploadUrl(folder, fileName, contentType);

    res.json({
      success: true,
      data: presignedData,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PRESIGNED_URL_ERROR',
        message: 'Failed to generate presigned URL',
      },
    });
  }
};

/**
 * Generate presigned URLs for multiple file uploads
 * POST /api/admin/presigned-upload/batch
 */
export const getPresignedUploadUrls = async (req: Request, res: Response) => {
  try {
    if (!isS3Configured()) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'S3_NOT_CONFIGURED',
          message: 'S3 storage is not properly configured',
        },
      });
    }

    const { files, folder = 'uploads' } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'files array is required',
        },
      });
    }

    // Validate all files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (!file.fileName || !file.contentType) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_DATA',
            message: 'Each file must have fileName and contentType',
          },
        });
      }
      if (!allowedTypes.includes(file.contentType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CONTENT_TYPE',
            message: `Invalid content type: ${file.contentType}`,
          },
        });
      }
    }

    const presignedUrls = await generateMultiplePresignedUploadUrls(folder, files);

    res.json({
      success: true,
      data: presignedUrls,
    });
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PRESIGNED_URL_ERROR',
        message: 'Failed to generate presigned URLs',
      },
    });
  }
};
