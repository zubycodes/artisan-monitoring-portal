import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import GoogleMapReact from "google-map-react";
import { districtsLatLong } from "./map-config";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EyeIcon, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArtisanDetail from "./ArtisanDetail";
import FiltersAll from "@/components/dashboard/FiltersAll";
import { SelectOption } from "@/components/dashboard/Filters";

// Constants
const API_BASE_URL = "http://3.106.165.252:6500";
const GEOJSON_URL = "https://beige-cathe-75.tiiny.site/pakistan_districts.json";
const GOOGLE_MAPS_API_KEY = "AIzaSyCDMOfZ6Xc-MV7pSImhOrf2q8MaYr28shM";
const INITIAL_MAP_CENTER = { lat: 31.1704, lng: 72.7097 };
const INITIAL_MAP_ZOOM = 7;
const DISTRICT_ZOOM = 9;

const Marker = ({ lat, lng, artisan, $hover = false, onClick }) => {
  return (
    <div
      className="relative"
      onClick={(event) => {
        event.stopPropagation();
        onClick(artisan);
      }}
    >
      {/* <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={3} stroke="#000" fill={artisan.craft_color} width="20px" height="20px" viewBox="0 0 1920 1920">
        <path d="M956.952 0c-362.4 0-657 294.6-657 656.88 0 180.6 80.28 347.88 245.4 511.56 239.76 237.96 351.6 457.68 351.6 691.56v60h120v-60c0-232.8 110.28-446.16 357.6-691.44 165.12-163.8 245.4-331.08 245.4-511.68 0-362.28-294.6-656.88-663-656.88" />
      </svg> */}

      {/*  <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={3} stroke="#000" fill={artisan.craft_color} width="20px" height="20px" viewBox="0 0 1920 1920">
        <path d="M1290 1083.396c-114.12 113.16-253.68 269.88-332.04 466.8-76.92-199.08-215.16-354.84-327.96-466.92-141.36-140.04-210-279.48-210-426.48 0-295.92 240.84-536.76 543.12-536.76 296.04 0 536.88 240.84 536.88 536.76 0 147-68.64 286.44-210 426.6M956.88.036C594.72.036 300 294.636 300 656.796c0 180.6 80.28 348 245.4 511.68 239.76 237.84 351.48 457.56 351.48 691.56v60h120v-60c0-232.92 110.4-446.16 357.72-691.44 165.12-163.8 245.4-331.2 245.4-511.8C1620 294.636 1325.28.036 956.88.036" fill-rule="evenodd" />
      </svg>
      */}
      {/* <MapPin onClick={(event) => { event.stopPropagation(); onClick(artisan); }} size={20} style={{ color: artisan.craft_color }} /> */}
      <img
        src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        width="20"
        height="10"
        className={`cursor-pointer transition-transform ${
          $hover ? "scale-110" : ""
        }`}
        onClick={(event) => {
          event.stopPropagation();
          onClick(artisan);
        }}
        alt="Marker"
      />
    </div>
  );
};

const InfoWindow = ({ lat, lng, artisanId, onClose }) => {
  const [artisanData, setArtisanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const fetchArtisan = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`${API_BASE_URL}/artisans/${artisanId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch artisan data");
        }
        const data = await response.json();
        if (isMounted) {
          setArtisanData(data); // Update state only if mounted
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message); // Set error only if mounted
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Stop loading only if mounted
        }
      }
    };

    fetchArtisan();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [artisanId]); // Re-run effect if artisanId changes

  // Shimmer animation for loading state
  const ShimmerEffect = () => (
    <div className="animate-pulse">
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex text-sm mb-2">
        <div className="text-gray-500">Education:</div>
        <div className="ms-2 h-4 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="flex text-sm mb-2">
        <div className="text-gray-500">Experience:</div>
        <div className="ms-2 h-4 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="flex text-sm mb-2">
        <div className="text-gray-500">Location:</div>
        <div className="ms-2 h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Render error state
  if (error) {
    return (
      <div className="ms-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">Error</h3>
            <button
              className="text-white opacity-80 hover:opacity-100 transition"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ms-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-lg truncate">
            {loading
              ? "Loading..."
              : artisanData.name + " " + artisanData.father_name || "Artisan"}
          </h3>
          <button
            className="text-white opacity-80 hover:opacity-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-indigo-100 font-medium">
          {loading ? "Loading..." : artisanData.craft_name || "Craft N/A"}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {loading ? (
          <ShimmerEffect />
        ) : (
          <>
            {/* Tags section */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                {artisanData.category_name || "Category N/A"}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {artisanData.skill_name || "Skill N/A"}
              </span>
              {artisanData.inherited_skills == "Yes" && (
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                  Inherited Skills
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="flex text-sm">
              <div className="text-gray-500 font-medium">Education:</div>
              <div className="ms-2 text-gray-800 truncate">
                {artisanData.education_name || "N/A"}
              </div>
            </div>
            <div className="flex text-sm">
              <div className="text-gray-500 font-medium">Experience:</div>
              <div className="ms-2 text-gray-800">
                {artisanData.experience || "N/A"} years
              </div>
            </div>
            <div className="flex text-sm">
              <div className="text-gray-500 font-medium">Location:</div>
              <div className="ms-2 text-gray-800">
                {artisanData.district_name || "N/A"},{" "}
                {artisanData.tehsil_name || ""}
              </div>
            </div>
            <div className="flex w-full justify-end text-sm mt-1">
              <Button
                variant="outline"
                className="small"
                onClick={() =>
                  window.open(`/artisans/${artisanData.id}`, "_blank")
                }
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View Details
              </Button>
              {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>{artisanData.name} {artisanData.father_name}</DialogTitle>
                  </DialogHeader>
                  <div className="flex-grow overflow-y-auto">
                    <ArtisanDetail artisan_id={artisanData.id} />
                  </div>
                </DialogContent>
              </Dialog> */}
            </div>

            {/* Status indicator */}
            {artisanData.financial_assistance_required && (
              <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Requires Financial Assistance
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const LoadingIndicator = ({ sm = false }) => (
  <div className="flex items-center justify-center">
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${
        sm ? "h-16 w-16" : "h-32 w-32"
      }`}
    ></div>
  </div>
);

