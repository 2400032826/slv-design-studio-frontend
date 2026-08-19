import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { showLogin } from '../store/slices/authSlice'
import { addToCart } from '../store/slices/cartSlice'
import {
  Upload, Check, ChevronRight, ChevronLeft, Package,
  Sparkles, Scissors, ShoppingCart, Info, Shirt, Gem, Gift,
  CheckCircle2, Ruler, HelpCircle, Palette, Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

// ============================================================================
// DYNAMIC SERVICE CONFIGURATION SYSTEM
// ============================================================================

const SERVICE_CONFIG = {
  blouse: {
    id: 'blouse',
    label: 'Blouse Stitching & Tailoring',
    category: "Women's Bespoke",
    emoji: '👗',
    basePrice: 500,
    badge: 'Bridal & Designer Fits',
    description: 'Designer bridal blouses tailored to your exact fit with padded lining, deep neck patterns, and handcrafted embroidery.',
    steps: [
      {
        id: 'style',
        title: 'Blouse Style',
        subtitle: 'Select your preferred silhouette and occasion type',
        type: 'select',
        key: 'blouseStyle',
        options: [
          { label: 'Bridal Blouse', desc: 'Heavy padding, deep cut, bridal lining', addPrice: 200, icon: '👑' },
          { label: 'Designer Cut Blouse', desc: 'Modern designer back & princess cut', addPrice: 150, icon: '✨' },
          { label: 'Traditional South Indian', desc: 'Classic Kanjivaram sleeve & neck alignment', addPrice: 100, icon: '🥻' },
          { label: 'Party Wear Blouse', desc: 'Net / sheer back, stylish straps', addPrice: 150, icon: '🌟' },
          { label: 'Simple Daily Blouse', desc: 'Comfortable daily wear stitching', addPrice: 0, icon: '🧵' },
          { label: 'Custom Reference Design', desc: 'Tailored exactly from your uploaded photo', addPrice: 100, icon: '✂️' },
        ],
      },
      {
        id: 'fabric',
        title: 'Fabric Type',
        subtitle: 'Choose the fabric of your blouse or material provided',
        type: 'chips',
        key: 'fabricType',
        options: ['Pure Silk / Kanjivaram', 'Raw Silk', 'Velvet', 'Cotton', 'Georgette', 'Chiffon', 'Net / Tissue', 'Satin', 'Brocade', 'Customer Provided Fabric'],
      },
      {
        id: 'neck',
        title: 'Neck Design',
        subtitle: 'Select front and collar necklines',
        type: 'visual_grid',
        key: 'neckDesign',
        options: [
          { label: 'Round Neck', icon: '⭕', desc: 'Timeless & classic' },
          { label: 'V Neck', icon: '🔻', desc: 'Sleek elongating look' },
          { label: 'Boat Neck', icon: '🛶', desc: 'High shoulder elegance' },
          { label: 'Sweetheart Neck', icon: '💖', desc: 'Bridal favorite' },
          { label: 'Square Neck', icon: '🔲', desc: 'Structured & clean' },
          { label: 'High Neck / Collar', icon: '👔', desc: 'Royal high neck' },
          { label: 'U Neck', icon: '🧲', desc: 'Deep front curve' },
          { label: 'Custom Cut', icon: '✂️', desc: 'Match uploaded photo' },
        ],
      },
      {
        id: 'sleeve',
        title: 'Sleeve Cut & Length',
        subtitle: 'Select sleeve styling and embroidery room',
        type: 'visual_grid',
        key: 'sleeveDesign',
        options: [
          { label: 'Elbow Sleeve (Maggam)', icon: '📐', desc: 'Ideal for bridal embroidery' },
          { label: 'Short Sleeve', icon: '✂️', desc: 'Standard 4-6 inches' },
          { label: 'Sleeveless / Straps', icon: '🎽', desc: 'Modern chic silhouette' },
          { label: '3/4 Sleeve', icon: '📏', desc: 'Graceful mid-forearm' },
          { label: 'Full Sleeve', icon: '🧤', desc: 'Royal full coverage' },
          { label: 'Puff Sleeve', icon: '🎈', desc: 'Traditional South Indian puff' },
          { label: 'Bell / Flared Sleeve', icon: '🔔', desc: 'Contemporary flare' },
          { label: 'Custom Sleeve', icon: '✨', desc: 'Custom cut' },
        ],
      },
      {
        id: 'back',
        title: 'Back Pattern & Opening',
        subtitle: 'Select back silhouette, depth, and opening style',
        type: 'visual_grid',
        key: 'backDesign',
        options: [
          { label: 'Open Back with Dori Tassels', icon: '🎀', desc: 'Deep back with designer latkans' },
          { label: 'Keyhole Pattern', icon: '🔑', desc: 'Circular/teardrop keyhole' },
          { label: 'Closed / High Back', icon: '🔒', desc: 'Modest & sophisticated' },
          { label: 'Deep U Back', icon: '🌙', desc: 'Low cut traditional back' },
          { label: 'Button Back Opening', icon: '🔘', desc: 'Fabric potli buttons' },
          { label: 'Sheer / Net Back', icon: '🪟', desc: 'Translucent net cutout' },
          { label: 'V Shape Back', icon: '🔻', desc: 'Deep V line' },
          { label: 'Custom Pattern', icon: '🎨', desc: 'Custom design' },
        ],
      },
      {
        id: 'embroidery',
        title: 'Embroidery & Embellishment Options',
        subtitle: 'Add handcrafted bridal needlework or machine precision',
        type: 'select',
        key: 'embroideryOption',
        options: [
          { label: 'No Embroidery (Plain Stitching)', desc: 'Clean tailoring without embroidery work', addPrice: 0, icon: '🪡' },
          { label: 'Handcrafted Bridal Maggam Work', desc: 'Gold Zari, beads & stone needlework on neck & sleeves', addPrice: 800, icon: '👑' },
          { label: 'Heavy Zardosi & Cutdana Work', desc: 'Luxury heavy bridal Maggam with 3D stone accents', addPrice: 1400, icon: '💎' },
          { label: 'Computerized Machine Embroidery', desc: 'High-precision multi-thread floral & geometric work', addPrice: 400, icon: '🧵' },
          { label: 'Custom Embroidery Work', desc: 'Exact design quoted upon reference assessment', addPrice: 500, icon: '✨' },
        ],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'bust', label: 'Bust / Chest (cm)', placeholder: '88' },
      { key: 'underbust', label: 'Underbust / Waist (cm)', placeholder: '74' },
      { key: 'blouseLength', label: 'Blouse Length (cm)', placeholder: '36' },
      { key: 'frontNeckDepth', label: 'Front Neck Depth (cm)', placeholder: '16' },
      { key: 'backNeckDepth', label: 'Back Neck Depth (cm)', placeholder: '22' },
      { key: 'shoulder', label: 'Shoulder Width (cm)', placeholder: '37' },
      { key: 'armhole', label: 'Armhole Circumference (cm)', placeholder: '38' },
      { key: 'sleeveLength', label: 'Sleeve Length (cm)', placeholder: '26' },
    ],
  },

  mensCustomization: {
    id: 'mensCustomization',
    label: "Men's Garment Customization",
    category: 'Men & Corporate',
    emoji: '👔',
    basePrice: 250,
    badge: 'Embroidery & Branding',
    description: 'Customize your existing shirt, t-shirt, kurta, or uniform with computer embroidery, corporate logos, names, and heat-transfer artwork.',
    steps: [
      {
        id: 'garment',
        title: 'Garment to Customize',
        subtitle: 'Select the garment you are providing or customizing',
        type: 'visual_grid',
        key: 'garmentType',
        options: [
          { label: 'Men’s Shirt', icon: '👔', desc: 'Formal or casual shirts' },
          { label: 'T-Shirt / Polo', icon: '👕', desc: 'Cotton, polyester, polo collars' },
          { label: 'Kurta', icon: '🥻', desc: 'Ethnic festive / wedding kurta' },
          { label: 'Hoodie / Sweatshirt', icon: '🧥', desc: 'Winter wear & fleece' },
          { label: 'Jacket / Blazer', icon: '🧥', desc: 'Suiting & club jackets' },
          { label: 'Uniform / Workwear', icon: '👷', desc: 'Corporate / school uniforms' },
          { label: 'Pants / Trousers', icon: '👖', desc: 'Pocket / leg logo branding' },
          { label: 'Other Garment', icon: '📦', desc: 'Caps, bags, aprons, etc.' },
        ],
      },
      {
        id: 'addition',
        title: 'What Do You Want to Add?',
        subtitle: 'Select the primary customization element',
        type: 'chips',
        key: 'customizationElement',
        options: ['Brand / Company Logo', 'Personalized Name / Monogram', 'Custom Typography / Text', 'Photo / Graphic Image', 'Custom Vector Artwork', 'Embroidery Border / Pattern', 'Multi-Position Branding'],
      },
      {
        id: 'technique',
        title: 'Customization Technique',
        subtitle: 'Choose between needlework embroidery or high-definition heat print',
        type: 'select',
        key: 'technique',
        options: [
          { label: 'Computerized Embroidery', desc: 'Durable, premium thread embroidery that lasts forever', addPrice: 150, icon: '🧵' },
          { label: 'HD DTF / Heat Transfer', desc: 'Vibrant full-color photo print with sharp gradients', addPrice: 100, icon: '🖨️' },
          { label: 'Direct Heat Press Vinyl', desc: 'Clean single-color metallic or solid logo application', addPrice: 80, icon: '⚡' },
          { label: 'Let SLV Master Artisan Recommend', desc: 'We will inspect your design and suggest the best method', addPrice: 100, icon: '✨' },
        ],
      },
      {
        id: 'placement',
        title: 'Design Placement on Garment',
        subtitle: 'Select where the design should be applied',
        type: 'visual_grid',
        key: 'placement',
        options: [
          { label: 'Front Left Chest', icon: '📍', desc: 'Standard 3-4 inch pocket area' },
          { label: 'Front Center', icon: '🎯', desc: 'Mid-chest statement graphic' },
          { label: 'Full Front', icon: '🔲', desc: 'Large A4/A3 front placement' },
          { label: 'Upper Back / Nape', icon: '🔝', desc: 'Subtle neck logo' },
          { label: 'Full Back', icon: '🛡️', desc: 'Large back branding / team name' },
          { label: 'Left / Right Sleeve', icon: '💪', desc: 'Bicep logo / badge' },
          { label: 'Collar / Cuff', icon: '👔', desc: 'Monogram & initials' },
          { label: 'Multiple Locations', icon: '⭐', desc: 'Chest + Back combo' },
        ],
      },
      {
        id: 'size',
        title: 'Approximate Design Size',
        subtitle: 'Select the scale of the artwork',
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
        title: 'Base Garment Color',
        subtitle: 'Helps our artisans configure thread and ink contrasts',
        type: 'chips',
        key: 'garmentColor',
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
    description: 'High-precision computer embroidery for sarees, blouses, kurtis, dupattas, corporate apparel, and custom logo patches.',
    steps: [
      {
        id: 'item',
        title: 'What Are You Customizing?',
        subtitle: 'Select the fabric or apparel item to be embroidered',
        type: 'chips',
        key: 'targetItem',
        options: ['Bridal Blouse Piece', 'Saree / Saree Border', 'Silk Dupatta', 'Kurti / Salwar', 'Men’s Shirt / Kurta', 'T-Shirt / Polo', 'School / Corporate Uniform', 'Caps / Bags / Accessories'],
      },
      {
        id: 'type',
        title: 'Embroidery Style',
        subtitle: 'Select the nature of the embroidery work',
        type: 'visual_grid',
        key: 'embroideryType',
        options: [
          { label: 'Brand / Organization Logo', icon: '🏢', desc: 'Precision vector logo' },
          { label: 'Personal Name / Monogram', icon: '✍️', desc: 'Cursive or block typography' },
          { label: 'Maggam-Style Zari Pattern', icon: '🪡', desc: 'Traditional South Indian motif' },
          { label: 'Floral & Vine Border', icon: '🌸', desc: 'Continuous running border' },
          { label: 'Peacock / Traditional Motif', icon: '🦚', desc: 'Buttis & temple motifs' },
          { label: 'Custom Artwork Vector', icon: '🎨', desc: 'Stitched from your image' },
        ],
      },
      {
        id: 'threads',
        title: 'Thread & Zari Palette',
        subtitle: 'Select accent thread tones',
        type: 'chips',
        key: 'threadPalette',
        options: ['Gold Zari (Metallic)', 'Silver / White Zari', 'Antique Copper Zari', 'Multi-Color Silk Threads', 'Monochrome Single Thread', 'Fluorescent / Vibrant Shades', 'Tonal Self-Color'],
      },
      {
        id: 'size',
        title: 'Embroidery Scale & Density',
        subtitle: 'Select size and stitch count category',
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
    description: 'High-definition direct-to-film digital printing with vivid colors, fine photographic details, and stretch-resistant wash durability.',
    steps: [
      {
        id: 'product',
        title: 'Product Type for Printing',
        subtitle: 'Select the apparel or substrate for DTF transfer',
        type: 'chips',
        key: 'dtfProduct',
        options: ['Cotton T-Shirt', 'Polyester / Dry-Fit Jersey', 'Hoodie / Sweatshirt', 'Cotton Tote Bag', 'Silk / Satin Fabric', 'Cap / Hat', 'Apron / Uniform', 'Other Substrate'],
      },
      {
        id: 'placement',
        title: 'Print Placement',
        subtitle: 'Choose where the graphic will be heat-pressed',
        type: 'visual_grid',
        key: 'printPlacement',
        options: [
          { label: 'Left Chest (Pocket Size)', icon: '📍', desc: '3.5 x 3.5 inches' },
          { label: 'Front Center (Standard A4)', icon: '🎯', desc: '8.5 x 11 inches' },
          { label: 'Full Front Poster (A3)', icon: '🔲', desc: '11 x 16 inches' },
          { label: 'Upper Back Nape', icon: '🔝', desc: '3 x 3 inches logo' },
          { label: 'Full Back (A3 Size)', icon: '🛡️', desc: '11 x 16 inches large print' },
          { label: 'Sleeve Print', icon: '💪', desc: 'Long or badge format' },
          { label: 'Front & Back Combo', icon: '⭐', desc: 'Small chest + large back', addPrice: 100 },
        ],
      },
      {
        id: 'garmentColor',
        title: 'Garment Background Color',
        subtitle: 'Helps us apply white ink underbase where required',
        type: 'chips',
        key: 'garmentColor',
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
    description: 'Custom textile digital printing for silk sarees, dupattas, running fabric yardage, and bespoke designer patterns.',
    steps: [
      {
        id: 'fabric',
        title: 'Fabric Base',
        subtitle: 'Choose the textile base for digital printing',
        type: 'chips',
        key: 'fabricBase',
        options: ['Pure Silk / Tabby', 'Georgette', 'Chiffon', 'Organza', 'Cotton Silk', 'Satin', 'Rayon / Viscose', 'Canvas / Duck Cotton', 'Customer Supplied Fabric'],
      },
      {
        id: 'quantity',
        title: 'Fabric Quantity / Length',
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
        title: 'Printing Style & Layout',
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
    description: 'Custom tailored kurtis, Anarkalis, and ethnic dresses crafted to your silhouette with custom necklines, sleeves, and delicate embroidery.',
    steps: [
      {
        id: 'silhouette',
        title: 'Garment Silhouette',
        subtitle: 'Select kurti or dress style',
        type: 'visual_grid',
        key: 'kurtiStyle',
        options: [
          { label: 'Straight Cut Kurti', icon: '📏', desc: 'Side slits, office & daily wear' },
          { label: 'A-Line Kurti', icon: '📐', desc: 'Flared bottom comfort' },
          { label: 'Anarkali Dress', icon: '👗', desc: 'Pleated royal flare' },
          { label: 'Angrakha Wrap Style', icon: '🥻', desc: 'Traditional crossover tie' },
          { label: 'Floor-Length Gown', icon: '🌟', desc: 'Festive occasion wear' },
          { label: 'Chudidar / Salwar Suit', icon: '🧵', desc: 'Top + Pant 2-piece set', addPrice: 150 },
        ],
      },
      {
        id: 'fabric',
        title: 'Fabric Type',
        subtitle: 'Choose dress fabric',
        type: 'chips',
        key: 'fabricType',
        options: ['Cotton', 'Silk Blend', 'Georgette', 'Chanderi', 'Rayon', 'Linen', 'Velvet', 'Customer Provided Material'],
      },
      {
        id: 'neck',
        title: 'Neckline Cut',
        subtitle: 'Choose neckline pattern',
        type: 'chips',
        key: 'neckCut',
        options: ['Round Neck with Slit', 'V Neck', 'Keyhole Neck', 'Mandarin Collar', 'Boat Neck', 'Sweetheart', 'Angrakha V-Cut'],
      },
      {
        id: 'sleeve',
        title: 'Sleeve Length',
        subtitle: 'Choose sleeve cut',
        type: 'chips',
        key: 'sleeveCut',
        options: ['Sleeveless', 'Cap Sleeve', '3/4 Sleeve (Standard)', 'Full Length Sleeve', 'Bell Flared Sleeve'],
      },
      {
        id: 'embellishment',
        title: 'Embroidery & Print Add-on',
        subtitle: 'Optional decorative detailing',
        type: 'select',
        key: 'kurtiEmbellishment',
        options: [
          { label: 'Plain Stitching (No Add-ons)', desc: 'Clean tailor finish', addPrice: 0, icon: '✂️' },
          { label: 'Yoke / Neckline Computer Embroidery', desc: 'Delicate threadwork around neckline', addPrice: 250, icon: '🌸' },
          { label: 'Sleeve Border & Hem Embroidery', desc: 'Coordinated threadwork on borders', addPrice: 300, icon: '🧵' },
          { label: 'Custom Digital Motif Print', desc: 'Printed accents on chest/hem', addPrice: 200, icon: '🖨️' },
        ],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'bust', label: 'Bust / Chest (cm)', placeholder: '92' },
      { key: 'waist', label: 'Waist (cm)', placeholder: '78' },
      { key: 'hips', label: 'Hips (cm)', placeholder: '98' },
      { key: 'shoulder', label: 'Shoulder (cm)', placeholder: '38' },
      { key: 'armLength', label: 'Arm Length (cm)', placeholder: '42' },
      { key: 'kurtiLength', label: 'Total Kurti Length (cm)', placeholder: '105' },
    ],
  },

  lehenga: {
    id: 'lehenga',
    label: 'Lehenga & Royal Bridal Wear',
    category: 'Haute Bridal',
    emoji: '👡',
    basePrice: 900,
    badge: 'Royal Wedding Couture',
    description: 'Heavy bridal lehengas, reception gowns, and festive half-sarees with can-can layering, Maggam embroidery, and luxury zari detailing.',
    steps: [
      {
        id: 'type',
        title: 'Bridal Attire Type',
        subtitle: 'Select your bridal outfit category',
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
        title: 'Embroidery Work Intensity',
        subtitle: 'Select the density of handcrafted Maggam needlework',
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
        title: 'Primary Fabric',
        subtitle: 'Choose luxury fabric base',
        type: 'chips',
        key: 'fabricType',
        options: ['Heavy Bridal Velvet', 'Raw Silk / Kanjivaram Silk', 'Net with Double Satin Lining', 'Pure Georgette', 'Organza Silk', 'Brocade / Jacquard'],
      },
      {
        id: 'color',
        title: 'Bridal Color Palette',
        subtitle: 'Select primary color theme',
        type: 'chips',
        key: 'colorTheme',
        options: ['Crimson Red', 'Royal Maroon', 'Bridal Rose Pink', 'Emerald Green', 'Mustard / Haldi Gold', 'Pastel Peach / Mint', 'Royal Purple', 'Custom Shade'],
      },
    ],
    needsMeasurements: true,
    measurementFields: [
      { key: 'lehengaWaist', label: 'Lehenga Waist (cm)', placeholder: '76' },
      { key: 'lehengaLength', label: 'Lehenga Skirt Length (cm)', placeholder: '102' },
      { key: 'blouseBust', label: 'Blouse Bust (cm)', placeholder: '88' },
      { key: 'blouseLength', label: 'Blouse Length (cm)', placeholder: '36' },
      { key: 'hipCircumference', label: 'Hip Circumference (cm)', placeholder: '96' },
    ],
  },

  saree: {
    id: 'saree',
    label: 'Saree Embroidery & Customization',
    category: 'Saree Atelier',
    emoji: '🥻',
    basePrice: 600,
    badge: 'Border, Pallu & Tassels',
    description: 'Custom handcrafted Maggam border needlework, grand pallu zari highlights, designer saree kuchu tassels, and matching embroidered blouse pieces.',
    steps: [
      {
        id: 'sareeType',
        title: 'Saree Base Type',
        subtitle: 'Select the fabric or type of saree',
        type: 'chips',
        key: 'sareeType',
        options: ['Kanjivaram Silk Saree', 'Banarasi Silk Saree', 'Organza / Tissue Saree', 'Georgette / Chiffon Saree', 'Cotton Silk Saree', 'Plain Dyed Saree for Custom Work'],
      },
      {
        id: 'borderWork',
        title: 'Border Customization',
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
        title: 'Pallu Work Customization',
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
        title: 'Matching Blouse Piece Work',
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
  const [selectedServiceKey, setSelectedServiceKey] = useState('blouse')
  const [stepIndex, setStepIndex] = useState(0) // 0: Service Options, 1: Measurements (if any), 2: Files, 3: Review
  const [formData, setFormData] = useState({})
  const [measurements, setMeasurements] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)

  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)

  const activeService = SERVICE_CONFIG[selectedServiceKey] || SERVICE_CONFIG.blouse

  // Calculate dynamic price
  const addOnsTotal = (() => {
    let sum = 0
    activeService.steps.forEach((st) => {
      const selectedVal = formData[st.key]
      if (st.type === 'select' && selectedVal) {
        const opt = st.options.find((o) => o.label === selectedVal)
        if (opt?.addPrice) sum += opt.addPrice
      }
      if (st.type === 'visual_grid' && selectedVal) {
        const opt = st.options.find((o) => o.label === selectedVal)
        if (opt?.addPrice) sum += opt.addPrice
      }
    })
    return sum
  })()

  const unitPrice = activeService.basePrice + addOnsTotal
  const expressFee = expressDelivery ? 200 : 0
  const giftFee = giftWrap ? 50 : 0
  const estimatedTotal = (unitPrice * quantity) + expressFee + giftFee

  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }

  const handleFileChange = (slot, file) => {
    setUploadedFiles((prev) => ({ ...prev, [slot]: file }))
  }

  const handleSelectService = (key) => {
    setSelectedServiceKey(key)
    setFormData({})
    setMeasurements({})
    setUploadedFiles({})
    setStepIndex(0)
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(showLogin())
      return
    }

    const customProduct = {
      _id: `custom_${activeService.id}_${Date.now()}`,
      name: `Bespoke ${activeService.label}`,
      price: estimatedTotal,
      offerPrice: null,
      images: [],
      customization: {
        serviceId: activeService.id,
        serviceName: activeService.label,
        options: formData,
        measurements: activeService.needsMeasurements ? measurements : null,
        specialInstructions,
        quantity,
        deliveryDate,
        expressDelivery,
        giftWrap,
        estimatedTotal,
      },
    }

    dispatch(addToCart({ product: customProduct, quantity: 1 }))
    toast.success(`${activeService.label} added to your shopping bag! 🛍️`)
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 5)

  // Total form pages: 0 = Dynamic Questions, 1 = Measurements (if applicable) or Files, 2 = Review
  const hasMeasurements = activeService.needsMeasurements
  const totalFlowSteps = hasMeasurements ? 4 : 3 // 0: Options, 1: Measurements (optional), 2: Files, 3: Review

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#111827]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1F2937] border-b border-[#E8EAF0] dark:border-slate-800 py-12 shadow-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF1F6] dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 text-[#C52E74] dark:text-pink-300 text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>Interactive Bespoke Studio</span>
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#252A34] dark:text-white mb-3">
            Customization <span className="text-gradient-pink">Studio</span>
          </h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-3 rounded-full" />
          <p className="text-[#64707D] dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Select your service below. The studio will dynamically adapt questions specifically for your garment, embroidery, or branding needs.
          </p>
        </div>
      </div>

      <div className="section-container py-10">
        {/* ========================================================================= */}
        {/* SERVICE SELECTOR CARDS ROW                                                */}
        {/* ========================================================================= */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Step 1</p>
              <h2 className="font-display text-xl font-bold text-[#252A34] dark:text-white">Choose Your Service</h2>
            </div>
            <span className="text-xs text-[#64707D] dark:text-slate-400 font-medium hidden sm:inline">
              Showing 8 Specialized Atelier Services
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {serviceList.map((svc) => {
              const isSelected = selectedServiceKey === svc.id
              return (
                <button
                  key={svc.id}
                  onClick={() => handleSelectService(svc.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-pink-500 bg-white dark:bg-[#1F2937] ring-2 ring-pink-500/20 shadow-card'
                      : 'border-[#E8EAF0] dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 hover:border-pink-300 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{svc.emoji}</div>
                  <p className="text-[11px] font-bold text-[#252A34] dark:text-white leading-tight line-clamp-2">
                    {svc.label.split(' ')[0]} {svc.label.split(' ')[1] || ''}
                  </p>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mt-1.5 price-tag">
                    From ₹{svc.basePrice}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN STUDIO AREA: 2-COLUMN LAYOUT (FORM + DYNAMIC ESTIMATOR)             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: DYNAMIC SERVICE FORM */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Service Banner */}
            <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-[#E8EAF0] dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFF1F6] dark:bg-pink-950/40 text-2xl flex items-center justify-center border border-pink-200 dark:border-pink-900/50 flex-shrink-0">
                  {activeService.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge-soft text-[10px] font-bold uppercase">{activeService.category}</span>
                    <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">• {activeService.badge}</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#252A34] dark:text-white">
                    {activeService.label}
                  </h2>
                </div>
              </div>

              {/* Step Navigation Tabs */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {Array.from({ length: totalFlowSteps }).map((_, idx) => {
                  let stepLabel = '1. Options'
                  if (hasMeasurements) {
                    if (idx === 1) stepLabel = '2. Fit / Sizes'
                    if (idx === 2) stepLabel = '3. Files'
                    if (idx === 3) stepLabel = '4. Review'
                  } else {
                    if (idx === 1) stepLabel = '2. Files'
                    if (idx === 2) stepLabel = '3. Review'
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setStepIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        stepIndex === idx
                          ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft font-bold'
                          : 'bg-[#F7F8FA] dark:bg-slate-800 text-[#64707D] dark:text-slate-300 hover:text-pink-600'
                      }`}
                    >
                      {stepLabel}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* DYNAMIC FORM CONTAINER */}
            <AnimatePresence mode="wait">
              
              {/* STAGE 0: SERVICE-SPECIFIC TAILORED QUESTIONS */}
              {stepIndex === 0 && (
                <motion.div
                  key="options-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-8"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#252A34] dark:text-white">
                      Customization Options for {activeService.label}
                    </h3>
                    <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Render only steps specific to this service */}
                  {activeService.steps.map((st, stepNum) => {
                    const selectedVal = formData[st.key]

                    return (
                      <div key={st.id} className="pt-6 border-t border-[#E8EAF0] dark:border-slate-800 first:border-0 first:pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#FFF1F6] dark:bg-pink-950/40 text-pink-600 text-[10px] flex items-center justify-center font-bold">
                              {stepNum + 1}
                            </span>
                            {st.title}
                          </label>
                          {selectedVal && (
                            <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> {selectedVal}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64707D] dark:text-slate-400 mb-4">{st.subtitle}</p>

                        {/* TYPE 1: SELECT CARDS */}
                        {st.type === 'select' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {st.options.map((opt) => {
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
                                      {opt.addPrice > 0 && (
                                        <span className="text-[11px] text-pink-600 font-bold price-tag">+₹{opt.addPrice}</span>
                                      )}
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
                            {st.options.map((opt) => {
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
                                  {opt.addPrice > 0 && (
                                    <span className="text-[10px] text-pink-600 font-bold mt-1 price-tag">+₹{opt.addPrice}</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {/* TYPE 3: VISUAL PILL CHIPS */}
                        {st.type === 'chips' && (
                          <div className="flex flex-wrap gap-2">
                            {st.options.map((opt) => {
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
                      </div>
                    )
                  })}

                  {/* Forward button to next stage */}
                  <div className="pt-6 border-t border-[#E8EAF0] flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStepIndex(1)}
                      className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                    >
                      {hasMeasurements ? 'Proceed to Sizing & Fit' : 'Proceed to Artwork Upload'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 1 (If applicable): MEASUREMENTS & SIZING */}
              {stepIndex === 1 && hasMeasurements && (
                <motion.div
                  key="measurements-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#252A34] dark:text-white">
                        Body Measurements & Silhouette Fit
                      </h3>
                      <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                        Enter your measurements in centimeters (cm). If you are sending a sample garment, you can leave these blank.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1F6] text-pink-600 flex items-center justify-center font-bold">
                      <Ruler className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {activeService.measurementFields?.map((mf) => (
                      <div key={mf.key} className="bg-[#F7F8FA] dark:bg-slate-800/60 p-3.5 rounded-2xl border border-[#E8EAF0] dark:border-slate-700">
                        <label className="block text-xs font-bold text-[#252A34] dark:text-white mb-1.5">
                          {mf.label}
                        </label>
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
                      onClick={() => setStepIndex(0)}
                      className="btn-secondary text-xs px-6 py-3 font-bold"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Options
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepIndex(2)}
                      className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                    >
                      Proceed to Uploads <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: UPLOAD ARTWORK & REFERENCE DESIGNS */}
              {((stepIndex === 1 && !hasMeasurements) || (stepIndex === 2 && hasMeasurements)) && (
                <motion.div
                  key="uploads-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#252A34] dark:text-white">
                      Upload Artwork, Inspiration & Reference Photos
                    </h3>
                    <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                      Attach your design sketch, company logo, blouse photo, or saree color reference.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'mainDesign', label: 'Primary Design / Logo / Artwork', accept: 'image/*,.pdf,.ai,.cdr', desc: 'Vector logo, sketch, or photo design (PDF, PNG, JPG, AI)' },
                      { key: 'referenceSaree', label: 'Fabric / Saree Color Reference Photo', accept: 'image/*', desc: 'Photo of the saree or fabric you want us to match' },
                      { key: 'sampleBlouse', label: 'Sample Fit Reference (Optional)', accept: 'image/*', desc: 'A photo of your best-fitting garment' },
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
                                  ✓ Selected: {file.name}
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

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white mb-2">
                      Special Tailoring & Stitching Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Describe any special neckline depth, armhole looseness, thread sheen, piping preferences, or event deadlines..."
                      className="input-field resize-none text-xs"
                    />
                  </div>

                  <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                    <button
                      type="button"
                      onClick={() => setStepIndex(hasMeasurements ? 1 : 0)}
                      className="btn-secondary text-xs px-6 py-3 font-bold"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepIndex(hasMeasurements ? 3 : 2)}
                      className="btn-primary text-xs px-7 py-3 font-bold shadow-card flex items-center gap-2"
                    >
                      Review Order Summary <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: FINAL REVIEW & CONFIRMATION */}
              {((stepIndex === 2 && !hasMeasurements) || (stepIndex === 3 && hasMeasurements)) && (
                <motion.div
                  key="review-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#1F2937] p-6 sm:p-8 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#252A34] dark:text-white">
                      Review & Finalize Bespoke Order
                    </h3>
                    <p className="text-xs text-[#64707D] dark:text-slate-400 mt-1">
                      Verify your selected parameters before adding to cart. Our master artisan will review all details before starting.
                    </p>
                  </div>

                  {/* Summary Table */}
                  <div className="bg-[#F7F8FA] dark:bg-slate-800/80 rounded-2xl p-5 border border-[#E8EAF0] dark:border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-[#E8EAF0] dark:border-slate-700">
                      <span className="font-semibold text-[#64707D]">Selected Atelier Service</span>
                      <span className="font-bold text-[#252A34] dark:text-white">{activeService.label}</span>
                    </div>

                    {Object.entries(formData).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-[#E8EAF0]/60 dark:border-slate-700/60 last:border-0">
                        <span className="capitalize text-[#64707D]">{k.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-bold text-[#252A34] dark:text-white">{v}</span>
                      </div>
                    ))}

                    {Object.keys(uploadedFiles).filter((k) => uploadedFiles[k]).length > 0 && (
                      <div className="flex justify-between pt-1">
                        <span className="text-[#64707D]">Uploaded Reference Files</span>
                        <span className="font-bold text-pink-600">
                          {Object.keys(uploadedFiles).filter((k) => uploadedFiles[k]).length} file(s) attached
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Date Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#252A34] dark:text-white mb-1.5">
                        Quantity
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
                        Required Delivery Date
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

                  {/* Express & Gift check */}
                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expressDelivery}
                        onChange={(e) => setExpressDelivery(e.target.checked)}
                        className="accent-pink-600 w-4 h-4 rounded"
                      />
                      <span className="text-xs font-semibold text-[#252A34] dark:text-slate-200">
                        ⚡ Express Atelier Stitching (+₹200)
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
                        🎁 Trousseau Gift Packaging (+₹50)
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-[#E8EAF0]">
                    <button
                      type="button"
                      onClick={() => setStepIndex(hasMeasurements ? 2 : 1)}
                      className="btn-secondary text-xs px-6 py-3 font-bold"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Uploads
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="btn-primary text-xs px-8 py-3.5 font-bold shadow-card flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add Custom Item to Bag
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT 4 COLS: DYNAMIC PRICE ESTIMATOR & LIVE SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E8EAF0] dark:border-slate-800 shadow-card space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EAF0] dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-pink-500" />
                  <h3 className="font-display text-base font-bold text-[#252A34] dark:text-white">
                    Price Estimate
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF1F6] text-[#C52E74] px-2.5 py-1 rounded-full">
                  Dynamic Quote
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-[#64707D] dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Service Base ({activeService.label})</span>
                  <span className="font-bold text-[#252A34] dark:text-white price-tag">
                    ₹{activeService.basePrice}
                  </span>
                </div>

                {addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Selected Customization Add-ons</span>
                    <span className="font-bold text-pink-600 price-tag">
                      +₹{addOnsTotal}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-bold text-[#252A34] dark:text-white">
                    × {quantity}
                  </span>
                </div>

                {expressDelivery && (
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className="font-semibold text-pink-600">+₹200</span>
                  </div>
                )}

                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Gift Packaging</span>
                    <span className="font-semibold text-pink-600">+₹50</span>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 border-t border-[#E8EAF0] dark:border-slate-700">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display font-bold text-sm text-[#252A34] dark:text-white">
                      Estimated Total
                    </span>
                    <span className="font-bold text-2xl text-pink-600 dark:text-pink-400 price-tag">
                      ₹{estimatedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">
                    *Final price is confirmed after inspecting your uploaded reference artwork and fabric requirements.
                  </p>
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

              {/* Guarantee trust points */}
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
                  <span>Direct WhatsApp updates during tailoring</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

