import AboutSection from './components/AboutSection'
import FooterSection from './components/FooterSection'
import HeroSection from './components/HeroSection'
import IndustriesSection from './components/IndustriesSection'
import ServicesSection from './components/ServicesSection'
import TalkSection from './components/TalkSection'
import WhyChooseSection from './components/WhyChooseSection'

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-white">
      <HeroSection />
      <AboutSection />
      <WhyChooseSection />
      <ServicesSection />
      <IndustriesSection />
      <TalkSection />
      <FooterSection />
    </main>
  )
}
