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
} from "recharts";
import { DownloadCloud, FileText, LayoutGrid, Loader2 } from "lucide-react";
import Loader from "@/components/layout/Loader";
import { Filters } from "@/components/dashboard/Filters";

// Base API URL - update this with your actual API base URL
const API_BASE_URL = "http://localhost:6500";

const Reports = () => {
  // State for various chart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState("demographic");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("6months");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // States for different data tables
  const [artisans, setArtisans] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [techniqueSkills, setTechniqueSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [users, setUsers] = useState([]);

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [craft, setCraft] = useState("");
  const [category, setCategory] = useState("");
  const [tehsil, setTehsil] = useState("");

  // States for derived chart data
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

  // COLORS for pie charts and other visualizations
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
  ];

  // Fetch raw data from all tables
  useEffect(() => {
    const fetchRawData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/charts/all`);
        const data = await response.json();
        console.log(data);
        if (data.genderDistribution) {
          setGenderData(data.genderDistribution);
        }
        if (data.educationDistribution) {
          setEducationData(data.educationDistribution);
        }
        if (data.ageDistribution) {
          setAgeData(data.ageDistribution);
        }
        if (data.tehsilDistribution) {
          setTehsilData(data.tehsilDistribution);
        }
        if (data.incomeDistribution) {
          setIncomeData(data.incomeDistribution);
        }
        if (data.genderByTehsil) {
          setGenderByTehsilData(data.genderByTehsil);
        }
        if (data.dependentsDistribution) {
          setDependentsData(data.dependentsDistribution);
        }
        if (data.skillDistribution) {
          setSkillData(data.skillDistribution);
        }
        if (data.averageIncomeBySkill) {
          setIncomeBySkillData(data.averageIncomeBySkill);
        }
        if (data.experienceVsIncome) {
          setExperienceVsIncomeData(data.experienceVsIncome);
        }
        if (data.skillByEmploymentType) {
          setSkillByEmploymentData(data.skillByEmploymentType);
        }
        if (data.employmentTypeDistribution) {
          setEmploymentTypeData(data.employmentTypeDistribution);
        }
        if (data.experienceDistribution) {
          setExperienceData(data.experienceDistribution);
        }
        if (data.registrationsOverTime) {
          setRegistrationsTimeData(data.registrationsOverTime);
        }
        if (data.cumulativeRegistrations) {
          setCumulativeRegistrationsData(data.cumulativeRegistrations);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRawData();

    const fetchFiltersData = async (
      division: string,
      district: string,
      gender: string,
      craft: string,
      category: string,
      tehsil: string
    ) => {
      setLoading(true);
      try {
        const [
          divisionsResponse,
          districtsResponse,
          tehsilsResponse,
          craftsResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/geo_level?code_length=3`),
          fetch(`${API_BASE_URL}/geo_level?code_length=6`),
          fetch(`${API_BASE_URL}/geo_level?code_length=9`),
          fetch(`${API_BASE_URL}/crafts`),
          fetch(`${API_BASE_URL}/categories`),
        ]);

        const divisionsData = await divisionsResponse.json();
        const districtsData = await districtsResponse.json();
        const tehsilsData = await tehsilsResponse.json();
        const craftsData = await craftsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setDivisions(divisionsData);
        setDistricts(districtsData);
        setTehsils(tehsilsData);
        setCrafts(craftsData);
        setCategoriesData(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiltersData(division, district, gender, craft, category, tehsil);
  }, []);

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
    <Layout>
      <PageHeader
        title="Reports & Analytics"
        description="Generate detailed reports on artisan activities, demographics, and performance metrics."
      >
        <div className="flex gap-2">
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
        </div>
      </PageHeader>

      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* <Filters
            divisions={divisions}
            districts={districts}
            tehsils={tehsils}
            crafts={crafts}
            categories={categoriesData}
            setDivision={setDivision}
            setDistrict={setDistrict}
            setGender={setGender}
            setCraft={setCraft}
            setCategory={setCategory}
            setTehsil={setTehsil}
          /> */}
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
      </Card>

      {/* Demographic Analysis */}
      {selectedReportType === "demographic" && (
        <React.Fragment>
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
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
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
                    />
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
              <CardContent className="h-96">
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
                      interval={0} // Ensure all labels are shown
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
                    />
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
                    />
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
                    />
                    <Bar
                      dataKey="Female"
                      name="Female"
                      stackId="a"
                      fill="#ec4899"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Other"
                      name="Other"
                      stackId="a"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </React.Fragment>
      )}

      {/* Economic Impact */}
      {selectedReportType === "economic" && (
        <React.Fragment>
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
                    />
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
                    />
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
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4">
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
          </div>
        </React.Fragment>
      )}

      {/* Skills Distribution */}
      {selectedReportType === "skills" && (
        <React.Fragment>
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
                    />
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
                    {Object.keys(skillByEmploymentData[0] || {})
                      .filter((key) => key !== "skill")
                      .map((key, index) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          name={key}
                          stackId="a"
                          fill={COLORS[index % COLORS.length]}
                          radius={index === 0 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
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
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
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
                    data={experienceData}
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
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </React.Fragment>
      )}

      {/* Growth Analytics */}
      {selectedReportType === "growth" && (
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
                    />
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
      )}
    </Layout>
  );
};

export default Reports;
