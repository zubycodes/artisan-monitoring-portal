
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import GoogleMapReact from 'google-map-react';
import { districtsLatLong } from './map-config';

const Marker = ({ lat, lng, artisan }) => <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" onClick={() => handleMarkerClick(artisan)} />;
const handleMarkerClick = (artisan) => {
  console.log('Marker clicked', artisan);
};

const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-[80vh]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
const tables = [
  'education',
  'crafts',
  'categories',
  'techniques',
  'users',
  'artisans',
  'geo_level'
]
const Map = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artisans, setArtisans]: any = useState([]);
  const [geoLevel, setGeoLevel]: any = useState([]);
  const [divisions, setDivisions]: any = useState([]);
  const [districts, setDistricts]: any = useState([]);
  const [tehsils, setTehsils]: any = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [techniqueSkills, setTechniqueSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [users, setUsers] = useState([]);
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
        for (const tableName of tables) {
          const response = await fetch(`http://13.239.184.38:6500/${tableName}`);
          const data = await response.json();
          switch (tableName) {
            case 'artisans':
              setArtisans(data);
              break;
            case 'education':
              setEducation(data);
              break;
            case 'crafts':
              setCrafts(data);
              break;
            case 'categories':
              setCategories(data);
              break;
            case 'techniques':
              setTechniqueSkills(data);
              break;
            case 'users':
              setUsers(data);
              break;
            case 'geo_level':
              setGeoLevel(data);
              setDivisions(geoLevel.filter(x => x.code.length === 3));
              setDistricts(geoLevel.filter(x => x.code.length === 6));
              setTehsils(geoLevel.filter(x => x.code.length === 9));
              break;
            default:
              console.warn(`Unknown table name: ${tableName}`);
          }
        }
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
      setMapProps({
        center: {
          lat: 31.1704,
          lng: 72.7097
        },
        zoom: 7
      });
      setTimeout(() => {
        const districtLatLong = districtsLatLong.find(x => x.name === e.target.value);
        setMapProps({
          center: {
            lat: districtLatLong.latitude,
            lng: districtLatLong.longitude
          },
          zoom: 8
        });
      }, 500);

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
            <div>
              <label htmlFor="division" className="block text-sm font-bold mb-2">Division:</label>
              <select id="division" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
                <option value="Punjab">Punjab</option>
                {divisions.map((division) => {
                  return (<option value={division.name}>{division.name}</option>);
                })}
              </select>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-bold mb-2">District:</label>
              <select id="district" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
                <option value="Select">Select</option>
                {districts.map((district) => {
                  return (<option value={district.name}>{district.name}</option>);
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
            <div>
              <label htmlFor="tehsil" className="block text-sm font-bold mb-2">Tehsil:</label>
              <select id="tehsil" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
                <option value="Select">Select</option>
                {tehsils.map((tehsil) => {
                  return (<option value={tehsil.name}>{tehsil.name}</option>);
                })}
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-bold mb-2">Union Council:</label>
              <input type="text" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                placeholder="UC" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
            <div>
              <label htmlFor="craft" className="block text-sm font-bold mb-2">Craft:</label>
              <select id="craft" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
                <option value="Select">Select</option>
                {crafts.map((craft) => {
                  return (<option value={craft.name}>{craft.name}</option>);
                })}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-bold mb-2">Category:</label>
              <select id="category" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
                <option value="Select">Select</option>
                {categories.map((category) => {
                  return (<option value={category.name}>{category.name}</option>);
                })}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="techniqueSkills" className="block text-sm font-bold mb-2">Technique/Skills:</label>
            <select id="techniqueSkills" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option value="Select">Select</option>
              {techniqueSkills.map((techniqueSkills) => {
                return (<option value={techniqueSkills.name}>{techniqueSkills.name}</option>);
              })}
            </select>
          </div>



          <div className="mb-4">
            <label htmlFor="education" className="block text-sm font-bold mb-2">Education Level:</label>
            <select id="education" onChange={handleDropdownChange} className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option value="Select">Select</option>
              {education.map((edu) => {
                return (<option value={edu.name}>{edu.name}</option>);
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="product" className="block text-sm font-bold mb-2">Major Product:</label>
            <select id="product" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Product 1</option>
              <option>Product 2</option>
              <option>Product 3</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="employment" className="block text-sm font-bold mb-2">Employment Type:</label>
            <select id="employment" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Self-employed</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="loan" className="block text-sm font-bold mb-2">Seeking Loan:</label>
            <select id="loan" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="machinery" className="block text-sm font-bold mb-2">Has Machinery:</label>
            <select id="machinery" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="training" className="block text-sm font-bold mb-2">Has Training:</label>
            <select id="training" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="inherited" className="block text-sm font-bold mb-2">Inherited Skills:</label>
            <select id="inherited" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="financial" className="block text-sm font-bold mb-2">Financial Assistance Required:</label>
            <select id="financial" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="technical" className="block text-sm font-bold mb-2">Technical Assistance Required:</label>
            <select id="technical" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="dependents" className="block text-sm font-bold mb-2">Dependents Count:</label>
            <input type="number" id="dependents" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-bold mb-2">Experience:</label>
            <input type="number" id="experience" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="income" className="block text-sm font-bold mb-2">Avg Monthly Income:</label>
            <input type="number" id="income" className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
