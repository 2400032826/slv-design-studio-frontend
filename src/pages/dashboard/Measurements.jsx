import { useState } from 'react'
import { Ruler, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const measurementFields = [
  { key: 'chest', label: 'Chest / Bust', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'shoulder', label: 'Shoulder Width', unit: 'cm' },
  { key: 'armLength', label: 'Arm Length', unit: 'cm' },
  { key: 'blouseLength', label: 'Blouse Length', unit: 'cm' },
  { key: 'neckDepth', label: 'Neck Depth', unit: 'cm' },
  { key: 'height', label: 'Height', unit: 'cm' },
  { key: 'weight', label: 'Weight', unit: 'kg' },
]

export default function Measurements() {
  const [measurements, setMeasurements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('slv_measurements') || '{}') } catch { return {} }
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('slv_measurements', JSON.stringify(measurements))
    setSaved(true)
    toast.success('Measurements profile saved!')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">My Body Measurements</h2>
      <p className="text-[#64748B] text-xs mb-6 pb-3 border-b border-[#E5E7EB]">Save standard measurement profiles for instant custom fitting requests.</p>

      <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        <div className="flex items-center gap-2 mb-5 text-pink-600 font-semibold text-xs bg-[#FFF5F9] dark:bg-pink-950/30 p-2.5 rounded-xl border border-pink-200">
          <Ruler className="w-4 h-4" />
          <span>All dimensions in centimeters (cm) unless otherwise specified</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {measurementFields.map(({ key, label, unit }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={measurements[key] || ''}
                  onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                  className="input-field pr-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] font-medium">{unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 max-w-lg">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Tailoring Notes</label>
          <textarea
            value={measurements.notes || ''}
            onChange={(e) => setMeasurements({ ...measurements, notes: e.target.value })}
            rows={2}
            className="input-field resize-none"
            placeholder="Describe posture nuances, armhole preferences, or comfort looseness..."
          />
        </div>
        <button onClick={handleSave} className="btn-primary mt-6 text-xs py-3 px-8">
          <Save className="w-4 h-4" /> {saved ? 'Profile Saved! ✓' : 'Save Measurements Profile'}
        </button>
      </div>
    </div>
  )
}
