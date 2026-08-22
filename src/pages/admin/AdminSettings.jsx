import { useState } from 'react'
import { Settings, Save, Phone, Mail, Globe, Clock, Sparkles, Menu } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
  const [settings, setSettings] = useState({
    businessName: "SLV Women's Fashion Studio",
    tagline: 'Crafting Bespoke Embroidery & Haute Tailoring for Discerning Women',
    phone: '+91 9731912413',
    email: 'slvfashionstudiio@gmail.com',
    address: 'Bengaluru, Karnataka, India',
    whatsapp: '919731912413',
    freeDeliveryThreshold: 500,
    deliveryCharge: 50,
    gstNumber: '',
    workingHours: 'Mon–Sat: 9AM–8PM | Sun: 10AM–5PM',
  })

  const handleSave = () => {
    localStorage.setItem('slv_settings', JSON.stringify(settings))
    toast.success('Studio configuration saved!')
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 min-w-0 transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 text-[#64748B] md:hidden transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white truncate">Studio System Settings</h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-2xl space-y-6">
          {/* Business Info */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
            <h2 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-5 flex items-center gap-2">
              <Settings className="w-4 h-4 text-pink-500" /> Business & Contact Profile
            </h2>
            <div className="space-y-4">
              {[
                { key: 'businessName', label: 'Boutique Business Name' },
                { key: 'tagline', label: 'Studio Tagline' },
                { key: 'phone', label: 'Primary Contact Phone', icon: Phone },
                { key: 'email', label: 'Studio Email', icon: Mail },
                { key: 'whatsapp', label: 'WhatsApp Number (with country code)' },
                { key: 'address', label: 'Atelier Address' },
                { key: 'gstNumber', label: 'GST Number (optional)' },
                { key: 'workingHours', label: 'Operational Working Hours', icon: Clock },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">{label}</label>
                  <input
                    type="text"
                    value={settings[key]}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
            <h2 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-5">Shipping & Threshold Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Free Delivery Threshold (₹)</label>
                <input type="number" value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })} className="input-field text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Standard Delivery Charge (₹)</label>
                <input type="number" value={settings.deliveryCharge}
                  onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })} className="input-field text-xs" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full py-3.5 text-xs font-bold shadow-pink-glow">
            <Save className="w-4 h-4" /> Save Studio Settings
          </button>
        </div>
      </div>
    </div>
  )
}
