import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Heart, Sparkles } from 'lucide-react'

const services = [
  'Computer Embroidery', 'DTF Printing', 'Blouse Stitching', 'Custom Tailoring',
  'Kurti Stitching', 'Bridal Collections', '1 Gram Gold Jewellery', 'Custom Gifts',
]

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Services', path: '/services' },
  { label: 'Customize', path: '/customize' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-slate-100 pt-16 pb-8 border-t border-[#E5E7EB] dark:border-slate-800">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-display font-bold text-xl">S</span>
              </div>
              <div>
                <p className="font-display font-bold text-base md:text-lg text-[#1F2937] dark:text-white">SLV Women's</p>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold tracking-wider uppercase">Fashion Studio</p>
              </div>
            </Link>
            <p className="text-[#64748B] dark:text-slate-300 text-sm leading-relaxed mb-6">
              Customize Your Style with Premium Women's Embroidery & Tailoring. Your trusted boutique for bespoke South Indian & designer wear.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#F5F7FA] dark:bg-slate-800 hover:bg-[#FFF5F9] border border-[#E5E7EB] dark:border-slate-700 rounded-xl flex items-center justify-center text-[#1F2937] dark:text-white hover:text-pink-600 hover:border-pink-300 transition-all duration-300 hover:scale-105"
                  title={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#1F2937] dark:text-white">Our Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-[#64748B] dark:text-slate-300 text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#1F2937] dark:text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-[#64748B] dark:text-slate-300 text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#1F2937] dark:text-white">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <p className="text-[#64748B] dark:text-slate-300 text-sm">SLV Women's Fashion Studio,<br />Karnataka, India</p>
              </li>
              <li>
                <a href="tel:+919731912413" className="flex items-center gap-3 text-[#64748B] dark:text-slate-300 text-sm hover:text-pink-600 transition-colors">
                  <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  +91 9731912413
                </a>
              </li>
              <li>
                <a href="mailto:slvdesignstudio@gmail.com" className="flex items-center gap-3 text-[#64748B] dark:text-slate-300 text-sm hover:text-pink-600 transition-colors">
                  <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  slvdesignstudio@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919731912413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm hover:bg-emerald-100 transition-colors font-medium"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  WhatsApp Consultation
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3.5 bg-[#F5F7FA] dark:bg-slate-800/60 rounded-xl border border-[#E5E7EB] dark:border-slate-700">
              <p className="text-pink-600 dark:text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">Boutique Hours</p>
              <p className="text-[#64748B] dark:text-slate-300 text-xs">Mon - Sat: 9:00 AM – 8:00 PM</p>
              <p className="text-[#64748B] dark:text-slate-300 text-xs">Sunday: 10:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E7EB] dark:bg-slate-800 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#64748B] dark:text-slate-400 text-sm">
            © {year} SLV Women's Fashion Studio. All rights reserved.
          </p>
          <p className="text-[#64748B] dark:text-slate-400 text-sm flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for women's fashion
          </p>
          <div className="flex gap-4 text-xs text-[#64748B] dark:text-slate-400">
            <Link to="/faq" className="hover:text-pink-600 transition-colors">FAQ</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-pink-600 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-pink-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
