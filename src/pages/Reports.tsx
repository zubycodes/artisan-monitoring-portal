import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Label,
} from "recharts";
import { DownloadCloud, FileText, LayoutGrid, Loader2 } from "lucide-react";
import Loader from "@/components/layout/Loader";
import { SelectOption } from "@/components/dashboard/Filters";
import FiltersAll from "@/components/dashboard/FiltersAll";
// Assume Filters component handles its own state and calls onChange prop
// with selected filter values

// Base API URL - update this with your actual API base URL
const API_BASE_URL = "https://artisan-psic.com";

const ReportsSection = () => {
  // State for various chart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState("demographic");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("6months"); // This filter isn't currently used in API calls
  const [selectedRegion, setSelectedRegion] = useState("all"); // This filter isn't currently used in API calls

  // --- Filter States (KEEP THESE) ---
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [craft, setCraft] = useState("");
  const [category, setCategory] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [techniquesSkills, setTechniquesSkills] = useState(""); // Assuming skill filter state name
  const [education, setEducation] = useState(""); // Assuming education filter state name
  const [rawMaterialFilter, setRawMaterialFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [craftingMethodFilter, setCraftingMethodFilter] = useState("");
  const [avgMonthlyIncomeFilter, setAvgMonthlyIncomeFilter] = useState("");
  const [dependentsCountFilter, setDependentsCountFilter] = useState("");
  const [inheritedSkillsFilter, setInheritedSkillsFilter] = useState("");
  const [hasMachineryFilter, setHasMachineryFilter] = useState("");
  const [hasTrainingFilter, setHasTrainingFilter] = useState("");
  const [loanStatusFilter, setLoanStatusFilter] = useState("");
  const [financialAssistanceFilter, setFinancialAssistanceFilter] = useState("");
  const [technicalAssistanceFilter, setTechnicalAssistanceFilter] = useState("");
  // --- End Filter States ---


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
    "#008080", // Teal
    "#FF4500", // Orange Red
    "#2E8B57", // Sea Green
    "#DAA520", // Goldenrod
    "#483D8B", // Dark Slate Blue
    "#40E0D0", // Turquoise
    "#FF6347", // Tomato
    "#B22222", // Firebrick
    "#00CED1", // Dark Turquoise
    "#FF8C00", // Dark Orange
    "#ADFF2F", // Green Yellow
    "#FF69B4", // Hot Pink
    "#7FFF00", // Chartreuse
    "#DC143C", // Crimson
    "#00BFFF", // Deep Sky Blue
  ];
  // States for derived chart data (KEEP THESE)
  const [genderData, setGenderData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [employmentTypeData, setEmploymentTypeData] = useState([]);
  const [tehsilData, setTehsilData] = useState([]);
  const [incomeBySkillData, setIncomeBySkillData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [dependentsData, setDependentsData] = useState([]);
  const [genderByTehsilData, setGenderByTehsilData] = useState([]);
  const [skillByEmploymentData, setSkillByEmploymentData] = useState([]);
  const [registrationsTimeData, setRegistrationsTimeData] = useState([]);
  const [cumulativeRegistrationsData, setCumulativeRegistrationsData] =
    useState([]);
  const [experienceVsIncomeData, setExperienceVsIncomeData] = useState([]);
  const [geographicalDistributionData, setGeographicalDistributionData] = useState([]); // Added state for geographical data

  const experienceDataSorted = () => {
    function getStartNumber(name) {
      const parts = name.split(/[-+]/);
      return parseInt(parts[0], 10);
    }
    return [...experienceData].sort((a, b) => getStartNumber(a.name) - getStartNumber(b.name));
  }
  const sortedExperienceData = experienceDataSorted();
  // COLORS for pie charts and other visualizations (KEEP THESE)
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1",
  ];

  // Mapping filter keys to state setters
  // NOTE: Ensure these keys match the names used in the FiltersAll component's onChange output
  const filterStateSetters = {
    division: setDivision,
    district: setDistrict,
    tehsil: setTehsil,
    gender: setGender,
    craft: setCraft,
    category: setCategory,
    technique: setTechniquesSkills, // Assuming 'technique' is the key from FiltersAll
    education: setEducation,
    raw_material: setRawMaterialFilter,
    employment_type_id: setEmploymentTypeFilter, // Assuming 'employment_type_id' is the key from FiltersAll
    crafting_method: setCraftingMethodFilter,
    avg_monthly_income: setAvgMonthlyIncomeFilter,
    dependents_count: setDependentsCountFilter,
    inherited_skills: setInheritedSkillsFilter,
    has_machinery: setHasMachineryFilter,
    has_training: setHasTrainingFilter,
    loan_status: setLoanStatusFilter,
    financial_assistance: setFinancialAssistanceFilter,
    technical_assistance: setTechnicalAssistanceFilter,
    // Add other filter keys from FiltersAll here
  };

  // Generic function to process filter value (copy from Dashboard component)
  const processFilterValue = (value: SelectOption | SelectOption[] | null | undefined): string => {
    if (!value) {
      return ""; // Handle null or undefined
    }
    if (Array.isArray(value)) {
      const names = value
        .map(item => item?.name)
        .filter(name => typeof name === 'string' && name !== '');
      return names.join(','); // Join valid names with a comma
    } else {
      if (typeof value === 'object' && value !== null && value.name && value.name !== 'Select') {
        return value.name;
      }
      return ""; // Return empty string for "Select" or invalid single values
    }
  };


  // Handler for filter changes from FiltersAll component
  const handleFilterChange = (selected: { [key: string]: SelectOption | SelectOption[] | null | undefined | string }) => {
    Object.keys(filterStateSetters).forEach(key => {
      // Ensure the key exists in the incoming selected object before processing
      if (selected.hasOwnProperty(key)) {
        const setter = filterStateSetters[key as keyof typeof filterStateSetters];
        const selectedValue = selected[key];
        const processedValue = processFilterValue(selectedValue as SelectOption | SelectOption[]);
        setter(processedValue);
      }
    });
  };


  // Effect to fetch data whenever filter states change
  useEffect(() => {
    const fetchFilteredReportsData = async () => {
      /* setLoading(true); */
      setError(null);

      // --- Construct Query Parameters ---
      const queryParams = new URLSearchParams();
      if (division) queryParams.append('division', division);
      if (district) queryParams.append('district', district);
      if (gender) queryParams.append('gender', gender);
      if (craft) queryParams.append('craft', craft);
      if (category) queryParams.append('category', category);
      if (tehsil) queryParams.append('tehsil', tehsil);
      // Assuming 'skill' is the query parameter name expected by backend for techniques/skills
      if (techniquesSkills) queryParams.append('skill', techniquesSkills);
      // Add new filters to query params (ensure names match backend expectation)
      if (education) queryParams.append('education', education);
      if (rawMaterialFilter) queryParams.append('raw_material', rawMaterialFilter);
      // Assuming 'employment_type' is the query parameter name expected by backend
      if (employmentTypeFilter) queryParams.append('employment_type', employmentTypeFilter);
      if (craftingMethodFilter) queryParams.append('crafting_method', craftingMethodFilter);
      if (avgMonthlyIncomeFilter) queryParams.append('avg_monthly_income', avgMonthlyIncomeFilter);
      if (dependentsCountFilter) queryParams.append('dependents_count', dependentsCountFilter);
      if (inheritedSkillsFilter) queryParams.append('inherited_skills', inheritedSkillsFilter);
      if (hasMachineryFilter) queryParams.append('has_machinery', hasMachineryFilter);
      if (hasTrainingFilter) queryParams.append('has_training', hasTrainingFilter);
      if (loanStatusFilter) queryParams.append('loan_status', loanStatusFilter);
      if (financialAssistanceFilter) queryParams.append('financial_assistance', financialAssistanceFilter);
      if (technicalAssistanceFilter) queryParams.append('technical_assistance', technicalAssistanceFilter);

      // Note: selectedTimePeriod and selectedRegion are not used in API call yet
      // If backend needs these, add them here.

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/charts/all?${queryString}`; // Append query string

      try {
        console.log("Fetching reports data with URL:", url); // Log the fetch URL

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched reports data:", data); // Log received data

        // Update all state variables with the fetched data
        // Ensure the keys in the response match the data structure expected here
        if (data.genderDistribution) setGenderData(data.genderDistribution); else setGenderData([]);
        if (data.educationDistribution) setEducationData(data.educationDistribution); else setEducationData([]);
        if (data.ageDistribution) setAgeData(data.ageDistribution); else setAgeData([]);
        if (data.tehsilDistribution) setTehsilData(data.tehsilDistribution); else setTehsilData([]);
        if (data.incomeDistribution) setIncomeData(data.incomeDistribution); else setIncomeData([]);
        if (data.genderByTehsil) setGenderByTehsilData(data.genderByTehsil); else setGenderByTehsilData([]);
        if (data.dependentsDistribution) setDependentsData(data.dependentsDistribution); else setDependentsData([]);
        if (data.skillDistribution) setSkillData(data.skillDistribution); else setSkillData([]);
        if (data.averageIncomeBySkill) setIncomeBySkillData(data.averageIncomeBySkill); else setIncomeBySkillData([]);
        if (data.experienceVsIncome) setExperienceVsIncomeData(data.experienceVsIncome); else setExperienceVsIncomeData([]);
        if (data.skillByEmploymentType) setSkillByEmploymentData(data.skillByEmploymentType); else setSkillByEmploymentData([]);
        if (data.employmentTypeDistribution) setEmploymentTypeData(data.employmentTypeDistribution); else setEmploymentTypeData([]);
        if (data.experienceDistribution) setExperienceData(data.experienceDistribution); else setExperienceData([]);
        if (data.registrationsOverTime) setRegistrationsTimeData(data.registrationsOverTime); else setRegistrationsTimeData([]);
        if (data.cumulativeRegistrations) setCumulativeRegistrationsData(data.cumulativeRegistrations); else setCumulativeRegistrationsData([]);
        if (data.geographicalDistribution) setGeographicalDistributionData(data.geographicalDistribution); else setGeographicalDistributionData([]); // Update geographical data state


      } catch (err: any) { // Use 'any' or a more specific error type
        console.error("Error fetching filtered reports data:", err);
        setError(`Failed to load reports data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchFilteredReportsData();

  }, [
    // --- DEPENDENCY ARRAY: Add all filter states here ---
    division,
    district,
    gender,
    craft,
    category,
    tehsil,
    techniquesSkills,
    education,
    rawMaterialFilter,
    employmentTypeFilter,
    craftingMethodFilter,
    avgMonthlyIncomeFilter,
    dependentsCountFilter,
    inheritedSkillsFilter,
    hasMachineryFilter,
    hasTrainingFilter,
    loanStatusFilter,
    financialAssistanceFilter,
    technicalAssistanceFilter,
    // Add other filter states to the dependency array
    // Note: selectedReportType, selectedTimePeriod, selectedRegion are *not* in the dependencies
    // because they only control *which* charts are displayed, not which data is fetched.
    // If you wanted to only fetch data for the currently selected report type,
    // the logic would be more complex, fetching only specific endpoints.
  ]);
  const allEmploymentTypes = Array.from(
    new Set(
      skillByEmploymentData.flatMap((item) =>
        Object.keys(item).filter((key) => key !== "skill")
      )
    )
  );
  // Function to export data
  const handleExport = () => {
    // Implement export functionality
    alert("Export functionality will be implemented here");
  };

  // Function to save as template
  const handleSaveTemplate = () => {
    // Implement save as template functionality
    alert("Save as template functionality will be implemented here");
  };

  // Render loading state
  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  // Render error state
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (

    <div>
      {/*  <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Report Type
              </label>
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demographic">
                    Demographic Analysis
                  </SelectItem>
                  <SelectItem value="economic">Economic Impact</SelectItem>
                  <SelectItem value="skills">Skills Distribution</SelectItem>
                  <SelectItem value="growth">Growth Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Time Period
              </label>
              <Select
                value={selectedTimePeriod}
                onValueChange={setSelectedTimePeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {tehsilData &&
                    tehsilData.map((item, index) => (
                      <SelectItem key={index} value={item.name.toLowerCase()}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card> */}
      <div className="mb-6">
        <FiltersAll onChange={handleFilterChange} hideQuery={true} /> {/* Integrate the FiltersAll component */}
      </div>
      {/* Demographic Analysis */}
      <React.Fragment>
        <p className="font-serif my-4 text-center text-4xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Demographic Analysis</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
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
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value) => value.toLocaleString()}
                    /> {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Education Level Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[80vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={educationData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
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
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar
                    dataKey="value"
                    name="Education Level Distribution"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographical Distribution by Tehsil</CardTitle>
            </CardHeader>
            <CardContent className="h-[150vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tehsilData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Number of People"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {tehsilData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution by Tehsil</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genderByTehsilData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="tehsil"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Male"
                    name="Male"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="Male"
                      position="insideTop"
                      formatter={(value) => value.toLocaleString()}
                    />
                  </Bar>
                  <Bar
                    dataKey="Female"
                    name="Female"
                    stackId="a"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="Female"
                      position="insideTop"
                      formatter={(value) => value.toLocaleString()}
                    />
                  </Bar>
                  <Bar
                    dataKey="Other"
                    name="Other"
                    stackId="a"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="Other"
                      position="insideTop"
                      formatter={(value) => value.toLocaleString()}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </React.Fragment>

      {/* Economic Impact */}
      <React.Fragment>
        <p className="font-serif my-4 text-center text-4xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Economic Impact</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Number of People"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dependents Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dependentsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Number of People"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {dependentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Income by Skill</CardTitle>
            </CardHeader>
            <CardContent className="h-[150vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeBySkillData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="skill" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="avgIncome"
                    name="Average Income"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="avgIncome"
                      position="right"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {incomeBySkillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Experience vs Income</CardTitle>
            </CardHeader>
            <CardContent className="h-[50vh]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="experience"
                    name="Years of Experience"
                  />
                  <YAxis
                    type="number"
                    dataKey="income"
                    name="Monthly Income"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Experience vs Income"
                    data={experienceVsIncomeData}
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div> */}
      </React.Fragment>

      {/* Skills Distribution */}
      <React.Fragment>
        <p className="font-serif my-4 text-center text-4xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Skills Distribution</p>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[90vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Number of People"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution by Employment Type</CardTitle>
            </CardHeader>
            <CardContent className="h-[90vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillByEmploymentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="skill"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {allEmploymentTypes.map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      name={key}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                      radius={index === 0 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    >
                      <LabelList
                        dataKey={key}
                        position="insideTop"
                        formatter={(value) => value.toLocaleString()}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Employment Type Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employmentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value, percent }) =>
                      `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedExperienceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Number of People"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value) => value.toLocaleString()}
                    />
                    {sortedExperienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </React.Fragment>

      {/* Growth Analytics */}
      <React.Fragment>
        <p className="font-serif my-4 text-center text-4xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Growth Analytics</p>
        <Tabs defaultValue="registrationsTime" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="registrationsTime">Registrations</TabsTrigger>
            <TabsTrigger value="cumulativeGrowth">
              Cumulative Growth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrationsTime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrations Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={registrationsTimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Registrations"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    >
                      {registrationsTimeData.map((entry, index) => (
                        <Label
                          key={`label-${index}`}
                          value={entry.value.toLocaleString()}
                          position="top"
                        />
                      ))}
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cumulativeGrowth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Registrations</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={cumulativeRegistrationsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Total Registrations"
                      stroke="#10b981"
                      fill="#10b98133"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </React.Fragment>
    </div>
  );
};

const Reports = () => {

  return (
    <Layout>
      <PageHeader
        title="Reports & Analytics"
        description="Generate detailed reports on artisan activities, demographics, and performance metrics."
      >
        {/* <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5" onClick={handleExport}>
            <DownloadCloud className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={handleSaveTemplate}
          >
            <FileText className="h-4 w-4" />
            <span>Save as Template</span>
          </Button>
        </div> */}
      </PageHeader>

      <ReportsSection />
    </Layout>
  );
};
export { Reports, ReportsSection };
