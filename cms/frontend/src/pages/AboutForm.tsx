import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { About } from '../services/content.service';
import { getAbout, updateAbout } from '../services/content.service';
import PreviewModal from '../components/PreviewModal';

export default function AboutForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
  } = useForm<About>({
    defaultValues: {
      allowLightHeading: '',
      allowUsHeading: '',
      allowRightHeading: '',
      paragraph: '',
      anchorLinks: [],
      sections: [],
      seoTitle: '',
      seoDescription: '',
    },
  });

  const { fields: anchorFields, append: appendAnchor, remove: removeAnchor } = useFieldArray({
    control,
    name: 'anchorLinks',
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: 'sections',
  });

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAbout();
      if (response.data) {
        reset(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load About page';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: About) => {
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      await updateAbout(data);
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/dashboard/about');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to save About page';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/about');
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit About Page</h2>

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
                  <p className="text-sm font-medium text-green-800">About page updated successfully!</p>
                </div>
              </div>
            </div>
          )}

          {error && (
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
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Headings */}
            <div>
              <label htmlFor="allowLightHeading" className="block text-sm font-medium text-gray-700">
                Allow Light Heading
              </label>
              <input
                id="allowLightHeading"
                type="text"
                {...register('allowLightHeading')}
                placeholder="Enter heading"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="allowUsHeading" className="block text-sm font-medium text-gray-700">
                Allow Us Heading
              </label>
              <input
                id="allowUsHeading"
                type="text"
                {...register('allowUsHeading')}
                placeholder="Enter heading"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="allowRightHeading" className="block text-sm font-medium text-gray-700">
                Allow Right Heading
              </label>
              <input
                id="allowRightHeading"
                type="text"
                {...register('allowRightHeading')}
                placeholder="Enter heading"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Paragraph */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paragraph
              </label>
              <Controller
                name="paragraph"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactQuill
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={quillModules}
                    className="bg-white"
                  />
                )}
              />
            </div>

            {/* Anchor Links */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Anchor Links</h3>
                <button
                  type="button"
                  onClick={() => appendAnchor({ label: '', targetId: '' })}
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {anchorFields.map((anchor, index) => (
                  <div key={anchor.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register(`anchorLinks.${index}.label` as const)}
                        placeholder="Link label"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register(`anchorLinks.${index}.targetId` as const)}
                        placeholder="Target ID"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAnchor(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                <button
                  type="button"
                  onClick={() => appendSection({ sectionId: '', title: '', body: '' })}
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sectionFields.map((section, index) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium text-gray-900">Section {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Section ID
                        </label>
                        <input
                          type="text"
                          {...register(`sections.${index}.sectionId` as const)}
                          placeholder="section-id"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          {...register(`sections.${index}.title` as const)}
                          placeholder="Section title"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Body
                        </label>
                        <textarea
                          rows={3}
                          {...register(`sections.${index}.body` as const)}
                          placeholder="Section content"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Fields */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                    SEO Title
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    {...register('seoTitle', {
                      maxLength: {
                        value: 60,
                        message: 'SEO Title must be less than 60 characters',
                      },
                    })}
                    maxLength={60}
                    placeholder="SEO optimized title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {(watch('seoTitle')?.length || 0)} / 60 characters (recommended: 50-60)
                  </p>
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={3}
                    {...register('seoDescription', {
                      maxLength: {
                        value: 160,
                        message: 'SEO Description must be less than 160 characters',
                      },
                    })}
                    maxLength={160}
                    placeholder="SEO optimized description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {(watch('seoDescription')?.length || 0)} / 160 characters (recommended: 150-160)
                  </p>
                </div>
              </div>
            </div>

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
                  onClick={handleCancel}
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
                  {isSubmitting ? 'Saving...' : 'Update About Page'}
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
        title="About Page"
        contentType="about"
        data={getValues()}
      />
    </div>
  );
}
