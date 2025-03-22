import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon, PencilIcon, TrashIcon, MoreHorizontal, Filter, Download } from "lucide-react";
const API_BASE_URL = 'http://13.239.184.38:6500';

const ArtisansList = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    gender: true,
    skill_id: true,
    contact_no: true,
    avg_monthly_income: true,
    experience: true,
    has_training: true,
    loan_status: true,
    isActive: true,
  });

  const navigate = useNavigate();

  // Fetch artisans data
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        // In a real app, replace with your actual API call
        const response = await fetch(`${API_BASE_URL}/artisans`);
        const data = await response.json();
        setArtisans(data);
        setFilteredArtisans(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artisans:", error);
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  // Filter artisans based on search term
  useEffect(() => {
    const results = artisans.filter((artisan) =>
      artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.contact_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artisan.email && artisan.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArtisans(results);
    setCurrentPage(1);
  }, [searchTerm, artisans]);

  // Get current artisans for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtisans = filteredArtisans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view artisan details
  const handleViewArtisan = (id) => {
    navigate(`/artisans/${id}`);
  };

  // Handle edit artisan
  const handleEditArtisan = (id) => {
    navigate(`/artisans/edit/${id}`);
  };

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column]
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = Object.keys(artisans[0]).filter(key => visibleColumns[key] || !visibleColumns.hasOwnProperty(key));
    const csvContent = [
      headers.join(','),
      ...filteredArtisans.map(artisan =>
        headers.map(header =>
          typeof artisan[header] === 'boolean' ?
            (artisan[header] ? 'Yes' : 'No') :
            (artisan[header] === null ? '' : artisan[header])
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'artisans.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get readable skill name (in a real app, this would be a lookup)
  const getSkillName = (skillId) => {
    const skillMap = {
      1: 'Woodworking',
      2: 'Pottery',
      3: 'Weaving',
      4: 'Metalwork',
      5: 'Embroidery',
      6: 'Jewelry Making',
      7: 'Leatherwork',
      8: 'Glass Blowing'
    };
    return skillMap[skillId] || `Skill ${skillId}`;
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Artisans Directory</CardTitle>
              <CardDescription>
                Manage and view all registered artisans
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/artisans/new')}>
                Add New Artisan
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Columns</DialogTitle>
                    <DialogDescription>
                      Select which columns to display in the table
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(visibleColumns).map(column => (
                      <div key={column} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`column-${column}`}
                          checked={visibleColumns[column]}
                          onChange={() => toggleColumn(column)}
                        />
                        <label htmlFor={`column-${column}`}>
                          {column.charAt(0).toUpperCase() + column.slice(1).replace('_', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search by name, CNIC, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">Loading artisans data...</div>
          ) : (
            <>
              <div className="rounded-md border mb-4 overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.id && <TableHead>ID</TableHead>}
                      {visibleColumns.name && <TableHead>Name</TableHead>}
                      {visibleColumns.gender && <TableHead>Gender</TableHead>}
                      {visibleColumns.skill_id && <TableHead>Skill</TableHead>}
                      {visibleColumns.contact_no && <TableHead>Contact</TableHead>}
                      {visibleColumns.avg_monthly_income && <TableHead>Monthly Income</TableHead>}
                      {visibleColumns.experience && <TableHead>Experience (Years)</TableHead>}
                      {visibleColumns.has_training && <TableHead>Training</TableHead>}
                      {visibleColumns.loan_status && <TableHead>Loan Status</TableHead>}
                      {visibleColumns.isActive && <TableHead>Status</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentArtisans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center">
                          No artisans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentArtisans.map((artisan) => (
                        <TableRow key={artisan.id} className="hover:bg-gray-50 cursor-pointer">
                          {visibleColumns.id && <TableCell>{artisan.id}</TableCell>}
                          {visibleColumns.name && <TableCell className="font-medium">{artisan.name}</TableCell>}
                          {visibleColumns.gender && <TableCell>{artisan.gender}</TableCell>}
                          {visibleColumns.skill_id && (
                            <TableCell>{getSkillName(artisan.skill_id)}</TableCell>
                          )}
                          {visibleColumns.contact_no && <TableCell>{artisan.contact_no}</TableCell>}
                          {visibleColumns.avg_monthly_income && (
                            <TableCell>Rs. {artisan.avg_monthly_income.toLocaleString()}</TableCell>
                          )}
                          {visibleColumns.experience && <TableCell>{artisan.experience}</TableCell>}
                          {visibleColumns.has_training && (
                            <TableCell>
                              {artisan.has_training ? (
                                <Badge variant="success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.loan_status && (
                            <TableCell>
                              {artisan.loan_status ? (
                                <Badge variant="warning">Active</Badge>
                              ) : (
                                <Badge variant="outline">None</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.isActive && (
                            <TableCell>
                              {artisan.isActive ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewArtisan(artisan.id)}>
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditArtisan(artisan.id)}>
                                  <PencilIcon className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredArtisans.length)} of {filteredArtisans.length} artisans
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = currentPage > 3 ?
                        (totalPages - currentPage > 1 ?
                          (i + currentPage - 2 <= totalPages ? i + currentPage - 2 : totalPages - 4 + i) :
                          totalPages - 4 + i) :
                        i + 1;
                      if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => paginate(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={currentPage === totalPages || totalPages === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtisansList;