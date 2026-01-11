import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionsColumn } from '../components/ui/data-table';
import { getTags, deleteTag } from '../services/tag.service';
import type { Tag } from '../services/tag.service';

export default function Tags() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTags = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTags({
        page,
        limit: 20,
        search: search || undefined,
      });
      setTags(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleEdit = (tag: Tag) => {
    navigate(`/dashboard/tags/${tag._id}`);
  };

  const handleDelete = async (tag: Tag) => {
    if (!tag._id) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteTag(tag._id);
      setSuccessMessage('Tag deleted successfully');
      // Refresh the list after deletion
      fetchTags(currentPage, searchQuery);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete tag');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCreateNew = () => {
    navigate('/dashboard/tags/new');
  };

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const tag = row.original;
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-medium">{tag.name}</span>
          </div>
        );
      },
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
        return description ? (
          <span className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
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
    createActionsColumn<Tag>(handleEdit, handleDelete),
  ];

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={columns}
        data={tags}
        title="Tags"
        loading={loading}
        error={error}
        successMessage={successMessage}
        onSearch={handleSearch}
        onCreateClick={handleCreateNew}
        searchPlaceholder="Search tags..."
      />
    </div>
  );
}