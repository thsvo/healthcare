"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "@/components/Editor/RichTextEditor";


export default function QuickResponsesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/quick-responses");
      const data = await res.json();
      if (data.success) setTemplates(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content) return;

    const payload = {
      title,
      category,
      content,
    };

    try {
      const url = editingTemplate 
        ? `/api/quick-responses/${editingTemplate._id}` 
        : "/api/quick-responses";
      
      const res = await fetch(url, {
        method: editingTemplate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchTemplates();
        resetForm();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/quick-responses/${id}`, { method: "DELETE" });
      if (res.ok) fetchTemplates();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setTitle("");
    setCategory("General");
    setContent("");
  };

  const openEdit = (template) => {
    setEditingTemplate(template);
    setTitle(template.title);
    setCategory(template.category);
    setContent(template.content);
    setShowModal(true);
  };

  if (loading) return <div className="p-6 text-center">Loading templates...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Quick Responses</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-primary text-secondary font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{template.title}</h3>
                <span className="text-xs bg-muted text-gray-600 px-2 py-1 rounded-full">{template.category}</span>
              </div>
              <div 
                className="text-sm text-gray-600 line-clamp-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
              <button 
                onClick={() => openEdit(template)}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.318.319-.692.567-1.103.728l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v10.519A2.75 2.75 0 0 0 4.75 19h10.5a2.75 2.75 0 0 0 2.75-2.75V10A.75.75 0 0 0 16.5 10v6.25c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25V5.75Z" />
                </svg>
              </button>
              <button 
                onClick={() => handleDelete(template._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4H4.75a.75.75 0 0 0 0 1.5h.252l.351 10.031A2.75 2.75 0 0 0 8.096 18h3.808a2.75 2.75 0 0 0 2.743-2.469L15 5.5h.25a.75.75 0 0 0 0-1.5H14v-.25A2.75 2.75 0 0 0 11.25 1h-2.5ZM8 4h4v-.25a1.25 1.25 0 0 0-1.25-1.25h-2.5A1.25 1.25 0 0 0 8 3.75V4Zm-2.5 1.5h9l-.348 9.94a1.25 1.25 0 0 1-1.247 1.122H8.096a1.25 1.25 0 0 1-1.247-1.122L5.5 5.5Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{editingTemplate ? "Edit Template" : "New Template"}</h2>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Welcome Message"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="General">General</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Lab Results">Lab Results</option>
                      <option value="Billing">Billing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your template content here..."
                    height="300px"
                  />
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-secondary font-bold rounded-lg hover:opacity-90"
                >
                  Save Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
