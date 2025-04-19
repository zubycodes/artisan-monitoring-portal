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
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreHorizontal,
  Filter,
  Download,
  PrinterIcon,
  Edit,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ArtisanDetail from "./ArtisanDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const API_BASE_URL = "https://artisan-psic.com";

const ArtisansList = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    gender: false,
    skill_name: true,
    contact_no: false,
    avg_monthly_income: false,
    experience: true,
    has_training: true,
    loan_status: true,
    financial_assistance: true,
    technical_assistance: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artisanId, setArtisanId] = useState(0);

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
    const results = artisans.filter(
      (artisan) =>
        artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.contact_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (artisan.email &&
          artisan.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArtisans(results);
    setCurrentPage(1);
  }, [searchTerm, artisans]);

  // Get current artisans for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtisans = filteredArtisans.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
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
      [column]: !visibleColumns[column],
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = Object.keys(artisans[0]).filter(
      (key) => visibleColumns[key] || !visibleColumns.hasOwnProperty(key)
    );
    const csvContent = [
      headers.join(","),
      ...filteredArtisans.map((artisan) =>
        headers
          .map((header) =>
            typeof artisan[header] === "boolean"
              ? artisan[header]
                ? "Yes"
                : "No"
              : artisan[header] === null
              ? ""
              : artisan[header]
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "artisans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get readable skill name (in a real app, this would be a lookup)
  const getSkillName = (skillId) => {
    const skillMap = {
      1: "Woodworking",
      2: "Pottery",
      3: "Weaving",
      4: "Metalwork",
      5: "Embroidery",
      6: "Jewelry Making",
      7: "Leatherwork",
      8: "Glass Blowing",
    };
    return skillMap[skillId] || `Skill ${skillId}`;
  };

  const handleDelete = async () => {
    if (confirm("Confirm delete artisan?")) {
      // Basic validation
      try {
        const response = await fetch(`${API_BASE_URL}/artisans/${artisanId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setArtisanId(0);
        } else {
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
      }
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Artisans Directory</CardTitle>
              <CardDescription>View all artisans</CardDescription>
            </div>
            <div className="flex gap-2">
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
                    {Object.keys(visibleColumns).map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`column-${column}`}
                          checked={visibleColumns[column]}
                          onChange={() => toggleColumn(column)}
                        />
                        <label htmlFor={`column-${column}`}>
                          {column.charAt(0).toUpperCase() +
                            column.slice(1).replace("_", " ")}
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
            <div className="flex justify-center py-10">
              Loading artisans data...
            </div>
          ) : (
            <>
              <div className="rounded-md border mb-4 overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SR.</TableHead>
                      {visibleColumns.name && <TableHead>Name</TableHead>}
                      {visibleColumns.gender && <TableHead>Gender</TableHead>}
                      {visibleColumns.skill_name && (
                        <TableHead>Skill</TableHead>
                      )}
                      {visibleColumns.contact_no && (
                        <TableHead>Contact</TableHead>
                      )}
                      {visibleColumns.avg_monthly_income && (
                        <TableHead>Monthly Income</TableHead>
                      )}
                      {visibleColumns.experience && (
                        <TableHead>Experience (Years)</TableHead>
                      )}
                      {visibleColumns.has_training && (
                        <TableHead>Training</TableHead>
                      )}
                      {visibleColumns.loan_status && (
                        <TableHead>Loan Status</TableHead>
                      )}
                      {visibleColumns.financial_assistance && (
                        <TableHead> Financial Assistance Required</TableHead>
                      )}
                      {visibleColumns.technical_assistance && (
                        <TableHead> Technical Assistance Required</TableHead>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentArtisans.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={
                            Object.values(visibleColumns).filter(Boolean)
                              .length + 1
                          }
                          className="text-center"
                        >
                          No artisans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentArtisans.map((artisan, index) => (
                        <TableRow key={artisan.id} className=" cursor-pointer">
                          <TableCell className="text-center">
                            {index + 1}.
                          </TableCell>
                          {visibleColumns.name && (
                            <TableCell className="font-medium">
                              {artisan.name} {artisan.father_name}
                            </TableCell>
                          )}
                          {visibleColumns.gender && (
                            <TableCell>{artisan.gender}</TableCell>
                          )}
                          {visibleColumns.skill_name && (
                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.skill_color,
                                  color: "black",
                                }}
                              >
                                {artisan.skill_name}
                              </Badge>
                            </TableCell>
                          )}
                          {visibleColumns.contact_no && (
                            <TableCell>{artisan.contact_no}</TableCell>
                          )}
                          {visibleColumns.avg_monthly_income && (
                            <TableCell>
                              Rs. {artisan.avg_monthly_income.toLocaleString()}
                            </TableCell>
                          )}
                          {visibleColumns.experience && (
                            <TableCell>{artisan.experience}</TableCell>
                          )}
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
                              {artisan.loan_status === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.financial_assistance && (
                            <TableCell>
                              {artisan.financial_assistance === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.technical_assistance && (
                            <TableCell>
                              {artisan.technical_assistance === "Yes" ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            {/* TooltipProvider is needed once around the area using tooltips */}
                            {/* You might have it higher up in your component tree already */}
                            <TooltipProvider delayDuration={200}>
                              {/* Wrapper div for consistent spacing */}
                              <div className="flex items-center justify-end gap-x-1">
                                {" "}
                                {/* Use gap for spacing */}
                                {/* --- Print Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Keep outline for print as it's less common? Or use ghost.
                                      size="sm" // Consistent size
                                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-100 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-700" // Neutral subtle styling
                                      onClick={() => {
                                        window.open(
                                          `/artisans-directory/${artisan.id}/p`,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <PrinterIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        Print Artisan Details
                                      </span>{" "}
                                      {/* Screen reader text */}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Print</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- View Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Ghost is common for subtle icon actions
                                      size="sm" // Consistent size
                                      className="text-white-600 hover:text-white-800 dark:text-white-400 dark:hover:text-white-300 hover:bg-white-100 dark:hover:bg-white-900/30" // white tint for 'view'
                                      onClick={() => {
                                        setArtisanId(artisan.id);
                                        setIsDialogOpen(true); // Open the dialog
                                      }}
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        View Artisan Details
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Details</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- Edit Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Consistent ghost variant
                                      size="sm" // Consistent size
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30" // Blue/Amber tint for 'edit'
                                      onClick={() => {
                                        // Consider using react-router navigation instead of window.open for SPA consistency
                                        window.open(
                                          `/artisans-directory/${artisan.id}/edit`,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">
                                        Edit Artisan
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                                {/* --- Delete Button --- */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" // Keep destructive for delete
                                      size="sm" // Consistent size
                                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30" // Destructive colors (often handled by variant, but explicit hover helps)
                                      onClick={() => {
                                        setArtisanId(artisan.id); // Set ID for context
                                        handleDelete(); // Call the delete handler
                                      }}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete Artisan
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-destructive text-destructive-foreground">
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TooltipProvider>

                            {/* --- Dialog for View --- */}
                            {/* The Dialog component itself remains unchanged logically */}
                            <Dialog
                              open={artisanId === artisan.id && isDialogOpen} // Only open if this row's ID matches and dialog is toggled
                              onOpenChange={(open) => {
                                setIsDialogOpen(open); // Allow closing via overlay click etc.
                                if (!open) {
                                  // Optional: Reset artisanId when dialog closes
                                  // setArtisanId(null);
                                }
                              }}
                            >
                              <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] sm:max-h-[90vh] flex flex-col">
                                <DialogHeader>
                                  <DialogTitle>
                                    Artisan Details: {artisan.name}{" "}
                                    {artisan.father_name}
                                  </DialogTitle>
                                </DialogHeader>
                                {/* Ensure the content area scrolls if needed */}
                                <div className="flex-grow overflow-y-auto pr-2">
                                  {" "}
                                  {/* Add padding-right if scrollbar overlaps */}
                                  {/* Conditionally render Detail only when ID matches to potentially refetch data */}
                                  {artisanId === artisan.id && (
                                    <ArtisanDetail artisan_id={artisanId} />
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
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
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredArtisans.length)} of{" "}
                  {filteredArtisans.length} artisans
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={
                          currentPage === 1
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        currentPage > 3
                          ? totalPages - currentPage > 1
                            ? i + currentPage - 2 <= totalPages
                              ? i + currentPage - 2
                              : totalPages - 4 + i
                            : totalPages - 4 + i
                          : i + 1;
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
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        className={
                          currentPage === totalPages || totalPages === 0
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ArtisansList;
