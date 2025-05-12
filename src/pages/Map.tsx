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
import DistrictGeoJson from "../assets/map/districts.json";

// Constants
const API_BASE_URL = "https://artisan-psic.com";
const GEOJSON_URL = DistrictGeoJson;
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

      {/*   <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={3} stroke="#000" fill={artisan.craft_color} width="20px" height="20px" viewBox="0 0 1920 1920">
        <path d="M1290 1083.396c-114.12 113.16-253.68 269.88-332.04 466.8-76.92-199.08-215.16-354.84-327.96-466.92-141.36-140.04-210-279.48-210-426.48 0-295.92 240.84-536.76 543.12-536.76 296.04 0 536.88 240.84 536.88 536.76 0 147-68.64 286.44-210 426.6M956.88.036C594.72.036 300 294.636 300 656.796c0 180.6 80.28 348 245.4 511.68 239.76 237.84 351.48 457.56 351.48 691.56v60h120v-60c0-232.92 110.4-446.16 357.72-691.44 165.12-163.8 245.4-331.2 245.4-511.8C1620 294.636 1325.28.036 956.88.036" fill-rule="evenodd" />
      </svg> */}

      <MapPin onClick={(event) => { event.stopPropagation(); onClick(artisan); }} stroke="black" fill={artisan.craft_color} size={22} />
      {/* <img
        src="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        width="20"
        height="10"
        className={`cursor-pointer transition-transform ${$hover ? "scale-110" : ""
          }`}
        onClick={(event) => {
          event.stopPropagation();
          onClick(artisan);
        }}
        alt="Marker"
      /> */}
    </div>
  );
};
const InfoWindow = ({ lat, lng, artisanId, onClose }) => {
  const [artisanData, setArtisanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const fetchArtisan = async () => {
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

  // Helper function to get image URL or placeholder
  const getImageUrl = (imagePath) => {
    return imagePath || "https://via.placeholder.com/150?text=No+Image";
  };

  // Shimmer animation for loading state
  const ShimmerEffect = () => (
    <div className="animate-pulse">
      <div className="flex items-center mb-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 mr-3"></div>
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Render error state
  if (error) {
    return (
      <div className="ms-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-3">
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
                className="h-5 w-5"
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
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const properCase = (text) => {
    if (!text) return "";
    return text.split(' ').map(word =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
    ).join(' ');
  };

  return (
    <div className="ms-4 bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '28rem' }}>
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-lg truncate">
            {loading
              ? "Loading..."
              : properCase(artisanData.name) + " " + properCase(artisanData.father_name || "")}
          </h3>
          <button
            className="text-white bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          {loading ? "Loading..." : artisanData.employment_type || ""}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {loading ? (
          <ShimmerEffect />
        ) : (
          <>
            {/* Profile picture and name section */}
            <div className="flex items-center mb-4">
              <div className="relative">
                <img
                  src={getImageUrl(artisanData.profile_picture)}
                  alt={`${artisanData.name} profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                  onError={(e: any) =>
                    ((e.target).src = "https://via.placeholder.com/150?text=No+Image")
                  }
                />
                {artisanData.inherited_skills === "Yes" && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800 text-base">
                  {properCase(artisanData.name) + " " + properCase(artisanData.father_name || "")}
                </h4>
                <p className="text-gray-500 text-sm">
                  {artisanData.district_name || "N/A"}, {artisanData.tehsil_name || ""}
                </p>
              </div>
            </div>

            {/* Tags section */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1  text-xs font-medium rounded-full flex text-white items-center" style={{ backgroundColor: artisanData.craft_color }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" fill={artisanData.craft_color} strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {artisanData.craft_name || "Craft N/A"}
              </span>
              <span className="px-3 py-1  text-xs font-medium rounded-full flex  items-center" style={{ backgroundColor: artisanData.category_color }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {artisanData.category_name || "Category N/A"}
              </span>
              <span className="px-3 py-1  text-xs font-medium rounded-full flex  items-center" style={{ backgroundColor: artisanData.skill_color }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {artisanData.skill_name || "Skill N/A"}
              </span>
            </div>

            {/* Status indicators section */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artisanData.inherited_skills === "Yes" && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11l3 3m0 0l-3 3m3-3H4m5-8l-3-3m0 0l3-3m-3 3h14" />
                  </svg>
                  Inherited Skills
                </span>
              )}

              {artisanData.loan_status === "Yes" && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Has Loan
                </span>
              )}

              {artisanData.has_machinery === "Yes" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Has Machinery
                </span>
              )}

              {artisanData.has_training === "Yes" && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Trained
                </span>
              )}

              {artisanData.financial_assistance === "Yes" && (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Financial Aid
                </span>
              )}

              {artisanData.technical_assistance === "Yes" && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Technical Aid
                </span>
              )}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Education</div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {artisanData.education_name || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Experience</div>
                <div className="text-sm font-medium text-gray-800">
                  {artisanData.experience || "N/A"} years
                </div>
              </div>
            </div>

            {/* Status indicator */}
            {artisanData.financial_assistance_required && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Requires Financial Assistance</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center mt-2">
              <button
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center"
                onClick={(e) => { window.open(`/artisans-directory/${artisanData.id}`, "_blank"); e.stopPropagation(); }}
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                View Details
              </button>

              <button
                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center"
                onClick={(e) => { window.open(`/artisans-directory/${artisanData.id}`, "_blank"); e.stopPropagation(); }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Contact
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const LoadingIndicator = ({ sm = false }) => (
  <div className="flex items-center justify-center">
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sm ? "h-16 w-16" : "h-32 w-32"
        }`}
    ></div>
  </div>
);

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
          mapTypeId: "hybrid",
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
            onClose={() => onMarkerClick(null, true)}
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
  const [mapInteraction, setMapInteraction] = useState(false);
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

  const [education, setEducation] = useState("");
  const [rawMaterialFilter, setRawMaterialFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState(""); // Corresponds to 'employment_type_id' in FiltersProps
  const [craftingMethodFilter, setCraftingMethodFilter] = useState(""); // Corresponds to 'crafting_method' in FiltersProps
  const [avgMonthlyIncomeFilter, setAvgMonthlyIncomeFilter] = useState(""); // Corresponds to 'avg_monthly_income' in FiltersProps
  const [dependentsCountFilter, setDependentsCountFilter] = useState(""); // Corresponds to 'dependents_count' in FiltersProps
  const [inheritedSkillsFilter, setInheritedSkillsFilter] = useState(""); // Corresponds to 'inherited_skills' in FiltersProps
  const [hasMachineryFilter, setHasMachineryFilter] = useState(""); // Corresponds to 'has_machinery' in FiltersProps
  const [hasTrainingFilter, setHasTrainingFilter] = useState(""); // Corresponds to 'has_training' in FiltersProps
  const [loanStatusFilter, setLoanStatusFilter] = useState(""); // Corresponds to 'loan_status' in FiltersProps
  const [financialAssistanceFilter, setFinancialAssistanceFilter] = useState(""); // Corresponds to 'financial_assistance' in FiltersProps
  const [technicalAssistanceFilter, setTechnicalAssistanceFilter] = useState(""); // Corresponds to 'technical_assistance' in FiltersProps
  const [query, setQuery] = useState(""); // Corresponds to 'technical_assistance' in FiltersProps
  const [uc, setUC] = useState(""); // Corresponds to 'technical_assistance' in FiltersProps

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {

        const queryParams = new URLSearchParams();

        // Helper function to append parameter only if the value is truthy
        // Adjust the condition (e.g., `value !== undefined && value !== null`) if empty strings should be sent
        const appendIfPresent = (key: string, value: string | undefined | null) => {
          if (value) {
            queryParams.append(key, value);
          }
        };

        // Append all relevant filters using the helper
        appendIfPresent('name', query);
        appendIfPresent('uc', uc);
        appendIfPresent('division', division);
        appendIfPresent('district', district);
        appendIfPresent('gender', gender);
        appendIfPresent('craft', craft);
        appendIfPresent('category', category);
        appendIfPresent('skill', techniquesSkills); // API expects 'skill' for techniquesSkills
        appendIfPresent('tehsil', tehsil);
        appendIfPresent('education', education);
        appendIfPresent('raw_material', rawMaterialFilter);
        appendIfPresent('employment_type', employmentTypeFilter);
        appendIfPresent('crafting_method', craftingMethodFilter);
        appendIfPresent('avg_monthly_income', avgMonthlyIncomeFilter);
        appendIfPresent('dependents_count', dependentsCountFilter);
        appendIfPresent('inherited_skills', inheritedSkillsFilter);
        appendIfPresent('has_machinery', hasMachineryFilter);
        appendIfPresent('has_training', hasTrainingFilter);
        appendIfPresent('loan_status', loanStatusFilter);
        appendIfPresent('financial_assistance', financialAssistanceFilter);
        appendIfPresent('technical_assistance', technicalAssistanceFilter);

        const queryString = queryParams.toString();
        // Append query string only if it has parameters

        const tables = ["artisans"];
        const results = await Promise.all(
          tables.map((table) =>
            fetch(
              `${API_BASE_URL}/${table}${queryString ? `?${queryString}` : ''}`
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
  }, [division, district, gender, craft, category, tehsil, techniquesSkills,
    education, rawMaterialFilter, employmentTypeFilter, craftingMethodFilter,
    avgMonthlyIncomeFilter, dependentsCountFilter, inheritedSkillsFilter, hasMachineryFilter,
    hasTrainingFilter, loanStatusFilter, financialAssistanceFilter, technicalAssistanceFilter, query, uc]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (artisan, closeWindow = false) => {
      console.log("Marker clicked:", artisan, "Close Window:", closeWindow);

      // --- Scenario 1: Explicit Close Button Click ---
      if (closeWindow) {
        setSelectedArtisan(null);
        // Set interaction flag to true ONLY when closing via button.
        // This signals that the user manually closed it, potentially
        // preventing immediate auto-zoom on a subsequent action if needed.
        setMapInteraction(true);
        return; // Stop further execution
      }

      // --- Reset Interaction Flag for any other click/call ---
      // Ensures that subsequent marker clicks WILL trigger animation,
      // unless it was *just* closed manually (handled above).
      setMapInteraction(false);

      // --- Scenario 2: Clicking the *Same* Marker to Close ---
      if (selectedArtisan && artisan && selectedArtisan.id === artisan.id) {
        setSelectedArtisan(null);
        // Optional: Reset view or leave it as is? Decide based on UX preference.
        // If you want it to zoom out when toggling off:
        // setMapProps({ center: INITIAL_MAP_CENTER, zoom: INITIAL_MAP_ZOOM });
        return; // Stop further execution
      }

      // --- Scenario 3: Clicking a *New* Marker (or the first time) ---
      if (artisan) {
        setSelectedArtisan(artisan); // Select the new artisan

        // Animate only if map is ready and artisan data is valid
        if (mapInstance && artisan.latitude && artisan.longitude) {
          const targetLat = parseFloat(artisan.latitude);
          const targetLng = parseFloat(artisan.longitude);

          // Immediate slight zoom/pan towards the target
          /*  setMapProps({
             center: { lat: targetLat, lng: targetLng },
             zoom: 10, // Or keep current zoom + pan, adjust as preferred
           }); */

          // Delayed zoom-in for effect
          const zoomTimer = setTimeout(() => {
            // Check if the *same* artisan is still selected before final zoom
            // This prevents zooming if the user clicked something else quickly.
            // Requires access to selectedArtisan state *inside* timeout, which is tricky.
            // A potentially safer approach is to manage animation state differently,
            // but for now, let's assume quick clicks aren't a major issue.
            /*   setMapProps({
                center: { lat: targetLat, lng: targetLng },
                zoom: 16, // Final zoom level
              }); */
          }, 600); // Delay in milliseconds

          // Optional cleanup for the timer if component unmounts or selection changes rapidly
          // You might need a ref to store the timer ID to clear it effectively.
          // return () => clearTimeout(zoomTimer); // This won't work directly in useCallback like this

        } else {
          console.warn("Map instance not ready or artisan coordinates missing for animation.");
        }
        return; // Stop further execution
      }

      // --- Scenario 4: Called with `null` (e.g., from filter change, map click) ---
      // This case means we should just close any open info window without changing zoom/pan here.
      // The calling context (like handleFilterChange) is responsible for map view updates.
      if (!artisan) {
        setSelectedArtisan(null);
        return;
      }
    },
    // Dependencies: Include everything used from outside the callback
    [selectedArtisan, mapInstance, setSelectedArtisan, setMapInteraction, setMapProps] // Added setters
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
      map.data.addGeoJson(DistrictGeoJson);

      // Style the GeoJSON features
      map.data.setStyle({
        fillColor: "green",
        fillOpacity: 0,
        strokeColor: "black",
        strokeWeight: 1,
      });

      // Add click listener for interactivity
      map.data.addListener("click", (event) => {
        const feature = event.feature;
        const district = feature.getProperty("districts");
        console.log("District clicked:", district);

        setSelectedArtisan(null);
        setMapInteraction(false);

        animateToDistrict(district);
      });

      // Fetch and load GeoJSON
      /* fetch(GEOJSON_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load GeoJSON");
          }
          return response.json();
        })
        .then((geoJsonData) => {
          
        })
        .catch((error) => {
          console.error("Error loading GeoJSON:", error);
          setError("Failed to load map data.");
          setLoading(false);
        }); */
    },
    [animateToDistrict]
  );
  interface FilterSelections {
    query: string;
    division: SelectOption;
    district: SelectOption;
    tehsil: SelectOption;
    gender: SelectOption;
    craft: SelectOption;
    category: SelectOption;
    technique: SelectOption;
    education: SelectOption; // Assuming education can be multi-select if needed, or single if not
    date_of_birth: SelectOption; // Example type, adjust as needed
    contact_no: SelectOption;
    email: SelectOption;
    address: SelectOption;
    dependents_count: SelectOption;
    crafting_method: SelectOption; // Assuming this might be a list
    ntn: SelectOption;
    uc: string;
    major_product: SelectOption;
    experience: SelectOption; // Assuming years of experience
    avg_monthly_income: SelectOption;
    employment_type: SelectOption; // Assuming this might be a list
    raw_material: SelectOption;
    loan_status: SelectOption; // Assuming this might be a boolean or enum from a list
    has_machinery: SelectOption;
    has_training: SelectOption;
    inherited_skills: SelectOption;
    financial_assistance: SelectOption;
    technical_assistance: SelectOption;
    comments: SelectOption;
    latitude: SelectOption;
    longitude: SelectOption;
    user_Id: SelectOption;
  }

  // Define the mapping between the filter key and its state setter
  const filterStateSetters = {
    division: setDivision,
    district: setDistrict,
    tehsil: setTehsil,
    gender: setGender,
    craft: setCraft,
    category: setCategory,
    technique: setTechniquesSkills, // Use the actual name of your state setter
    education: setEducation, // Use the actual name of your state setter
    raw_material: setRawMaterialFilter,
    employment_type: setEmploymentTypeFilter, // Maps 'employment_type_id' from Filters to 'employmentTypeFilter' state
    crafting_method: setCraftingMethodFilter,
    avg_monthly_income: setAvgMonthlyIncomeFilter,
    dependents_count: setDependentsCountFilter,
    inherited_skills: setInheritedSkillsFilter,
    has_machinery: setHasMachineryFilter,
    has_training: setHasTrainingFilter,
    loan_status: setLoanStatusFilter,
    financial_assistance: setFinancialAssistanceFilter,
    technical_assistance: setTechnicalAssistanceFilter,
    query: setQuery,
    uc: setUC
  };

  // Generic function to process a single filter value (single object or array of objects)
  const processFilterValue = (value: SelectOption | SelectOption[] | null | undefined): string => {
    if (!value) {
      return ""; // Handle null or undefined
    }

    if (Array.isArray(value)) {
      // Handle multi-select: array of SelectOption objects
      const names = value
        .map(item => item?.name) // Extract 'name', handle potential null/undefined items
        .filter(name => typeof name === 'string' && name !== ''); // Filter out non-strings, null, undefined, or empty strings

      return names.join(','); // Join valid names with a comma
    } else {
      // Handle single-select: a single SelectOption object
      // Check if it's a valid object with a name that isn't "Select"
      if (typeof value === 'object' && value !== null && value.name && value.name !== 'Select') {
        return value.name;
      }
      return ""; // Return empty string for "Select" or invalid single values
    }
  };
  // Handle filter changes
  const handleFilterChange = useCallback(
    (selected: FilterSelections) => {
      if (selected['query']) {
        setQuery(selected['query'])
      } else if (selected['uc']) {
        setUC(selected['uc'])
      } else {
        Object.keys(filterStateSetters).forEach(key => {
          const setter = filterStateSetters[key as keyof typeof filterStateSetters]; // Get the corresponding setter
          const selectedValue = selected[key as keyof FilterSelections]; // Get the value for this filter key

          // Process the selected value using the generic function
          const processedValue = processFilterValue(selectedValue as SelectOption | SelectOption[]);

          // Update the state using the setter
          setter(processedValue);
        });
      }

      // --- Handle logic outside the standard pattern ---

      // Call handleMarkerClick unconditionally as before
      handleMarkerClick(null);

      // Specific logic for district animation
      const districtName = processFilterValue(selected.district); // Get processed district name

      // No need for explicit return, just call the appropriate animation function
      if (!districtName) { // districtName will be "" if "Select" or undefined was passed
        animateToDistrict(null);
      } else {
        animateToDistrict(districtName);
      }

      // Example: Handle other types of filters if they exist
      // if (selected.user_Id !== undefined) {
      //   setUserId(selected.user_Id); // Assuming setUserId handles string/number
      // }

    },
    [
      // Add ALL dependencies used inside the callback
      animateToDistrict,
      // List all state setters used in filterStateSetters
      setDivision,
      setDistrict,
      setTehsil,
      setGender,
      setCraft,
      setCategory,
      setTechniquesSkills,
      setEducation,
      setRawMaterialFilter,
      setEmploymentTypeFilter,
      setCraftingMethodFilter,
      setAvgMonthlyIncomeFilter,
      setDependentsCountFilter,
      setInheritedSkillsFilter,
      setHasMachineryFilter,
      setHasTrainingFilter,
      setLoanStatusFilter,
      setFinancialAssistanceFilter,
      setTechnicalAssistanceFilter,
    ]
  );
  const mapStyles = [
    // --- Emphasize Water with Vibrant Blue ---
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#222222" }, { weight: 1.5 }],
    },

    // --- Add Styles for Roads ---
    {
      featureType: "road",
      elementType: "geometry", // Style the road lines themselves
      stylers: [{ visibility: "on" }, { color: "#22222" }, { weight: .5 }], // Example: Make roads red
    },
    {
      featureType: "road",
      elementType: "labels", // Style the road labels
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#000000" }],
    },

    // --- Add Styles for Points of Interest (Optional) ---
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "on" }], // Or 'off' if you don't want POI labels
    },
    {
      featureType: "poi.park", // Example: style park labels differently
      elementType: "labels.text.fill",
      stylers: [{ color: "#aaaaaa" }],
    },


    // --- Add Styles for Water (Important for context) ---
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ visibility: "on" }, { color: "#46bcec" }], // Example: Blue water
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#070707" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },

    // --- Add Styles for Landscape ---
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ visibility: "on" }, { color: "#f2f2f2" }], // Example: Light grey land
    },
  ];

  return (
    <Layout>
      <PageHeader title="Artisan Map" />
      <FiltersAll onChange={handleFilterChange} hideQuery={false} />

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
