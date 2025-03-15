
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MapPreviewProps {
  className?: string;
}

const MapPreview = ({ className }: MapPreviewProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={cn("hover-lift overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Artisan Locations</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1"
            onClick={() => navigate('/map')}
          >
            <span className="text-xs">View Full Map</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full bg-slate-100 rounded-md overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/74.3587,31.5204,7/600x400?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbHN1NzgwazQwYnU2Mmtxanc5a296aXF3In0.8IqYJ6ogjCxnHw4H9hkbqQ')] bg-cover bg-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/80 rounded-full ring-4 ring-primary/30 animate-pulse"></div>
            
            {/* Simulated pins */}
            <div className="absolute top-[45%] left-[45%] w-3 h-3 bg-primary rounded-full"></div>
            <div className="absolute top-[40%] left-[55%] w-3 h-3 bg-primary rounded-full"></div>
            <div className="absolute top-[60%] left-[48%] w-3 h-3 bg-primary rounded-full"></div>
            <div className="absolute top-[50%] left-[60%] w-3 h-3 bg-primary rounded-full"></div>
            <div className="absolute top-[55%] left-[40%] w-3 h-3 bg-primary rounded-full"></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium">Punjab Region</p>
              <p className="text-xs text-muted-foreground">247 active artisans</p>
            </div>
            <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              5 new this week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPreview;
