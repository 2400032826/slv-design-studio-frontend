import { useState, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { showLogin } from '../store/slices/authSlice'
import { addToCart, openCart } from '../store/slices/cartSlice'
import {
  Upload, Check, ChevronRight, ChevronLeft, Package,
  Sparkles, Scissors, ShoppingCart, Info, Shirt, Gem, Gift,
  CheckCircle2, Ruler, HelpCircle, Palette, Tag, Edit3,
  HelpCircle as QuestionIcon, Plus, Eye, ChevronDown, ChevronUp,
  Image as ImageIcon, RefreshCw, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { getUnifiedGalleryItems } from '../utils/galleryService'

// ============================================================================
// DYNAMIC SERVICE CONFIGURATION SYSTEM WITH HUMAN-FRIENDLY LABELS
// ============================================================================

export const SERVICE_CONFIG = {
  blouse: {
    id: 'blouse',
    label: 'Blouse Stitching & Tailoring',
    category: "Women's Bespoke",
    emoji: '👗',
    basePrice: 500,
    badge: 'Bridal & Designer Fits',
    shortDesc: 'Designer bridal blouses tailored to your exact measurements with padded lining and handcrafted embroidery.',
    steps: [
      {
        id: 'style',
        title: 'What style of blouse would you like?',
        subtitle: 'Select the occasion or silhouette type',
        type: 'select',
        key: 'blouseStyle',
        popularCount: 4,
        options: [
          { label: 'Bridal Blouse', desc: 'Heavy padding, deep cut, luxury bridal lining', addPrice: 200, icon: '👑', popular: true },
          { label: 'Designer Cut Blouse', desc: 'Modern designer back & princess cut', addPrice: 150, icon: '✨', popular: true },
          { label: 'Traditional South Indian', desc: 'Classic Kanjivaram sleeve & neck alignment', addPrice: 100, icon: '🥻', popular: true },
          { label: 'Party Wear Blouse', desc: 'Net / sheer back, stylish straps', addPrice: 150, icon: '🌟', popular: true },
          { label: 'Simple Daily Blouse', desc: 'Comfortable daily wear stitching', addPrice: 0, icon: '🧵' },
          { label: 'Custom Reference Design', desc: 'Tailored exactly from your uploaded photo', addPrice: 100, icon: '✂️' },
        ],
      },
      {
        id: 'fabric',
        title: 'Which fabric are you using?',
        subtitle: 'Choose your blouse material or fabric provided by you',
        type: 'chips',
        key: 'fabricType',
        popularCount: 5,
        options: ['Pure Silk / Kanjivaram', 'Raw Silk', 'Velvet', 'Cotton', 'Georgette', 'Chiffon', 'Net / Tissue', 'Satin', 'Brocade', 'Customer Provided Fabric'],
      },
      {
        id: 'neck',
        title: 'Choose your front neckline',
        subtitle: 'Tap your preferred neck shape',
        type: 'visual_grid',
        key: 'neckDesign',
        popularCount: 4,
        options: [
          { label: 'Round Neck', icon: '⭕', desc: 'Timeless & classic', popular: true },
          { label: 'Sweetheart Neck', icon: '💖', desc: 'Bridal favorite curve', popular: true },
          { label: 'V Neck', icon: '🔻', desc: 'Sleek elongating cut', popular: true },
          { label: 'Boat Neck', icon: '🛶', desc: 'High shoulder elegance', popular: true },
          { label: 'Square Neck', icon: '🔲', desc: 'Structured & clean' },
          { label: 'High Neck / Collar', icon: '👔', desc: 'Royal high neck' },
          { label: 'U Neck', icon: '🧲', desc: 'Deep front curve' },
          { label: 'Custom Cut', icon: '✂️', desc: 'Match uploaded photo' },
        ],
      },
      {
        id: 'sleeve',
        title: 'Choose your sleeve style & length',
        subtitle: 'Select sleeve styling and embroidery space',
        type: 'visual_grid',
        key: 'sleeveDesign',
        popularCount: 4,
        options: [
          { label: 'Elbow Sleeve (Maggam)', icon: '📐', desc: 'Best for bridal embroidery', popular: true },
          { label: 'Short Sleeve (Standard)', icon: '✂️', desc: '4 – 6 inches comfort', popular: true },
          { label: 'Puff Sleeve', icon: '🎈', desc: 'Traditional South Indian puff', popular: true },
          { label: 'Sleeveless / Straps', icon: '🎽', desc: 'Modern chic silhouette', popular: true },
          { label: '3/4 Sleeve', icon: '📏', desc: 'Graceful mid-forearm' },
          { label: 'Full Sleeve', icon: '🧤', desc: 'Royal full coverage' },
          { label: 'Bell / Flared Sleeve', icon: '🔔', desc: 'Contemporary flare' },
          { label: 'Custom Sleeve', icon: '✨', desc: 'Custom cut from photo' },
        ],
      },
      {
        id: 'back',
        title: 'Choose your back pattern & opening',
        subtitle: 'Select back silhouette, depth, and opening style',
        type: 'visual_grid',
        key: 'backDesign',
        popularCount: 4,
        options: [
          { label: 'Open Back with Dori Tassels', icon: '🎀', desc: 'Deep back with designer latkans', popular: true },
          { label: 'Keyhole Pattern', icon: '🔑', desc: 'Circular/teardrop keyhole', popular: true },
          { label: 'Deep U Back', icon: '🌙', desc: 'Low cut traditional back', popular: true },
          { label: 'Closed / High Back', icon: '🔒', desc: 'Modest & sophisticated', popular: true },
          { label: 'Button Back Opening', icon: '🔘', desc: 'Fabric potli buttons' },
          { label: 'Sheer / Net Back', icon: '🪟', desc: 'Translucent net cutout' },
          { label: 'V Shape Back', icon: '🔻', desc: 'Deep V line' },
          { label: 'Custom Pattern', icon: '🎨', desc: 'Custom design from sketch' },
        ],
      },
      {
        id: 'embroidery',
        title: 'Would you like to add embroidery work?',
        subtitle: 'Handcrafted bridal Maggam or computerized machine embroidery',
        type: 'select',
        key: 'embroideryOption',
        helpText: 'Maggam work is handcrafted with gold zari & stones; Computer embroidery is done via high-speed multi-thread machines.',
        options: [
          { label: 'Handcrafted Bridal Maggam Work', desc: 'Authentic gold Zari, cutdana, beads & stones on neck & sleeves', addPrice: 800, icon: '👑', popular: true },
          { label: 'Heavy Zardosi & Cutdana Work', desc: 'Grand 3D bridal needlework with heavy stone embellishments', addPrice: 1400, icon: '💎', popular: true },
          { label: 'Computerized Machine Embroidery', desc: 'High-precision multi-thread floral & geometric patterns', addPrice: 400, icon: '🧵', popular: true },
          { label: 'No Embroidery (Plain Tailoring)', desc: 'Clean, elegant stitching without embroidery work', addPrice: 0, icon: '🪡' },
          { label: 'Custom Combination Work', desc: 'Custom artwork quoted upon design inspection', addPrice: 500, icon: '✨' },
        ],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'bust', label: 'Bust / Chest (cm)', placeholder: '88', tip: 'Around fullest part of chest' },
      { key: 'underbust', label: 'Underbust / Waist (cm)', placeholder: '74', tip: 'Directly below bust line' },
      { key: 'blouseLength', label: 'Blouse Length (cm)', placeholder: '36', tip: 'From shoulder to waist hem' },
      { key: 'frontNeckDepth', label: 'Front Neck Depth (cm)', placeholder: '16', tip: 'Shoulder down to front dip' },
      { key: 'backNeckDepth', label: 'Back Neck Depth (cm)', placeholder: '22', tip: 'Shoulder down to back dip' },
      { key: 'shoulder', label: 'Shoulder Width (cm)', placeholder: '37', tip: 'Shoulder bone to shoulder bone' },
      { key: 'armhole', label: 'Armhole Circumference (cm)', placeholder: '38', tip: 'Around the armpit loop' },
      { key: 'sleeveLength', label: 'Sleeve Length (cm)', placeholder: '26', tip: 'Shoulder down to sleeve hem' },
    ],
  },

  mensCustomization: {
    id: 'mensCustomization',
    label: "Men's Garment Customization",
    category: 'Men & Corporate',
    emoji: '👔',
    basePrice: 450,
    badge: 'Embroidery & Heat Transfer',
    shortDesc: 'Custom logo embroidery, name monogramming, and graphic heat press for shirts, t-shirts, jackets, and traditional kurtas.',
    steps: [
      {
        id: 'garmentItem',
        title: 'Which garment are you customizing?',
        subtitle: 'Select the apparel item',
        type: 'select',
        key: 'garmentType',
        popularCount: 4,
        options: [
          { label: 'Formal / Casual Shirt', desc: 'Chest pocket embroidery or cuff monogram', addPrice: 50, icon: '👔', popular: true },
          { label: 'T-Shirt / Polo', desc: 'Custom DTF graphic or chest emblem', addPrice: 0, icon: '👕', popular: true },
          { label: 'Ethnic Kurta / Sherwani', desc: 'Neck collar embroidery & royal placket work', addPrice: 200, icon: '🥻', popular: true },
          { label: 'Jacket / Blazer / Hoodie', desc: 'Back branding or left chest badge', addPrice: 150, icon: '🧥', popular: true },
          { label: 'Pant / Trouser Monogram', desc: 'Pocket edge initial embroidery', addPrice: 50, icon: '👖' },
          { label: 'Customer Provided Garment', desc: 'You send the garment for studio work', addPrice: 0, icon: '📦' },
        ],
      },
      {
        id: 'customizationTechnique',
        title: 'Choose your personalization technique',
        subtitle: 'Select thread embroidery, digital printing, or heat press',
        type: 'select',
        key: 'technique',
        helpText: 'Embroidery is thread-stitched directly into the fabric; Heat Transfer / DTF allows full-color graphics & photos.',
        options: [
          { label: 'Computerized Thread Embroidery', desc: 'High-precision thread stitched logo or text (never fades)', addPrice: 150, icon: '🧵', popular: true },
          { label: 'HD DTF / Heat Transfer Print', desc: 'Full-color photorealistic print heat-fused to garment', addPrice: 100, icon: '🖨️', popular: true },
          { label: 'Reflective / Metallic Heat Press', desc: 'High-visibility silver or gold chrome film', addPrice: 120, icon: '✨', popular: true },
          { label: 'Combo (Embroidery + Print)', desc: 'Front chest embroidery with full back graphic print', addPrice: 250, icon: '🌟' },
        ],
      },
      {
        id: 'placement',
        title: 'Where should the design be placed?',
        subtitle: 'Select placement position on the garment',
        type: 'visual_grid',
        key: 'placement',
        popularCount: 4,
        options: [
          { label: 'Left Chest (Standard Logo)', icon: '📌', desc: 'Classic 3-4 inch placement', popular: true },
          { label: 'Full Front Center', icon: '🎽', desc: 'Large 10-12 inch graphic', popular: true },
          { label: 'Full Back Center', icon: '🔙', desc: 'Large back graphic/monogram', popular: true },
          { label: 'Collar / Placket', icon: '👔', desc: 'Subtle monogram along collar', popular: true },
          { label: 'Sleeve / Cuff', icon: '📐', desc: 'Subtle wrist or bicep logo' },
          { label: 'Multiple Locations', icon: '⭐', desc: 'Front + Back combination' },
        ],
      },
      {
        id: 'size',
        title: 'How large should the design be?',
        subtitle: 'Select the approximate scale of the artwork',
        type: 'select',
        key: 'designSize',
        options: [
          { label: 'Small (2 – 3.5 inches)', desc: 'Pocket, chest logo, or cuff monogram', addPrice: 0, icon: '🔹' },
          { label: 'Medium (4 – 7 inches)', desc: 'Standard front chest or sleeve logo', addPrice: 80, icon: '🔸' },
          { label: 'Large (8 – 11 inches)', desc: 'Back banner or large front graphic', addPrice: 160, icon: '🔶' },
          { label: 'Extra Large (12+ inches)', desc: 'Full back jacket / hoodie branding', addPrice: 240, icon: '🛑' },
        ],
      },
      {
        id: 'color',
        title: 'Base garment color',
        subtitle: 'Helps us ensure high-contrast thread or ink visibility',
        type: 'chips',
        key: 'garmentColor',
        popularCount: 5,
        options: ['White', 'Black', 'Navy Blue', 'Royal Blue', 'Maroon / Crimson', 'Olive / Bottle Green', 'Grey / Charcoal', 'Beige / Cream', 'Custom Color'],
      },
    ],
    needsMeasurements: false,
  },

  computerEmbroidery: {
    id: 'computerEmbroidery',
    label: 'Computerized Embroidery Atelier',
    category: 'Embroidery & Zari',
    emoji: '🧵',
    basePrice: 200,
    badge: 'Multi-Thread Precision',
    shortDesc: 'High-precision computer embroidery for sarees, blouses, kurtis, dupattas, corporate apparel, and custom logo patches.',
    steps: [
      {
        id: 'item',
        title: 'What item are you embroidering?',
        subtitle: 'Select the fabric or apparel item',
        type: 'chips',
        key: 'targetItem',
        popularCount: 4,
        options: ['Bridal Blouse Piece', 'Saree / Saree Border', 'Silk Dupatta', 'Kurti / Salwar', 'Men’s Shirt / Kurta', 'T-Shirt / Polo', 'School / Corporate Uniform', 'Caps / Bags / Accessories'],
      },
      {
        id: 'type',
        title: 'What type of embroidery pattern do you need?',
        subtitle: 'Select the nature of the embroidery work',
        type: 'visual_grid',
        key: 'embroideryType',
        popularCount: 4,
        options: [
          { label: 'Brand / Company Logo', icon: '🏢', desc: 'Precision vector logo', popular: true },
          { label: 'Personal Name / Monogram', icon: '✍️', desc: 'Cursive or block typography', popular: true },
          { label: 'Maggam-Style Zari Pattern', icon: '🪡', desc: 'Traditional South Indian motif', popular: true },
          { label: 'Floral & Vine Border', icon: '🌸', desc: 'Continuous running border', popular: true },
          { label: 'Peacock / Temple Motif', icon: '🦚', desc: 'Buttis & temple motifs' },
          { label: 'Custom Artwork Vector', icon: '🎨', desc: 'Stitched from your image' },
        ],
      },
      {
        id: 'threads',
        title: 'Select thread & zari colors',
        subtitle: 'Choose accent thread tones',
        type: 'chips',
        key: 'threadPalette',
        popularCount: 4,
        options: ['Gold Zari (Metallic)', 'Silver / White Zari', 'Antique Copper Zari', 'Multi-Color Silk Threads', 'Monochrome Single Thread', 'Fluorescent / Vibrant Shades', 'Tonal Self-Color'],
      },
      {
        id: 'size',
        title: 'Embroidery size & stitch density',
        subtitle: 'Select scale and coverage',
        type: 'select',
        key: 'embroideryScale',
        options: [
          { label: 'Compact Logo / Butti (< 3 in)', desc: 'Pocket logo or scattered small buttis', addPrice: 0, icon: '🔹' },
          { label: 'Medium Pattern (4 – 7 in)', desc: 'Neckline border or sleeve motif', addPrice: 120, icon: '🔸' },
          { label: 'Large Work (8 – 12 in)', desc: 'Full back motif or grand saree border', addPrice: 250, icon: '🔶' },
          { label: 'Heavy All-Over Density', desc: 'Full bridal blouse or heavy dupatta work', addPrice: 500, icon: '👑' },
        ],
      },
    ],
    needsMeasurements: false,
  },

  dtfPrinting: {
    id: 'dtfPrinting',
    label: 'DTF Printing & Heat Press',
    category: 'Digital Apparel Printing',
    emoji: '🖨️',
    basePrice: 150,
    badge: 'Full Color HD Transfers',
    shortDesc: 'High-definition direct-to-film digital printing with vivid colors, fine photographic details, and stretch-resistant wash durability.',
    steps: [
      {
        id: 'product',
        title: 'Select product type for printing',
        subtitle: 'Choose the garment or fabric for DTF heat press',
        type: 'chips',
        key: 'dtfProduct',
        popularCount: 4,
        options: ['Cotton T-Shirt', 'Polyester / Dry-Fit Jersey', 'Hoodie / Sweatshirt', 'Cotton Tote Bag', 'Silk / Satin Fabric', 'Cap / Hat', 'Apron / Uniform', 'Other Substrate'],
      },
      {
        id: 'placement',
        title: 'Where should we print the design?',
        subtitle: 'Select print placement on garment',
        type: 'visual_grid',
        key: 'printPlacement',
        popularCount: 4,
        options: [
          { label: 'Left Chest (Pocket Size)', icon: '📍', desc: '3.5 x 3.5 inches', popular: true },
          { label: 'Front Center (Standard A4)', icon: '🎯', desc: '8.5 x 11 inches', popular: true },
          { label: 'Full Front Poster (A3)', icon: '🔲', desc: '11 x 16 inches', popular: true },
          { label: 'Full Back (A3 Size)', icon: '🛡️', desc: '11 x 16 inches large print', popular: true },
          { label: 'Upper Back Nape', icon: '🔝', desc: '3 x 3 inches logo' },
          { label: 'Sleeve Print', icon: '💪', desc: 'Long or badge format' },
          { label: 'Front & Back Combo', icon: '⭐', desc: 'Small chest + large back', addPrice: 100 },
        ],
      },
      {
        id: 'garmentColor',
        title: 'Garment background color',
        subtitle: 'Helps us apply white ink underbase where required',
        type: 'chips',
        key: 'garmentColor',
        popularCount: 4,
        options: ['White / Off-White', 'Black / Charcoal', 'Dark Navy / Royal Blue', 'Red / Maroon', 'Pastel / Light Shades', 'Heather Grey', 'Custom Color'],
      },
    ],
    needsMeasurements: false,
  },

  fabricPrinting: {
    id: 'fabricPrinting',
    label: 'Digital & Fabric Roll Printing',
    category: 'Textile Printing',
    emoji: '🎨',
    basePrice: 300,
    badge: 'Custom Textile Runs',
    shortDesc: 'Custom textile digital printing for silk sarees, dupattas, running fabric yardage, and bespoke designer patterns.',
    steps: [
      {
        id: 'fabric',
        title: 'Select your fabric base',
        subtitle: 'Choose the textile base for digital printing',
        type: 'chips',
        key: 'fabricBase',
        popularCount: 5,
        options: ['Pure Silk / Tabby', 'Georgette', 'Chiffon', 'Organza', 'Cotton Silk', 'Satin', 'Rayon / Viscose', 'Canvas / Duck Cotton', 'Customer Supplied Fabric'],
      },
      {
        id: 'quantity',
        title: 'How much fabric length is required?',
        subtitle: 'Select length needed for printing',
        type: 'select',
        key: 'fabricLength',
        options: [
          { label: '1 – 3 Meters (Dupatta / Scarf)', desc: 'Standard single piece print', addPrice: 0, icon: '🧣' },
          { label: '5.5 – 6.5 Meters (Full Saree)', desc: 'Continuous print with border/pallu alignment', addPrice: 250, icon: '🥻' },
          { label: '10 – 25 Meters (Designer Collection)', desc: 'Boutique short roll yardage', addPrice: 600, icon: '🧵' },
          { label: '50+ Meters (Bulk Commercial Roll)', desc: 'Large production run', addPrice: 1200, icon: '🏭' },
        ],
      },
      {
        id: 'style',
        title: 'Printing style & pattern layout',
        subtitle: 'Select pattern orientation',
        type: 'visual_grid',
        key: 'printStyle',
        options: [
          { label: 'Seamless Pattern Repeat', icon: '🔁', desc: 'Continuous all-over tile' },
          { label: 'Placement Border & Pallu', icon: '🖼️', desc: 'Engineered for sarees' },
          { label: 'Digital Photo Mural', icon: '📸', desc: 'High-res non-repeating image' },
          { label: 'Geometric / Floral Buttis', icon: '🌸', desc: 'Spaced motifs' },
        ],
      },
    ],
    needsMeasurements: false,
  },

  kurti: {
    id: 'kurti',
    label: 'Kurti & Ethnic Dress Customization',
    category: "Women's Fashion",
    emoji: '👘',
    basePrice: 400,
    badge: 'Custom Fits & Cuts',
    shortDesc: 'Custom tailored kurtis, Anarkalis, and ethnic dresses crafted to your silhouette with custom necklines, sleeves, and delicate embroidery.',
    steps: [
      {
        id: 'silhouette',
        title: 'Choose your dress silhouette',
        subtitle: 'Select kurti or dress cut',
        type: 'visual_grid',
        key: 'kurtiStyle',
        popularCount: 4,
        options: [
          { label: 'Straight Cut Kurti', icon: '📏', desc: 'Side slits, daily & office wear', popular: true },
          { label: 'Anarkali Dress', icon: '👗', desc: 'Pleated royal flare', popular: true },
          { label: 'A-Line Kurti', icon: '📐', desc: 'Flared bottom comfort', popular: true },
          { label: 'Chudidar / Salwar Suit', icon: '🧵', desc: 'Top + Pant 2-piece set', addPrice: 150, popular: true },
          { label: 'Angrakha Wrap Style', icon: '🥻', desc: 'Traditional crossover tie' },
          { label: 'Floor-Length Gown', icon: '🌟', desc: 'Festive occasion wear' },
        ],
      },
      {
        id: 'fabric',
        title: 'Choose fabric type',
        subtitle: 'Select garment material',
        type: 'chips',
        key: 'fabricType',
        popularCount: 4,
        options: ['Cotton', 'Silk Blend', 'Georgette', 'Chanderi', 'Rayon', 'Linen', 'Velvet', 'Customer Provided Material'],
      },
      {
        id: 'neck',
        title: 'Select neckline cut',
        subtitle: 'Choose neckline pattern',
        type: 'chips',
        key: 'neckCut',
        popularCount: 4,
        options: ['Round Neck with Slit', 'V Neck', 'Keyhole Neck', 'Mandarin Collar', 'Boat Neck', 'Sweetheart', 'Angrakha V-Cut'],
      },
      {
        id: 'sleeve',
        title: 'Select sleeve length',
        subtitle: 'Choose sleeve cut',
        type: 'chips',
        key: 'sleeveCut',
        popularCount: 3,
        options: ['3/4 Sleeve (Standard)', 'Short Sleeve', 'Sleeveless', 'Full Length Sleeve', 'Bell Flared Sleeve'],
      },
      {
        id: 'embellishment',
        title: 'Optional embroidery or print add-ons',
        subtitle: 'Add decorative highlights',
        type: 'select',
        key: 'kurtiEmbellishment',
        options: [
          { label: 'Plain Stitching (No Add-ons)', desc: 'Clean master tailor finish', addPrice: 0, icon: '✂️' },
          { label: 'Yoke / Neckline Computer Embroidery', desc: 'Delicate threadwork around neckline', addPrice: 250, icon: '🌸' },
          { label: 'Sleeve Border & Hem Embroidery', desc: 'Coordinated threadwork on borders', addPrice: 300, icon: '🧵' },
          { label: 'Custom Digital Motif Print', desc: 'Printed accents on chest/hem', addPrice: 200, icon: '🖨️' },
        ],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'bust', label: 'Bust / Chest (cm)', placeholder: '92', tip: 'Fullest chest circumference' },
      { key: 'waist', label: 'Waist (cm)', placeholder: '78', tip: 'Natural waistline' },
      { key: 'hips', label: 'Hips (cm)', placeholder: '98', tip: 'Fullest hip circumference' },
      { key: 'shoulder', label: 'Shoulder Width (cm)', placeholder: '38', tip: 'Across back shoulders' },
      { key: 'armLength', label: 'Arm Length (cm)', placeholder: '42', tip: 'Shoulder to desired sleeve hem' },
      { key: 'kurtiLength', label: 'Total Kurti Length (cm)', placeholder: '105', tip: 'Shoulder down to bottom hem' },
    ],
  },

  lehenga: {
    id: 'lehenga',
    label: 'Lehenga & Royal Bridal Wear',
    category: 'Haute Bridal',
    emoji: '👡',
    basePrice: 900,
    badge: 'Royal Wedding Couture',
    shortDesc: 'Heavy bridal lehengas, reception gowns, and festive half-sarees with can-can layering, Maggam embroidery, and luxury zari detailing.',
    steps: [
      {
        id: 'type',
        title: 'Select bridal attire type',
        subtitle: 'Choose your wedding outfit category',
        type: 'visual_grid',
        key: 'bridalType',
        options: [
          { label: 'Bridal Wedding Lehenga', icon: '👑', desc: 'Heavy flare & bridal can-can', addPrice: 400 },
          { label: 'Reception Designer Lehenga', icon: '✨', desc: 'Modern sparkle & sequin finish', addPrice: 300 },
          { label: 'Sangeet / Mehendi Outfit', icon: '💃', desc: 'Lightweight movement & bright tones', addPrice: 200 },
          { label: 'Traditional Half-Saree (Langa Voni)', icon: '🥻', desc: 'South Indian silk zari ensemble', addPrice: 250 },
        ],
      },
      {
        id: 'intensity',
        title: 'Choose Maggam embroidery work intensity',
        subtitle: 'Select the density of handcrafted needlework',
        type: 'select',
        key: 'workIntensity',
        options: [
          { label: 'Heavy Bridal Maggam & Zardosi', desc: 'Intricate 3D gold zari, cutdana & stones across skirt & blouse', addPrice: 2500, icon: '👑' },
          { label: 'All-Over Mirror & Threadwork', desc: 'Festive sparkle with dense floral embroidery', addPrice: 1800, icon: '💎' },
          { label: 'Moderate Border & Butti Work', desc: 'Rich hemline border with scattered buttis', addPrice: 1000, icon: '🌸' },
          { label: 'Minimal Border Stitching', desc: 'Clean tailoring with pre-embroidered fabric', addPrice: 300, icon: '✂️' },
        ],
      },
      {
        id: 'fabric',
        title: 'Choose primary fabric',
        subtitle: 'Select luxury fabric base',
        type: 'chips',
        key: 'fabricType',
        popularCount: 4,
        options: ['Heavy Bridal Velvet', 'Raw Silk / Kanjivaram Silk', 'Net with Double Satin Lining', 'Pure Georgette', 'Organza Silk', 'Brocade / Jacquard'],
      },
      {
        id: 'color',
        title: 'Select bridal color palette',
        subtitle: 'Choose primary color theme',
        type: 'chips',
        key: 'colorTheme',
        popularCount: 4,
        options: ['Crimson Red', 'Royal Maroon', 'Bridal Rose Pink', 'Emerald Green', 'Mustard / Haldi Gold', 'Pastel Peach / Mint', 'Royal Purple', 'Custom Shade'],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'lehengaWaist', label: 'Lehenga Waist (cm)', placeholder: '76', tip: 'Where lehenga skirt sits' },
      { key: 'lehengaLength', label: 'Lehenga Skirt Length (cm)', placeholder: '102', tip: 'Waist down to floor' },
      { key: 'blouseBust', label: 'Blouse Bust (cm)', placeholder: '88', tip: 'Bust circumference' },
      { key: 'blouseLength', label: 'Blouse Length (cm)', placeholder: '36', tip: 'Shoulder to blouse hem' },
      { key: 'hipCircumference', label: 'Hip Circumference (cm)', placeholder: '96', tip: 'Around fullest hip' },
    ],
  },

  saree: {
    id: 'saree',
    label: 'Saree Embroidery & Customization',
    category: 'Saree Atelier',
    emoji: '🥻',
    basePrice: 600,
    badge: 'Border, Pallu & Tassels',
    shortDesc: 'Custom handcrafted Maggam border needlework, grand pallu zari highlights, designer saree kuchu tassels, and matching embroidered blouse pieces.',
    steps: [
      {
        id: 'sareeType',
        title: 'Select saree base type',
        subtitle: 'Choose fabric or saree style',
        type: 'chips',
        key: 'sareeType',
        popularCount: 4,
        options: ['Kanjivaram Silk Saree', 'Banarasi Silk Saree', 'Organza / Tissue Saree', 'Georgette / Chiffon Saree', 'Cotton Silk Saree', 'Plain Dyed Saree for Custom Work'],
      },
      {
        id: 'borderWork',
        title: 'Border customization',
        subtitle: 'Choose border enhancement',
        type: 'select',
        key: 'borderWork',
        options: [
          { label: 'Handcrafted Maggam Work Border', desc: 'Gold Zari, cutdana & bead work along entire saree length', addPrice: 1500, icon: '👑' },
          { label: 'Cutwork Zardosi Scallop Border', desc: 'Artistic scalloped edge needlework', addPrice: 1800, icon: '💎' },
          { label: 'Computerized Embroidery Border', desc: 'Precision machine floral/geometric border', addPrice: 600, icon: '🧵' },
          { label: 'Traditional Saree Kuchu (Tassels Only)', desc: 'Silk thread crochet tassels on pallu edge', addPrice: 350, icon: '🎀' },
          { label: 'No Border Work Required', desc: 'Focus on pallu or blouse only', addPrice: 0, icon: '⚪' },
        ],
      },
      {
        id: 'palluWork',
        title: 'Pallu work customization',
        subtitle: 'Enhance the grand drape area',
        type: 'select',
        key: 'palluWork',
        options: [
          { label: 'Grand Maggam Motif Pallu', desc: 'Heavy centerpiece peacock / temple / floral motif', addPrice: 1600, icon: '🦚' },
          { label: 'Personalized Name / Wedding Date Embroidery', desc: 'Embroidered bride & groom names on pallu corner', addPrice: 450, icon: '✍️' },
          { label: 'Zari Stone Highlights', desc: 'Hand stone pasting on existing zari pallu', addPrice: 600, icon: '✨' },
          { label: 'Standard Pallu (No Extra Work)', desc: 'Retain original pallu', addPrice: 0, icon: '⚪' },
        ],
      },
      {
        id: 'blouseCombo',
        title: 'Matching blouse piece work',
        subtitle: 'Add coordinated blouse embroidery',
        type: 'select',
        key: 'blouseCombo',
        options: [
          { label: 'Full Coordinated Maggam Blouse', desc: 'Front neck, deep back & both elbow sleeves embroidered', addPrice: 1200, icon: '👑' },
          { label: 'Sleeve & Neckline Embroidery Only', desc: 'Clean matching highlights for blouse', addPrice: 700, icon: '🧵' },
          { label: 'Plain Stitching without Embroidery', desc: 'Basic blouse tailored to measurements', addPrice: 400, icon: '✂️' },
          { label: 'No Blouse Work Needed', desc: 'Saree work only', addPrice: 0, icon: '⚪' },
        ],
      },
    ],
    needsMeasurements: false,
  },
}

const serviceList = Object.values(SERVICE_CONFIG)

export default function Customize() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { id: routeDesignId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [selectedServiceKey, setSelectedServiceKey] = useState('blouse')
  const [activeStepId, setActiveStepId] = useState('service') // 'service', 'options', 'measurements', 'uploads', 'review'
  const [formData, setFormData] = useState({})
  const [measurements, setMeasurements] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({}) // track "View More" toggles per question
  const [showAdvisor, setShowAdvisor] = useState(false) // "Help Me Choose" assistant modal
  const [advisorArtworkType, setAdvisorArtworkType] = useState('')
  
  // Persistent reference design state
  const [referenceDesign, setReferenceDesign] = useState(null)
  const [designNotFound, setDesignNotFound] = useState(false)
  const [missingDesignId, setMissingDesignId] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)

  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)

  // 1. Initial URL Params & Persistent Draft Loader
  useEffect(() => {
    let isCancelled = false

    async function initializeStudio() {
      setInitialLoading(true)
      setDesignNotFound(false)
      setMissingDesignId('')

      const rawDesignParam = searchParams.get('designId') || searchParams.get('design') || searchParams.get('productId') || searchParams.get('id') || routeDesignId || location.state?.designId || location.state?.product?._id
      const designParam = rawDesignParam ? String(rawDesignParam).trim() : null

      const rawServiceParam = searchParams.get('service') || searchParams.get('serviceId') || location.state?.serviceId
      const serviceParam = rawServiceParam ? String(rawServiceParam).trim() : null

      const stepParam = searchParams.get('step') || location.state?.step

      // =========================================================================
      // FLOW A: GENERIC CUSTOMIZER STUDIO (Direct / navbar / google / link)
      // =========================================================================
      if (!designParam) {
        setDesignNotFound(false)
        setReferenceDesign(null)

        if (serviceParam) {
          setSelectedServiceKey(normalizeServiceKey(serviceParam))
          setActiveStepId(stepParam || 'options')
        } else {
          // Direct generic visit: Step 1 (or restore existing user draft)
          try {
            const savedDraft = localStorage.getItem('slv_customize_draft')
            if (savedDraft) {
              const parsed = JSON.parse(savedDraft)
              if (parsed.selectedServiceKey && SERVICE_CONFIG[parsed.selectedServiceKey]) {
                setSelectedServiceKey(parsed.selectedServiceKey)
                if (parsed.activeStepId) setActiveStepId(parsed.activeStepId)
                if (parsed.formData) setFormData(parsed.formData)
                if (parsed.measurements) setMeasurements(parsed.measurements)
                if (parsed.specialInstructions) setSpecialInstructions(parsed.specialInstructions)
              }
            } else {
              setSelectedServiceKey('blouse')
              setActiveStepId('service')
            }
          } catch (e) {
            setSelectedServiceKey('blouse')
            setActiveStepId('service')
          }
        }

        setInitialLoading(false)
        return
      }

      // =========================================================================
      // FLOW B: SPECIFIC DESIGN FLOW (Explicit design ID requested in URL)
      // =========================================================================
      let foundDesign = location.state?.product || null

      // 1. Look in Lookbook gallery master items
      if (!foundDesign) {
        try {
          const galleryItems = await getUnifiedGalleryItems('all')
          foundDesign = galleryItems.find((item) => String(item._id) === designParam || String(item.id) === designParam)
        } catch (e) {
          console.warn('Gallery search error:', e)
        }
      }

      // 2. Look in remote products API (by ID or slug)
      if (!foundDesign) {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(designParam)
        if (isHexId) {
          try {
            const res = await api.get(`/products/${designParam}`)
            if (res.data?.product) {
              foundDesign = res.data.product
            }
          } catch (e) {
            console.warn('Product direct search error:', e)
          }
        }

        // Full catalog slug & name search
        if (!foundDesign) {
          try {
            const res = await api.get('/products?limit=100')
            const products = res.data?.products || []
            foundDesign = products.find(
              (p) =>
                p._id === designParam ||
                p.slug === designParam ||
                (p.name && p.name.toLowerCase() === designParam.toLowerCase()) ||
                (p.slug && p.slug.toLowerCase() === designParam.toLowerCase())
            ) || null
          } catch (e) {
            console.warn('Catalog slug lookup error:', e)
          }
        }
      }

      // 3. Look in local cart storage
      if (!foundDesign) {
        try {
          const cart = JSON.parse(localStorage.getItem('slv_cart') || '[]')
          const cartMatch = cart.find((item) => String(item.product?._id) === designParam)
          if (cartMatch?.product) foundDesign = cartMatch.product
        } catch (e) {
          console.warn('Cart lookup error:', e)
        }
      }

      if (isCancelled) return

      if (foundDesign) {
        // Design located successfully
        setDesignNotFound(false)
        setReferenceDesign(foundDesign)
        const mappedService = foundDesign.category?.name
          ? normalizeServiceKey(foundDesign.category.name)
          : foundDesign.category
          ? normalizeServiceKey(foundDesign.category)
          : 'blouse'
        const targetService = serviceParam ? normalizeServiceKey(serviceParam) : mappedService
        setSelectedServiceKey(targetService)
        setActiveStepId(stepParam || 'options')
        if (foundDesign.url || foundDesign.images?.[0]?.url) {
          setFormData((prev) => ({
            ...prev,
            referenceImageTitle: foundDesign.title || foundDesign.name,
            referenceImageUrl: foundDesign.url || foundDesign.images?.[0]?.url
          }))
        }
      } else {
        // Explicit design ID requested but not found in any central store
        setDesignNotFound(true)
        setMissingDesignId(designParam)
        setReferenceDesign(null)
      }

      setInitialLoading(false)
    }

    initializeStudio()

    return () => {
      isCancelled = true
    }
  }, [searchParams, location.state, routeDesignId])

  // 2. Persistent Local Storage Auto-Saver for Drafts
  useEffect(() => {
    if (initialLoading) return
    try {
      const draft = {
        selectedServiceKey,
        activeStepId,
        formData,
        measurements,
        specialInstructions,
        quantity,
        deliveryDate,
        expressDelivery,
        giftWrap,
        referenceDesign,
        updatedAt: Date.now(),
      }
      localStorage.setItem('slv_customize_draft', JSON.stringify(draft))
    } catch (e) {
      console.warn('Draft save error:', e)
    }
  }, [selectedServiceKey, activeStepId, formData, measurements, specialInstructions, quantity, deliveryDate, expressDelivery, giftWrap, referenceDesign, initialLoading])

  const activeService = SERVICE_CONFIG[selectedServiceKey] || SERVICE_CONFIG.blouse

  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }

  const toggleGroupExpand = (groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }))
  }

  const handleFileChange = (slot, file) => {
    setUploadedFiles((prev) => ({ ...prev, [slot]: file }))
  }

  const handleSelectService = (key) => {
    setSelectedServiceKey(key)
    setFormData({})
    setMeasurements({})
    setUploadedFiles({})
    setActiveStepId('options')
    setSearchParams({ service: key })
  }

  // 3. Robust Add to Bag Flow (Price To Be Confirmed By Studio)
  const handleAddToCart = () => {
    const customProduct = {
      _id: `custom_${activeService.id}_${Date.now()}`,
      name: referenceDesign ? `${referenceDesign.title || referenceDesign.name} (Bespoke Customization)` : `Bespoke ${activeService.label}`,
      price: 0,
      isCustomQuote: true,
      priceDisplay: 'To be confirmed by SLV Fashion Studio',
      offerPrice: null,
      images: referenceDesign?.url
        ? [{ url: referenceDesign.url, alt: referenceDesign.title }]
        : (referenceDesign?.images?.length ? referenceDesign.images : [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800' }]),
      category: { name: activeService.category || "Custom Boutique" },
      customization: {
        serviceId: activeService.id,
        serviceName: activeService.label,
        isPriceToConfirm: true,
        priceText: 'To be confirmed by SLV Fashion Studio',
        referenceDesignId: referenceDesign?._id || referenceDesign?.id,
        referenceDesignTitle: referenceDesign?.title || referenceDesign?.name,
        options: formData,
        measurements: activeService.needsMeasurements ? measurements : null,
        specialInstructions,
        quantity,
        deliveryDate,
        expressDelivery,
        giftWrap,
      },
    }

    dispatch(addToCart({ product: customProduct, quantity: 1 }))
    dispatch(openCart())
    toast.success(`Custom request for ${activeService.label} added to your bag! 🛍️`)

    // Clear saved draft
    try {
      localStorage.removeItem('slv_customize_draft')
    } catch (e) {}
  }

  // Advisor recommendation generator
  const applyAdvisorRecommendation = () => {
    if (advisorArtworkType === 'logo') {
      updateField('technique', 'Computerized Embroidery')
      toast.success('Recommended Computerized Embroidery applied for your logo! ✨')
    } else if (advisorArtworkType === 'photo') {
      updateField('technique', 'HD DTF / Heat Transfer')
      toast.success('Recommended HD DTF Printing applied for full-color artwork! ✨')
    } else {
      updateField('technique', 'Let SLV Master Artisan Recommend')
      toast.success('Our Master Artisan will review your design! ✨')
    }
    setShowAdvisor(false)
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 5)

  // Guided Steps Config
  const flowSteps = [
    { id: 'service', label: '1. Service', icon: Package },
    { id: 'options', label: '2. Customize', icon: Palette },
    ...(activeService.needsMeasurements ? [{ id: 'measurements', label: '3. Fit & Sizes', icon: Ruler }] : []),
    { id: 'uploads', label: activeService.needsMeasurements ? '4. Upload' : '3. Upload', icon: Upload },
    { id: 'review', label: activeService.needsMeasurements ? '5. Review' : '4. Review', icon: ShoppingCart },
  ]

  const currentStepIndex = flowSteps.findIndex((s) => s.id === activeStepId)

  // Full screen Design Not Found state when an explicit invalid design ID was requested
  if (designNotFound) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#111827] flex items-center justify-center px-4 py-16">
        <div className="text-center p-8 sm:p-10 bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-700 max-w-lg shadow-card">
          <div className="w-16 h-16 bg-[#FFF5F9] dark:bg-pink-950/40 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-pink-600">
            👗
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
            Design Notice
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2937] dark:text-white mb-2">
            Design Reference Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-charcoal-400 mb-6 leading-relaxed">
            The requested design reference {missingDesignId ? `("${missingDesignId}") ` : ''}could not be found in our active collection. You can start a fresh custom order below or explore our ready-to-wear catalog.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setDesignNotFound(false)
                setMissingDesignId('')
                setReferenceDesign(null)
                setSearchParams({})
                navigate('/customize', { replace: true })
                setActiveStepId('service')
              }}
              className="btn-primary text-xs py-3 px-6 font-bold shadow-soft"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Start Customization Studio
            </button>
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary text-xs py-3 px-6 font-bold"
            >
              <Package className="w-4 h-4 mr-1.5" /> Browse Product Catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#111827] pb-24 md:pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1F2937] border-b border-[#E8EAF0] dark:border-slate-800 py-10 shadow-subtle">
        <div className="section-container text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFF1F6] dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 text-[#C52E74] dark:text-pink-300 text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>Interactive Bespoke Studio</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#252A34] dark:text-white mb-2">
            Customize <span className="text-gradient-pink">Your Style</span>
          </h1>
          <p className="text-[#64707D] dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A simple 4-step studio to customize your bridal blouses, embroidery, apparel printing, and bespoke fittings.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        
        {/* ========================================================================= */}
        {/* PROGRESS STEPPER (Always know where you are & how many steps remain)      */}
        {/* ========================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2 max-w-4xl mx-auto">
            {flowSteps.map((s, idx) => {
              const Icon = s.icon
              const isCurrent = activeStepId === s.id
              const isPast = idx < currentStepIndex

              return (
                <div key={s.id} className="flex items-center flex-1 min-w-[120px]">
                  <button
                    onClick={() => {
                      if (isPast) setActiveStepId(s.id)
                    }}
                    disabled={!isPast && !isCurrent}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all w-full justify-center ${
                      isCurrent
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft ring-2 ring-pink-400/20'
                        : isPast
                        ? 'bg-white dark:bg-slate-800 text-pink-600 border border-pink-200 hover:bg-[#FFF1F6] cursor-pointer'
                        : 'bg-white/60 dark:bg-slate-800/40 text-[#94A3B8] border border-[#E8EAF0] cursor-not-allowed'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 text-pink-600" /> : <Icon className="w-3.5 h-3.5" />}
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                  {idx < flowSteps.length - 1 && (
                    <div className={`w-3 h-0.5 mx-1 flex-shrink-0 ${idx < currentStepIndex ? 'bg-pink-400' : 'bg-[#E8EAF0] dark:bg-slate-700'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reference Design Active Banner (When Flow B has found a reference design) */}
        {referenceDesign && (
          <div className="mb-6 max-w-4xl mx-auto bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-subtle">
            <div className="flex items-center gap-3 min-w-0">
              {(referenceDesign.url || referenceDesign.images?.[0]?.url) ? (
                <img
                  src={referenceDesign.url || referenceDesign.images?.[0]?.url}
                  alt={referenceDesign.title || referenceDesign.name}
                  className="w-12 h-12 rounded-xl object-cover border border-pink-200 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-pink-200 dark:bg-pink-900 flex items-center justify-center text-pink-700 dark:text-pink-300 font-bold flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="badge bg-pink-500 text-white text-[9px] font-bold uppercase">Reference Design Selected</span>
                </div>
                <p className="font-display font-bold text-sm text-[#1F2937] dark:text-white truncate">
                  {referenceDesign.title || referenceDesign.name || 'Selected Design'}
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400">
                  Customizing options & measurements for this inspiration piece.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setReferenceDesign(null)
                setSearchParams({})
                navigate('/customize', { replace: true })
              }}
              className="text-xs text-pink-600 dark:text-pink-400 hover:underline font-bold flex-shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN STUDIO 2-COLUMN LAYOUT                                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLS: GUIDED STEP CONTENT */}
          <div className="lg:col-span-8 space-y-6">

            {/* =================================================================== */}
            {/* STEP 1: SERVICE SELECTION                                           */}
            {/* =================================================================== */}
            {activeStepId === 'service' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
              >
                <div>
                  <span className="badge-soft text-[10px] font-bold uppercase mb-2">Step 1 of 4</span>
                  <h2 className="font-display text-2xl font-bold text-[#252A34] dark:text-white">
                    What would you like to create or customize?
                  </h2>
                  <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                    Select a service below to open its dedicated customization questions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceList.map((svc) => {
                    const isSelected = selectedServiceKey === svc.id
                    return (
                      <button
                        key={svc.id}
                        onClick={() => handleSelectService(svc.id)}
                        className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 group ${
                          isSelected
                            ? 'border-pink-500 bg-[#FFF1F6]/50 dark:bg-pink-950/20 ring-2 ring-pink-500/20 shadow-card'
                            : 'border-[#E8EAF0] dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-pink-300 hover:shadow-subtle'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF1F6] dark:bg-pink-950/40 text-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          {svc.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-sm text-[#252A34] dark:text-white group-hover:text-pink-600 transition-colors">
                              {svc.label}
                            </h3>
                          </div>
                          <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1 line-clamp-2">
                            {svc.shortDesc}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 mt-2">
                            Select & Customize →
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STEP 2: DESIGN & STYLING QUESTIONS (Grouped & Guided)              */}
            {/* =================================================================== */}
            {activeStepId === 'options' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-8"
              >
                {/* Active Service Banner & Change Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#F7F8FA] dark:bg-slate-800 rounded-2xl border border-[#E8EAF0]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeService.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-[#252A34] dark:text-white">{activeService.label}</p>
                      <p className="text-[11px] text-[#64707D] dark:text-slate-400">{activeService.badge}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStepId('service')}
                    className="text-xs text-pink-600 dark:text-pink-400 font-bold hover:underline"
                  >
                    Change Service
                  </button>
                </div>

                <div>
                  <span className="badge-soft text-[10px] font-bold uppercase mb-2">Step 2 of 4</span>
                  <h2 className="font-display text-2xl font-bold text-[#252A34] dark:text-white">
                    Customize Your Design Choices
                  </h2>
                  <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                    Tap your preferred options. Popular choices are shown first for simplicity.
                  </p>
                </div>

                {/* Question Blocks */}
                {activeService.steps.map((st, stepNum) => {
                  const selectedVal = formData[st.key]
                  const isExpanded = expandedGroups[st.key] || false
                  const hasMore = st.popularCount && st.options.length > st.popularCount
                  const visibleOptions = hasMore && !isExpanded
                    ? st.options.slice(0, st.popularCount)
                    : st.options

                  return (
                    <div key={st.id} className="pt-6 border-t border-[#E8EAF0] dark:border-slate-800 first:border-0 first:pt-0">
                      
                      {/* Title & Selected Indicator */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#FFF1F6] dark:bg-pink-950/40 text-pink-600 text-[10px] flex items-center justify-center font-bold">
                            {stepNum + 1}
                          </span>
                          {st.title}
                        </label>
                        {selectedVal && (
                          <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Selected: {selectedVal}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#64707D] dark:text-slate-400 mb-3">{st.subtitle}</p>

                      {/* Tooltip / "What's this?" if present */}
                      {st.helpText && (
                        <div className="mb-4 p-3 bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 rounded-xl text-[11px] text-[#64707D] dark:text-slate-300 flex items-start gap-2">
                          <Info className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                          <span>{st.helpText}</span>
                        </div>
                      )}

                      {/* "Not sure? Help Me Choose" recommendation trigger */}
                      {st.hasAdvisor && (
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={() => setShowAdvisor(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-[#FFF1F6] px-3 py-1.5 rounded-lg border border-pink-200"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                            Not sure which technique to pick? Click here for a quick recommendation
                          </button>
                        </div>
                      )}

                      {/* TYPE 1: SELECT CARDS */}
                      {st.type === 'select' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {visibleOptions.map((opt) => {
                            const isOptSelected = selectedVal === opt.label
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => updateField(st.key, opt.label)}
                                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                                  isOptSelected
                                    ? 'border-pink-500 bg-[#FFF1F6]/50 dark:bg-pink-950/20 shadow-soft ring-1 ring-pink-500'
                                    : 'border-[#E8EAF0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300'
                                }`}
                              >
                                <span className="text-xl flex-shrink-0">{opt.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-[#252A34] dark:text-white">{opt.label}</p>
                                  </div>
                                  <p className="text-[11px] text-[#64707D] dark:text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* TYPE 2: VISUAL GRID CARDS (Necklines, Placements, Silhouettes) */}
                      {st.type === 'visual_grid' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {visibleOptions.map((opt) => {
                            const isOptSelected = selectedVal === opt.label
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => updateField(st.key, opt.label)}
                                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                                  isOptSelected
                                    ? 'border-pink-500 bg-[#FFF1F6]/60 dark:bg-pink-950/30 shadow-soft ring-1 ring-pink-500'
                                    : 'border-[#E8EAF0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300'
                                }`}
                              >
                                <span className="text-2xl mb-1.5">{opt.icon}</span>
                                <p className="text-xs font-bold text-[#252A34] dark:text-white leading-snug">{opt.label}</p>
                                {opt.desc && (
                                  <p className="text-[10px] text-[#64707D] dark:text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* TYPE 3: VISUAL PILL CHIPS */}
                      {st.type === 'chips' && (
                        <div className="flex flex-wrap gap-2">
                          {visibleOptions.map((opt) => {
                            const isOptSelected = selectedVal === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateField(st.key, opt)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                                  isOptSelected
                                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white border-transparent shadow-soft font-bold'
                                    : 'border-[#E8EAF0] dark:border-slate-700 bg-[#F7F8FA] dark:bg-slate-800 text-[#252A34] dark:text-slate-200 hover:border-pink-300'
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* "View More Options" Progressive Disclosure Toggle */}
                      {hasMore && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleGroupExpand(st.key)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700"
                          >
                            {isExpanded ? (
                              <>Show Fewer Options <ChevronUp className="w-3.5 h-3.5" /></>
                            ) : (
                              <>+ View All {st.options.length} Options <ChevronDown className="w-3.5 h-3.5" /></>
                            )}
                          </button>
                        </div>
                      )}

                    </div>
                  )
                })}

                {/* Forward / Back Navigation */}
                <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                  <button
                    type="button"
                    onClick={() => setActiveStepId('service')}
                    className="btn-secondary text-xs px-6 py-3 font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Change Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepId(activeService.needsMeasurements ? 'measurements' : 'uploads')}
                    className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                  >
                    {activeService.needsMeasurements ? 'Next: Measurements & Fit' : 'Next: Upload Artwork'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STEP 3: MEASUREMENTS & SIZING (If applicable)                       */}
            {/* =================================================================== */}
            {activeStepId === 'measurements' && activeService.needsMeasurements && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
              >
                <div>
                  <span className="badge-soft text-[10px] font-bold uppercase mb-2">Step 3 of 4</span>
                  <h2 className="font-display text-2xl font-bold text-[#252A34] dark:text-white">
                    Measurements & Sizing
                  </h2>
                  <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                    Enter your measurements in centimeters (cm). If you are sending a sample fitting garment to our studio, you can leave these blank.
                  </p>
                </div>

                <div className="p-4 bg-[#FFF1F6] dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 rounded-2xl flex items-center gap-3 text-xs text-[#C52E74] dark:text-pink-300">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span><strong>Tip for Brides:</strong> You can also send an existing well-fitting blouse to our studio. We will replicate its exact fit!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeService.measurementFields?.map((mf) => (
                    <div key={mf.key} className="bg-[#F7F8FA] dark:bg-slate-800/60 p-3.5 rounded-2xl border border-[#E8EAF0] dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#252A34] dark:text-white">
                          {mf.label}
                        </label>
                        {mf.tip && (
                          <span className="text-[10px] text-[#64707D] font-normal">{mf.tip}</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={mf.placeholder}
                          value={measurements[mf.key] || ''}
                          onChange={(e) => setMeasurements({ ...measurements, [mf.key]: e.target.value })}
                          className="input-field pr-10 text-sm font-semibold bg-white"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] font-bold">
                          cm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                  <button
                    type="button"
                    onClick={() => setActiveStepId('options')}
                    className="btn-secondary text-xs px-6 py-3 font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Design Options
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepId('uploads')}
                    className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                  >
                    Next: Upload Reference Photos <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STEP 4: UPLOAD ARTWORK & INSPIRATION PHOTOS                         */}
            {/* =================================================================== */}
            {activeStepId === 'uploads' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
              >
                <div>
                  <span className="badge-soft text-[10px] font-bold uppercase mb-2">
                    {activeService.needsMeasurements ? 'Step 4 of 5' : 'Step 3 of 4'}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#252A34] dark:text-white">
                    Upload Your Design or Inspiration Photo
                  </h2>
                  <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                    Attach any design sketch, embroidery photo, company logo, or saree color photo.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'mainDesign', label: 'Primary Design / Logo / Inspiration Photo', accept: 'image/*,.pdf,.ai,.cdr', desc: 'Photo, sketch, or digital vector (JPG, PNG, PDF, AI)' },
                    { key: 'referenceSaree', label: 'Fabric / Saree Color Photo (Optional)', accept: 'image/*', desc: 'Photo of the saree or fabric you want us to match' },
                    { key: 'sampleBlouse', label: 'Sample Fit Reference (Optional)', accept: 'image/*', desc: 'A photo of your favorite fitting garment' },
                  ].map((slot) => {
                    const file = uploadedFiles[slot.key]
                    return (
                      <div
                        key={slot.key}
                        className="border-2 border-dashed border-[#E8EAF0] dark:border-slate-700 rounded-2xl p-4 hover:border-pink-400 transition-colors bg-[#F7F8FA] dark:bg-slate-800"
                      >
                        <label className="flex items-center gap-4 cursor-pointer">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              file ? 'bg-emerald-100 text-emerald-600' : 'bg-white dark:bg-slate-700 text-pink-500 border border-[#E8EAF0]'
                            }`}
                          >
                            {file ? <Check className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#252A34] dark:text-white text-xs sm:text-sm">
                              {slot.label}
                            </p>
                            <p className="text-[11px] text-[#64707D] dark:text-slate-400 mt-0.5">
                              {slot.desc}
                            </p>
                            {file && (
                              <p className="text-xs text-emerald-600 font-bold mt-1">
                                ✓ Attached: {file.name} ({(file.size / 1024).toFixed(0)} KB)
                              </p>
                            )}
                          </div>
                          <input
                            type="file"
                            accept={slot.accept}
                            className="hidden"
                            onChange={(e) => handleFileChange(slot.key, e.target.files[0])}
                          />
                        </label>
                      </div>
                    )
                  })}
                </div>

                {/* Special Instructions in simple customer language */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white mb-2">
                    Anything else our master tailor should know? (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Tell us about desired neckline depth, sleeve looseness, piping color preferences, or specific event dates..."
                    className="input-field resize-none text-xs"
                  />
                </div>

                <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                  <button
                    type="button"
                    onClick={() => setActiveStepId(activeService.needsMeasurements ? 'measurements' : 'options')}
                    className="btn-secondary text-xs px-6 py-3 font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepId('review')}
                    className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                  >
                    Review Order Summary <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STEP 5: REVIEW SUMMARY & EDIT BEFORE SUBMITTING                     */}
            {/* =================================================================== */}
            {activeStepId === 'review' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
              >
                <div>
                  <span className="badge-soft text-[10px] font-bold uppercase mb-2">Final Step</span>
                  <h2 className="font-display text-2xl font-bold text-[#252A34] dark:text-white">
                    Review Your Custom Order Summary
                  </h2>
                  <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                    You can tap <strong>Edit</strong> on any section below to change your choices easily.
                  </p>
                </div>

                {/* Summary Table with Instant [Edit] Links */}
                <div className="bg-[#F7F8FA] dark:bg-slate-800/80 rounded-2xl p-5 border border-[#E8EAF0] dark:border-slate-700 space-y-3 text-xs">
                  
                  {/* Service Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF0] dark:border-slate-700">
                    <div>
                      <p className="font-bold text-[#252A34] dark:text-white text-sm">{activeService.label}</p>
                      <p className="text-[11px] text-[#64707D]">{activeService.badge}</p>
                    </div>
                    <button
                      onClick={() => setActiveStepId('service')}
                      className="inline-flex items-center gap-1 text-pink-600 font-bold hover:underline text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>

                  {/* Selected Options */}
                  {Object.entries(formData).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#E8EAF0]/60 dark:border-slate-700/60">
                      <span className="capitalize text-[#64707D]">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#252A34] dark:text-white">{v}</span>
                        <button
                          onClick={() => setActiveStepId('options')}
                          className="text-pink-600 hover:text-pink-700"
                          title="Edit this option"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Measurements Summary */}
                  {activeService.needsMeasurements && Object.keys(measurements).length > 0 && (
                    <div className="flex items-center justify-between py-1.5 border-b border-[#E8EAF0]/60 dark:border-slate-700/60">
                      <span className="text-[#64707D]">Body Measurements</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#252A34] dark:text-white">
                          {Object.keys(measurements).filter((k) => measurements[k]).length} fields recorded
                        </span>
                        <button
                          onClick={() => setActiveStepId('measurements')}
                          className="text-pink-600 hover:text-pink-700"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Files Summary */}
                  {Object.keys(uploadedFiles).filter((k) => uploadedFiles[k]).length > 0 && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#64707D]">Reference Files</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-pink-600">
                          {Object.keys(uploadedFiles).filter((k) => uploadedFiles[k]).length} file(s) attached
                        </span>
                        <button
                          onClick={() => setActiveStepId('uploads')}
                          className="text-pink-600 hover:text-pink-700"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity and Required By Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white mb-1.5">
                      Quantity (Pieces)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="input-field font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white mb-1.5">
                      Required By Event Date
                    </label>
                    <input
                      type="date"
                      min={minDate.toISOString().split('T')[0]}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="input-field text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Express and Gift Add-ons */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expressDelivery}
                      onChange={(e) => setExpressDelivery(e.target.checked)}
                      className="accent-pink-600 w-4 h-4 rounded"
                    />
                    <span className="text-xs font-semibold text-[#252A34] dark:text-slate-200">
                      ⚡ Express Atelier Stitching (Priority Dispatch)
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="accent-pink-600 w-4 h-4 rounded"
                    />
                    <span className="text-xs font-semibold text-[#252A34] dark:text-slate-200">
                      🎁 Trousseau Boutique Gift Packaging
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                  <button
                    type="button"
                    onClick={() => setActiveStepId('uploads')}
                    className="btn-secondary text-xs px-6 py-3 font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Uploads
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-primary text-xs px-8 py-3.5 font-bold shadow-card flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Submit Custom Design Request
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* RIGHT 4 COLS: CUSTOM DESIGN REQUEST SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EAF0] dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-pink-500" />
                  <h3 className="font-display text-base font-bold text-[#252A34] dark:text-white">
                    Custom Order Overview
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF1F6] text-[#C52E74] px-2.5 py-1 rounded-full">
                  Atelier Service
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-[#64707D] dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Selected Service</span>
                  <span className="font-bold text-[#252A34] dark:text-white text-right">
                    {activeService.label}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-bold text-[#252A34] dark:text-white">
                    × {quantity}
                  </span>
                </div>

                {expressDelivery && (
                  <div className="flex justify-between">
                    <span>Delivery Mode</span>
                    <span className="font-semibold text-pink-600">Priority Express</span>
                  </div>
                )}

                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Packaging</span>
                    <span className="font-semibold text-pink-600">Trousseau Gift Box</span>
                  </div>
                )}

                {/* Price Confirmation Notice Box */}
                <div className="pt-3 border-t border-[#E8EAF0] dark:border-slate-700">
                  <div className="p-4 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 space-y-2">
                    <div className="flex items-start gap-2 text-xs font-bold text-pink-700 dark:text-pink-300">
                      <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span>Price: To be confirmed by SLV Fashion Studio</span>
                    </div>
                    <p className="text-[11px] text-[#64707D] dark:text-slate-400 leading-relaxed">
                      Our master artisan will review your design, photos, measurements, material, and embroidery work to manually confirm the exact final price on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full btn-primary py-3.5 text-xs font-bold shadow-card flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
              </button>

              {/* Trust badges */}
              <div className="pt-4 border-t border-[#E8EAF0] dark:border-slate-700 space-y-2 text-[11px] text-[#64707D]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>100% Fit & Alteration Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                  <span>Inspected by Master Tailor before stitching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                  <span>WhatsApp consultation on custom designs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* "HELP ME CHOOSE" SMART ADVISOR MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAdvisor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8EAF0] shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF0]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <h3 className="font-display font-bold text-lg text-[#252A34] dark:text-white">
                    SLV Smart Recommendation
                  </h3>
                </div>
                <button
                  onClick={() => setShowAdvisor(false)}
                  className="text-xs text-[#94A3B8] hover:text-black font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-[#252A34] dark:text-white mb-2">
                  What kind of artwork or design do you want on your garment?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'logo', label: 'Company / Brand Logo', emoji: '🏢' },
                    { id: 'photo', label: 'Full-Color Photo / Graphic', emoji: '📸' },
                    { id: 'text', label: 'Name / Monogram / Text', emoji: '✍️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAdvisorArtworkType(item.id)}
                      className={`p-3 rounded-xl border text-center text-xs transition-all ${
                        advisorArtworkType === item.id
                          ? 'border-pink-500 bg-[#FFF1F6] font-bold text-pink-700 ring-1 ring-pink-500'
                          : 'border-[#E8EAF0] hover:border-pink-300 text-[#252A34]'
                      }`}
                    >
                      <span className="text-xl block mb-1">{item.emoji}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {advisorArtworkType && (
                <div className="p-4 bg-[#F7F8FA] dark:bg-slate-800 rounded-2xl border border-pink-200">
                  <p className="text-xs font-bold text-pink-600 mb-1">Our Recommendation:</p>
                  <p className="text-xs text-[#252A34] dark:text-slate-200">
                    {advisorArtworkType === 'logo' && '✨ We recommend **Computerized Embroidery** for a luxury, long-lasting thread finish that never fades.'}
                    {advisorArtworkType === 'photo' && '✨ We recommend **HD DTF Printing** for vibrant, high-definition photo reproduction and sharp gradients.'}
                    {advisorArtworkType === 'text' && '✨ We recommend **Computerized Embroidery** for crisp lettering and personalized monograms.'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setShowAdvisor(false)}
                  className="btn-secondary text-xs px-5 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!advisorArtworkType}
                  onClick={applyAdvisorRecommendation}
                  className="btn-primary text-xs px-6 py-2.5 font-bold disabled:opacity-40"
                >
                  Apply Recommendation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

