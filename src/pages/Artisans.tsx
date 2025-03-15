
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, MoreHorizontal, Search } from 'lucide-react';

const Artisans = () => {
  // Mock data for artisans
  const artisans = [
    { 
      id: '1', 
      name: 'Amrit Singh', 
      gender: 'Male',
      location: 'Amritsar', 
      skills: ['Pottery', 'Sculpture'], 
      registeredDate: '12 Jan 2023',
      status: 'Active'
    },
    { 
      id: '2', 
      name: 'Gurpreet Kaur', 
      gender: 'Female',
      location: 'Ludhiana', 
      skills: ['Phulkari Embroidery'], 
      registeredDate: '03 Mar 2023',
      status: 'Active'
    },
    { 
      id: '3', 
      name: 'Rajinder Kumar', 
      gender: 'Male',
      location: 'Jalandhar', 
      skills: ['Woodwork', 'Carpentry'], 
      registeredDate: '17 Apr 2023',
      status: 'Inactive'
    },
    { 
      id: '4', 
      name: 'Simran Kaur', 
      gender: 'Female',
      location: 'Patiala', 
      skills: ['Weaving', 'Textile Arts'], 
      registeredDate: '29 May 2023',
      status: 'Active'
    },
    { 
      id: '5', 
      name: 'Harjeet Singh', 
      gender: 'Male',
      location: 'Bathinda', 
      skills: ['Metalwork', 'Jewelry Making'], 
      registeredDate: '14 Jun 2023',
      status: 'Active'
    },
    { 
      id: '6', 
      name: 'Manpreet Kaur', 
      gender: 'Female',
      location: 'Hoshiarpur', 
      skills: ['Pottery', 'Clay Modeling'], 
      registeredDate: '02 Jul 2023',
      status: 'Pending'
    },
  ];

  return (
    <Layout>
      <PageHeader
        title="Artisan Directory"
        description="Browse, manage, and track artisans across Punjab."
      >
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Artisan</span>
        </Button>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artisans..."
              className="pl-9 w-full md:w-80"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="gap-1.5 w-full md:w-auto">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 w-full md:w-auto">
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artisans.map((artisan) => (
                  <TableRow key={artisan.id} className="hover-lift cursor-pointer bg-card">
                    <TableCell className="font-medium">{artisan.name}</TableCell>
                    <TableCell>{artisan.gender}</TableCell>
                    <TableCell>{artisan.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artisan.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {artisan.registeredDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          artisan.status === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800'
                            : artisan.status === 'Inactive'
                            ? 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800'
                        }
                      >
                        {artisan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Artisan</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Artisans;
