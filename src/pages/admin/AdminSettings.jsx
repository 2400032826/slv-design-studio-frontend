import { useState } from 'react'
import { Settings, Save, Phone, Mail, Globe, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settings, setSettings] = useState({
    businessName: 'SLV Design Studio',
    tagline: 'Customize Your Style with Premium Embroidery & Printing',
    phone: '+91 9731912413',
    email: 'slvdesignstudio@gmail.com',
    address: 'Bengaluru, Karnataka, India',
    whatsapp: '919731912413',
    freeDeliveryThreshold: 500,
    deliveryCharge: 50,
    gstNumber: '',
    workingHours: 'Mon–Sat: 9AM–8PM | Sun: 10AM–5PM',
  })

  const handleSave = () => {
    localStorage.setItem('slv_settings', JSON.stringify(settings))
    toast.success('Settings saved!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="p-6 max-w-2xl space-y-6">
          {/* Business Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gold-500" /> Business Information
            </h2>
            <div className="space-y-4">
              {[
                { key: 'businessName', label: 'Business Name' },
                { key: 'tagline', label: 'Tagline' },
                { key: 'phone', label: 'Phone', icon: Phone },
                { key: 'email', label: 'Email', icon: Mail },
                { key: 'whatsapp', label: 'WhatsApp Number (digits only)' },
                { key: 'address', label: 'Address' },
                { key: 'gstNumber', label: 'GST Number (optional)' },
                { key: 'workingHours', label: 'Working Hours', icon: Clock },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input
                    type="text"
                    value={settings[key]}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Delivery Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free Delivery Threshold (₹)</label>
                <input type="number" value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Standard Delivery Charge (₹)</label>
                <input type="number" value={settings.deliveryCharge}
                  onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })} className="input-field" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
