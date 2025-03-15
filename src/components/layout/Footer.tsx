
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="py-6 md:py-8 mt-auto">
      <div className="container">
        <Separator className="mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-xs">A</span>
            </div>
            <span className="text-sm text-muted-foreground">Punjab Artisan Monitoring Portal</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-xs text-muted-foreground">© 2023 Punjab Artisan Initiative</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
