import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Package, Tag, Star, Info } from 'lucide-react'
import api from '../../api/axios'

const typeIcons = { order: Package, offer: Tag, review: Star, system: Info }
const typeColors = { order: 'text-blue-500', offer: 'text-gold-500', review: 'text-pink-500', system: 'text-purple-500' }

export default function Notifications() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.notifications),
  })

  const markRead = useMutation({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const markAllRead = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const notifications = data || []
  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Notifications {unread > 0 && <span className="text-gold-500 text-lg">({unread} new)</span>}
        </h2>
        {unread > 0 && (
          <button onClick={() => markAllRead.mutate()} className="text-sm text-gold-500 hover:underline flex items-center gap-1">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Bell className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No notifications</p>
          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type] || Bell
            const color = typeColors[notif.type] || 'text-gray-500'
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors cursor-pointer ${
                  notif.isRead
                    ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                    : 'bg-gold-50 dark:bg-gold-900/10 border-gold-200 dark:border-gold-900/30'
                }`}
                onClick={() => !notif.isRead && markRead.mutate(notif._id)}
              >
                <div className={`w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
