import { useForm, Controller } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';
import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ImageUploader from './ImageUploader';
import PreviewModal from './PreviewModal';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'checkbox' | 'image' | 'images' | 'array' | 'object';
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  helpText?: string;
  arrayFields?: FormField<any>[];
  objectFields?: FormField<any>[];
  defaultValue?: any;
}

export interface ContentFormProps<T extends FieldValues> {
  fields: FormField<T>[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
  title: string;
  contentType: 'project' | 'service' | 'faq' | 'about' | 'contact';
}

export default function ContentForm<T extends FieldValues>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
  title,
  contentType,
}: ContentFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm<T>({
    defaultValues: initialData as any,
  });

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];

  const handleFormSubmit = async (data: T) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      
      // Show success message briefly then redirect
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to save content';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const renderField = (field: FormField<T>) => {
    const error = errors[field.name];
    const errorMessage = error?.message as string | undefined;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name as string}>
            <label htmlFor={field.name as string} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={field.name as string}
              type="text"
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                maxLength: field.maxLength
                  ? {
                      value: field.maxLength,
                      message: `${field.label} must be less than ${field.maxLength} characters`,
                    }
                  : undefined,
              })}
              placeholder={field.placeholder}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {field.maxLength && (
              <p className="mt-1 text-xs text-gray-500">
                {watch(field.name)?.toString().length || 0} / {field.maxLength} characters
              </p>
            )}
            {field.helpText && <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>}
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name as string}>
            <label htmlFor={field.name as string} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.name as string}
              rows={4}
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                maxLength: field.maxLength
                  ? {
                      value: field.maxLength,
                      message: `${field.label} must be less than ${field.maxLength} characters`,
                    }
                  : undefined,
              })}
              placeholder={field.placeholder}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {field.maxLength && (
              <p className="mt-1 text-xs text-gray-500">
                {watch(field.name)?.toString().length || 0} / {field.maxLength} characters
              </p>
            )}
            {field.helpText && <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>}
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          </div>
        );

      case 'richtext':
        return (
          <div key={field.name as string}>
            <label htmlFor={field.name as string} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Controller
              name={field.name}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  theme="snow"
                  value={value || ''}
                  onChange={onChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder={field.placeholder}
                  className="mt-1 bg-white"
                />
              )}
            />
            {field.helpText && <p className="mt-2 text-xs text-gray-500">{field.helpText}</p>}
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name as string} className="flex items-center">
            <input
              id={field.name as string}
              type="checkbox"
              {...register(field.name)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name as string} className="ml-2 block text-sm text-gray-900">
              {field.label}
            </label>
            {field.helpText && <p className="ml-2 text-xs text-gray-500">{field.helpText}</p>}
          </div>
        );

      case 'image':
        return (
          <div key={field.name as string}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Controller
              name={field.name}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: { onChange, value } }) => (
                <ImageUploader
                  multiple={false}
                  initialImages={value ? [value] : []}
                  onUploadComplete={(images) => {
                    if (images.length > 0) {
                      onChange({
                        url: images[0].url,
                        darkModeUrl: images[0].cdnUrl || images[0].cloudFrontUrl,
                      });
                    }
                  }}
                />
              )}
            />
            {field.helpText && <p className="mt-2 text-xs text-gray-500">{field.helpText}</p>}
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          </div>
        );

      case 'images':
        return (
          <div key={field.name as string}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Controller
              name={field.name}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: { onChange, value } }) => (
                <ImageUploader
                  multiple={true}
                  initialImages={value || []}
                  onUploadComplete={(images) => {
                    const imageData = images.map((img) => ({
                      url: img.url,
                      alt: '',
                      width: img.width,
                      height: img.height,
                    }));
                    onChange(imageData);
                  }}
                />
              )}
            />
            {field.helpText && <p className="mt-2 text-xs text-gray-500">{field.helpText}</p>}
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? `Edit ${title}` : `Create ${title}`}
          </h2>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {isEditMode ? 'Content updated successfully!' : 'Content created successfully!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
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
                  <p className="text-sm font-medium text-red-800">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {fields.map((field) => renderField(field))}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isSubmitting}
                className="px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Preview
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        contentType={contentType}
        data={getValues()}
      />
    </div>
  );
}
