import logoKpmg from '../assets/logo-kpmg.png'
import logoM3m from '../assets/logo-m3m.png'
import logoSrf from '../assets/logo-srf.png'
import logoRenewbuy from '../assets/logo-renewbuy.png'
import logoPnb from '../assets/logo-pnb.png'
import logoAu from '../assets/logo-au.png'
import logoAv from '../assets/logo-av.png'
import logoSoketlabs from '../assets/Soket-Logo.svg'
import logoWheebox from '../assets/logo-wheebox.png'
import logoRunplaygo from '../assets/runplaygo-logo.jpeg'
import logoCentralPark from '../assets/central-park-logo.png'
import logoPermute from '../assets/permute-logo.jpeg'
import logoKamaHoldings from '../assets/kama-holdings-logo.png'
import logoTypsy from '../assets/typsy-logo.png'
import logoBaxy from '../assets/baxy-logo.png'
import logoBefikr from '../assets/befikr-logo.png'
import logoCapitalTrade from '../assets/capital-trade-logo.jpeg'

const logos = [
  { src: logoKpmg, alt: 'KPMG', width: 125, height: 53 },
  { src: logoM3m, alt: 'M3M', width: 109.497, height: 57.275 },
  { src: logoSrf, alt: 'SRF', width: 115.5, height: 52 },
  { src: logoRenewbuy, alt: 'RenewBuy', width: 97.905, height: 63.884 },
  { src: logoPnb, alt: 'PNB', width: 89.5, height: 61 },
  { src: logoAu, alt: 'AU Small Finance Bank', width: 112.5, height: 36 },
  { src: logoAv, alt: 'AV', width: 67, height: 65 },
  { src: logoSoketlabs, alt: 'Soket AI', width: 143, height: 26 },
  { src: logoWheebox, alt: 'Wheebox', width: 112, height: 38 },
  { src: logoRunplaygo, alt: 'RunPlayGo', width: 70, height: 52 },
  { src: logoCentralPark, alt: 'Central Park', width: 75, height: 52 },
  { src: logoPermute, alt: 'Permute', width: 129, height: 40 },
  { src: logoKamaHoldings, alt: 'Kama Holdings', width: 122, height: 48 },
  { src: logoTypsy, alt: 'Typsy', width: 77, height: 52 },
  { src: logoBaxy, alt: 'Baxy', width: 121, height: 48 },
  { src: logoBefikr, alt: 'Befikr', width: 100, height: 48 },
  { src: logoCapitalTrade, alt: 'Capital Trade Links', width: 65, height: 52 },
]

export default function TrustedBy() {
  return (
    <section
      className="mt-[clamp(24px,4vw,56px)] pb-[clamp(40px,5.5vw,88px)]"
      aria-labelledby="trusted-heading"
    >
      <h2
        id="trusted-heading"
        className="m-0 text-center font-sans text-base leading-5 font-normal tracking-normal text-ink uppercase"
      >
        Trusted by industry leaders
      </h2>
      <div className="mt-7 overflow-hidden">
        <div className="trusted-marquee flex w-max items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className={`m-0 flex shrink-0 items-center gap-[clamp(28px,4.5vw,100px)] px-[clamp(16px,2.5vw,44px)] mix-blend-luminosity ${copy === 1 ? 'motion-reduce:hidden' : 'motion-reduce:flex-wrap motion-reduce:justify-center'}`}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {logos.map((logo) => (
                <li
                  key={logo.alt}
                  className="m-0 flex shrink-0 items-center"
                  style={{
                    height: `${logo.height}px`,
                  }}
                >
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ''}
                    width={logo.width}
                    height={logo.height}
                    className="h-full w-auto max-w-none object-contain"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
