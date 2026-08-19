import { MapPin } from 'lucide-react'

export default function SavedAddresses() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-6 pb-3 border-b border-[#E5E7EB]">Saved Shipping Addresses</h2>
      <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-4 text-pink-400">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-base font-display font-bold text-[#1F2937] dark:text-white">No saved addresses</h3>
        <p className="text-[#64748B] text-xs mt-1">Addresses are saved automatically during your boutique order checkout.</p>
      </div>
    </div>
  )
}
