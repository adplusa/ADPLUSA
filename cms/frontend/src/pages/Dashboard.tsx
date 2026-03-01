import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/project.service';
import type { Project } from '../services/project.service';
import { getServices } from '../services/service.service';
import { getTags } from '../services/tag.service';
import { getMedia } from '../services/media.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  FolderOpen,
  Briefcase,
  Tags,
  Image,
  Activity,
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface DashboardStats {
  projects: number;
  services: number;
  tags: number;
  media: number;
  loading: boolean;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'service' | 'media' | 'tag';
  title: string;
  action: string;
  timestamp: string;
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    services: 0,
    tags: 0,
    media: 0,
    loading: true,
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch recent items from all categories to build stats and activity feed
        const [projectsRes, servicesRes, tagsRes, mediaRes] = await Promise.all([
          getProjects({ page: 1, limit: 5 }),
          getServices({ page: 1, limit: 5 }),
          getTags({ page: 1, limit: 5 }),
          getMedia({ page: 1, limit: 5 }),
        ]);

        setStats({
          projects: projectsRes?.pagination?.total || projectsRes?.data?.length || 0,
          services: servicesRes?.pagination?.total || servicesRes?.data?.length || 0,
          tags: tagsRes?.pagination?.total || tagsRes?.data?.length || 0,
          media: mediaRes?.pagination?.total || mediaRes?.data?.length || 0,
          loading: false,
        });

        setRecentProjects(projectsRes.data);

        // Build dynamic activity feed
        const activities: RecentActivity[] = [];

        projectsRes.data.forEach((item: any) => activities.push({
          id: item._id,
          type: 'project',
          title: item.title,
          action: 'created',
          timestamp: item.createdAt
        }));

        servicesRes.data.forEach((item: any) => activities.push({
          id: item._id,
          type: 'service',
          title: item.title,
          action: 'created',
          timestamp: item.createdAt
        }));

        tagsRes.data.forEach((item: any) => activities.push({
          id: item._id,
          type: 'tag',
          title: item.name,
          action: 'created',
          timestamp: item.createdAt
        }));

        mediaRes.data.forEach((item: any) => activities.push({
          id: item._id,
          type: 'media',
          title: item.title || item.filename,
          action: 'uploaded',
          timestamp: item.createdAt
        }));

        // Sort by newest first and take top 5
        const sortedActivities = activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
        setRecentActivity(sortedActivities.map(a => ({...a, timestamp: getTimeAgo(a.timestamp)})));

      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <FolderOpen className="h-4 w-4" />;
      case 'service': return <Briefcase className="h-4 w-4" />;
      case 'media': return <Image className="h-4 w-4" />;
      case 'tag': return <Tags className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-600';
      case 'service': return 'bg-green-100 text-green-600';
      case 'media': return 'bg-purple-100 text-purple-600';
      case 'tag': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loading ? '...' : stats.projects}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loading ? '...' : stats.services}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loading ? '...' : stats.media}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loading ? '...' : stats.tags}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Projects */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your latest project updates
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link to="/dashboard/projects">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-10 w-10 rounded-lg bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-muted rounded"></div>
                      <div className="h-3 w-1/2 bg-muted rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project._id} className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.description 
                          ? (project.description.length > 60 ? `${project.description.substring(0, 60)}...` : project.description)
                          : 'No description'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/projects/${project._id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No projects yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first project
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/projects/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes across your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-muted rounded"></div>
                      <div className="h-3 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity found.
                </p>
              ) : recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/dashboard/projects/new">
                <Plus className="h-6 w-6 mb-2" />
                New Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/dashboard/services/new">
                <Plus className="h-6 w-6 mb-2" />
                New Service
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/dashboard/media">
                <Image className="h-6 w-6 mb-2" />
                Upload Media
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/dashboard/tags/new">
                <Tags className="h-6 w-6 mb-2" />
                Create Tag
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}