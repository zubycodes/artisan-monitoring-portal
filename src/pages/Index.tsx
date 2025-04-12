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

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [craft, setCraft] = useState("");
  const [category, setCategory] = useState("");
  const [techniquesSkills, setTechniquesSkills] = useState("");
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
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [
          genderResponse,
          divisionResponse,
          ageResponse,
          dashboardResponse,
          topSkillResponse,
          artisansResponse,
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
        ]);

        const genderData = await genderResponse.json();
        const divisionData = await divisionResponse.json();
        const ageData = await ageResponse.json();
        const dashboardData = await dashboardResponse.json();
        const topSkillData = await topSkillResponse.json();
        const artisansData = await artisansResponse.json();

        setGenderData(genderData);
        setDivisionData(divisionData);
        setAgeData(ageData);
        setDashboardData(dashboardData[0]);
        setTopSkills(topSkillData);
        setArtisans(artisansData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty deps: runs once on mount

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const [
          genderResponse,
          divisionResponse,
          ageResponse,
          dashboardResponse,
          topSkillResponse,
          artisansResponse,
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
            `${API_BASE_URL}/artisans?division=${division}&district=${district}&gender=${gender}&craft=${craft}&category=${category}&skill=${techniquesSkills}&tehsil=${tehsil}`
          ),
        ]);
        const genderData = await genderResponse.json();
        const divisionData = await divisionResponse.json();
        const ageData = await ageResponse.json();
        const dashboardData = await dashboardResponse.json();
        const topSkillData = await topSkillResponse.json();
        const artisansData = await artisansResponse.json();

        setGenderData(genderData);
        setDivisionData(divisionData);
        setAgeData(ageData);
        setDashboardData(dashboardData[0]);
        setTopSkills(topSkillData);
        setArtisans(artisansData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setError("Failed to load filtered data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [division, district, gender, craft, category, tehsil, techniquesSkills]);
  if (loading) {
    return (
      <Layout>
        <Loader />
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

  const handleFilterChange = (selected: {
    division: SelectOption;
    district: SelectOption;
    tehsil: SelectOption;
    gender: SelectOption;
    craft: SelectOption;
    category: SelectOption;
    techniques: SelectOption;
  }) => {
    // Update the state with the selected values
    setDivision(
      selected.division.name == "Select" ? "" : selected.division.name
    );
    setDistrict(
      selected.district.name == "Select" ? "" : selected.district.name
    );
    setTehsil(selected.tehsil.name == "Select" ? "" : selected.tehsil.name);
    setCraft(selected.craft.name == "Select" ? "" : selected.craft.name);
    setCategory(
      selected.category.name == "Select" ? "" : selected.category.name
    );
    setTechniquesSkills(
      selected.techniques.name == "Select" ? "" : selected.techniques.name
    );
    setGender(selected.gender.name == "Select" ? "" : selected.gender.name);
  };

  return (
    <Layout>
      <FiltersAll onChange={handleFilterChange} />

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

export { Dashboard };
