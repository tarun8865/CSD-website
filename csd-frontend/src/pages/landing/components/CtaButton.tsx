import arrowDark from '../assets/arrow-dark.svg'
import arrowLight from '../assets/arrow-light.svg'
import arrowLearnMore from '../assets/arrow-learn-more.svg'
import arrowTalk from '../assets/arrow-talk.svg'

type CtaButtonProps = {
  label: string
  variant: 'light' | 'dark' | 'aqua' | 'talk'
  className?: string
  href?: string
  onClick?: () => void
  pill?: boolean
  size?: 'default' | 'sm'
}

const variantClass = {
  light: {
    button: 'bg-white text-ink',
    mark: 'bg-ink',
    arrow: arrowLight,
  },
  dark: {
    button: 'bg-ink text-white',
    mark: 'bg-white',
    arrow: arrowDark,
  },
  aqua: {
    button: 'bg-aqua text-ink',
    mark: 'bg-white',
    arrow: arrowLearnMore,
  },
  talk: {
    button: 'bg-ink text-white',
    mark: 'bg-white',
    arrow: arrowTalk,
  },
} as const

export default function CtaButton({
  label,
  variant,
  className,
  href,
  onClick,
  pill = false,
  size = 'default',
}: CtaButtonProps) {
  const { button, mark, arrow } = variantClass[variant]
  const isSm = size === 'sm'

  const heightClass = isSm ? 'h-[44px]' : 'h-control'
  const gapClass = isSm ? 'gap-3' : 'gap-[clamp(12px,1.39cqi,20px)]'
  const paddingClass = pill
    ? isSm
      ? 'rounded-full pr-1.5 pl-5'
      : 'rounded-full pr-1.5 pl-[clamp(20px,1.67cqi,26px)]'
    : isSm
      ? 'pr-1 pl-3.5'
      : 'pr-1 pl-[clamp(16px,1.39cqi,20px)]'
  const textClass = isSm ? 'text-[13.5px]' : 'text-[clamp(15px,1.11cqi,16px)]'
  const markSizeClass = isSm ? 'size-[34px]' : 'size-control'
  const arrowSizeClass = isSm ? 'h-[17px] w-[15px]' : 'h-[22.4px] w-[19.5993px]'

  const displayClass = className && /\b(hidden|flex|inline-block|block|none)\b/.test(className) ? '' : 'inline-flex'
  const classes = `group ${heightClass} ${displayClass} cursor-pointer items-center justify-between ${gapClass} border-0 py-0 ${paddingClass} font-sans ${textClass} leading-5 font-normal tracking-normal whitespace-nowrap uppercase no-underline [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100] hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-current ${button} ${className ?? ''}`

  const content = (
    <>
      <span>{label}</span>
      <span
        className={`${markSizeClass} flex shrink-0 items-center justify-center ${
          pill ? 'rounded-full' : ''
        } ${mark}`}
        aria-hidden="true"
      >
        <img
          src={arrow}
          alt=""
          width="19.5993"
          height="22.4"
          className={`${arrowSizeClass} rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:rotate-[405deg]`}
        />
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  )
}
