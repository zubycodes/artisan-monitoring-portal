import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import { PrinterIcon } from "lucide-react";

// --- Import Lightbox ---
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Optional: Import plugins like Zoom, Thumbnails, Fullscreen
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/plugins/thumbnails.css"; // Import thumbnails CSS if using

// Assuming API_BASE_URL is configured globally or imported
const API_BASE_URL = "https://artisan-psic.com";

// Helper function to format date consistently (keep existing)
const formatDate = (dateString) => {
  // ... (keep your existing formatDate function)
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "N/A";
  }
};

// Helper component for displaying key-value pairs (keep existing)
const DetailItem = ({
  label,
  value,
  className = "",
  labelClassName = "",
  valueClassName = "",
}) => (
  // ... (keep your existing DetailItem component)
  <div className={`mb-2 print:mb-1 ${className}`}>
    <dt
      className={`text-sm font-semibold text-gray-600 dark:text-gray-400 print:text-xs print:font-bold ${labelClassName}`}
    >
      {label}
    </dt>
    <dd
      className={`mt-1 text-sm text-gray-900 dark:text-gray-100 print:text-xs print:text-black ${valueClassName}`}
    >
      {/* Render value directly if it's JSX, otherwise use ?? 'N/A' */}
      {React.isValidElement(value) ? value : value ?? "N/A"}
    </dd>
  </div>
);

