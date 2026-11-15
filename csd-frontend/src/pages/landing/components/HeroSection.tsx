import HeroBackground from './HeroBackground'
import SiteHeader from './SiteHeader'
import HeroCopy from './HeroCopy'
import TrustedBy from './TrustedBy'

export default function HeroSection() {
  return (
    <section className="relative flex flex-col overflow-clip bg-ink font-sans font-normal text-white [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]">
      <HeroBackground />
      <div className="landing-container relative z-10 pt-4">
        <SiteHeader />
        <HeroCopy />
      </div>
      <TrustedBy />
    </section>
  )
}
