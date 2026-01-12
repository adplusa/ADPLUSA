import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadImage, deleteImage } from '../services/image.service';

export interface UploadedImage {
  id?: string;
  url: string;
  cloudFrontUrl?: string;
  cdnUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  contentType?: string;
  file?: File;
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  fileName?: string;
}

export interface UploadError {
  file: File;
  message: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'NETWORK_ERROR' | 'SERVER_ERROR';
  retryable: boolean;
}

export interface ImageUploaderProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  folder?: string;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onUploadError?: (error: UploadError) => void;
  onImagesReorder?: (images: UploadedImage[]) => void;
  onImageRemove?: (image: UploadedImage) => void;
  initialImages?: UploadedImage[];
  disabled?: boolean;
  enableDragDrop?: boolean;
  showDimensions?: boolean;
  confirmBeforeRemove?: boolean;
}

interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: UploadedImage;
  error?: string;
  retryCount: number;
  preview: string;
}

interface ValidationError {
  file: File;
  message: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE';
}

// Default accepted image types
const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export default function ImageUploader({
  multiple = false,
  maxFiles = 10,
  maxSizeInMB = 5,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  folder = 'general',
  onUploadComplete,
  onUploadError,
  onImagesReorder,
  onImageRemove,
  initialImages = [],
  disabled = false,
  enableDragDrop = true,
  showDimensions = true,
  confirmBeforeRemove = true,
}: ImageUploaderProps) {
  // @ts-ignore - folder parameter reserved for future use
  const _folder = folder;

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    initialImages.map(img => ({ ...img, status: 'success' as const }))
  );
  const [fileUploads, setFileUploads] = useState<Map<string, FileUploadState>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [isValidDrop, setIsValidDrop] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<UploadedImage | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  // Announce status changes to screen readers
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  // Validate a single file before upload
  const validateFile = useCallback((file: File): ValidationError | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return {
        file,
        message: `${file.name} is not a supported image type. Accepted types: ${acceptedTypes.map(t => t.replace('image/', '')).join(', ')}`,
        code: 'INVALID_TYPE',
      };
    }

    // Check file size
    if (file.size > maxSizeInBytes) {
      return {
        file,
        message: `${file.name} exceeds the ${maxSizeInMB}MB size limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        code: 'FILE_TOO_LARGE',
      };
    }

    return null;
  }, [acceptedTypes, maxSizeInBytes, maxSizeInMB]);

  // Validate all files before upload
  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: ValidationError[] } => {
    const valid: File[] = [];
    const errors: ValidationError[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  }, [validateFile]);

  // Upload a single file with progress tracking
  const uploadSingleFile = useCallback(async (fileState: FileUploadState): Promise<UploadedImage | null> => {
    const { file } = fileState;
    const fileKey = `${file.name}-${file.lastModified}`;

    try {
      // Update status to uploading
      setFileUploads(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(fileKey);
        if (current) {
          newMap.set(fileKey, { ...current, status: 'uploading', progress: 0 });
        }
        return newMap;
      });

      announce(`Uploading ${file.name}`);

      // Simulate progress (since axios doesn't provide real progress for this endpoint)
      const progressInterval = setInterval(() => {
        setFileUploads(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(fileKey);
          if (current && current.progress < 90) {
            newMap.set(fileKey, { ...current, progress: current.progress + 10 });
          }
          return newMap;
        });
      }, 100);

      const response = await uploadImage(file);

      clearInterval(progressInterval);

      const uploadedImage: UploadedImage = {
        id: response.data.id || response.data._id || '',
        url: response.data.url,
        cloudFrontUrl: response.data.cloudFrontUrl,
        cdnUrl: response.data.cdnUrl,
        width: response.data.width,
        height: response.data.height,
        size: response.data.size,
        contentType: response.data.contentType,
        file,
        status: 'success',
        fileName: file.name,
      };

      // Update to success
      setFileUploads(prev => {
        const newMap = new Map(prev);
        newMap.set(fileKey, { ...fileState, status: 'success', progress: 100, result: uploadedImage });
        return newMap;
      });

      announce(`${file.name} uploaded successfully`);

      return uploadedImage;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to upload image';

      // Update to error
      setFileUploads(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(fileKey);
        if (current) {
          newMap.set(fileKey, { ...current, status: 'error', error: errorMessage });
        }
        return newMap;
      });

      announce(`Failed to upload ${file.name}: ${errorMessage}`);

      if (onUploadError) {
        onUploadError({
          file,
          message: errorMessage,
          code: err.response ? 'SERVER_ERROR' : 'NETWORK_ERROR',
          retryable: true,
        });
      }

      return null;
    }
  }, [announce, onUploadError]);

  // Retry a failed upload
  const retryUpload = useCallback(async (fileKey: string) => {
    const fileState = fileUploads.get(fileKey);
    if (!fileState) return;

    const result = await uploadSingleFile({
      ...fileState,
      retryCount: fileState.retryCount + 1,
    });

    if (result) {
      setUploadedImages(prev => [...prev, result]);

      // Remove from fileUploads after delay
      setTimeout(() => {
        setFileUploads(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileKey);
          return newMap;
        });
      }, 1000);

      if (onUploadComplete) {
        onUploadComplete([result]);
      }
    }
  }, [fileUploads, uploadSingleFile, onUploadComplete]);

  // Handle files from input or drop
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check max files limit
    if (!multiple && fileArray.length > 1) {
      setValidationErrors([{
        file: fileArray[0],
        message: 'Only one file can be uploaded at a time',
        code: 'INVALID_TYPE',
      }]);
      return;
    }

    const totalFiles = uploadedImages.length + fileUploads.size + fileArray.length;
    if (totalFiles > maxFiles) {
      setValidationErrors([{
        file: fileArray[0],
        message: `Maximum ${maxFiles} files allowed. You have ${uploadedImages.length} uploaded and are trying to add ${fileArray.length} more.`,
        code: 'INVALID_TYPE',
      }]);
      return;
    }

    // Validate all files
    const { valid, errors } = validateFiles(fileArray);

    if (errors.length > 0) {
      setValidationErrors(errors);
      announce(`${errors.length} file(s) failed validation`);
    }

    if (valid.length === 0) return;

    setValidationErrors([]);

    // Create file upload states with previews
    const newFileUploads = new Map(fileUploads);
    valid.forEach(file => {
      const fileKey = `${file.name}-${file.lastModified}`;
      newFileUploads.set(fileKey, {
        file,
        progress: 0,
        status: 'pending',
        retryCount: 0,
        preview: URL.createObjectURL(file),
      });
    });
    setFileUploads(newFileUploads);

    // Upload files
    const uploadPromises = valid.map(file => {
      const fileKey = `${file.name}-${file.lastModified}`;
      const fileState = newFileUploads.get(fileKey)!;
      return uploadSingleFile(fileState);
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is UploadedImage => r !== null);

    if (successfulUploads.length > 0) {
      setUploadedImages(prev => [...prev, ...successfulUploads]);

      // Clean up successful uploads from fileUploads after delay
      setTimeout(() => {
        setFileUploads(prev => {
          const newMap = new Map(prev);
          successfulUploads.forEach(img => {
            if (img.file) {
              const key = `${img.file.name}-${img.file.lastModified}`;
              const state = newMap.get(key);
              if (state) {
                URL.revokeObjectURL(state.preview);
                newMap.delete(key);
              }
            }
          });
          return newMap;
        });
      }, 1000);

      if (onUploadComplete) {
        onUploadComplete(successfulUploads);
      }
    }
  }, [multiple, maxFiles, uploadedImages.length, fileUploads, validateFiles, uploadSingleFile, onUploadComplete, announce]);

  // Drag and drop handlers for file upload
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && enableDragDrop) {
      setIsDragging(true);
      // Check if dragged items are valid
      const items = e.dataTransfer.items;
      let valid = true;
      for (let i = 0; i < items.length; i++) {
        if (!items[i].type.startsWith('image/')) {
          valid = false;
          break;
        }
      }
      setIsValidDrop(valid);
    }
  }, [disabled, enableDragDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsValidDrop(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsValidDrop(true);

    if (disabled || !enableDragDrop) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [disabled, enableDragDrop, handleFiles]);

  // Image reorder drag and drop handlers
  const handleImageDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...uploadedImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setUploadedImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);

    announce(`Image moved from position ${draggedIndex + 1} to position ${dropIndex + 1}`);

    if (onImagesReorder) {
      onImagesReorder(newImages);
    }
  }, [draggedIndex, uploadedImages, announce, onImagesReorder]);

  // File input handlers
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Remove handlers
  const handleRemoveUploaded = useCallback(async (image: UploadedImage) => {
    if (confirmBeforeRemove) {
      setDeleteConfirmImage(image);
      return;
    }

    await performDelete(image);
  }, [confirmBeforeRemove]);

  const performDelete = useCallback(async (image: UploadedImage) => {
    try {
      if (image.id) {
        await deleteImage(image.id);
      }
      setUploadedImages(prev => prev.filter(img => img.id !== image.id || img.url !== image.url));
      announce(`Image removed`);

      if (onImageRemove) {
        onImageRemove(image);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to delete image';
      setValidationErrors([{
        file: new File([], image.fileName || 'image'),
        message: errorMessage,
        code: 'INVALID_TYPE',
      }]);
    }
    setDeleteConfirmImage(null);
  }, [announce, onImageRemove]);

  const handleRemoveFileUpload = useCallback((fileKey: string) => {
    setFileUploads(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(fileKey);
      if (state) {
        URL.revokeObjectURL(state.preview);
        newMap.delete(fileKey);
      }
      return newMap;
    });
  }, []);

  // Preview modal handlers
  const handleImageClick = useCallback((image: UploadedImage) => {
    setPreviewImage(image);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  // Copy URL to clipboard
  const handleCopyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    announce('URL copied to clipboard');
  }, [announce]);

  // Get display URL
  const getDisplayUrl = useCallback((image: UploadedImage): string => {
    return image.cdnUrl || image.cloudFrontUrl || image.url;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }, []);

  // Keyboard handler for preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewImage) {
          handleClosePreview();
        }
        if (deleteConfirmImage) {
          setDeleteConfirmImage(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewImage, deleteConfirmImage, handleClosePreview]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      fileUploads.forEach(state => {
        URL.revokeObjectURL(state.preview);
      });
    };
  }, []);

  const isUploading = Array.from(fileUploads.values()).some(f => f.status === 'uploading');

  return (
    <div className="space-y-4">
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
          ? isValidDrop
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!disabled ? handleBrowseClick : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
        aria-label={`Upload ${multiple ? 'images' : 'an image'}. ${isDragging ? (isValidDrop ? 'Drop to upload' : 'Invalid file type') : 'Click or drag and drop'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />

        <div className="text-center">
          <svg
            className={`mx-auto h-12 w-12 ${isDragging && !isValidDrop ? 'text-red-400' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600 justify-center">
            <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              Upload {multiple ? 'files' : 'a file'}
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {acceptedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ')} up to {maxSizeInMB}MB
            {multiple && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4" role="alert" aria-live="assertive">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {validationErrors.length === 1 ? 'Validation Error' : `${validationErrors.length} Validation Errors`}
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setValidationErrors([])}
                className="inline-flex text-red-400 hover:text-red-500"
                aria-label="Dismiss validation errors"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files being uploaded */}
      {fileUploads.size > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {isUploading ? 'Uploading...' : 'Upload Queue'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from(fileUploads.entries()).map(([fileKey, fileState]) => (
              <div key={fileKey} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={fileState.preview}
                    alt={`Preview of ${fileState.file.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Progress bar */}
                {(fileState.status === 'uploading' || fileState.status === 'pending') && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 p-2"
                    role="progressbar"
                    aria-valuenow={fileState.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Upload progress for ${fileState.file.name}`}
                  >
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileState.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-white mt-1 text-center" aria-hidden="true">
                      {fileState.progress}%
                    </p>
                  </div>
                )}

                {/* Success indicator */}
                {fileState.status === 'success' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-600 bg-opacity-90 p-2">
                    <p className="text-xs text-white text-center flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Uploaded
                    </p>
                  </div>
                )}

                {/* Error state with retry */}
                {fileState.status === 'error' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-600 bg-opacity-90 p-2">
                    <p className="text-xs text-white text-center truncate" title={fileState.error}>
                      {fileState.error}
                    </p>
                    <button
                      onClick={() => retryUpload(fileKey)}
                      className="mt-1 w-full text-xs bg-white text-red-600 rounded px-2 py-1 hover:bg-gray-100 transition-colors"
                      aria-label={`Retry upload for ${fileState.file.name}`}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Remove button */}
                {fileState.status !== 'uploading' && (
                  <button
                    onClick={() => handleRemoveFileUpload(fileKey)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label={`Remove ${fileState.file.name} from upload queue`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded images with reorder support */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div
                key={image.id || index}
                className={`relative group ${draggedIndex === index ? 'opacity-50' : ''
                  } ${dragOverIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
                draggable={multiple}
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                <div
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick(image);
                    }
                  }}
                  aria-label={`View larger preview of image ${index + 1}${image.width && image.height ? `, ${image.width}x${image.height} pixels` : ''}`}
                >
                  <img
                    src={getDisplayUrl(image)}
                    alt={image.fileName || `Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image info */}
                {showDimensions && (
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {image.width && image.height && (
                      <span>{image.width}x{image.height}</span>
                    )}
                    {image.size && (
                      <span className="ml-2">{formatFileSize(image.size)}</span>
                    )}
                  </div>
                )}

                {/* URL display with copy */}
                <div className="mt-1">
                  <input
                    type="text"
                    value={getDisplayUrl(image)}
                    readOnly
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.select();
                      handleCopyUrl(getDisplayUrl(image));
                    }}
                    aria-label={`Image URL. Click to copy.`}
                  />
                </div>

                {/* Drag handle indicator */}
                {multiple && (
                  <div
                    className="absolute top-2 left-2 p-1 bg-gray-800 bg-opacity-50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                    aria-label="Drag to reorder"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                    </svg>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveUploaded(image);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  disabled={isUploading}
                  aria-label={`Remove image ${index + 1}`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={handleClosePreview}
            aria-hidden="true"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 id="preview-modal-title" className="text-lg font-semibold text-gray-900">
                    Image Preview
                  </h2>
                  {showDimensions && previewImage.width && previewImage.height && (
                    <p className="text-sm text-gray-500">
                      {previewImage.width} × {previewImage.height} • {formatFileSize(previewImage.size)}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close preview"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="p-6 flex items-center justify-center bg-gray-100">
                <img
                  src={getDisplayUrl(previewImage)}
                  alt={previewImage.fileName || 'Preview image'}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={getDisplayUrl(previewImage)}
                      readOnly
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded bg-white text-gray-600"
                      onClick={(e) => e.currentTarget.select()}
                      aria-label="Image URL"
                    />
                  </div>
                  <button
                    onClick={() => handleCopyUrl(getDisplayUrl(previewImage))}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmImage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setDeleteConfirmImage(null)}
            aria-hidden="true"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 id="delete-dialog-title" className="text-lg font-medium text-gray-900">
                    Delete Image
                  </h3>
                  <p id="delete-dialog-description" className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this image? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmImage(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => performDelete(deleteConfirmImage)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
