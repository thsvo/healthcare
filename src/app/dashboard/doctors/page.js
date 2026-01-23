"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctorTasks, setDoctorTasks] = useState({ patients: [], surveys: [] });
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchDoctorsAndStats();
  }, []);

  const fetchDoctorsAndStats = async () => {
    try {
      const [doctorsRes, statsRes] = await Promise.all([
        fetch("/api/doctors"),
        fetch("/api/doctors/stats")
      ]);
      
      const doctorsData = await doctorsRes.json();
      const statsData = await statsRes.json();
      
      if (doctorsData.success) {
        setDoctors(doctorsData.data);
      }
      
      if (statsData.success) {
        // Convert array to object map by ID
        const statsMap = {};
        statsData.data.forEach(s => {
          statsMap[s._id] = s;
        });
        setStats(statsMap);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    setLoadingTasks(true);
    try {
      const [patientsRes, surveysRes] = await Promise.all([
        fetch(`/api/users?assignedDoctorId=${doctorId}`),
        fetch(`/api/survey/responses?assignedDoctor=${doctorId}`)
      ]);
      
      const patientsData = await patientsRes.json();
      const surveysData = await surveysRes.json();
      
      setDoctorTasks({
        patients: patientsData.success ? patientsData.data : [],
        surveys: surveysData.success ? surveysData.data : []
      });
    } catch (error) {
      console.error("Failed to fetch details:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleViewDetails = (doctor) => {
    setViewingDoctor(doctor);
    fetchDoctorDetails(doctor._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editingDoctor && !formData.password) {
      alert("Password is required for new doctors");
      return;
    }

    const url = editingDoctor 
      ? `/api/doctors/${editingDoctor._id}`
      : "/api/doctors";
    
    const method = editingDoctor ? "PUT" : "POST";
    
    const submitData = { ...formData };
    if (!submitData.password) delete submitData.password;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDoctorsAndStats();
        closeModal();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to save doctor:", error);
      alert("Failed to save doctor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this doctor?")) return;
    
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDoctorsAndStats();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  const openModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        email: doctor.email || "",
        password: "", // Don't fill password
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
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
          <h2 className="text-2xl font-bold text-secondary">Doctors Management</h2>
          <p className="text-gray-600 mt-1">Add and manage doctor accounts.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Doctor
        </button>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {doctors.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors yet</h3>
            <p className="text-gray-500 mb-4">Add your first doctor account.</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Add Doctor
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctors.map((doctor) => {
                const docStats = stats[doctor._id] || { patientCount: 0, surveyCount: 0, pendingSurveys: 0 };
                return (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {doctor.firstName?.charAt(0) || "D"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{doctor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <span className="block text-lg font-bold text-gray-900">{docStats.patientCount}</span>
                          <span className="text-xs text-gray-500">Patients</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-lg font-bold text-purple-600">{docStats.pendingSurveys}</span>
                          <span className="text-xs text-gray-500">New Tasks</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-lg font-bold text-gray-500">{docStats.surveyCount}</span>
                          <span className="text-xs text-gray-500">Total Tasks</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(doctor)}
                        className="text-primary hover:text-primary/80 mr-3 font-semibold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openModal(doctor)}
                        className="text-gray-400 hover:text-gray-600 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-secondary">
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name (Opt)</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Dr."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name (Opt)</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                  placeholder="doctor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingDoctor ? "New Password (Optional)" : "Password*"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder={editingDoctor ? "Leave blank to keep current" : "Secure password"}
                  required={!editingDoctor}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingDoctor ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Details Panel */}
      <AnimatePresence>
        {viewingDoctor && (
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
            <div 
              className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-primary text-white rounded-t-xl cursor-move"
            >
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Dr. {viewingDoctor.firstName}
                </h3>
                <p className="text-white/80 text-xs">Assigned Tasks Overview</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer mr-2"
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
                  onClick={() => { setViewingDoctor(null); setIsExpanded(false); }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div 
              className="p-0 overflow-y-auto flex-1 cursor-default bg-gray-50"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {loadingTasks ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Assigned Patients Section */}
                  <div className="bg-white mb-2">
                    <div className="px-4 py-2 bg-gray-100 font-medium text-xs text-gray-500 uppercase">
                      Assigned Patients ({doctorTasks.patients.length})
                    </div>
                    {doctorTasks.patients.length === 0 ? (
                      <p className="p-4 text-center text-sm text-gray-500">No active patients.</p>
                    ) : (
                      doctorTasks.patients.map(patient => (
                        <div key={patient._id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{patient.firstName} {patient.lastName}</p>
                            <p className="text-xs text-gray-500">{patient.email}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            patient.accountStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {patient.accountStatus}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Assigned Surveys Section */}
                  <div className="bg-white">
                    <div className="px-4 py-2 bg-gray-100 font-medium text-xs text-gray-500 uppercase">
                      Assigned Survey Tasks ({doctorTasks.surveys.length})
                    </div>
                     {doctorTasks.surveys.length === 0 ? (
                      <p className="p-4 text-center text-sm text-gray-500">No survey tasks assigned.</p>
                    ) : (
                      doctorTasks.surveys.map(survey => (
                        <div key={survey._id} className="p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                survey.status === 'new' ? 'bg-purple-100 text-purple-700' : 
                                survey.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {survey.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(survey.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            Patient: {survey.userId?.firstName} {survey.userId?.lastName}
                          </p>
                          {survey.serviceId && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Service: {survey.serviceId.name}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 text-center text-xs text-gray-500">
              Drag header to move panel
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
