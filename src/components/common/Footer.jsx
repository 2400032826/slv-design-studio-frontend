import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Heart } from 'lucide-react'

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
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center shadow-pink">
                <span className="text-white font-display font-bold text-xl">S</span>
              </div>
              <div>
                <p className="font-display font-bold text-base md:text-lg text-white">SLV Women's</p>
                <p className="text-xs text-gold-500 font-semibold tracking-wider uppercase">Fashion Studio</p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Customize Your Style with Premium Women's Embroidery & Tailoring. Your trusted boutique for all custom fashion needs.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-royal rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-pink hover:scale-110"
                  title={label}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-gold-400">Our Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-white/60 text-sm hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500 rounded-full" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-gold-400">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-white/60 text-sm hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-gold-400">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <p className="text-white/60 text-sm">SLV Women's Fashion Studio,<br />Karnataka, India</p>
              </li>
              <li>
                <a href="tel:+919731912413" className="flex items-center gap-3 text-white/60 text-sm hover:text-gold-400 transition-colors">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  +91 9731912413
                </a>
              </li>
              <li>
                <a href="mailto:slvdesignstudio@gmail.com" className="flex items-center gap-3 text-white/60 text-sm hover:text-gold-400 transition-colors">
                  <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  slvdesignstudio@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919731912413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/40 text-green-400 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-400">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  </svg>
                  WhatsApp Chat
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">Business Hours</p>
              <p className="text-white/60 text-sm">Mon - Sat: 9:00 AM – 8:00 PM</p>
              <p className="text-white/60 text-sm">Sunday: 10:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {year} SLV Women's Fashion Studio. All rights reserved.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for premium fashion
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <Link to="/faq" className="hover:text-gold-400 transition-colors">FAQ</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
