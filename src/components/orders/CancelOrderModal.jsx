import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Changed my mind',
  'Found a better alternative',
  'Delivery time is too long',
  'Wrong product/customization selected',
  'Other',
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      return toast.error('Please select a cancellation reason');
    }
    if (selectedReason === 'Other' && !otherDetails.trim()) {
      return toast.error('Please specify your reason in the text box');
    }
    setConfirmStep(true);
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      const payload = {
        reason: selectedReason,
        details: selectedReason === 'Other' ? otherDetails.trim() : otherDetails.trim() || undefined,
      };

      const res = await api.patch(/orders//cancel, payload);
      toast.success(res.data?.message || 'Order cancelled successfully');
      if (onSuccess) onSuccess(res.data?.order);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setOtherDetails('');
    setConfirmStep(false);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5E7EB] dark:border-charcoal-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-charcoal-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center border border-rose-200 dark:border-rose-900/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1F2937] dark:text-white">
                  Cancel Booking #{order.orderNumber}
                </h3>
                <p className="text-[11px] text-[#64748B] dark:text-gray-400">
                  Total: ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800 text-[#64748B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!confirmStep ? (
            /* Step 1: Select Reason */
            <form onSubmit={handleNext} className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-[#1F2937] dark:text-gray-200">
                Please tell us why you want to cancel this order:
              </p>

              <div className="space-y-2">
                {CANCELLATION_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <label
                      key={reason}
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all text-xs font-medium ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 font-bold shadow-soft'
                          : 'border-[#E5E7EB] dark:border-charcoal-700 hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800 text-[#1F2937] dark:text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={isSelected}
                        onChange={() => setSelectedReason(reason)}
                        className="text-pink-600 focus:ring-pink-500 h-4 w-4"
                      />
                      <span>{reason}</span>
                    </label>
                  );
                })}
              </div>

              {selectedReason === 'Other' && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-gray-300 mb-1">
                    Describe your reason:
                  </label>
                  <textarea
                    rows={3}
                    value={otherDetails}
                    onChange={(e) => setOtherDetails(e.target.value)}
                    placeholder="Please specify why you are cancelling..."
                    className="input-field text-xs resize-none w-full bg-white dark:bg-charcoal-800"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t border-[#E5E7EB] dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 btn-secondary py-2.5 text-xs font-bold"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className="flex-1 btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Final Confirmation */
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/30 text-rose-900 dark:text-rose-200 text-xs space-y-1.5">
                <p className="font-bold">Are you sure you want to cancel this booking?</p>
                <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-300">
                  This action is permanent and cannot be undone. Any custom stitching queue slot will be released.
                </p>
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40 text-[11px]">
                  <span className="font-bold">Reason:</span> {selectedReason}
                  {selectedReason === 'Other' && otherDetails && ` — "${otherDetails}"`}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmStep(false)}
                  disabled={loading}
                  className="flex-1 btn-secondary py-2.5 text-xs font-bold"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-soft disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}