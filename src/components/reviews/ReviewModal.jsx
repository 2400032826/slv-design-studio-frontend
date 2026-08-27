import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

export default function ReviewModal({
  isOpen,
  onClose,
  product,
  orderId,
  orderNumber,
  existingReview = null,
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setComment(existingReview.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
  }, [existingReview, isOpen]);

  if (!isOpen || !product) return null;

  const prodId = product._id || product.id || (typeof product === 'string' ? product : '');
  const prodName = product.name || 'Product';
  const prodImg = getImageUrl(product.images?.[0] || product.image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please share your feedback in the comment box.');
    }

    setSubmitting(true);
    try {
      const payload = {
        product: prodId,
        orderId,
        rating,
        title: `${rating} Star Review`,
        comment: comment.trim(),
      };

      const res = await api.post('/reviews', payload);
      toast.success(res.data?.message || 'Review submitted successfully! ⭐');
      if (onSuccess) onSuccess(res.data?.review);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
            <div>
              <span className="badge badge-soft text-[10px] uppercase font-bold tracking-wider mb-1 inline-block">
                Verified Purchase Feedback
              </span>
              <h3 className="font-display text-lg font-bold text-[#1F2937] dark:text-white">
                How was your experience?
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800 text-[#64748B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Context Card */}
          <div className="flex items-center gap-3.5 p-3.5 my-4 bg-[#F5F7FA] dark:bg-charcoal-800/60 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-700">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-charcoal-700 flex-shrink-0 border border-[#E5E7EB]">
              {prodImg ? (
                <img src={prodImg} alt={prodName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white truncate">
                {prodName}
              </p>
              {orderNumber && (
                <p className="text-[11px] text-[#64748B] dark:text-gray-400">
                  Order #{orderNumber}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Star Rating */}
            <div className="text-center py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Your Rating
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = hoverRating || rating;
                  const isFilled = star <= activeStar;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-gray-300 dark:text-charcoal-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-1">
                {rating === 5 && '★★★★★ Excellent'}
                {rating === 4 && '★★★★☆ Very Good'}
                {rating === 3 && '★★★☆☆ Good'}
                {rating === 2 && '★★☆☆☆ Fair'}
                {rating === 1 && '★☆☆☆☆ Poor'}
              </p>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1.5">
                Write your review:
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share crafting quality, fitting, packaging, or overall experience..."
                className="input-field text-xs resize-none w-full bg-white dark:bg-charcoal-800"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary py-3 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn-primary py-3 text-xs font-bold shadow-soft"
              >
                {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}