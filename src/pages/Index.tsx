import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import PieChartCard from "@/components/dashboard/PieChartCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import MapPreview from "@/components/dashboard/MapPreview";
import ArtisanActivity from "@/components/dashboard/ArtisanActivity";
import { Users, Palette, Map, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Loader from "@/components/layout/Loader";
import FiltersAll from "@/components/dashboard/FiltersAll";
import { SelectOption } from "@/components/dashboard/Filters";
import { ReportsSection } from "./Reports";
import ArtisanListDialog from "@/components/dashboard/ArtisanListDialog";

const API_BASE_URL = "https://artisan-psic.com";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const [artisans, setArtisans]: any = useState({});
  const [dashboardData, setDashboardData]: any = useState({});
  const [topSkills, setTopSkills]: any = useState({});
  const [genderData, setGenderData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [ageData, setAgeData] = useState([]);


  const [listQuery, setListQuery] = useState({});

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


  const colors = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#10b981", // Green
    "#f59e0b", // Orange
    "#ef4444", // Red
    "#fcd34d", // Yellow
    "#06b6d4", // Cyan
    "#ec4899", // Magenta
    "#84cc16", // Lime Green
    "#fb7185", // Coral
  ];

  useEffect(() => {
    // This effect runs on mount AND whenever any of the filter states change
    // If you used the first useEffect for initial load without filters,
    // you might adjust this one to only run *after* filters have potentially been set.
    // However, fetching with empty strings initially works fine for most APIs.
    const fetchFilteredData = async () => {
      setLoading(true); // Start loading when dependencies change
      setError(null); // Clear previous errors

      console.log(query);

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
      const url = `${API_BASE_URL}/charts`; // Base URL assuming charts endpoints are under /charts
      const artisansUrl = `${API_BASE_URL}/artisans`;

      try {
        const [
          genderResponse,
          divisionResponse,
          ageResponse,
          dashboardResponse,
          topSkillResponse,
          artisansResponse,
        ] = await Promise.all([
          fetch(`${url}/gender?${queryString}`),
          fetch(`${url}/division?${queryString}`),
          fetch(`${url}/age?${queryString}`),
          fetch(`${url}/dashboard?${queryString}`),
          fetch(`${url}/topSkill?${queryString}`),
          fetch(`${artisansUrl}?${queryString}`), // Apply filters to artisans endpoint as well
        ]);

        // Check for OK status for each response
        if (!genderResponse.ok) throw new Error(`HTTP error! status: ${genderResponse.status} for gender data`);
        if (!divisionResponse.ok) throw new Error(`HTTP error! status: ${divisionResponse.status} for division data`);
        if (!ageResponse.ok) throw new Error(`HTTP error! status: ${ageResponse.status} for age data`);
        if (!dashboardResponse.ok) throw new Error(`HTTP error! status: ${dashboardResponse.status} for dashboard data`);
        if (!topSkillResponse.ok) throw new Error(`HTTP error! status: ${topSkillResponse.status} for top skill data`);
        if (!artisansResponse.ok) throw new Error(`HTTP error! status: ${artisansResponse.status} for artisans data`);


        const genderData = await genderResponse.json();
        const divisionData = await divisionResponse.json();
        const ageData = await ageResponse.json();
        const dashboardData = await dashboardResponse.json();
        const topSkillData = await topSkillResponse.json();
        const artisansData = await artisansResponse.json();


        setGenderData(genderData);
        setDivisionData(divisionData);
        setAgeData(ageData);
        setDashboardData(dashboardData); // Assuming dashboard endpoint returns an array with one item
        setTopSkills(topSkillData);
        setArtisans(artisansData);

      } catch (err: any) { // Use 'any' or a more specific error type
        console.error("Error fetching filtered data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false); // End loading after fetch completes
      }
    };

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
    query,
    uc
  ]); // Effect dependencies array

  const handleBarClick = async (data, index, type) => {
    console.log(data);
    console.log(type);

    setIsLoadingDetails(true);
    setIsListDialogOpen(true);
    setListQuery({ type, name: data.name });
    setError(null); // Clear previous errors
    try {
      /*  // Fetch the detailed records, applying current filters PLUS the clicked gender
       const detailedRecords = await chartOps.getArtisansListFiltered({
         ...filters, // Spread all current filters
         gender: clickedGender, // Add the specific clicked gender filter
       });
       setClickedArtisansData(detailedRecords);
       setSelectedGender(clickedGender); */
    } catch (err) {
      /*       console.error(`Error fetching details for ${clickedGender}:`, err);
            setError(`Failed to load details for ${clickedGender}.`);
            setClickedArtisansData([]); // Clear details on error
            setSelectedGender(null); // Clear selected gender */
    } finally {
      setIsLoadingDetails(false);
    }
  };
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


  const handleFilterChange = (selected: FilterSelections) => {
    console.log(selected);
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
    // Iterate over the keys of the selected filters

    // If you have user_Id or other filters not following this pattern, handle them separately
    // Example: if user_Id is just a string or number
    // if (selected.user_Id !== undefined) {
    //   setUserId(selected.user_Id);
    // }
  };

  /* if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  } */

  if (error) {
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <FiltersAll onChange={handleFilterChange} hideQuery={true} />
      <ArtisanListDialog query={listQuery} isDialogOpen={isListDialogOpen} artisans={artisans} onChange={(open) => setIsListDialogOpen(open)}></ArtisanListDialog>
      {
        loading ? (
          <Loader />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard
                className="stat-card-1"
                title="Total Artisans"
                value={dashboardData.total_active_artisans}
                description="Total artisans in the database"
                icon={<Users className="h-5 w-5" />}
                trend={{ value: 12, isPositive: true }}
              />
              {/*  <StatCard
          className="stat-card-2"
          title="Crafts"
          value={dashboardData.total_active_artisans}
          description="Different types of crafts"
          icon={<Palette className="h-5 w-5" />}
        /> */}
              <StatCard
                className="stat-card-3"
                title="Tehsils Covered"
                value={dashboardData.regions_covered}
                description="Tehsils across Punjab"
                icon={<Map className="h-5 w-5" />}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatCard
                className="stat-card-4"
                title="This Month"
                value={dashboardData.new_registrations_this_month}
                description="New registrations this month"
                icon={<TrendingUp className="h-5 w-5" />}
                trend={{ value: 3.2, isPositive: true }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
              <PieChartCard
                title="Gender Distribution"
                data={genderData}
                className="cursor-pointer"
                loading={loading}
                onClick={(e) => handleBarClick(e, 0, 'gender')}
              />

              <PieChartCard
                title="Division Wise"
                data={divisionData}
                className="cursor-pointer"
                loading={loading}
                onClick={(e) => handleBarClick(e, 0, 'division')}
              />
              <BarChartCard
                title="Top Skills Distribution"
                data={topSkills}
                className="cursor-pointer"
                loading={loading}
                onClick={(e) => handleBarClick(e, 0, 'skill')}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MapPreview artisans={artisans} loading={loading} />
              {/*  <ArtisanActivity activities={recentActivities} /> */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(value) => value.toLocaleString()}
                        label={{
                          value: "Count",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [value.toLocaleString(), "Count"]}
                      />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Number of People"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        label={{ position: "top" }}
                        onClick={(e) => handleBarClick(e, 0, 'age')}
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            {/* <ReportsSection></ReportsSection> */}
          </div>

        )
      }


    </Layout>
  );
};

export { Dashboard };
