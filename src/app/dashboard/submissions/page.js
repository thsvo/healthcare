"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    fetchDoctors();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/survey/responses");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/survey/responses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAssignDoctor = async (id, doctorId) => {
    try {
      const res = await fetch(`/api/survey/responses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedDoctor: doctorId || null }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Use the server-returned data which relies on populate
        setSubmissions(prev => prev.map(sub => 
          sub._id === id ? data.data : sub
        ));
      } else {
        console.error("Failed to assign doctor:", data.error);
        alert("Failed to assign doctor: " + data.error);
      }
    } catch (error) {
      console.error("Failed to assign doctor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    
    try {
      const res = await fetch(`/api/survey/responses/${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.filter(sub => sub._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // When selectedSubmission opens, set the doctor
  useEffect(() => {
    if (selectedSubmission) {
      console.log("Opening submission:", selectedSubmission._id, "Assigned Doctor:", selectedSubmission.assignedDoctor);
      setSelectedDoctor(selectedSubmission.assignedDoctor?._id || "");
    }
  }, [selectedSubmission]);

  const handleApprove = async () => {
    try {
      console.log("Approving submission:", selectedSubmission._id, "Selected Doctor:", selectedDoctor);
      const res = await fetch(`/api/survey/responses/${selectedSubmission._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: 'reviewed',
          assignedDoctor: selectedDoctor || null
        }),
      });
      
      const data = await res.json();
      console.log("Approve response:", data);
      
      if (data.success) {
        // Refetch to ensure we have the latest populated data
        await fetchSubmissions();
        setSelectedSubmission(null);
        setIsExpanded(false);
      }
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Survey Submissions</h2>
          <p className="text-gray-600 mt-1">View and manage all survey submissions.</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {submissions.length} submissions
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No submissions yet</h3>
            <p className="text-gray-500">Survey submissions will appear here.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Dr</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {sub.userInfo?.firstName?.charAt(0) || sub.userId?.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {sub.userInfo?.firstName || sub.userId?.firstName} {sub.userInfo?.lastName || sub.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{sub.userInfo?.email || sub.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.serviceId ? (
                      <div className="flex items-center gap-2">
                        {sub.serviceId.image && (
                          <img 
                            src={sub.serviceId.image} 
                            alt={sub.serviceId.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {sub.serviceId.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">General</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sub.assignedDoctor ? (
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {sub.assignedDoctor.firstName?.charAt(0)}
                        </div>
                        <span>Dr. {sub.assignedDoctor.firstName} {sub.assignedDoctor.lastName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      View Q&A
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sub._id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-3"
                      title="Delete Submission"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Q&A Details Modal */}
      {/* Q&A Details Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isExpanded}
            dragMomentum={false}
            className={isExpanded 
              ? "fixed inset-0 z-50 bg-white flex flex-col" 
              : "fixed top-24 right-6 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden"
            }
            style={{ cursor: isExpanded ? "default" : "default" }}
          >
            {/* Modal Header */}
            <div 
              className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 cursor-move"
            >
              <div>
                <h3 className="text-lg font-semibold text-secondary">
                  Submission Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSubmission.userInfo?.firstName || selectedSubmission.userId?.firstName} {selectedSubmission.userInfo?.lastName || selectedSubmission.userId?.lastName}
                  {selectedSubmission.serviceId && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {selectedSubmission.serviceId.name}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer text-gray-500"
                  onPointerDown={(e) => e.stopPropagation()}
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => { setSelectedSubmission(null); setIsExpanded(false); }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer text-gray-500"
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div 
              className="p-6 overflow-y-auto flex-1 cursor-default"
              onPointerDown={(e) => e.stopPropagation()} // Allow text selection and scrolling without dragging
            >
              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>{" "}
                    <span className="text-gray-900">{selectedSubmission.userInfo?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>{" "}
                    <span className="text-gray-900">{selectedSubmission.userInfo?.phone || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>{" "}
                    <span className="text-gray-900">
                      {selectedSubmission.userInfo?.address}
                      {selectedSubmission.userInfo?.addressLine2 && `, ${selectedSubmission.userInfo.addressLine2}`}
                      {selectedSubmission.userInfo?.city && `, ${selectedSubmission.userInfo.city}`}
                      {selectedSubmission.userInfo?.state && `, ${selectedSubmission.userInfo.state}`}
                      {selectedSubmission.userInfo?.zipCode && ` ${selectedSubmission.userInfo.zipCode}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Q&A */}
              <h4 className="font-medium text-gray-900 mb-4">Survey Answers</h4>
              <div className="space-y-4">
                {selectedSubmission.answers?.length > 0 ? (
                  selectedSubmission.answers.map((qa, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <p className="font-medium text-gray-900 mb-1">
                        <span className="text-primary mr-2">Q{index + 1}.</span>
                        {qa.questionText}
                      </p>
                      <p className="text-gray-600 pl-6">
                        {Array.isArray(qa.answer) 
                          ? qa.answer.join(", ") 
                          : qa.answer || <span className="text-gray-400 italic">No answer</span>
                        }
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No answers recorded</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="p-4 border-t border-gray-100 bg-gray-50"
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag
            >
              <div className="flex items-center gap-4">
                {/* Assign Doctor */}
                <div className="flex-1">
                   <label className="block text-xs text-gray-500 mb-1">Assign Doctor</label>
                   <select
                     value={selectedDoctor}
                     onChange={(e) => setSelectedDoctor(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                   >
                     <option value="">Select Doctor...</option>
                     {doctors.map(doc => (
                       <option key={doc._id} value={doc._id}>
                         Dr. {doc.firstName} {doc.lastName}
                       </option>
                     ))}
                   </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedSubmission(null); setIsExpanded(false); }}
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>

                  {selectedSubmission.status !== 'reviewed' && selectedSubmission.status !== 'approved' ? (
                    <button
                      onClick={handleApprove}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  )}
                  {selectedSubmission.status !== 'rejected' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedSubmission._id, 'rejected');
                        setSelectedSubmission(null);
                        setIsExpanded(false);
                      }}
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
