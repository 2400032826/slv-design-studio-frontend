import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Package, Tag, Star, Info } from 'lucide-react'
import api from '../../api/axios'

const typeIcons = { order: Package, offer: Tag, review: Star, system: Info }
const typeColors = { order: 'text-blue-500', offer: 'text-pink-600', review: 'text-fuchsia-600', system: 'text-pink-500' }

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
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5E7EB]">
        <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">
          Notifications {unread > 0 && <span className="text-pink-600 text-sm font-normal">({unread} unread)</span>}
        </h2>
        {unread > 0 && (
          <button onClick={() => markAllRead.mutate()} className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-4 text-pink-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-base font-display font-bold text-[#1F2937] dark:text-white">No notifications</h3>
          <p className="text-[#64748B] text-xs mt-1">You're all caught up with your studio alerts!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type] || Bell
            const color = typeColors[notif.type] || 'text-pink-600'
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-colors cursor-pointer ${
                  notif.isRead
                    ? 'bg-white dark:bg-[#1F2937] border-[#E5E7EB] dark:border-charcoal-800 shadow-soft'
                    : 'bg-[#F5F7FA] dark:bg-pink-950/20 border-pink-300 dark:border-pink-900/50 shadow-soft'
                }`}
                onClick={() => !notif.isRead && markRead.mutate(notif._id)}
              >
                <div className={`w-9 h-9 rounded-xl bg-white dark:bg-charcoal-800 border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xs text-[#1F2937] dark:text-white">{notif.title}</p>
                  <p className="text-xs text-[#64748B] dark:text-charcoal-300 mt-0.5">{notif.message}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 bg-pink-500 rounded-full mt-2 flex-shrink-0 shadow-soft" />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
