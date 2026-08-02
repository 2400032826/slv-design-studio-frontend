import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-hero py-16">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Get In <span className="text-gradient-gold">Touch</span>
          </motion.h1>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { Icon: Phone, label: 'Phone', value: '+91 9731912413', href: 'tel:+919731912413', color: 'text-green-500' },
                  { Icon: Mail, label: 'Email', value: 'slvdesignstudio@gmail.com', href: 'mailto:slvdesignstudio@gmail.com', color: 'text-blue-500' },
                  { Icon: MapPin, label: 'Location', value: 'Karnataka, India', href: null, color: 'text-red-500' },
                  { Icon: Clock, label: 'Hours', value: 'Mon-Sat: 9AM-8PM | Sun: 10AM-5PM', href: null, color: 'text-gold-500' },
                ].map(({ Icon, label, value, href, color }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                      {href ? (
                        <a href={href} className={`font-medium mt-0.5 ${color} hover:underline`}>{value}</a>
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white mt-0.5">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919731912413?text=Hello! I would like to know more about your services."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <input {...register('name', { required: 'Name required' })} className="input-field" placeholder="Your name" />
                    {errors.name && <p className="text-pink-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input {...register('phone')} className="input-field" placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field" placeholder="your@email.com" />
                  {errors.email && <p className="text-pink-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select {...register('subject')} className="input-field">
                    <option>General Inquiry</option>
                    <option>Custom Order</option>
                    <option>Order Status</option>
                    <option>Pricing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                  <textarea {...register('message', { required: 'Message required', minLength: { value: 10, message: 'Min 10 characters' } })}
                    rows={5} className="input-field resize-none" placeholder="Tell us about your requirements..." />
                  {errors.message && <p className="text-pink-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-4">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Google Map placeholder */}
        <motion.div
          className="mt-12 rounded-2xl overflow-hidden h-80 bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gold-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">SLV Design Studio, Karnataka, India</p>
            <a href="https://maps.google.com/?q=Karnataka,India" target="_blank" rel="noopener noreferrer" className="btn-gold mt-4 inline-flex text-sm">
              View on Google Maps
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
