import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Home,
  FolderOpen,
  Briefcase,
  HelpCircle,
  Info,
  Phone,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Services', href: '/dashboard/services', icon: Briefcase },
  { name: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
  { name: 'About', href: '/dashboard/about', icon: Info },
  { name: 'Contact', href: '/dashboard/contact', icon: Phone },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Card className="flex flex-col flex-grow border-r pt-5 pb-4 overflow-y-auto rounded-none border-l-0 border-t-0 border-b-0">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </Card>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Card className="flex flex-col h-full border-r pt-5 pb-4 overflow-y-auto rounded-none border-l-0 border-t-0 border-b-0">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </Card>
      </div>
    </>
  );
}