import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentList from '../components/ContentList';
import type { Column } from '../components/ContentList';
import { getServices, deleteService } from '../services/service.service';
import type { Service } from '../services/service.service';

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServices();
      setServices(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    navigate(`/dashboard/services/${service.slug}`);
  };

  const handleDelete = async (service: Service) => {
    if (!service._id) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteService(service._id);
      setSuccessMessage('Service deleted successfully');
      // Refresh the list after deletion
      fetchServices();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete service');
    }
  };

  const columns: Column<Service>[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'slug',
      label: 'Slug',
    },
    {
      key: 'description',
      label: 'Description',
      render: (service) => {
        const desc = service.description || '-';
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (service) =>
        service.createdAt
          ? new Date(service.createdAt).toLocaleDateString()
          : '-',
    },
  ];

  return (
    <ContentList
      title="Services"
      data={services}
      columns={columns}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onEdit={handleEdit}
      onDelete={handleDelete}
      createLink="/dashboard/services/new"
    />
  );
}
