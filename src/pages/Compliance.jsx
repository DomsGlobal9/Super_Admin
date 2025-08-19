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

function Badge({ tone = "default", children }) {
  const map = {
    default: "bg-slate-100 text-slate-600",
    success: `bg-green-50 text-green-700`,
    warning: `bg-yellow-50 text-yellow-700`,
    danger: `bg-red-50 text-red-700`,
    info: `bg-blue-50 text-blue-700`,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${map[tone]}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs sm:text-sm text-slate-500 truncate">{label}</div>
          <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="ml-2 flex-shrink-0 p-2">
          <img src={IC1} alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}

function MobileTable({ columns, rows, renderActions, title }) {
  return (
    <div className="sm:hidden space-y-3">
      {rows.map((row, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border">
          {columns.map((col, colIdx) => (
            <div key={col} className={`flex justify-between items-start ${colIdx !== columns.length - 1 ? 'mb-2' : ''}`}>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-0 flex-1 mr-2">
                {col}:
              </span>
              <div className="text-sm text-slate-700 text-right flex-shrink-0">
                {row[col]}
              </div>
            </div>
          ))}
          {renderActions && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
              {renderActions(row)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DesktopTable({ columns, rows, renderActions }) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <div className="min-w-full">
        <div className="grid gap-1">
          {/* Header */}
          <div className="grid gap-2 sm:gap-4 px-3 sm:px-4 py-3 bg-slate-50 rounded-t-lg" style={{gridTemplateColumns: `repeat(${columns.length + (renderActions ? 1 : 0)}, minmax(0, 1fr))`}}>
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
              className="grid gap-2 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 bg-white hover:bg-slate-50 transition-colors"
              style={{gridTemplateColumns: `repeat(${columns.length + (renderActions ? 1 : 0)}, minmax(0, 1fr))`}}
            >
              {columns.map((c) => (
                <div
                  key={c}
                  className="text-xs sm:text-sm text-slate-700 flex items-center truncate"
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

function Table({ columns, rows, renderActions, title }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <MobileTable columns={columns} rows={rows} renderActions={renderActions} title={title} />
      <DesktopTable columns={columns} rows={rows} renderActions={renderActions} />
    </div>
  );
}

function ModalShell({ open, onClose, title, children, maxWidth = "max-w-4xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative mx-auto ${maxWidth} bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white rounded-t-xl p-4 sm:p-6 border-b">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900 pr-8">{title}</h3>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function DocumentModal({ open, onClose, onDecision }) {
  return (
    <ModalShell open={open} onClose={onClose} title="Business Registration Certificate" maxWidth="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left */}
        <div className="lg:col-span-7">
          <div className="text-sm text-slate-600 mb-2">File Preview</div>
          <button className="mb-4 inline-flex items-center gap-2 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition rounded">
            <Download className="h-4 w-4" /> Download Full Document
          </button>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
            <img src={Paper} alt="Document preview" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
        {/* Right */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 text-sm mb-6">
            <div>
              <div className="text-slate-500 text-xs mb-1">Vendor Name</div>
              <div className="font-medium text-slate-800">Tech Solutions Inc.</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Document Type</div>
              <div className="font-medium text-slate-800">Business Registration</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">File Size</div>
              <div className="font-medium text-slate-800">2.5 MB</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Upload Date</div>
              <div className="font-medium text-slate-800">2025-08-15</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Expiry Date</div>
              <div className="font-medium text-slate-800">2026-08-15</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Status</div>
              <div className="font-medium text-slate-800">Active</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <button
              onClick={() => onDecision("rejected")}
              className="flex-1 inline-flex items-center justify-center bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition rounded"
            >
              Reject
            </button>
            <button
              onClick={() => onDecision("approved")}
              className="flex-1 inline-flex items-center justify-center bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition rounded"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function KYCReviewModal({ open, onClose, onDecision }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-xl p-4 sm:p-6 border-b">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 pr-8">KYC Review</h1>
            <p className="text-gray-500 mt-1">Vendor: Tech Solutions Inc.</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">80%</p>
              <p className="text-xs sm:text-sm text-gray-500">Completion</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">5/6</p>
              <p className="text-xs sm:text-sm text-gray-500">Documents</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">Low</p>
              <p className="text-xs sm:text-sm text-gray-500">Risk Level</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">14</p>
              <p className="text-xs sm:text-sm text-gray-500">Days Since</p>
            </div>
          </div>

          {/* Document Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Document Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                { name: "Business License", status: "Submitted", src: kyc1 },
                { name: "Tax ID", status: "Submitted", src: kyc2 },
                { name: "Financial Statements", status: "Submitted", src: kyc3 },
                { name: "Insurance Certificate", status: "Submitted", src: kyc4 },
                { name: "Compliance Report", status: "Submitted", src: kyc5 },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-sm rounded-lg p-3 text-center"
                >
                  <div className="mb-2">
                    <img src={doc.src} alt="" className="w-full h-12 sm:h-16 object-cover rounded-md" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-xs text-green-600">{doc.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-700">
              <span className="font-medium">KYC Progress:</span> Submitted: 07/15/2024 | Expected: 07/22/2024
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Assigned Reviewer:</span> Emily Carter
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white rounded-b-xl p-4 sm:p-6 border-t">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => onDecision("rejected")}
              className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Reject KYC
            </button>
            <button
              onClick={() => onDecision("approved")}
              className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Approve KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusModal({ open, onClose, status = "approved" }) {
  const isApproved = status === "approved";
  return (
    <ModalShell open={open} onClose={onClose} title="" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center py-4">
        <div
          className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${
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
        <div className="text-xs text-slate-400 mt-2">Shortly you will find a confirmation in your email.</div>
        <button
          onClick={onClose}
          className="mt-4 w-full inline-flex items-center justify-center bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition rounded"
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
    status: "Active",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500 rounded-full" /> Active
      </span>
    ),
  },
  {
    DOCUMENTID: <span className="font-medium">DOC-002</span>,
    VENDOR: "Tech Solutions Inc",
    CITY: "Chennai",
    EXPDATE: "08/05/2025",
    REVIEWEDBY: "jacob",
    status: "Pending",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-yellow-500 rounded-full" /> Pending
      </span>
    ),
  },
  {
    DOCUMENTID: <span className="font-medium">DOC-003</span>,
    VENDOR: "Glenmar Co",
    CITY: "Visakhapatnam",
    EXPDATE: "11/22/2025",
    REVIEWEDBY: "isaiah",
    status: "Declined",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-red-500 rounded-full" /> Declined
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
    status: "Pending Review",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-yellow-500 rounded-full" /> Pending Review
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-002</span>,
    VENDOR: "Tech Solutions Inc",
    DOCUMENTTYPE: "Tax ID, Business License",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "jacob",
    status: "Declined",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-red-500 rounded-full" /> Declined
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-003</span>,
    VENDOR: "Premium Style Ltd",
    DOCUMENTTYPE: "Registration, Insurance",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "ace",
    status: "Active",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500 rounded-full" /> Active
      </span>
    ),
  },
  {
    KYCID: <span className="font-medium">KYC-004</span>,
    VENDOR: "Premium Style Ltd",
    DOCUMENTTYPE: "Compliance, Due Diligence",
    REQUESTDATE: "12/08/2025",
    ASSIGNEDTO: "judge",
    status: "Active",
    STATUS: (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 bg-green-500 rounded-full" /> Active
      </span>
    ),
  },
];

export default function Compliance() {
  const [documentOpen, setDocumentOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [status, setStatus] = useState(null);

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
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Compliance Management</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Monitor vendor documentation and KYC processes
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 sm:space-y-8">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => (
            <StatCard key={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Document Review */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-slate-800">Document Review</div>
              <div className="text-xs text-slate-500 mt-1">Vendor compliance documents requiring attention</div>
            </div>
            <div className="relative flex-shrink-0">
              <button 
                onClick={() => setDocFilterOpen(!docFilterOpen)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition rounded border"
              >
                Filter: {docFilter} <ChevronDown className="h-3 w-3" />
              </button>
              {docFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
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

          <Table
            columns={["DOCUMENTID", "VENDOR", "CITY", "EXPDATE", "REVIEWEDBY", "STATUS"]}
            rows={filteredDocRows}
            title="Document Review"
            renderActions={() => (
              <button
                onClick={() => setDocumentOpen(true)}
                className="inline-flex items-center gap-1 text-blue-600 px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition rounded border border-blue-200"
              >
                View
              </button>
            )}
          />
        </section>

        {/* KYC Verification Requests */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-slate-800">KYC Verification Requests</div>
              <div className="text-xs text-slate-500 mt-1">New vendor onboarding and verification</div>
            </div>
            <div className="relative flex-shrink-0">
              <button 
                onClick={() => setKycFilterOpen(!kycFilterOpen)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition rounded border"
              >
                Filter: {kycFilter} <ChevronDown className="h-3 w-3" />
              </button>
              {kycFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
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

          <Table
            columns={["KYCID", "VENDOR", "DOCUMENTTYPE", "REQUESTDATE", "ASSIGNEDTO", "STATUS"]}
            rows={filteredKycRows}
            title="KYC Verification"
            renderActions={() => (
              <button
                onClick={() => setKycOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 transition rounded border border-green-200"
              >
                Review
              </button>
            )}
          />
        </section>

        {/* Compliance Alerts */}
        <section>
          <div className="text-base font-semibold text-slate-800">Compliance Alerts</div>
          <div className="text-xs text-slate-500 mb-4">Important notifications requiring immediate attention</div>

          <div className="space-y-2 sm:space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm text-yellow-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>3 vendor licenses expiring this month</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>10 documents pending review</span>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm text-red-800">
              <div className="flex items-start gap-2">
                <UserCheck className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>5 new KYC applications submitted</span>
              </div>
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