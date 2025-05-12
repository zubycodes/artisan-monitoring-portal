import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronsUpDown, Filter, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

export interface SelectOption {
  code?: string;
  id?: number;
  name: string;
  craft_Id?: number;
  category_Id?: number;
}

interface FilterSelectProps {
  label: string;
  options: SelectOption[];
  value: SelectOption;
  onChange: (value: SelectOption) => void;
  placeholder: string;
  defaultValue?: string;
  icon?: React.ReactNode;
}


const FilterSelect = ({
  label,
  options,
  onChange,
  value,
  placeholder = "Select",
  defaultValue = "Select",
  isMulti = false,
  isSearchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(isMulti ? [] : null as any);
  const dropdownRef = useRef(null);

  // Initialize selectedItems based on value prop
  useEffect(() => {
    if (isMulti) {
      setSelectedItems(Array.isArray(value) ? value : []);
    } else {
      setSelectedItems(value);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isMulti) {
      setSelectedItems(Array.isArray(value) ? value : []);
    } else {
      setSelectedItems(value);
    }
  }, [value]);

  const filteredOptions = (isSearchable && searchQuery
    ? options.filter(option =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : options).sort((a, b) => a.name.localeCompare(b.name));
  // Handle selection for multi-select
  const handleSelect = (option) => {
    if (isMulti) {
      const isSelected = selectedItems.some(item =>
        (item.id || item.code || item.name) === (option.id || option.code || option.name));

      let newSelectedItems;
      if (isSelected) {
        newSelectedItems = selectedItems.filter(item =>
          (item.id || item.code || item.name) !== (option.id || option.code || option.name));
      } else {
        newSelectedItems = [...selectedItems, option];
      }

      setSelectedItems(newSelectedItems);
      onChange(newSelectedItems);
    } else {
      setSelectedItems(option);
      onChange(option);
      setIsOpen(false);
    }
  };

  // Handle removing a selected item in multi-select mode
  const handleRemoveItem = (e, option) => {
    e.stopPropagation();
    const newSelectedItems = selectedItems.filter(item =>
      (item.id || item.code || item.name) !== (option.id || option.code || option.name));
    setSelectedItems(newSelectedItems);
    onChange(newSelectedItems);
  };

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Check if an option is selected
  const isOptionSelected = (option) => {
    if (isMulti) {
      return selectedItems.some(item =>
        (item.id || item.code || item.name) === (option.id || option.code || option.name));
    } else {
      return selectedItems &&
        (selectedItems.id || selectedItems.code || selectedItems.name) ===
        (option.id || option.code || option.name);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>

      {/* Custom Select Trigger */}
      <div
        className="flex items-center justify-between w-full px-3 py-2 text-xs border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {isMulti ? (
            selectedItems.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 rounded text-blue-800 dark:text-blue-200">
                    {item.name}
                    <X
                      size={12}
                      className="cursor-pointer text-blue-800 dark:text-blue-200"
                      onClick={(e) => handleRemoveItem(e, item)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
            )
          ) : (
            selectedItems && selectedItems.name !== defaultValue ?
              selectedItems.name :
              <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown size={16} className="text-gray-400 dark:text-gray-500" />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg border-gray-300 dark:border-gray-600">
          {/* Search Input */}
          {isSearchable && (
            <div className="p-2 border-b border-gray-300 dark:border-gray-600">
              <input
                type="text"
                className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Default Option */}
          {!isMulti && (
            <div
              className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200"
              onClick={() => handleSelect({ name: defaultValue })}
            >
              {defaultValue}
              {selectedItems && selectedItems.name === defaultValue && (
                <Check size={16} className="text-blue-500 dark:text-blue-400" />
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.code || option.id || option.name}
                  className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200"
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                  {isOptionSelected(option) && (
                    <Check size={16} className="text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export interface FiltersProps {
  selected: {
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
  };
  hide?: {
    query?: boolean;
    division?: boolean;
    district?: boolean;
    tehsil?: boolean;
    gender?: boolean;
    craft?: boolean;
    category?: boolean;
    technique?: boolean;
    education?: boolean;
    date_of_birth?: boolean;
    contact_no?: boolean;
    email?: boolean;
    address?: boolean;
    dependents_count?: boolean;
    crafting_method?: boolean;
    ntn?: boolean;
    uc?: boolean;
    major_product?: boolean;
    experience?: boolean;
    avg_monthly_income?: boolean;
    employment_type?: boolean;
    raw_material?: boolean;
    loan_status?: boolean;
    has_machinery?: boolean;
    has_training?: boolean;
    inherited_skills?: boolean;
    financial_assistance?: boolean;
    technical_assistance?: boolean;
    comments?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    user_Id?: boolean;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<{
      query: string;
      division: SelectOption;
      district: SelectOption;
      tehsil: SelectOption;
      gender: SelectOption;
      craft: SelectOption;
      category: SelectOption;
      technique: SelectOption;
      education: SelectOption;
      date_of_birth: SelectOption;
      contact_no: SelectOption;
      email: SelectOption;
      address: SelectOption;
      dependents_count: SelectOption;
      crafting_method: SelectOption | null;
      ntn: SelectOption;
      uc: string;
      major_product: SelectOption;
      experience: SelectOption;
      avg_monthly_income: SelectOption;
      employment_type: SelectOption | null;
      raw_material: SelectOption | null;
      loan_status: SelectOption | null;
      has_machinery: SelectOption;
      has_training: SelectOption;
      inherited_skills: SelectOption;
      financial_assistance: SelectOption;
      technical_assistance: SelectOption;
      comments: SelectOption;
      latitude: SelectOption;
      longitude: SelectOption;
      user_Id: SelectOption;
    }>
  >;
}

const Filters: React.FC<FiltersProps> = ({
  selected,
  setSelected,
  hide = {},
}) => {
  const [divisions, setDivisions] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [originalDistricts, setOriginalDistricts] = useState<SelectOption[]>(
    []
  );
  const [tehsils, setTehsils] = useState<SelectOption[]>([]);
  const [originalTehsils, setOriginalTehsils] = useState<SelectOption[]>([]);
  const [crafts, setCrafts] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [originalCategories, setOriginalCategories] = useState<SelectOption[]>(
    []
  );
  const [techniques, setTechniques] = useState<SelectOption[]>([]);
  const [originalTechniques, setOriginalTechniques] = useState<SelectOption[]>([]);
  const [educations, setEducations] = useState<SelectOption[]>([]);
  const [employmentTypes] = useState([
    { id: 2, name: "Self Employed" },
    { id: 1, name: "Employee" },
    { id: 3, name: "Entrepreneur" },
  ] as SelectOption[]);
  const [rawMaterial] = useState([
    { name: "Local" },
    { name: "Imported" },
  ] as SelectOption[]);
  const [craftingMethods] = useState([
    { name: "Handmade" },
    { name: "Machine" },
    { name: "Both" },
  ] as SelectOption[]);
  const [incomes] = useState([
    { name: "Minimum 10,000" },
    { name: "Minimum 15,000" },
    { name: "Minimum 20,000" },
    { name: "Minimum 25,000" },
    { name: "Minimum 30,000" }
  ] as SelectOption[]);
  const [dependants] = useState([
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6 or more" },
  ] as SelectOption[]);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "https://artisan-psic.com";

  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [
          divisionsResponse,
          districtsResponse,
          tehsilsResponse,
          craftsResponse,
          categoriesResponse,
          techniquesResponse,
          educationResponse, // Added education fetch
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/geo_level?code_length=3`),
          fetch(`${API_BASE_URL}/geo_level?code_length=6`),
          fetch(`${API_BASE_URL}/geo_level?code_length=9`),
          fetch(`${API_BASE_URL}/crafts`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/techniques`),
          fetch(`${API_BASE_URL}/education`), // Fetch education data
        ]);

        const divisionsData = await divisionsResponse.json();
        const districtsData = await districtsResponse.json();
        const tehsilsData = await tehsilsResponse.json();
        const craftsData = await craftsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const techniquesData = await techniquesResponse.json();
        const educationData = await educationResponse.json(); // Parse education data


        setDivisions(divisionsData);
        setDistricts(districtsData);
        setOriginalDistricts(districtsData);
        setTehsils(tehsilsData);
        setOriginalTehsils(tehsilsData);
        setCrafts(craftsData);
        setCategories(categoriesData);
        setOriginalCategories(categoriesData);
        setTechniques(techniquesData);
        setOriginalTechniques(techniquesData);
        setEducations(educationData); // Set education options
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Helper function to process a selected filter value (single or array)
  // and return an array of specific properties (code or id)
  const getSelectedPropertyValues = (
    selectedFilter: SelectOption | SelectOption[] | null | undefined,
    property: 'code' | 'id' // Specify which property to extract
  ): (string | number)[] => {
    if (!selectedFilter) {
      return []; // Return empty array if no selection
    }

    if (Array.isArray(selectedFilter)) {
      // Multi-select: map array to get property values, filter out invalid ones
      return selectedFilter
        .map(item => item?.[property]) // Use bracket notation for property access
        .filter(value => value !== null && value !== undefined && value !== ''); // Filter out null, undefined, empty string
    } else {
      // Single select: get property value, return in an array if valid
      const value = selectedFilter[property];
      if (value !== null && value !== undefined && value !== '' && selectedFilter.name !== 'Select') {
        return [value];
      }
      return []; // Return empty array if "Select" or invalid single value
    }
  };

  // Effects for filter dependencies

  // Effect for filtering Districts based on selected Divisions
  useEffect(() => {
    const selectedDivisionCodes = getSelectedPropertyValues(selected.division, 'code');

    if (selectedDivisionCodes.length > 0) {
      // Filter districts where code starts with ANY of the selected division codes
      setDistricts(
        originalDistricts.filter(district =>
          selectedDivisionCodes.some(code =>
            typeof district.code === 'string' && district.code.startsWith(code as string)
          )
        )
      );
    } else {
      // No divisions selected, show all districts
      setDistricts(originalDistricts);
    }
  }, [selected.division, originalDistricts]);


  // Effect for filtering Tehsils based on selected Districts
  useEffect(() => {
    const selectedDistrictCodes = getSelectedPropertyValues(selected.district, 'code');

    if (selectedDistrictCodes.length > 0) {
      // Filter tehsils where code starts with ANY of the selected district codes
      setTehsils(
        originalTehsils.filter(tehsil =>
          selectedDistrictCodes.some(code =>
            typeof tehsil.code === 'string' && tehsil.code.startsWith(code as string)
          )
        )
      );
    } else {
      // No districts selected, show all tehsils
      setTehsils(originalTehsils);
    }
  }, [selected.district, originalTehsils]);


  // Effect for filtering Categories based on selected Crafts
  useEffect(() => {
    const selectedCraftIds = getSelectedPropertyValues(selected.craft, 'id');

    if (selectedCraftIds.length > 0) {
      // Filter categories where craft_Id matches ANY of the selected craft ids
      setCategories(
        originalCategories.filter(category =>
          selectedCraftIds.some(id => category.craft_Id === id)
        )
      );
    } else {
      // No crafts selected, show all categories
      setCategories(originalCategories);
    }
  }, [selected.craft, originalCategories]);


  // Effect for filtering Techniques based on selected Categories
  useEffect(() => {
    const selectedCategoryIds = getSelectedPropertyValues(selected.category, 'id');

    if (selectedCategoryIds.length > 0) {
      // Filter techniques where category_Id matches ANY of the selected category ids
      setTechniques(
        originalTechniques.filter(technique =>
          selectedCategoryIds.some(id => technique.category_Id === id)
        )
      )
    } else {
      // No categories selected, show all techniques
      setTechniques(originalTechniques);
    }
  }, [selected.category, originalTechniques]);
  // Count active filters
  /*  useEffect(() => {
     let count = 0;
     Object.values(selected).forEach((filter) => {
       if (filter.name !== "Select" && filter.name !== "") {
         count++;
       }
     });
     setActiveFiltersCount(count);
   }, [selected]); */

  // Static gender options
  const genderOptions = [
    { name: "Male" },
    { name: "Female" },
    { name: "Other" },
  ];
  const booleanOptions: SelectOption[] = [
    { name: "Yes", id: 1 },
    { name: "No", id: 0 },
  ];

  // Function to update the selected object
  const updateSelected = (key: keyof typeof selected, value: SelectOption | string) => {
    console.log("Updating selected:", key, value);

    setSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelected({
      query: "",
      division: { name: "Select" },
      district: { name: "Select" },
      tehsil: { name: "Select" },
      gender: { name: "Select" },
      craft: { name: "Select" },
      category: { name: "Select" },
      technique: { name: "Select" },
      education: { name: "Select" }, // Assuming multi-select based on usage below
      date_of_birth: null,
      contact_no: null,
      email: null,
      address: null,
      dependents_count: null,
      crafting_method: null, // Reset to null or appropriate default
      ntn: null,
      uc: null,
      major_product: null,
      experience: null,
      avg_monthly_income: null,
      employment_type: null, // Reset to null or appropriate default
      raw_material: null,
      loan_status: null, // Reset to null or appropriate default
      has_machinery: null, // Reset boolean to null
      has_training: null,
      inherited_skills: null,
      financial_assistance: null,
      technical_assistance: null,
      comments: null,
      latitude: null,
      longitude: null,
      user_Id: null,
    });
  };

  // Create an array of active filters for the summary display
  /*  const activeFilters = Object.entries(selected)
     .filter(([_, value]) => value.name !== "Select" && value.name !== "")
     .map(([key, value]) => ({
       key,
       label: key.charAt(0).toUpperCase() + key.slice(1),
       value: value.name,
     })); */
  // State to hold the current input value (optional, but often useful)
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  // Ref to hold the debounced function.
  // Using useRef ensures the same debounced function instance is used across renders.
  const debouncedUpdate = useRef(
    debounce((name, queryValue) => {
      // This function will be called after the debounce delay
      console.log("Debounced search query:", queryValue);
      updateSelected(name, queryValue);
    }, 500) // Set your desired debounce delay in milliseconds (e.g., 500ms)
  ).current; // .current gets the actual debounced function

  // Effect to clean up the timeout when the component unmounts
  useEffect(() => {
    // The cleanup function returned by useEffect will run when the component unmounts
    // or before the effect runs again (though in this case, the ref prevents re-creation)
    return () => {
      // Clear any pending timeout when the component is unmounted
      // This prevents updateSelected from being called after the component is gone
      // debouncedUpdate.cancel && debouncedUpdate.cancel(); // If your debounce has a cancel method
      // A simple clearTimeout(timeoutId) inside the debounce closure is also common
    };
  }, [debouncedUpdate]); // Dependency array includes the debounced function ref

  // Handler for the input change event
  const handleInputChange = (name, e) => {
    const value = e.target.value;
    debouncedUpdate(name, value); // Call the debounced function
  };
  return (
    <div className="mb-8">
      {/* Collapsible Filter Header */}

      {/* Filter Form */}
      {filterExpanded && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">

                    {!hide.query && (
                      <div className="relative w-full">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Search</label>

                        <input
                          placeholder="Name, CNIC, Contact, Address..."
                          onChange={(e) => handleInputChange('query', e)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs border rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />

                      </div>

                    )}

                    {!hide.division && (
                      <FilterSelect
                        label="Division"
                        options={divisions}
                        value={selected.division}
                        onChange={(value) => updateSelected("division", value)}
                        placeholder="Select Division"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}

                    {!hide.district && (
                      <FilterSelect
                        label="District"
                        options={districts}
                        value={selected.district}
                        onChange={(value) => updateSelected("district", value)}
                        placeholder="Select District"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}

                    {!hide.tehsil && (
                      <FilterSelect
                        label="Tehsil"
                        options={tehsils}
                        value={selected.tehsil}
                        onChange={(value) => updateSelected("tehsil", value)}
                        placeholder="Select Tehsil"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}

                    {!hide.gender && (
                      <FilterSelect
                        label="Gender"
                        options={genderOptions}
                        value={selected.gender}
                        onChange={(value) => updateSelected("gender", value)}
                        placeholder="Select Gender"
                      />
                    )}

                    {!hide.craft && (
                      <FilterSelect
                        label="Craft"
                        options={crafts}
                        value={selected.craft}
                        onChange={(value) => updateSelected("craft", value)}
                        placeholder="Select Craft"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}

                    {!hide.category && (
                      <FilterSelect
                        label="Category"
                        options={categories}
                        value={selected.category}
                        onChange={(value) => updateSelected("category", value)}
                        placeholder="Select Category"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}
                    {!hide.technique && (
                      <FilterSelect
                        label="Technique/Skills"
                        options={techniques}
                        value={selected.technique}
                        onChange={(value) =>
                          updateSelected("technique", value)
                        }
                        placeholder="Select Technique/Skills"
                        isMulti={true}
                        isSearchable={true}
                      />
                    )}


                    {!hide.uc && (
                      <div className="relative w-full">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">UC</label>

                        <input
                          placeholder="Search by UC name..."
                          onChange={(e) => handleInputChange('uc', e)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs border rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />

                      </div>

                    )}


                    {!hide.education && (
                      <FilterSelect
                        label="Education Level"
                        options={educations}
                        value={selected.education} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("education", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Education Level"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}
                    {!hide.raw_material && (
                      <FilterSelect
                        label="Raw Material"
                        options={rawMaterial}
                        value={selected.raw_material} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("raw_material", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Raw Material"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}

                    {!hide.employment_type && (
                      <FilterSelect
                        label="Employment Type"
                        options={employmentTypes}
                        value={selected.employment_type} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("employment_type", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Employment Type"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}
                    {!hide.crafting_method && (
                      <FilterSelect
                        label="Crafting Method"
                        options={craftingMethods}
                        value={selected.crafting_method} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("crafting_method", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Crafting Method"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}
                    {!hide.avg_monthly_income && (
                      <FilterSelect
                        label="Avg Monthly Income (PKR)"
                        options={incomes}
                        value={selected.avg_monthly_income} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("avg_monthly_income", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Avg Monthly Income"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}
                    {!hide.dependents_count && (
                      <FilterSelect
                        label="No. of Dependents"
                        options={dependants}
                        value={selected.dependents_count} // Pass array or single object based on desired behavior
                        onChange={(value) => updateSelected("dependents_count", value)} // Assume multi-select for consistency with other lists
                        placeholder="Select Dependents"
                        isMulti={true} // Set true if multi-select is desired
                        isSearchable={true}
                      />
                    )}

                    {!hide.inherited_skills && (
                      <FilterSelect
                        label="Inherited Skill?"
                        options={booleanOptions}
                        value={selected.inherited_skills}
                        onChange={(value) => updateSelected("inherited_skills", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}
                    {!hide.has_machinery && (
                      <FilterSelect
                        label="Has Machinery"
                        options={booleanOptions}
                        value={selected.has_machinery}
                        onChange={(value) => updateSelected("has_machinery", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}
                    {!hide.has_training && (
                      <FilterSelect
                        label="Has Training"
                        options={booleanOptions}
                        value={selected.has_training}
                        onChange={(value) => updateSelected("has_training", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}
                    {!hide.loan_status && (
                      <FilterSelect
                        label="Loan Availed?"
                        options={booleanOptions}
                        value={selected.loan_status}
                        onChange={(value) => updateSelected("loan_status", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}
                    {!hide.financial_assistance && (
                      <FilterSelect
                        label="Financial Assistance Needed?"
                        options={booleanOptions}
                        value={selected.financial_assistance}
                        onChange={(value) => updateSelected("financial_assistance", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}
                    {!hide.technical_assistance && (
                      <FilterSelect
                        label="Technical Assistance Needed?"
                        options={booleanOptions}
                        value={selected.technical_assistance}
                        onChange={(value) => updateSelected("technical_assistance", value)}
                        placeholder="Select"
                        isMulti={false}
                      />
                    )}

                  </div>
                </>
              )}

              {/*  <div
                className={`flex items-center justify-between ${activeFiltersCount > 0
                  ? "mt-6 cursor-pointer transition-all"
                  : ""
                  } `}
              >
                <div className="flex items-center gap-3">
                  <div>
                    {activeFilters.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                          <div
                            key={filter.key}
                            className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full border border-indigo-100 text-xs"
                          >
                            <span className="font-medium">{filter.label}:</span>{" "}
                            {filter.value}
                            <button
                              onClick={(e) => {
                                updateSelected(
                                  filter.key as keyof typeof selected,
                                  {
                                    name: "Select",
                                  }
                                );
                                e.stopPropagation();
                              }}
                              className="ml-1 p-0.5 rounded-full hover:bg-indigo-100"
                            >
                              <X className="h-3.5 w-3.5 hover:text-black" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAllFilters();
                      }}
                      className="text-sm mt-2 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div> */}
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { Filters, FilterSelect };
