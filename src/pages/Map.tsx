
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';

const Map = () => {
  return (
    <Layout>
      <PageHeader
        title="Artisan Map"
        description="Visualize the geographic distribution of artisans across Punjab."
      />
      
      <div className="rounded-lg overflow-hidden border shadow-sm bg-white">
        <div className="relative aspect-[16/9] w-full">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/74.3587,31.5204,7/1200x675?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbHN1NzgwazQwYnU2Mmtxanc5a296aXF3In0.8IqYJ6ogjCxnHw4H9hkbqQ')] bg-cover bg-center">
            {/* Map placeholder - in a real implementation, this would be an interactive map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg text-center">
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  An interactive map would be implemented here with Mapbox or Google Maps.
                </p>
              </div>
            </div>
            
            {/* Simulated pins */}
            <div className="absolute top-[45%] left-[45%] w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-[40%] left-[55%] w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-[60%] left-[48%] w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-[50%] left-[60%] w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-[55%] left-[40%] w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
