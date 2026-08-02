import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Users, ShieldOff, ShieldCheck, Mail, Phone, Package } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <span className="text-sm text-gray-400">{data?.total || 0} total</span>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-9 pr-4 py-2 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {isLoading ? (
                  Array(6).fill(null).map((_, i) => (
                    <tr key={i}>{Array(6).fill(null).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td>)}</tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />No customers found
                  </td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-royal rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-900 dark:text-white font-medium">{user.orderCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => blockMutation.mutate({ id: user._id, isBlocked: !user.isBlocked })}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                            user.isBlocked
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {user.isBlocked ? <><ShieldCheck className="w-3 h-3" /> Unblock</> : <><ShieldOff className="w-3 h-3" /> Block</>}
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
