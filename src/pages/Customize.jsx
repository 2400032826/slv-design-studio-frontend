import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { showLogin } from '../store/slices/authSlice'
import { addToCart } from '../store/slices/cartSlice'
import { Upload, Check, ChevronRight, ChevronLeft, Package, Palette, Ruler, FileText, ShoppingCart } from 'lucide-react'
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
  { id: 'dtf', label: 'DTF Printing', price: 150, emoji: '🖨️', desc: 'Direct to film printing' },
  { id: 'screen', label: 'Screen Printing', price: 120, emoji: '🎨', desc: 'Screen printing for bulk orders' },
  { id: 'blouse', label: 'Blouse Stitching', price: 500, emoji: '👗', desc: 'Wedding, designer, bridal' },
  { id: 'kurti', label: 'Kurti Stitching', price: 400, emoji: '👘', desc: 'Simple to designer kurtis' },
  { id: 'shirt', label: "Men's Shirt Stitching", price: 450, emoji: '👔', desc: 'Formal and casual shirts' },
  { id: 'pant', label: 'Pant Stitching', price: 350, emoji: '👖', desc: 'Trousers, salwar, dhoti' },
  { id: 'lehenga', label: 'Lehenga Stitching', price: 800, emoji: '👡', desc: 'Bridal and party lehenga' },
]

