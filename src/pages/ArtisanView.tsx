import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapIcon, Phone, Mail, Home, Calendar, Award, Banknote,
  Briefcase, Users, FileText, ArrowLeft, PencilIcon
} from "lucide-react";

const ArtisanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanDetail = async () => {
      try {
        // In a real app, replace with your actual API call
        const response = await fetch(`/api/artisans/${id}`);
        const data = await response.json();
        setArtisan(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artisan details:", error);
        // Mock data for demonstration
        setArtisan({
          id: parseInt(id),
          name: `Artisan ${id}`,
          father_name: `Father of Artisan ${id}`,
          cnic: `36302-${id}-12345`,
          gender: parseInt(id) % 2 === 0 ? "Male" : "Female",
          date_of_birth: "1985-05-15",
          contact_no: `0300-1234-${id.padStart(3, '0')}`,
          email: `artisan${id}@example.com`,
          address: "123 Craft Street, Artisan Colony, Lahore",
          tehsil_id: 2,
          education_level_id: 3,
          dependents_count: 4,
          profile_picture: `/profiles/artisan${id}.jpg`,
          ntn: parseInt(id) % 3 === 0 ? `NTN-${id}-12345` : null,
          skill_id: parseInt(id) % 8 + 1,
          major_product: "Traditional Handwoven Carpets",
          experience: 12,
          avg_monthly_income: 35000,
          employment_type_id: 2,
          raw_material: "Wool, Cotton, Natural Dyes",
          loan_status: parseInt(id) % 3 === 0,
          has_machinery: true,
          has_training: parseInt(id) % 2 === 0,
          inherited_skills: true,
          financial_assistance: parseInt(id) % 4 === 0,
          technical_assistance: parseInt(id) % 3 === 0,
          comments: "Specializes in traditional patterns with modern color schemes. Has participated in international exhibitions.",
          latitude: 31.5204 + (parseInt(id) * 0.01),
          longitude: 74.3587 + (parseInt(id) * 0.01),
          created_at: "2023-06-15T10:30:00",
          updated_at: "2024-02-20T14:45:00",
          isActive: 1,
          user_Id: parseInt(id) + 100
        });
        setLoading(false);
      }
    };

    fetchArtisanDetail();
  }, [id]);

  // Helper functions to get readable values
  const getEducationLevel = (levelId) => {
    const educationLevels = {
      1: "Primary",
      2: "Middle",
      3: "Matriculation",
      4: "Intermediate",
      5: "Bachelors",
      6: "Masters",
      7: "Other"
    };
    return educationLevels[levelId] || "Unknown";
  };

  const getSkillName = (skillId) => {
    const skillMap = {
      1: "Woodworking",
      2: "Pottery",
      3: "Weaving",
      4: "Metalwork",
      5: "Embroidery",
      6: "Jewelry Making",
      7: "Leatherwork",
      8: "Glass Blowing"
    };
    return skillMap[skillId] || `Skill ${skillId}`;
  };

  const getTehsilName = (tehsilId) => {
    const tehsilMap = {
      1: "Lahore Cantt",
      2: "Lahore City",
      3: "Raiwind",
      4: "Shalimar",
      5: "Model Town"
    };
    return tehsilMap[tehsilId] || `Tehsil ${tehsilId}`;
  };

  const getEmploymentType = (typeId) => {
    const employmentTypes = {
      1: "Self-employed",
      2: "Family Business",
      3: "Employed by Workshop"
    };
    return employmentTypes[typeId] || "Unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <p>Loading artisan details...</p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-2xl font-bold mb-2">Artisan Not Found</h2>
            <p className="text-gray-500 mb-4">The artisan you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/artisans")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Artisans List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center">
        <Button variant="outline" size="sm" onClick={() => navigate("/artisans")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <h1 className="text-2xl font-bold ml-4">Artisan Profile</h1>
        <div className="ml-auto">
          <Button variant="outline" className="mr-2" onClick={() => navigate(`/artisans/edit/${id}`)}>
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-0">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={artisan.profile_picture} alt={artisan.name} />
                <AvatarFallback>{getInitials(artisan.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-center mt-2">{artisan.name}</CardTitle>
              <Badge className="mt-1">{getSkillName(artisan.skill_id)}</Badge>
              <CardDescription className="text-center mt-1">
                {artisan.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Inactive
                  </Badge>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <span>{artisan.contact_no}</span>
              </div>
              {artisan.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-3" />
                  <span>{artisan.email}</span>
                </div>
              )}
              <div className="flex items-center">
                <Home className="h-4 w-4 text-gray-500 mr-3" />
                <span>{artisan.address || "Address not provided"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                <span>Born: {formatDate(artisan.date_of_birth)}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-gray-500 mr-3" />
                <span>Experience: {artisan.experience} years</span>
              </div>
              <div className="flex items-center">
                <Banknote className="h-4 w-4 text-gray-500 mr-3" />
                <span>Monthly Income: Rs. {artisan.avg_monthly_income?.toLocaleString() || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-3" />
                <span>Dependents: {artisan.dependents_count}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 text-gray-500 mr-3" />
                <span>Employment: {getEmploymentType(artisan.employment_type_id)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-medium mb-2">Quick Info</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">CNIC</span>
                  <span className="font-medium">{artisan.cnic}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Father's Name</span>
                  <span className="font-medium">{artisan.father_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Gender</span>
                  <span className="font-medium">{artisan.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Education</span>
                  <span className="font-medium">{getEducationLevel(artisan.education_level_id)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Tehsil</span>
                  <span className="font-medium">{getTehsilName(artisan.tehsil_id)}</span>
                </div>
                {artisan.ntn && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">NTN</span>
                    <span className="font-medium">{artisan.ntn}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Detailed info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Artisan Details</CardTitle>
            <CardDescription>
              Complete information about {artisan.name}'s craft and business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="craft">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="craft">Craft Details</TabsTrigger>
                <TabsTrigger value="support">Support & Training</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
              </TabsList>

              <TabsContent value="craft" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Main Product</h3>
                      <p className="text-gray-700">{artisan.major_product}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Raw Materials</h3>
                      <p className="text-gray-700">{artisan.raw_material || "Not specified"}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Experience</h3>
                      <p className="text-gray-700">{artisan.experience} years</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Business Type</h3>
                      <p className="text-gray-700">{getEmploymentType(artisan.employment_type_id)}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Equipment</h3>
                      <p className="text-gray-700">
                        {artisan.has_machinery ? "Has machinery/equipment" : "No dedicated machinery/equipment"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Skill Acquisition</h3>
                      <p className="text-gray-700">
                        {artisan.inherited_skills ? "Inherited family skills" : "Self-learned or trained"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Monthly Income</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Average Monthly Income:</span>
                      <span className="font-bold">Rs. {artisan.avg_monthly_income?.toLocaleString() || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Training & Education</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Formal Training:</span>
                        <Badge variant={artisan.has_training ? "default" : "outline"}>
                          {artisan.has_training ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Education Level:</span>
                        <span>{getEducationLevel(artisan.education_level_id)}</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Inherited Skills:</span>
                        <Badge variant={artisan.inherited_skills ? "default" : "outline"}>
                          {artisan.inherited_skills ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Financial Support</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Loan Status:</span>
                        <Badge variant={artisan.loan_status ? "warning" : "outline"}>
                          {artisan.loan_status ? "Active Loan" : "No Active Loan"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Financial Assistance:</span>
                        <Badge variant={artisan.financial_assistance ? "default" : "outline"}>
                          {artisan.financial_assistance ? "Receiving" : "None"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>Technical Assistance:</span>
                        <Badge variant={artisan.technical_assistance ? "default" : "outline"}>
                          {artisan.technical_assistance ? "Receiving" : "None"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="additional">
                <div className="space-y-6">
                  {artisan.comments && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Comments</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{artisan.comments}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">Location</h3>
                    {artisan.latitude && artisan.longitude ? (
                      <div className="border rounded-lg overflow-hidden h-48 flex items-center justify-center bg-gray-100">
                        <div className="flex flex-col items-center text-gray-500">
                          <MapIcon className="h-10 w-10 mb-2" />
                          <p>Map Placeholder: {artisan.latitude.toFixed(4)}, {artisan.longitude.toFixed(4)}</p>
                          <p className="text-sm">Tehsil: {getTehsilName(artisan.tehsil_id)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No location data available</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Registration Info</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span>{formatDate(artisan.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Updated:</span>
                          <span>{formatDate(artisan.updated_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">User ID:</span>
                          <span>{artisan.user_Id}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Details</h3>
                      <div className="space-y-2">
                        {artisan.ntn && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">NTN Number:</span>
                            <span>{artisan.ntn}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dependents:</span>
                          <span>{artisan.dependents_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => navigate("/artisans")}>
              Back to List
            </Button>
            <Button onClick={() => navigate(`/artisans/edit/${id}`)}>
              <PencilIcon className="mr-2 h-4 w-4" /> Edit Artisan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ArtisanDetail;