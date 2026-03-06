import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getFAQ } from '../services/content.service';
import type { FAQ as FAQType, FAQCategory } from '../services/content.service';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';

export default function FAQ() {
  const navigate = useNavigate();
  const [faq, setFaq] = useState<FAQType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFAQ();
        setFaq(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load FAQ');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  const toggleExpanded = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <Button onClick={() => navigate('/dashboard/faq/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit FAQ
          </Button>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
              {[...Array(3)].map((_, j) => (
                <Card key={j} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <Button onClick={() => navigate('/dashboard/faq/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit FAQ
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!faq || faq.categories.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <Button onClick={() => navigate('/dashboard/faq/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit FAQ
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No FAQ entries found.</p>
            <Button onClick={() => navigate('/dashboard/faq/edit')}>
              Add FAQ Entries
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{faq.title}</h1>
        <Button onClick={() => navigate('/dashboard/faq/edit')} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit FAQ
        </Button>
      </div>

      <div className="space-y-8">
        {faq.categories.map((category: FAQCategory, categoryIndex: number) => (
          <div key={categoryIndex}>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-sm">
                  {category.title}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''}
                </span>
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
            </div>

            <div className="space-y-3">
              {category.faqs.map((faqItem: any, faqIndex: number) => {
                const key = `${categoryIndex}-${faqIndex}`;
                const isExpanded = expandedItems.has(key);
                return (
                  <Card key={faqIndex} className="transition-all duration-200">
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleExpanded(categoryIndex, faqIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium text-left">
                          {faqItem.question}
                        </CardTitle>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: faqItem.answer }}
                        />
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {(faq.seoTitle || faq.seoDescription) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faq.seoTitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Title</label>
                <p className="text-sm">{faq.seoTitle}</p>
              </div>
            )}
            {faq.seoDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                <p className="text-sm">{faq.seoDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Last updated: {new Date(faq.updatedAt || "").toLocaleDateString()}
      </div>
    </div>
  );
}