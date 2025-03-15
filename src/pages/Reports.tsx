
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DownloadCloud, FileText } from 'lucide-react';

const Reports = () => {
  // Mock data for reports
  const monthlyData = [
    { name: 'Jan', artisans: 120, workshops: 20, certifications: 15 },
    { name: 'Feb', artisans: 132, workshops: 18, certifications: 22 },
    { name: 'Mar', artisans: 145, workshops: 25, certifications: 18 },
    { name: 'Apr', artisans: 160, workshops: 22, certifications: 24 },
    { name: 'May', artisans: 178, workshops: 28, certifications: 30 },
    { name: 'Jun', artisans: 195, workshops: 30, certifications: 25 },
  ];

  const craftData = [
    { name: 'Pottery', artisans: 85, avgIncome: 15000 },
    { name: 'Weaving', artisans: 120, avgIncome: 18000 },
    { name: 'Embroidery', artisans: 150, avgIncome: 22000 },
    { name: 'Woodwork', artisans: 95, avgIncome: 25000 },
    { name: 'Jewelry', artisans: 75, avgIncome: 30000 },
  ];

  return (
    <Layout>
      <PageHeader
        title="Reports & Analytics"
        description="Generate detailed reports on artisan activities, demographics, and performance metrics."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5">
            <DownloadCloud className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Save as Template</span>
          </Button>
        </div>
      </PageHeader>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Report Type</label>
              <Select defaultValue="growth">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="growth">Growth Analytics</SelectItem>
                  <SelectItem value="demographic">Demographic Analysis</SelectItem>
                  <SelectItem value="economic">Economic Impact</SelectItem>
                  <SelectItem value="skills">Skills Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Time Period</label>
              <Select defaultValue="6months">
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
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="amritsar">Amritsar</SelectItem>
                  <SelectItem value="ludhiana">Ludhiana</SelectItem>
                  <SelectItem value="patiala">Patiala</SelectItem>
                  <SelectItem value="jalandhar">Jalandhar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="crafts">Crafts</TabsTrigger>
          <TabsTrigger value="economic">Economic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="artisans" name="New Artisans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="workshops" name="Workshops" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="certifications" name="Certifications" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crafts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Craft Distribution & Economics</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={craftData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="artisans" name="Number of Artisans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgIncome" name="Average Monthly Income (₹)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="economic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Economic Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Economic impact data visualizations would appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
