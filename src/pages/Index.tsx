
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import BarChartCard from '@/components/dashboard/BarChartCard';
import MapPreview from '@/components/dashboard/MapPreview';
import ArtisanActivity from '@/components/dashboard/ArtisanActivity';
import { Users, Palette, Map, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts
  const genderData = [
    { name: 'Male', value: 65, color: '#3b82f6' },
    { name: 'Female', value: 35, color: '#ec4899' },
  ];
  
  const regionData = [
    { name: 'Lahore', value: 30, color: '#3b82f6' },
    { name: 'Amritsar', value: 25, color: '#8b5cf6' },
    { name: 'Ludhiana', value: 20, color: '#10b981' },
    { name: 'Jalandhar', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#6b7280' },
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
  
  return (
    <Layout>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          className="stat-card-1"
          title="Total Artisans"
          value="1,247"
          description="Active artisans in the database"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          className="stat-card-2"
          title="Craft Categories"
          value="24"
          description="Different types of crafts"
          icon={<Palette className="h-5 w-5" />}
        />
        <StatCard
          className="stat-card-3"
          title="Regions Covered"
          value="18"
          description="Districts across Punjab"
          icon={<Map className="h-5 w-5" />}
        />
        <StatCard
          className="stat-card-4"
          title="Monthly Growth"
          value="8.3%"
          description="Increase in new registrations"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3.2, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PieChartCard 
          title="Gender Distribution" 
          data={genderData}
          className="cursor-pointer"
        />
        <PieChartCard 
          title="Regional Distribution" 
          data={regionData} 
          className="cursor-pointer"
        />
        <BarChartCard 
          title="Top Skills Distribution" 
          data={skillData} 
          className="cursor-pointer"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapPreview />
        <ArtisanActivity activities={recentActivities} />
      </div>
    </Layout>
  );
};

export default Dashboard;
