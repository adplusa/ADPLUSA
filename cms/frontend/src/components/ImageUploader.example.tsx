/**
 * ImageUploader Component - Usage Examples
 * 
 * This file demonstrates how to use the ImageUploader component
 * in different scenarios.
 */

import ImageUploader, { type UploadedImage, type UploadError } from './ImageUploader';

// Example 1: Single Image Upload
export function SingleImageUploadExample() {
  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('Uploaded image:', images[0]);
    // Use the image URL: images[0].url or images[0].cdnUrl
  };

  const handleUploadError = (error: UploadError) => {
    console.error('Upload error:', error.message);
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      <ImageUploader
        multiple={false}
        maxFiles={1}
        maxSizeInMB={2}
        folder="profiles"
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
}

// Example 2: Multiple Image Upload (Gallery)
export function MultipleImageUploadExample() {
  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('Uploaded images:', images);
    // Access all uploaded image URLs
    images.forEach((img) => {
      console.log('Image URL:', img.url);
      console.log('CDN URL:', img.cdnUrl);
      console.log('Dimensions:', img.width, 'x', img.height);
    });
  };

  return (
    <div>
      <h2>Upload Project Gallery</h2>
      <ImageUploader
        multiple={true}
        maxFiles={10}
        maxSizeInMB={5}
        folder="projects"
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

// Example 3: With Initial Images (Edit Mode)
export function EditModeExample() {
  const existingImages: UploadedImage[] = [
    {
      id: '123',
      url: 'https://example.com/image1.jpg',
      cdnUrl: 'https://cdn.example.com/image1.jpg',
      size: 245678,
      contentType: 'image/jpeg',
      width: 1920,
      height: 1080,
    },
  ];

  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('New images uploaded:', images);
  };

  return (
    <div>
      <h2>Edit Project Images</h2>
      <ImageUploader
        multiple={true}
        maxFiles={10}
        initialImages={existingImages}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

// Example 4: Disabled State
export function DisabledExample() {
  return (
    <div>
      <h2>Upload Disabled</h2>
      <ImageUploader
        disabled={true}
        multiple={false}
      />
    </div>
  );
}

// Example 5: Integration with React Hook Form
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface ProjectFormData {
  title: string;
  description: string;
  images: string[]; // Array of image URLs
}

export function FormIntegrationExample() {
  const { register, handleSubmit, setValue } = useForm<ProjectFormData>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadComplete = (images: UploadedImage[]) => {
    const urls = images.map((img) => img.cdnUrl || img.url);
    const allUrls = [...imageUrls, ...urls];
    setImageUrls(allUrls);
    setValue('images', allUrls);
  };

  const onSubmit = (data: ProjectFormData) => {
    console.log('Form data:', data);
    // Submit to API with image URLs
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <input {...register('title', { required: true })} />
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} />
      </div>

      <div>
        <label>Images</label>
        <ImageUploader
          multiple={true}
          maxFiles={5}
          folder="projects"
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <button type="submit">Save Project</button>
    </form>
  );
}
