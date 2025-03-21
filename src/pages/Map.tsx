
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import GoogleMapReact from 'google-map-react';

const Marker = ({ lat, lng, text }) => <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" />;

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultProps = {
    center: {
      lat: 31.1704,
      lng: 72.7097
    },
    zoom: 7
  };
  // Function to handle Google Maps API loading
  const handleApiLoaded = (map, maps) => {
    // Fetch the GeoJSON file from public/assets
    fetch(`../../assets/map/pakistan_districts.geojson`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load GeoJSON');
        }
        return response.json();
      })
      .then((geoJsonData) => {
        // Add GeoJSON to the map
        map.data.addGeoJson(geoJsonData);

        // Optional: Style the GeoJSON features
        map.data.setStyle({
          fillColor: 'blue',
          strokeWeight: 1,
        });

        // Optional: Add click listener for interactivity
        map.data.addListener('click', (event) => {
          const feature = event.feature;
          const infoWindow = new maps.InfoWindow({
            content: `<div>${feature.getProperty('name') || 'No name'}</div>`,
          });
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);
        });

        setLoading(false); // Done loading
      })
      .catch((error) => {
        debugger
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setLoading(false);
      });
  };
  return (
    <Layout>
      <PageHeader
        title="Artisan Map"
        description="Visualize the geographic distribution of artisans across Punjab."
      />

      <div className="rounded-lg overflow-hidden border shadow-sm bg-white">
        <div className="relative aspect-[16/9] w-full">
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCDMOfZ6Xc-MV7pSImhOrf2q8MaYr28shM" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          >
            <Marker
              lat={31.1704}
              lng={72.7097}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
