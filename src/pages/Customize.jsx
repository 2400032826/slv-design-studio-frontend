import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { showLogin } from '../store/slices/authSlice'
import { addToCart } from '../store/slices/cartSlice'
import { Upload, Check, ChevronRight, ChevronLeft, Package, Palette, Ruler, FileText, ShoppingCart, Sparkles, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, title: 'Service Type', icon: Package },
  { id: 2, title: 'Design Options', icon: Palette },
  { id: 3, title: 'Measurements', icon: Ruler },
  { id: 4, title: 'Upload Files', icon: Upload },
  { id: 5, title: 'Review & Order', icon: ShoppingCart },
]

const serviceTypes = [
  { id: 'embroidery', label: 'Computer Embroidery', price: 200, emoji: '🧵', desc: 'Name, logo, pattern embroidery' },
  { id: 'dtf', label: 'DTF Printing', price: 150, emoji: '🖨️', desc: 'Direct to film digital printing' },
  { id: 'screen', label: 'Screen Printing', price: 120, emoji: '🎨', desc: 'Screen printing for bulk orders' },
  { id: 'blouse', label: 'Blouse Stitching', price: 500, emoji: '👗', desc: 'Wedding, designer, bridal blouse' },
  { id: 'kurti', label: 'Kurti Stitching', price: 400, emoji: '👘', desc: 'Simple to luxury designer kurtis' },
  { id: 'shirt', label: "Men's Shirt Stitching", price: 450, emoji: '👔', desc: 'Formal and casual shirts' },
  { id: 'pant', label: 'Pant Stitching', price: 350, emoji: '👖', desc: 'Trousers, salwar, dhoti' },
  { id: 'lehenga', label: 'Lehenga Stitching', price: 800, emoji: '👡', desc: 'Bridal and party lehenga' },
]

const fabricTypes = ['Cotton', 'Pure Silk', 'Georgette', 'Chiffon', 'Satin', 'Velvet', 'Linen', 'Net', 'Crepe', 'Chanderi', 'Kanjivaram']
const threadColors = ['Gold Zari', 'Antique Silver', 'Crimson Red', 'Royal Blue', 'Rose Pink', 'Pure White', 'Jet Black', 'Maroon', 'Emerald Green', 'Orange', 'Magenta']
const neckDesigns = ['Round Neck', 'V Neck', 'Boat Neck', 'Square Neck', 'Sweetheart', 'U Neck', 'High Neck', 'Collar Neck']
const sleeveDesigns = ['Sleeveless', 'Short Sleeve', '3/4 Sleeve', 'Full Sleeve', 'Bell Sleeve', 'Cap Sleeve', 'Puff Sleeve']
const backDesigns = ['Open Back', 'Closed Back', 'Low Back', 'Key Hole', 'Tie Back', 'Buttons Back', 'Deep Back']

