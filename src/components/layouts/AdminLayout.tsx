import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  LogOut, 
  Menu,
  Home
} from 'lucide-react';
import { useState } from 'react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Complaints', path: '/admin/complaints', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Queue', path: '/admin/audit', icon: AlertTriangle }
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center text-sidebar-primary-foreground font-bold">
            CM
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-sidebar-foreground">CivicMind AI</div>
            <div className="text-xs text-muted-foreground">Admin Portal</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link to="/" onClick={() => setOpen(false)}>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Public Site
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          size="sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        {profile && (
          <div className="text-xs text-muted-foreground px-3 py-2">
            Logged in as <span className="font-medium">{profile.email}</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-sidebar-border bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