const fabricTypes = ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Satin', 'Velvet', 'Linen', 'Net', 'Crepe', 'Chanderi', 'Kanjivaram']
const threadColors = ['Gold', 'Silver', 'Red', 'Royal Blue', 'Pink', 'White', 'Black', 'Maroon', 'Green', 'Orange', 'Purple']
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-12">
        <div className="section-container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Customize Your <span className="text-gradient-gold">Design</span>
          </motion.h1>
          <p className="text-white/60 mt-2">Create something truly unique and personal — just for you</p>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 gap-1">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  step === s.id ? 'bg-gradient-royal text-white shadow-pink' :
                  step > s.id ? 'bg-green-500 text-white cursor-pointer' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-default'
                }`}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="hidden sm:block">{s.title}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 flex-shrink-0 ${step > s.id ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
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
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {/* Step 1: Service Type */}
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Select Service Type</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceTypes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => update('serviceType', s)}
                          className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] ${
                            customization.serviceType?.id === s.id
                              ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gold-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{s.emoji}</div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{s.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                          <p className="text-gold-500 font-bold text-sm mt-1">From ₹{s.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Design Options */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Design Options</h2>
                    {[
                      { label: 'Fabric Type', key: 'fabricType', options: fabricTypes },
                      { label: 'Thread / Print Color', key: 'threadColor', options: threadColors },
                      { label: 'Neck Design', key: 'neckDesign', options: neckDesigns },
                      { label: 'Sleeve Design', key: 'sleeveDesign', options: sleeveDesigns },
                      { label: 'Back Design', key: 'backDesign', options: backDesigns },
                    ].map(({ label, key, options }) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt) => (
                            <button key={opt} onClick={() => update(key, opt)}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                customization[key] === opt
                                  ? 'bg-gradient-royal text-white border-transparent'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gold-400'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
                      <textarea
                        rows={3}
                        value={customization.specialInstructions}
                        onChange={(e) => update('specialInstructions', e.target.value)}
                        className="input-field resize-none"
                        placeholder="Describe any special requirements, design preferences, or references..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Measurements */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Your Measurements</h2>
                    <p className="text-sm text-gray-400">Enter measurements in centimeters (cm)</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'chest', label: 'Chest / Bust' },
                        { key: 'waist', label: 'Waist' },
                        { key: 'hips', label: 'Hips' },
                        { key: 'shoulder', label: 'Shoulder Width' },
                        { key: 'armLength', label: 'Arm Length' },
                        { key: 'blouseLength', label: 'Blouse Length' },
                        { key: 'neckDepth', label: 'Neck Depth' },
                        { key: 'height', label: 'Height' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={customization.measurements[key] || ''}
                              onChange={(e) => update('measurements', { ...customization.measurements, [key]: e.target.value })}
                              className="input-field pr-10"
                              placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Measurement Notes</label>
                      <textarea
                        rows={2}
                        value={customization.measurements.notes || ''}
                        onChange={(e) => update('measurements', { ...customization.measurements, notes: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Any special measurement notes, body shape preferences..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Upload Files */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Upload Design Files</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Upload reference images, logo, PDF, AI/CDR files. Files will be uploaded when you place the order.</p>
                    {[
                      { key: 'referenceImages', label: 'Reference Images', accept: 'image/*', desc: 'Upload 1-5 reference images (JPG, PNG, WebP)' },
                      { key: 'logo', label: 'Logo File', accept: 'image/*,.pdf,.ai,.cdr', desc: 'PNG, JPG, PDF, AI, CDR formats supported' },
                      { key: 'pdf', label: 'PDF Design', accept: '.pdf', desc: 'PDF file of your design sketch' },
                      { key: 'designFile', label: 'AI/CDR Design File', accept: '.ai,.cdr', desc: 'Adobe Illustrator or CorelDRAW file' },
                      { key: 'samplePhoto', label: 'Sample Photo', accept: 'image/*', desc: 'A photo of a design you like as reference' },
                    ].map(({ key, label, accept, desc }) => (
                      <div key={key} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-gold-400 transition-colors">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${customization.files[key] ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {customization.files[key] ? <Check className="w-5 h-5 text-green-500" /> : <Upload className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                            <p className="text-xs text-gray-400">{desc}</p>
                            {customization.files[key] && (
                              <p className="text-xs text-green-500 mt-0.5">✓ {customization.files[key].name}</p>
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
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Review & Place Order</h2>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                      {[
                        { label: 'Service', value: customization.serviceType?.label || 'Not selected' },
                        { label: 'Fabric', value: customization.fabricType || 'Not specified' },
                        { label: 'Thread / Print Color', value: customization.threadColor || 'Not specified' },
                        { label: 'Neck Design', value: customization.neckDesign || 'Not specified' },
                        { label: 'Sleeve Design', value: customization.sleeveDesign || 'Not specified' },
                        { label: 'Back Design', value: customization.backDesign || 'Not specified' },
                        { label: 'Files Uploaded', value: Object.keys(customization.files).filter((k) => customization.files[k]).length + ' file(s)' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-600 last:border-0">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                          <span className="text-gray-900 dark:text-white font-medium text-sm">{value}</span>
                        </div>
                      ))}
                    </div>

                    {customization.specialInstructions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Instructions:</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">{customization.specialInstructions}</p>
                      </div>
                    )}

                    {/* Quantity & Options */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                        <input type="number" min={1} max={50} value={customization.quantity}
                          onChange={(e) => update('quantity', Math.max(1, Number(e.target.value)))}
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required By Date</label>
                        <input type="date" value={customization.deliveryDate}
                          onChange={(e) => update('deliveryDate', e.target.value)}
                          className="input-field"
                          min={minDate.toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={customization.expressDelivery} onChange={(e) => update('expressDelivery', e.target.checked)} className="accent-gold-500 w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Express Delivery (+₹200)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={customization.giftWrap} onChange={(e) => update('giftWrap', e.target.checked)} className="accent-gold-500 w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Gift Wrap (+₹50)</span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep((p) => p - 1)} disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              {step < 5 ? (
                <button onClick={() => {
                  if (step === 1 && !customization.serviceType) { toast.error('Please select a service type'); return }
                  setStep((p) => p + 1)
                }}
                  className="btn-primary flex items-center gap-2 px-6 py-3">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleAddToCart} className="btn-gold flex items-center gap-2 px-8 py-3 text-base">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-hero rounded-2xl p-6 border border-white/10">
              <h3 className="font-display text-lg font-bold text-white mb-5">Price Estimate</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Service: {customization.serviceType?.label || '—'}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Base Price</span>
                  <span>₹{customization.serviceType?.price || 0}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Quantity</span>
                  <span>×{customization.quantity}</span>
                </div>
                {customization.expressDelivery && (
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Express Delivery</span>
                    <span>+₹200</span>
                  </div>
                )}
                {customization.giftWrap && (
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Gift Wrap</span>
                    <span>+₹50</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">Total Estimate</span>
                    <span className="text-gold-400 font-bold text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">*Final price confirmed after design review</p>
                </div>
              </div>
              <button onClick={handleAddToCart} className="w-full btn-gold mt-6">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <p className="text-white/40 text-xs text-center mt-3">
                We'll contact you to confirm design details before starting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
