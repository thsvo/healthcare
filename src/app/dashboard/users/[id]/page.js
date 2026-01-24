"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  
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
  const [actionLoading, setActionLoading] = useState(false);

  // Expansion states
  const [isAddModalExpanded, setIsAddModalExpanded] = useState(false);
  const [isNoteModalExpanded, setIsNoteModalExpanded] = useState(false);
  const [isViewNoteExpanded, setIsViewNoteExpanded] = useState(false);
  const [isSubmissionExpanded, setIsSubmissionExpanded] = useState(false);
  
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

  const fetchData = async () => {
    try {
      const [userRes, categoriesRes, questionsRes, notesRes, doctorsRes] = await Promise.all([
        fetch(`/api/users/${params.id}`),
        fetch("/api/categories"),
        fetch("/api/survey/questions"),
        fetch(`/api/users/${params.id}/notes`),
        fetch("/api/doctors"),
      ]);
      
      const userData = await userRes.json();
      const categoriesData = await categoriesRes.json();
      const questionsData = await questionsRes.json();
      const notesData = await notesRes.json();
      const doctorsData = await doctorsRes.json();
      
      if (userData.success) {
        setUser(userData.data);
        // Fetch survey submissions for this user
        fetchSurveySubmissions(userData.data._id);
      }
      if (categoriesData.success) setCategories(categoriesData.data);
      if (questionsData.success) setQuestions(questionsData.data);
      if (notesData.success) setNotes(notesData.data);
      if (doctorsData.success) setDoctors(doctorsData.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
    if (!newItemQuestion.trim() || !newItemAnswer.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    if (!user.surveyResponseId) {
      alert("No survey response record exists for this user.");
      return;
    }

    const newItem = {
      questionText: newItemQuestion,
      answer: newItemAnswer,
      categoryId: addModalCategory !== 'uncategorized' ? addModalCategory : null,
      questionId: null, // Custom item
    };

    const currentAnswers = user.surveyResponseId.answers || [];
    const updatedAnswers = [...currentAnswers, newItem];
    
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
    
    return grouped;
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === 'uncategorized') return 'General';
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'General';
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
      {/* Back Button */}
      <Link href="/dashboard/users" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Users
      </Link>

      {/* Patient Header - EHR Style */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Registered: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleResendCredentials}
            disabled={resending}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Credentials"}
          </button>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-white/60 block">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div>
            <span className="text-white/60 block">Phone</span>
            <span className="font-medium">{user.phone || '-'}</span>
          </div>
          <div>
            <span className="text-white/60 block">Company</span>
            <span className="font-medium">{user.company || '-'}</span>
          </div>
          <div>
            <span className="text-white/60 block">Sex</span>
            <span className="font-medium">{user.sex || '-'}</span>
          </div>
          <div>
            <span className="text-white/60 block">Birthday</span>
            <span className="font-medium">
              {user.birthday ? new Date(user.birthday).toLocaleDateString() : '-'}
            </span>
          </div>
          <div>
            <span className="text-white/60 block">Location</span>
            <span className="font-medium">{user.city}, {user.state}</span>
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="text-white/60 block">Address</span>
            <span className="font-medium truncate block" title={`${user.address || ''} ${user.addressLine2 || ''}`}>
              {user.address || '-'} {user.addressLine2 || ''}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Categories & Answers */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Uploaded Documents
              </h3>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {user.documents?.length || 0} files
              </span>
            </div>
            
            {user.documents?.length > 0 ? (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.documents.map((doc, idx) => (
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
                      <p className="font-medium text-gray-900 text-sm truncate">{doc.name}</p>
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
            )}
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
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  {getCategoryName(categoryId)}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {answersByCategory[categoryId].length} items
                  </span>
                  <button
                    onClick={() => openAddModal(categoryId)}
                    className="text-primary hover:text-primary/80 text-sm font-medium ml-2 flex items-center gap-1"
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {answersByCategory[categoryId].map((answer, idx) => (
                  <div key={idx} className="p-4 flex justify-between group">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{answer.questionText}</p>
                      <p className="text-gray-900 font-medium">
                        {Array.isArray(answer.answer) 
                          ? answer.answer.join(', ') 
                          : answer.answer || <span className="text-gray-400 italic">No answer</span>}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(answer._id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(answersByCategory).length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No survey answers recorded.</p>
            </div>
          )}
        </div>

        {/* Right Panel - Quick Info */}
        <div className="space-y-4">
          {/* Status Card */}
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

          {/* Create Note Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-teal-700 text-white">
              <h3 className="font-semibold">Create a new note</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {noteTypes.map((noteType) => (
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

          {/* Notes Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Timeline
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Survey Submissions */}
              {surveySubmissions.map((submission) => (
                <div 
                  key={submission._id} 
                  className={`border-l-2 pl-3 py-1 group cursor-pointer rounded-r-lg transition-colors ${
                    submission.status === 'reviewed' ? 'border-green-400 hover:bg-green-50' :
                    submission.status === 'archived' ? 'border-red-300 hover:bg-red-50' :
                    'border-purple-300 hover:bg-purple-50'
                  }`}
                  onClick={() => setViewingSubmission(submission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-purple-700 font-medium">Survey Submission</span>
                        {submission.serviceId && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {submission.serviceId.name}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          submission.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                          submission.status === 'archived' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {submission.status === 'reviewed' ? 'Approved' : 
                           submission.status === 'archived' ? 'Rejected' : 
                           'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mt-0.5">
                        {submission.answers?.length || 0} questions answered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Notes */}
              {notes.length === 0 && surveySubmissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No timeline items yet</p>
              ) : (
                notes.map((note) => (
                  <div 
                    key={note._id} 
                    className="border-l-2 border-teal-200 pl-3 py-1 group cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
                    onClick={() => setViewingNote(note)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-teal-700 font-medium">{note.type}</p>
                        <p className="text-sm text-gray-900 mt-0.5 truncate">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleDateString()} • {note.createdBy?.firstName || 'Admin'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
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
                  Answer / Value
                </label>
                <textarea
                  value={newItemAnswer}
                  onChange={(e) => setNewItemAnswer(e.target.value)}
                  placeholder="e.g., O Positive"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                />
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
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter your note here..."
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowNoteModal(false)}
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isViewNoteExpanded}
            dragMomentum={false}
            className={isViewNoteExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed top-24 right-6 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden"}
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
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900 text-sm whitespace-pre-wrap">
                  {viewingNote.content}
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag={!isSubmissionExpanded}
            dragMomentum={false}
            className={isSubmissionExpanded ? "fixed inset-0 z-50 bg-white flex flex-col" : "fixed top-24 right-6 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[80vh] overflow-hidden"}
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
              
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                Questions & Answers ({viewingSubmission.answers?.length || 0})
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {viewingSubmission.answers?.length > 0 ? (
                  viewingSubmission.answers.map((qa, index) => (
                    <div key={index} className="border-l-4 border-purple-200 pl-4 py-2">
                      <p className="font-medium text-gray-900 mb-1">
                        <span className="text-purple-600 mr-2">Q{index + 1}.</span>
                        {qa.questionText}
                      </p>
                      <p className="text-gray-600">
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
            
            {/* Admin Actions Footer */}
            <div 
              className="p-4 border-t border-gray-100 bg-gray-50"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                {/* Assign Doctor */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Assign Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Doctor...</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setViewingSubmission(null); setIsSubmissionExpanded(false); }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
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
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
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
                            body: JSON.stringify({ status: 'reviewed' }),
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {actionLoading ? "Processing..." : "Approve"}
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
