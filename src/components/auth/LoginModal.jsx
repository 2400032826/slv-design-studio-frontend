import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Mail, User, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { hideLogin, loginSuccess } from '../../store/slices/authSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import OTPVerification from './OTPVerification'

export default function LoginModal() {
  const dispatch = useDispatch()
  const { showLoginModal } = useSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState('email')
  const [loading, setLoading] = useState(false)
  const [coldStartNotice, setColdStartNotice] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    let timer
    if (loading) {
      // If request takes longer than 2.5 seconds, display Render cold-start explanation
      timer = setTimeout(() => setColdStartNotice(true), 2500)
    } else {
      setColdStartNotice(false)
    }
    return () => clearTimeout(timer)
  }, [loading])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (loading) return // Guard against double clicks
    if (!email) return toast.error('Please enter your email address')
    if (isNewUser && !name.trim()) return toast.error('Please enter your full name')

    setLoading(true)
    setColdStartNotice(false)
    try {
      const { data } = await api.post('/auth/send-otp', {
        email: email.trim(),
        name: name.trim() || undefined,
      })

      // New user detected and name hasn't been provided yet
      if (data.requiresName) {
        setIsNewUser(true)
        toast.custom(
          (t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-purple-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-gold-500/50`}>
              <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span className="text-sm font-medium">Welcome! Please enter your name to register.</span>
            </div>
          ),
          { duration: 4000 }
        )
        return
      }

      setIsNewUser(!!data.isNewUser)
      setStep('otp')
      toast.success(data.message || 'OTP sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerified = (userData) => {
    dispatch(loginSuccess(userData))
    toast.success(`Welcome${userData.user?.name ? ', ' + userData.user.name : ''}! 🎉`)
  }

  const handleClose = () => {
    if (loading) return // Don't allow closing mid-request
    dispatch(hideLogin())
    setStep('email')
    setEmail('')
    setName('')
    setIsNewUser(false)
    setColdStartNotice(false)
  }

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-hero p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(201,168,76,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <button
                onClick={handleClose}
                disabled={loading}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-purple-900 font-display font-bold text-2xl">S</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">SLV Women's Fashion Studio</h2>
                <p className="text-white/70 text-sm mt-1">
                  {step === 'email' ? (isNewUser ? 'Create Your Account' : 'Login or Create Account') : 'Verify Your Email'}
                </p>
              </div>
            </div>

            <div className="p-8">
              {step === 'email' ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-11"
                        placeholder="your@email.com"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isNewUser && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field pl-11"
                            placeholder="Enter your full name"
                            disabled={loading}
                            autoFocus
                            required={isNewUser}
                          />
                        </div>
                        <p className="text-xs text-gold-600 dark:text-gold-400 mt-1.5 flex items-center gap-1 font-medium">
                          <Sparkles className="w-3.5 h-3.5" /> New account detected — please enter your name
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cold start / loading notification banner */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl space-y-1.5"
                      >
                        <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-semibold">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
                          <span>Generating & Sending OTP...</span>
                        </div>
                        {coldStartNotice && (
                          <p className="text-xs text-center text-amber-700/90 dark:text-amber-300/80 leading-relaxed font-medium pt-1 border-t border-amber-200/60 dark:border-amber-800/40">
                            ⚡ Please wait, the server is starting up. This may take up to 30–60 seconds on the first request.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Request...</span>
                      </div>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> {isNewUser ? 'Create Account & Send OTP' : 'Send OTP'} <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    No password needed — login securely with OTP!
                  </p>
                </form>
              ) : (
                <OTPVerification email={email} name={name} onVerified={handleVerified} onBack={() => setStep('email')} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
