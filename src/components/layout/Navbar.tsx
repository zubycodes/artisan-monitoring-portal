
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Map,
  BarChart4,
  Settings,
  ChevronDown,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const logout = () => {
    localStorage.removeItem('ussr');
    navigate('/login');
  };

  return (
    <nav className="top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/11 border-b border-slate-200 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
            <span className="font-serif text-xl font-semibold">Artisan Portal</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? "secondary" : "ghost"}
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={isActive('/artisans') ? "secondary" : "ghost"}
              className="gap-2"
              onClick={() => navigate('/artisans')}
            >
              <Users className="h-4 w-4" />
              <span>Artisans</span>
            </Button>
            <Button
              variant={isActive('/manage') ? "secondary" : "ghost"}
              className="gap-2"
              onClick={() => navigate('/manage')}
            >
              <Users className="h-4 w-4" />
              <span>Manage</span>
            </Button>
            <Button
              variant={isActive('/map') ? "secondary" : "ghost"}
              className="gap-2"
              onClick={() => navigate('/map')}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </Button>
            <Button
              variant={isActive('/reports') ? "secondary" : "ghost"}
              className="gap-2"
              onClick={() => navigate('/reports')}
            >
              <BarChart4 className="h-4 w-4" />
              <span>Reports</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <span className="text-sm font-medium">AS</span>
                </div>
                <span className="hidden md:inline-block">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
