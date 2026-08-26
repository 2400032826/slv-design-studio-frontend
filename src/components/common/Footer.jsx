import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Heart, Sparkles } from 'lucide-react'

const services = [
  'Computer Embroidery', 'Digital & DTF Printing', 'Blouse Stitching', "Men's Garment Customization",
  'Custom Kurtis & Dresses', 'Bridal Lehengas', '1 Gram Gold Jewellery', 'Custom Gifts',
]

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Services', path: '/services' },
  { label: 'Customize Studio', path: '/customize' },
  { label: 'Gallery Lookbook', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-slate-100 pt-16 pb-8 border-t border-[#E8EAF0] dark:border-slate-800">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src="/slv-logo.png"
                alt="SLV Women's Fashion Studio"
                className="w-12 h-12 rounded-full object-contain shadow-soft group-hover:scale-105 transition-transform flex-shrink-0"
              />
              <div>
                <p className="font-display font-bold text-base md:text-lg text-[#252A34] dark:text-white">SLV Women's</p>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold tracking-wider uppercase">Fashion Studio</p>
              </div>
            </Link>
            <p className="text-[#64707D] dark:text-slate-300 text-sm leading-relaxed mb-6">
              Customize Your Style with Premium Women's Embroidery & Tailoring. Your trusted boutique for bespoke South Indian bridal & designer wear.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/slv_design_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F7F8FA] dark:bg-slate-800 hover:bg-[#FFF1F6] border border-[#E8EAF0] dark:border-slate-700 rounded-xl flex items-center justify-center text-[#252A34] dark:text-white hover:text-pink-600 hover:border-pink-300 transition-all duration-300 hover:scale-105"
                title="SLV Design Studio Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919731912413"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F7F8FA] dark:bg-slate-800 hover:bg-[#FFF1F6] border border-[#E8EAF0] dark:border-slate-700 rounded-xl flex items-center justify-center text-[#252A34] dark:text-white hover:text-pink-600 hover:border-pink-300 transition-all duration-300 hover:scale-105"
                title="WhatsApp Consultation"
              >
                <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#252A34] dark:text-white">Our Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-[#64707D] dark:text-slate-300 text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#252A34] dark:text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-[#64707D] dark:text-slate-300 text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[#252A34] dark:text-white">Visit Our Studio</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#64707D] dark:text-slate-300 text-sm">SLV Women's Fashion Studio,<br />Karnataka, India</p>
                  <a
                    href="https://maps.google.com/?q=Karnataka,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 mt-1"
                  >
                    Get Directions →
                  </a>
                </div>
              </li>
              <li>
                <a href="mailto:slvfashionstudiio@gmail.com" className="flex items-center gap-3 text-[#64707D] dark:text-slate-300 text-sm hover:text-pink-600 transition-colors">
                  <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  slvfashionstudiio@gmail.com
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
