import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getAbout } from '../services/content.service';
import type { About as AboutType } from '../services/content.service';
import { Edit } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  const [about, setAbout] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAbout();
        setAbout(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load about page');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">About Us</h1>
          <Button onClick={() => navigate('/dashboard/about/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit About Page
          </Button>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">About Us</h1>
          <Button onClick={() => navigate('/dashboard/about/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit About Page
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">About Us</h1>
          <Button onClick={() => navigate('/dashboard/about/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit About Page
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No about page content found.</p>
            <Button onClick={() => navigate('/dashboard/about/edit')}>
              Add About Content
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{about.title}</h1>
        <Button onClick={() => navigate('/dashboard/about/edit')} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit About Page
        </Button>
      </div>

      <Card>
        <CardContent className="py-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: about.content }}
          />
        </CardContent>
      </Card>

      {(about.seoTitle || about.seoDescription) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {about.seoTitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Title</label>
                <p className="text-sm">{about.seoTitle}</p>
              </div>
            )}
            {about.seoDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                <p className="text-sm">{about.seoDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Last updated: {new Date(about.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
