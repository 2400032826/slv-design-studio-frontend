import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, Loader2, Sparkles } from 'lucide-react'
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
        <p className="text-[#64748B] dark:text-gray-400 text-sm">Enter the 6-digit OTP sent to</p>
        <p className="font-semibold text-pink-600 dark:text-pink-400">{email}</p>
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
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none disabled:opacity-50
              ${digit
                ? 'border-pink-500 bg-[#F5F7FA] dark:bg-pink-950/20 text-pink-700 dark:text-pink-300'
                : 'border-[#E5E7EB] dark:border-charcoal-700 bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-white'
              }
              focus:border-pink-500 focus:ring-2 focus:ring-pink-200`}
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
            className="p-4 bg-[#F5F7FA] dark:bg-[#1F2937] border border-pink-200 dark:border-charcoal-700 rounded-2xl space-y-1.5"
          >
            <div className="flex items-center justify-center gap-2 text-pink-700 dark:text-pink-300 text-sm font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
              <span>{resending ? 'Resending OTP...' : 'Verifying OTP Code...'}</span>
            </div>
            {coldStartNotice && (
              <p className="text-xs text-center text-[#64748B] dark:text-pink-200 leading-relaxed font-medium pt-1 border-t border-[#E5E7EB] dark:border-charcoal-700">
                ⚡ Starting server service. First request may take 30–60 seconds.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => handleVerify()}
        disabled={loading || resending || otp.some((d) => !d)}
        className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          <><CheckCircle className="w-5 h-5" /> Verify & Continue</>
        )}
      </button>

      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onBack}
          disabled={loading || resending}
          className="flex items-center gap-1 text-[#64748B] hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Email
        </button>
        {countdown > 0 ? (
          <span className="text-[#64748B] dark:text-charcoal-400">Resend in {countdown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending || loading}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-bold transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} /> Resend OTP
          </button>
        )}
      </div>

      <p className="text-center text-[11px] text-[#94A3B8]">Code is valid for 10 minutes</p>
    </div>
  )
}
