
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import GoogleMapReact from 'google-map-react';
import { districtsLatLong } from './map-config';

const Marker = ({ lat, lng, artisan }) => <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" />;
const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-[80vh]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
const Map = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artisans, setArtisans]: any = useState([]);
  const [geoLevel, setGeoLevel]: any = useState([]);
  const [divisions, setDivisions]: any = useState([]);
  const [districts, setDistricts]: any = useState([]);
  const [tehsils, setTehsils]: any = useState([]);
  const [mapProps, setMapProps] = useState({
    center: {
      lat: 31.1704,
      lng: 72.7097
    },
    zoom: 7
  });
  setTimeout(() => {
    setLoading(false);
  }, 5000);
  // Function to handle Google Maps API loading
  const handleApiLoaded = (map, maps) => {
    console.log(map);
    console.log(maps);

    // Fetch the GeoJSON file from public/assets
    fetch(`https://beige-cathe-75.tiiny.site/pakistan_districts.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load GeoJSON');
        }
        return response.json();
      })
      .then((geoJsonData) => {
        // Add GeoJSON to the map
        console.log(geoJsonData);
        map.data.addGeoJson(geoJsonData);

        // Optional: Style the GeoJSON features
        map.data.setStyle({
          fillColor: 'green',
          strokeColor: 'black',
          fillOpacity: 0.2,
          strokeWeight: 0.4,
        });

        // Optional: Add click listener for interactivity
        map.data.addListener('click', (event) => {
          const feature = event.feature;
          const district = feature.getProperty('districts');
          console.log(event);

          setMapProps({
            center: {
              lat: 31.1704,
              lng: 72.7097
            },
            zoom: 7
          });
          setTimeout(() => {
            const districtLatLong = districtsLatLong.find(x => x.name === district);
            setMapProps({
              center: {
                lat: districtLatLong.latitude,
                lng: districtLatLong.longitude
              },
              zoom: 8
            });
          }, 500);

          /* const infoWindow = new maps.InfoWindow({
            content: `<div>${feature.getProperty('districts') || 'No name'}</div>`,
          });
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map); */
        });

      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artisanResponse = await fetch(`http://13.239.184.38:6500/artisans`);
        const artisanData = await artisanResponse.json();
        setArtisans(artisanData);
        console.log(artisans);
        const geoLevelResponse = await fetch(`http://13.239.184.38:6500/geo_level`);
        const geoLevelData = await geoLevelResponse.json();
        setGeoLevel(geoLevelData);
        console.log(geoLevel);
        setDivisions(geoLevelData.filter(x => x.code.length === 3));
        setDistricts(geoLevelData.filter(x => x.code.length === 6));
        setTehsils(geoLevelData.filter(x => x.code.length === 9));
        console.log(divisions);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleDropdownChange = (e) => {
    const type = e.target.id;
    if (type == 'division') {
      console.log('division', e.target.value);
    } else if (type == 'district') {
      console.log('district', e.target.value);

    } else if (type == 'tehsil') {
      console.log('tehsil', e.target.value);
    }
  };
  return (
    <Layout>
      <PageHeader
        title="Artisan Map"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 h-[80vh]">
        <div className="rounded-lg overflow-hidden border shadow-sm bg-white w-full">
          <div className="relative aspect-[16/9] w-full h-[80vh]">
            <div hidden={!loading}>
              <LoadingIndicator />
            </div>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyCDMOfZ6Xc-MV7pSImhOrf2q8MaYr28shM" }}
              center={mapProps.center}
              zoom={mapProps.zoom}
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              {artisans.map((artisan) => {
                return (
                  <Marker
                    lat={artisan.latitude}
                    lng={artisan.longitude}
                    artisan={artisan}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border shadow-sm w-full p-4 h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>

          <div className="mb-4">
            <label htmlFor="division" className="block text-sm font-bold mb-2">Division:</label>
            <select id="division" onChange={handleDropdownChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="Punjab">Punjab</option>
              {divisions.map((division) => {
                return (<option value={division.name}>{division.name}</option>);
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="district" className="block text-sm font-bold mb-2">District:</label>
            <select id="district" onChange={handleDropdownChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="All Districts">All Districts</option>
              {districts.map((district) => {
                return (<option value={district.name}>{district.name}</option>);
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="tehsil" className="block text-sm font-bold mb-2">Tehsil:</label>
            <select id="tehsil" onChange={handleDropdownChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="All Tehsils">All Tehsils</option>
              {tehsils.map((tehsil) => {
                return (<option value={tehsil.name}>{tehsil.name}</option>);
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-bold mb-2">Gender:</label>
            <select id="gender" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="education" className="block text-sm font-bold mb-2">Education Level:</label>
            <select id="education" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>None</option>
              <option>Primary</option>
              <option>Secondary</option>
              <option>Higher Education</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="skill" className="block text-sm font-bold mb-2">Skill:</label>
            <select id="skill" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Skill 1</option>
              <option>Skill 2</option>
              <option>Skill 3</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="product" className="block text-sm font-bold mb-2">Major Product:</label>
            <select id="product" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Product 1</option>
              <option>Product 2</option>
              <option>Product 3</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="employment" className="block text-sm font-bold mb-2">Employment Type:</label>
            <select id="employment" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Self-employed</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="loan" className="block text-sm font-bold mb-2">Loan Status:</label>
            <select id="loan" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="machinery" className="block text-sm font-bold mb-2">Has Machinery:</label>
            <select id="machinery" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="training" className="block text-sm font-bold mb-2">Has Training:</label>
            <select id="training" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="inherited" className="block text-sm font-bold mb-2">Inherited Skills:</label>
            <select id="inherited" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="financial" className="block text-sm font-bold mb-2">Financial Assistance:</label>
            <select id="financial" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="technical" className="block text-sm font-bold mb-2">Technical Assistance:</label>
            <select id="technical" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="dependents" className="block text-sm font-bold mb-2">Dependents Count:</label>
            <input type="number" id="dependents" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-bold mb-2">Experience:</label>
            <input type="number" id="experience" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="income" className="block text-sm font-bold mb-2">Avg Monthly Income:</label>
            <input type="number" id="income" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
