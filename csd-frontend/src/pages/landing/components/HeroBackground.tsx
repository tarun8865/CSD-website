import backgroundGlow from '../assets/background-glow.png'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      {/* Same glow + blur; wrapper drifts left ↔ right */}
      <div className="hero-glow-drift pointer-events-none absolute inset-[-12%]">
        <img
          className="absolute inset-0 size-full max-w-none object-fill object-bottom select-none"
          src={backgroundGlow}
          alt=""
          width={1024}
          height={410}
        />
        <div className="absolute inset-0 bg-white/1 backdrop-blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#fff_0%,transparent_19.676%)]" />
    </div>
  )
}
