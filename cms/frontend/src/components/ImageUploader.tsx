import { useState, useRef, useCallback } from 'react';
import { uploadImage, uploadMultipleImages, deleteImage } from '../services/image.service';

export interface UploadedImage {
  id: string;
  url: string;
  cloudFrontUrl?: string;
  cdnUrl?: string;
  width?: number;
  height?: number;
  size: number;
  contentType: string;
  file?: File;
}

export interface ImageUploaderProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSizeInMB?: number;
  folder?: string;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onUploadError?: (error: string) => void;
  initialImages?: UploadedImage[];
  disabled?: boolean;
}

interface UploadProgress {
  [key: string]: number;
}

export default function ImageUploader({
  multiple = false,
  maxFiles = 10,
  maxSizeInMB = 5,
  folder = 'general', // Reserved for future use
  onUploadComplete,
  onUploadError,
  initialImages = [],
  disabled = false,
}: ImageUploaderProps) {
  // @ts-ignore - folder parameter reserved for future use
  const _folder = folder;
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialImages);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not an image file`;
    }

    // Check file size
    if (file.size > maxSizeInBytes) {
      return `${file.name} exceeds ${maxSizeInMB}MB size limit`;
    }

    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check max files limit
      if (!multiple && fileArray.length > 1) {
        setError('Only one file can be uploaded at a time');
        return;
      }

      const totalFiles = uploadedImages.length + previewImages.length + fileArray.length;
      if (totalFiles > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate all files
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      // Create preview URLs
      const newPreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setPreviewImages((prev) => [...prev, ...newPreviews]);
      setError(null);

      // Auto-upload if enabled
      uploadFiles(validFiles);
    },
    [multiple, maxFiles, uploadedImages.length, previewImages.length]
  );

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      if (files.length === 1) {
        // Single file upload
        const file = files[0];
        const fileKey = file.name;

        // Simulate progress (since we don't have real progress from axios)
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[fileKey] || 0;
            if (current >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileKey]: current + 10 };
          });
        }, 100);

        const response = await uploadImage(file);

        clearInterval(progressInterval);
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 100 }));

        const uploadedImage: UploadedImage = {
          id: response.data.id || '',
          url: response.data.url,
          cloudFrontUrl: response.data.cloudFrontUrl,
          cdnUrl: response.data.cdnUrl,
          width: response.data.width,
          height: response.data.height,
          size: response.data.size,
          contentType: response.data.contentType,
          file,
        };

        setUploadedImages((prev) => [...prev, uploadedImage]);
        setPreviewImages((prev) => prev.filter((p) => p.file !== file));

        // Clean up progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileKey];
            return newProgress;
          });
        }, 1000);

        if (onUploadComplete) {
          onUploadComplete([uploadedImage]);
        }
      } else {
        // Multiple files upload
        const fileKeys = files.map((f) => f.name);

        // Simulate progress for all files
        fileKeys.forEach((key) => {
          setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
        });

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            let allComplete = true;
            fileKeys.forEach((key) => {
              const current = newProgress[key] || 0;
              if (current < 90) {
                newProgress[key] = current + 10;
                allComplete = false;
              }
            });
            if (allComplete) {
              clearInterval(progressInterval);
            }
            return newProgress;
          });
        }, 100);

        const response = await uploadMultipleImages(files);

        clearInterval(progressInterval);
        fileKeys.forEach((key) => {
          setUploadProgress((prev) => ({ ...prev, [key]: 100 }));
        });

        const uploadedImagesList: UploadedImage[] = response.data.map((img, index) => ({
          id: img.id || '',
          url: img.url,
          cloudFrontUrl: img.cloudFrontUrl,
          cdnUrl: img.cdnUrl,
          width: img.width,
          height: img.height,
          size: img.size,
          contentType: img.contentType,
          file: files[index],
        }));

        setUploadedImages((prev) => [...prev, ...uploadedImagesList]);
        setPreviewImages((prev) => prev.filter((p) => !files.includes(p.file)));

        // Clean up progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            fileKeys.forEach((key) => delete newProgress[key]);
            return newProgress;
          });
        }, 1000);

        if (onUploadComplete) {
          onUploadComplete(uploadedImagesList);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to upload image(s)';
      setError(errorMessage);
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      // Clear previews on error
      setPreviewImages([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveUploaded = async (image: UploadedImage) => {
    try {
      await deleteImage(image.id);
      setUploadedImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to delete image';
      setError(errorMessage);
    }
  };

  const handleRemovePreview = (preview: { file: File; preview: string }) => {
    URL.revokeObjectURL(preview.preview);
    setPreviewImages((prev) => prev.filter((p) => p !== preview));
  };

  const getDisplayUrl = (image: UploadedImage): string => {
    return image.cdnUrl || image.cloudFrontUrl || image.url;
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!disabled ? handleBrowseClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600">
            <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              Upload {multiple ? 'files' : 'a file'}
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF up to {maxSizeInMB}MB
            {multiple && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 hover:text-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Preview images (uploading) */}
      {previewImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewImages.map((preview, index) => {
              const progress = uploadProgress[preview.file.name] || 0;
              return (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={preview.preview}
                      alt={preview.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 p-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-white mt-1 text-center">{progress}%</p>
                  </div>
                  {/* Remove button */}
                  {!isUploading && (
                    <button
                      onClick={() => handleRemovePreview(preview)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.id || index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={getDisplayUrl(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Image info */}
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {image.width && image.height && (
                    <span>
                      {image.width}x{image.height}
                    </span>
                  )}
                  {image.size && (
                    <span className="ml-2">{(image.size / 1024).toFixed(1)}KB</span>
                  )}
                </div>
                {/* URL display */}
                <div className="mt-1">
                  <input
                    type="text"
                    value={getDisplayUrl(image)}
                    readOnly
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-600"
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveUploaded(image)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
    </div>
  );
}
