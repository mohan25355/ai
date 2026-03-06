import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Submit Complaint', path: '/submit' },
    { name: 'Track Complaint', path: '/track' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                CM
              </div>
              <span className="font-bold text-xl">CivicMind AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/login">
                <Button variant="default">Admin Login</Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full">Admin Login</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 CivicMind AI. Empowering citizens, improving governance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
