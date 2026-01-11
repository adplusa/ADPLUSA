import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentForm from '../components/ContentForm';
import type { FormField } from '../components/ContentForm';
import type { Project } from '../services/project.service';
import { createProject, updateProject, getProjectBySlug } from '../services/project.service';

const projectFields: FormField<Project>[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter project title',
    helpText: 'The main title of the project',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'project-slug',
    helpText: 'URL-friendly identifier (e.g., "modern-apartment-design")',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter project description',
    helpText: 'Brief description of the project',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'e.g., Residential, Commercial, Interior',
    helpText: 'Project category or type',
  },
  {
    name: 'images',
    label: 'Project Images',
    type: 'images',
    helpText: 'Upload multiple images for the project gallery',
  },
  {
    name: 'featured',
    label: 'Featured Project',
    type: 'checkbox',
    helpText: 'Mark this project as featured on the homepage',
  },
  {
    name: 'link',
    label: 'External Link',
    type: 'text',
    placeholder: 'https://example.com',
    helpText: 'Optional external link for more information',
  },
  {
    name: 'seoTitle',
    label: 'SEO Title',
    type: 'text',
    maxLength: 60,
    placeholder: 'SEO optimized title',
    helpText: 'Title for search engines (recommended: 50-60 characters)',
  },
  {
    name: 'seoDescription',
    label: 'SEO Description',
    type: 'textarea',
    maxLength: 160,
    placeholder: 'SEO optimized description',
    helpText: 'Description for search engines (recommended: 150-160 characters)',
  },
];

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [initialData, setInitialData] = useState<Partial<Project> | undefined>(undefined);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadProject(id);
    }
  }, [id, isEditMode]);

  const loadProject = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectBySlug(slug);
      setInitialData(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || 'Failed to load project';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Project) => {
    if (isEditMode && initialData?._id) {
      await updateProject(initialData._id, data);
    } else {
      await createProject(data);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/projects');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
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
                onClick={handleCancel}
                className="inline-flex text-sm font-medium text-red-600 hover:text-red-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ContentForm<Project>
      fields={projectFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={isEditMode}
      title="Project"
      contentType="project"
    />
  );
}
