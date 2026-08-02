import { MapPin } from 'lucide-react'

export default function SavedAddresses() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <MapPin className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No saved addresses</p>
        <p className="text-gray-400 text-sm mt-1">Addresses are saved automatically when you checkout</p>
      </div>
    </div>
  )
}
