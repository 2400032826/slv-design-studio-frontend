import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  { category: 'Services', q: "What services does SLV Women's Fashion Studio offer?", a: 'We offer computer embroidery, DTF printing, screen printing, blouse stitching, kurti and lehenga stitching, tailoring, saree fall & pico, 1 gram gold jewellery, and customized gifts.' },
  { category: 'Orders', q: 'How do I place a custom order?', a: 'Use our Customize page to select your service, choose design options, add measurements, upload reference files, and add to cart. You can then checkout and we will contact you to confirm the details before starting.' },
  { category: 'Delivery', q: 'What is the delivery time?', a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for an additional ₹200. Custom and complex designs may take 7-14 days depending on complexity.' },
  { category: 'Orders', q: 'Can I upload my own design or logo?', a: 'Yes! You can upload images, PDFs, AI files, CDR files, and photos of your reference design on our Customize page. We support all major design file formats including Adobe Illustrator and CorelDRAW.' },
  { category: 'Payment', q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), UPI (PhonePe, Google Pay, Paytm), and online payments via Razorpay including credit/debit cards and net banking.' },
  { category: 'Delivery', q: 'Do you offer free delivery?', a: 'Yes, we offer free delivery on orders above ₹500 within our service area. Standard shipping charges of ₹50 apply for smaller orders.' },
  { category: 'Orders', q: 'Can I track my order?', a: 'Yes! Once logged in, visit your Customer Dashboard > Orders to see real-time order status updates at every stage of production — from order received, to production, quality check, packed, and delivered.' },
  { category: 'Returns', q: 'What is your return/alteration policy?', a: 'We offer free alterations within 7 days of delivery if the stitching does not match the provided measurements. Custom printed and embroidered items cannot be returned unless there is a manufacturing defect.' },
  { category: 'Contact', q: 'How do I contact you for urgent orders?', a: 'Call or WhatsApp us directly at +91 9731912413 for urgent orders. We are available Mon-Sat 9AM-8PM and Sunday 10AM-5PM.' },
  { category: 'Orders', q: 'Do you take bulk/corporate orders?', a: 'Absolutely! We specialize in bulk orders for school uniforms, corporate uniforms, event merchandise, and promotional gifts. Contact us for special bulk pricing and priority processing.' },
  { category: 'Services', q: 'Can you do machine embroidery on any fabric?', a: 'We can embroider on most fabrics including cotton, silk, georgette, polyester, and denim. However, very delicate fabrics like pure chiffon may have limitations. We will advise you during consultation.' },
  { category: 'Payment', q: 'Is online payment secure?', a: 'Yes, all online payments are processed through Razorpay, a trusted and PCI-DSS compliant payment gateway. Your card details are never stored on our servers.' },
]

const categories = ['All', 'Services', 'Orders', 'Delivery', 'Payment', 'Returns', 'Contact']

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = faqs.filter((faq) => {
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-16">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </motion.h1>
          <p className="text-white/60 mt-3 mb-8">Everything you need to know about SLV Women's Fashion Studio</p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your question..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="section-container py-12 max-w-4xl">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-royal text-white shadow-pink'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gold-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching "{search}"</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="btn-primary mt-4 text-sm">Clear Search</button>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <HelpCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-gold-500 font-semibold uppercase tracking-wider mr-2">{faq.category}</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.q}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ml-4 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-14 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-royal rounded-2xl p-10"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-3">Still have questions?</h2>
          <p className="text-white/70 mb-6">Our team is happy to help you with anything</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold">Contact Us</Link>
            <a href="https://wa.me/919731912413" target="_blank" rel="noopener noreferrer" className="btn-outline border-white text-white hover:bg-white hover:text-purple-900">
              WhatsApp Chat
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
