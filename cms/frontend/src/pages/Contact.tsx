import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getContact } from '../services/content.service';
import type { Contact as ContactType } from '../services/content.service';
import { Edit, Phone, Mail, MapPin, ExternalLink, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, MessageCircle, Send } from 'lucide-react';

const getPlatformConfig = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return { icon: Facebook, color: 'bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-transparent' };
    case 'twitter': return { icon: Twitter, color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-transparent' };
    case 'instagram': return { icon: Instagram, color: 'bg-[#E4405F] hover:bg-[#E4405F]/90 text-white border-transparent' };
    case 'linkedin': return { icon: Linkedin, color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-transparent' };
    case 'youtube': return { icon: Youtube, color: 'bg-[#FF0000] hover:bg-[#FF0000]/90 text-white border-transparent' };
    case 'github': return { icon: Github, color: 'bg-[#181717] hover:bg-[#181717]/90 text-white border-transparent' };
    case 'whatsapp': return { icon: MessageCircle, color: 'bg-[#25D366] hover:bg-[#25D366]/90 text-white border-transparent' };
    case 'telegram': return { icon: Send, color: 'bg-[#0088cc] hover:bg-[#0088cc]/90 text-white border-transparent' };
    case 'website': return { icon: Globe, color: 'bg-slate-800 hover:bg-slate-900 text-white border-transparent' };
    default: return { icon: ExternalLink, color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border' };
  }
};

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
        setContact(response);
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
        {/* Main Content - Removed as per request (Form handled by main site) */}
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

          {/* New Social Links */}
          {/* @ts-ignore - socialLinks might not be in the type definition yet */}
          {contact.socialLinks && contact.socialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* @ts-ignore */}
                  {contact.socialLinks.map((link: any, index: number) => {
                    const { icon: Icon, color } = getPlatformConfig(link.platform);
                    return link.isActive && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm border ${color}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize font-medium">{link.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {contact.contactInfo.socialMedia && Object.values(contact.contactInfo.socialMedia).some(url => url) && (
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {contact.contactInfo.socialMedia?.facebook && (
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
                  {contact.contactInfo.socialMedia?.instagram && (
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
                  {contact.contactInfo.socialMedia?.linkedin && (
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
                  {contact.contactInfo.socialMedia?.twitter && (
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
                  {contact.contactInfo.socialMedia?.youtube && (
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

        {/* Main Content - Map */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.googleMapEmbedUrl ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    title="Google Map"
                    src={contact.googleMapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <MapPin className="h-10 w-10 mb-3 text-gray-400" />
                  <p>No Google Map URL configured.</p>
                  <p className="text-sm mt-1">Add a map URL in the "General Info" tab.</p>
                </div>
              )}
            </CardContent>
          </Card>
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
        Last updated: {new Date(contact.updatedAt || "").toLocaleDateString()}
      </div>
    </div>
  );
}