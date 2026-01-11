import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getContact } from '../services/content.service';
import type { Contact as ContactType } from '../services/content.service';
import { Edit, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContact();
        setContact(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load contact page');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No contact page content found.</p>
            <Button onClick={() => navigate('/dashboard/contact/edit')}>
              Add Contact Information
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{contact.title}</h1>
        <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Contact Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Main Content */}
        <Card>
          <CardContent className="py-6">
            {contact.description ? (
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground">{contact.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No description available.</p>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${contact.contactInfo.phone}`} className="text-sm text-blue-600 hover:underline">
                      {contact.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${contact.contactInfo.email}`} className="text-sm text-blue-600 hover:underline">
                      {contact.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.contactInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{contact.contactInfo.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {contact.contactInfo.socialMedia && Object.values(contact.contactInfo.socialMedia).some(url => url) && (
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {contact.contactInfo.socialMedia.facebook && (
                    <a
                      href={contact.contactInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.instagram && (
                    <a
                      href={contact.contactInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
                    >
                      Instagram
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.linkedin && (
                    <a
                      href={contact.contactInfo.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
                    >
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.twitter && (
                    <a
                      href={contact.contactInfo.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm"
                    >
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.youtube && (
                    <a
                      href={contact.contactInfo.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      YouTube
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {(contact.seoTitle || contact.seoDescription) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contact.seoTitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Title</label>
                <p className="text-sm">{contact.seoTitle}</p>
              </div>
            )}
            {contact.seoDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                <p className="text-sm">{contact.seoDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Last updated: {new Date(contact.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}