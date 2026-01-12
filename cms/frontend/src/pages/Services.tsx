import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { createActionsColumn } from '../components/ui/data-table';
import { Badge } from '../components/ui/badge';
import { ServerPaginatedTable, type FetchParams, type PaginatedResponse } from '../components/ui/ServerPaginatedTable';
import { getServices, deleteService } from '../services/service.service';
import type { Service } from '../services/service.service';

export default function Services() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Fetch services from the server with pagination and search
   * Requirements: 5.1, 6.2
   * 
   * Note: If the backend doesn't support server-side pagination/search yet,
   * this will fall back to client-side filtering of all results.
   */
  const fetchServices = useCallback(async (params: FetchParams): Promise<PaginatedResponse<Service>> => {
    try {
      setError(null);
      const response = await getServices({
        page: params.page,
        limit: params.pageSize,
        search: params.search || undefined,
      });

      // If backend returns pagination info, use it
      if (response.pagination) {
        return {
          data: response.data,
          pagination: {
            page: response.pagination.page,
            pageSize: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.pages,
          },
        };
      }

      // Fallback: client-side pagination if backend doesn't support it
      let filteredData = response.data;
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredData = response.data.filter(service =>
          service.title.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower) ||
          service.slug.toLowerCase().includes(searchLower)
        );
      }

      const total = filteredData.length;
      const totalPages = Math.ceil(total / params.pageSize);
      const startIndex = (params.page - 1) * params.pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + params.pageSize);

      return {
        data: paginatedData,
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total,
          totalPages,
        },
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to load services';
      setError(errorMessage);
      return {
        data: [],
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }, []);

  const handleEdit = (service: Service) => {
    navigate(`/dashboard/services/${service.slug}`);
  };

  /**
   * Handle service deletion with proper page management
   * Requirements: 5.6, 5.7
   */
  const handleDelete = async (service: Service) => {
    if (!service._id) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteService(service._id);
      setSuccessMessage('Service deleted successfully');
      // Trigger refresh of the table data
      setRefreshKey(prev => prev + 1);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to delete service';
      setError(errorMessage);
    }
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
      <ServerPaginatedTable
        columns={columns}
        fetchData={fetchServices}
        title="Services"
        searchPlaceholder="Search services..."
        onCreateClick={handleCreateNew}
        createButtonLabel="Create New"
        error={error}
        successMessage={successMessage}
        refreshKey={refreshKey}
        emptyStateMessage="No services found. Create your first service!"
        noResultsMessage="No services match your search criteria."
      />
    </div>
  );
}
