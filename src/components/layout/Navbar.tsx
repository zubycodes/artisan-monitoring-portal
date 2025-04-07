import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Map,
  BarChart4,
  SettingsIcon,
  Moon,
  Sun,
  ChevronDown,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({username: ''});
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? "dark" : "light");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("ussr") || "{}"));
  }, [navigate]);

  // Subtle animation effect for the logo
  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setRotation(prev => (prev + 0.2) % 360);
      requestAnimationFrame(animate);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem('ussr');
    navigate('/login');
  };

  // Vibrant color palette from the loader
  const colors = {
    red: '#E57373',
    orange: '#FFB74D',
    blue: '#4FC3F7',
    green: '#81C784',
    purple: '#BA68C8',
    yellow: '#FFD54F'
  };

  return (
    <nav className="top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/11 border-b border-slate-200 dark:border-slate-700 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            {/* Artisan-styled logo with animation */}
            <div className="relative h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
              {/* Animated background elements */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-transparent" 
                style={{
                  borderTopColor: colors.red,
                  borderBottomColor: colors.blue,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.05s linear'
                }}
              />
              <div 
                className="absolute inset-1 rounded-full border-2 border-transparent" 
                style={{
                  borderLeftColor: colors.green,
                  borderRightColor: colors.orange,
                  transform: `rotate(${-rotation * 1.5}deg)`,
                  transition: 'transform 0.05s linear'
                }}
              />
              <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">A</span>
              </div>
            </div>
            <span className="font-serif text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Artisan PSIC
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation buttons with subtle gradient hover effects */}
            <Button
              variant={isActive('/') ? "secondary" : "ghost"}
              className={`gap-2 ${!isActive('/') && "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20"}`}
              onClick={() => navigate('/')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={isActive('/map') ? "secondary" : "ghost"}
              className={`gap-2 ${!isActive('/map') && "hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:from-blue-900/20 dark:hover:to-green-900/20"}`}
              onClick={() => navigate('/map')}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </Button>
            <Button
              variant={isActive('/artisans') ? "secondary" : "ghost"}
              className={`gap-2 ${!isActive('/artisans') && "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"}`}
              onClick={() => navigate('/artisans')}
            >
              <Users className="h-4 w-4" />
              <span>Artisans</span>
            </Button>
            <Button
              variant={isActive('/reports') ? "secondary" : "ghost"}
              className={`gap-2 ${!isActive('/reports') && "hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20"}`}
              onClick={() => navigate('/reports')}
            >
              <BarChart4 className="h-4 w-4" />
              <span>Reports</span>
            </Button>
            <Button
              variant={isActive('/manage') ? "secondary" : "ghost"}
              className={`gap-2 ${!isActive('/manage') && "hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20"}`}
              onClick={() => navigate('/manage')}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Manage</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle with animation */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="relative overflow-hidden"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity"
            />
          </Button>
          
          {/* User dropdown with styled elements */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span className="hidden md:inline-block">{user?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 border border-slate-200 dark:border-slate-700">
              <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => logout()} 
                className="text-destructive focus:text-destructive cursor-pointer"
              >
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