export default function Customize() {
  const [step, setStep] = useState(1)
  const [customization, setCustomization] = useState({
    serviceType: null,
    fabricType: '',
    threadColor: '',
    neckDesign: '',
    sleeveDesign: '',
    backDesign: '',
    specialInstructions: '',
    expressDelivery: false,
    giftWrap: false,
    quantity: 1,
    measurements: {},
    files: {},
    deliveryDate: '',
  })

  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)

  const totalPrice = (() => {
    const base = customization.serviceType?.price || 0
    const qty = customization.quantity || 1
    const express = customization.expressDelivery ? 200 : 0
    const gift = customization.giftWrap ? 50 : 0
    return (base * qty) + express + gift
  })()

  const update = (key, value) => setCustomization((p) => ({ ...p, [key]: value }))

  const handleFileChange = (key, file) => {
    setCustomization((p) => ({ ...p, files: { ...p.files, [key]: file } }))
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) { dispatch(showLogin()); return }
    if (!customization.serviceType) { toast.error('Please select a service type'); return }
    const product = {
      _id: `custom_${Date.now()}`,
      name: `Custom ${customization.serviceType.label}`,
      price: totalPrice,
      offerPrice: null,
      images: [],
    }
    dispatch(addToCart({ product, quantity: 1, customization }))
    toast.success('Custom order added to cart! 🎉')
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 5)

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-slate-800 py-12 shadow-subtle">
        <div className="section-container text-center">
          <span className="section-subtitle">Bespoke Atelier Studio</span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="section-title text-[#1F2937] dark:text-white">
            Customization <span className="text-gradient-pink">Studio</span>
          </motion.h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-3 rounded-full" />
          <p className="text-[#64748B] dark:text-slate-300 text-sm max-w-lg mx-auto">
            Design your bespoke bridal blouse, embroidery patterns, and custom fabric tailoring in 5 easy steps.
          </p>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-3 gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  step === s.id
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft'
                    : step > s.id
                    ? 'bg-[#FFF5F9] dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 border border-pink-200 cursor-pointer'
                    : 'bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-400 border border-[#E5E7EB] cursor-default'
                }`}
              >
                {step > s.id ? <Check className="w-3.5 h-3.5 text-pink-600" /> : <s.icon className="w-3.5 h-3.5" />}
                <span>{s.title}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 flex-shrink-0 ${step > s.id ? 'bg-pink-400' : 'bg-[#E5E7EB] dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-slate-800 shadow-card"
              >
                {/* Step 1: Service Type */}
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-2">Select Service Type</h2>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mb-6">Choose the bespoke service you would like us to tailor or embroider.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {serviceTypes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => update('serviceType', s)}
                          className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] ${
                            customization.serviceType?.id === s.id
                              ? 'border-pink-500 bg-[#FFF5F9] dark:bg-pink-950/20 shadow-soft'
                              : 'border-[#E5E7EB] dark:border-slate-700 hover:border-pink-300 bg-[#F5F7FA] dark:bg-slate-800'
                          }`}
                        >
                          <div className="text-2xl mb-2">{s.emoji}</div>
                          <p className="font-bold text-sm text-[#1F2937] dark:text-white">{s.label}</p>
                          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">{s.desc}</p>
                          <p className="text-pink-600 dark:text-pink-400 font-bold text-sm mt-2 price-tag">From ₹{s.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Design Options */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">Design & Styling Options</h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">Personalize fabric textures, cut alignments, and thread accents.</p>
                    </div>
                    {[
                      { label: 'Fabric Type', key: 'fabricType', options: fabricTypes },
                      { label: 'Thread / Zari Accent Color', key: 'threadColor', options: threadColors },
                      { label: 'Neck Design', key: 'neckDesign', options: neckDesigns },
                      { label: 'Sleeve Cut & Length', key: 'sleeveDesign', options: sleeveDesigns },
                      { label: 'Back Pattern & Opening', key: 'backDesign', options: backDesigns },
                    ].map(({ label, key, options }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-2">{label}</label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt) => (
                            <button key={opt} onClick={() => update(key, opt)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                customization[key] === opt
                                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white border-transparent shadow-soft'
                                  : 'border-[#E5E7EB] dark:border-slate-700 text-[#64748B] dark:text-slate-300 hover:border-pink-300 bg-[#F5F7FA] dark:bg-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-2">Special Instructions</label>
                      <textarea
                        rows={3}
                        value={customization.specialInstructions}
                        onChange={(e) => update('specialInstructions', e.target.value)}
                        className="input-field resize-none"
                        placeholder="Describe any special neck depth, piping requirements, tassels, or padding preferences..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Measurements */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">Body Measurements</h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">Enter measurements in centimeters (cm) for a custom silhouette.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'chest', label: 'Chest / Bust' },
                        { key: 'waist', label: 'Waist' },
                        { key: 'hips', label: 'Hips' },
                        { key: 'shoulder', label: 'Shoulder Width' },
                        { key: 'armLength', label: 'Arm Length' },
                        { key: 'blouseLength', label: 'Blouse Length' },
                        { key: 'neckDepth', label: 'Front Neck Depth' },
                        { key: 'height', label: 'Full Height' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs font-semibold text-[#1F2937] dark:text-gray-300 mb-1">{label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={customization.measurements[key] || ''}
                              onChange={(e) => update('measurements', { ...customization.measurements, [key]: e.target.value })}
                              className="input-field pr-10"
                              placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">cm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] dark:text-gray-300 mb-1">Measurement Notes</label>
                      <textarea
                        rows={2}
                        value={customization.measurements.notes || ''}
                        onChange={(e) => update('measurements', { ...customization.measurements, notes: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Any posture notes, armhole looseness, or fit preferences..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Upload Files */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">Upload Reference & Artwork</h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">Attach photos of embroidery designs, logo vectors, or sketch files.</p>
                    </div>
                    {[
                      { key: 'referenceImages', label: 'Reference Photos', accept: 'image/*', desc: 'Upload 1-5 reference images (JPG, PNG, WebP)' },
                      { key: 'logo', label: 'Logo File', accept: 'image/*,.pdf,.ai,.cdr', desc: 'PNG, JPG, PDF, AI, CDR formats supported' },
                      { key: 'pdf', label: 'PDF Design Layout', accept: '.pdf', desc: 'PDF file of your design sketch' },
                      { key: 'designFile', label: 'Vector Artwork (AI/CDR)', accept: '.ai,.cdr', desc: 'Adobe Illustrator or CorelDRAW file' },
                      { key: 'samplePhoto', label: 'Sample Blouse / Pattern Photo', accept: 'image/*', desc: 'A photo of a design you like as reference' },
                    ].map(({ key, label, accept, desc }) => (
                      <div key={key} className="border-2 border-dashed border-[#E5E7EB] dark:border-slate-700 rounded-xl p-4 hover:border-pink-400 transition-colors bg-[#F5F7FA] dark:bg-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${customization.files[key] ? 'bg-pink-100 dark:bg-pink-950/30' : 'bg-white dark:bg-slate-700 border border-[#E5E7EB]'}`}>
                            {customization.files[key] ? <Check className="w-5 h-5 text-pink-600" /> : <Upload className="w-5 h-5 text-pink-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#1F2937] dark:text-white text-xs">{label}</p>
                            <p className="text-[11px] text-[#64748B] dark:text-slate-400">{desc}</p>
                            {customization.files[key] && (
                              <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold mt-0.5">✓ {customization.files[key].name}</p>
                            )}
                          </div>
                          <input type="file" accept={accept} className="hidden"
                            onChange={(e) => handleFileChange(key, e.target.files[0])} />
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">Review & Confirm Custom Order</h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">Verify your design choices and scheduling options before booking.</p>
                    </div>
                    <div className="bg-[#F5F7FA] dark:bg-slate-800 rounded-xl p-4 border border-[#E5E7EB] dark:border-slate-700 space-y-2">
                      {[
                        { label: 'Service', value: customization.serviceType?.label || 'Not selected' },
                        { label: 'Fabric', value: customization.fabricType || 'Not specified' },
                        { label: 'Thread / Zari Accent', value: customization.threadColor || 'Not specified' },
                        { label: 'Neck Design', value: customization.neckDesign || 'Not specified' },
                        { label: 'Sleeve Cut', value: customization.sleeveDesign || 'Not specified' },
                        { label: 'Back Opening', value: customization.backDesign || 'Not specified' },
                        { label: 'Files Uploaded', value: Object.keys(customization.files).filter((k) => customization.files[k]).length + ' file(s)' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-slate-700 last:border-0 text-xs">
                          <span className="text-[#64748B] dark:text-slate-400">{label}</span>
                          <span className="text-[#1F2937] dark:text-white font-bold">{value}</span>
                        </div>
                      ))}
                    </div>

                    {customization.specialInstructions && (
                      <div>
                        <p className="text-xs font-bold text-[#1F2937] dark:text-gray-300 mb-1">Special Instructions:</p>
                        <p className="text-xs text-[#64748B] dark:text-slate-300 bg-[#F5F7FA] dark:bg-slate-800 rounded-xl p-3 border border-[#E5E7EB]">{customization.specialInstructions}</p>
                      </div>
                    )}

                    {/* Quantity & Options */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2937] dark:text-gray-300 mb-1">Quantity</label>
                        <input type="number" min={1} max={50} value={customization.quantity}
                          onChange={(e) => update('quantity', Math.max(1, Number(e.target.value)))}
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2937] dark:text-gray-300 mb-1">Required By Date</label>
                        <input type="date" value={customization.deliveryDate}
                          onChange={(e) => update('deliveryDate', e.target.value)}
                          className="input-field"
                          min={minDate.toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={customization.expressDelivery} onChange={(e) => update('expressDelivery', e.target.checked)} className="accent-pink-600 w-4 h-4" />
                        <span className="text-xs font-medium text-[#1F2937] dark:text-gray-300">Express Delivery (+₹200)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={customization.giftWrap} onChange={(e) => update('giftWrap', e.target.checked)} className="accent-pink-600 w-4 h-4" />
                        <span className="text-xs font-medium text-[#1F2937] dark:text-gray-300">Gift Packaging (+₹50)</span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep((p) => p - 1)} disabled={step === 1}
                className="btn-secondary text-xs px-6 py-3 disabled:opacity-40 font-bold">
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>
              {step < 5 ? (
                <button onClick={() => {
                  if (step === 1 && !customization.serviceType) { toast.error('Please select a service type'); return }
                  setStep((p) => p + 1)
                }}
                  className="btn-primary text-xs px-6 py-3 font-bold">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleAddToCart} className="btn-primary text-xs px-8 py-3 font-bold shadow-card">
                  <ShoppingCart className="w-4 h-4" /> Add Custom Item to Bag
                </button>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-slate-800 shadow-card">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E7EB] dark:border-slate-700">
                <Scissors className="w-4 h-4 text-pink-500" />
                <h3 className="font-display text-base font-bold text-[#1F2937] dark:text-white">Price Estimate</h3>
              </div>
              <div className="space-y-2.5 text-xs text-[#64748B] dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-semibold text-[#1F2937] dark:text-white">{customization.serviceType?.label || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Unit Price</span>
                  <span className="font-semibold text-[#1F2937] dark:text-white">₹{customization.serviceType?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-semibold text-[#1F2937] dark:text-white">×{customization.quantity}</span>
                </div>
                {customization.expressDelivery && (
                  <div className="flex justify-between">
                    <span>Express Tailoring</span>
                    <span className="font-semibold text-pink-600">+₹200</span>
                  </div>
                )}
                {customization.giftWrap && (
                  <div className="flex justify-between">
                    <span>Gift Wrap</span>
                    <span className="font-semibold text-pink-600">+₹50</span>
                  </div>
                )}
                <div className="border-t border-[#E5E7EB] dark:border-slate-700 pt-3 mt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-[#1F2937] dark:text-white">Total Estimate</span>
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-xl price-tag">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] mt-1">*Final quote confirmed upon design assessment</p>
                </div>
              </div>
              <button onClick={handleAddToCart} className="w-full btn-primary mt-6 text-xs py-3 font-bold shadow-card">
                <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
              </button>
              <p className="text-[#94A3B8] text-[11px] text-center mt-3">
                Our master tailor will review details before starting work
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