const ArtisanDetail = ({ artisan_id: prop_artisan_id }) => {
  const { id: param_id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const artisanId = prop_artisan_id || param_id;

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for Lightbox ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  useEffect(() => {
    // ... (keep existing fetch logic)
    if (!artisanId) {
      setError("No Artisan ID provided.");
      setLoading(false);
      return;
    }

    const fetchArtisanDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/artisans/${artisanId}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch artisan: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setArtisan(data);
      } catch (error) {
        console.error("Error fetching artisan details:", error);
        setError(`Failed to load artisan data: ${error.message}`);
        setArtisan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetail();
  }, [artisanId]);

  const handlePrint = () => {
    window.print();
  };

  // --- Helper to get image URL (keep existing) ---
  const getImageUrl = (path) => {
    // ... (keep your existing getImageUrl function)
    if (!path) return "https://via.placeholder.com/150?text=No+Image"; // Placeholder
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // --- Function to prepare slides and open lightbox ---
  const openLightbox = (imageUrls, startIndex = 0) => {
    if (!imageUrls || imageUrls.length === 0) return;

    const slides = imageUrls.map((url) => ({ src: getImageUrl(url) }));
    setLightboxSlides(slides);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600 text-center">
        {error}
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-500">
        Artisan data not found or not available.
      </div>
    );
  }

  // Prepare image lists for lightbox convenience
  const profileImageSlides = artisan.profile_picture
    ? [artisan.profile_picture]
    : [];
  const productImagesSlides = artisan.product_images || [];
  const shopImagesSlides = artisan.shop_images || [];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl print:p-0 print:max-w-full">
      {/* Header & Print Button (Keep existing) */}
      <div className="flex justify-between items-center mb-6 print:mb-4 border-b pb-3 print:border-black">
        {/* ... (header content) ... */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white print:text-xl print:text-black">
          Artisan Profile: {artisan.name || "N/A"}
        </h1>
        {param_id && (
          <button
            onClick={handlePrint}
            className="ml-4 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition print:hidden"
            title="Print Profile"
          >
            <PrinterIcon size={24} />
          </button>
        )}
      </div>
      <div ref={componentRef} className="space-y-8 print:space-y-4">
        {/* --- Personal Information Section --- */}
        <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white">
          <div className="p-6 md:p-8 print:p-2">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-1 print:grid-cols-4">
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 print:grid-cols-3 print:gap-x-4">
                {/* ... other DetailItems ... */}
                <DetailItem label="Artisan Name" value={artisan.name} />
                <DetailItem
                  label="Father / Husband Name"
                  value={artisan.father_name}
                />
                <DetailItem label="CNIC" value={artisan.cnic} />
                <DetailItem label="Gender" value={artisan.gender} />
                <DetailItem
                  label="Date of Birth"
                  value={formatDate(artisan.date_of_birth)}
                />
                <DetailItem label="NTN" value={artisan.ntn} />
                <DetailItem label="Education" value={artisan.education_name} />
                <DetailItem
                  label="No. of Dependents"
                  value={artisan.dependents_count}
                />
              </div>
              {/* --- Modified Profile Picture --- */}
              <div className="flex flex-col items-center justify-start md:col-span-1 mt-4 md:mt-0 print:mt-0 print:items-end print:justify-start">
                <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 print:text-xs print:font-bold mb-1 self-center print:self-end">
                  Profile Picture
                </dt>
                <button // Make image clickable
                  type="button"
                  onClick={() => openLightbox(profileImageSlides, 0)}
                  className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg disabled:opacity-50"
                  disabled={!artisan.profile_picture} // Disable if no picture
                  aria-label="View profile picture"
                >
                  <img
                    src={getImageUrl(artisan.profile_picture)}
                    alt="Profile Picture"
                    className={`w-32 h-32 print:w-24 print:h-24 rounded-lg border border-gray-300 dark:border-gray-600 object-cover bg-gray-100 print:border-black ${
                      artisan.profile_picture
                        ? "cursor-pointer hover:opacity-90 transition-opacity"
                        : ""
                    }`}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=No+Image")
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Contact Details Section (Keep existing) --- */}
        <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white print:break-before-page">
          <div className="p-6 md:p-8 print:p-2">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
              Contact Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 print:grid-cols-3 print:gap-x-4 print:gap-y-1">
              <DetailItem label="Division" value={artisan.division_name} />
              <DetailItem label="District" value={artisan.district_name} />
              <DetailItem label="Tehsil" value={artisan.tehsil_name} />
              <DetailItem label="UC (Union Council)" value={artisan.uc} />
              <DetailItem label="Mobile Number" value={artisan.contact_no} />
              <DetailItem label="Email" value={artisan.email} />
              <DetailItem
                label="Address"
                value={artisan.address}
                className="sm:col-span-2 lg:col-span-3 print:col-span-3"
              />
              <DetailItem label="Latitude" value={artisan.latitude} />
              <DetailItem label="Longitude" value={artisan.longitude} />
            </dl>
          </div>
        </section>

        {/* --- Craft and Skills Section (Keep existing, including corrected DetailItems) --- */}
        <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white">
          <div className="p-6 md:p-8 print:p-2">
            {/* ... heading ... */}
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
              Craft and Skills
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 print:grid-cols-3 print:gap-x-4 print:gap-y-1">
              {/* Corrected DetailItems using value prop for complex JSX */}
              <DetailItem
                label="Craft"
                value={
                  <>
                    {artisan.craft_color && (
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2 print:hidden"
                        style={{ backgroundColor: artisan.craft_color }}
                      ></span>
                    )}
                    {artisan.craft_name || "N/A"}
                  </>
                }
                valueClassName="flex items-center"
                labelClassName="print:col-span-3"
                className="print:col-span-3"
              />
              <DetailItem
                label="Category"
                value={
                  <>
                    {artisan.category_color && (
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2 print:hidden"
                        style={{ backgroundColor: artisan.category_color }}
                      ></span>
                    )}
                    {artisan.category_name || "N/A"}
                  </>
                }
                valueClassName="flex items-center"
              />
              <DetailItem
                label="Skill (Technique)"
                value={
                  <>
                    {artisan.skill_color && (
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2 print:hidden"
                        style={{ backgroundColor: artisan.skill_color }}
                      ></span>
                    )}
                    {artisan.skill_name || "N/A"}
                  </>
                }
                valueClassName="flex items-center"
              />
              <DetailItem
                label="Experience (Years)"
                value={artisan.experience}
              />
              <DetailItem
                label="Avg Monthly Income (PKR)"
                value={artisan.avg_monthly_income}
              />
              <DetailItem
                label="Inherited Skills?"
                value={artisan.inherited_skills}
              />
            </dl>
          </div>
        </section>

        {/* --- Business Information & Assistance Section (Keep existing) --- */}
        <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white print:break-before-page">
          <div className="p-6 md:p-8 print:p-2">
            {/* ... heading ... */}
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
              Business & Assistance
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 print:grid-cols-3 print:gap-x-4 print:gap-y-1">
              <DetailItem
                label="Employment Type"
                value={
                  artisan.employment_type_id === 1
                    ? "Self Employed"
                    : artisan.employment_type_id === 3
                    ? "Employee"
                    : artisan.employment_type_id === 2
                    ? "Entrepreneur"
                    : "N/A"
                }
              />
              <DetailItem
                label="Raw Material Source"
                value={artisan.raw_material}
              />
              <DetailItem
                label="Received Training?"
                value={artisan.has_training}
              />
              <DetailItem
                label="Owns Machinery?"
                value={artisan.has_machinery}
              />
              <DetailItem label="Availed Loan?" value={artisan.loan_status} />
              <DetailItem
                label="Needs Financial Assistance?"
                value={artisan.financial_assistance}
              />
              <DetailItem
                label="Needs Technical Assistance?"
                value={artisan.technical_assistance}
              />
              <DetailItem
                label="Additional Comments"
                value={artisan.comments}
                className="sm:col-span-2 lg:col-span-3 print:col-span-3"
              />
            </dl>
          </div>
        </section>

        {/* --- Image Upload Sections --- */}
        {(productImagesSlides.length > 0 || shopImagesSlides.length > 0) && (
          <section className="print:break-before-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1 print:gap-4">
              {/* --- Modified Product Images --- */}
              {productImagesSlides.length > 0 && (
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white">
                  <div className="p-6 md:p-8 print:p-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
                      Product Images
                    </h2>
                    <div className="flex flex-wrap gap-4 print:gap-2">
                      {productImagesSlides.map((imagePath, index) => (
                        <button // Make image clickable
                          key={`product-${index}`}
                          type="button"
                          onClick={() =>
                            openLightbox(productImagesSlides, index)
                          }
                          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                          aria-label={`View product image ${index + 1}`}
                        >
                          <img
                            src={getImageUrl(imagePath)}
                            alt={`Product ${index + 1}`}
                            className="w-28 h-28 print:w-20 print:h-20 object-cover border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 print:border-black cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150?text=No+Image")
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- Modified Shop Images --- */}
              {shopImagesSlides.length > 0 && (
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white">
                  <div className="p-6 md:p-8 print:p-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
                      Shop Images
                    </h2>
                    <div className="flex flex-wrap gap-4 print:gap-2">
                      {shopImagesSlides.map((imagePath, index) => (
                        <button // Make image clickable
                          key={`shop-${index}`}
                          type="button"
                          onClick={() => openLightbox(shopImagesSlides, index)}
                          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                          aria-label={`View shop image ${index + 1}`}
                        >
                          <img
                            src={getImageUrl(imagePath)}
                            alt={`Shop ${index + 1}`}
                            className="w-28 h-28 print:w-20 print:h-20 object-cover border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 print:border-black cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150?text=No+Image")
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- Dynamic Array Sections (Keep existing) --- */}
        {/* Trainings Section */}
        {artisan.has_training === "Yes" && artisan.trainings?.length > 0 && (
          <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white print:break-inside-avoid">
            {/* ... table structure ... */}
            <div className="p-6 md:p-8 print:p-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
                Trainings Attended
              </h2>
              <table className="w-full text-left border-collapse print:text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700 print:bg-gray-100">
                  <tr>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Title
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Duration
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Organization
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artisan.trainings.map((training, index) => (
                    <tr
                      key={`training-${index}`}
                      className="border-b dark:border-gray-700 print:border-black"
                    >
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {training.title || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {training.duration || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {training.organization || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {formatDate(training.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Loans Section */}
        {artisan.loan_status === "Yes" && artisan.loans?.length > 0 && (
          <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white print:break-inside-avoid">
            {/* ... table structure ... */}
            <div className="p-6 md:p-8 print:p-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
                Loan Details
              </h2>
              <table className="w-full text-left border-collapse print:text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700 print:bg-gray-100">
                  <tr>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Amount (PKR)
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Date
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Availed From
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Organization/Lender
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Scheme/Purpose
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artisan.loans.map((loan, index) => (
                    <tr
                      key={`loan-${index}`}
                      className="border-b dark:border-gray-700 print:border-black"
                    >
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {loan.amount || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {formatDate(loan.date)}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {loan.loan_type || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {loan.name || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {loan.subName || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Machines Section */}
        {artisan.has_machinery === "Yes" && artisan.machines?.length > 0 && (
          <section className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden print:border-black print:shadow-none print:rounded-none print:bg-white print:break-inside-avoid">
            {/* ... table structure ... */}
            <div className="p-6 md:p-8 print:p-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 print:text-lg print:border-black print:text-black">
                Machinery Details
              </h2>
              <table className="w-full text-left border-collapse print:text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700 print:bg-gray-100">
                  <tr>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Machine Name/Type
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Size/Model
                    </th>
                    <th className="p-2 print:p-1 border border-gray-300 dark:border-gray-600 print:border-black font-semibold">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artisan.machines.map((machine, index) => (
                    <tr
                      key={`machine-${index}`}
                      className="border-b dark:border-gray-700 print:border-black"
                    >
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {machine.title || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {machine.size || "N/A"}
                      </td>
                      <td className="p-2 print:p-1 border-x border-gray-300 dark:border-gray-600 print:border-black">
                        {machine.number_of_machines || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>{" "}
      {/* End Main Content Area */}
      {/* --- Lightbox Component --- */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        // Add optional plugins for an "awesome" experience
        plugins={[Zoom, Thumbnails, Fullscreen]}
        // You can customize plugin behavior further if needed
        // zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.5 }}
        // thumbnails={{ border: 0, gap: 8, imageFit: "cover" }}
      />
      {/* Print-specific styles (keep existing) */}
      <style>{`
         @media print {
           /* ... keep all your existing print styles ... */
            body {
             -webkit-print-color-adjust: exact;
             print-color-adjust: exact;
           }
           .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
           section { page-break-inside: avoid; margin-bottom: 0.75rem; border: 1px solid #000 !important; box-shadow: none !important; border-radius: 0 !important; background-color: #fff !important; }
           h1, h2, dt, dd, th, td { color: #000 !important; }
            h2 { border-color: #000 !important; font-size: 11pt !important; margin-bottom: 0.5rem !important; padding-bottom: 0.25rem !important; }
           .print\\:text-xs { font-size: 8pt !important; line-height: 1.2; }
           .print\\:p-1 { padding: 0.1rem !important; }
           .print\\:p-2 { padding: 0.2rem !important; }
           .print\\:mb-1 { margin-bottom: 0.1rem !important; }
           .print\\:gap-x-4 { column-gap: 0.8rem !important; }
           .print\\:gap-y-1 { row-gap: 0.1rem !important; }
           .print\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
           .print\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
           .print\\:col-span-3 { grid-column: span 3 / span 3; }
           img { border: 1px solid #000 !important; background-color: #eee !important; }
           table { width: 100%; border-collapse: collapse; }
           th, td { border: 1px solid #333; padding: 4px; vertical-align: top; }
           th { background-color: #eee !important; font-weight: bold; }
           tr { page-break-inside: avoid; }
           .print\\:hidden { display: none !important; }
           .print\\:bg-white { background-color: #fff !important; }
           .print\\:shadow-none { box-shadow: none !important; }
           .print\\:rounded-none { border-radius: 0 !important; }
           .print\\:border-black { border: 1px solid #000 !important; }
           .print\\:text-black { color: #000 !important; }
           .print\\:text-lg { font-size: 11pt !important; }
           .print\\:font-bold { font-weight: bold !important; }
           .print\\:w-20 { width: 5rem !important; }
           .print\\:h-20 { height: 5rem !important; }
           .print\\:w-24 { width: 6rem !important; }
           .print\\:h-24 { height: 6rem !important; }
           @page { size: A4; margin: 0.75in; }
         }
       `}</style>
    </div>
  );
};

export default ArtisanDetail;
