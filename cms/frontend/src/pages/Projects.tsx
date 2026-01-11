import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentList from '../components/ContentList';
import type { Column } from '../components/ContentList';
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

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
      if (response.pagination) {
        setPagination(response.pagination);
      }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Project>[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'slug',
      label: 'Slug',
    },
    {
      key: 'category',
      label: 'Category',
      render: (project) => project.category || '-',
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (project) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            project.featured
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {project.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (project) =>
        project.createdAt
          ? new Date(project.createdAt).toLocaleDateString()
          : '-',
    },
  ];

  return (
    <ContentList
      title="Projects"
      data={projects}
      columns={columns}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSearch={handleSearch}
      createLink="/dashboard/projects/new"
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  );
}
