
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import BarChartCard from '@/components/dashboard/BarChartCard';
import MapPreview from '@/components/dashboard/MapPreview';
import ArtisanActivity from '@/components/dashboard/ArtisanActivity';
import { Users, Palette, Map, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_BASE_URL = 'http://13.239.184.38:6500';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [artisans, setArtisans]: any = useState({});
  const [dashboardData, setDashboardData]: any = useState({});
  const [topSkills, setTopSkills]: any = useState({});
  const [genderData, setGenderData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  // Mock data for charts
  /*  const genderData = [
     { name: 'Male', value: 65, color: '#3b82f6' },
     { name: 'Female', value: 35, color: '#ec4899' },
   ]; */

   const colors = [
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#10b981', // Green
    '#f59e0b', // Orange
    '#ef4444', // Red
    '#fcd34d', // Yellow
    '#06b6d4', // Cyan
    '#ec4899', // Magenta
    '#84cc16', // Lime Green
    '#fb7185', // Coral
  ];

  const skillData = [
    { name: 'Pottery', value: 38 },
    { name: 'Weaving', value: 52 },
    { name: 'Woodwork', value: 35 },
    { name: 'Metalwork', value: 20 },
    { name: 'Embroidery', value: 45 },
  ];

  const recentActivities = [
    {
      id: '1',
      name: 'Amrit Singh',
      action: 'updated skills in',
      craft: 'Phulkari Embroidery',
      time: '2 hours ago',
    },
    {
      id: '2',
      name: 'Gurpreet Kaur',
      action: 'registered as a new artisan in',
      craft: 'Pottery',
      time: '5 hours ago',
    },
    {
      id: '3',
      name: 'Harjinder Kumar',
      action: 'uploaded new work in',
      craft: 'Wood Carving',
      time: 'Yesterday',
    },
    {
      id: '4',
      name: 'Rajvir Patel',
      action: 'completed certification in',
      craft: 'Metalwork',
      time: '2 days ago',
    },
  ];
  useEffect(() => {
    const fetchRawData = async () => {
      setLoading(true);
      try {
        const genderResponse = await fetch(`${API_BASE_URL}/charts/gender`);
        const genderData = await genderResponse.json();
        setGenderData(genderData);


        const divisionResponse = await fetch(`${API_BASE_URL}/charts/division`);
        const divisionData = await divisionResponse.json();
        setDivisionData(divisionData);

        const ageResponse = await fetch(`${API_BASE_URL}/charts/age`);
        const ageData = await ageResponse.json();
        setAgeData(ageData);

        const dashboardResponse = await fetch(`${API_BASE_URL}/charts/dashboard`);
        const dashboardData = await dashboardResponse.json();
        setDashboardData(dashboardData[0]);

        const topSkillResponse = await fetch(`${API_BASE_URL}/charts/topSkill`);
        const topSkillData = await topSkillResponse.json();
        setTopSkills(topSkillData);
        console.log(topSkills);

        const artisansResponse = await fetch(`${API_BASE_URL}/artisans`);
        const artisansData = await artisansResponse.json();
        setArtisans(artisansData);
        console.log(artisans);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRawData();
  }, []);
  return (
    <Layout>

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
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => value.toLocaleString()}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                <Legend />
                <Bar dataKey="value" name="Number of People" fill="#10b981" radius={[4, 4, 0, 0]}
                  barSize={40} label={{ position: 'top' }}>
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

export default Dashboard;
