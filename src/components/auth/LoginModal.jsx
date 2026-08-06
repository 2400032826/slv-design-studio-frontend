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
      timer = setTimeout(() => setColdStartNotice(true), 2500)
    } else {
      setColdStartNotice(false)
    }
    return () => clearTimeout(timer)
  }, [loading])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!email) return toast.error('Please enter your email address')
    if (isNewUser && !name.trim()) return toast.error('Please enter your full name')

    setLoading(true)
    setColdStartNotice(false)
    try {
      const { data } = await api.post('/auth/send-otp', {
        email: email.trim(),
        name: name.trim() || undefined,
      })

      if (data.requiresName) {
        setIsNewUser(true)
        toast.custom(
          (t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-black text-white px-4 py-3 shadow-card flex items-center gap-2 border border-gold-500`}>
              <Sparkles className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span className="text-xs font-semibold">Welcome! Please enter your full name to register.</span>
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
    if (loading) return
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-charcoal-900 overflow-hidden shadow-card border border-[#EAEAEA] dark:border-charcoal-800"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="bg-black p-8 text-center relative text-white">
              <button
                onClick={handleClose}
                disabled={loading}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative">
                <div className="w-12 h-12 bg-gold-500 text-black flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-bold text-xl">S</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white uppercase tracking-tight">SLV Women's Studio</h2>
                <p className="text-gold-500 text-xs uppercase tracking-widest mt-1 font-semibold">
                  {step === 'email' ? (isNewUser ? 'Register Account' : 'Customer Login') : 'Verify OTP Code'}
                </p>
              </div>
            </div>

            <div className="p-8">
              {step === 'email' ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#111111] dark:text-white mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-10"
                        placeholder="your@email.com"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isNewUser && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <label className="block text-xs uppercase tracking-wider font-bold text-[#111111] dark:text-white mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field pl-10"
                            placeholder="Enter your full name"
                            disabled={loading}
                            autoFocus
                            required={isNewUser}
                          />
                        </div>
                        <p className="text-[11px] text-gold-500 mt-1.5 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3.5 h-3.5" /> New account detected — please enter your full name
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cold start / loading banner */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3.5 bg-[#F8F8F8] dark:bg-charcoal-800 border border-[#EAEAEA] dark:border-charcoal-700 space-y-1"
                      >
                        <div className="flex items-center justify-center gap-2 text-black dark:text-white text-xs font-semibold">
                          <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                          <span>Generating & Delivering OTP...</span>
                        </div>
                        {coldStartNotice && (
                          <p className="text-[11px] text-center text-[#666666] leading-relaxed pt-1 border-t border-[#EAEAEA] dark:border-charcoal-700">
                            ⚡ Please wait, the server is starting up. This may take up to 30–60 seconds on the first request.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 text-xs uppercase tracking-widest font-bold"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Code...</span>
                      </div>
                    ) : (
                      <><Sparkles className="w-4 h-4 text-gold-500" /> {isNewUser ? 'Create Account & Send OTP' : 'Send OTP'} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#666666] font-sans">
                    No password required — login securely via email OTP!
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
