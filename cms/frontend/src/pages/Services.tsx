import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionsColumn } from '../components/ui/data-table';
import { Badge } from '../components/ui/badge';
import { getServices, deleteService } from '../services/service.service';
import type { Service } from '../services/service.service';

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async (search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServices();

      // Filter services based on search query
      let filteredServices = response.data;
      if (search) {
        filteredServices = response.data.filter(service =>
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description?.toLowerCase().includes(search.toLowerCase()) ||
          service.slug.toLowerCase().includes(search.toLowerCase())
        );
      }

      setServices(filteredServices);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(searchQuery);
  }, [searchQuery]);

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
      fetchServices(searchQuery);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete service');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateNew = () => {
    navigate('/dashboard/services/new');
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.getValue('slug')}
        </code>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        if (!description) return <span className="text-muted-foreground">-</span>;
        return description.length > 60
          ? `${description.substring(0, 60)}...`
          : description;
      },
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => {
        const featured = row.getValue('featured') as boolean;
        return (
          <Badge variant={featured ? 'default' : 'outline'}>
            {featured ? 'Yes' : 'No'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    createActionsColumn<Service>(handleEdit, handleDelete),
  ];

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={columns}
        data={services}
        title="Services"
        loading={loading}
        error={error}
        successMessage={successMessage}
        onSearch={handleSearch}
        onCreateClick={handleCreateNew}
        searchPlaceholder="Search services..."
      />
    </div>
  );
}
