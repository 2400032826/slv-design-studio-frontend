import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react'
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
    setLoading(true)
    try {
      const { data } = await api.post('/auth/admin-login', form)
      dispatch(adminLoginSuccess(data))
      toast.success('Welcome, Admin! 👑')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(rgba(201,168,76,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md relative z-10">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-royal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-pink">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/60 text-sm mt-1">SLV Design Studio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="admin@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-gold text-purple-900 font-bold rounded-xl hover:shadow-gold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin mx-auto" /> : 'Login to Admin Panel'}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">Authorized personnel only</p>
        </div>
      </motion.div>
    </div>
  )
}
