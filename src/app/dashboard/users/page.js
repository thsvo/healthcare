"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resending, setResending] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    fetchUsers();
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setCurrentUserRole(data.data.role);
      }
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      // By default this API now returns active users for admin, or assigned for doctor
      const res = await fetch("/api/users?status=active");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCredentials = async (userId) => {
    if (!confirm("This will reset the user's password and send them new login credentials. Continue?")) {
      return;
    }
    
    setResending(userId);
    try {
      const res = await fetch(`/api/users/${userId}/resend-credentials`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Credentials sent successfully!");
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to resend credentials");
    } finally {
      setResending(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        fetchUsers();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
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
          <h2 className="text-2xl font-bold text-secondary">
            {currentUserRole === 'doctor' ? 'My Patients' : 'Registered Patients'}
          </h2>
          <p className="text-gray-600 mt-1">
            {currentUserRole === 'doctor' 
              ? 'View and manage your assigned patients.' 
              : 'Managing active patients and doctor assignments.'}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {users.length} patients
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
            <p className="text-gray-500">
              {currentUserRole === 'doctor' 
                ? 'You have no patients assigned yet.' 
                : 'Approved patients will appear here.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.phone || '-'}</p>
                    <p className="text-sm text-gray-500">{user.sex} • {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/users/${user._id}`}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      View
                    </Link>
                    {currentUserRole === 'admin' && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
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
