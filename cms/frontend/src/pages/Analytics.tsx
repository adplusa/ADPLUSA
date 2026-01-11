import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Globe
} from 'lucide-react';

export default function Analytics() {
  // Mock analytics data
  const analyticsData = {
    pageViews: {
      total: 12543,
      change: '+12.5%',
      trend: 'up'
    },
    uniqueVisitors: {
      total: 3421,
      change: '+8.2%',
      trend: 'up'
    },
    avgSessionDuration: {
      total: '3m 42s',
      change: '+5.1%',
      trend: 'up'
    },
    bounceRate: {
      total: '42.3%',
      change: '-2.1%',
      trend: 'down'
    }
  };

  const topPages = [
    { page: '/projects', views: 2341, change: '+15%' },
    { page: '/services', views: 1876, change: '+8%' },
    { page: '/about', views: 1234, change: '+12%' },
    { page: '/contact', views: 987, change: '+5%' },
    { page: '/', views: 654, change: '+3%' }
  ];

  const recentActivity = [
    { action: 'Page view', page: '/projects/modern-office', time: '2 minutes ago' },
    { action: 'Form submission', page: '/contact', time: '5 minutes ago' },
    { action: 'Page view', page: '/services/3d-visualization', time: '8 minutes ago' },
    { action: 'Page view', page: '/about', time: '12 minutes ago' },
    { action: 'Page view', page: '/projects', time: '15 minutes ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your website performance and user engagement.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pageViews.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{analyticsData.pageViews.change}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{analyticsData.uniqueVisitors.change}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgSessionDuration.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{analyticsData.avgSessionDuration.change}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.bounceRate.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{analyticsData.bounceRate.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{page.page}</p>
                      <p className="text-xs text-muted-foreground">{page.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {page.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.page}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Page views and unique visitors over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Analytics Chart</h3>
              <p className="text-sm text-muted-foreground">
                Chart visualization would be integrated here with a library like Chart.js or Recharts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}