import React, { useMemo, useState } from "react";
import Paper from "../assets/paper.png"
import IC1 from "../assets/ic_customer1.png";
import kyc1 from "../assets/kyc1.png";
import kyc2 from "../assets/kyc2.png";
import kyc3 from "../assets/kyc3.png";
import kyc4 from "../assets/kyc4.png";
import kyc5 from "../assets/kyc5.png";

import {
  FileText,
  Clock,
  Percent,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Building2,
  ShieldCheck,
  UserCheck,
  ChevronDown,
} from "lucide-react";

/**
 * Single-file React + Tailwind implementation
 * - Main dashboard (Compliance Management)
 * - Document Review modal ("View" -> Approve/Reject)
 * - KYC Review modal ("Review" -> Approve KYC/Reject KYC)
 * - Status result modal (Approved/Rejected)
 *
 * Updated with subtle blue background, removed borders, smaller fonts, better spacing
 * Added filter functionality to both tables (filter by status)
 * Standardized button colors in modals: Approve (green), Reject (red), with proper BG and text colors
 */

// Small badge/pill
function Badge({ tone = "default", children }) {
  const map = {
    default: "bg-slate-100 text-slate-600",
    success: `bg-green-50 text-green-700`,
    warning: `bg-yellow-50 text-yellow-700`,
    danger: `bg-red-50 text-red-700`,
    info: `bg-blue-50 text-blue-700`,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-4 sm:p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="p-2">
          {/* <Icon className="h-6 w-6 text-slate-400" /> */}
          <img src={IC1} alt="" />
        </div>
      </div>
    </div>
  );
}

