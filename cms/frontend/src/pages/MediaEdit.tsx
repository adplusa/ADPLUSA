import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { getMediaById, updateMedia, isImage, formatFileSize, getFileTypeIcon } from '../services/media.service';
import { getTags } from '../services/tag.service';
import type { MediaFile, UpdateMediaData } from '../services/media.service';
import type { Tag } from '../services/tag.service';

interface MediaEditData extends UpdateMediaData {}

export default function MediaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MediaEditData>();

  useEffect(() => {
    if (id) {
      loadMedia();
      fetchTags();
    }
  }, [id]);

  const loadMedia = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await getMediaById(id!);
      const mediaFile = response.data;
      setMedia(mediaFile);
      setSelectedTags(mediaFile.tags.map(tag => tag._id));
      reset({
        title: mediaFile.title,
        alt: mediaFile.alt || '',
        description: mediaFile.description || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load media');
    } finally {
      setInitialLoading(false);
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

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const onSubmit = async (data: MediaEditData) => {
    try {
      setLoading(true);
      setError(null);

      const updateData: UpdateMediaData = {
        ...data,
        tags: selectedTags,
      };

      await updateMedia(id!, updateData);
      navigate('/dashboard/media');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/media');
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading media...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">Media not found</h3>
            <p className="text-muted-foreground mb-4">
              The media file you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/dashboard/media')}>
              Back to Media Library
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Media</CardTitle>
          <CardDescription>
            Update the media information and tags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Preview */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {isImage(media.mimeType) ? (
                  <img
                    src={media.s3Url}
                    alt={media.alt || media.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl text-muted-foreground">
                    {getFileTypeIcon(media.mimeType)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">File Information</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Filename:</strong> {media.filename}</p>
                  <p><strong>Size:</strong> {formatFileSize(media.size)}</p>
                  <p><strong>Type:</strong> {media.mimeType}</p>
                  {media.width && media.height && (
                    <p><strong>Dimensions:</strong> {media.width} × {media.height}px</p>
                  )}
                  <p><strong>Uploaded:</strong> {new Date(media.createdAt).toLocaleDateString()}</p>
                  <p><strong>By:</strong> {media.uploadedBy.username}</p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 2, message: 'Title must be at least 2 characters' },
                      maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                    })}
                    placeholder="Enter media title"
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Alt Text */}
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    {...register('alt', {
                      maxLength: { value: 200, message: 'Alt text must be less than 200 characters' }
                    })}
                    placeholder="Describe the image for accessibility"
                    disabled={loading}
                  />
                  {errors.alt && (
                    <p className="text-sm text-destructive">{errors.alt.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register('description', {
                      maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                    })}
                    placeholder="Enter media description"
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag._id}
                          variant={selectedTags.includes(tag._id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag._id)}
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click tags to add or remove them from this media file
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Media'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}