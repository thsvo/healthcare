"use client";

export default function VitalsForm({ vitalsData, setVitalsData, vitalsHistory, showHistory, setShowHistory }) {
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

      {/* Show History Button */}
      {vitalsHistory && vitalsHistory.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            {showHistory ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
                Hide Change History
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                View Change History ({vitalsHistory.length} changes)
              </>
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {vitalsHistory.map((change, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-medium text-gray-900">
                    {change.field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-gray-600 mt-1">
                    <span className="line-through">{change.oldValue || '(empty)'}</span>
                    {' → '}
                    <span className="font-medium">{change.newValue || '(empty)'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Changed by {change.changedBy?.firstName} {change.changedBy?.lastName} ({change.changedBy?.role})
                    {' on '}
                    {new Date(change.changedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
