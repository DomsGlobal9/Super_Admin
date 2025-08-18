import React, { useMemo, useState } from "react";
import ic_cust1 from "../assets/ic_customer1.png";
import user from "../assets/user.png";
import agent from "../assets/agent.png";
// import ic_cust2 from "../assets/ic_customer2";
// import ic_cust3 from "../assets/ic_customer3";

// import ic_cust4 from "../assets/ic_customer4";


import {
  TicketCheck,
  Clock,
  CheckCircle2,
  TimerReset,
  ChevronDown,
  Search,
  X,
  SendHorizontal,
} from "lucide-react";

/**
 * Clean Customer Support Dashboard
 * - Smaller appearance with minimal borders
 * - Clean spacing and responsive design
 * - Top containers keep white background, rest are borderless
 */

const COLORS = {
  page: "#F8FAFC", // lighter background
  card: "#FFFFFF",
  primary: "#3B82F6",
  primaryHover: "#2563EB",
  text: "#1E293B",
  sub: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warn: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
};

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg p-2 bg-slate-50">
          {/* <Icon className="h-4 w-4 text-slate-600" /> */}
          <img src={ic_cust1} alt="" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 font-medium">{label}</div>
          <div className="text-xl font-bold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ tone = "default", children }) {
  const map = {
    default: "bg-slate-100 text-slate-700",
    high: "bg-red-50 text-red-600 border border-red-200",
    medium: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    low: "bg-green-50 text-green-600 border border-green-200",
    statusResolved: "bg-green-50 text-green-600 border border-green-200",
    statusProgress: "bg-blue-50 text-blue-600 border border-blue-200",
    statusOpen: "bg-orange-50 text-orange-600 border border-orange-200",
    statusFailed: "bg-red-50 text-red-600 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

function Table({ columns, rows, renderActions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="">
            {columns.map((c) => (
              <th key={c} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                {c}
              </th>
            ))}
            {renderActions && <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-25">
              {columns.map((c) => (
                <td key={c} className="px-3 py-3 text-sm text-slate-700">
                  {row[c]}
                </td>
              ))}
              {renderActions && (
                <td className="px-3 py-3 text-right text-sm">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModalShell({ open, onClose, title, children, maxWidth = "max-w-4xl" }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative ${maxWidth} w-full max-h-[90vh] rounded-xl bg-white shadow-2xl overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ConversationModal({ open, onClose, ticket }) {
  if (!ticket) return null;
  return (
    <ModalShell open={open} onClose={onClose} title={`${ticket.subject} - ${ticket.id}`}>
      <div className="flex flex-col space-y-6">
        {/* Customer Image */}
        <div className="flex justify-start">
          <div className="w-48 h-64 rounded-lg border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
            <img 
              src={user} 
              alt="Customer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-2">
          <div>
            <span className="text-sm font-semibold text-slate-900">Customer: </span>
            <span className="text-sm text-slate-700">{ticket.customerName}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600">Order ID: </span>
            <span className="text-sm text-blue-600">ORD-2023-00123</span>
          </div>
        </div>

        {/* Conversation Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversation</h3>
          
          {/* Messages Container */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto bg-slate-50 rounded-lg p-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {ticket.conversation.map((msg, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
                  <img 
                    src={msg.role === "Customer" ? user : agent} 
                    alt={msg.role}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {msg.role === "Agent" ? "Support Agent" : ticket.customerName}
                    </span>
                    <span className="text-xs text-blue-600">{msg.time}</span>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
              <img 
                src={agent} 
                alt="Support Agent"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              className="flex-1 border-none px-3 py-2 text-sm outline-none placeholder:text-slate-500 bg-transparent"
              placeholder="Type your reply..."
            />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// --- Mock data ---
const RAW_TICKETS = [
  {
    id: "TICK-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    subject: "Order delivery delay",
    time: "1/20/2024, 4:00:00 PM",
    priority: "High",
    status: "Completed",
    assigned: "Sarah Johnson",
    conversation: [
      { role: "Customer", time: "10:00 AM", text: "Hi, I'm writing to inquire about the status of my order..." },
      { role: "Agent", time: "10:05 AM", text: "Hello John, thanks for reaching out. I'm sorry for the delay..." },
      { role: "Agent", time: "10:20 AM", text: "I see your order is in transit and expected by tomorrow." },
      { role: "Customer", time: "10:35 AM", text: "Thanks for the update. Is there a tracking link?" },
      { role: "Agent", time: "10:40 AM", text: "Yes, please use this link: [Tracking Link]." },
    ],
  },
  {
    id: "TICK-002",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    subject: "Product quality issue",
    time: "1/19/2024, 9:50:00 PM",
    priority: "Medium",
    status: "Processing",
    assigned: "Mike Wilson",
    conversation: [
      { role: "Customer", time: "9:50 PM", text: "Received item with scratches, can I get a replacement?" },
      { role: "Agent", time: "10:02 PM", text: "Absolutely, let me start a replacement ticket for you." },
    ],
  },
  {
    id: "TICK-003",
    customerName: "Robert Brown",
    customerEmail: "robert.brown@email.com",
    subject: "Refund request",
    time: "1/18/2024, 7:40:00 PM",
    priority: "Low",
    status: "Pending",
    assigned: "Lisa Chen",
    conversation: [
      { role: "Customer", time: "7:40 PM", text: "Has my refund been processed?" },
    ],
  },
  {
    id: "TICK-004",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    subject: "Account login issues",
    time: "1/20/2024, 9:15:00 PM",
    priority: "High",
    status: "Completed",
    assigned: "Lisa Chen",
    conversation: [
      { role: "Customer", time: "9:15 PM", text: "I can't log in; keeps showing error." },
      { role: "Agent", time: "9:20 PM", text: "I'll help reset your password and check the account." },
    ],
  },
  {
    id: "TICK-005",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    subject: "Account login issues",
    time: "1/20/2024, 9:15:00 PM",
    priority: "Low",
    status: "Pending",
    assigned: "Unassigned",
    conversation: [
      { role: "Customer", time: "9:15 PM", text: "I submitted the form but no email yet." },
    ],
  },
];

export default function CustomerSupport() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalTicket, setModalTicket] = useState(null);

  const tickets = useMemo(() => {
    let list = RAW_TICKETS;
    if (statusFilter !== "All") list = list.filter((t) => t.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, statusFilter]);

  const stats = useMemo(
    () => [
      { icon: TicketCheck, label: "Open Tickets", value: "40,689" },
      { icon: Clock, label: "In Progress", value: "689" },
      { icon: CheckCircle2, label: "Resolved Tickets", value: "50" },
      { icon: TimerReset, label: "Avg Response Time", value: "1.4hrs" },
    ],
    []
  );

  // table rows mapping
  const rows = tickets.map((t) => ({
    "Ticket ID": <span className="font-medium text-slate-900">{t.id}</span>,
    Customer: (
      <div>
        <div className="font-medium text-slate-900">{t.customerName}</div>
        <div className="text-xs text-slate-500">{t.customerEmail}</div>
      </div>
    ),
    Subject: (
      <div>
        <div className="font-medium text-slate-900">{t.subject}</div>
        <div className="text-xs text-slate-500">{t.time}</div>
      </div>
    ),
    Priority: (
      <Pill tone={t.priority === "High" ? "high" : t.priority === "Medium" ? "medium" : "low"}>{t.priority}</Pill>
    ),
    Status: (
      <>
        {t.status === "Completed" && <Pill tone="statusResolved">Resolved</Pill>}
        {t.status === "Processing" && <Pill tone="statusProgress">In Processing</Pill>}
        {t.status === "Pending" && <Pill tone="statusOpen">Open</Pill>}
        {t.status === "Failed" && <Pill tone="statusFailed">Open</Pill>}
      </>
    ),
    "Assigned To": <span className="text-slate-700">{t.assigned}</span>,
    _raw: t,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        <h2 className="text-3xl font-semibold text-slate-900">Customer Support</h2>
        <p className="mt-1 text-sm text-slate-600">Manage customer inquiries and support tickets</p>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        {/* Top cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Search + Filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vendors"
                className="w-full rounded-lg bg-white border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Filters By <ChevronDown className="h-4 w-4" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-lg bg-white border border-slate-200 shadow-lg">
                {[
                  "All",
                  "Completed",
                  "Processing",
                  "Pending",
                  "Failed",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setFilterOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      statusFilter === s ? "bg-slate-100" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-800">Support Tickets</div>
              <div className="text-xs text-slate-500">Assisting with ticket support and resolution</div>
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className="inline-flex items-center gap-1  px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Filter By <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className=" overflow-hidden">
            <Table
              columns={["Ticket ID", "Customer", "Subject", "Priority", "Status", "Assigned To"]}
              rows={rows}
              renderActions={(row) => (
                <button
                  onClick={() => setModalTicket(row._raw)}
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-2 text-sm"
                >
                  view
                </button>
              )}
            />
          </div>
        </section>
      </main>

      {/* Modal */}
      <ConversationModal open={!!modalTicket} onClose={() => setModalTicket(null)} ticket={modalTicket} />
    </div>
  );
}