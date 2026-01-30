"use client";

export default function VitalsForm({ vitalsData, setVitalsData, vitalsHistory, showHistory, setShowHistory, compact = false }) {
  const handleChange = (field, value) => {
    setVitalsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Weight Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="lbs"
                value={vitalsData.weightLbs}
                onChange={(e) => handleChange('weightLbs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="oz"
                value={vitalsData.weightOz}
                onChange={(e) => handleChange('weightOz', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (F)</label>
          <input
            type="text"
            placeholder="°F"
            value={vitalsData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
          />
        </div>
      </div>

      {!compact && (
        <>
          {/* Height and BMI Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="ft"
                    value={vitalsData.heightFt}
                    onChange={(e) => handleChange('heightFt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="in"
                    value={vitalsData.heightIn}
                    onChange={(e) => handleChange('heightIn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <input
                type="text"
                placeholder="BMI"
                value={vitalsData.bmi}
                onChange={(e) => handleChange('bmi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Blood Pressure Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (Systolic) mmHg</label>
              <input
                type="text"
                placeholder="Systolic"
                value={vitalsData.bloodPressureSystolic}
                onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (Diastolic) mmHg</label>
              <input
                type="text"
                placeholder="Diastolic"
                value={vitalsData.bloodPressureDiastolic}
                onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Respiratory Rate, Pulse, Blood Sugar Section */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (RPM)</label>
              <input
                type="text"
                placeholder="RPM"
                value={vitalsData.respiratoryRate}
                onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (BPM)</label>
              <input
                type="text"
                placeholder="BPM"
                value={vitalsData.pulse}
                onChange={(e) => handleChange('pulse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar</label>
              <input
                type="text"
                placeholder="mg/dL"
                value={vitalsData.bloodSugar}
                onChange={(e) => handleChange('bloodSugar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Fasting and O2 Saturation Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fasting</label>
              <select
                value={vitalsData.fasting}
                onChange={(e) => handleChange('fasting', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O2 Saturation (%)</label>
              <input
                type="text"
                placeholder="%"
                value={vitalsData.o2Saturation}
                onChange={(e) => handleChange('o2Saturation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Additional notes..."
              value={vitalsData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              rows={3}
            />
          </div>

        </>
      )}
    </div>
  );
}
