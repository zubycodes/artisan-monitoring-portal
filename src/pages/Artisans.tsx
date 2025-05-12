import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreHorizontal,
  Filter,
  Download,
  PrinterIcon,
  Edit,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ArtisanDetail from "./ArtisanDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectOption } from "@/components/dashboard/Filters";
import FiltersAll from "@/components/dashboard/FiltersAll";
import Loader from "@/components/layout/Loader";
const API_BASE_URL = "https://artisan-psic.com";

const ArtisansList = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    id: false,
    name: true,
    father_name: true,
    cnic: true,
    gender: true,
    date_of_birth: false,
    contact_no: false,
    email: false,
    address: false,
    division_name: false,
    district_name: false,
    tehsil_name: false,
    dependents_count: false,
    crafting_method: false,
    ntn: false,
    uc: false,
    craft_name: true,
    category_name: true,
    skill_name: true,
    education_name: false,
    major_product: false,
    experience: false,
    avg_monthly_income: false,
    employment_type: false, // Assuming you want the formatted type
    raw_material: false,
    loan_status: false,
    has_machinery: false,
    has_training: false,
    inherited_skills: false,
    financial_assistance: false,
    technical_assistance: false,
    comments: false,
    latitude: false,
    longitude: false,
    created_at: false,
    username: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artisanId, setArtisanId] = useState(0);
  const [error, setError] = useState(null);


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

  const navigate = useNavigate();
  /*   const fetchArtisans = async () => {
      try {
        // In a real app, replace with your actual API call
        const response = await fetch(`${API_BASE_URL}/artisans`);
        const data = await response.json();
        setArtisans(data);
        setFilteredArtisans(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artisans:", error);
        setLoading(false);
      }
    };
    // Fetch artisans data
    useEffect(() => {
      fetchArtisans();
    }, []); */

  // Filter artisans based on search term
  useEffect(() => {
    const results = artisans.filter(
      (artisan) =>
        artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.contact_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (artisan.email &&
          artisan.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArtisans(results);
    setCurrentPage(1);
  }, [searchTerm, artisans]);

  const fetchFilteredData = async () => {
    setLoading(true); // Start loading when dependencies change
    setError(null); // Clear previous errors

    // Construct query parameters string
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('name', query);
    if (uc) queryParams.append('uc', uc);
    if (division) queryParams.append('division', division);
    if (district) queryParams.append('district', district);
    if (gender) queryParams.append('gender', gender);
    if (craft) queryParams.append('craft', craft);
    if (category) queryParams.append('category', category);
    if (techniquesSkills) queryParams.append('skill', techniquesSkills); // Use 'skill' as per your URL
    if (tehsil) queryParams.append('tehsil', tehsil);
    if (education) queryParams.append('education', education); // New filter param
    if (rawMaterialFilter) queryParams.append('raw_material', rawMaterialFilter); // New filter param
    if (employmentTypeFilter) queryParams.append('employment_type', employmentTypeFilter); // Use 'employment_type' as per your URL
    if (craftingMethodFilter) queryParams.append('crafting_method', craftingMethodFilter); // New filter param
    if (avgMonthlyIncomeFilter) queryParams.append('avg_monthly_income', avgMonthlyIncomeFilter); // New filter param
    if (dependentsCountFilter) queryParams.append('dependents_count', dependentsCountFilter); // New filter param
    if (inheritedSkillsFilter) queryParams.append('inherited_skills', inheritedSkillsFilter); // New filter param
    if (hasMachineryFilter) queryParams.append('has_machinery', hasMachineryFilter); // New filter param
    if (hasTrainingFilter) queryParams.append('has_training', hasTrainingFilter); // New filter param
    if (loanStatusFilter) queryParams.append('loan_status', loanStatusFilter); // New filter param
    if (financialAssistanceFilter) queryParams.append('financial_assistance', financialAssistanceFilter); // New filter param
    if (technicalAssistanceFilter) queryParams.append('technical_assistance', technicalAssistanceFilter); // New filter param

    const queryString = queryParams.toString();
    const artisansUrl = `${API_BASE_URL}/artisans`;

    try {
      const [
        artisansResponse,
      ] = await Promise.all([
        fetch(`${artisansUrl}?${queryString}`), // Apply filters to artisans endpoint as well
      ]);

      // Check for OK status for each response
      if (!artisansResponse.ok) throw new Error(`HTTP error! status: ${artisansResponse.status} for artisans data`);


      const artisansData = await artisansResponse.json();


      setArtisans(artisansData);
      setFilteredArtisans(artisansData);

    } catch (err: any) { // Use 'any' or a more specific error type
      console.error("Error fetching filtered data:", err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false); // End loading after fetch completes
    }
  };
  useEffect(() => {
    // This effect runs on mount AND whenever any of the filter states change
    // If you used the first useEffect for initial load without filters,
    // you might adjust this one to only run *after* filters have potentially been set.
    // However, fetching with empty strings initially works fine for most APIs.


    // Call the fetch function
    fetchFilteredData();

  }, [
    division,
    district,
    gender,
    craft,
    category,
    tehsil,
    techniquesSkills, // Existing filter dependency
    education, // New filter dependency
    rawMaterialFilter, // New filter dependency
    employmentTypeFilter, // New filter dependency
    craftingMethodFilter, // New filter dependency
    avgMonthlyIncomeFilter, // New filter dependency
    dependentsCountFilter, // New filter dependency
    inheritedSkillsFilter, // New filter dependency
    hasMachineryFilter, // New filter dependency
    hasTrainingFilter, // New filter dependency
    loanStatusFilter, // New filter dependency
    financialAssistanceFilter, // New filter dependency
    technicalAssistanceFilter, // New filter dependency
    query, uc
  ]); // Effect dependencies array

  const properCase = (text: string): string => {
    return text.split(' ').map(word =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
    ).join(' ');
  };
  // Get current artisans for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtisans = filteredArtisans.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view artisan details
  const handleViewArtisan = (id) => {
    navigate(`/artisans/${id}`);
  };

  // Handle edit artisan
  const handleEditArtisan = (id) => {
    navigate(`/artisans/edit/${id}`);
  };

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    // Check if there's data to export
    if (!filteredArtisans || filteredArtisans.length === 0) {
      console.warn("No data to export.");
      // Optionally show a user-facing message
      alert("No data available to export.");
      return;
    }

    // Get all possible keys from the first object to determine potential columns
    // This assumes all objects have a consistent set of keys, which is typical for database results
    const allPossibleHeaders = Object.keys(filteredArtisans[0]);

    // Filter headers based ONLY on the visibleColumns state being true
    // We will add 'Sr.' separately later
    const dataHeaders = allPossibleHeaders.filter(
      (key) => visibleColumns[key] === true // Explicitly check if the key exists AND is true
    );

    // If no data columns are selected as visible, maybe warn the user or export all?
    // For now, we'll proceed with the filtered headers.
    if (dataHeaders.length === 0) {
      console.warn("No visible data columns selected for export.");
      alert("Please select at least one data column to make visible for export.");
      return; // Prevent creating an empty CSV if no data columns are visible
    }

    // Add 'Sr.' to the beginning of the headers array
    const headers = ['Sr.', ...dataHeaders];

    // Format the headers for the CSV file
    const formattedHeaders = headers.map(headerKey => {
      // Handle the 'Sr.' header specifically
      if (headerKey === 'Sr.') {
        return 'Sr.';
      }
      // Apply the proper case formatting logic for other headers
      // You might want specific mappings for certain complex headers like 'avg_monthly_income'
      // For example:
      if (headerKey === 'name') return 'Artisan Name';
      if (headerKey === 'father_name') return 'Father / Husband Name';
      if (headerKey === 'cnic') return 'CNIC';
      if (headerKey === 'avg_monthly_income') return 'Avg Monthly Income';
      if (headerKey === 'financial_assistance') return 'Financial Assistance Required';
      if (headerKey === 'technical_assistance') return 'Technical Assistance Required';
      // Otherwise, apply the general properCase logic

      // Assuming properCase function exists and handles single words or phrases
      // Replace underscores and apply proper case
      let formattedKey = headerKey.replace(/_/g, ' '); // Replace all underscores
      // Add more specific replacements if needed before proper casing
      formattedKey = formattedKey.replace('name', ''); // Example: remove 'name' if it's part of the key

      // Ensure properCase function is defined elsewhere in your code
      // If properCase is not defined, you might need to implement simple title casing here
      // Example simple title casing (handle multiple spaces and leading/trailing spaces):
      formattedKey = formattedKey.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');


      return formattedKey;
    });


    // Map the filtered data to CSV rows
    const csvContent = [
      // Header row - Use the formatted headers
      formattedHeaders.join(","),
      // Data rows
      ...filteredArtisans.map((artisan, index) =>
        [
          // Add the serial number (index + 1) as the first column
          index + 1,
          // Then map the data headers to their corresponding values
          ...dataHeaders
            .map((header) => {
              const value = artisan[header];
              // Handle boolean values
              if (typeof value === "boolean") {
                return value ? "Yes" : "No";
              }
              // Handle numerical values that might need specific formatting (like currency)
              if (header === 'avg_monthly_income' && typeof value === 'number') {
                return `Rs. ${value.toLocaleString()}`;
              }
              // Handle null or undefined values
              if (value === null || value === undefined) {
                return ""; // Represent null/undefined as empty string in CSV
              }
              // Escape values that contain commas or double quotes
              // This is basic CSV escaping; more complex cases might need a dedicated CSV library
              let stringValue = String(value);
              if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                // Enclose in double quotes and escape existing double quotes by doubling them
                stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
              }
              return stringValue;
            })
        ]
          .join(",") // Join column values with a comma
      ),
    ].join("\n"); // Join rows with a newline character

    console.log('Exporting headers:', headers); // Original keys including 'Sr.'
    console.log('Exporting formatted headers:', formattedHeaders); // Headers in CSV
    // console.log('Exporting CSV content:', csvContent); // Uncomment for debugging

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "artisans.csv");

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };
  interface FilterSelections {
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


  const handleFilterChange = (selected: FilterSelections) => {
    // Iterate over the keys of the selected filters

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
    // If you have user_Id or other filters not following this pattern, handle them separately
    // Example: if user_Id is just a string or number
    // if (selected.user_Id !== undefined) {
    //   setUserId(selected.user_Id);
    // }
  };
  // Get readable skill name (in a real app, this would be a lookup)
  const getSkillName = (skillId) => {
    const skillMap = {
      1: "Woodworking",
      2: "Pottery",
      3: "Weaving",
      4: "Metalwork",
      5: "Embroidery",
      6: "Jewelry Making",
      7: "Leatherwork",
      8: "Glass Blowing",
    };
    return skillMap[skillId] || `Skill ${skillId}`;
  };

  const handleDelete = async (id) => {
    if (confirm("Confirm delete artisan?")) {
      // Basic validation
      try {
        const response = await fetch(`${API_BASE_URL}/artisans/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          fetchFilteredData(); // Refresh artisans list after deletion
        } else {
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
      }
    }
  };
  const renderCellContent = (value) => {
    if (value === null || value === undefined) {
      return ""; // Render empty string for null/undefined
    }
    // Add specific formatting for known types if needed (e.g., dates, numbers)
    // For example:
    // if (typeof value === 'number') return value.toLocaleString();
    // if (value instanceof Date) return value.toLocaleDateString(); // or use your formatDateTime
    return String(value); // Convert other values to string
  };
  return (
    <Layout>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Artisans Directory</CardTitle>
              <CardDescription>View all artisans</CardDescription>
            </div>
            <div className="flex flex-1 justify-end gap-2">
              {/*   <Input
                placeholder="Search by name, CNIC, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              /> */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Columns</DialogTitle>
                    <DialogDescription>
                      Select which columns to display in the table
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(visibleColumns).map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`column-${column}`}
                          checked={visibleColumns[column]}
                          onChange={() => toggleColumn(column)}
                        />
                        <label htmlFor={`column-${column}`}>
                          {column.charAt(0).toUpperCase() +
                            column.slice(1).replace("_", " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid">

            <FiltersAll onChange={handleFilterChange} hideQuery={false} />

          </div>

        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Pagination */}
              <div className="text-sm mb-2 text-gray-500">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredArtisans.length)} of{" "}
                {filteredArtisans.length} artisans
              </div>
              <div className="rounded-md border mb-4 overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SR.</TableHead>
                      {/* Conditionally render TableHeads based on visibleColumns state */}
                      {visibleColumns.id && <TableHead>ID</TableHead>}
                      {visibleColumns.name && <TableHead>Name</TableHead>}
                      {visibleColumns.father_name && <TableHead>Father's Name</TableHead>}
                      {visibleColumns.cnic && <TableHead>CNIC</TableHead>}
                      {visibleColumns.gender && <TableHead>Gender</TableHead>}
                      {visibleColumns.date_of_birth && <TableHead>Date of Birth</TableHead>}
                      {visibleColumns.contact_no && <TableHead>Contact No</TableHead>}
                      {visibleColumns.email && <TableHead>Email</TableHead>}
                      {visibleColumns.address && <TableHead>Address</TableHead>}
                      {visibleColumns.division_name && <TableHead>Division</TableHead>}
                      {visibleColumns.district_name && <TableHead>District</TableHead>}
                      {visibleColumns.tehsil_name && <TableHead>Tehsil</TableHead>}
                      {visibleColumns.dependents_count && <TableHead>Dependents</TableHead>}
                      {visibleColumns.crafting_method && <TableHead>Crafting Method</TableHead>}
                      {visibleColumns.ntn && <TableHead>NTN</TableHead>}
                      {visibleColumns.uc && <TableHead>UC</TableHead>}
                      {visibleColumns.craft_name && <TableHead>Craft</TableHead>}
                      {visibleColumns.category_name && <TableHead>Category</TableHead>}
                      {visibleColumns.skill_name && <TableHead>Skill</TableHead>}
                      {visibleColumns.education_name && <TableHead>Education</TableHead>}
                      {visibleColumns.major_product && <TableHead>Major Product</TableHead>}
                      {visibleColumns.experience && <TableHead>Experience</TableHead>}
                      {visibleColumns.avg_monthly_income && <TableHead>Avg Monthly Income</TableHead>}
                      {visibleColumns.employment_type && <TableHead>Employment Type</TableHead>}
                      {visibleColumns.raw_material && <TableHead>Raw Material</TableHead>}
                      {visibleColumns.loan_status && <TableHead>Loan Status</TableHead>}
                      {visibleColumns.has_machinery && <TableHead>Has Machinery</TableHead>}
                      {visibleColumns.has_training && <TableHead>Has Training</TableHead>}
                      {visibleColumns.inherited_skills && <TableHead>Inherited Skills</TableHead>}
                      {visibleColumns.financial_assistance && <TableHead>Financial Assistance</TableHead>}
                      {visibleColumns.technical_assistance && <TableHead>Technical Assistance</TableHead>}
                      {visibleColumns.comments && <TableHead>Comments</TableHead>}
                      {visibleColumns.latitude && <TableHead>Latitude</TableHead>}
                      {visibleColumns.longitude && <TableHead>Longitude</TableHead>}
                      {visibleColumns.created_at && <TableHead>Created At</TableHead>}
                      {visibleColumns.username && <TableHead>Username</TableHead>}

                      {/* Actions column remains always visible */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentArtisans.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={
                            // Calculate colSpan: 1 (SR) + number of visible columns + 1 (Actions)
                            Object.values(visibleColumns).filter(Boolean).length + 2
                          }
                          className="text-center"
                        >
                          No artisans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentArtisans.map((artisan, index) => (
                        <TableRow key={artisan.id} className="cursor-pointer" onClick={() => {
                          setArtisanId(artisan.id);
                          setIsDialogOpen(true); // Open the dialog
                        }}>
                          <TableCell className="text-center">
                            {(indexOfFirstItem + index + 1)}.
                          </TableCell>
                          {/* Conditionally render TableCells based on visibleColumns state */}
                          {visibleColumns.id && <TableCell>{renderCellContent(artisan.id)}</TableCell>}
                          {visibleColumns.name && <TableCell className="font-medium">{properCase(artisan.name)}</TableCell>}
                          {visibleColumns.father_name && <TableCell>{properCase(artisan.father_name)}</TableCell>}
                          {visibleColumns.cnic && <TableCell>{renderCellContent(artisan.cnic)}</TableCell>}
                          {visibleColumns.gender && <TableCell>{renderCellContent(artisan.gender)}</TableCell>}
                          {visibleColumns.date_of_birth && <TableCell>{renderCellContent(artisan.date_of_birth)}</TableCell>} {/* You might want to format this date */}
                          {visibleColumns.contact_no && <TableCell>{renderCellContent(artisan.contact_no)}</TableCell>}
                          {visibleColumns.email && <TableCell>{renderCellContent(artisan.email)}</TableCell>}
                          {visibleColumns.address && <TableCell>{renderCellContent(artisan.address)}</TableCell>}
                          {visibleColumns.division_name && <TableCell>{renderCellContent(artisan.division_name)}</TableCell>}
                          {visibleColumns.district_name && <TableCell>{renderCellContent(artisan.district_name)}</TableCell>}
                          {visibleColumns.tehsil_name && <TableCell>{renderCellContent(artisan.tehsil_name)}</TableCell>}
                          {visibleColumns.dependents_count && <TableCell>{renderCellContent(artisan.dependents_count)}</TableCell>}
                          {visibleColumns.crafting_method && <TableCell>{renderCellContent(artisan.crafting_method)}</TableCell>}
                          {visibleColumns.ntn && <TableCell>{renderCellContent(artisan.ntn)}</TableCell>}
                          {visibleColumns.uc && <TableCell>{renderCellContent(artisan.uc)}</TableCell>}
                          {visibleColumns.craft_name && (
                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.craft_color,
                                  color: "black", // Assuming black text is readable on craft colors
                                }}
                              >
                                {renderCellContent(artisan.craft_name)}
                              </Badge>
                            </TableCell>
                          )}
                          {visibleColumns.category_name && (
                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.category_color,
                                  color: "black", // Assuming black text is readable on category colors
                                }}
                              >
                                {renderCellContent(artisan.category_name)}
                              </Badge>
                            </TableCell>
                          )}
                          {visibleColumns.skill_name && (
                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.skill_color,
                                  color: "black", // Assuming black text is readable on skill colors
                                }}
                              >
                                {renderCellContent(artisan.skill_name)}
                              </Badge>
                            </TableCell>
                          )}
                          {visibleColumns.education_name && <TableCell>{renderCellContent(artisan.education_name)}</TableCell>}
                          {visibleColumns.major_product && <TableCell>{renderCellContent(artisan.major_product)}</TableCell>}
                          {visibleColumns.experience && <TableCell>{renderCellContent(artisan.experience)}</TableCell>}
                          {visibleColumns.avg_monthly_income && (
                            <TableCell>
                              Rs. {renderCellContent(artisan.avg_monthly_income)} {/* Ensure avg_monthly_income is a number or handle string formatting */}
                            </TableCell>
                          )}
                          {visibleColumns.employment_type && <TableCell>{renderCellContent(artisan.employment_type)}</TableCell>}
                          {visibleColumns.raw_material && <TableCell>{renderCellContent(artisan.raw_material)}</TableCell>}
                          {visibleColumns.loan_status && (
                            <TableCell>
                              {artisan.loan_status === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.has_machinery && (
                            <TableCell>
                              {artisan.has_machinery === "Yes" ? (
                                <Badge variant="success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.has_training && (
                            <TableCell>
                              {artisan.has_training === "Yes" ? (
                                <Badge variant="success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.inherited_skills && (
                            <TableCell>
                              {artisan.inherited_skills === "Yes" ? (
                                <Badge variant="success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.financial_assistance && (
                            <TableCell>
                              {artisan.financial_assistance === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.technical_assistance && (
                            <TableCell>
                              {artisan.technical_assistance === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.comments && <TableCell>{renderCellContent(artisan.comments)}</TableCell>}
                          {visibleColumns.latitude && <TableCell>{renderCellContent(artisan.latitude)}</TableCell>}
                          {visibleColumns.longitude && <TableCell>{renderCellContent(artisan.longitude)}</TableCell>}
                          {visibleColumns.created_at && <TableCell>{renderCellContent(artisan.created_at)}</TableCell>} {/* You might want to format this date/time */}
                          {visibleColumns.username && <TableCell>{renderCellContent(artisan.username)}</TableCell>}


                          <TableCell className="text-right">
                            {/* TooltipProvider is needed once around the area using tooltips */}
                            {/* You might have it higher up in your component tree already */}
                            <TooltipProvider delayDuration={200}>
                              {/* Wrapper div for consistent spacing */}
                              <div className="flex items-center justify-end gap-x-1">
                                {" "}
                                {/* Use gap for spacing */}
                                {/* --- Print Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Keep outline for print as it's less common? Or use ghost.
                                      size="sm" // Consistent size
                                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-100 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-700" // Neutral subtle styling
                                      onClick={(e) => {
                                        window.open(
                                          `/artisans-directory/${artisan.id}/p`,
                                          "_blank"
                                        );
                                        e.stopPropagation();
                                      }}
                                    >
                                      <PrinterIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        Print Artisan Details
                                      </span>{" "}
                                      {/* Screen reader text */}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Print</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- View Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Ghost is common for subtle icon actions
                                      size="sm" // Consistent size
                                      className="text-white-600 hover:text-white-800 dark:text-white-400 dark:hover:text-white-300 hover:bg-white-100 dark:hover:bg-white-900/30" // white tint for 'view'
                                      onClick={(e) => {
                                        setArtisanId(artisan.id);
                                        setIsDialogOpen(true); // Open the dialog
                                        e.stopPropagation();
                                      }}
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        View Artisan Details
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Details</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- Edit Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Consistent ghost variant
                                      size="sm" // Consistent size
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30" // Blue/Amber tint for 'edit'
                                      onClick={(e) => {
                                        // Consider using react-router navigation instead of window.open for SPA consistency
                                        window.open(
                                          `/artisans-directory/${artisan.id}/edit`,
                                          "_blank"
                                        );
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">
                                        Edit Artisan
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- Delete Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Keep destructive for delete
                                      size="sm" // Consistent size
                                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30" // Destructive colors (often handled by variant, but explicit hover helps)
                                      onClick={(e) => {
                                        handleDelete(artisan.id); // Call the delete handler
                                        e.stopPropagation();
                                      }}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete Artisan
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-destructive text-destructive-foreground">
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TooltipProvider>

                            {/* --- Dialog for View --- */}
                            {/* The Dialog component itself remains unchanged logically */}
                            <Dialog
                              open={artisanId === artisan.id && isDialogOpen} // Only open if this row's ID matches and dialog is toggled
                              onOpenChange={(open) => {
                                setIsDialogOpen(open); // Allow closing via overlay click etc.
                                if (!open) {
                                  // Optional: Reset artisanId when dialog closes
                                  // setArtisanId(null);
                                }
                              }}
                            >
                              <DialogContent className="sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw] xl:max-w-[90vw] sm:max-h-[90vh] flex flex-col">
                                {/*  <DialogHeader>
                                 
                                </DialogHeader> */}
                                {/*  <DialogTitle>
                                  Artisan Details: {artisan.name}{" "}
                                  {artisan.father_name}
                                </DialogTitle> */}
                                {/* Ensure the content area scrolls if needed */}
                                <div className="flex-grow overflow-y-auto pr-2">
                                  {" "}
                                  {/* Add padding-right if scrollbar overlaps */}
                                  {/* Conditionally render Detail only when ID matches to potentially refetch data */}
                                  {artisanId === artisan.id && (
                                    <ArtisanDetail artisan_id={artisanId} />
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredArtisans.length)} of{" "}
                  {filteredArtisans.length} artisans
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={
                          currentPage === 1
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        currentPage > 3
                          ? totalPages - currentPage > 1
                            ? i + currentPage - 2 <= totalPages
                              ? i + currentPage - 2
                              : totalPages - 4 + i
                            : totalPages - 4 + i
                          : i + 1;
                      if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => paginate(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        className={
                          currentPage === totalPages || totalPages === 0
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ArtisansList;
