import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// PNG icons for Stat Cards
import IC1 from "../assets/compilance_icon1.png";
import IC2 from "../assets/compilance_icon2.png";
import IC3 from "../assets/compilance_icon3.png";
import IC4 from "../assets/compilance_icon4.png";

// Local images (fallbacks, not used in stat cards)
import Paper from "../assets/paper.png";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs sm:text-sm text-slate-500 truncate">{label}</div>
          <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="ml-2 flex-shrink-0 p-2">
          <img src={icon} alt={label} className="w-6 h-6 sm:w-12 sm:h-12" />
        </div>
      </div>
    </div>
  );
}

export default function Compliance() {
  const [docRows, setDocRows] = useState([]);
  const [kycRows, setKycRows] = useState([]);

  // 🔹 Fetch Firestore Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vendor_registrations"));
        const docs = [];
        const kycs = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const vendorName = data.personalDetails?.name || "Unknown Vendor";

          // Example document row
          const docRow = {
            DOCUMENTID: docSnap.id.substring(0, 8),
            VENDOR: vendorName,
            CITY: data.personalDetails?.city || "Unknown",
            EXPDATE: "2025-12-31",
            REVIEWEDBY: "admin",
            status: "Active",
            documentUrl: data.documentUrl || Paper,
          };
          docs.push(docRow);

          // Example KYC row
          const kycRow = {
            KYCID: docSnap.id.substring(0, 8),
            VENDOR: vendorName,
            TYPE: data.kycType || "Aadhar",
            EXPDATE: "2025-12-31",
            REVIEWEDBY: "admin",
            status: "Pending Review",
            kycUrl: data.kycDocUrl || Paper,
          };
          kycs.push(kycRow);
        });

        setDocRows(docs);
        setKycRows(kycs);
      } catch (error) {
        console.error("Error fetching vendor registrations:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 Stats Cards (now dynamic with different icons)
  const statCards = useMemo(() => {
    const totalDocs = docRows.length + kycRows.length;
    const expiringSoon = docRows.filter((r) => r.status === "Pending").length;
    const complianceRate =
      totalDocs > 0
        ? (
            ((docRows.filter((r) => r.status === "Active").length +
              kycRows.filter((r) => r.status === "Active").length) /
              totalDocs) *
            100
          ).toFixed(1)
        : 0;
    const pendingReviews = kycRows.filter((r) => r.status === "Pending Review").length;

    return [
      { icon: IC1, label: "Total Documents", value: totalDocs.toLocaleString() },
      { icon: IC2, label: "Expiring Soon", value: expiringSoon.toLocaleString() },
      { icon: IC3, label: "Compliance Rate", value: `${complianceRate}%` },
      { icon: IC4, label: "Pending Reviews", value: pendingReviews.toLocaleString() },
    ];
  }, [docRows, kycRows]);

  return (
    <div className="p-4 sm:p-6">
      {/* 🔹 Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 🔹 Example table rendering */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Documents Table</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {docRows.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border">{row.DOCUMENTID}</td>
                <td className="p-2 border">{row.VENDOR}</td>
                <td className="p-2 border">{row.CITY}</td>
                <td className="p-2 border">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
