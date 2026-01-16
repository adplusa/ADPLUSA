import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getMedia, deleteMedia, formatFileSize, isImage, getFileTypeIcon } from '../services/media.service';
import { getTags } from '../services/tag.service';
import type { MediaFile } from '../services/media.service';
import type { Tag } from '../services/tag.service';
import {
  Search,
  Upload,
  Grid,
  List,
  Edit,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X,
  Loader2
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];
const DEFAULT_PAGE_SIZE = 24;

export default function MediaLibrary() {
  const navigate = useNavigate();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mimeTypeFilter, setMimeTypeFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounced search value (300ms delay per Requirement 6.1)
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Use the usePagination hook for consistent pagination behavior
  // Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  /**
   * Fetch media from the server
   * Requirements: 5.1, 5.5, 6.2
   */
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMedia({
        page: pagination.state.page,
        limit: pagination.state.pageSize,
        search: debouncedSearch || undefined,
        mimeType: mimeTypeFilter || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      setMedia(response.data);
      if (response.pagination) {
        pagination.setTotal(response.pagination.total);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to load media';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.state.page, pagination.state.pageSize, debouncedSearch, mimeTypeFilter, selectedTags, pagination.setTotal]);

  const fetchTags = async () => {
    try {
      const response = await getTags({ limit: 100 });
      setTags(response.data);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Reset to page 1 when search or filters change (Requirement 6.3)
  useEffect(() => {
    pagination.goToFirst();
  }, [debouncedSearch, selectedTags, mimeTypeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleTagFilter = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleMimeTypeFilter = (mimeType: string) => {
    setMimeTypeFilter(prev => prev === mimeType ? '' : mimeType);
  };

  const handleEdit = (mediaFile: MediaFile) => {
    navigate(`/dashboard/media/${mediaFile._id}`);
  };

  /**
   * Handle media deletion with proper page management
   * Requirements: 5.6, 5.7
   */
  const handleDelete = async (mediaFile: MediaFile) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteMedia(mediaFile._id);
      setSuccessMessage('Media deleted successfully');
      // Use handleDeletion to properly manage page after deletion
      pagination.handleDeletion(1);
      // Refetch data
      fetchMedia();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to delete media';
      setError(errorMessage);
    }
  };

  const handleUpload = () => {
    navigate('/dashboard/media/upload');
  };

  /**
   * Clear all filters (Requirement 6.5)
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setMimeTypeFilter('');
    pagination.goToFirst();
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pagination.setPageSize(Number(e.target.value));
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || mimeTypeFilter;

  // Calculate display range
  const startItem = media.length > 0 ? (pagination.state.page - 1) * pagination.state.pageSize + 1 : 0;
  const endItem = Math.min(pagination.state.page * pagination.state.pageSize, pagination.state.total);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and documents</p>
        </div>
        <Button onClick={handleUpload} disabled={loading} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-9 pr-9"
                  aria-label="Search media"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Type Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">File Type:</span>
              <Button
                variant={mimeTypeFilter === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMimeTypeFilter('image')}
              >
                Images
              </Button>
              <Button
                variant={mimeTypeFilter === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMimeTypeFilter('video')}
              >
                Videos
              </Button>
              <Button
                variant={mimeTypeFilter === 'pdf' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMimeTypeFilter('pdf')}
              >
                PDFs
              </Button>
            </div>

            {/* Tag Filters */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Tags:</span>
                {tags.map(tag => (
                  <Badge
                    key={tag._id}
                    variant={selectedTags.includes(tag._id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTagFilter(tag._id)}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Clear Filters (Requirement 6.5) */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Loading State (Requirement 5.5) */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2" role="status" aria-label="Loading media">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Loading media library...</span>
            </div>
          </CardContent>
        </Card>
      ) : media.length === 0 ? (
      /* Empty State / No Results (Requirement 6.4) */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No media found</h3>
            <p className="text-muted-foreground text-center mb-4">
                {hasActiveFilters
                  ? 'No results match your search criteria. Try adjusting your filters.'
                : 'Upload your first media file to get started.'
              }
            </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                  <Button onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
              )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(mediaFile => (
            <Card key={mediaFile._id} className="overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {isImage(mediaFile.mimeType) ? (
                  <img
                    src={mediaFile.s3Url}
                    alt={mediaFile.alt || mediaFile.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">
                    {getFileTypeIcon(mediaFile.mimeType)}
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate mb-1">{mediaFile.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {formatFileSize(mediaFile.size)}
                </p>
                {mediaFile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {mediaFile.tags.slice(0, 2).map(tag => (
                      <Badge key={tag._id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {mediaFile.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mediaFile.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(mediaFile)}
                    className="flex-1"
                    aria-label={`Edit ${mediaFile.title}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mediaFile)}
                    className="flex-1 text-destructive hover:text-destructive"
                    aria-label={`Delete ${mediaFile.title}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {media.map(mediaFile => (
                <div key={mediaFile._id} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {isImage(mediaFile.mimeType) ? (
                      <img
                        src={mediaFile.s3Url}
                        alt={mediaFile.alt || mediaFile.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-lg">
                        {getFileTypeIcon(mediaFile.mimeType)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{mediaFile.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(mediaFile.size)} • {new Date(mediaFile.createdAt).toLocaleDateString()}
                    </p>
                    {mediaFile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mediaFile.tags.map(tag => (
                          <Badge key={tag._id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(mediaFile)}
                      aria-label={`Edit ${mediaFile.title}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(mediaFile)}
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete ${mediaFile.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls (Requirements: 5.2, 5.3, 5.4) */}
      {!loading && media.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {pagination.state.total > 0 ? (
                <>
                  Showing {startItem} to {endItem} of {pagination.state.total} entries
                </>
              ) : (
                'No entries'
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="media-page-size" className="text-sm text-muted-foreground">
                Items per page:
              </label>
              <select
                id="media-page-size"
                value={pagination.state.pageSize}
                onChange={handlePageSizeChange}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Select number of items per page"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.state.page} of {pagination.state.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToFirst}
              disabled={!pagination.canGoPrevious || loading}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToPrevious}
              disabled={!pagination.canGoPrevious || loading}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToNext}
              disabled={!pagination.canGoNext || loading}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToLast}
              disabled={!pagination.canGoNext || loading}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