function Table({ columns, rows, renderActions }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="grid gap-1">
          {/* Header */}
          <div className="grid gap-4 px-4 py-3 bg-slate-50" style={{gridTemplateColumns: `repeat(${columns.length + (renderActions ? 1 : 0)}, minmax(0, 1fr))`}}>
            {columns.map((c) => (
              <div
                key={c}
                className="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {c}
              </div>
            ))}
            {renderActions && <div />}
          </div>
          
          {/* Rows */}
          {rows.map((row, idx) => (
            <div 
              key={idx} 
              className="grid gap-4 px-4 py-4  hover:bg-slate-50 transition-colors"
              style={{gridTemplateColumns: `repeat(${columns.length + (renderActions ? 1 : 0)}, minmax(0, 1fr))`}}
            >
              {columns.map((c) => (
                <div
                  key={c}
                  className="text-sm text-slate-700 flex items-center"
                >
                  {row[c]}
                </div>
              ))}
              {renderActions && (
                <div className="flex items-center justify-end">
                  {renderActions(row)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModalShell({ open, onClose, title, children, maxWidth = "max-w-4xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
  className={`absolute inset-x-4 top-4 mx-auto ${maxWidth} p-6 shadow-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl`}
>

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center bg-slate-100 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-700" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function DocumentModal({ open, onClose, onDecision }) {
  return (
    <ModalShell open={open} onClose={onClose} title="Business Registration Certificate" maxWidth="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7">
          <div className="text-sm text-slate-600">File Preview</div>
          <button className="mt-2 inline-flex items-center gap-2 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
            <Download className="h-4 w-4" /> Download Full Document
          </button>
          <div className="mt-4 aspect-video w-full  flex items-center justify-center text-slate-400 text-sm">
            <img src={Paper} alt="" />
          </div>
        </div>
        {/* Right */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500 text-xs">Vendor Name</div>
              <div className="font-medium text-slate-800">Tech Solutions Inc.</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Document Type</div>
              <div className="font-medium text-slate-800">Business Registration</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">File Size</div>
              <div className="font-medium text-slate-800">2.5 MB</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Upload Date</div>
              <div className="font-medium text-slate-800">2025-08-15</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Expiry Date</div>
              <div className="font-medium text-slate-800">2026-08-15</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Status</div>
              <div className="font-medium text-slate-800">Active</div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onDecision("rejected")}
              className="inline-flex items-center justify-center bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Reject
            </button>
            <button
              onClick={() => onDecision("approved")}
              className="inline-flex items-center justify-center bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}


const   photos = [
  {
    src: kyc1,
    alt: "KYC Document 1"
  },
  {
    src: kyc2,
    alt: "KYC Document 2"
  },
  {
    
    alt: "KYC Document 3"
  },
  {
    src: kyc4,
    alt: "KYC Document 4"
  },
  
]


// import React from "react";

 function KYCReviewModal({ open, onClose, onDecision }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Title + Vendor */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">KYC Review</h1>
          <p className="text-gray-500">Vendor: Tech Solutions Inc.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-gray-900">80%</p>
            <p className="text-sm text-gray-500">Completion</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-gray-900">5/6</p>
            <p className="text-sm text-gray-500">Documents</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-gray-900">Low</p>
            <p className="text-sm text-gray-500">Risk Level</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-gray-900">14</p>
            <p className="text-sm text-gray-500">Days Since Submission</p>
          </div>
        </div>

        {/* Document Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Document Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { name: "Business License", status: "Submitted",src: kyc1, },
              { name: "Tax ID", status: "Submitted",src: kyc2, },
              { name: "Financial Statements", status: "Submitted",src: kyc3, },
              { name: "Insurance Certificate", status: "Submitted",src: kyc4, },
              { name: "Compliance Report", status: "Submitted",src: kyc5 },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="bg-white  shadow-sm p-3 text-center"
              >
                
                {/* <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400 text-sm">
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.src}
                      alt={photo.alt}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                </div> */}
                <img src={doc.src} alt="" />
                <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-green-600">{doc.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-medium">KYC Progress:</span> Submitted:
            07/15/2024 | Expected: 07/22/2024
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Assigned Reviewer:</span> Emily Carter
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => onDecision("rejected")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reject KYC
          </button>
          <button
            onClick={() => onDecision("approved")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Approve KYC
          </button>
        </div>
      </div>
    </div>
  );
}


/* 🔹 Reusable InfoCard */
const InfoCard = ({ label, value }) => (
  <div className="p-3 bg-gray-50">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

// export default KYCReviewModal;


function StatusModal({ open, onClose, status = "approved" }) {
  const isApproved = status === "approved";
  return (
    <ModalShell open={open} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center py-4">
        <div
          className={`mb-4 inline-flex h-16 w-16 items-center justify-center ${
            isApproved ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {isApproved ? (
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-600" />
          )}
        </div>
        <div className={`text-xl font-semibold ${isApproved ? "text-green-600" : "text-red-600"}`}>
          {isApproved ? "Approved" : "Rejected"}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Your request has been {isApproved ? "approved" : "rejected"}
        </div>
        <div className="text-xs text-slate-400">Shortly you will find a confirmation in your email.</div>
        <button
          onClick={onClose}
          className="mt-4 inline-flex items-center justify-center bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </ModalShell>
  );
}

// Mock data for the two tables
const docRows = [
  {
    DOCUMENTID: <span className="font-medium">DOC-001</span>,
    VENDOR: "Fashion Forward Ltd",
    CITY: "Hyderabad",
    EXPDATE: "12/09/2025",
    REVIEWEDBY: "king",
    status: "Active",   // ✅ raw status
    STATUS: (           // ✅ display JSX
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500" /> Active
      </span>
    ),
  },
  {
    DOCUMENTID: <span className="font-medium">DOC-002</span>,
    VENDOR: "Tech Solutions Inc",
    CITY: "Chennai",
    EXPDATE: "08/05/2025",
    REVIEWEDBY: "jacob",
    status: "Pending",  // ✅
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-yellow-500" /> Pending
      </span>
    ),
  },
  {
    DOCUMENTID: <span className="font-medium">DOC-003</span>,
    VENDOR: "Glenmar Co",
    CITY: "Visakhapatnam",
    EXPDATE: "11/22/2025",
    REVIEWEDBY: "isaiah",
    status: "Declined", // ✅
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-red-500" /> Declined
      </span>
    ),
  },
];


const kycRows = [
  {
    KYCID: <span className="font-medium">KYC-001</span>,
    VENDOR: "Avantika House",
    DOCUMENTTYPE: "Bank Address Proof, Business License",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "king",
    status: "Pending Review", // ✅ raw status
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-yellow-500" /> Pending Review
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-002</span>,
    VENDOR: "Tech Solutions Inc",
    DOCUMENTTYPE: "Tax ID, Business License",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "jacob",
    status: "Declined", // ✅
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-red-500" /> Declined
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-003</span>,
    VENDOR: "Premium Style Ltd",
    DOCUMENTTYPE: "Registration, Insurance",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "ace",
    status: "Active", // ✅
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500" /> Active
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-004</span>,
    VENDOR: "Premium Style Ltd",
    DOCUMENTTYPE: "Compliance, Due Diligence",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "judge",
    status: "Active", // ✅
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500" /> Active
      </span>
    ),
  },
];


export default function Compliance() {
  const [documentOpen, setDocumentOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [status, setStatus] = useState(null); // "approved" | "rejected" | null

  const [docFilter, setDocFilter] = useState('All');
  const [docFilterOpen, setDocFilterOpen] = useState(false);
  const [kycFilter, setKycFilter] = useState('All');
  const [kycFilterOpen, setKycFilterOpen] = useState(false);

  const closeStatus = () => setStatus(null);

  const statCards = useMemo(
    () => [
      { icon: FileText, label: "Total Documents", value: "40,689" },
      { icon: Clock, label: "Expiring Soon", value: "689" },
      { icon: Percent, label: "Compliance Rate", value: "92.8%" },
      { icon: Eye, label: "Pending Reviews", value: "102" },
    ],
    []
  );

const filteredDocRows = docRows.filter(
  row => docFilter === "All" || row.status === docFilter
);


const filteredKycRows = kycRows.filter(
  row => kycFilter === "All" || row.status === kycFilter
);

  const docFilterOptions = ['All', 'Active', 'Pending', 'Declined'];
const kycFilterOptions = ['All', 'Active', 'Pending Review', 'Declined'];

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <h2 className="text-2xl font-semibold text-slate-900">Compliance Management</h2>
        <p className="mt-1 text-sm text-slate-600">
          Monitor vendor documentation and KYC processes
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Top stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s, i) => (
            <StatCard key={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Document Review */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-base font-semibold text-slate-800">Document Review</div>
              <div className="text-xs text-slate-500">Vendor compliance documents requiring attention</div>
            </div>
            <div className="relative self-start">
              <button 
                onClick={() => setDocFilterOpen(!docFilterOpen)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Filter by <ChevronDown className="h-3 w-3" />
              </button>
              {docFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                  <ul className="py-1">
                    {docFilterOptions.map(option => (
                      <li 
                        key={option}
                        onClick={() => { setDocFilter(option); setDocFilterOpen(false); }}
                        className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className=" overflow-hidden">
            <Table
              columns={["DOCUMENTID", "VENDOR", "CITY", "EXPDATE", "REVIEWEDBY", "STATUS"]}
              rows={filteredDocRows}
              renderActions={() => (
                <button
                  onClick={() => setDocumentOpen(true)}
                  className="inline-flex items-center gap-1 text-gray-600 px-3 py-1.5 text-xs font-medium  transition"
                >
                  View
                </button>
              )}
            />
          </div>
        </section>

        {/* KYC Verification Requests */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-base font-semibold text-slate-800">KYC Verification Requests</div>
              <div className="text-xs text-slate-500">New vendor onboarding and verification</div>
            </div>
            <div className="relative self-start">
              <button 
                onClick={() => setKycFilterOpen(!kycFilterOpen)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Filter by <ChevronDown className="h-3 w-3" />
              </button>
              {kycFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                  <ul className="py-1">
                    {kycFilterOptions.map(option => (
                      <li 
                        key={option}
                        onClick={() => { setKycFilter(option); setKycFilterOpen(false); }}
                        className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className=" overflow-hidden">
            <Table
              columns={["KYCID", "VENDOR", "DOCUMENTTYPE", "REQUESTDATE", "ASSIGNEDTO", "STATUS"]}
              rows={filteredKycRows}
              renderActions={() => (
                <button
                  onClick={() => setKycOpen(true)}
                  className="inline-flex items-center gap-1  px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                >
                  Review
                </button>
              )}
            />
          </div>
        </section>

        {/* Compliance Alerts */}
        <section>
          <div className="text-base font-semibold text-slate-800">Compliance Alerts</div>
          <div className="text-xs text-slate-500 mb-4">Important notifications requiring immediate attention</div>

          <div className="space-y-2">
            <div className="bg-yellow-50 px-4 py-3 w-full text-sm text-yellow-800">
              3 vendor licenses expiring this month
            </div>
            <div className="bg-blue-50 px-4 py-3 w-full text-sm text-blue-800">
              10 documents pending review
            </div>
            <div className="bg-red-50 px-4 py-3 w-full text-sm text-red-800">
              5 new KYC applications submitted
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <DocumentModal
        open={documentOpen}
        onClose={() => setDocumentOpen(false)}
        onDecision={(d) => {
          setDocumentOpen(false);
          setStatus(d);
        }}
      />

      <KYCReviewModal
        open={kycOpen}
        onClose={() => setKycOpen(false)}
        onDecision={(d) => {
          setKycOpen(false);
          setStatus(d);
        }}
      />

      <StatusModal open={!!status} status={status || "approved"} onClose={closeStatus} />
    </div>
  );
}