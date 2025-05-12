import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "@/components/layout/Loader"; // Assuming Loader path
// Import your custom UI components (adjust paths as needed)
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { Save, X } from "lucide-react"; // Icons for buttons
import Layout from "@/components/layout/Layout";
import { Textarea } from "@/components/ui/textarea";

// --- Assume API_BASE_URL is configured globally or imported ---
// Using the API base URL you provided
const API_BASE_URL = "https://artisan-psic.com";

// --- Helper function to format date for input type="date" ---
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    // Format tosimpleTriplet-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

const ArtisanEdit = () => {
  const { id } = useParams(); // Get the artisan ID from the URL
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [formData, setFormData] = useState(null); // State to hold form data
  const [loading, setLoading] = useState(true); // Unified loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // For PUT request
  const [error, setError] = useState(null); // To display errors

  // --- State for dropdown options ---
  const [educations, setEducations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]); // Holds ALL districts fetched
  const [tehsils, setTehsils] = useState([]); // Holds ALL tehsils fetched
  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]); // Holds ALL categories fetched
  const [skills, setSkills] = useState([]); // Holds ALL skills/techniques fetched
  const [employmentTypes, setEmploymentTypes] = useState([
    // Keeping static as per your code
    { id: 2, name: "Self Employed" },
    { id: 1, name: "Employee" },
    { id: 3, name: "Entrepreneur" },
  ] as any[]);
  // Add states for loan types, machine types if needed

  // --- Fetch ALL initial data (Artisan details + Dropdowns) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("No Artisan ID provided.");
        setLoading(false);
        return;
      }

      try {
        // Fetch all data concurrently
        const [
          artisanResponse,
          divisionsResponse,
          districtsResponse,
          tehsilsResponse,
          craftsResponse,
          categoriesResponse,
          techniquesResponse, // Using techniques endpoint for skills
          educationResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/artisans/${id}`),
          fetch(`${API_BASE_URL}/geo_level?code_length=3`),
          fetch(`${API_BASE_URL}/geo_level?code_length=6`),
          fetch(`${API_BASE_URL}/geo_level?code_length=9`),
          fetch(`${API_BASE_URL}/crafts`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/techniques`), // Fetch techniques
          fetch(`${API_BASE_URL}/education`), // Fetch educations
        ]);

        // Helper to check response and parse JSON
        const checkResponse = (res, name) => {
          if (!res.ok) {
            throw new Error(
              `Failed to fetch ${name}: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        };

        // Process responses
        const artisanData = await checkResponse(
          artisanResponse,
          "artisan details"
        );
        const divisionsData = await checkResponse(
          divisionsResponse,
          "divisions"
        );
        const districtsData = await checkResponse(
          districtsResponse,
          "districts"
        );
        const tehsilsData = await checkResponse(tehsilsResponse, "tehsils");
        const craftsData = await checkResponse(craftsResponse, "crafts");
        const categoriesData = await checkResponse(
          categoriesResponse,
          "categories"
        );
        const techniquesData = await checkResponse(
          techniquesResponse,
          "techniques/skills"
        );
        const educationData = await checkResponse(
          educationResponse,
          "education levels"
        );

        // --- Update State ---
        // Set Form Data
        setFormData({
          ...artisanData,
          date_of_birth: formatDateForInput(artisanData.date_of_birth),
          trainings: artisanData.trainings || [],
          loans: artisanData.loans || [],
          machines: artisanData.machines || [],
          product_images: artisanData.product_images || [],
          shop_images: artisanData.shop_images || [],
          // NOTE: Assuming API returns division_id, district_id etc directly.
          // If code-based filtering is needed later, store relevant codes here too.
        });

        // Set Dropdown Options
        setDivisions(divisionsData);
        setDistricts(districtsData); // Store all fetched districts
        setTehsils(tehsilsData); // Store all fetched tehsils
        setCrafts(craftsData);
        setCategories(categoriesData); // Store all fetched categories
        setSkills(techniquesData); // Store techniques data in skills state
        setEducations(educationData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError(
          `Failed to load required data: ${error.message}. Please try again.`
        );
        setFormData(null); // Prevent form render on critical fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]); // Re-fetch if ID changes

  // --- Generic Handler for most Input fields ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === "profile_picture_file") {
      setFormData((prev) => ({
        ...prev,
        profile_picture_file: files[0] || null,
        // Optionally create a preview URL
        profile_picture_preview: files[0]
          ? URL.createObjectURL(files[0])
          : prev.profile_picture,
      }));
    } else if (
      name === "product_images_files" ||
      name === "shop_images_files"
    ) {
      const fileKey = name.replace("_files", ""); // e.g., product_images
      const previewKey = `${fileKey}_previews`; // e.g., product_images_previews

      const currentFiles = Array.from(files);
      const newPreviews = currentFiles.map((file: any) =>
        URL.createObjectURL(file)
      );

      setFormData((prev) => ({
        ...prev,
        [name]: prev[name]
          ? [...prev[name], ...currentFiles]
          : [...currentFiles], // Append files
        [previewKey]: prev[previewKey]
          ? [...prev[previewKey], ...newPreviews]
          : [...newPreviews], // Append previews
      }));
    }
  };

  const removeImage = (type, indexToRemove) => {
    const fileKey = `${type}_files`; // e.g., product_images_files
    const previewKey = `${type}_previews`; // e.g., product_images_previews
    const existingUrlKey = type; // e.g., product_images

    setFormData((prev) => {
      const updatedFiles = prev[fileKey]
        ? prev[fileKey].filter((_, index) => index !== indexToRemove)
        : [];
      const updatedPreviews = prev[previewKey]
        ? prev[previewKey].filter((_, index) => index !== indexToRemove)
        : [];
      const updatedExistingUrls = prev[existingUrlKey]
        ? prev[existingUrlKey].filter((_, index) => index !== indexToRemove)
        : [];

      // Revoke Object URL for removed preview if it exists
      if (prev[previewKey] && prev[previewKey][indexToRemove]) {
        URL.revokeObjectURL(prev[previewKey][indexToRemove]);
      }

      return {
        ...prev,
        [fileKey]: updatedFiles,
        [previewKey]: updatedPreviews,
        [existingUrlKey]: updatedExistingUrls, // Also remove existing URL if needed (adjust based on your logic)
      };
    });
  };
  // --- Handler for Select components ---
  // Keeping your original handler structure which resets dependent IDs
  const handleSelectChange = (fieldName, value, isString = false) => {
    setFormData((prev) => {
      const newState = {
        ...prev,
        [fieldName]: isString ? value : +value,
      };

      // Reset dependent fields on change based on your logic
      if (fieldName === "craft_id") {
        newState.category_id = null;
        newState.skill_id = null;
      } else if (fieldName === "category_id") {
        newState.skill_id = null;
      }
      return newState;
    });
    // NOTE: Console logs removed for brevity, add back if needed for debugging
  };

  // --- Handler for Switch component ---
  const handleSwitchChange = (fieldName, checked) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: checked ? "Yes" : "No",
    }));
  };

  // --- Handlers for Array Sections (Trainings, Loans, Machines) ---
  // Keeping your existing implementation
  const handleArrayChange = (arrayName, index, field, value) => {
    console.log(arrayName);
    console.log(index);
    console.log(field);
    console.log(value);

    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, newItemTemplate) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...newItemTemplate }],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // --- Form Submission Handler ---
  // Keeping your existing implementation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 1. Create FormData object
    const data = new FormData();

    // 2. Prepare the 'artisan' data object (fields for the artisans table)
    // Carefully select only the fields that belong to the 'artisans' table
    // Exclude image arrays, related collection arrays, and derived fields (like district_name)
    const artisanData = {
      name: formData.name,
      father_name: formData.father_name,
      cnic: formData.cnic,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      contact_no: formData.contact_no,
      email: formData.email || null,
      address: formData.address || null,
      tehsil_id: formData.tehsil_id || null,
      education_level_id: formData.education_level_id || null,
      dependents_count: formData.dependents_count
        ? parseInt(formData.dependents_count, 10)
        : 0,
      // Exclude profile_picture URL here - backend handles it via separate file field
      ntn: formData.ntn || null,
      skill_id: formData.skill_id, // Assuming required
      uc: formData.uc, // Assuming required
      major_product: formData.major_product, // Assuming required
      experience: formData.experience
        ? parseInt(formData.experience, 10)
        : null, // Use null if 0 is not intended
      avg_monthly_income: formData.avg_monthly_income
        ? parseFloat(formData.avg_monthly_income)
        : null, // Use null if 0 is not intended
      employment_type_id: formData.employment_type_id, // Assuming required
      raw_material: formData.raw_material || null,
      loan_status: formData.loan_status || null,
      has_machinery: formData.has_machinery || null,
      has_training: formData.has_training || null,
      inherited_skills: formData.inherited_skills || null,
      financial_assistance: formData.financial_assistance || null,
      technical_assistance: formData.technical_assistance || null,
      comments: formData.comments || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      user_Id: formData.user_Id || null, // Or ensure it's always present
      // 'isActive' might be handled differently (e.g., separate endpoint or backend logic)
    };

    // 3. Append the stringified 'artisan' data
    data.append("artisan", JSON.stringify(artisanData));

    // 4. Append stringified related collections (send empty array if not present/to clear)
    data.append("trainings", JSON.stringify(formData.trainings || []));
    data.append("loans", JSON.stringify(formData.loans || []));
    data.append("machines", JSON.stringify(formData.machines || []));

    // 5. Append Files (if new ones were selected)
    // Assumes state variables: profilePictureFile, productImageFiles, shopImageFiles hold File objects

    // Append profile picture if a new file is staged
    if (formData.profile_picture_file) {
      data.append("profile_picture", formData.profile_picture_file); // Use the file directly
    }

    /* // Append product images if new files are staged
    if (productImageFiles && productImageFiles.length > 0) {
      productImageFiles.forEach((file) => {
        data.append("product_images", file); // Use the same key for multiple files
      });
    }

    // Append shop images if new files are staged
    if (shopImageFiles && shopImageFiles.length > 0) {
      shopImageFiles.forEach((file) => {
        data.append("shop_images", file); // Use the same key for multiple files
      });
    } */

    console.log("Submitting FormData:", data); // FormData is tricky to log directly, iterate if needed for debug
    // for (let [key, value] of data.entries()) {
    //   console.log(key, value);
    // }

    try {
      // 6. Send the request with FormData
      const response = await fetch(`${API_BASE_URL}/artisans/${id}`, {
        // Use the correct ID from props/state
        method: "PUT",
        // NO 'Content-Type' header here - browser sets it for FormData
        // headers: { 'Authorization': `Bearer ${your_auth_token}` }, // Add auth if needed
        body: data, // Send the FormData object directly
      });

      // 7. Handle response (SSE aspect not handled here)
      // This fetch will wait for the *entire* backend process to finish
      // and will likely get the *last* message sent by the SSE stream
      // if the backend structures it that way before closing.
      // To fully utilize SSE progress, you'd need to use the EventSource API.
      console.log("API Response:", response); // Log the response for debugging

      if (!response.ok) {
        let errorData = {
          message: `HTTP error! Status: ${response.status}`,
        } as any;
        try {
          // Check content type before parsing
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json(); // Try to parse JSON error from the final response
          } else {
            errorData.message = await response.text(); // Get text if not JSON
          }
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        console.error("API Error Response:", errorData);
        // Extract message, potentially nested if backend sends { status: 'error', message: '...' }
        const message =
          errorData?.message ||
          errorData?.error ||
          `Update failed with status ${response.status}`;
        throw new Error(message);
      }

      // Assuming the final response might contain the success message
      const result = await response.json(); // Or response.text() if backend sends plain text on success
      console.log("Artisan update final response:", result); // Log final success data from backend
      // toast.success(result?.message || "Artisan updated successfully!"); // Use message from backend if available
      /* navigate(`/artisans-directory/${id}`); // Navigate on success */
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error updating artisan:", error);
      setError(`Update failed: ${error.message}`);
      // toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (loading) {
    // Ensure Loader is rendered within Layout if needed, or adjust as necessary
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (error && !formData) {
    return (
      <Layout>
        <div className="container mx-auto pt-4 text-red-600 text-center">
          {error}
        </div>
      </Layout>
    );
  }

  if (!formData) {
    return (
      <Layout>
        <div className="container mx-auto pt-4">
          Artisan data not available.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Increased vertical padding overall, wider max-width */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* --- Form Header --- */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Artisan Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Please fill in the details below. Required fields are marked with *.
          </p>
        </div> */}

        {/* --- Sticky Form Actions Bar (Optional but enhances UX) --- */}
        <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto max-w-6xl px-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline" // Use the defined 'outline' variant style
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              form="artisan-form" // Link button to the form ID
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600" // Accent color
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" /* SVG spinner */>
                    {/* Circle & Path */}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Display submission error */}
        {error && (
          // Enhanced error styling
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-600/30 rounded-lg flex items-center gap-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form with improved spacing */}
        <form
          ref={formRef}
          id="artisan-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {" "}
          {/* Increased space between sections */}
          {/* --- Section Wrapper --- */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {" "}
              {/* Increased padding */}
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Personal Information
              </h2>
              {/* Adjusted grid gap */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Personal Info Fields */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {" "}
                  {/* finer grid for inputs */}
                  {/* Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Artisan Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                      placeholder="e.g., Fatima Bibi"
                    />
                  </div>
                  {/* Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="father_name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Father / Husband Name
                    </Label>
                    <Input
                      id="father_name"
                      name="father_name"
                      value={formData.father_name || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                      placeholder="e.g., Ali Ahmed"
                    />
                  </div>
                  {/* Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="cnic"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      CNIC
                    </Label>
                    <Input
                      id="cnic"
                      name="cnic"
                      value={formData.cnic || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                      placeholder="xxxxx-xxxxxxx-x"
                    />
                  </div>
                  {/* Select Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Gender
                    </Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                      name="gender"
                    >
                      {/* Apply consistent styling if using custom components */}
                      <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Date Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="date_of_birth"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    />
                  </div>
                  {/* Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="ntn"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      NTN
                    </Label>
                    <Input
                      id="ntn"
                      name="ntn"
                      value={formData.ntn || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  {/* Education Select */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="education_id"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Education
                    </Label>
                    <Select
                      value={formData.education_id || ""} // Ensure value matches an option value (id)
                      onValueChange={(value) =>
                        handleSelectChange("education_id", value)
                      }
                      name="education_id"
                    >
                      <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        {educations.map((edu) => (
                          <SelectItem key={edu.id} value={edu.id}>
                            {" "}
                            {/* Use ID as value */}
                            {edu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Dependents Input Field Group */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="dependents_count"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      No. of Dependents
                    </Label>
                    <Input
                      id="dependents_count"
                      name="dependents_count"
                      type="number"
                      min="0"
                      value={formData.dependents_count ?? "0"}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center justify-start space-y-2 md:col-span-1 pt-4 md:pt-0">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 self-center">
                    Profile Picture
                  </Label>
                  <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 mb-2 overflow-hidden">
                    {formData.profile_picture_preview ||
                      formData.profile_picture ? (
                      <img
                        // Prefer preview URL if a new file is selected, otherwise show existing URL
                        src={
                          formData.profile_picture_preview ||
                          formData.profile_picture
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150")
                        } // Fallback image
                      />
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400 text-center p-2">
                        No Image
                      </span>
                    )}
                  </div>
                  <Input
                    id="profile_picture_file"
                    name="profile_picture_file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange} // Use the handler
                    className="block w-full max-w-xs text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                               file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30"
                  />
                  {/* Optional: Clear Button */}
                  {(formData.profile_picture_preview ||
                    formData.profile_picture) && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            profile_picture: null,
                            profile_picture_file: null,
                            profile_picture_preview: null,
                          }))
                        }
                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mt-1"
                      >
                        Remove Image
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
          {/* --- Contact Details Section --- */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tehsil Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="tehsil_id"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Tehsil
                  </Label>
                  <Select
                    value={formData.tehsil_id || ""}
                    onValueChange={(value) =>
                      handleSelectChange("tehsil_id", value)
                    }
                    name="tehsil_id"
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                      <SelectValue placeholder="Select Tehsil" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {tehsils.map((teh) => (
                        <SelectItem key={teh.id} value={teh.id}>
                          {teh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* UC Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor="uc"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    UC (Union Council)
                  </Label>
                  <Input
                    id="uc"
                    name="uc"
                    value={formData.uc || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="e.g., UC-15"
                  />
                </div>
                {/* Mobile Number Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor="contact_no"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_no"
                    name="contact_no"
                    type="tel"
                    value={formData.contact_no || ""}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
                {/* Email Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                {/* Address Input - Spanning full width */}
                <div className="md:col-span-4 space-y-1">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="House No, Street, Area, City"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* --- Craft and Skills Section --- */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Craft and Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {" "}
                {/* Changed grid layout slightly */}
                {/* Craft Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="craft_id"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Craft
                  </Label>
                  <Select
                    value={formData.craft_id || ""}
                    onValueChange={(value) =>
                      handleSelectChange("craft_id", value)
                    }
                    name="craft_id"
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                      <SelectValue placeholder="Select Craft" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {crafts.map((craft) => (
                        <SelectItem key={craft.id} value={craft.id}>
                          {craft.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Category Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="category_id"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </Label>
                  <Select
                    value={formData.category_id || ""}
                    onValueChange={(value) =>
                      handleSelectChange("category_id", value)
                    }
                    name="category_id"
                    disabled={
                      !formData.craft_id ||
                      categories.filter((c) => c.craft_Id === formData.craft_id)
                        .length === 0
                    }
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {categories
                        .filter((x) => x.craft_Id == formData.craft_id) // Ensure IDs match
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Skill Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="skill_id"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Skill (Technique)
                  </Label>
                  <Select
                    value={formData.skill_id || ""}
                    onValueChange={(value) =>
                      handleSelectChange("skill_id", value)
                    }
                    name="skill_id"
                    disabled={
                      !formData.category_id ||
                      skills.filter(
                        (s) => s.category_Id === formData.category_id
                      ).length === 0
                    }
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700">
                      <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {skills
                        .filter((x) => x.category_Id == formData.category_id) // Ensure IDs match
                        .map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Experience Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor="experience"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Experience (Years)
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience ?? "0"}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="e.g., 5"
                  />
                </div>
                {/* Avg Monthly Income Input */}
                <div className="space-y-1">
                  <Label
                    htmlFor="avg_monthly_income"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Avg Monthly Income (PKR)
                  </Label>
                  <Input
                    id="avg_monthly_income"
                    name="avg_monthly_income"
                    type="number"
                    min="0"
                    value={formData.avg_monthly_income ?? "0"}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                    placeholder="e.g., 25000"
                  />
                </div>
                {/* Inherited Skills Switch */}
                <div className="flex items-center space-x-2 pt-5">
                  {" "}
                  {/* Align vertically with labels */}
                  <Switch
                    id="inherited_skills"
                    checked={formData.inherited_skills === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("inherited_skills", checked)
                    }
                    name="inherited_skills"
                    // Add Tailwind classes for styling if needed, or rely on component library
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="inherited_skills"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Inherited Skills?
                  </Label>
                </div>
              </div>
            </div>
          </div>
          {/* --- Business Information & Assistance Section --- */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Business & Assistance
              </h2>
              {/* Use grid for better alignment of switches too */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {/* Employment Type Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="employment_type_id"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Employment Type
                  </Label>
                  <Select
                    value={formData.employment_type_id || ""}
                    onValueChange={(value) =>
                      handleSelectChange("employment_type_id", value)
                    }
                    name="employment_type_id"
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Raw Material Select */}
                <div className="space-y-1">
                  <Label
                    htmlFor="raw_material"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Raw Material Source
                  </Label>
                  <Select
                    value={formData.raw_material || ""}
                    onValueChange={(value) =>
                      handleSelectChange("raw_material", value)
                    }
                    name="raw_material"
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Imported">Imported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-1">
                  <Label
                    htmlFor="crafting_method"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Crafting Method
                  </Label>
                  <Select
                    value={formData.crafting_method || ""}
                    onValueChange={(value) =>
                      handleSelectChange("crafting_method", value)
                    }
                    name="crafting_method"
                  >
                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm">
                      <SelectValue placeholder="Select Crafting Method" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="Handmade">Handmade</SelectItem>
                      <SelectItem value="Machine">Machine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Spacer or another field if needed */}
                {/* <div className="hidden lg:block"></div> */}

                {/* Switches - aligned using grid */}
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="has_training"
                    checked={formData.has_training === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("has_training", checked)
                    }
                    name="has_training"
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="has_training"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Training?
                  </Label>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="has_machinery"
                    checked={formData.has_machinery === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("has_machinery", checked)
                    }
                    name="has_machinery"
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="has_machinery"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Owns Machinery?
                  </Label>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="loan_status"
                    checked={formData.loan_status === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("loan_status", checked)
                    }
                    name="loan_status"
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="loan_status"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Availed Loan?
                  </Label>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="financial_assistance"
                    checked={formData.financial_assistance === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("financial_assistance", checked)
                    }
                    name="financial_assistance"
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="financial_assistance"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Needs Financial Assistance?
                  </Label>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="technical_assistance"
                    checked={formData.technical_assistance === "Yes"}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("technical_assistance", checked)
                    }
                    name="technical_assistance"
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="technical_assistance"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Needs Technical Assistance?
                  </Label>
                </div>
              </div>

              {/* Comments Textarea - Spanning full width */}
              <div className="mt-6 space-y-1">
                <Label
                  htmlFor="comments"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional Comments
                </Label>
                <Textarea
                  id="comments"
                  name="comments"
                  rows={4} // Increased rows
                  value={formData.comments ?? ""}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                  placeholder="Any other relevant information..."
                />
              </div>
            </div>
          </div>
          {/* --- Image Upload Sections --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {" "}
            {/* Side-by-side on large screens */}
            {/* --- Product Images Section --- */}
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Product Images (Max 5)
                </h2>
                {/* Display existing and preview images */}
                <div className="flex flex-wrap gap-4 mb-4 min-h-[100px]">
                  {" "}
                  {/* Ensure minimum height */}
                  {/* Display existing images */}
                  {formData.product_images?.map((imagePath, index) => (
                    <div
                      key={`existing-product-${index}`}
                      className="relative group"
                    >
                      <img
                        src={`${imagePath}`} // Assuming full URL
                        alt={`Product ${index + 1}`}
                        className="w-24 h-24 object-cover border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150")
                        } // Fallback
                      />
                      {/* Consider adding remove for existing if needed */}
                    </div>
                  ))}
                  {/* Display new image previews */}
                  {(formData.product_images_previews || [])?.map(
                    (previewUrl, index) => (
                      <div
                        key={`new-product-${index}`}
                        className="relative group"
                      >
                        <img
                          src={previewUrl}
                          alt={`New Product ${index + 1}`}
                          className="w-24 h-24 object-cover border border-indigo-300 dark:border-indigo-600 rounded-md shadow-sm ring-1 ring-indigo-500" // Highlight new uploads
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("product_images", index)} // Use updated remove function
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  )}
                </div>
                {/* Conditional File Input */}
                {/* {(formData.product_images?.length || 0) +
                  (formData.product_images_files?.length || 0) <
                  5 && (
                  <div className="space-y-1">
                    <Label
                      htmlFor="product_images_files"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Add Product Images
                    </Label>
                    <Input
                      id="product_images_files"
                      name="product_images_files"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                           file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30"
                    />
                  </div>
                )} */}
              </div>
            </div>
            {/* --- Shop Images Section --- */}
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Shop Images (Max 5)
                </h2>
                {/* Display existing and preview images */}
                <div className="flex flex-wrap gap-4 mb-4 min-h-[100px]">
                  {/* Display existing images */}
                  {formData.shop_images?.map((imagePath, index) => (
                    <div
                      key={`existing-shop-${index}`}
                      className="relative group"
                    >
                      <img
                        src={`${imagePath}`}
                        alt={`Shop ${index + 1}`}
                        className="w-24 h-24 object-cover border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150")
                        }
                      />
                    </div>
                  ))}
                  {/* Display new image previews */}
                  {/* {(formData.shop_images_previews || [])?.map(
                    (previewUrl, index) => (
                      <div key={`new-shop-${index}`} className="relative group">
                        <img
                          src={previewUrl}
                          alt={`New Shop ${index + 1}`}
                          className="w-24 h-24 object-cover border border-indigo-300 dark:border-indigo-600 rounded-md shadow-sm ring-1 ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("shop_images", index)} // Use updated remove function
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  )} */}
                </div>
                {/* Conditional File Input */}
                {(formData.shop_images?.length || 0) +
                  (formData.shop_images_files?.length || 0) <
                  5 && (
                    <div className="space-y-1">
                      <Label
                        htmlFor="shop_images_files"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Add Shop Images
                      </Label>
                      <Input
                        id="shop_images_files"
                        name="shop_images_files"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                           file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30"
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* --- Dynamic Array Sections --- */}
          {/* --- Trainings Section --- */}
          {formData.has_training === "Yes" && (
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Trainings Attended
                </h2>
                <div className="space-y-4">
                  {" "}
                  {/* Space between training items */}
                  {formData.trainings?.length > 0 ? (
                    formData.trainings.map((training, index) => (
                      <div
                        key={`training-${index}`}
                        // Improved row styling with alternating background possibility
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_2fr_1fr_auto] items-end gap-x-4 gap-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        {/* Use space-y-1 within each grid cell for label+input */}
                        <div className="space-y-1">
                          <Label
                            htmlFor={`training-title-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Title
                          </Label>
                          <Input
                            id={`training-title-${index}`}
                            value={training.title || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "trainings",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Training Title"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`training-duration-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Duration
                          </Label>
                          <Input
                            id={`training-duration-${index}`}
                            value={training.duration || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "trainings",
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 3 days"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`training-org-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Organization
                          </Label>
                          <Input
                            id={`training-org-${index}`}
                            value={training.organization || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "trainings",
                                index,
                                "organization",
                                e.target.value
                              )
                            }
                            placeholder="Org Name"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`training-date-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Date
                          </Label>
                          <Input
                            id={`training-date-${index}`}
                            name={`training-date-${index}`}
                            type="date"
                            value={formatDateForInput(training.date) || ""} // Format date for input
                            onChange={(e) =>
                              handleArrayChange(
                                "trainings",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        {/* Remove Button - aligned to the end */}
                        <Button
                          type="button"
                          variant="ghost" // Less intrusive remove button
                          size="sm"
                          onClick={() => removeArrayItem("trainings", index)}
                          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-400 px-2 self-center mt-4 sm:mt-0" // Adjust alignment
                          aria-label="Remove Training"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No training details added yet.
                    </p>
                  )}
                </div>
                {/* Add Button - styled */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  onClick={() =>
                    addArrayItem("trainings", {
                      title: "",
                      duration: "",
                      organization: "",
                      date: "",
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Training
                </Button>
              </div>
            </div>
          )}
          {/* --- Loans Section --- */}
          {formData.loan_status === "Yes" && (
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Loan Details
                </h2>
                <div className="space-y-4">
                  {formData.loans?.length > 0 ? (
                    formData.loans.map((loan, index) => (
                      <div
                        key={`loan-${index}`}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr_2fr_auto] items-end gap-x-4 gap-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="space-y-1">
                          <Label
                            htmlFor={`loan-amount-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Amount (PKR)
                          </Label>
                          <Input
                            id={`loan-amount-${index}`}
                            type="number"
                            value={loan.amount || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "loans",
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 50000"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`loan-date-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Date
                          </Label>
                          <Input
                            id={`loan-date-${index}`}
                            type="date"
                            value={formatDateForInput(loan.date) || ""} // Format date
                            onChange={(e) =>
                              handleArrayChange(
                                "loans",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`loan-type-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Availed From
                          </Label>
                          <Select
                            value={loan.loan_type || ""}
                            onValueChange={(value) =>
                              handleArrayChange(
                                "loans",
                                index,
                                "loan_type",
                                value
                              )
                            }
                            name={`loan-type-${index}`}
                          >
                            <SelectTrigger className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800">
                              <SelectItem value="Bank">Bank</SelectItem>
                              <SelectItem value="Donor">Donor</SelectItem>
                              <SelectItem value="Government">
                                Government
                              </SelectItem>
                              <SelectItem value="NGO">NGO</SelectItem>
                              <SelectItem value="Informal">
                                Informal (Friend/Family)
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`loan-org-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Organization/Lender
                          </Label>
                          <Input
                            id={`loan-org-${index}`}
                            value={loan.name || ""} // Use 'name' field for Org Name
                            onChange={(e) =>
                              handleArrayChange(
                                "loans",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Akhuwat"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`loan-scheme-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Scheme/Purpose
                          </Label>
                          <Input
                            id={`loan-scheme-${index}`}
                            value={loan.subName || ""} // Use 'subName' field for Scheme
                            onChange={(e) =>
                              handleArrayChange(
                                "loans",
                                index,
                                "subName",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Business Expansion"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("loans", index)}
                          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-400 px-2 self-center mt-4 sm:mt-0"
                          aria-label="Remove Loan"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No loan details added yet.
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  onClick={() =>
                    addArrayItem("loans", {
                      amount: "",
                      date: "",
                      loan_type: "",
                      name: "",
                      subName: "",
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Loan
                </Button>
              </div>
            </div>
          )}
          {/* --- Machines Section --- */}
          {formData.has_machinery === "Yes" && (
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Machinery Details
                </h2>
                <div className="space-y-4">
                  {formData.machines?.length > 0 ? (
                    formData.machines.map((machine, index) => (
                      <div
                        key={`machine-${index}`}
                        // Adjusted grid for fewer items
                        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] items-end gap-x-4 gap-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="space-y-1">
                          <Label
                            htmlFor={`machine-title-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Machine Name/Type
                          </Label>
                          <Input
                            id={`machine-title-${index}`}
                            value={machine.title || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "machines",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Sewing Machine"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`machine-size-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Size/Model
                          </Label>
                          <Input
                            id={`machine-size-${index}`}
                            value={machine.size || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "machines",
                                index,
                                "size",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Industrial"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`machine-number-${index}`}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase"
                          >
                            Quantity
                          </Label>
                          <Input
                            id={`machine-number-${index}`}
                            type="number"
                            min="1"
                            value={machine.number_of_machines ?? "1"}
                            onChange={(e) =>
                              handleArrayChange(
                                "machines",
                                index,
                                "number_of_machines",
                                e.target.value
                              )
                            }
                            placeholder="1"
                            className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("machines", index)}
                          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-400 px-2 self-center mt-4 sm:mt-0"
                          aria-label="Remove Machine"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No machinery details added yet.
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  onClick={() =>
                    addArrayItem("machines", {
                      title: "",
                      size: "",
                      number_of_machines: 1,
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Machine
                </Button>
              </div>
            </div>
          )}
          {/* --- Form Actions (Bottom) --- */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline" // Consistent styling
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              type="submit" // Submit is handled by the form tag now
              disabled={isSubmitting}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600" // Accent color
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" /* SVG spinner */>
                    {/* Circle & Path */}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" /> <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ArtisanEdit;
