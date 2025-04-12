// FiltersAll.tsx
import React, { useState, useEffect } from "react";
import { Filters, FiltersProps } from "./Filters";

export interface FiltersAllProps {
  onChange?: (selected: FiltersProps["selected"]) => void; // Callback to emit selected object
}

const FiltersAll: React.FC<FiltersAllProps> = ({ onChange }) => {
  // Initialize selected object with default SelectOption values
  const [selected, setSelected] = useState<FiltersProps["selected"]>({
    division: { name: "Select" },
    district: { name: "Select" },
    tehsil: { name: "Select" },
    gender: { name: "Select" },
    craft: { name: "Select" },
    category: { name: "Select" },
    techniques: { name: "Select" },
  });

  // Define which filters to hide (true = hide, false = show)
  const hide: FiltersProps["hide"] = {
    division: false,
    district: false,
    tehsil: false,
    gender: false,
    craft: false,
    category: false,
    techniques: false,
  };

  // Emit selected object whenever it changes
  useEffect(() => {
    if (onChange) {
      console.log("Selected filters:", selected);
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <div>
      <Filters selected={selected} setSelected={setSelected} hide={hide} />
      {/*       <pre>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </pre> */}
    </div>
  );
};

export default FiltersAll;
