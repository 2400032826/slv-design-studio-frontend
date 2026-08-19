import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Users, ShieldOff, ShieldCheck, Mail, Phone, Package, Sparkles } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminCustomers() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: () => api.get(`/admin/users?search=${search}`, adminHeaders).then((r) => r.data),
  })

  const blockMutation = useMutation({
    mutationFn: ({ id, isBlocked }) => api.put(`/admin/users/${id}/block`, { isBlocked }, adminHeaders),
    onSuccess: (_, { isBlocked }) => {
      toast.success(isBlocked ? 'User blocked' : 'User unblocked')
      queryClient.invalidateQueries(['admin-customers'])
    },
  })

  const users = data?.users || []

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-8 py-4 flex items-center justify-between shadow-soft">
          <h1 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">Registered Clients & Accounts</h1>
          <span className="badge badge-soft text-xs font-bold">{data?.total || 0} Total Clients</span>
        </div>

        <div className="p-8 space-y-6 max-w-7xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, or phone..."
              className="input-field pl-10 py-2.5 w-full max-w-md text-xs shadow-soft" />
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden shadow-card">
            <table className="w-full">
              <thead className="bg-[#F5F7FA] dark:bg-charcoal-800 border-b border-[#E5E7EB]">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Bookings</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Joined Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Account Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-charcoal-700">
                {isLoading ? (
                  Array(6).fill(null).map((_, i) => (
                    <tr key={i}>{Array(6).fill(null).map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full rounded-lg" /></td>)}</tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-[#94A3B8]">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-pink-400" />
                    <p className="text-sm font-semibold text-[#64748B]">No customers found</p>
                  </td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#F5F7FA]/60 dark:hover:bg-charcoal-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-soft flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white">{user.name}</p>
                            <p className="text-[11px] text-[#64748B] flex items-center gap-1"><Mail className="w-3 h-3 text-pink-400" />{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-[#1F2937] dark:text-gray-300">{user.phone || '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-xs">
                          <Package className="w-3.5 h-3.5 text-pink-500" />
                          <span className="font-bold text-[#1F2937] dark:text-white">{user.orderCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#64748B]">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${user.isBlocked ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => blockMutation.mutate({ id: user._id, isBlocked: !user.isBlocked })}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                            user.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {user.isBlocked ? <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</> : <><ShieldOff className="w-3.5 h-3.5" /> Block</>}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
