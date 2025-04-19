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
const API_BASE_URL = "http://localhost:6500";

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
    { id: 1, name: "Self Employed" },
    { id: 3, name: "Employee" },
    { id: 2, name: "Entrepreneur" },
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
    /* if (profilePictureFile) {
      data.append("profile_picture", profilePictureFile);
    }

    // Append product images if new files are staged
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
      <div className="container mx-auto pt-4 pb-8">
        {/* Display submission error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        {/* Using your exact form structure */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* --- Form Actions --- */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              {" "}
              {/* Changed to navigate back */}
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </>
              )}
            </Button>
          </div>
          <div className="">
            {/* --- Personal Information Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="name">Artisan Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="father_name">Father / Husband Name</Label>
                    <Input
                      id="father_name"
                      name="father_name"
                      value={formData.father_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input
                      id="cnic"
                      name="cnic"
                      value={formData.cnic || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender || ""} // Assumes stored as 'Male'/'Female'/'Other'
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      } // Direct update
                      name="gender"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ntn">NTN</Label>
                    <Input
                      id="ntn"
                      name="ntn"
                      value={formData.ntn || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="education_id">Education</Label>
                    <Select
                      value={formData.education_level_id}
                      onValueChange={(value) =>
                        handleSelectChange("education_id", value)
                      }
                      name="education_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educations.map((edu) => (
                          <SelectItem key={edu.id} value={edu.id}>
                            {edu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dependents_count">
                      Number of Dependents
                    </Label>
                    <Input
                      id="dependents_count"
                      name="dependents_count"
                      type="number"
                      min="0"
                      value={formData.dependents_count ?? "0"}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center flex-col">
                  <Label>Profile Picture</Label>
                  <div className="flex mb-1 items-center gap-4 mt-1">
                    {formData.profile_picture && (
                      <img
                        // Assuming profile_picture is a full URL or needs base URL prepended
                        // If it's relative (e.g., /media/...), use: `${API_BASE_URL}${formData.profile_picture}`
                        src={`${formData.profile_picture}`}
                        alt="Current Profile"
                        className="w-20 h-20 object-cover border rounded"
                      />
                    )}
                  </div>
                  <Input
                    id="profile_picture_file"
                    name="profile_picture_file"
                    type="file"
                    accept="image/*"
                    className="max-w-xs" /* onChange={handleFileChange} */
                  />
                </div>
              </div>
            </div>

            {/* --- Contact Details Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/*  <div>
                <Label htmlFor="division_id">Division</Label>
                <Select
                  value={currentDivisionName}
                  onValueChange={(value) =>
                    handleSelectChange("division_id", value)
                  }
                  name="division_id"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem key={div.id} value={div.name}>
                        {div.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district_id">District</Label>
                <Select
                  value={currentDistrictName}
                  onValueChange={(value) =>
                    handleSelectChange("district_id", value)
                  }
                  name="district_name"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDistricts.map((dist) => (
                      <SelectItem key={dist.id} value={dist.name}>
                        {dist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
                <div>
                  <Label htmlFor="tehsil_id">Tehsil</Label>
                  <Select
                    value={formData.tehsil_id}
                    onValueChange={(value) =>
                      handleSelectChange("tehsil_id", value)
                    }
                    name="tehsil_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tehsil" />
                    </SelectTrigger>
                    <SelectContent>
                      {tehsils.map((teh) => (
                        <SelectItem key={teh.id} value={teh.id}>
                          {teh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="uc">UC (Union Council)</Label>
                  <Input
                    id="uc"
                    name="uc"
                    value={formData.uc || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_no">Mobile Number</Label>
                  <Input
                    id="contact_no"
                    name="contact_no"
                    type="tel"
                    value={formData.contact_no || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- Craft and Skills Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">Craft and Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="craft_id">Craft</Label>
                  <Select
                    value={formData.craft_id}
                    onValueChange={(value) =>
                      handleSelectChange("craft_id", value)
                    }
                    name="craft_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Craft" />
                    </SelectTrigger>
                    <SelectContent>
                      {crafts.map((craft) => (
                        <SelectItem key={craft.id} value={craft.id}>
                          {craft.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      handleSelectChange("category_id", value)
                    }
                    name="category_id"
                    disabled={!formData.craft_id || categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((x) => x.craft_Id == formData.craft_id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skill_id">Skill (Technique)</Label>
                  <Select
                    value={formData.skill_id}
                    onValueChange={(value) =>
                      handleSelectChange("skill_id", value)
                    }
                    name="skill_id"
                    disabled={!formData.category_id || skills.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills
                        .filter((x) => x.category_Id == formData.category_id)
                        .map(
                          (
                            skill // Assuming skill obj has id and name
                          ) => (
                            <SelectItem key={skill.id} value={skill.id}>
                              {skill.name}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience ?? "0"}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="avg_monthly_income">
                    Avg Monthly Income (PKR)
                  </Label>
                  <Input
                    id="avg_monthly_income"
                    name="avg_monthly_income"
                    type="number"
                    value={formData.avg_monthly_income ?? "0"}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-5 md:pt-0">
                  {" "}
                  <Switch
                    id="inherited_skills"
                    checked={
                      formData.inherited_skills == "Yes" ? true : false || false
                    }
                    onCheckedChange={(checked) =>
                      handleSwitchChange("inherited_skills", checked)
                    }
                    name="inherited_skills"
                  />
                  <Label htmlFor="inherited_skills">Inherited Skills?</Label>
                </div>
              </div>
            </div>

            {/* --- Business Information Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">
                Business Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employment_type_id">Employment Type</Label>
                  <Select
                    value={formData.employment_type_id}
                    onValueChange={(value) =>
                      handleSelectChange("employment_type_id", value)
                    }
                    name="employment_type_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="raw_material">Raw Material</Label>
                  <Select
                    value={formData.raw_material}
                    onValueChange={(value) =>
                      handleSelectChange("raw_material", value, true)
                    }
                    name="raw_material"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key={"Local"} value={"Local"}>
                        Local
                      </SelectItem>
                      <SelectItem key={"Imported"} value={"Imported"}>
                        Imported
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2 pt-5 md:pt-0">
                <Label htmlFor="has_training">Training Status</Label>
                <Switch
                  id="has_training"
                  checked={
                    (formData.has_training == "Yes" ? true : false) || false
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("has_training", checked)
                  }
                  name="has_training"
                />
              </div>
              <div className="flex items-center space-x-2 pt-5 md:pt-0">
                <Label htmlFor="has_machinery">Machinery Status</Label>
                <Switch
                  id="has_machinery"
                  checked={
                    (formData.has_machinery == "Yes" ? true : false) || false
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("has_machinery", checked)
                  }
                  name="has_machinery"
                />
              </div>
              <div className="flex items-center space-x-2 pt-5 md:pt-0">
                <Label htmlFor="loan_status">Loan Status</Label>
                <Switch
                  id="loan_status"
                  checked={
                    (formData.loan_status == "Yes" ? true : false) || false
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("loan_status", checked)
                  }
                  name="loan_status"
                />
              </div>
              <div className="flex items-center space-x-2 pt-5 md:pt-0">
                <Label htmlFor="financial_assistance">
                  Financial Assistance Needed?
                </Label>
                <Switch
                  id="financial_assistance"
                  checked={
                    (formData.financial_assistance == "Yes" ? true : false) ||
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("financial_assistance", checked)
                  }
                  name="financial_assistance"
                />
              </div>
              <div className="flex items-center space-x-2 pt-5 md:pt-0">
                <Label htmlFor="technical_assistance">
                  Technical Assistance Needed?
                </Label>
                <Switch
                  id="technical_assistance"
                  checked={
                    (formData.technical_assistance == "Yes" ? true : false) ||
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("technical_assistance", checked)
                  }
                  name="technical_assistance"
                />
              </div>
              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  rows={3}
                  value={formData.comments ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* --- Product Images Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">Product Images</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.product_images?.map((imagePath, index) => (
                  <div key={`product-img-${index}`} className="relative">
                    <img
                      // Assuming imagePath is full URL or needs base URL prepended
                      // If relative, use: `${API_BASE_URL}${imagePath}`
                      src={`${imagePath}`}
                      alt={`Product ${index + 1}`}
                      className="w-32 h-32 object-cover border rounded"
                    />
                    {/* Optional remove button */}
                  </div>
                ))}
              </div>
              {/* Conditional File Input based on your structure */}
              {formData.product_images?.length < 5 && (
                <div className="border rounded flex items-center justify-center">
                  {" "}
                  <Input
                    id="product_images_files"
                    name="product_images_files"
                    type="file"
                    accept="image/*"
                    multiple
                  />
                  {/* Placeholder text */}
                </div>
              )}
            </div>

            {/* --- Trainings Section --- */}
            {/* Using your structure with inline labels */}
            {formData.has_training == "Yes" && (
              <div className="border rounded p-4">
                <h2 className="text-lg font-semibold mb-3">Trainings</h2>
                <div className="space-y-3">
                  {formData.trainings?.map((training, index) => (
                    <div
                      key={`training-${index}`}
                      className="grid grid-cols-1 md:grid-cols-5 items-center gap-x-4 gap-y-2 border-b pb-2"
                    >
                      {" "}
                      {/* Adjusted grid for labels */}
                      <div>
                        <label className="font-medium text-sm">Title:</label>
                        <Input
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
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">Duration:</label>
                        <Input
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
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">Org:</label>
                        <Input
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
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">Date:</label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={training.date || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "trainings",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeArrayItem("trainings", index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    addArrayItem("trainings", {
                      title: "",
                      duration: "",
                      organization: "",
                    })
                  }
                >
                  Add Training
                </Button>
              </div>
            )}

            {/* --- Loans Section --- */}
            {/* Using your structure with inline labels */}
            {formData.loan_status == "Yes" && (
              <div className="border rounded p-4">
                <h2 className="text-lg font-semibold mb-3">Loans</h2>
                <div className="space-y-3">
                  {formData.loans?.map((loan, index) => (
                    <div
                      key={`loan-${index}`}
                      className="grid grid-cols-1 md:grid-cols-6 items-center gap-x-4 gap-y-2 border-b pb-2"
                    >
                      {" "}
                      {/* Adjusted grid */}
                      <div>
                        <label className="font-medium text-sm">Amount:</label>
                        <Input
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
                          placeholder="Amount (PKR)"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">Date:</label>
                        <Input
                          type="date"
                          value={formatDateForInput(loan.date) || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "loans",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">
                          Loan Availed From?
                        </label>
                        <Select
                          value={loan.loan_type}
                          onValueChange={(value) =>
                            handleArrayChange(
                              "loans",
                              index,
                              "loan_type",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={"Bank"} value={"Bank"}>
                              Bank
                            </SelectItem>
                            <SelectItem key={"Donor"} value={"Donor"}>
                              Donor
                            </SelectItem>
                            <SelectItem key={"Government"} value={"Government"}>
                              Government
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="font-medium text-sm">
                          Organization:
                        </label>
                        <Input
                          value={loan.name || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "loans",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Govt"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-sm">Scheme:</label>
                        <Input
                          value={loan.subName || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "loans",
                              index,
                              "subName",
                              e.target.value
                            )
                          }
                          placeholder="Scheme Name"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeArrayItem("loans", index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    addArrayItem("loans", {
                      amount: "",
                      date: "",
                      loan_type: "",
                      subName: "",
                    })
                  }
                >
                  Add Loan
                </Button>
              </div>
            )}

            {/* --- Machines Section --- */}
            {/* Using your structure with inline labels */}
            {formData.has_machinery == "Yes" && (
              <div className="border rounded p-4">
                <h2 className="text-lg font-semibold mb-3">Machines</h2>
                <div className="space-y-3">
                  {formData.machines?.map((machine, index) => (
                    <div
                      key={`machine-${index}`}
                      className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center gap-x-4 gap-y-2 border-b pb-2"
                    >
                      {" "}
                      {/* Adjusted grid */}
                      <label className="font-medium text-sm">Title:</label>
                      <Input
                        value={machine.title || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            "machines",
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Machine Name/Type"
                      />
                      <label className="font-medium text-sm">Size:</label>
                      <Input
                        value={machine.size || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            "machines",
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Large"
                      />
                      <label className="font-medium text-sm">Number:</label>
                      <Input
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
                        placeholder="Quantity"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeArrayItem("machines", index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    addArrayItem("machines", {
                      title: "",
                      size: "",
                      number_of_machines: 1,
                    })
                  }
                >
                  Add Machine
                </Button>
              </div>
            )}

            {/* --- Shop Images Section --- */}
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-3">Shop Images</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.shop_images?.map((imagePath, index) => (
                  <div key={`shop-img-${index}`} className="relative">
                    <img
                      // Assuming imagePath is full URL or needs base URL prepended
                      // If relative, use: `${API_BASE_URL}${imagePath}`
                      src={`${imagePath}`}
                      alt={`Shop ${index + 1}`}
                      className="w-32 h-32 object-cover border rounded"
                    />
                    {/* Optional remove button */}
                  </div>
                ))}
                {/* Conditional File Input - add if needed, similar to product images */}
              </div>
              {formData.shop_images?.length < 5 && (
                <div>
                  <Label htmlFor="shop_images_files">Add New Shop Images</Label>
                  <Input
                    id="shop_images_files"
                    name="shop_images_files"
                    type="file"
                    accept="image/*"
                    multiple /* onChange={handleFileChange} */
                  />
                </div>
              )}
            </div>
          </div>

          {/* --- Form Actions --- */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              {" "}
              {/* Changed to navigate back */}
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" /> Save Changes
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
