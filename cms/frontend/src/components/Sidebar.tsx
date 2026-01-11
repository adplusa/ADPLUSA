import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Home,
  FolderOpen,
  Briefcase,
  HelpCircle,
  Info,
  Phone,
  Tags,
  Image,
  X,
  Settings,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const contentNavigation = [
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Services', href: '/dashboard/services', icon: Briefcase },
  { name: 'Media Library', href: '/dashboard/media', icon: Image },
  { name: 'Tags', href: '/dashboard/tags', icon: Tags },
];

const pagesNavigation = [
  { name: 'About', href: '/dashboard/about', icon: Info },
  { name: 'Contact', href: '/dashboard/contact', icon: Phone },
  { name: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
];

const settingsNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface NavSectionProps {
  title: string;
  items: typeof mainNavigation;
  onItemClick?: () => void;
}

function NavSection({ title, items, onItemClick }: NavSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
        {title}
      </h4>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">CMS Admin</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6 py-4">
          <NavSection title="Overview" items={mainNavigation} onItemClick={onClose} />
          <NavSection title="Content" items={contentNavigation} onItemClick={onClose} />
          <NavSection title="Pages" items={pagesNavigation} onItemClick={onClose} />
          <Separator />
          <NavSection title="System" items={settingsNavigation} onItemClick={onClose} />
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">CMS Admin</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-6 py-4">
              <NavSection title="Overview" items={mainNavigation} onItemClick={onClose} />
              <NavSection title="Content" items={contentNavigation} onItemClick={onClose} />
              <NavSection title="Pages" items={pagesNavigation} onItemClick={onClose} />
              <Separator />
              <NavSection title="System" items={settingsNavigation} onItemClick={onClose} />
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}