// FiltersAll.tsx
import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Filters, FiltersProps, SelectOption } from "./Filters";

export interface FiltersAllProps {
  hideQuery: boolean;
  onChange?: (selected: FiltersProps["selected"]) => void; // Callback to emit selected object
}

const FiltersAll: React.FC<FiltersAllProps> = ({ onChange, hideQuery = false }) => {
  // Initialize selected object with default SelectOption values
  const [selected, setSelected] = useState<FiltersProps["selected"]>({
    query: "",
    division: { name: "Select" },
    district: { name: "Select" },
    tehsil: { name: "Select" },
    gender: { name: "Select" },
    craft: { name: "Select" },
    category: { name: "Select" },
    technique: { name: "Select" },
    education: { name: "Select" }, // Assuming multi-select based on FilterSelect usage
    date_of_birth: { name: "Select" }, // Assuming string/date input, reset to null
    contact_no: { name: "Select" }, // Assuming string/number input, reset to null
    email: { name: "Select" }, // Assuming string input, reset to null
    address: { name: "Select" }, // Assuming string input, reset to null
    dependents_count: { name: "Select" }, // Assuming number input, reset to null
    crafting_method: { name: "Select" }, // Assuming SelectOption/array or { name: "Select" }, reset to null
    ntn: { name: "Select" }, // Assuming string/number input, reset to null
    uc: "", // Assuming string input, reset to null
    major_product: { name: "Select" }, // Assuming string input, reset to null
    experience: { name: "Select" }, // Assuming number input, reset to null
    avg_monthly_income: { name: "Select" }, // Assuming number input, reset to null
    employment_type: { name: "Select" }, // Assuming SelectOption/array or { name: "Select" }, reset to null
    raw_material: { name: "Select" }, // Updated to match SelectOption type
    loan_status: { name: "Select" }, // Assuming SelectOption or { name: "Select" }, reset to null
    has_machinery: { name: "Select" }, // Assuming string type as per Filters component
    has_training: { name: "Select" }, // Assuming string type as per Filters component
    inherited_skills: { name: "Select" }, // Assuming string type as per Filters component
    financial_assistance: { name: "Select" }, // Assuming string type as per Filters component
    technical_assistance: { name: "Select" }, // Assuming string type as per Filters component
    comments: { name: "Select" }, // Assuming string input, reset to null
    latitude: { name: "Select" }, // Assuming number input, reset to null
    longitude: { name: "Select" }, // Assuming number input, reset to null
    user_Id: { name: "Select" }, // Assuming number input, reset to null
  });

  // Define which filters to hide (true = hide, false = show) - Added new filters
  const hide: FiltersProps["hide"] = {
    query: hideQuery,
    division: false,
    district: false,
    tehsil: false,
    gender: false,
    craft: false,
    category: false,
    technique: false,
    // Set visibility for new filters (defaulting to false to show them)
    education: false,
    date_of_birth: false,
    contact_no: false,
    email: false,
    address: false,
    dependents_count: false,
    crafting_method: false,
    ntn: false,
    uc: false,
    major_product: false,
    experience: false,
    avg_monthly_income: false,
    employment_type: false,
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
    user_Id: false,
  };

  // Emit selected object whenever it changes
  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]); // Dependencies include selected and onChange

  return (
    <div>
      {/* Pass the updated selected state, setSelected function, and hide config */}
      <Filters selected={selected} setSelected={setSelected} hide={hide} />
      {/* Optional: Display the selected state for debugging */}
      {/* <pre>
         <code>{JSON.stringify(selected, null, 2)}</code>
      </pre> */}
    </div>
  );
};

export default FiltersAll;