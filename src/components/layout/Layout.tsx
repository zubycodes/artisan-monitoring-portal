
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  BarChart4 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/artisans', label: 'Artisans', icon: Users },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/reports', label: 'Reports', icon: BarChart4 },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Mobile sidebar */}
      {isMobile && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="fixed z-[60] bottom-4 right-4 rounded-full shadow-lg bg-primary text-primary-foreground"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <div className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <div className={cn(
              "fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white shadow-lg transform transition-all duration-300 ease-in-out",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <div className="flex flex-col h-full pt-20 pb-6 px-4">
                <div className="space-y-1 flex-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3 mb-1"
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="mt-auto px-4 py-2 text-xs text-muted-foreground">
                  <p>Punjab Artisan Initiative</p>
                  <p>© 2025 All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      <main className={cn("flex-1 pt-10 pb-8 px-4 md:px-8", className)}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
