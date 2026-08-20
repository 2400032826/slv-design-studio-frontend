import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, Shield, Loader2, Sparkles } from 'lucide-react'
import { adminLoginSuccess } from '../../store/slices/authSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/admin-login', form)
      dispatch(adminLoginSuccess(data))
      toast.success('Welcome, Studio Admin! ✨')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-[#1F2937] p-8 sm:p-10 rounded-3xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
          <div className="text-center mb-8">
            <img
              src="/slv-logo.png"
              alt="SLV Women's Fashion Studio"
              className="w-16 h-16 rounded-full object-contain mx-auto mb-4 shadow-soft"
            />
            <span className="badge badge-soft text-[10px] uppercase font-bold tracking-widest mb-1.5 inline-block">Management Portal</span>
            <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-white">Studio Admin</h1>
            <p className="text-[#64748B] dark:text-charcoal-400 text-xs mt-1">SLV Women's Fashion Studio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10 text-xs"
                  placeholder="admin@slvstudio.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10 text-xs"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-pink-600 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-xs font-bold shadow-pink-glow mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-[#94A3B8] text-[11px] mt-6">Authorized studio administrators only</p>
        </div>
      </motion.div>
    </div>
  )
}
