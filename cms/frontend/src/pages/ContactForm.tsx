import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentForm from '../components/ContentForm';
import type { FormField } from '../components/ContentForm';
import type { Contact } from '../services/content.service';
import { getContact, updateContact } from '../services/content.service';

const contactFields: FormField<Contact>[] = [
  {
    name: 'contactInfo.email',
    label: 'Email Address',
    type: 'text',
    placeholder: 'contact@example.com',
    helpText: 'Primary contact email address',
  },
  {
    name: 'contactInfo.phone',
    label: 'Phone Number',
    type: 'text',
    placeholder: '+1 (555) 123-4567',
    helpText: 'Primary contact phone number',
  },
  {
    name: 'contactInfo.address',
    label: 'Address',
    type: 'textarea',
    placeholder: 'Enter full address',
    helpText: 'Physical address or office location',
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

export default function ContactForm() {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<Contact> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getContact();
      setInitialData(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || 'Failed to load contact page';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Contact) => {
    await updateContact(data);
  };

  const handleCancel = () => {
    navigate('/dashboard/contact');
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
    <ContentForm<Contact>
      fields={contactFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={true}
      title="Contact Page"
      contentType="contact"
    />
  );
}
