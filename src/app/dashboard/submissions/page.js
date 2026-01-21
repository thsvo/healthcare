"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Fetch users with status=pending
      const res = await fetch("/api/users?status=pending");
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

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this submission?")) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus: "active" }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Remove from list
        setSubmissions(submissions.filter(s => s._id !== id));
        alert("Submission approved!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to approve submission:", error);
      alert("Failed to approve submission");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject (delete) this submission?")) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmissions(submissions.filter(s => s._id !== id));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to reject submission:", error);
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
          <h2 className="text-2xl font-bold text-secondary">New Submissions</h2>
          <p className="text-gray-600 mt-1">Review and approve new patient registrations.</p>
        </div>
        <div className="text-sm text-gray-500">
          Pending: {submissions.length}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No pending submissions</h3>
            <p className="text-gray-500">New survey submissions will appear here for approval.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                        {sub.firstName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {sub.firstName} {sub.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{sub.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sub.sex} • {sub.birthday ? new Date(sub.birthday).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/users/${sub._id}`}
                      className="text-gray-500 hover:text-gray-700 mr-4"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleApprove(sub._id)}
                      className="text-green-600 hover:text-green-800 mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(sub._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
