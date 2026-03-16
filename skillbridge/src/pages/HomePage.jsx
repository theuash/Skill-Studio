import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ParallaxHero from '../components/sections/ParallaxHero'
import FeaturesSection from '../components/sections/FeaturesSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import StatsSection from '../components/sections/StatsSection'

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
      <ParallaxHero />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <Footer />
    </div>
  )
}
