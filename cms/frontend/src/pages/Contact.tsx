import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contact Page</h1>
        <button
          onClick={() => navigate('/dashboard/contact/edit')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Contact Page
        </button>
      </div>
      <p className="mt-4 text-gray-600">Manage contact page content here.</p>
    </div>
  );
}