const FilterSection = ({ data, onChange }) => {
  const { divisions, districts, tehsils, crafts, categories, techniqueSkills } =
    data;

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm w-full p-4 h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Filters</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="division" className="block text-sm font-bold mb-2">
            Division:
          </label>
          <select
            id="division"
            onChange={onChange}
            disabled={true}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.name}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-bold mb-2">
            District:
          </label>
          <select
            id="district"
            onChange={onChange}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="tehsil" className="block text-sm font-bold mb-2">
            Tehsil:
          </label>
          <select
            id="tehsil"
            onChange={onChange}
            disabled={true}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {tehsils.map((tehsil) => (
              <option key={tehsil.id} value={tehsil.name}>
                {tehsil.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="unionCouncil"
            className="block text-sm font-bold mb-2"
          >
            Union Council:
          </label>
          <input
            type="text"
            id="unionCouncil"
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
            placeholder="UC"
            disabled={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-4">
        <div>
          <label htmlFor="craft" className="block text-sm font-bold mb-2">
            Craft:
          </label>
          <select
            id="craft"
            onChange={onChange}
            disabled={true}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {crafts.map((craft) => (
              <option key={craft.id} value={craft.name}>
                {craft.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-2">
            Category:
          </label>
          <select
            id="category"
            onChange={onChange}
            disabled={true}
            className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Select">Select</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="techniqueSkills"
          className="block text-sm font-bold mb-2"
        >
          Technique/Skills:
        </label>
        <select
          id="techniqueSkills"
          onChange={onChange}
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Select">Select</option>
          {techniqueSkills.map((techniqueSkill) => (
            <option key={techniqueSkill.id} value={techniqueSkill.name}>
              {techniqueSkill.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="product" className="block text-sm font-bold mb-2">
          Major Product:
        </label>
        <select
          id="product"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Product 1</option>
          <option>Product 2</option>
          <option>Product 3</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="employment" className="block text-sm font-bold mb-2">
          Employment Type:
        </label>
        <select
          id="employment"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Self-employed</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="loan" className="block text-sm font-bold mb-2">
          Seeking Loan:
        </label>
        <select
          id="loan"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="machinery" className="block text-sm font-bold mb-2">
          Has Machinery:
        </label>
        <select
          id="machinery"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="training" className="block text-sm font-bold mb-2">
          Has Training:
        </label>
        <select
          id="training"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="inherited" className="block text-sm font-bold mb-2">
          Inherited Skills:
        </label>
        <select
          id="inherited"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="financial" className="block text-sm font-bold mb-2">
          Financial Assistance Required:
        </label>
        <select
          id="financial"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="technical" className="block text-sm font-bold mb-2">
          Technical Assistance Required:
        </label>
        <select
          id="technical"
          disabled={true}
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="dependents" className="block text-sm font-bold mb-2">
          Dependents Count:
        </label>
        <input
          type="number"
          disabled={true}
          id="dependents"
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="experience" className="block text-sm font-bold mb-2">
          Experience:
        </label>
        <input
          type="number"
          disabled={true}
          id="experience"
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="income" className="block text-sm font-bold mb-2">
          Avg Monthly Income:
        </label>
        <input
          type="number"
          disabled={true}
          id="income"
          className="shadow appearance-none border w-full py-2 px-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
};

const GoogleMap = ({
  artisans,
  styles,
  selectedArtisan,
  mapProps,
  onMarkerClick,
  onApiLoaded,
  onMapChange,
}) => (
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
          clickableIcons: false,
          styles,
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
            artisanId={selectedArtisan.id}
            onClose={() => onMarkerClick(null)}
          />
        )}
      </GoogleMapReact>
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
    users: [],
  });
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [mapProps, setMapProps] = useState({
    center: INITIAL_MAP_CENTER,
    zoom: INITIAL_MAP_ZOOM,
  });

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [craft, setCraft] = useState("");
  const [category, setCategory] = useState("");
  const [techniquesSkills, setTechniquesSkills] = useState("");
  const [tehsil, setTehsil] = useState("");

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tables = ["artisans"];
        const results = await Promise.all(
          tables.map((table) =>
            fetch(
              `${API_BASE_URL}/${table}?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&skill=${techniquesSkills}&tehsil=${tehsil}`
            ).then((response) => response.json())
          )
        );

        // Update state with fetched data
        setMapData((prevData) => ({
          ...prevData,
          artisans: results[0],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [division, district, gender, craft, category, tehsil, techniquesSkills]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (artisan) => {
      console.log("Marker clicked", artisan);
      // Toggle off if same artisan is clicked again
      if (!artisan) {
        setSelectedArtisan(null);
        setMapProps({
          center: INITIAL_MAP_CENTER,
          zoom: INITIAL_MAP_ZOOM,
        });
        return;
      }
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
            lng: parseFloat(artisan.longitude),
          },
          zoom: 10,
        });
        setTimeout(() => {
          setMapProps({
            center: {
              lat: parseFloat(artisan.latitude),
              lng: parseFloat(artisan.longitude),
            },
            zoom: 13,
          });
        }, 600);
      }
    },
    [selectedArtisan, mapInstance]
  );

  // Handle map change (zoom/pan)
  const handleMapChange = useCallback(
    () => {
      // Close info window when map moves or zooms
      /* if (selectedArtisan) setSelectedArtisan(null); */
    },
    [
      /* selectedArtisan */
    ]
  );

  // Animate to selected district
  const animateToDistrict = useCallback((district) => {
    // Reset to default view first
    setMapProps({
      center: INITIAL_MAP_CENTER,
      zoom: INITIAL_MAP_ZOOM,
    });
    if (!district) return;
    // Then animate to district
    setTimeout(() => {
      const districtLatLong = districtsLatLong.find((x) => x.name === district);
      if (districtLatLong) {
        setMapProps({
          center: {
            lat: districtLatLong.latitude,
            lng: districtLatLong.longitude,
          },
          zoom: DISTRICT_ZOOM,
        });
      }
    }, 500);
  }, []);

  // Handle Google Maps API loading
  const handleApiLoaded = useCallback(
    ({ map, maps }) => {
      console.log("Google Maps API loaded");
      setMapInstance(map);
      setMapsApi(maps);

      // Fetch and load GeoJSON
      fetch(GEOJSON_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load GeoJSON");
          }
          return response.json();
        })
        .then((geoJsonData) => {
          map.data.addGeoJson(geoJsonData);

          // Style the GeoJSON features
          map.data.setStyle({
            fillColor: "green",
            strokeColor: "black",
            fillOpacity: 0.2,
            strokeWeight: 0.5,
          });

          // Add click listener for interactivity
          map.data.addListener("click", (event) => {
            const feature = event.feature;
            const district = feature.getProperty("districts");
            console.log("District clicked:", district);

            setSelectedArtisan(null);
            animateToDistrict(district);
          });
        })
        .catch((error) => {
          console.error("Error loading GeoJSON:", error);
          setError("Failed to load map data.");
          setLoading(false);
        });
    },
    [animateToDistrict]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (selected: {
      division: SelectOption;
      district: SelectOption;
      tehsil: SelectOption;
      gender: SelectOption;
      craft: SelectOption;
      category: SelectOption;
      techniques: SelectOption;
    }) => {
      // Update the state with the selected values
      setDivision(
        selected.division.name == "Select" ? "" : selected.division.name
      );
      setDistrict(
        selected.district.name == "Select" ? "" : selected.district.name
      );
      setTehsil(selected.tehsil.name == "Select" ? "" : selected.tehsil.name);
      setCraft(selected.craft.name == "Select" ? "" : selected.craft.name);
      setCategory(
        selected.category.name == "Select" ? "" : selected.category.name
      );
      setTechniquesSkills(
        selected.techniques.name == "Select" ? "" : selected.techniques.name
      );
      setGender(selected.gender.name == "Select" ? "" : selected.gender.name);

      handleMarkerClick(null);

      if (selected.district.name === "Select") {
        animateToDistrict(null);
        return;
      }

      if (selected.district.name) {
        animateToDistrict(selected.district.name);
      }
    },
    [animateToDistrict]
  );
  const mapStyles = [
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];
  return (
    <Layout>
      <PageHeader title="Artisan Map" />
      <FiltersAll onChange={handleFilterChange} />

      <div className="grid grid-cols-1 gap-6 h-[80vh]">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <GoogleMap
            artisans={mapData.artisans}
            selectedArtisan={selectedArtisan}
            mapProps={mapProps}
            styles={mapStyles}
            onMarkerClick={handleMarkerClick}
            onApiLoaded={handleApiLoaded}
            onMapChange={handleMapChange}
          />
        )}

        {/* <FilterSection data={mapData} onChange={handleFilterChange} /> */}
      </div>
    </Layout>
  );
};

export default Map;
