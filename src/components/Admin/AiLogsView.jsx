import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaSpinner, FaExchangeAlt, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import api from "../Utils/api";
import { toast } from "react-toastify";

export default function AiLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [endpointFilter, setEndpointFilter] = useState("All");
  
  // Modal details state
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalTab, setModalTab] = useState("request"); // 'request' | 'response' | 'error'

  const fetchLogs = async () => {
    try {
      const response = await api.get("/admin/ai-logs");
      if (response.data?.success) {
        setLogs(response.data.data.logs || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load AI logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const userName = log.userId?.name || "";
    const userEmail = log.userId?.email || "";
    const destination = log.requestPayload?.destination || "";
    const endpoint = log.endpoint || "";

    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    const matchesEndpoint = endpointFilter === "All" || log.endpoint === endpointFilter;

    return matchesSearch && matchesStatus && matchesEndpoint;
  });

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-indigo-650" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🤖 AI Request & Response Logs</h1>
          <p className="text-slate-500 text-sm">Monitor call statuses, verify JSON response payloads, and audit user search trials to confirm proper execution.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Endpoint filter */}
            <select
              value={endpointFilter}
              onChange={(e) => setEndpointFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-semibold"
            >
              <option value="All">All Endpoints</option>
              <option value="generate-trip">generate-trip</option>
              <option value="chat">chat</option>
              <option value="explore-destination">explore-destination</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failure">Failure</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search user, destination, endpoint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800"
            />
          </div>
        </div>

        {/* Table Logs list */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">AI Endpoint</th>
                  <th className="p-4">Destination Target</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No request/response logs found matching the filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const logTime = new Date(log.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit"
                    });
                    const destination = log.requestPayload?.destination || "-";

                    return (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-450">{logTime}</td>
                        <td className="p-4">
                          {log.userId ? (
                            <div>
                              <p className="font-bold text-slate-800">{log.userId.name}</p>
                              <p className="text-[10px] text-slate-400">{log.userId.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unknown</span>
                          )}
                        </td>
                        <td className="p-4">
                          <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                            {log.endpoint}
                          </code>
                        </td>
                        <td className="p-4 font-semibold text-slate-750">{destination}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            log.status === "Success"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}>
                            {log.status === "Success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setModalTab(log.status === "Failure" && log.error ? "error" : "request");
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold inline-flex items-center gap-1 border border-indigo-150 transition-colors text-[11px]"
                          >
                            <FaEye /> Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* INSPECT MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center text-slate-800">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full h-[80vh] mx-4 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <header className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FaExchangeAlt className="text-indigo-600" /> JSON Call Diagnostics
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ID: {selectedLog._id} | Endpoint: {selectedLog.endpoint}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <FaTimes />
              </button>
            </header>

            {/* Modal Tabs */}
            <div className="flex bg-slate-100 border-b border-slate-150 p-1 flex-shrink-0">
              <button
                onClick={() => setModalTab("request")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  modalTab === "request" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Request Payload
              </button>
              <button
                onClick={() => setModalTab("response")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  modalTab === "response" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Response Output
              </button>
              {selectedLog.error && (
                <button
                  onClick={() => setModalTab("error")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    modalTab === "error" ? "bg-white text-red-650 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Error Stack
                </button>
              )}
            </div>

            {/* Modal Payload display (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed">
              {modalTab === "request" && (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.requestPayload, null, 2)}
                </pre>
              )}

              {modalTab === "response" && (
                <pre className="whitespace-pre-wrap">
                  {selectedLog.responsePayload 
                    ? JSON.stringify(selectedLog.responsePayload, null, 2)
                    : "// No response payload recorded (call failed or fell back)."}
                </pre>
              )}

              {modalTab === "error" && (
                <pre className="text-red-400 whitespace-pre-wrap">
                  {selectedLog.error || "// No error stack trace recorded."}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <footer className="p-3 bg-slate-50 border-t border-slate-150 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Close Logs
              </button>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}
