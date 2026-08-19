import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  { category: 'Services', q: "What services does SLV Women's Fashion Studio offer?", a: 'We offer computer embroidery, DTF printing, screen printing, blouse stitching, kurti and lehenga stitching, tailoring, saree fall & pico, 1 gram gold jewellery, and customized gifts.' },
  { category: 'Orders', q: 'How do I place a custom order?', a: 'Use our Customize page to select your service, choose design options, add measurements, upload reference files, and add to cart. You can then checkout and we will contact you to confirm the details before starting.' },
  { category: 'Delivery', q: 'What is the delivery time?', a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for an additional ₹200. Custom and complex designs may take 7-14 days depending on complexity.' },
  { category: 'Orders', q: 'Can I upload my own design or logo?', a: 'Yes! You can upload images, PDFs, AI files, CDR files, and photos of your reference design on our Customize page. We support all major design file formats including Adobe Illustrator and CorelDRAW.' },
  { category: 'Payment', q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), UPI (PhonePe, Google Pay, Paytm), and direct WhatsApp confirmed bookings.' },
  { category: 'Delivery', q: 'Do you offer free delivery?', a: 'Yes, we offer free delivery on orders above ₹500 within our service area. Standard shipping charges of ₹50 apply for smaller orders.' },
  { category: 'Orders', q: 'Can I track my order?', a: 'Yes! Once logged in, visit your Customer Dashboard > Orders to see real-time order status updates at every stage of production — from order received, to production, quality check, packed, and delivered.' },
  { category: 'Returns', q: 'What is your return/alteration policy?', a: 'We offer free alterations within 7 days of delivery if the stitching does not match the provided measurements. Custom printed and embroidered items cannot be returned unless there is a manufacturing defect.' },
  { category: 'Contact', q: 'How do I contact you for urgent orders?', a: 'Call or WhatsApp us directly at +91 9731912413 for urgent orders. We are available Mon-Sat 9AM-8PM and Sunday 10AM-5PM.' },
  { category: 'Orders', q: 'Do you take bulk/corporate orders?', a: 'Absolutely! We specialize in bulk orders for school uniforms, corporate uniforms, event merchandise, and promotional gifts. Contact us for special bulk pricing and priority processing.' },
  { category: 'Services', q: 'Can you do machine embroidery on any fabric?', a: 'We can embroider on most fabrics including cotton, silk, georgette, polyester, and denim. However, very delicate fabrics like pure chiffon may have limitations. We will advise you during consultation.' },
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
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-16 text-center">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 badge badge-soft text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Help & Support Center</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white">
            Frequently Asked <span className="text-gradient-pink">Questions</span>
          </motion.h1>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm mt-2 mb-8 leading-relaxed">
            Everything you need to know about tailoring, computerized embroidery, fittings, and order delivery.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your question or keyword..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-700 rounded-2xl text-xs text-[#1F2937] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 shadow-soft"
            />
          </div>
        </div>
      </div>

      <div className="section-container py-12 max-w-3xl">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'btn-primary text-white shadow-soft'
                  : 'bg-white dark:bg-[#1F2937] text-[#64748B] border border-[#E5E7EB] dark:border-charcoal-700 hover:border-pink-300'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB]">
              <HelpCircle className="w-12 h-12 text-pink-300 mx-auto mb-3" />
              <p className="text-xs text-[#64748B]">No questions found matching "{search}"</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="btn-primary mt-4 text-xs py-2 px-5">Clear Search</button>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <HelpCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider mr-2">{faq.category}</span>
                      <span className="font-bold text-[#1F2937] dark:text-white text-xs sm:text-sm">{faq.q}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] flex-shrink-0 transition-transform duration-300 ml-4 ${open === i ? 'rotate-180 text-pink-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-11 text-[#64748B] dark:text-charcoal-300 text-xs sm:text-sm leading-relaxed border-t border-[#E5E7EB] dark:border-charcoal-700 pt-3">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-[#F5F7FA] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-3xl p-8 sm:p-10 shadow-card"
        >
          <span className="badge badge-soft text-[10px] mb-2 inline-block">Need Instant Assistance?</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white mb-2">Still have questions?</h2>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm max-w-md mx-auto mb-6">Our boutique support team is happy to guide you with designs, fabric types, and fitting queries.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-primary text-xs py-3 px-8 font-bold">Contact Studio</Link>
            <a href="https://wa.me/919731912413" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-3 px-8 font-bold">
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
