
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  name: string;
  action: string;
  craft: string;
  time: string;
  avatarUrl?: string;
}

interface ArtisanActivityProps {
  activities: Activity[];
  className?: string;
}

const ArtisanActivity = ({ activities, className }: ArtisanActivityProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={cn("hover-lift", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1"
            onClick={() => navigate('/artisans')}
          >
            <span className="text-xs">View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${activities.indexOf(activity) * 100}ms` }}>
              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                {activity.avatarUrl ? (
                  <img src={activity.avatarUrl} alt={activity.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium">{activity.name.charAt(0)}{activity.name.split(' ')[1]?.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium truncate">{activity.name}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.action} <span className="font-medium">{activity.craft}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtisanActivity;
