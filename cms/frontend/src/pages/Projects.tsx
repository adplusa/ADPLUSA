import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { createActionsColumn } from '../components/ui/data-table';
import { Button } from '../components/ui/button';
import { ServerPaginatedTable, type FetchParams, type PaginatedResponse } from '../components/ui/ServerPaginatedTable';
import { getProjects, deleteProject, updateProject } from '../services/project.service';
import type { Project } from '../services/project.service';

export default function Projects() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Fetch projects from the server with pagination and search
   * Requirements: 5.1, 6.2
   */
  const fetchProjects = useCallback(async (params: FetchParams): Promise<PaginatedResponse<Project>> => {
    try {
      setError(null);
      const response = await getProjects({
        page: params.page,
        limit: params.pageSize,
        search: params.search || undefined,
      });

      return {
        data: response.data,
        pagination: {
          page: response.pagination?.page || params.page,
          pageSize: response.pagination?.limit || params.pageSize,
          total: response.pagination?.total || response.data.length,
          totalPages: response.pagination?.pages || 1,
        },
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to load projects';
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

  const handleEdit = (project: Project) => {
    navigate(`/dashboard/projects/${project.slug}`);
  };

  /**
   * Handle project deletion with proper page management
   * Requirements: 5.6, 5.7
   */
  const handleDelete = async (project: Project) => {
    if (!project._id) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteProject(project._id);
      setSuccessMessage('Project deleted successfully');
      // Trigger refresh of the table data
      setRefreshKey(prev => prev + 1);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to delete project';
      setError(errorMessage);
    }
  };

  const handleCreateNew = () => {
    navigate('/dashboard/projects/new');
  };

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleFeatureToggle = async (project: Project) => {
    if (!project._id || togglingId === project._id) return;
    try {
      setTogglingId(project._id);
      await updateProject(project._id, { featured: !project.featured });
      setRefreshKey(prev => prev + 1);
    } catch {
      setError('Failed to update featured status');
    } finally {
      setTogglingId(null);
    }
  };

  const columns: ColumnDef<Project>[] = [
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
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => {
        const project = row.original;
        const isFeatured = row.getValue('featured') as boolean;
        const isToggling = togglingId === project._id;
        return (
          <Button
            variant={isFeatured ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeatureToggle(project)}
            disabled={isToggling}
          >
            {isToggling ? '...' : isFeatured ? 'Featured' : 'Not Featured'}
          </Button>
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
    createActionsColumn<Project>(handleEdit, handleDelete),
  ];

  return (
    <div className="container mx-auto py-6">
      <ServerPaginatedTable
        columns={columns}
        fetchData={fetchProjects}
        title="Projects"
        searchPlaceholder="Search projects..."
        onCreateClick={handleCreateNew}
        createButtonLabel="Create New"
        error={error}
        successMessage={successMessage}
        refreshKey={refreshKey}
        emptyStateMessage="No projects found. Create your first project!"
        noResultsMessage="No projects match your search criteria."
      />
    </div>
  );
}
