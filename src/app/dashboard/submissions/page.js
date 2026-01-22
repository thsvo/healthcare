"use client";

import { useState, useEffect } from "react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
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
      case 'reviewed': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      View Q&A
                    </button>
                    {sub.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(sub._id, 'reviewed')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Q&A Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
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
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
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
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedSubmission.status === 'new' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedSubmission._id, 'reviewed');
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Reviewed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
