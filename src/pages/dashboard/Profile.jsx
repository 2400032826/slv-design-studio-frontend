import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../store/slices/authSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Save, User, Phone, Mail, Camera, CheckCircle2 } from 'lucide-react'

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', data)
      dispatch(updateUser(res.data.user))
      toast.success('Profile updated successfully!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-6 pb-3 border-b border-[#E5E7EB]">My Profile Settings</h2>
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        {/* Avatar section */}
        <div className="p-6 border-b border-[#E5E7EB] dark:border-charcoal-800 bg-[#F5F7FA]/50 dark:bg-charcoal-900/30">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl shadow-soft">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#1F2937] dark:text-white">{user?.name}</h3>
              <p className="text-[#64748B] dark:text-charcoal-400 text-xs mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-emerald-600 text-xs font-semibold">Email Verified Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-pink-500" /> Full Name</span>
              </label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Your full name" />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-pink-500" /> Email Address</span>
              </label>
              <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed bg-[#F5F7FA] dark:bg-charcoal-800" />
              <p className="text-[11px] text-[#94A3B8] mt-1">Email is verified for authentication and order alerts</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-pink-500" /> Phone Number</span>
              </label>
              <input {...register('phone', {
                pattern: { value: /^[+]?[\d\s-]{10,15}$/, message: 'Invalid phone number' }
              })} className="input-field" placeholder="+91 XXXXXXXXXX" />
              {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3 text-xs font-bold">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> Save Profile Details</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
