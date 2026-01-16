import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Database,
  Globe,
  Bell,
  Palette,
  Save,
  Loader2,
  Check,
  Upload
} from 'lucide-react';
import { useTheme } from '../components/theme-provider';
import { getProjects, createProject } from '../services/project.service';
import { getServices, createService } from '../services/service.service';
import { getTags, createTag } from '../services/tag.service';
import { getMedia } from '../services/media.service';
import { getAbout, getContact, getFAQ, updateAbout, updateContact, updateFAQ } from '../services/content.service';

export default function Settings() {
  const { theme, setTheme, compact, setCompact } = useTheme();
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState(() => {
    const saved = localStorage.getItem("lastBackupTime");
    if (!saved) return "Never";
    const date = new Date(saved);
    return isNaN(date.getTime()) ? "Never" : date.toLocaleString();
  });
  const [backupStatus, setBackupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General Settings State
  const [siteName, setSiteName] = useState("Architect CMS");
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [siteDescription, setSiteDescription] = useState("Professional architecture and design services");
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setBrowserNotifications(true);
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      return;
    }

    if (browserNotifications) {
      setBrowserNotifications(false);
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setBrowserNotifications(true);
      new Notification("Notifications Enabled", {
        body: "You will now receive browser notifications.",
      });
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Add a timeout to prevent hanging if the server is unresponsive
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // Attempt to fetch the API URL to check connectivity
      // Any response (even 404/401) indicates the server is reachable
      // mode: 'no-cors' ensures we don't fail just because of CORS policies on the root endpoint
      await fetch(apiUrl, { 
        signal: controller.signal,
        mode: 'no-cors' 
      });
      setConnectionStatus('online');
    } catch (error) {
      setConnectionStatus('offline');
    } finally {
      clearTimeout(timeoutId);
      setIsTesting(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus('idle');
    try {
      // Fetch all data concurrently
      // We use catch(() => []) to ensure one failure doesn't stop the whole backup
      const [projects, services, tags, media, about, contact, faq] = await Promise.all([
        getProjects({ limit: 1000 }).then(res => res.data).catch(() => []),
        getServices({ limit: 1000 }).then(res => res.data).catch(() => []),
        getTags({ limit: 1000 }).then(res => res.data).catch(() => []),
        getMedia({ limit: 1000 }).then(res => res.data).catch(() => []),
        getAbout().then(res => res.data).catch(() => null),
        getContact().then(res => res.data).catch(() => null),
        getFAQ().then(res => res.data).catch(() => null),
      ]);

      const backupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: {
          projects,
          services,
          tags,
          media,
          about,
          contact,
          faq
        }
      };

      // Create and trigger download
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const now = new Date();
      localStorage.setItem("lastBackupTime", now.toISOString());
      setLastBackup(now.toLocaleString());
      setBackupStatus('success');
      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch (error) {
      setBackupStatus('error');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Restoring will import content from the backup file. This may create duplicate entries. Continue?")) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const { data } = backup;

      // Restore Collections (Sequentially to avoid overwhelming backend)
      if (data.projects && Array.isArray(data.projects)) {
        for (const item of data.projects) {
          const { _id, createdAt, updatedAt, ...payload } = item;
          await createProject(payload).catch(console.error);
        }
      }
      if (data.services && Array.isArray(data.services)) {
        for (const item of data.services) {
          const { _id, createdAt, updatedAt, ...payload } = item;
          await createService(payload).catch(console.error);
        }
      }
      if (data.tags && Array.isArray(data.tags)) {
        for (const item of data.tags) {
          const { _id, createdAt, updatedAt, ...payload } = item;
          await createTag(payload).catch(console.error);
        }
      }

      // Restore Singletons
      if (data.about) await updateAbout(data.about).catch(console.error);
      if (data.contact) await updateContact(data.contact).catch(console.error);
      if (data.faq) await updateFAQ(data.faq).catch(console.error);

      alert("Restore completed successfully!");
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Failed to restore backup. Please ensure the file is a valid backup JSON.");
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveGeneral = () => {
    setIsSavingGeneral(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingGeneral(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>
              Basic application configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input 
                  id="site-url" 
                  value={siteUrl} 
                  onChange={(e) => setSiteUrl(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input 
                id="site-description" 
                value={siteDescription} 
                onChange={(e) => setSiteDescription(e.target.value)} 
              />
            </div>
            <Button onClick={handleSaveGeneral} disabled={isSavingGeneral}>
              {isSavingGeneral ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSavingGeneral ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg glossy-card">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>Administrator</Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>
              Configure security and authentication options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Automatically log out inactive users</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input className="w-20" defaultValue="30" />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Update Security Settings
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <CardTitle>Database</CardTitle>
              </div>
              <CardDescription>
                Database connection and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Connection Status</p>
                  <p className="text-xs text-muted-foreground">MongoDB connection</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="text-sm font-medium">Last Backup</p>
                </div>
                <span className="text-sm text-muted-foreground">{lastBackup}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={backupStatus === 'error' ? "destructive" : "outline"} 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCreateBackup}
                  disabled={isBackingUp || backupStatus === 'success'}
                >
                  {isBackingUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : backupStatus === 'success' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Backup Created
                    </>
                  ) : backupStatus === 'error' ? (
                    'Failed - Retry'
                  ) : (
                    'Create Backup'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleRestoreClick}
                  disabled={isRestoring}
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Restore
                    </>
                  )}
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleFileChange} 
                />
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <CardTitle>API Settings</CardTitle>
              </div>
              <CardDescription>
                Configure API endpoints and keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input 
                  id="api-url" 
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">Backend connection</p>
                </div>
                {connectionStatus === 'online' ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>
                ) : (
                  <Badge variant="destructive">Offline</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Compact Mode</p>
                <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
              </div>
              <Button 
                variant={compact ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCompact(!compact)}
              >
                {compact ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Browser Notifications</p>
                <p className="text-xs text-muted-foreground">Show desktop notifications</p>
              </div>
              <Button 
                variant={browserNotifications ? "default" : "outline"} 
                size="sm"
                onClick={handleToggleNotifications}
              >
                {browserNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}