interface Props {
  size?: number
}

export default function ShieldLogo({ size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 4L8 12v16c0 15.5 10.2 28.6 24 32 13.8-3.4 24-16.5 24-32V12L32 4z"
        fill="#112240"
        stroke="#00d4ff"
        strokeWidth="2.5"
      />
      <path
        d="M32 12l-16 5.5V28c0 10.3 6.8 19.1 16 21.5 9.2-2.4 16-11.2 16-21.5V17.5L32 12z"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="32" cy="28" r="7" fill="none" stroke="#00d4ff" strokeWidth="2" />
      <path d="M32 23v10M27 28h10" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 42h20" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
