import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GoogleMapReact from 'google-map-react';
import { districtsLatLong } from '@/pages/map-config';

interface MapPreviewProps {
  className?: string;
  artisans?: any;
  loading: boolean;
}

// Constants
const API_BASE_URL = 'http://3.106.165.252:6500';
const GEOJSON_URL = 'https://beige-cathe-75.tiiny.site/pakistan_districts.json';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCDMOfZ6Xc-MV7pSImhOrf2q8MaYr28shM';
const INITIAL_MAP_CENTER = { lat: 31.1704, lng: 72.7097 };
const INITIAL_MAP_ZOOM = 6;
const DISTRICT_ZOOM = 8;

// Marker component for individual artisans
const Marker = ({ lat, lng, artisan, $hover = false, onClick }) => {
  return (
    <div className="relative">
      <img
        src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        width="20"
        height="10"
        className={`cursor-pointer transition-transform ${$hover ? 'scale-110' : ''}`}
        alt="Marker"
      />
    </div>
  );
};

// Animated Cluster Marker component
const ClusterMarker = ({ lat, lng, count, $hover = false, onClick }) => {
  // Motion animation config
  const initialScale = 0.6;
  const defaultScale = 1;
  const hoveredScale = 1.15;
  const stiffness = 320;
  const damping = 7;
  const precision = 0.001;

  // Calculate size based on count (min 32px, max 60px)
  const size = Math.min(Math.max(32, count * 3), 60);

  return (
    <React.Fragment>
      <div
        className="flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate3D(0,0,0) scale(1.1, 1)`,
          cursor: 'pointer',
          zIndex: count,
        }}
      >
        {count}
      </div>
    </React.Fragment>
  );
};

const MapPreview = ({ artisans = [], className, loading }: MapPreviewProps) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [mapProps, setMapProps] = useState({
    center: INITIAL_MAP_CENTER,
    zoom: INITIAL_MAP_ZOOM
  });
  const [clusters, setClusters] = useState([]);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  // Function to create clusters based on current zoom level and map bounds
  const createClusters = useCallback(() => {
    if (!map || !maps || !artisans.length) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    // Skip clustering at high zoom levels
    if (zoom >= 14) {
      setClusters(artisans.map(artisan => ({
        lat: artisan.latitude,
        lng: artisan.longitude,
        count: 1,
        id: artisan.id,
        isCluster: false,
        artisan
      })));
      return;
    }

    // Clear existing clusters
    const newClusters = [];
    const clusterMap = {};

    // Grid size decreases as zoom increases (more precise clustering at higher zoom)
    const gridSize = Math.pow(2, 16 - zoom) * 0.005;

    // Create grid-based clusters
    artisans.forEach(artisan => {
      const lat = artisan.latitude;
      const lng = artisan.longitude;

      // Skip if outside current view
      if (bounds && !bounds.contains(new maps.LatLng(lat, lng))) return;

      // Calculate grid cell
      const cellX = Math.floor(lng / gridSize);
      const cellY = Math.floor(lat / gridSize);
      const cellId = `${cellX}-${cellY}`;

      if (!clusterMap[cellId]) {
        clusterMap[cellId] = {
          lat: 0,
          lng: 0,
          count: 0,
          items: [],
          id: cellId,
          isCluster: true
        };
        newClusters.push(clusterMap[cellId]);
      }

      // Add to cluster and update centroid
      clusterMap[cellId].count += 1;
      clusterMap[cellId].items.push(artisan);
      clusterMap[cellId].lat += lat;
      clusterMap[cellId].lng += lng;
    });

    // Calculate final cluster positions (centroids)
    newClusters.forEach(cluster => {
      if (cluster.count > 0) {
        cluster.lat /= cluster.count;
        cluster.lng /= cluster.count;
      }

      // Convert single-item clusters to regular markers
      if (cluster.count === 1) {
        cluster.isCluster = false;
        cluster.artisan = cluster.items[0];
      }
    });

    setClusters(newClusters);
  }, [map, maps, artisans]);

  // Re-cluster when map bounds change
  useEffect(() => {
    if (map && maps) {
      createClusters();

      // Add listeners for map events that should trigger re-clustering
      const boundsChangeListener = map.addListener('bounds_changed', createClusters);
      const zoomChangeListener = map.addListener('zoom_changed', createClusters);

      return () => {
        // Clean up listeners
        maps.event.removeListener(boundsChangeListener);
        maps.event.removeListener(zoomChangeListener);
      };
    }
  }, [map, maps, createClusters]);

  // Animate to selected district
  const animateToDistrict = useCallback((district) => {
    // Reset to default view first
    setMapProps({
      center: INITIAL_MAP_CENTER,
      zoom: INITIAL_MAP_ZOOM
    });

    if (!district) return;

    // Then animate to district
    setTimeout(() => {
      const districtLatLong = districtsLatLong.find(x => x.name === district);
      if (districtLatLong) {
        setMapProps({
          center: {
            lat: districtLatLong.latitude,
            lng: districtLatLong.longitude
          },
          zoom: DISTRICT_ZOOM
        });
      }
    }, 500);
  }, []);

  // Handle Google Maps API loading
  const handleApiLoaded = useCallback(({ map, maps }) => {
    console.log('Google Maps API loaded');
    setMap(map);
    setMaps(maps);

    // Fetch and load GeoJSON
    fetch(GEOJSON_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load GeoJSON');
        }
        return response.json();
      })
      .then(geoJsonData => {
        map.data.addGeoJson(geoJsonData);

        // Style the GeoJSON features
        map.data.setStyle({
          fillColor: 'green',
          strokeColor: 'black',
          fillOpacity: 0.2,
          strokeWeight: 0.5,
        });

        // Add click listener for interactivity
        map.data.addListener('click', (event) => {
          const feature = event.feature;
          const district = feature.getProperty('districts');
          console.log('District clicked:', district);

          animateToDistrict(district);
        });

        // Initial cluster creation
        createClusters();
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError('Failed to load map data.');
      });
  }, [animateToDistrict, createClusters]);

  // Handle cluster click - zoom in or display info
  const handleClusterClick = (cluster) => {
    if (cluster.isCluster && cluster.count > 1) {
      // Zoom in on cluster
      setMapProps({
        center: { lat: cluster.lat, lng: cluster.lng },
        zoom: Math.min(mapProps.zoom + 2, 14)
      });
    } else if (!cluster.isCluster && cluster.artisan) {
      // Show artisan info (you could implement a modal or info window here)
      console.log('Artisan clicked:', cluster.artisan);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

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
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            center={mapProps.center}
            zoom={mapProps.zoom}
            onGoogleApiLoaded={handleApiLoaded}
            options={{
              fullscreenControl: false,
              zoomControl: true,
              clickableIcons: false
            }}
            hoverDistance={30}
            onChange={({ zoom, center }) => {
              setMapProps({ zoom, center });
            }}
          >
            {clusters.map((cluster) => (
              cluster.isCluster ? (
                <ClusterMarker
                  key={cluster.id}
                  lat={cluster.lat}
                  lng={cluster.lng}
                  count={cluster.count}
                  onClick={() => handleClusterClick(cluster)}
                />
              ) : (
                <Marker
                  key={cluster.id || cluster.artisan.id}
                  lat={cluster.lat}
                  lng={cluster.lng}
                  artisan={cluster.artisan}
                  onClick={() => handleClusterClick(cluster)}
                />
              )
            ))}
          </GoogleMapReact>
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium">Punjab Region</p>
              <p className="text-xs text-muted-foreground">{artisans.length} active artisans</p>
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