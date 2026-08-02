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
    toast.success('Measurements saved!')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">My Measurements</h2>
      <p className="text-gray-400 text-sm mb-6">Save your measurements for faster custom ordering</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-5 text-gold-500">
          <Ruler className="w-5 h-5" />
          <span className="font-semibold text-sm">All measurements in centimeters (cm) unless noted</span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {measurementFields.map(({ key, label, unit }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={measurements[key] || ''}
                  onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                  className="input-field pr-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea
            value={measurements.notes || ''}
            onChange={(e) => setMeasurements({ ...measurements, notes: e.target.value })}
            rows={2}
            className="input-field resize-none"
            placeholder="Any special notes about your body type or preferences..."
          />
        </div>
        <button onClick={handleSave} className="btn-primary mt-5">
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Measurements'}
        </button>
      </div>
    </div>
  )
}
