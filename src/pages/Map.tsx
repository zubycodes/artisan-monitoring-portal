import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import GoogleMapReact from 'google-map-react';
import { districtsLatLong } from './map-config';

// Constants
const API_BASE_URL = 'http://13.239.184.38:6500';
const GEOJSON_URL = 'https://beige-cathe-75.tiiny.site/pakistan_districts.json';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCDMOfZ6Xc-MV7pSImhOrf2q8MaYr28shM';
const INITIAL_MAP_CENTER = { lat: 31.1704, lng: 72.7097 };
const INITIAL_MAP_ZOOM = 7;
const DISTRICT_ZOOM = 9;

const Marker = ({ lat, lng, artisan, $hover = false, onClick }) => {
  return (
    <div className="relative">
      <img
        src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        className={`cursor-pointer transition-transform ${$hover ? 'scale-110' : ''}`}
        onClick={(event) => { event.stopPropagation(); onClick(artisan); }}
        alt="Marker"
      />
    </div>
  );
};

const InfoWindow = ({ lat, lng, artisan, onClose }) => (
  <div className="absolute bottom-8 left-0 w-64 bg-white p-3 rounded shadow-lg z-10 border border-gray-300">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-muted text-lg">{artisan.name || "Artisan"}</h3>
      <button
        className="text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✕
      </button>
    </div>
    <div className="space-y-1 text-muted text-sm">
      <p><strong>Craft:</strong> {artisan.craft_id || "N/A"}</p>
      <p><strong>District:</strong> {artisan.district || "N/A"}</p>
      <p><strong>Tehsil:</strong> {artisan.tehsil || "N/A"}</p>
      <p><strong>Experience:</strong> {artisan.experience || "N/A"} years</p>
      <p><strong>Education:</strong> {artisan.education_id || "N/A"}</p>
      {artisan.inherited_skills && (
        <p><strong>Inherited Skills:</strong> Yes</p>
      )}
      {artisan.financial_assistance_required && (
        <p><strong>Needs Financial Assistance:</strong> Yes</p>
      )}
    </div>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-[80vh]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const FilterSection = ({ data, onChange }) => {
  const { divisions, districts, tehsils, crafts, categories, techniqueSkills } = data;

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm w-full p-4 h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Filters</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="division" className="block text-sm font-bold mb-2">Division:</label>
          <select
            id="division"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            <option value="Punjab">Punjab</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.name}>{division.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-bold mb-2">District:</label>
          <select
            id="district"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="tehsil" className="block text-sm font-bold mb-2">Tehsil:</label>
          <select
            id="tehsil"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {tehsils.map((tehsil) => (
              <option key={tehsil.id} value={tehsil.name}>{tehsil.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="unionCouncil" className="block text-sm font-bold mb-2">Union Council:</label>
          <input
            type="text"
            id="unionCouncil"
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
            placeholder="UC"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="craft" className="block text-sm font-bold mb-2">Craft:</label>
          <select
            id="craft"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {crafts.map((craft) => (
              <option key={craft.id} value={craft.name}>{craft.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-2">Category:</label>
          <select
            id="category"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="techniqueSkills" className="block text-sm font-bold mb-2">Technique/Skills:</label>
        <select
          id="techniqueSkills"
          onChange={onChange}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Select">Select</option>
          {techniqueSkills.map((techniqueSkill) => (
            <option key={techniqueSkill.id} value={techniqueSkill.name}>{techniqueSkill.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const GoogleMap = ({ artisans, selectedArtisan, mapProps, onMarkerClick, onApiLoaded, onMapChange }) => (
  <div className="rounded-lg overflow-hidden border shadow-sm bg-white w-full">
    <div className="relative aspect-[16/9] w-full h-[80vh]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
        center={mapProps.center}
        zoom={mapProps.zoom}
        onGoogleApiLoaded={onApiLoaded}
        options={{
          fullscreenControl: false,
          zoomControl: true,
          clickableIcons: false
        }}
        hoverDistance={30}
      >
        {artisans.map((artisan) => (
          <Marker
            key={artisan.id}
            lat={artisan.latitude}
            lng={artisan.longitude}
            artisan={artisan}
            onClick={onMarkerClick}
          />
        ))}
        {selectedArtisan && (
          <InfoWindow
            lat={selectedArtisan.latitude}
            lng={selectedArtisan.longitude}
            artisan={selectedArtisan}
            onClose={() => onMarkerClick(null)}
          />
        )}
      </GoogleMapReact>
      {selectedArtisan?.id}
    </div>
  </div>
);

const Map = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapData, setMapData] = useState({
    artisans: [],
    geoLevel: [],
    divisions: [],
    districts: [],
    tehsils: [],
    crafts: [],
    categories: [],
    techniqueSkills: [],
    education: [],
    users: []
  });
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [mapProps, setMapProps] = useState({
    center: INITIAL_MAP_CENTER,
    zoom: INITIAL_MAP_ZOOM
  });

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tables = ['artisans', 'education', 'crafts', 'categories', 'techniques', 'users', 'geo_level'];
        const results = await Promise.all(
          tables.map(table =>
            fetch(`${API_BASE_URL}/${table}`)
              .then(response => response.json())
          )
        );

        // Update state with fetched data
        setMapData(prevData => ({
          ...prevData,
          artisans: results[0],
          education: results[1],
          crafts: results[2],
          categories: results[3],
          techniqueSkills: results[4],
          users: results[5],
          geoLevel: results[6]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Process geo data when it changes
  useEffect(() => {
    if (mapData.geoLevel && mapData.geoLevel.length) {
      setMapData(prevData => ({
        ...prevData,
        divisions: mapData.geoLevel.filter(x => x.code?.length === 3),
        districts: mapData.geoLevel.filter(x => x.code?.length === 6),
        tehsils: mapData.geoLevel.filter(x => x.code?.length === 9)
      }));
    }
  }, [mapData.geoLevel]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((artisan) => {
    console.log('Marker clicked', artisan);
    // Toggle off if same artisan is clicked again
    if (selectedArtisan && selectedArtisan.id === artisan?.id) {
      setSelectedArtisan(null);
      return;
    }

    // Set selected artisan and update map center
    setSelectedArtisan(artisan);
    if (mapInstance && artisan) {
      setMapProps({
        center: {
          lat: parseFloat(artisan.latitude),
          lng: parseFloat(artisan.longitude)
        },
        zoom: 11
      });
    }
    console.log('selectedArtisan', selectedArtisan);
  }, [selectedArtisan, mapInstance]);

  // Handle map change (zoom/pan)
  const handleMapChange = useCallback(() => {
    // Close info window when map moves or zooms
    /* if (selectedArtisan) setSelectedArtisan(null); */
  }, [/* selectedArtisan */]);

  // Animate to selected district
  const animateToDistrict = useCallback((district) => {
    // Reset to default view first
    setMapProps({
      center: INITIAL_MAP_CENTER,
      zoom: INITIAL_MAP_ZOOM
    });

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
    setMapInstance(map);
    setMapsApi(maps);

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
          fillOpacity: 0.1,
          strokeWeight: 0.4,
        });

        // Add click listener for interactivity
        map.data.addListener('click', (event) => {
          const feature = event.feature;
          const district = feature.getProperty('districts');
          console.log('District clicked:', district);

          setSelectedArtisan(null);
          animateToDistrict(district);
        });
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError('Failed to load map data.');
        setLoading(false);
      });
  }, [animateToDistrict]);

  // Handle filter changes
  const handleFilterChange = useCallback((e) => {
    const type = e.target.id;
    const value = e.target.value;

    if (value === 'Select') return;

    console.log(`${type} selected:`, value);

    if (type === 'district') {
      animateToDistrict(value);
    }
  }, [animateToDistrict]);

  return (
    <Layout>
      <PageHeader title="Artisan Map" />

      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 h-[80vh]">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <GoogleMap
            artisans={mapData.artisans}
            selectedArtisan={selectedArtisan}
            mapProps={mapProps}
            onMarkerClick={handleMarkerClick}
            onApiLoaded={handleApiLoaded}
            onMapChange={handleMapChange}
          />
        )}

        <FilterSection
          data={mapData}
          onChange={handleFilterChange}
        />
      </div>
    </Layout>
  );
};

export default Map;