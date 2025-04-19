import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

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
      <label className="block text-xs font-medium mb-1">{label}</label>
      <Select
        onValueChange={(val) => {
          const selectedOption = options.find(
            (option) => (option.code || option.id || option.name) === val
          );
          if (selectedOption) {
            onChange(selectedOption);
          } else {
            onChange({ name: defaultValue });
          }
        }}
      >
        <SelectTrigger className="text-xs">
          <SelectValue placeholder={placeholder}>
            {value.name !== defaultValue ? value.name : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="text-xs">
          <SelectItem value={defaultValue}>{defaultValue}</SelectItem>
          {options.map((option) => (
            <SelectItem
              key={option.code || option.id || option.name}
              value={option.code || option.id?.toString() || option.name}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:6500";

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
                        onChange={(value) =>
                          updateSelected("techniques", value)
                        }
                        placeholder="Select Technique/Skills"
                      />
                    )}
                  </div>
                </>
              )}

              <div
                className={`flex items-center justify-between ${
                  activeFiltersCount > 0
                    ? "mt-6 cursor-pointer transition-all"
                    : ""
                } `}
                /*  onClick={() => setFilterExpanded(!filterExpanded)} */
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
                  {/* <div className="bg-indigo-100 mt-2  p-2 rounded-lg">
                    <Filter className="h-5 w-5 text-indigo-600" />
                  </div> */}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { Filters, FilterSelect };
