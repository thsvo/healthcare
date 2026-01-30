import { useState, useEffect } from "react";

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    sex: "",
    birthday: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        sex: user.sex || "",
        birthday: user.birthday || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        height: user.height || "",
        weight: user.weight || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-teal-700 text-white flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  />
                </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 5'10&quot;"
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                   placeholder="e.g. 150lbs"
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
              </div>
             </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm mb-2"
                placeholder="Street Address"
              />
              <div className="grid grid-cols-3 gap-2">
                 <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
                 <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
                 <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Zip"
                  className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
