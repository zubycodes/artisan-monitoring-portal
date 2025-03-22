import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Cell
} from 'recharts';
import { DownloadCloud, FileText, Loader2 } from 'lucide-react';

// Base API URL - update this with your actual API base URL
const API_BASE_URL = '/api';

const Reports = () => {
  // State for various chart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState('demographic');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // States for different chart data
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
  const [cumulativeRegistrationsData, setCumulativeRegistrationsData] = useState([]);
  const [experienceVsIncomeData, setExperienceVsIncomeData] = useState([]);

  // COLORS for pie charts and other visualizations
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data based on the selected report type
        if (selectedReportType === 'demographic') {
          const [genderRes, educationRes, ageRes, tehsilRes, genderByTehsilRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/charts/gender`),
            axios.get(`${API_BASE_URL}/charts/education`),
            axios.get(`${API_BASE_URL}/charts/age`),
            axios.get(`${API_BASE_URL}/charts/tehsil`),
            axios.get(`${API_BASE_URL}/charts/gender-by-tehsil`)
          ]);

          setGenderData(genderRes.data);
          setEducationData(educationRes.data);
          setAgeData(ageRes.data);
          setTehsilData(tehsilRes.data);
          setGenderByTehsilData(genderByTehsilRes.data);
        }
        else if (selectedReportType === 'economic') {
          const [incomeRes, incomeBySkillRes, experienceVsIncomeRes, dependentsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/charts/income`),
            axios.get(`${API_BASE_URL}/charts/income-by-skill`),
            axios.get(`${API_BASE_URL}/charts/experience-vs-income`),
            axios.get(`${API_BASE_URL}/charts/dependents`)
          ]);

          setIncomeData(incomeRes.data);
          setIncomeBySkillData(incomeBySkillRes.data);
          setExperienceVsIncomeData(experienceVsIncomeRes.data);
          setDependentsData(dependentsRes.data);
        }
        else if (selectedReportType === 'skills') {
          const [skillRes, employmentRes, experienceRes, skillByEmploymentRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/charts/skill`),
            axios.get(`${API_BASE_URL}/charts/employment-type`),
            axios.get(`${API_BASE_URL}/charts/experience`),
            axios.get(`${API_BASE_URL}/charts/skill-by-employment`)
          ]);

          setSkillData(skillRes.data);
          setEmploymentTypeData(employmentRes.data);
          setExperienceData(experienceRes.data);
          setSkillByEmploymentData(skillByEmploymentRes.data);
        }
        else if (selectedReportType === 'growth') {
          const [registrationsRes, cumulativeRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/charts/registrations-time`),
            axios.get(`${API_BASE_URL}/charts/cumulative-registrations`)
          ]);

          setRegistrationsTimeData(registrationsRes.data);
          setCumulativeRegistrationsData(cumulativeRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedReportType, selectedTimePeriod, selectedRegion]);

  // Function to export data
  const handleExport = () => {
    // Implement export functionality
    alert('Export functionality will be implemented here');
  };

  // Function to save as template
  const handleSaveTemplate = () => {
    // Implement save as template functionality
    alert('Save as template functionality will be implemented here');
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading chart data...</span>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500">{error}</p>
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
          <Button variant="outline" className="gap-1.5" onClick={handleSaveTemplate}>
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
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demographic">Demographic Analysis</SelectItem>
                  <SelectItem value="economic">Economic Impact</SelectItem>
                  <SelectItem value="skills">Skills Distribution</SelectItem>
                  <SelectItem value="growth">Growth Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Time Period</label>
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
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {tehsilData && tehsilData.map((item, index) => (
                    <SelectItem key={index} value={item.name.toLowerCase()}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographic Analysis */}
      {selectedReportType === 'demographic' && (
        <Tabs defaultValue="gender" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="age">Age</TabsTrigger>
            <TabsTrigger value="geographical">Geographical</TabsTrigger>
          </TabsList>

          <TabsContent value="gender" className="space-y-6">
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education Level Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={educationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="age" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of People" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographical Distribution by Tehsil</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
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
                    <Bar dataKey="value" name="Number of People" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
                    <XAxis dataKey="tehsil" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="male" name="Male" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Female" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Economic Impact */}
      {selectedReportType === 'economic' && (
        <Tabs defaultValue="income" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="incomeBySkill">Income by Skill</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="space-y-6">
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
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of People" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of People" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incomeBySkill" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Income by Skill</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
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
                    <Bar dataKey="avgIncome" name="Average Income" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Experience vs Income</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="experience" name="Years of Experience" />
                    <YAxis type="number" dataKey="income" name="Monthly Income" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Experience vs Income" data={experienceVsIncomeData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Skills Distribution */}
      {selectedReportType === 'skills' && (
        <Tabs defaultValue="skillDistribution" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="skillDistribution">Skills</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="skillDistribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
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
                    <Bar dataKey="value" name="Number of People" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution by Employment Type</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillByEmploymentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(skillByEmploymentData[0] || {})
                      .filter(key => key !== 'skill')
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
          </TabsContent>

          <TabsContent value="employment" className="space-y-6">
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employmentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
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
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of People" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Growth Analytics */}
      {selectedReportType === 'growth' && (
        <Tabs defaultValue="registrationsTime" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="registrationsTime">Registrations</TabsTrigger>
            <TabsTrigger value="cumulativeGrowth">Cumulative Growth</TabsTrigger>
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
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Registrations" stroke="#3b82f6" activeDot={{ r: 8 }} />
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
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="count" name="Total Registrations" stroke="#10b981" fill="#10b98133" />
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