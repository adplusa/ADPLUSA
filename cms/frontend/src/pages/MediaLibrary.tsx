import { useState, useEffect } from 'react';
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
import { Search, Upload, Grid, List, Edit, Trash2 } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedia = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMedia({
        page,
        limit: 20,
        search: searchQuery || undefined,
        mimeType: mimeTypeFilter || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      setMedia(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

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
    fetchMedia(currentPage);
  }, [currentPage, searchQuery, selectedTags, mimeTypeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTagFilter = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    setCurrentPage(1);
  };

  const handleMimeTypeFilter = (mimeType: string) => {
    setMimeTypeFilter(prev => prev === mimeType ? '' : mimeType);
    setCurrentPage(1);
  };

  const handleEdit = (mediaFile: MediaFile) => {
    navigate(`/dashboard/media/${mediaFile._id}`);
  };

  const handleDelete = async (mediaFile: MediaFile) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await deleteMedia(mediaFile._id);
      setSuccessMessage('Media deleted successfully');
      fetchMedia(currentPage);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete media');
    }
  };

  const handleUpload = () => {
    navigate('/dashboard/media/upload');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setMimeTypeFilter('');
    setCurrentPage(1);
  };

  if (loading && media.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading media library...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and documents</p>
        </div>
        <Button onClick={handleUpload} className="flex items-center gap-2">
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
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
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

            {/* Clear Filters */}
            {(searchQuery || selectedTags.length > 0 || mimeTypeFilter) && (
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

      {/* Media Grid/List */}
      {media.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No media found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || selectedTags.length > 0 || mimeTypeFilter
                ? 'Try adjusting your filters or search terms.'
                : 'Upload your first media file to get started.'
              }
            </p>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
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
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mediaFile)}
                    className="flex-1 text-destructive hover:text-destructive"
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(mediaFile)}
                      className="text-destructive hover:text-destructive"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}