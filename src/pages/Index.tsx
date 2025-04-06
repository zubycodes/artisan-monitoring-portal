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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const API_BASE_URL = "http://13.239.184.38:6500";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [artisans, setArtisans]: any = useState({});
  const [dashboardData, setDashboardData]: any = useState({});
  const [topSkills, setTopSkills]: any = useState({});
  const [genderData, setGenderData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [craft, setCraft] = useState("");
  const [category, setCategory] = useState("");
  const [tehsil, setTehsil] = useState("");

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
    const fetchRawData = async (
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
          genderResponse,
          divisionResponse,
          ageResponse,
          dashboardResponse,
          topSkillResponse,
          artisansResponse,
          divisionsResponse,
          districtsResponse,
          tehsilsResponse,
          craftsResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/charts/gender?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(
            `${API_BASE_URL}/charts/division?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(
            `${API_BASE_URL}/charts/age?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(
            `${API_BASE_URL}/charts/dashboard?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(
            `${API_BASE_URL}/charts/topSkill?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(
            `${API_BASE_URL}/artisans?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&tehsil=${tehsil}`
          ),
          fetch(`${API_BASE_URL}/geo_level?code_length=3`),
          fetch(`${API_BASE_URL}/geo_level?code_length=6`),
          fetch(`${API_BASE_URL}/geo_level?code_length=9`),
          fetch(`${API_BASE_URL}/crafts`),
          fetch(`${API_BASE_URL}/categories`),
        ]);

        const genderData = await genderResponse.json();
        const divisionData = await divisionResponse.json();
        const ageData = await ageResponse.json();
        const dashboardData = await dashboardResponse.json();
        const topSkillData = await topSkillResponse.json();
        const artisansData = await artisansResponse.json();
        const divisionsData = await divisionsResponse.json();
        const districtsData = await districtsResponse.json();
        const tehsilsData = await tehsilsResponse.json();
        const craftsData = await craftsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setGenderData(genderData);
        setDivisionData(divisionData);
        setAgeData(ageData);
        setDashboardData(dashboardData[0]);
        setTopSkills(topSkillData);
        setArtisans(artisansData);
        setDivisions(divisionsData);
        setDistricts(districtsData);
        setTehsils(tehsilsData);
        setCrafts(craftsData);
        setCategoriesData(categoriesData);

        console.log(topSkills);
        console.log(artisans);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRawData(division, district, gender, craft, category, tehsil);
  }, [division, district, gender, craft, category, tehsil]);
  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardFilters
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
      />

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
          title="Regions Covered"
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
        />

        <PieChartCard
          title="Division Wise"
          data={divisionData}
          className="cursor-pointer"
          loading={loading}
        />
        <BarChartCard
          title="Top Skills Distribution"
          data={topSkills}
          className="cursor-pointer"
          loading={loading}
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
    </Layout>
  );
};
export { Dashboard, DashboardFilters };

const DashboardFilters = ({
  divisions,
  districts,
  tehsils,
  crafts,
  categories,
  setDivision,
  setDistrict,
  setGender,
  setCraft,
  setCategory,
  setTehsil,
}: any) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div>
          <label htmlFor="division" className="block text-sm font-bold mb-2">
            Division:
          </label>
          <Select onValueChange={(value) => setDivision(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select Division
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select Division</SelectItem>
              {divisions.map((division) => (
                <SelectItem key={division.code} value={division.name}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-bold mb-2">
            District:
          </label>
          <Select onValueChange={(value) => setDistrict(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select District
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select District</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.name}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="tehsil" className="block text-sm font-bold mb-2">
            Tehsil:
          </label>
          <Select onValueChange={(value) => setTehsil(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select Tehsil
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select Tehsil</SelectItem>
              {tehsils.map((tehsil) => (
                <SelectItem key={tehsil.code} value={tehsil.name}>
                  {tehsil.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-bold mb-2">
            Gender:
          </label>
          <Select onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select Gender
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select Gender</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="craft" className="block text-sm font-bold mb-2">
            Craft:
          </label>
          <Select onValueChange={(value) => setCraft(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select Craft
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select Craft</SelectItem>
              {crafts.map((craft) => (
                <SelectItem key={craft.id} value={craft.name}>
                  {craft.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-2">
            Category:
          </label>
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Select Category
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select">Select Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
