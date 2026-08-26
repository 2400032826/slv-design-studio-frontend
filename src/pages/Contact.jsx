import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Sparkles } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/contact', data)
      toast.success('Message sent successfully! We will contact you soon.')
      reset()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-slate-800 py-16 text-center shadow-subtle">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 badge badge-soft text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Connect with Atelier</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white">
            Get In <span className="text-gradient-pink">Touch With Us</span>
          </motion.h1>
          <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Have a custom blouse pattern or embroidery project? We are ready to assist you.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-6">Atelier Studio Details</h2>
              <div className="space-y-3.5">
                {[
                  { Icon: MessageCircle, label: 'WhatsApp Support', value: '+91 9731912413 (Chat)', href: 'https://wa.me/919731912413' },
                  { Icon: Mail, label: 'Studio Email', value: 'slvfashionstudiio@gmail.com', href: 'mailto:slvfashionstudiio@gmail.com' },
                  { Icon: MapPin, label: 'Boutique Location', value: 'Karnataka, India', href: 'https://maps.google.com/?q=Karnataka,India' },
                  { Icon: Clock, label: 'Studio Timings', value: 'Mon-Sat: 9AM-8PM | Sun: 10AM-5PM', href: null },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-5 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E8EAF0] dark:border-slate-800 shadow-card hover:border-pink-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1F6] dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 flex items-center justify-center text-pink-500 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-xs sm:text-sm font-bold text-[#252A34] dark:text-white hover:text-pink-600 transition-colors mt-0.5 block">{value}</a>
                      ) : (
                        <p className="text-xs sm:text-sm font-bold text-[#252A34] dark:text-white mt-0.5">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons: WhatsApp & Get Directions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <a
                  href="https://wa.me/919731912413?text=Hello! I would like to consult with SLV Fashion Studio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-soft"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Consultation
                </a>
                <a
                  href="https://maps.google.com/?q=Karnataka,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl transition-colors shadow-soft"
                >
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-card border border-[#E8EAF0] dark:border-slate-800">
              <h2 className="font-display text-xl font-bold text-[#252A34] dark:text-white mb-6 pb-2 border-b border-[#E8EAF0] dark:border-slate-700">Send Us an Inquiry</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-gray-300 mb-1">Full Name *</label>
                    <input {...register('name', { required: 'Name required' })} className="input-field" placeholder="Your name" />
                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-gray-300 mb-1">Phone Number</label>
                    <input {...register('phone')} className="input-field" placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-gray-300 mb-1">Email Address *</label>
                  <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field" placeholder="your@email.com" />
                  {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-gray-300 mb-1">Inquiry Topic</label>
                  <select {...register('subject')} className="input-field">
                    <option>Computer Embroidery Inquiry</option>
                    <option>Custom Bridal Blouse Stitching</option>
                    <option>Men's Garment Customization</option>
                    <option>Apparel Printing / DTF</option>
                    <option>Bulk / Corporate Branding</option>
                    <option>Order Status Update</option>
                    <option>Other Requirements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-gray-300 mb-1">Your Message *</label>
                  <textarea {...register('message', { required: 'Message required', minLength: { value: 10, message: 'Min 10 characters' } })}
                    rows={4} className="input-field resize-none" placeholder="Describe your design specifications or event deadlines..." />
                  {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-xs font-bold shadow-pink-glow">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Atelier Inquiry</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map card */}
        <motion.div
          className="mt-12 rounded-3xl overflow-hidden h-64 bg-white dark:bg-[#1F2937] flex items-center justify-center border border-[#E8EAF0] dark:border-slate-800 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F6] border border-pink-100 flex items-center justify-center mx-auto mb-3 text-pink-500">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#252A34] dark:text-white">SLV Women's Fashion Studio</p>
            <p className="text-xs text-[#64707D] mt-0.5">Karnataka, India</p>
            <a href="https://maps.google.com/?q=Karnataka,India" target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 inline-flex text-xs py-2 px-6 font-bold shadow-soft">
              <MapPin className="w-3.5 h-3.5" /> Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
