import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Home, ShoppingBag, Sparkles, Image, ShoppingCart } from 'lucide-react'
import { openCart, selectCartCount } from '../../store/slices/cartSlice'

export default function MobileBottomNav() {
  const location = useLocation()
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartCount)

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Products', path: '/products', icon: ShoppingBag },
    {
      label: 'Customize',
      path: '/customize',
      icon: Sparkles,
      isSpecial: true,
    },
    { label: 'Lookbook', path: '/gallery', icon: Image },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border-t border-[#E8EAF0] dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          if (item.isSpecial) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft transition-transform duration-200 group-active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-pink-600 to-fuchsia-600 ring-4 ring-pink-100 dark:ring-pink-950 text-white'
                      : 'bg-gradient-to-tr from-pink-500 to-fuchsia-600 text-white hover:opacity-95'
                  }`}
                >
                  <Icon className="w-5 h-5 fill-white" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-pink-600 dark:text-pink-400' : 'text-[#64748B] dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors group ${
                isActive
                  ? 'text-pink-600 dark:text-pink-400 font-bold'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-pink-500'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          )
        })}

        {/* Cart Item with live bag count */}
        <button
          onClick={() => dispatch(openCart())}
          className="flex flex-col items-center justify-center flex-1 py-1.5 text-[#64748B] dark:text-slate-400 hover:text-pink-500 transition-colors group"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-[1.8] transition-transform group-active:scale-90" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-pink-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-subtle animate-scale">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Bag</span>
        </button>
      </div>
    </nav>
  )
}