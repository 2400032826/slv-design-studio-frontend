import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, Loader2 } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function OTPVerification({ email, name, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [coldStartNotice, setColdStartNotice] = useState(false)
  const refs = useRef([])

  useEffect(() => {
    refs.current[0]?.focus()
    const timer = setInterval(() => setCountdown((p) => (p > 0 ? p - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let timer
    if (loading || resending) {
      timer = setTimeout(() => setColdStartNotice(true), 2500)
    } else {
      setColdStartNotice(false)
    }
    return () => clearTimeout(timer)
  }, [loading, resending])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const newOtp = [...otp]
    newOtp[i] = val
    setOtp(newOtp)
    if (val && i < 5) refs.current[i + 1]?.focus()
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''))
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6)
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('')
      setOtp(digits)
      refs.current[5]?.focus()
      handleVerify(pasted)
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handleVerify = async (code) => {
    if (loading) return
    const otpCode = code || otp.join('')
    if (otpCode.length !== 6) return toast.error('Enter all 6 digits')
    setLoading(true)
    setColdStartNotice(false)
    try {
      const { data } = await api.post('/auth/verify-otp', {
        email: email.trim(),
        otp: otpCode,
        name: name ? name.trim() : undefined,
      })
      onVerified(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resending) return
    setResending(true)
    setColdStartNotice(false)
    try {
      await api.post('/auth/send-otp', {
        email: email.trim(),
        name: name ? name.trim() : undefined,
      })
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
      toast.success('New OTP sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Enter the 6-digit OTP sent to</p>
        <p className="font-semibold text-gray-900 dark:text-white">{email}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading || resending}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none disabled:opacity-50
              ${digit
                ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }
              focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20`}
          />
        ))}
      </div>

      {/* Loading banner */}
      <AnimatePresence>
        {(loading || resending) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl space-y-1.5"
          >
            <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
              <span>{resending ? 'Resending OTP...' : 'Verifying OTP Code...'}</span>
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
        onClick={() => handleVerify()}
        disabled={loading || resending || otp.some((d) => !d)}
        className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          <><CheckCircle className="w-5 h-5" /> Verify OTP</>
        )}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          disabled={loading || resending}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Change Email
        </button>
        {countdown > 0 ? (
          <span className="text-gray-400">Resend in {countdown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending || loading}
            className="flex items-center gap-1 text-gold-500 hover:text-gold-600 font-medium transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} /> Resend OTP
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">OTP valid for 10 minutes</p>
    </div>
  )
}
