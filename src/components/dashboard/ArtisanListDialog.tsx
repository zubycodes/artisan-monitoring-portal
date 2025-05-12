// FiltersAll.tsx
import React, { useState, useEffect } from "react";
import { CardContent } from "../ui/card";
import Loader from "../layout/Loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Edit, EyeIcon, PrinterIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export interface ArtisanListProps {
  query: any;
  isDialogOpen: boolean;
  artisans: any[];
  onChange?: (open: boolean) => void; // Callback to emit selected object
}

const ArtisanListDialog: React.FC<ArtisanListProps> = ({ query, isDialogOpen, artisans, onChange }) => {

  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const properCase = (text: string): string => {
    return text.split(' ').map(word =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
    ).join(' ');
  };
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

  const filterArtisansByAgeBracket = (artisansArray, ageBracket) => {
    if (!Array.isArray(artisansArray)) {
      console.error("Input artisansArray must be an array.");
      return [];
    }

    if (typeof ageBracket !== 'string' || ageBracket.length === 0) {
      console.error("Input ageBracket must be a non-empty string.");
      return artisansArray; // Return original array or empty array depending on desired behavior for invalid input
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    // Determine the age range based on the bracket string
    let minAge = -1; // Use -1 to indicate no lower bound (for '0-12')
    let maxAge = Infinity; // Use Infinity to indicate no upper bound (for '60+')

    if (ageBracket === '60+') {
      minAge = 60;
      maxAge = Infinity; // Artisans 60 or older
    } else {
      const parts = ageBracket.split('-');
      if (parts.length === 2) {
        minAge = parseInt(parts[0], 10);
        maxAge = parseInt(parts[1], 10); // This will be the upper bound *exclusive* based on your SQL logic
        // Adjust maxAge to be exclusive as per your SQL logic (e.g., 13-18 means age >= 13 and age < 19)
        maxAge = maxAge + 1;
      } else if (ageBracket === '0-12') {
        minAge = 0;
        maxAge = 13; // age < 13
      } else {
        console.warn(`Unknown age bracket format: ${ageBracket}. Returning empty array.`);
        return []; // Handle unexpected formats
      }
    }

    // Filter the array
    const filteredArtisans = artisansArray.filter(artisan => {
      if (!artisan || !artisan.date_of_birth) {
        // Skip artisans with missing or invalid date_of_birth
        return false;
      }

      try {
        const birthDate = new Date(artisan.date_of_birth);
        // Check if the date is valid
        if (isNaN(birthDate.getTime())) {
          console.warn(`Invalid date_of_birth for artisan ID ${artisan.id || 'unknown'}: ${artisan.date_of_birth}`);
          return false;
        }

        // Calculate age based on year difference (matching your SQL logic)
        const age = currentYear - birthDate.getFullYear();

        // Check if the age falls within the calculated range
        // For '60+', check if age is >= 60
        if (ageBracket === '60+') {
          return age >= minAge;
        } else {
          // For other ranges, check if age is >= min and < max
          return age >= minAge && age < maxAge;
        }

      } catch (e) {
        console.error(`Error processing date_of_birth for artisan ID ${artisan.id || 'unknown'}:`, e);
        return false; // Exclude artisans with processing errors
      }
    });

    return filteredArtisans;
  }

  useEffect(() => {
    console.log(query);

    if (query.type == 'gender') {
      setFilteredArtisans(artisans.filter(x => x.gender == query.name));
    }

    if (query.type == 'division') {
      setFilteredArtisans(artisans.filter(x => x.division_name == query.name));
    }

    if (query.type == 'skill') {
      setFilteredArtisans(artisans.filter(x => x.skill_name?.toLowerCase() == query.name?.toLowerCase()));
    }

    if (query.type == 'age') {
      setFilteredArtisans(filterArtisansByAgeBracket(artisans, query.name));
    }
  }, [query]);

  return (
    <div>
      <Dialog
        open={isDialogOpen} // Only open if this row's ID matches and dialog is toggled
        onOpenChange={onChange}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw] xl:max-w-[90vw] sm:max-h-[90vh] flex flex-col">

          <div>
            {loading ? (
              <Loader />
            ) : (
              <>
                {/* Pagination */}
                <div className="text-sm mb-2 text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredArtisans.length)} of{" "}
                  {filteredArtisans.length} artisans
                </div>
                <div className="rounded-md border mb-4 overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SR.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Craft</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Avg. Monthly Income</TableHead>
                        <TableHead>Inherited Skill</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentArtisans.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center"
                          >
                            No artisans found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentArtisans.map((artisan, index) => (
                          <TableRow key={artisan.id} className="cursor-pointer" onClick={(e) => {
                            window.open(
                              `/artisans-directory/${artisan.id}/p`,
                              "_blank"
                            );
                            e.stopPropagation();
                          }}>
                            <TableCell className="text-center">
                              {(indexOfFirstItem + index + 1)}.
                            </TableCell>

                            <TableCell className="font-medium">
                              {properCase(artisan.name)} {properCase(artisan.father_name)}
                            </TableCell>





                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.craft_color,
                                  color: "black",
                                }}
                              >
                                {artisan.craft_name}
                              </Badge>
                            </TableCell>



                            <TableCell>
                              <Badge
                                className="py-1 px-4"
                                style={{
                                  backgroundColor: artisan.category_color,
                                  color: "black",
                                }}
                              >
                                {artisan.category_name}
                              </Badge>
                            </TableCell>


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


                            <TableCell>{artisan.contact_no}</TableCell>


                            <TableCell>
                              Rs. {artisan.avg_monthly_income.toLocaleString()}
                            </TableCell>





                            <TableCell>
                              {artisan.inherited_skills === "Yes" ? (
                                <Badge variant="success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>

                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 w-full">
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
                      {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
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
          </div>
        </DialogContent>
      </Dialog>


    </div >



  );
};

export default ArtisanListDialog;