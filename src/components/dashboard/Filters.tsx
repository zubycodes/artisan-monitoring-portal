import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Filter, X } from "lucide-react";

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

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  onChange,
  value,
  placeholder,
  defaultValue = "Select",
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-lg border-2 cursor-pointer ${
          value.name !== defaultValue
            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
            : "border-gray-200 hover:border-gray-300 text-gray-700"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className="truncate">
            {value.name !== defaultValue ? value.name : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          <div className="py-1">
            <div
              className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange({ name: defaultValue });
                setIsOpen(false);
              }}
            >
              <span className="flex-grow">{defaultValue}</span>
              {value.name === defaultValue && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </div>

            {options.map((option) => (
              <div
                key={option.code || option.id || option.name}
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="flex-grow truncate">{option.name}</span>
                {value.name === option.name && (
                  <Check className="h-4 w-4 text-indigo-600" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export interface FiltersProps {
  selected: {
    division: SelectOption;
    district: SelectOption;
    tehsil: SelectOption;
    gender: SelectOption;
    craft: SelectOption;
    category: SelectOption;
    techniques: SelectOption;
  };
  hide?: {
    division?: boolean;
    district?: boolean;
    tehsil?: boolean;
    gender?: boolean;
    craft?: boolean;
    category?: boolean;
    techniques?: boolean;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<{
      division: SelectOption;
      district: SelectOption;
      tehsil: SelectOption;
      gender: SelectOption;
      craft: SelectOption;
      category: SelectOption;
      techniques: SelectOption;
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
  const [originalTechniques, setOriginalTechniques] = useState<SelectOption[]>(
    []
  );
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://3.106.165.252:6500";

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
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/geo_level?code_length=3`),
          fetch(`${API_BASE_URL}/geo_level?code_length=6`),
          fetch(`${API_BASE_URL}/geo_level?code_length=9`),
          fetch(`${API_BASE_URL}/crafts`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/techniques`),
        ]);

        const divisionsData = await divisionsResponse.json();
        const districtsData = await districtsResponse.json();
        const tehsilsData = await tehsilsResponse.json();
        const craftsData = await craftsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const techniquesData = await techniquesResponse.json();

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
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Effects for filter dependencies
  useEffect(() => {
    if (selected.division.name !== "Select" && selected.division.name !== "") {
      setDistricts(
        originalDistricts.filter((x) =>
          x.code.startsWith(selected.division.code)
        )
      );
    } else {
      setDistricts(originalDistricts);
    }
  }, [selected.division, originalDistricts]);

  useEffect(() => {
    if (selected.district.name !== "Select" && selected.district.name !== "") {
      setTehsils(
        originalTehsils.filter((x) => x.code.startsWith(selected.district.code))
      );
    } else {
      setTehsils(originalTehsils);
    }
  }, [selected.district, originalTehsils]);

  useEffect(() => {
    if (selected.craft.name !== "Select" && selected.craft.name !== "") {
      setCategories(
        originalCategories.filter((x) => x.craft_Id === selected.craft.id)
      );
    } else {
      setCategories(originalCategories);
    }
  }, [selected.craft, originalCategories]);

  useEffect(() => {
    if (selected.category.name !== "Select" && selected.category.name !== "") {
      setTechniques(
        originalTechniques.filter((x) => x.category_Id === selected.category.id)
      );
    } else {
      setTechniques(originalTechniques);
    }
  }, [selected.category, originalTechniques]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.values(selected).forEach((filter) => {
      if (filter.name !== "Select" && filter.name !== "") {
        count++;
      }
    });
    setActiveFiltersCount(count);
  }, [selected]);

  // Static gender options
  const genderOptions = [
    { name: "Male" },
    { name: "Female" },
    { name: "Other" },
  ];

  // Function to update the selected object
  const updateSelected = (key: keyof typeof selected, value: SelectOption) => {
    setSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelected({
      division: { name: "Select" },
      district: { name: "Select" },
      tehsil: { name: "Select" },
      gender: { name: "Select" },
      craft: { name: "Select" },
      category: { name: "Select" },
      techniques: { name: "Select" },
    });
  };

  // Create an array of active filters for the summary display
  const activeFilters = Object.entries(selected)
    .filter(([_, value]) => value.name !== "Select" && value.name !== "")
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value.name,
    }));

  return (
    <div className="mb-8">
      {/* Collapsible Filter Header */}
      <div className="mb-4">
        <div
          className={`flex items-center justify-between ${
            activeFiltersCount > 0
              ? "bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-md"
              : ""
          } `}
          onClick={() => setFilterExpanded(!filterExpanded)}
        >
          <div className="flex items-center gap-3">
            <div>
              {activeFilters.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter.key}
                      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-700"
                    >
                      <span className="font-medium">{filter.label}:</span>{" "}
                      {filter.value}
                      <button
                        onClick={(e) => {
                          updateSelected(filter.key as keyof typeof selected, {
                            name: "Select",
                          });
                          e.stopPropagation();
                        }}
                        className="ml-1 p-0.5 rounded-full hover:bg-indigo-100"
                      >
                        <X className="h-3.5 w-3.5 text-indigo-500" />
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
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Clear all
              </button>
            )}
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Filter className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Form */}
      {filterExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!hide.division && (
                  <FilterSelect
                    label="Division"
                    options={divisions}
                    value={selected.division}
                    onChange={(value) => updateSelected("division", value)}
                    placeholder="Select Division"
                  />
                )}

                {!hide.district && (
                  <FilterSelect
                    label="District"
                    options={districts}
                    value={selected.district}
                    onChange={(value) => updateSelected("district", value)}
                    placeholder="Select District"
                  />
                )}

                {!hide.tehsil && (
                  <FilterSelect
                    label="Tehsil"
                    options={tehsils}
                    value={selected.tehsil}
                    onChange={(value) => updateSelected("tehsil", value)}
                    placeholder="Select Tehsil"
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
                  />
                )}

                {!hide.category && (
                  <FilterSelect
                    label="Category"
                    options={categories}
                    value={selected.category}
                    onChange={(value) => updateSelected("category", value)}
                    placeholder="Select Category"
                  />
                )}

                {!hide.techniques && (
                  <FilterSelect
                    label="Technique/Skills"
                    options={techniques}
                    value={selected.techniques}
                    onChange={(value) => updateSelected("techniques", value)}
                    placeholder="Select Technique/Skills"
                  />
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export { Filters, FilterSelect };
