"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/Editor/RichTextEditor";
import VitalsForm from "@/components/VitalsForm";
import EditUserModal from "@/components/EditUserModal";
import Sidebar from "@/components/Sidebar";


export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState(null);
  const [newItemQuestion, setNewItemQuestion] = useState("");
  const [newItemAnswer, setNewItemAnswer] = useState("");
  
  // Notes state
  const [notes, setNotes] = useState([]);
  const [showNoteDropdown, setShowNoteDropdown] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [viewingNote, setViewingNote] = useState(null);
  
  // Survey submissions state
  const [surveySubmissions, setSurveySubmissions] = useState([]);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [refillReminder, setRefillReminder] = useState("");
  const [clinicalMedication, setClinicalMedication] = useState("");
  const [clinicalTreatment, setClinicalTreatment] = useState("");
  const [providerNote, setProviderNote] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  // Expansion states
  const [isAddModalExpanded, setIsAddModalExpanded] = useState(false);
  const [isNoteModalExpanded, setIsNoteModalExpanded] = useState(false);
  const [isViewNoteExpanded, setIsViewNoteExpanded] = useState(false);
  const [isSubmissionExpanded, setIsSubmissionExpanded] = useState(false);
  
  // Document Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocCategory, setSelectedDocCategory] = useState("");
  
  // Collapsible state for categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Collapsible state for individual items
  const [expandedItems, setExpandedItems] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Edit Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerContent, setEditAnswerContent] = useState("");

  // Discontinue Modal state
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false);
  const [discontinuingAnswer, setDiscontinuingAnswer] = useState(null);
  const [discontinueReason, setDiscontinueReason] = useState("");

  // Prescription Modal state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionAnswer, setPrescriptionAnswer] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    refills: 0,
    instructions: "",
    treatmentOption: "",
  });

  // History Viewer Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [viewingHistoryFor, setViewingHistoryFor] = useState(null);

  // Medication and Treatment Options state
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [followUpOptions, setFollowUpOptions] = useState([]);
  const [refillReminderOptions, setRefillReminderOptions] = useState([]);

  // Add Medication Modal state
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [selectedMedicationOption, setSelectedMedicationOption] = useState("");
  const [medicationData, setMedicationData] = useState({
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  // Add Treatment Modal state
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [selectedTreatmentOption, setSelectedTreatmentOption] = useState("");
  const [treatmentData, setTreatmentData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  // Services state for color mapping
  const [services, setServices] = useState([]);

  // Vitals state
  const [vitalsData, setVitalsData] = useState({
    weightLbs: '',
    weightOz: '',
    heightFt: '',
    heightIn: '',
    temperature: '',
    bmi: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    respiratoryRate: '',
    pulse: '',
    bloodSugar: '',
    fasting: '',
    o2Saturation: '',
    notes: '',
  });
  const [showVitalsHistory, setShowVitalsHistory] = useState(false);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [vitalsMetadata, setVitalsMetadata] = useState(null);

  const [isCreateNoteExpanded, setIsCreateNoteExpanded] = useState(false);
  const [isVitalsExpanded, setIsVitalsExpanded] = useState(false);
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSlideMenu, setShowSlideMenu] = useState(false);

  // Care Plan Modal state
  const [showCarePlanModal, setShowCarePlanModal] = useState(false);
  const [carePlanForm, setCarePlanForm] = useState({
    followUpOptionId: "",
    refillReminderOptionId: "",
  });


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    
    setUploading(true);
    try {
      // 1. Upload to ImgBB via API
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }
      
      // 2. Add document to user profile
      
      // Find category name if selected
      const categoryName = documentCategories.find(c => c._id === selectedDocCategory)?.name;

      const newDoc = {
         url: uploadData.url,
         name: categoryName || selectedFile.name,
         title: categoryName, // Store title specifically
         type: selectedFile.type,
         uploadedAt: new Date()
      };
      
      const updatedDocuments = [newDoc, ...(user.documents || [])];
      
      const updateRes = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: updatedDocuments }),
      });
      
      const updateData = await updateRes.json();
      
      if (updateData.success) {
        setUser(updateData.data);
        setShowUploadModal(false);
        setSelectedFile(null);
        setSelectedDocCategory("");
        alert("Document uploaded successfully!");
      } else {
        throw new Error(updateData.error);
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const noteTypes = [
    { name: 'Phone Visit', icon: '📞' },
    { name: 'Triage Encounter', icon: '🏥' },
    { name: 'Video Encounter', icon: '📹' },
    { name: 'Misc Task', icon: '✅' },
    { name: 'Misc Clinical', icon: '🩺' },
    { name: 'Misc Protected', icon: '🔒' },
    { name: 'Official Letter', icon: '📄' },
    { name: 'Message', icon: '💬' },
    { name: 'Enter COVID Results', icon: '🧪' },
    { name: 'Personal Task', icon: '📝' },
  ];

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async (skipVitals = false) => {
    try {
      // Fetch user first to ensure we catch critical errors
      console.log("Fetching user data...");
      const userRes = await fetch(`/api/users/${params.id}`);
      const userData = await userRes.json();
      
      if (!userData.success) {
        console.error("User API returned failure for ID:", params.id, userData);
        throw new Error(userData.error || "Failed to fetch user");
      }
      
      setUser(userData.data);
      fetchSurveySubmissions(userData.data._id);
      if (!skipVitals) fetchVitals();

      // Fetch other data in parallel
      const [categoriesRes, questionsRes, notesRes, doctorsRes, meRes, docCatsRes, medicationOptionsRes, treatmentOptionsRes, followUpOptionsRes, refillReminderOptionsRes, servicesRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/survey/questions"),
        fetch(`/api/users/${params.id}/notes`),
        fetch("/api/doctors"),
        fetch("/api/auth/me"),
        fetch("/api/document-categories"),
        fetch("/api/medication-options"),
        fetch("/api/treatment-options"),
        fetch("/api/followup-options"),
        fetch("/api/refill-reminder-options"),
        fetch("/api/services"),
      ]);

      const categoriesData = await categoriesRes.json();
      const questionsData = await questionsRes.json();
      const notesData = await notesRes.json();
      const doctorsData = await doctorsRes.json();
      const docCatsData = await docCatsRes.json();
      const medicationOptionsData = await medicationOptionsRes.json();
      const treatmentOptionsData = await treatmentOptionsRes.json();
      const followUpOptionsData = await followUpOptionsRes.json();
      const refillReminderOptionsData = await refillReminderOptionsRes.json();
      const servicesData = await servicesRes.json();

      if (categoriesData.success) setCategories(categoriesData.data);
      if (questionsData.success) setQuestions(questionsData.data);
      if (notesData.success) setNotes(notesData.data);
      if (doctorsData.success) setDoctors(doctorsData.data);
      if (docCatsData.success) setDocumentCategories(docCatsData.data);
      if (medicationOptionsData.success) setMedicationOptions(medicationOptionsData.data);
      if (treatmentOptionsData.success) setTreatmentOptions(treatmentOptionsData.data);
      if (followUpOptionsData.success) setFollowUpOptions(followUpOptionsData.data);
      if (refillReminderOptionsData.success) setRefillReminderOptions(refillReminderOptionsData.data);
      if (servicesData.success) setServices(servicesData.data);
      
      try {
        const currentUserData = await meRes.json();
        if (currentUserData.success) setCurrentUser(currentUserData.data);
      } catch (e) {
        console.warn("Failed to fetch current user:", e);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      // alert("Error loading user profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveySubmissions = async (userId) => {
    try {
      const res = await fetch(`/api/survey/responses?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setSurveySubmissions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch survey submissions:", error);
    }
  };

  const openNoteModal = (type) => {
    setSelectedNoteType(type);
    setNoteContent("");
    setShowNoteDropdown(false);
    setShowNoteModal(true);
  };

  const fetchVitals = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}/vitals`);
      const data = await res.json();

      if (data.success && data.data) {
        // Set existing vitals
        // Don't populate form inputs - kept blank for new entry
        /*
        setVitalsData({
          weightLbs: data.data.weightLbs || '',
          weightOz: data.data.weightOz || '',
          heightFt: data.data.heightFt || '',
          heightIn: data.data.heightIn || '',
          temperature: data.data.temperature || '',
          bmi: data.data.bmi || '',
          bloodPressureSystolic: data.data.bloodPressureSystolic || '',
          bloodPressureDiastolic: data.data.bloodPressureDiastolic || '',
          respiratoryRate: data.data.respiratoryRate || '',
          pulse: data.data.pulse || '',
          bloodSugar: data.data.bloodSugar || '',
          fasting: data.data.fasting || '',
          o2Saturation: data.data.o2Saturation || '',
          notes: data.data.notes || '',
        });
        */
        setVitalsHistory(data.data.changeHistory || []);
        setVitalsMetadata(data.data);
      } else {
        // Auto-fill from user profile if vitals don't exist
        if (user?.height) {
          const heightMatch = user.height.match(/(\d+)'(\d+)"/);
          if (heightMatch) {
            setVitalsData(prev => ({
              ...prev,
              heightFt: heightMatch[1],
              heightIn: heightMatch[2],
            }));
          }
        }
        if (user?.weight) {
          const weightMatch = user.weight.match(/(\d+)lbs\s*(\d*)oz?/);
          if (weightMatch) {
            setVitalsData(prev => ({
              ...prev,
              weightLbs: weightMatch[1],
              weightOz: weightMatch[2] || '',
            }));
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch vitals:", error);
    }
  };

  const handleSaveVitals = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalsData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Vitals saved successfully!');
        setShowNoteModal(false);
        setIsNoteModalExpanded(false);
        setVitalsHistory(data.data.changeHistory || []);
        setVitalsMetadata(data.data);

        // Reset inputs to blank after successful save
        setVitalsData({
          weightLbs: '',
          weightOz: '',
          heightFt: '',
          heightIn: '',
          temperature: '',
          bmi: '',
          bloodPressureSystolic: '',
          bloodPressureDiastolic: '',
          respiratoryRate: '',
          pulse: '',
          bloodSugar: '',
          fasting: '',
          o2Saturation: '',
          notes: '',
        });

        // Refresh user data (for header stats) 
        fetchData(true);
      } else {
        alert('Failed to save vitals: ' + data.error);
      }
    } catch (error) {
      alert('Failed to save vitals: ' + error.message);
    }
  };

  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      alert("Please enter note content.");
      return;
    }
    
    try {
      const res = await fetch(`/api/users/${params.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedNoteType, content: noteContent }),
      });
      
      const data = await res.json();
      if (data.success) {
        setNotes(prevNotes => [data.data, ...prevNotes]);
        setShowNoteModal(false);
        setIsNoteModalExpanded(false);
      } else {
        alert("Failed to create note: " + data.error);
      }
    } catch (error) {
      alert("Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    
    try {
      const res = await fetch(`/api/users/${params.id}/notes?noteId=${noteId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setNotes(notes.filter(n => n._id !== noteId));
      }
    } catch (error) {
      alert("Failed to delete note");
    }
  };

  const handleResendCredentials = async () => {
    if (!confirm("This will reset the user's password and send them new login credentials. Continue?")) {
      return;
    }
    
    setResending(true);
    try {
      const res = await fetch(`/api/users/${params.id}/resend-credentials`, {
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
      setResending(false);
    }
  };

  const openAddModal = (categoryId) => {
    setAddModalCategory(categoryId);
    setNewItemQuestion("");
    setNewItemAnswer("");
    setShowAddModal(true);
  };

  const handleAddItem = async () => {
    if (!newItemQuestion.trim()) {
      alert("Please enter a question or label.");
      return;
    }

    if (!user.surveyResponseId) {
      alert("No survey response record exists for this user.");
      return;
    }

    const finalCategory = addModalCategory !== 'uncategorized' ? addModalCategory : null;
    
    if (addModalCategory === null && !finalCategory) {
       // Since 'uncategorized' is valid (null), valid check would be: if we are in 'select mode' (which we detect if we are forced to pick one?)
       // Actually addModalCategory state updates when they pick from dropdown. 
       // If they pick "Select a category" (value ""), addModalCategory might be "" or still null.
       // Let's rely on UI state.
       if (!addModalCategory) {
          alert("Please select a category.");
          return;
       }
    }

    const newItem = {
      questionText: newItemQuestion,
      answer: newItemAnswer,
      categoryId: (addModalCategory && addModalCategory !== 'uncategorized') ? addModalCategory : null,
      questionId: null, // Custom item
      addedBy: currentUser ? {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        id: currentUser._id
      } : null,
      addedAt: new Date()
    };

    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = [newItem, ...currentAnswers];
    
    await updateSurveyResponse(updatedAnswers);
    setShowAddModal(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = currentAnswers.filter(a => a._id !== itemId);
    
    await updateSurveyResponse(updatedAnswers);
  };

  const updateSurveyResponse = async (newAnswers) => {
    try {
      const res = await fetch(`/api/survey/responses/${user.surveyResponseId._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Update local state deeply
        setUser(prev => ({
          ...prev,
          surveyResponseId: {
            ...prev.surveyResponseId,
            answers: data.data.answers
          }
        }));
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to save changes");
    }
  };

  // Edit Modal Handlers
  const openEditModal = (answer) => {
    setEditingAnswer(answer);
    setEditQuestionText(answer.questionText);
    setEditAnswerContent(answer.answer);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAnswer(null);
    setEditQuestionText("");
    setEditAnswerContent("");
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setShowEditUserModal(false);
        // Also refresh vitals in case height/weight changed which affects BMI? 
        // For now, let's just update user as that's what we edited.
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + data.error);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile");
    }
  };

  const handleEditSave = async () => {
    if (!editQuestionText.trim()) {
      alert("Question text is required");
      return;
    }

    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = currentAnswers.map(ans => {
      if (ans._id === editingAnswer._id) {
        // Create edit history entry
        const historyEntry = {
          editedBy: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            id: currentUser._id,
          },
          editedAt: new Date(),
          previousQuestionText: ans.questionText,
          previousAnswer: ans.answer,
          newQuestionText: editQuestionText,
          newAnswer: editAnswerContent,
        };

        return {
          ...ans,
          questionText: editQuestionText,
          answer: editAnswerContent,
          editedBy: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            id: currentUser._id,
          },
          editedAt: new Date(),
          editHistory: [...(ans.editHistory || []), historyEntry],
        };
      }
      return ans;
    });

    await updateSurveyResponse(updatedAnswers);
    closeEditModal();
  };

  // Discontinue Modal Handlers
  const openDiscontinueModal = (answer) => {
    setDiscontinuingAnswer(answer);
    setDiscontinueReason("");
    setShowDiscontinueModal(true);
  };

  const closeDiscontinueModal = () => {
    setShowDiscontinueModal(false);
    setDiscontinuingAnswer(null);
    setDiscontinueReason("");
  };

  const handleDiscontinue = async () => {
    if (!discontinueReason.trim()) {
      alert("Please provide a reason for discontinuing this item");
      return;
    }

    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = currentAnswers.map(ans => {
      if (ans._id === discontinuingAnswer._id) {
        return {
          ...ans,
          discontinued: true,
          discontinuedBy: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            id: currentUser._id,
          },
          discontinuedAt: new Date(),
          discontinueReason: discontinueReason,
        };
      }
      return ans;
    });

    await updateSurveyResponse(updatedAnswers);
    closeDiscontinueModal();
  };

  // Prescription Modal Handlers
  const openPrescriptionModal = (answer) => {
    setPrescriptionAnswer(answer);
    // Pre-fill if already has prescription
    if (answer.isPrescription && answer.prescriptionDetails) {
      setPrescriptionData({
        medication: answer.prescriptionDetails.medication || "",
        dosage: answer.prescriptionDetails.dosage || "",
        frequency: answer.prescriptionDetails.frequency || "",
        duration: answer.prescriptionDetails.duration || "",
        refills: answer.prescriptionDetails.refills || 0,
        instructions: answer.prescriptionDetails.instructions || "",
        treatmentOption: (answer.prescriptionDetails.treatmentOption && typeof answer.prescriptionDetails.treatmentOption === 'object') 
          ? answer.prescriptionDetails.treatmentOption._id 
          : (answer.prescriptionDetails.treatmentOption || ""),
      });
    } else {
      setPrescriptionData({
        medication: "",
        treatmentOption: "",
        dosage: "",
        frequency: "",
        duration: "",
        refills: 0,
        instructions: "",
      });
    }
    setShowPrescriptionModal(true);
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescriptionAnswer(null);
    setPrescriptionData({
      medication: "",
      treatmentOption: "",
      dosage: "",
      frequency: "",
      duration: "",
      refills: 0,
      instructions: "",
    });
  };

  const handleAddPrescription = async () => {
    if (!prescriptionData.medication) {
      alert("Medication is required");
      return;
    }

    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = currentAnswers.map(ans => {
      if (ans._id === prescriptionAnswer._id) {
        return {
          ...ans,
          isPrescription: true,
          prescriptionDetails: {
            ...prescriptionData,
            addedBy: {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              role: currentUser.role,
              id: currentUser._id,
            },
            addedAt: new Date(),
          },
        };
      }
      return ans;
    });

    await updateSurveyResponse(updatedAnswers);
    closePrescriptionModal();
  };

  // History Modal Handlers
  const openHistoryModal = (answer) => {
    setViewingHistoryFor(answer);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setViewingHistoryFor(null);
  };

  // Medication Handlers
  const openAddMedicationModal = () => {
    setSelectedMedicationOption("");
    setMedicationData({
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
    setShowAddMedicationModal(true);
  };

  const closeAddMedicationModal = () => {
    setShowAddMedicationModal(false);
    setSelectedMedicationOption("");
    setMedicationData({
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
  };

  const handleAddMedication = async () => {
    if (!selectedMedicationOption) {
      alert("Please select a medication");
      return;
    }

    const selectedOption = medicationOptions.find(opt => opt._id === selectedMedicationOption);
    if (!selectedOption) {
      alert("Invalid medication selected");
      return;
    }

    const newMedication = {
      medicationOptionId: selectedOption._id,
      name: selectedOption.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      duration: medicationData.duration,
      instructions: medicationData.instructions,
      addedBy: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        id: currentUser._id,
      },
      addedAt: new Date(),
    };

    const currentMedications = user.surveyResponseId.medications || [];
    const updatedMedications = [newMedication, ...currentMedications];

    await updateMedications(updatedMedications);
    closeAddMedicationModal();
  };

  const handleDeleteMedication = async (medicationId) => {
    if (!confirm("Are you sure you want to delete this medication?")) return;

    const currentMedications = user.surveyResponseId.medications || [];
    const updatedMedications = currentMedications.filter(m => m._id !== medicationId);

    await updateMedications(updatedMedications);
  };

  const updateMedications = async (newMedications) => {
    try {
      const res = await fetch(`/api/survey/responses/${user.surveyResponseId._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications: newMedications }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(prev => ({
          ...prev,
          surveyResponseId: {
            ...prev.surveyResponseId,
            medications: data.data.medications
          }
        }));
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to save changes");
    }
  };

  // Treatment Handlers
  const openAddTreatmentModal = () => {
    setSelectedTreatmentOption("");
    setTreatmentData({
      description: "",
      startDate: "",
      endDate: "",
      notes: "",
    });
    setShowAddTreatmentModal(true);
  };

  const closeAddTreatmentModal = () => {
    setShowAddTreatmentModal(false);
    setSelectedTreatmentOption("");
    setTreatmentData({
      description: "",
      startDate: "",
      endDate: "",
      notes: "",
    });
  };

  const handleAddTreatment = async () => {
    if (!selectedTreatmentOption) {
      alert("Please select a treatment");
      return;
    }

    const selectedOption = treatmentOptions.find(opt => opt._id === selectedTreatmentOption);
    if (!selectedOption) {
      alert("Invalid treatment selected");
      return;
    }

    const newTreatment = {
      treatmentOptionId: selectedOption._id,
      name: selectedOption.name,
      description: treatmentData.description,
      startDate: treatmentData.startDate ? new Date(treatmentData.startDate) : null,
      endDate: treatmentData.endDate ? new Date(treatmentData.endDate) : null,
      notes: treatmentData.notes,
      addedBy: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        id: currentUser._id,
      },
      addedAt: new Date(),
    };

    const currentTreatments = user.surveyResponseId.treatments || [];
    const updatedTreatments = [newTreatment, ...currentTreatments];

    await updateTreatments(updatedTreatments);
    closeAddTreatmentModal();
  };

  const handleDeleteTreatment = async (treatmentId) => {
    if (!confirm("Are you sure you want to delete this treatment?")) return;

    const currentTreatments = user.surveyResponseId.treatments || [];
    const updatedTreatments = currentTreatments.filter(t => t._id !== treatmentId);

    await updateTreatments(updatedTreatments);
  };

  const updateTreatments = async (newTreatments) => {
    try {
      const res = await fetch(`/api/survey/responses/${user.surveyResponseId._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatments: newTreatments }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(prev => ({
          ...prev,
          surveyResponseId: {
            ...prev.surveyResponseId,
            treatments: data.data.treatments
          }
        }));
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to save changes");
    }
  };

  // Group answers by category
  const getAnswersByCategory = () => {
    if (!user?.surveyResponseId?.answers) return {};
    
    const grouped = {};
    const answers = user.surveyResponseId.answers;
    
    // Create a map of question ID to category
    const questionCategoryMap = {};
    questions.forEach(q => {
      questionCategoryMap[q._id] = q.categoryId || 'uncategorized';
    });
    
    // Group answers
    answers.forEach(answer => {
      // For custom items, use the answer's categoryId directly
      // For original survey items, look up via questionId
      let categoryId;
      if (answer.categoryId) {
        categoryId = answer.categoryId;
      } else if (answer.questionId) {
        categoryId = questionCategoryMap[answer.questionId] || 'uncategorized';
      } else {
        categoryId = 'uncategorized';
      }
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(answer);
    });
    
    // Sort answers: Active items first, Discontinued items last
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => {
        // If one is discontinued and the other isn't, discontinued goes last
        if (a.discontinued && !b.discontinued) return 1;
        if (!a.discontinued && b.discontinued) return -1;
        // Otherwise keep original order
        return 0;
      });
    });
    
    return grouped;
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === 'uncategorized') return 'General';
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'General';
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const getServiceColor = (serviceId) => {
    if (!serviceId) return '#3B82F6'; // Default blue
    const service = services.find(s => s._id === serviceId);
    return service?.color || '#3B82F6';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">User not found</h2>
        <Link href="/dashboard/users" className="text-primary mt-2 inline-block">
          ← Back to Users
        </Link>
      </div>
    );
  }

  const answersByCategory = getAnswersByCategory();

  return (
    <div className="space-y-6">
      {/* Patient Header - Compact Redesign */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-4 text-white relative shadow-lg">
         
         {/* Top Row: Back Button & Menu */}
         <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setShowSlideMenu(true)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => { setShowEditUserModal(true); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => { handleResendCredentials(); setShowUserMenu(false); }}
                    disabled={resending}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    {resending ? "Sending..." : "Resend Credentials"}
                  </button>
                </div>
              )}
            </div>
         </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-4 md:mb-2">
                 <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                 </h1>
                 {user.patientId && (
                    <span className="text-white/70 font-mono text-sm bg-white/10 px-2 py-0.5 rounded">#{user.patientId}</span>
                 )}
               </div>

               {/* Compact User Details Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-2 gap-x-6 text-sm">
                  <div>
                    <span className="text-white/60 text-xs uppercase tracking-wide block mb-0.5">Contact</span>
                    <div className="font-medium truncate" title={user.email}>{user.email}</div>
                    <div className="text-white/80 text-xs">{user.phone || '-'}</div>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs uppercase tracking-wide block mb-0.5">Details</span>
                    <span className="font-medium">{user.sex || '-'}</span> • {new Date().getFullYear() - new Date(user.birthday).getFullYear()} yrs
                    <div className="text-white/80 text-xs">{user.birthday ? new Date(user.birthday).toLocaleDateString() : '-'}</div>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs uppercase tracking-wide block mb-0.5">Vitals</span>
                    <span className="font-medium">{user.height || '-'}/{user.weight || '-'}</span>
                    <div className="text-white/80 text-xs">BMI: {vitalsMetadata?.bmi || '-'}</div>
                  </div>
                  <div className="md:col-span-2 lg:col-span-2">
                    <span className="text-white/60 text-xs uppercase tracking-wide block mb-0.5">Location</span>
                    <span className="font-medium truncate block">{user.city}, {user.state}</span>
                    <div className="text-white/80 text-xs truncate max-w-xs" title={user.address}>{user.address || '-'}</div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Categories & Answers */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh)] overflow-y-auto pr-2 custom-scrollbar">
          


          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Patient Data</h3>
            <div className="flex gap-2">
              
              <button
                onClick={() => openAddModal(null)}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Data
              </button>
            </div>
          </div>

          {/* Survey Answers by Category */}
          {Object.keys(answersByCategory).sort((a, b) => {
            if (a === 'uncategorized') return 1;
            if (b === 'uncategorized') return -1;
            const catA = categories.find(c => c._id === a);
            const catB = categories.find(c => c._id === b);
            return (catA?.order || 0) - (catB?.order || 0);
          }).map((categoryId) => (
            <div key={categoryId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-teal-700 text-white border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  {getCategoryName(categoryId)}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                    {answersByCategory[categoryId].length} items
                  </span>
                  <button 
                    onClick={() => toggleCategory(categoryId)}
                    className="text-white hover:text-white/80 transition-colors p-1"
                    title={expandedCategories[categoryId] ? 'Collapse' : 'Expand'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className={`w-4 h-4 transition-transform duration-200 ${expandedCategories[categoryId] ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openAddModal(categoryId)}
                    className="text-white hover:text-white/80 transition-colors p-1"
                    title="Add Item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {(expandedCategories[categoryId] 
                  ? answersByCategory[categoryId] 
                  : answersByCategory[categoryId].slice(0, 1)
                ).map((answer, idx) => {
                  const itemId = answer._id || `${categoryId}-${idx}`;
                  const isExpanded = expandedItems[itemId];
                  const answerContent = Array.isArray(answer.answer) ? answer.answer.join(', ') : (answer.answer || '<span class="text-gray-400 italic">No answer</span>');
                  const answerText = answerContent.replace(/<[^>]*>/g, ''); // Strip HTML for length check
                  const shouldShowToggle = answerText.length > 100;

                  const isCurrentMedication = getCategoryName(categoryId) === 'Current Medication';

                  return (
                  <div 
                    key={idx} 
                    className={`p-4 flex justify-between group relative ${answer.discontinued ? 'bg-red-50 border-l-4 border-l-red-400' : ''} ${isCurrentMedication ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => {
                        if (isCurrentMedication && user?.surveyResponseId) {
                            setViewingSubmission(user.surveyResponseId);
                            setIsSubmissionExpanded(false);
                        }
                    }}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      {/* Action Buttons - Top Right (Admin & Doctor Only) */}
                      {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && !answer.discontinued && !answer.isLocked && (
                        <div className="float-right flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openEditModal(answer)}
                            className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDiscontinueModal(answer)}
                            className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors"
                            title="Discontinue"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openPrescriptionModal(answer)}
                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                            title={answer.isPrescription ? 'Edit Prescription' : 'Add Prescription'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 15.3m14.8 0 .364 1.456a2.25 2.25 0 0 1-1.516 2.814l-3.553.89c-1.524.381-3.07.381-4.594 0l-3.553-.89a2.25 2.25 0 0 1-1.516-2.814L5 15.3" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {answer.discontinued && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded">
                            DISCONTINUED
                          </span>
                        )}
                        {answer.isPrescription && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 15.3m14.8 0 .364 1.456a2.25 2.25 0 0 1-1.516 2.814l-3.553.89c-1.524.381-3.07.381-4.594 0l-3.553-.89a2.25 2.25 0 0 1-1.516-2.814L5 15.3" />
                            </svg>
                            Rx PRESCRIPTION
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      {isCurrentMedication ? (
                        <div>
                            <div className={`text-sm text-gray-800 ${answer.discontinued ? 'line-through opacity-60' : ''}`}>
                                <span className="font-medium text-gray-500">{answer.questionText}</span>
                                <span className="mx-1 text-gray-400">/</span>
                                <span dangerouslySetInnerHTML={{ __html: answerText }} />
                            </div>
                            
                            <div className="mt-1 text-xs text-gray-500 flex items-center gap-3">
                                {/* Follow Up Status */}
                                {user?.followUpDate && (() => {
                                    const target = new Date(user.followUpDate);
                                    const now = new Date();
                                    const diffTime = target - now;
                                    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    let statusText = `${days} days`;
                                    let colorClass = "";
                                    
                                    if (days < 0) {
                                        statusText = `${Math.abs(days)} days overdue`;
                                        colorClass = "text-red-500 font-medium";
                                    } else if (days <= 3) {
                                        if (days === 0) statusText = "Due today";
                                        else statusText = `${days} days`;
                                        colorClass = "text-orange-600 font-medium";
                                    }

                                    return (
                                        <span>
                                            Follow Up: <span className={colorClass}>{statusText}</span>
                                        </span>
                                    );
                                })()}

                                {/* Divider if both exist */}
                                {user?.followUpDate && user?.refillReminderDate && (
                                    <span className="text-gray-300">|</span>
                                )}

                                {/* Refill Status */}
                                {user?.refillReminderDate && (() => {
                                    const target = new Date(user.refillReminderDate);
                                    const now = new Date();
                                    const diffTime = target - now;
                                    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    let statusText = `${days} days`;
                                    let colorClass = "";
                                    
                                    if (days < 0) {
                                        statusText = `${Math.abs(days)} days overdue`;
                                        colorClass = "text-red-500 font-medium";
                                    } else if (days <= 3) {
                                        if (days === 0) statusText = "Due today";
                                        else statusText = `${days} days`;
                                        colorClass = "text-orange-600 font-medium";
                                    }

                                    return (
                                        <span>
                                            Refills: <span className={colorClass}>{statusText}</span>
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                      ) : (
                        <>
                            <div className="flex items-center gap-2 mb-1">
                                <p className={`text-sm text-gray-500 flex-1 ${answer.discontinued ? 'line-through' : ''}`}>
                                {answer.questionText}
                                </p>
                                {shouldShowToggle && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleItem(itemId);
                                    }}
                                    className="text-teal-600 hover:text-teal-700 transition-colors p-1 flex-shrink-0"
                                    title={isExpanded ? 'Collapse' : 'Expand'}
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                )}
                            </div>
                            <div
                                className={`quill-content break-words overflow-wrap-anywhere ${!isExpanded && shouldShowToggle ? 'line-clamp-2' : ''} ${answer.discontinued ? 'opacity-60 line-through' : ''}`}
                                dangerouslySetInnerHTML={{ __html: answerContent }}
                            />
                        </>
                      )}

                      {/* Prescription Details */}
                      {answer.isPrescription && answer.prescriptionDetails && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-semibold text-purple-900">Medication:</span> {answer.prescriptionDetails.medication}
                            </div>
                            {answer.prescriptionDetails.dosage && (
                              <div>
                                <span className="font-semibold text-purple-900">Dosage:</span> {answer.prescriptionDetails.dosage}
                              </div>
                            )}
                            {answer.prescriptionDetails.frequency && (
                              <div>
                                <span className="font-semibold text-purple-900">Frequency:</span> {answer.prescriptionDetails.frequency}
                              </div>
                            )}
                            {answer.prescriptionDetails.duration && (
                              <div>
                                <span className="font-semibold text-purple-900">Duration:</span> {answer.prescriptionDetails.duration}
                              </div>
                            )}
                            {answer.prescriptionDetails.refills !== undefined && (
                              <div>
                                <span className="font-semibold text-purple-900">Refills:</span> {answer.prescriptionDetails.refills}
                              </div>
                            )}
                            {answer.prescriptionDetails.instructions && (
                              <div className="col-span-2">
                                <span className="font-semibold text-purple-900">Instructions:</span> {answer.prescriptionDetails.instructions}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Added By / Edited By / Discontinued Info */}
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        {answer.addedBy && (
                          <p>
                            <span className="font-medium">Added by:</span> {answer.addedBy.name} ({answer.addedBy.role}) on {new Date(answer.addedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        )}
                        {answer.editedBy && (
                          <p className="text-teal-700">
                            <span className="font-medium">Edited by:</span> {answer.editedBy.name} on {new Date(answer.editedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            {answer.editHistory?.length > 0 && (
                              <button
                                onClick={() => openHistoryModal(answer)}
                                className="ml-2 text-teal-600 hover:text-teal-800 underline font-medium"
                              >
                                View History ({answer.editHistory.length} {answer.editHistory.length === 1 ? 'edit' : 'edits'})
                              </button>
                            )}
                          </p>
                        )}
                        {answer.discontinued && answer.discontinuedBy && (
                          <p className="text-red-600 font-medium">
                            <span className="font-semibold">Discontinued by:</span> {answer.discontinuedBy.name} on {new Date(answer.discontinuedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            <br />
                            <span className="font-semibold">Reason:</span> {answer.discontinueReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDeleteItem(answer._id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete permanently"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(answersByCategory).length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-300 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-gray-500 mb-4">No data recorded for this patient.</p>
              <button
                onClick={() => openAddModal(null)}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
              >
                Add First Record
              </button>
            </div>
          )}


        </div>

        {/* Middle Panel - Create Note Only */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh)] overflow-y-auto pr-2 custom-scrollbar">
           
           {/* Care Plan Status Card */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Care Plan Status
                </h3>
                <button
                  onClick={() => openCarePlanModal()}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="p-4 space-y-3">
                {/* Follow Up */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Next Follow-Up</p>
                            <p className="text-xs text-gray-500">{user?.followUpDate ? new Date(user.followUpDate).toLocaleDateString() : 'Not scheduled'}</p>
                        </div>
                    </div>
                    <div>
                         {(() => {
                            if (!user?.followUpDate) return <span className="text-xs text-gray-400 font-medium">None</span>;
                            const target = new Date(user.followUpDate);
                            const now = new Date();
                            const diffTime = target - now;
                            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            let colorClass = "text-green-600 bg-green-50";
                            let statusText = `${days} days`;

                            if (days < 0) {
                                colorClass = "text-red-600 bg-red-50";
                                statusText = `${Math.abs(days)} days overdue`;
                            } else if (days <= 3) {
                                colorClass = "text-orange-600 bg-orange-50";
                                statusText = `Due in ${days} days`;
                            } else {
                                statusText = `In ${days} days`;
                            }
                            return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>{statusText}</span>;
                         })()} 
                    </div>
                </div>

                {/* Refill */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887.454 3.665 1.257 5.234a.75.75 0 0 1 .044.653C3.52 17.633 1.82 20.25 1.82 20.25a.75.75 0 0 0 .93 1.05c3.219-1.393 5.48-3.09 6.273-4.102A6 6 0 1 0 10 2Zm-1.5 3a.75.75 0 0 1 .75.75v2.24l1.455.772a.75.75 0 1 1-.685 1.346l-1.875-.994a.75.75 0 0 1-.395-.678V5.75a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                              </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Refill Due</p>
                            <p className="text-xs text-gray-500">{user?.refillReminderDate ? new Date(user.refillReminderDate).toLocaleDateString() : 'Not scheduled'}</p>
                        </div>
                    </div>
                    <div>
                        {(() => {
                            if (!user?.refillReminderDate) return <span className="text-xs text-gray-400 font-medium">None</span>;
                            const target = new Date(user.refillReminderDate);
                            const now = new Date();
                            const diffTime = target - now;
                            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            let colorClass = "text-green-600 bg-green-50";
                            let statusText = `${days} days`;

                            if (days < 0) {
                                colorClass = "text-red-600 bg-red-50";
                                statusText = `${Math.abs(days)} days overdue`;
                            } else if (days <= 3) {
                                colorClass = "text-orange-600 bg-orange-50";
                                statusText = `Due in ${days} days`;
                            } else {
                                statusText = `In ${days} days`;
                            }
                            return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>{statusText}</span>;
                         })()}
                    </div>
                </div>
              </div>
           </div>

           {/* Create Note Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-semibold">Create a new note</h3>
              <button 
                onClick={() => setIsCreateNoteExpanded(!isCreateNoteExpanded)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title={isCreateNoteExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2.5} 
                  stroke="currentColor" 
                  className={`w-4 h-4 transition-transform duration-200 ${!isCreateNoteExpanded ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {(isCreateNoteExpanded ? noteTypes : noteTypes.slice(0, 1)).map((noteType) => (
                <button
                  key={noteType.name}
                  onClick={() => openNoteModal(noteType.name)}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">{noteType.icon}</span>
                  <span className="text-sm text-gray-700">{noteType.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <span>❤️</span>
                Vitals
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsVitalsExpanded(!isVitalsExpanded)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title={isVitalsExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${!isVitalsExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <VitalsForm
                vitalsData={vitalsData}
                setVitalsData={setVitalsData}
                compact={!isVitalsExpanded}
              />
              {isVitalsExpanded && (
                <>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSaveVitals}
                      className="w-full px-4 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
                    >
                      Save Vitals
                    </button>
                  </div>
                  
                  {/* Vitals Footer Info */}
                  {vitalsMetadata && (
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                      {vitalsMetadata.createdBy && (
                        <p>
                          <span className="font-medium">Added by:</span> {vitalsMetadata.createdBy.firstName} {vitalsMetadata.createdBy.lastName} ({vitalsMetadata.createdBy.role}) on {new Date(vitalsMetadata.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      )}
                      {vitalsMetadata.updatedBy && (
                        <p className="text-teal-700">
                          <span className="font-medium">Edited by:</span> {vitalsMetadata.updatedBy.firstName} {vitalsMetadata.updatedBy.lastName} on {new Date(vitalsMetadata.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          {vitalsMetadata.changeHistory?.length > 0 && (
                            <button
                              onClick={() => {
                                // Group changes by timestamp (within 2 seconds) and user
                                const groups = [];
                                const history = [...vitalsMetadata.changeHistory].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
                                
                                history.forEach(item => {
                                  const itemTime = new Date(item.changedAt).getTime();
                                  const existingGroup = groups.find(g => 
                                    Math.abs(new Date(g.date).getTime() - itemTime) < 2000 && 
                                    g.user === item.changedBy?._id
                                  );

                                  if (existingGroup) {
                                    existingGroup.changes.push(item);
                                  } else {
                                    groups.push({
                                      date: item.changedAt,
                                      user: item.changedBy?._id,
                                      userData: item.changedBy,
                                      changes: [item]
                                    });
                                  }
                                });
                                // Sort groups descending (Newest first)
                                groups.sort((a, b) => new Date(b.date) - new Date(a.date));

                                // Reconstruct state logic
                                let currentState = { ...vitalsMetadata };
                                const historyWithSnapshots = groups.map(group => {
                                  // The state at the end of this edit is the current running state
                                  const snapshot = { ...currentState };

                                  // Revert changes for the next (older) iteration
                                  group.changes.forEach(change => {
                                    // If we have an oldValue, revert to it. 
                                    // If oldValue is empty string, it means it was empty before.
                                    currentState[change.field] = change.oldValue;
                                  });

                                  return { ...group, snapshot };
                                });

                                // Format each group into an HTML snapshot
                                const formattedHistory = historyWithSnapshots.map(group => {
                                  // Use the reconstructed snapshot values
                                  const values = group.snapshot;

                                  let displayHtml = '<div class="font-mono text-sm space-y-1">';
                                  
                                  // Weight
                                  if (values.weightLbs || values.weightOz) {
                                    displayHtml += `<div><span class="font-bold">WT:</span> ${values.weightLbs || ''} lbs ${values.weightOz || ''} oz</div>`;
                                  }
                                  
                                  // Height
                                  if (values.heightFt || values.heightIn) {
                                    displayHtml += `<div><span class="font-bold">HT:</span> ${values.heightFt || ''}' ${values.heightIn || ''}"</div>`;
                                  }

                                  // BMI
                                  if (values.bmi) displayHtml += `<div><span class="font-bold">BMI:</span> ${values.bmi}</div>`;

                                  // BP - Combined
                                  if (values.bloodPressureSystolic || values.bloodPressureDiastolic) {
                                    displayHtml += `<div><span class="font-bold">BP Sys:</span> ${values.bloodPressureSystolic || '-'} <span class="font-bold ml-2">BP Dys:</span> ${values.bloodPressureDiastolic || '-'}</div>`;
                                  }

                                  // HR
                                  if (values.pulse) displayHtml += `<div><span class="font-bold">HR:</span> ${values.pulse}</div>`;

                                  // RR
                                  if (values.respiratoryRate) displayHtml += `<div><span class="font-bold">RR:</span> ${values.respiratoryRate}</div>`;

                                  // O2
                                  if (values.o2Saturation) displayHtml += `<div><span class="font-bold">O2 Sat:</span> ${values.o2Saturation}%</div>`;

                                  // Blood Sugar / Fasting
                                  if (values.bloodSugar || values.fasting) {
                                    displayHtml += `<div><span class="font-bold">Blood Sugar:</span> ${values.bloodSugar || '-'} <span class="font-bold ml-2">Fasting:</span> ${values.fasting || '-'}</div>`;
                                  }

                                  // Temperature
                                  if (values.temperature) displayHtml += `<div><span class="font-bold">Temp:</span> ${values.temperature}</div>`;
                                  
                                  // Notes
                                  if (values.notes) displayHtml += `<div class="mt-2"><span class="font-bold">Notes:</span> ${values.notes}</div>`;

                                  displayHtml += '</div>';

                                  return {
                                    editedBy: group.userData,
                                    editedAt: group.date,
                                    newAnswer: displayHtml,
                                    previousAnswer: null, // Force "new" view
                                    newQuestionText: "Vitals Update", // Context title
                                    previousQuestionText: "Vitals Update" // No diff for title
                                  };
                                });

                                setViewingHistoryFor({
                                  questionText: "Vitals",
                                  editHistory: formattedHistory
                                });
                                setShowHistoryModal(true);
                              }}
                              className="ml-2 text-teal-600 hover:text-teal-800 underline font-medium"
                            >
                              View History ({vitalsMetadata.changeHistory.length} {vitalsMetadata.changeHistory.length === 1 ? 'edit' : 'edits'})
                            </button>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Timeline, Documents, Status, Actions */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh)] overflow-y-auto pr-2 custom-scrollbar">

          {/* Notes Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <span>⏱️</span>
                Timeline
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title={isTimelineExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${!isTimelineExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
              {(() => {
                const combinedTimeline = [
                  ...surveySubmissions.map(s => ({ ...s, _timelineType: 'submission', _sortDate: new Date(s.createdAt) })),
                  ...notes.map(n => ({ ...n, _timelineType: 'note', _sortDate: new Date(n.createdAt) }))
                ].sort((a, b) => b._sortDate - a._sortDate);

                const itemsDislayed = isTimelineExpanded ? combinedTimeline : combinedTimeline.slice(0, 1);

                if (itemsDislayed.length === 0) {
                   return <p className="text-sm text-gray-500 text-center py-4">No timeline items yet</p>;
                }

                return itemsDislayed.map(item => {
                  if (item._timelineType === 'submission') {
                    const submission = item;
                    const serviceColor = getServiceColor(submission.serviceId?._id);
                    return (
                    <div
                      key={submission._id}
                      className="border-l-4 pl-3 py-1 group cursor-pointer rounded-r-lg transition-colors hover:bg-gray-50"
                      style={{ borderLeftColor: serviceColor }}
                      onClick={() => {
                        setViewingSubmission(submission);
                        setSelectedDoctor(submission.assignedDoctor?._id || "");
                        setFollowUp(submission.followUp || "");
                        setRefillReminder(submission.refillReminder || "");
                        setClinicalMedication(submission.clinicalMedication || "");
                        setClinicalTreatment(submission.clinicalTreatment || "");
                        setProviderNote("");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium" style={{ color: serviceColor }}>Survey Submission</span>
                            {submission.serviceId && (
                              <span
                                className="px-2 py-0.5 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: `${serviceColor}20`,
                                  color: serviceColor
                                }}
                              >
                                {submission.serviceId.name}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              submission.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                              submission.status === 'archived' ? 'bg-red-100 text-red-700' :
                              submission.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {submission.status === 'reviewed' ? 'Approved' : 
                               submission.status === 'archived' ? 'Rejected' : 
                               submission.status === 'closed' ? 'Finished' :
                               'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mt-0.5">
                            {submission.answers?.length || 0} questions answered
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </p>
                          {/* Show Provider Note & Follow Ups in Timeline */ }
                          {(submission.providerNote || submission.followUp || submission.refillReminder) && (
                            <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                              {submission.providerNote && (
                                <div 
                                  className="quill-content !text-xs italic mb-1"
                                  dangerouslySetInnerHTML={{ __html: submission.providerNote }}
                                />
                              )}
                              <div className="flex gap-3 text-gray-500">
                                {submission.followUp && (
                                  <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                                    </svg>
                                    Follow-up: {submission.followUp}
                                  </span>
                                )}
                                {submission.refillReminder && (
                                  <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                      <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887.454 3.665 1.257 5.234a.75.75 0 0 1 .044.653C3.52 17.633 1.82 20.25 1.82 20.25a.75.75 0 0 0 .93 1.05c3.219-1.393 5.48-3.09 6.273-4.102A6 6 0 1 0 10 2Zm-1.5 3a.75.75 0 0 1 .75.75v2.24l1.455.772a.75.75 0 1 1-.685 1.346l-1.875-.994a.75.75 0 0 1-.395-.678V5.75a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                    </svg>
                                    Refill: {submission.refillReminder}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  } else {
                    const note = item;
                    return (
                      <div 
                        key={note._id} 
                        className="relative group"
                      >
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-white group-hover:bg-teal-600 transition-colors"></div>
                        <div className="bg-gray-50 rounded-lg p-3 hover:bg-teal-50/50 transition-colors border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                              {noteTypes.find(t => t.name === note.type)?.icon} {note.type}
                            </span>
                            <div 
                              className="quill-content !text-sm mt-0.5 truncate"
                              dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(note.createdAt).toLocaleDateString()} • {note.createdBy?.firstName || 'Admin'}
                            </p>
                          </div>
                          {/* Delete button removed */}
                        </div>
                      </div>
                      </div>
                    );
                  }
                });
              })()}
            </div>
            </div>
          </div>
          
          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <span>📄</span>
                Documents
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                  {user.documents?.length || 0} files
                </span>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="text-xs text-white font-medium hover:text-white/80 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Upload
                </button>
                <button 
                  onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title={isDocumentsExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${!isDocumentsExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>
            
            {(isDocumentsExpanded ? (user.documents || []) : (user.documents || []).slice(0, 1)).length > 0 ? (
                <div className="p-4 space-y-3">
                  {(isDocumentsExpanded ? user.documents : user.documents.slice(0, 1)).map((doc, idx) => (
                  <a 
                    key={idx}
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
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
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-900 text-sm truncate">{doc.title || doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No documents uploaded.
                </div>
              )
            }
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Role</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Survey Status</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {user.surveyResponseId?.status || 'new'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleResendCredentials}
                disabled={resending}
                className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend Login Credentials"}
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this user?")) {
                    fetch(`/api/users/${params.id}`, { method: "DELETE" })
                      .then(() => router.push("/dashboard/users"));
                  }
                }}
                className="w-full px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isAddModalExpanded}
            dragMomentum={false}
            className={isAddModalExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed top-24 right-6 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden"}
            style={{ cursor: "default" }}
          >
            {/* Modal Header */}
            <div 
              className="px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-move"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {addModalCategory ? `Add ${getCategoryName(addModalCategory)}` : 'Add New Item'}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAddModalExpanded(!isAddModalExpanded)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mr-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {isAddModalExpanded ? (
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
                  onClick={() => { setShowAddModal(false); setIsAddModalExpanded(false); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div 
              className="p-6 space-y-4 overflow-y-auto cursor-default"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {addModalCategory === null && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    onChange={(e) => setAddModalCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                    <option value="uncategorized">General / Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Question / Label
                </label>
                <input
                  type="text"
                  value={newItemQuestion}
                  onChange={(e) => setNewItemQuestion(e.target.value)}
                  placeholder="e.g., Blood Type"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Answer / Value <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                  <RichTextEditor
                    value={newItemAnswer}
                    onChange={setNewItemAnswer}
                    placeholder="e.g., O Positive (Type / for templates)"
                    height="150px"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Add Item
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpload} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                  <select
                    value={selectedDocCategory}
                    onChange={(e) => setSelectedDocCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                  >
                    <option value="">Select a title (or use filename)</option>
                    {documentCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*,application/pdf"
                    />
                    {selectedFile ? (
                      <div className="text-sm text-gray-900 font-medium">
                        {selectedFile.name}
                        <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <p>Click or drag to upload</p>
                        <p className="text-xs mt-1">Images, PDF</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-70 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isNoteModalExpanded}
            dragMomentum={false}
            className={isNoteModalExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed top-24 right-6 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden"}
            style={{ cursor: "default" }}
          >
            <div 
              className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-teal-700 rounded-t-xl cursor-move"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>{noteTypes.find(n => n.name === selectedNoteType)?.icon}</span>
                {selectedNoteType}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsNoteModalExpanded(!isNoteModalExpanded)}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer mr-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {isNoteModalExpanded ? (
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
                  onClick={() => { setShowNoteModal(false); setIsNoteModalExpanded(false); }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div
              className="p-6 cursor-default"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Note Content
              </label>
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                <RichTextEditor
                  value={noteContent}
                  onChange={setNoteContent}
                  placeholder="Type / to use templates..."
                  className="p-4"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setShowNoteModal(false); setIsNoteModalExpanded(false); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="flex-1 px-4 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
                >
                  Save Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Note Modal */}
      <AnimatePresence>
        {viewingNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isViewNoteExpanded}
            dragMomentum={false}
            className={isViewNoteExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed inset-0 m-auto w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden !h-fit"}
            style={{ cursor: "default" }}
          >
            <div 
              className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-teal-700 rounded-t-xl cursor-move"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>{noteTypes.find(n => n.name === viewingNote.type)?.icon}</span>
                {viewingNote.type}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsViewNoteExpanded(!isViewNoteExpanded)}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer mr-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {isViewNoteExpanded ? (
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
                  onClick={() => { setViewingNote(null); setIsViewNoteExpanded(false); }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div 
              className="p-6 cursor-default"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Created by</p>
                <p className="text-sm font-medium text-gray-900">
                  {viewingNote.createdBy?.firstName} {viewingNote.createdBy?.lastName || 'Admin'}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(viewingNote.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Note Content</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900 text-sm quill-content" dangerouslySetInnerHTML={{ __html: viewingNote.content }}>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setViewingNote(null); setIsViewNoteExpanded(false); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => { handleDeleteNote(viewingNote._id); setViewingNote(null); setIsViewNoteExpanded(false); }}
                  className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Submission Modal */}
      <AnimatePresence>
        {viewingSubmission && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isSubmissionExpanded}
            dragMomentum={false}
            className={isSubmissionExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed inset-0 m-auto w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[90vh] overflow-hidden !h-fit"}
            style={{ cursor: "default" }}
          >
            <div 
              className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-purple-700 rounded-t-xl cursor-move"
            >
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  📋 Survey Submission
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {viewingSubmission.serviceId && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white">
                      {viewingSubmission.serviceId.name}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    viewingSubmission.status === 'reviewed' ? 'bg-green-400/20 text-green-100' :
                    viewingSubmission.status === 'archived' ? 'bg-red-400/20 text-red-100' :
                    'bg-yellow-400/20 text-yellow-100'
                  }`}>
                    {viewingSubmission.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsSubmissionExpanded(!isSubmissionExpanded)}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer mr-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {isSubmissionExpanded ? (
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
                  onClick={() => { setViewingSubmission(null); setIsSubmissionExpanded(false); }}
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
              className="p-6 overflow-y-auto flex-1 cursor-default"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {viewingSubmission.status}
                  </p>
                </div>
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    Questions & Answers ({viewingSubmission.answers?.length || 0})
                  </h4>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-8">
                {viewingSubmission.answers?.length > 0 ? (
                  viewingSubmission.answers.map((qa, index) => (
                    <div key={index} className="border-l-4 border-purple-200 pl-4 py-2">
                      <p className="font-medium text-gray-900 mb-1">
                        <span className="text-purple-600 mr-2">Q{index + 1}.</span>
                        {qa.questionText}
                      </p>
                      <div 
                        className="quill-content !text-gray-600 break-words"
                        dangerouslySetInnerHTML={{ __html: Array.isArray(qa.answer) ? qa.answer.join(", ") : (qa.answer || '<span class="text-gray-400 italic">No answer</span>') }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No answers recorded</p>
                )}


                {/* 1. CHAT HISTORY SECTION */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                         </svg>
                        Discussion History
                    </h5>
                    
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                        {/* Legacy Note Display */}
                         {viewingSubmission.providerNote && !viewingSubmission.messages?.length && (
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm">
                                <span className="text-yellow-700 font-semibold text-xs uppercase block mb-1">Legacy Note</span>
                                    <div 
                                        className="quill-content"
                                        dangerouslySetInnerHTML={{ __html: viewingSubmission.providerNote }}
                                    />
                            </div>
                         )}

                        {/* Chat Messages */}
                        {viewingSubmission.messages?.map((msg, idx) => {
                             const isMe = msg.senderId === currentUser?._id; 

                             const isSystem = msg.senderRole === 'system';
                             return (
                                 <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                                         isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                     }`}>
                                         <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                                             <span className="font-semibold">{msg.senderName || 'User'}</span>
                                             <span>•</span>
                                             <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                         </div>
                                          <div 
                                            className="prose prose-sm max-w-none text-inherit"
                                            dangerouslySetInnerHTML={{ __html: msg.text }}
                                          />
                                     </div>
                                 </div>
                             )
                        })}
                        
                         {(!viewingSubmission.messages?.length && !viewingSubmission.providerNote) && (
                            <p className="text-gray-400 text-sm text-center italic">No messages yet.</p>
                         )}
                    </div>
                </div>

                {/* 2. CLINICAL LOGISTICS SECTION (Follow Up / Refill) */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600">
                           <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                        </svg>
                        Clinical Updates
                    </h5>
                     <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                         <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Follow Up</label>
                              <select
                                value={followUp}
                                onChange={(e) => setFollowUp(e.target.value)}
                                disabled={viewingSubmission.status === 'closed'}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                              >
                               <option value="">Select interval</option>
                               {followUpOptions.filter(opt => opt.isActive).map(option => (
                                 <option key={option._id} value={option.name}>{option.name}</option>
                               ))}
                               <option value="None">None</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Refill Reminder</label>
                               <select
                                value={refillReminder}
                                onChange={(e) => setRefillReminder(e.target.value)}
                                disabled={viewingSubmission.status === 'closed'}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                              >
                               <option value="">Select interval</option>
                               {refillReminderOptions.filter(opt => opt.isActive).map(option => (
                                 <option key={option._id} value={option.name}>{option.name}</option>
                               ))}
                               <option value="None">None</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Medication</label>
                              <select
                                value={clinicalMedication}
                                onChange={(e) => setClinicalMedication(e.target.value)}
                                disabled={viewingSubmission.status === 'closed'}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                              >
                               <option value="">Select medication</option>
                               {medicationOptions.filter(opt => opt.isActive).map(option => (
                                 <option key={option._id} value={option.name}>{option.name}</option>
                               ))}
                               <option value="None">None</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Treatment</label>
                              <select
                                value={clinicalTreatment}
                                onChange={(e) => setClinicalTreatment(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                                disabled={(!clinicalMedication || clinicalMedication === 'None') || viewingSubmission.status === 'closed'}
                              >
                               <option value="">Select treatment</option>
                               {(() => {
                                 const selectedMed = medicationOptions.find(m => m.name === clinicalMedication);
                                 // If "None" or not found (and not empty), show nothing or all? 
                                 // If "None" is selected for medication, treatment should explicitly handle it.
                                 // User requirement: "treatment only show parent category subcategory".
                                 if (!selectedMed) return [];

                                 return treatmentOptions
                                   .filter(opt => opt.isActive && opt.medicationId === selectedMed._id)
                                   .map(option => (
                                     <option key={option._id} value={option.name}>{option.name}</option>
                                   ));
                               })()}
                               <option value="None">None</option>
                              </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={async () => {
                                  setActionLoading(true);
                                  try {
                                    await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        followUp,
                                        refillReminder,
                                        clinicalMedication,
                                        clinicalTreatment
                                      }),
                                    });
                                    fetchSurveySubmissions(user._id);
                                    alert("Clinical details updated!");
                                  } catch (e) { alert("Failed to update details"); }
                                  setActionLoading(false);
                                }}
                                disabled={actionLoading || viewingSubmission.status === 'closed'}
                                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Update Clinical Details
                            </button>
                        </div>
                     </div>
                </div>

                {/* 3. MESSAGE COMPOSER (Chat Only) */}
                <div className="mt-6 pt-6 border-t border-gray-100 bg-white">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Send Message</h5>
                    <div className="space-y-4">
                        <div>
                        <div className={`border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all bg-gray-50 ${viewingSubmission.status === 'closed' ? 'opacity-60 pointer-events-none' : ''}`}>
                           <RichTextEditor
                             value={providerNote}
                             onChange={setProviderNote}
                             placeholder="Type / to use templates..."
                             className="p-3"
                           />
                        </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={async () => {
                                  if (!providerNote.trim()) return; // Prevent empty sends
                                  setActionLoading(true);
                                  try {
                                    const payload = {
                                        newMessage: {
                                            senderId: user._id, 
                                            senderName: `${user.firstName} ${user.lastName}`,
                                            senderRole: user.role, 
                                            text: providerNote
                                        }
                                    };

                                    const res = await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(payload),
                                    });
                                    const data = await res.json();
                                    
                                    if (data.success) {
                                        setViewingSubmission(data.data);
                                        fetchSurveySubmissions(user._id);
                                        setProviderNote("");
                                    } else {
                                        alert("Failed to send message");
                                    }
                                  } catch (e) { alert("Failed to send message"); }
                                  setActionLoading(false);
                                }}
                                disabled={actionLoading || viewingSubmission.status === 'closed'}
                                className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send Message
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. ASSIGN DOCTOR (Separate Line Below) */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-end gap-3">
                     <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Assign Doctor to Case</label>
                      <div className="relative">
                          <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
                          >
                            <option value="">-- No Doctor Assigned --</option>
                            {doctors.map(doc => (
                              <option key={doc._id} value={doc._id}>
                                Dr. {doc.firstName} {doc.lastName}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                          </div>
                      </div>
                    </div>
                    <button
                        onClick={async () => {
                           // Save only the doctor
                            try {
                                await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ assignedDoctor: selectedDoctor }),
                                });
                                fetchSurveySubmissions(user._id);
                                alert("Doctor assigned!");
                            } catch (e) { alert("Failed to assign doctor"); }
                        }}
                        disabled={viewingSubmission.status === 'closed'}
                        className="px-4 py-2 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Assign
                    </button>
                </div>


              </div>
            </div>

            {/* Admin Actions Footer - BUTTONS ONLY */}
            <div 
              className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex gap-3">
                 <button
                    onClick={async () => {
                      if (!clinicalMedication) {
                        alert("Please select a valid medication before finishing the task.");
                        return;
                      }

                      const targetCategory = categories.find(c => c.name === "Current Medication");
                      if (!targetCategory) {
                         alert("Category 'Current Medication' not found.");
                         return;
                      }

                      if (!confirm("This will add the medication records to 'Current Medication' and complete the task. This action cannot be undone.")) return;
                      
                      setActionLoading(true);
                      try {
                        const newItem = {
                          questionText: clinicalMedication,
                          answer: `${clinicalTreatment}${refillReminder && refillReminder !== 'None' ? `<br/><span class="text-xs text-gray-400">Refills: ${refillReminder}</span>` : ''}`,
                          categoryId: targetCategory._id,
                          questionId: null,
                          addedBy: {
                            name: `${currentUser.firstName} ${currentUser.lastName}`,
                            role: currentUser.role,
                            id: currentUser._id
                          },
                          addedAt: new Date(),
                          isLocked: true 
                        };

                        const currentAnswers = user.surveyResponseId.answers || [];
                        const updatedAnswers = [newItem, ...currentAnswers];

                        // Update survey response with new answers AND archived status
                        await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                           method: "PUT",
                           headers: { "Content-Type": "application/json" },
                           body: JSON.stringify({ 
                              status: 'closed', 
                              answers: updatedAnswers,
                              // Also save clinical fields
                              assignedDoctor: selectedDoctor,
                              followUp,
                              refillReminder,
                              clinicalMedication,
                              clinicalTreatment,
                              providerNote
                           }),
                        });
                        
                        alert("Task finished and medication added!");
                        setViewingSubmission(null);
                        fetchSurveySubmissions(user._id);
                        fetchData(); // Refresh user data to see new items

                      } catch (error) {
                        console.error(error);
                        alert("Failed to finish task");
                      }
                      setActionLoading(false);
                    }}
                    disabled={actionLoading || viewingSubmission.status === 'closed'}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Finish Task
                 </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setViewingSubmission(null); setIsSubmissionExpanded(false); }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>

                {viewingSubmission.status !== 'archived' && (
                  <button
                    onClick={async () => {
                      setActionLoading(true);
                      try {
                        await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: 'archived' }),
                        });
                        setViewingSubmission(null);
                        fetchSurveySubmissions(user._id);
                      } catch (e) { alert("Failed to reject"); }
                      setActionLoading(false);
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                
                {viewingSubmission.status === 'new' && (
                  <button
                    onClick={async () => {
                      setActionLoading(true);
                      try {
                        // Update submission status
                        await fetch(`/api/survey/responses/${viewingSubmission._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ 
                              status: 'reviewed',
                              assignedDoctor: selectedDoctor,
                              followUp,
                              refillReminder,
                              providerNote
                          }),
                        });
                        // Update user status if needed
                        if (user.accountStatus !== 'active') {
                          await fetch(`/api/users/${user._id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                              accountStatus: 'active',
                              ...(selectedDoctor && { assignedDoctorId: selectedDoctor })
                            }),
                          });
                        }
                        setViewingSubmission(null);
                        fetchSurveySubmissions(user._id);
                        fetchData(); // Refresh user data
                      } catch (e) { alert("Failed to approve"); }
                      setActionLoading(false);
                    }}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
                  >
                    {actionLoading ? "Processing..." : "Approve"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        user={user}
        onSave={handleUpdateUser}
      />
      
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-teal-700 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Edit Patient Data</h3>
              <button
                onClick={closeEditModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <RichTextEditor
                  value={editAnswerContent}
                  onChange={setEditAnswerContent}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discontinue Modal */}
      {showDiscontinueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 bg-orange-600 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Discontinue Item</h3>
              <button
                onClick={closeDiscontinueModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleDiscontinue(); }} className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-800">
                  <strong>Warning:</strong> This item will be marked as discontinued but will remain visible in the patient&apos;s record with a discontinued badge.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Discontinuing <span className="text-red-500">*</span></label>
                <textarea
                  value={discontinueReason}
                  onChange={(e) => setDiscontinueReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                  rows={3}
                  placeholder="Explain why this item is being discontinued..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDiscontinueModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Confirm Discontinue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-purple-600 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 15.3m14.8 0 .364 1.456a2.25 2.25 0 0 1-1.516 2.814l-3.553.89c-1.524.381-3.07.381-4.594 0l-3.553-.89a2.25 2.25 0 0 1-1.516-2.814L5 15.3" />
                </svg>
                {prescriptionAnswer?.isPrescription ? 'Edit Prescription Details' : 'Add Prescription Details'}
              </h3>
              <button
                onClick={closePrescriptionModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddPrescription(); }} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication <span className="text-red-500">*</span></label>
                  <select
                    value={prescriptionData.medication}
                    onChange={(e) => {
                      setPrescriptionData({
                        ...prescriptionData, 
                        medication: e.target.value,
                        treatmentOption: "" // Reset treatment when medication changes
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    required
                  >
                    <option value="">Select Medication</option>
                    {medicationOptions.filter(m => m.isActive).map(med => (
                      <option key={med._id} value={med.name}>{med.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Option</label>
                  <select
                    value={prescriptionData.treatmentOption}
                    onChange={(e) => setPrescriptionData({...prescriptionData, treatmentOption: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={!prescriptionData.medication}
                  >
                    <option value="">Select Treatment</option>
                    {(() => {
                      const selectedMed = medicationOptions.find(m => m.name === prescriptionData.medication);
                      if (!selectedMed) return null;
                      
                      return treatmentOptions
                        .filter(t => t.isActive && t.medicationId === selectedMed._id)
                        .map(treat => (
                          <option key={treat._id} value={treat._id}>{treat.name}</option>
                        ));
                    })()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={prescriptionData.dosage}
                    onChange={(e) => setPrescriptionData({...prescriptionData, dosage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={prescriptionData.frequency}
                    onChange={(e) => setPrescriptionData({...prescriptionData, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={prescriptionData.duration}
                    onChange={(e) => setPrescriptionData({...prescriptionData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    placeholder="e.g., 7 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Refills</label>
                  <input
                    type="number"
                    value={prescriptionData.refills}
                    onChange={(e) => setPrescriptionData({...prescriptionData, refills: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    min="0"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={prescriptionData.instructions}
                    onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                    rows={3}
                    placeholder="e.g., Take with food"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closePrescriptionModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit History Viewer Modal */}
      {showHistoryModal && viewingHistoryFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-teal-700 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Edit History - {viewingHistoryFor.questionText}</h3>
              <button
                onClick={closeHistoryModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {viewingHistoryFor.editHistory && viewingHistoryFor.editHistory.length > 0 ? (
                [...viewingHistoryFor.editHistory].map((edit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        Vitals #{viewingHistoryFor.editHistory.length - index}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {new Date(edit.editedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      by <strong>{edit.editedBy?.name}</strong> ({edit.editedBy?.role})
                    </p>
                    <div className="space-y-2">
                      {edit.previousQuestionText !== edit.newQuestionText && (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">Question:</p>
                          <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{edit.newQuestionText}</p>
                        </div>
                      )}
                      {edit.previousAnswer !== edit.newAnswer && (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">Answer:</p>
                          <div className="text-sm text-gray-900 quill-content break-words" dangerouslySetInnerHTML={{ __html: edit.newAnswer || 'None' }} />
                        </div>
                      )}
                      {/* Generic Field Change Support (for Vitals) */}
                      {edit.field && (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">{edit.field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</p>
                          <p className="text-sm text-gray-900 break-words">{edit.newValue || '(empty)'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No edit history available</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeHistoryModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 bg-blue-600 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Medication</h3>
              <button
                onClick={closeAddMedicationModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddMedication(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Medication <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedMedicationOption}
                  onChange={(e) => setSelectedMedicationOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  required
                >
                  <option value="">Choose a medication...</option>
                  {medicationOptions.filter(opt => opt.isActive).map(opt => (
                    <option key={opt._id} value={opt._id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input
                  type="text"
                  value={medicationData.dosage}
                  onChange={(e) => setMedicationData({...medicationData, dosage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <input
                  type="text"
                  value={medicationData.frequency}
                  onChange={(e) => setMedicationData({...medicationData, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="e.g., Twice daily"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={medicationData.duration}
                  onChange={(e) => setMedicationData({...medicationData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="e.g., 7 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  value={medicationData.instructions}
                  onChange={(e) => setMedicationData({...medicationData, instructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  rows={3}
                  placeholder="e.g., Take with food"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddMedicationModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Treatment Modal */}
      {showAddTreatmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-600 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Treatment</h3>
              <button
                onClick={closeAddTreatmentModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTreatment(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Treatment <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTreatmentOption}
                  onChange={(e) => setSelectedTreatmentOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  required
                >
                  <option value="">Choose a treatment...</option>
                  {treatmentOptions.filter(opt => opt.isActive).map(opt => (
                    <option key={opt._id} value={opt._id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={treatmentData.description}
                  onChange={(e) => setTreatmentData({...treatmentData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  rows={2}
                  placeholder="Treatment description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={treatmentData.startDate}
                    onChange={(e) => setTreatmentData({...treatmentData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={treatmentData.endDate}
                    onChange={(e) => setTreatmentData({...treatmentData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={treatmentData.notes}
                  onChange={(e) => setTreatmentData({...treatmentData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddTreatmentModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      


      {/* Care Plan Modal */}
      {showCarePlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Update Care Plan</h3>
              <button
                onClick={closeCarePlanModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCarePlanSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Follow Up
                </label>
                <select
                  value={carePlanForm.followUpOptionId}
                  onChange={(e) => setCarePlanForm({ ...carePlanForm, followUpOptionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white"
                >
                  <option value="">-- Select Follow Up --</option>
                  {followUpOptions.filter(o => o.isActive).map(option => (
                    <option key={option._id} value={option._id}>
                      {option.name} {option.days > 0 ? `(${option.days} days)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Refill Reminder
                </label>
                <select
                  value={carePlanForm.refillReminderOptionId}
                  onChange={(e) => setCarePlanForm({ ...carePlanForm, refillReminderOptionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white"
                >
                  <option value="">-- Select Refill Reminder --</option>
                  {refillReminderOptions.filter(o => o.isActive).map(option => (
                    <option key={option._id} value={option._id}>
                      {option.name} {option.days > 0 ? `(${option.days} days)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                 <p className="flex gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                     <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                   </svg>
                   Selecting an option will automatically calculate and set the due date starting from today.
                 </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCarePlanModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Slide Menu Drawer */}
      <AnimatePresence>
        {showSlideMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSlideMenu(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 h-screen w-auto"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
