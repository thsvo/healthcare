"use client";

import { useState, useEffect } from "react";

export default function ClinicalOptionsPage() {
  const [activeTab, setActiveTab] = useState("medication");
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [followUpOptions, setFollowUpOptions] = useState([]);
  const [refillReminderOptions, setRefillReminderOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [treatmentForm, setTreatmentForm] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [followUpForm, setFollowUpForm] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const [showRefillReminderModal, setShowRefillReminderModal] = useState(false);
  const [editingRefillReminder, setEditingRefillReminder] = useState(null);
  const [refillReminderForm, setRefillReminderForm] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, treatRes, followUpRes, refillRes] = await Promise.all([
        fetch("/api/medication-options"),
        fetch("/api/treatment-options"),
        fetch("/api/followup-options"),
        fetch("/api/refill-reminder-options"),
      ]);

      const medData = await medRes.json();
      const treatData = await treatRes.json();
      const followUpData = await followUpRes.json();
      const refillData = await refillRes.json();

      if (medData.success) setMedicationOptions(medData.data);
      if (treatData.success) setTreatmentOptions(treatData.data);
      if (followUpData.success) setFollowUpOptions(followUpData.data);
      if (refillData.success) setRefillReminderOptions(refillData.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Medication handlers
  const openMedicationModal = (option = null) => {
    if (option) {
      setEditingMedication(option);
      setMedicationForm({
        name: option.name,
        description: option.description || "",
        order: option.order || 0,
        isActive: option.isActive,
      });
    } else {
      setEditingMedication(null);
      setMedicationForm({
        name: "",
        description: "",
        order: 0,
        isActive: true,
      });
    }
    setShowMedicationModal(true);
  };

  const closeMedicationModal = () => {
    setShowMedicationModal(false);
    setEditingMedication(null);
    setMedicationForm({
      name: "",
      description: "",
      order: 0,
      isActive: true,
    });
  };

  const handleMedicationSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/medication-options";
      const method = editingMedication ? "PUT" : "POST";
      const body = editingMedication
        ? { id: editingMedication._id, ...medicationForm }
        : medicationForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
        closeMedicationModal();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save medication option:", error);
      alert("Failed to save");
    }
  };

  const handleDeleteMedication = async (id) => {
    if (!confirm("Are you sure you want to delete this medication option?")) return;

    try {
      const res = await fetch(`/api/medication-options?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete medication option:", error);
      alert("Failed to delete");
    }
  };

  // Treatment handlers
  const openTreatmentModal = (option = null) => {
    if (option) {
      setEditingTreatment(option);
      setTreatmentForm({
        name: option.name,
        description: option.description || "",
        order: option.order || 0,
        isActive: option.isActive,
      });
    } else {
      setEditingTreatment(null);
      setTreatmentForm({
        name: "",
        description: "",
        order: 0,
        isActive: true,
      });
    }
    setShowTreatmentModal(true);
  };

  const closeTreatmentModal = () => {
    setShowTreatmentModal(false);
    setEditingTreatment(null);
    setTreatmentForm({
      name: "",
      description: "",
      order: 0,
      isActive: true,
    });
  };

  const handleTreatmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/treatment-options";
      const method = editingTreatment ? "PUT" : "POST";
      const body = editingTreatment
        ? { id: editingTreatment._id, ...treatmentForm }
        : treatmentForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
        closeTreatmentModal();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save treatment option:", error);
      alert("Failed to save");
    }
  };

  const handleDeleteTreatment = async (id) => {
    if (!confirm("Are you sure you want to delete this treatment option?")) return;

    try {
      const res = await fetch(`/api/treatment-options?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete treatment option:", error);
      alert("Failed to delete");
    }
  };

  // Follow Up handlers
  const openFollowUpModal = (option = null) => {
    if (option) {
      setEditingFollowUp(option);
      setFollowUpForm({
        name: option.name,
        description: option.description || "",
        order: option.order || 0,
        isActive: option.isActive,
      });
    } else {
      setEditingFollowUp(null);
      setFollowUpForm({
        name: "",
        description: "",
        order: 0,
        isActive: true,
      });
    }
    setShowFollowUpModal(true);
  };

  const closeFollowUpModal = () => {
    setShowFollowUpModal(false);
    setEditingFollowUp(null);
    setFollowUpForm({
      name: "",
      description: "",
      order: 0,
      isActive: true,
    });
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/followup-options";
      const method = editingFollowUp ? "PUT" : "POST";
      const body = editingFollowUp
        ? { id: editingFollowUp._id, ...followUpForm }
        : followUpForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
        closeFollowUpModal();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save follow-up option:", error);
      alert("Failed to save");
    }
  };

  const handleDeleteFollowUp = async (id) => {
    if (!confirm("Are you sure you want to delete this follow-up option?")) return;

    try {
      const res = await fetch(`/api/followup-options?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete follow-up option:", error);
      alert("Failed to delete");
    }
  };

  // Refill Reminder handlers
  const openRefillReminderModal = (option = null) => {
    if (option) {
      setEditingRefillReminder(option);
      setRefillReminderForm({
        name: option.name,
        description: option.description || "",
        order: option.order || 0,
        isActive: option.isActive,
      });
    } else {
      setEditingRefillReminder(null);
      setRefillReminderForm({
        name: "",
        description: "",
        order: 0,
        isActive: true,
      });
    }
    setShowRefillReminderModal(true);
  };

  const closeRefillReminderModal = () => {
    setShowRefillReminderModal(false);
    setEditingRefillReminder(null);
    setRefillReminderForm({
      name: "",
      description: "",
      order: 0,
      isActive: true,
    });
  };

  const handleRefillReminderSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/refill-reminder-options";
      const method = editingRefillReminder ? "PUT" : "POST";
      const body = editingRefillReminder
        ? { id: editingRefillReminder._id, ...refillReminderForm }
        : refillReminderForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
        closeRefillReminderModal();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save refill reminder option:", error);
      alert("Failed to save");
    }
  };

  const handleDeleteRefillReminder = async (id) => {
    if (!confirm("Are you sure you want to delete this refill reminder option?")) return;

    try {
      const res = await fetch(`/api/refill-reminder-options?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete refill reminder option:", error);
      alert("Failed to delete");
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary">Clinical Options</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("medication")}
            className={`${
              activeTab === "medication"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Medication Options
          </button>
          <button
            onClick={() => setActiveTab("treatment")}
            className={`${
              activeTab === "treatment"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Treatment Options
          </button>
          <button
            onClick={() => setActiveTab("followup")}
            className={`${
              activeTab === "followup"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Follow Up Options
          </button>
          <button
            onClick={() => setActiveTab("refill")}
            className={`${
              activeTab === "refill"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Refill Reminder Options
          </button>
        </nav>
      </div>

      {/* Medication Tab */}
      {activeTab === "medication" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage medication options that can be added to patient records
            </p>
            <button
              onClick={() => openMedicationModal()}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Medication Option
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicationOptions.map((option) => (
                  <tr key={option._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {option.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {option.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {option.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          option.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openMedicationModal(option)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(option._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {medicationOptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No medication options yet. Click &quot;Add Medication Option&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Treatment Tab */}
      {activeTab === "treatment" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage treatment options that can be added to patient records
            </p>
            <button
              onClick={() => openTreatmentModal()}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Treatment Option
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {treatmentOptions.map((option) => (
                  <tr key={option._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {option.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {option.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {option.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          option.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openTreatmentModal(option)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTreatment(option._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {treatmentOptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No treatment options yet. Click &quot;Add Treatment Option&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medication Modal */}
      {showMedicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMedication ? "Edit Medication Option" : "Add Medication Option"}
              </h3>
              <button
                onClick={closeMedicationModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleMedicationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={medicationForm.name}
                  onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={medicationForm.description}
                  onChange={(e) => setMedicationForm({ ...medicationForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={medicationForm.order}
                  onChange={(e) => setMedicationForm({ ...medicationForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medicationForm.isActive}
                    onChange={(e) => setMedicationForm({ ...medicationForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  <span className="text-sm text-gray-700">Is Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeMedicationModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingMedication ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Treatment Modal */}
      {showTreatmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTreatment ? "Edit Treatment Option" : "Add Treatment Option"}
              </h3>
              <button
                onClick={closeTreatmentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleTreatmentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={treatmentForm.name}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={treatmentForm.description}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={treatmentForm.order}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={treatmentForm.isActive}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  <span className="text-sm text-gray-700">Is Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeTreatmentModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingTreatment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Follow Up Tab */}
      {activeTab === "followup" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage follow-up options for patient clinical updates
            </p>
            <button
              onClick={() => openFollowUpModal()}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Follow Up Option
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {followUpOptions.map((option) => (
                  <tr key={option._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {option.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {option.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {option.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          option.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openFollowUpModal(option)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFollowUp(option._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {followUpOptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No follow-up options yet. Click &quot;Add Follow Up Option&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refill Reminder Tab */}
      {activeTab === "refill" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage refill reminder options for patient clinical updates
            </p>
            <button
              onClick={() => openRefillReminderModal()}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Refill Reminder Option
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refillReminderOptions.map((option) => (
                  <tr key={option._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {option.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {option.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {option.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          option.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openRefillReminderModal(option)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRefillReminder(option._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {refillReminderOptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No refill reminder options yet. Click &quot;Add Refill Reminder Option&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Follow Up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingFollowUp ? "Edit Follow Up Option" : "Add Follow Up Option"}
              </h3>
              <button
                onClick={closeFollowUpModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleFollowUpSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={followUpForm.name}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={followUpForm.description}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={followUpForm.order}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={followUpForm.isActive}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  <span className="text-sm text-gray-700">Is Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeFollowUpModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingFollowUp ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refill Reminder Modal */}
      {showRefillReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRefillReminder ? "Edit Refill Reminder Option" : "Add Refill Reminder Option"}
              </h3>
              <button
                onClick={closeRefillReminderModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleRefillReminderSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={refillReminderForm.name}
                  onChange={(e) => setRefillReminderForm({ ...refillReminderForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={refillReminderForm.description}
                  onChange={(e) => setRefillReminderForm({ ...refillReminderForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={refillReminderForm.order}
                  onChange={(e) => setRefillReminderForm({ ...refillReminderForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refillReminderForm.isActive}
                    onChange={(e) => setRefillReminderForm({ ...refillReminderForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  <span className="text-sm text-gray-700">Is Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeRefillReminderModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingRefillReminder ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
