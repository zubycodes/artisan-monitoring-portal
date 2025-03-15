
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ 
  title, 
  description, 
  children, 
  className
}: PageHeaderProps) => {
  return (
    <div className={cn("pb-6 pt-2 md:pb-8 md:pt-3", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full animate-slide-down">
            Punjab Artisan Initiative
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight animate-slide-down" style={{ animationDelay: "100ms" }}>
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl animate-slide-down" style={{ animationDelay: "200ms" }}>
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
