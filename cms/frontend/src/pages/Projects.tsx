import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionsColumn } from '../components/ui/data-table';
import { Badge } from '../components/ui/badge';
import { getProjects, deleteProject } from '../services/project.service';
import type { Project } from '../services/project.service';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProjects = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects({
        page,
        limit: 10,
        search: search || undefined,
      });
      setProjects(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleEdit = (project: Project) => {
    navigate(`/dashboard/projects/${project.slug}`);
  };

  const handleDelete = async (project: Project) => {
    if (!project._id) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteProject(project._id);
      setSuccessMessage('Project deleted successfully');
      // Refresh the list after deletion
      fetchProjects(currentPage, searchQuery);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCreateNew = () => {
    navigate('/dashboard/projects/new');
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
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        return category ? (
          <Badge variant="secondary">{category}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
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
    createActionsColumn<Project>(handleEdit, handleDelete),
  ];

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={columns}
        data={projects}
        title="Projects"
        loading={loading}
        error={error}
        successMessage={successMessage}
        onSearch={handleSearch}
        onCreateClick={handleCreateNew}
        searchPlaceholder="Search projects..."
      />
    </div>
  );
}
