import Loader from "@/components/layout/Loader";
import { PrinterIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:6500";

const ArtisanDetail = ({ artisan_id }) => {
  const { id, p } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/artisans/${artisan_id}`);
        const data = await response.json();
        setArtisan(data);
        setLoading(false);
        /* setTimeout(() => {
          if (p) {
            window.print();
          }
        }, 1500); */
      } catch (error) {
        console.error("Error fetching artisan details:", error);
        setLoading(false);
      }
    };

    fetchArtisanDetail();
  }, [id]);

  // Helper functions for formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (!artisan) {
    return <div>Artisan not found</div>;
  }

  return (
    <div className="container mx-auto pt-4 print:p-0">
      <div className="flex justify-center text-center mb-3 print:mb-4">
        <div className="text-2xl font-bold print:text-xl">
          Artisan Profile - {artisan.name} {artisan.father_name}
        </div>
        {id && (
          <button
            onClick={() => window.print()}
            className="mx-4 text-green-500 rounded print:hidden"
          >
            <PrinterIcon size="30"></PrinterIcon>
          </button>
        )}
      </div>

      {/* Existing Personal Information Section */}
      <div className="print:border-0 mb-3">
        <div className="p-2 font-bold text-lg">Personal Information</div>
        <table className="w-full text-left border-collapse print:text-sm">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold w-1/3 print:bg-transparent">
                Artisan Name
              </td>
              <td className="border border-black p-1">{artisan.name}</td>
              <td
                rowSpan={6}
                className="w-1/4 border border-black text-center border-l"
              >
                <div className="w-32 h-40 border border-black mx-auto flex items-center justify-center">
                  <img
                    src={`${API_BASE_URL}${artisan.profile_picture}`}
                    className="size-32"
                    alt=""
                  />
                </div>
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Father / Husband Name
              </td>
              <td className="border border-black p-1">{artisan.father_name}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Gender
              </td>
              <td className="border border-black p-1">{artisan.gender}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Date of Birth
              </td>
              <td className="border border-black p-1">
                {formatDate(artisan.date_of_birth)}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                CNIC
              </td>
              <td className="border border-black p-1">{artisan.cnic}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                NTN
              </td>
              <td className="border border-black p-1">{artisan.ntn}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Education
              </td>
              <td colSpan={2} className="border border-black p-1">
                {artisan.education_name}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Number of Dependents
              </td>
              <td colSpan={2} className="border border-black p-1">
                {artisan.dependents_count}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contact Information Section */}
      <div className="print:border-0 mb-3">
        <div className="p-2 font-bold text-lg">Contact Details</div>
        <table className="w-full text-left border-collapse print:text-sm">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Division
              </td>
              <td className="border border-black p-1">
                {artisan.division_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                District
              </td>
              <td className="border border-black p-1">
                {artisan.district_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Tehsil
              </td>
              <td className="border border-black p-1">
                {artisan.tehsil_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                UC
              </td>
              <td className="border border-black p-1">{artisan.uc || "N/A"}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold w-1/3 print:bg-transparent">
                Mobile Number
              </td>
              <td className="border border-black p-1">{artisan.contact_no}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Email
              </td>
              <td className="border border-black p-1">
                {artisan.email || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Address
              </td>
              <td className="border border-black p-1">{artisan.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Craft and Skill Information */}
      <div className="print:border-0 mb-3">
        <div className="p-2 font-bold text-lg">Craft and Skills</div>
        <table className="w-full text-left border-collapse print:text-sm">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold w-1/3 print:bg-transparent">
                Craft
              </td>
              <td
                className="p-1 flex items-center"
                style={{ backgroundColor: artisan.craft_color }}
              >
                {artisan.craft_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Category
              </td>
              <td
                className="p-1 flex items-center"
                style={{ backgroundColor: artisan.category_color }}
              >
                {artisan.category_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Skill
              </td>
              <td
                className="p-1 flex items-center"
                style={{ backgroundColor: artisan.skill_color }}
              >
                {artisan.skill_name || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Inherited Skills
              </td>
              <td className="border border-black p-1">
                {artisan.inherited_skills ? "Yes" : "No"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Experience
              </td>
              <td className="border border-black p-1">
                {artisan.experience || "N/A"} Year
                {artisan.experience > 1 ? "s" : ""}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Average Monthly Income
              </td>
              <td className="border border-black p-1">
                {artisan.avg_monthly_income} PKR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Product Images Section */}
      {artisan.product_images && artisan.product_images.length > 0 && (
        <div className="print:border-0 mb-3">
          <div className="p-2 font-bold text-lg">Product Images</div>
          <div className="flex flex-wrap gap-4">
            {artisan.product_images.map((imagePath, index) => (
              <img
                key={index}
                src={imagePath}
                alt={`Product ${index + 1}`}
                className="w-40 h-40 object-cover border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Business Information */}
      <div className="print:border-0 mb-3">
        <div className="p-2 font-bold text-lg">Business Information</div>
        <table className="w-full text-left border-collapse print:text-sm">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold w-1/3 print:bg-transparent">
                Employment Type
              </td>
              <td className="border border-black p-1 flex items-center">
                {artisan.employment_type_id == 1
                  ? "Self Employeed"
                  : artisan.employment_type_id == 2
                  ? "Entrepreneur"
                  : artisan.employment_type_id == 3
                  ? "Employee"
                  : "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Raw Material
              </td>
              <td className="border border-black p-1 flex items-center">
                {artisan.raw_material || "N/A"}
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Financial Assistance Needed
              </td>
              <td className="border border-black p-1">
                {artisan.financial_assistance}
              </td>
            </tr>

            <tr className="border border-black">
              <td className="border border-black p-1 font-bold print:bg-transparent">
                Technical Assistance Needed
              </td>
              <td className="border border-black p-1">
                {artisan.technical_assistance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Trainings Section */}
      {artisan.trainings && artisan.trainings.length > 0 && (
        <div className="print:border-0 mb-3">
          <div className="p-2 font-bold text-lg">Trainings</div>
          <table className="w-full text-left border-collapse print:text-sm">
            <thead>
              <tr className="border border-black">
                <th className="border border-black p-1">Title</th>
                <th className="border border-black p-1">Duration</th>
                <th className="border border-black p-1">Organization</th>
              </tr>
            </thead>
            <tbody>
              {artisan.trainings.map((training, index) => (
                <tr key={index} className="border border-black">
                  <td className="border border-black p-1">{training.title}</td>
                  <td className="border border-black p-1">
                    {training.duration}
                  </td>
                  <td className="border border-black p-1">
                    {training.organization}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loans Section */}
      {artisan.loans && artisan.loans.length > 0 && (
        <div className="print:border-0 mb-3">
          <div className="p-2 font-bold text-lg">Loans</div>
          <table className="w-full text-left border-collapse print:text-sm">
            <thead>
              <tr className="border border-black">
                <th className="border border-black p-1">Amount</th>
                <th className="border border-black p-1">Date</th>
                <th className="border border-black p-1">Loan Type</th>
                <th className="border border-black p-1">Name</th>
                <th className="border border-black p-1">Scheme</th>
              </tr>
            </thead>
            <tbody>
              {artisan.loans.map((loan, index) => (
                <tr key={index} className="border border-black">
                  <td className="border border-black p-1">{loan.amount}</td>
                  <td className="border border-black p-1">
                    {formatDate(loan.date)}
                  </td>
                  <td className="border border-black p-1">{loan.loan_type}</td>
                  <td className="border border-black p-1">{loan.subName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Machines Section */}
      {artisan.machines && artisan.machines.length > 0 && (
        <div className="print:border-0 mb-3">
          <div className="p-2 font-bold text-lg">Machines</div>
          <table className="w-full text-left border-collapse print:text-sm">
            <thead>
              <tr className="border border-black">
                <th className="border border-black p-1">Title</th>
                <th className="border border-black p-1">Size</th>
                <th className="border border-black p-1">Number of Machines</th>
              </tr>
            </thead>
            <tbody>
              {artisan.machines.map((machine, index) => (
                <tr key={index} className="border border-black">
                  <td className="border border-black p-1">{machine.title}</td>
                  <td className="border border-black p-1">{machine.size}</td>
                  <td className="border border-black p-1">
                    {machine.number_of_machines}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shop Images Section */}
      {artisan.shop_images && artisan.shop_images.length > 0 && (
        <div className="print:border-0 mb-3">
          <div className="p-2 font-bold text-lg">Shop Images</div>
          <div className="flex flex-wrap gap-4">
            {artisan.shop_images.map((imagePath, index) => (
              <img
                key={index}
                src={imagePath}
                alt={`Shop ${index + 1}`}
                className="w-40 h-40 object-cover border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:text-xl {
            font-size: 1.25rem;
          }
          .print\\:text-sm {
            font-size: 0.875rem;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          .print\\:p-0 {
            padding: 0;
          }
          .print\\:border-0 {
            border: 0;
          }
          .print\\:bg-transparent {
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtisanDetail;
