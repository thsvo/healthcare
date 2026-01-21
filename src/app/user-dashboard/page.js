"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setPasswordMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      } else {
        setPasswordMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to ImgBB
      const formData = new FormData();
      formData.append("image", file);
      
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      
      const imgbbData = await imgbbRes.json();
      
      if (!imgbbData.success) {
        throw new Error("Failed to upload image to storage");
      }
      
      const docData = {
        url: imgbbData.data.url,
        name: file.name,
        type: file.type || "image/jpeg",
      };

      // 2. Save to User Profile
      const saveRes = await fetch(`/api/users/${user._id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData),
      });

      const saveData = await saveRes.json();
      
      if (saveData.success) {
        // Update local user state
        setUser({ ...user, documents: saveData.data });
      } else {
        alert("Failed to save document record");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      const res = await fetch(`/api/users/${user._id}/documents?docId=${docId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (data.success) {
         setUser({ ...user, documents: data.data });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Welcome, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Thank you for registering. Your account has been successfully created.
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-secondary mb-6">Your Information</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium text-gray-900">{user.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Company</label>
              <p className="font-medium text-gray-900">{user.company || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Birthday</label>
              <p className="font-medium text-gray-900">
                {user.birthday ? new Date(user.birthday).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sex</label>
              <p className="font-medium text-gray-900">{user.sex || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">Address</label>
              <p className="font-medium text-gray-900">
                {user.address}
                {user.addressLine2 && `, ${user.addressLine2}`}
              </p>
              <p className="font-medium text-gray-900">
                {user.city}, {user.state} {user.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary">My Documents</h3>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Upload Document
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          {uploading && (
            <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.documents?.length > 0 ? (
              user.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      {doc.type?.includes('image') ? (
                        <img 
                          src={doc.url} 
                          alt={doc.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                  <button 
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="text-gray-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-lg">
                No documents uploaded yet
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary">Account Security</h3>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Change Password
              </button>
            )}
          </div>
          
          {showPasswordForm ? (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              {passwordMessage.text && (
                <div className={`p-3 rounded-lg text-sm ${
                  passwordMessage.type === "error" 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {passwordMessage.text}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setPasswordMessage({ type: "", text: "" }); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500 text-sm">
              Keep your account secure by using a strong password.
            </p>
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 16 0Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            Registration Complete
          </div>
          <p className="text-gray-500 text-sm mt-2">
            We'll be in touch with you soon.
          </p>
        </div>
    </div>
  );
}
