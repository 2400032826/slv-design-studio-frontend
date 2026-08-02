import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../store/slices/authSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Save, User, Phone, Mail, Camera } from 'lucide-react'

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
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        {/* Avatar section */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-royal rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl shadow-pink">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800">
                <Camera className="w-3 h-3 text-purple-900" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-green-500 text-xs font-medium">Email Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Full Name</span>
              </label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Your full name" />
              {errors.name && <p className="text-pink-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email Address</span>
              </label>
              <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-700" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed for security reasons</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> Phone Number</span>
              </label>
              <input {...register('phone', {
                pattern: { value: /^[+]?[\d\s-]{10,15}$/, message: 'Invalid phone number' }
              })} className="input-field" placeholder="+91 XXXXXXXXXX" />
              {errors.phone && <p className="text-pink-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
