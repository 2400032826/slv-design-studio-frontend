import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../store/slices/themeSlice'
import HeroSection from '../components/home/HeroSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import ServicesSection from '../components/home/ServicesSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import TestimonialsSection from '../components/home/TestimonialsSection'
import GallerySection from '../components/home/GallerySection'
import OffersSection from '../components/home/OffersSection'

export default function Home() {
  const dispatch = useDispatch()
  const { mode } = useSelector((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <main>
      <HeroSection />
      <WhyChooseUs />
      <ServicesSection />
      <FeaturedProducts />
      <OffersSection />
      <GallerySection />
      <TestimonialsSection />
    </main>
  )
}
