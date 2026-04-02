import { useState } from 'react'

interface Props {
  size?: 'sm' | 'lg'
}

// 8 evenly spaced ray angles
const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

export default function AneuresisLogo({ size = 'sm' }: Props) {
  const [hovered, setHovered] = useState(false)
  const [burst, setBurst] = useState(false)
  const isLg = size === 'lg'
  const px = isLg ? 156 : 36

  // Unique ID suffix so both instances can coexist without conflicting <defs>
  const uid = size

  const handleClick = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 900)
  }

  const rayOuter = burst ? 46 : hovered ? 38 : 18
  const rayOpacity = burst ? 0.95 : hovered ? 0.78 : 0.14

  return (
    <div
      className={`ars-wrap ars-wrap--${size}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      title="Aneuresis · ἀνεύρεσις · Bringing what is hidden to light"
      style={{ cursor: 'pointer' }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        className={`ars-svg${burst ? ' ars-burst' : ''}`}
        aria-label="Aneuresis Regulatory Sciences logo"
      >
        <defs>
          {/* Radial glow from center */}
          <radialGradient id={`ars-glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#99f6e4" stopOpacity="1" />
            <stop offset="30%"  stopColor="#0d9488" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#060e1e" stopOpacity="0" />
          </radialGradient>
          {/* Dark sphere background */}
          <radialGradient id={`ars-bg-${uid}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#10264a" />
            <stop offset="100%" stopColor="#04090f" />
          </radialGradient>
          {/* Soft glow filter for center core */}
          <filter id={`ars-gf-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Text glow */}
          <filter id={`ars-tf-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Dark sphere background ── */}
        <circle cx="50" cy="50" r="49" fill={`url(#ars-bg-${uid})`} />

        {/* ── Outer border ring ── */}
        <circle cx="50" cy="50" r="48" fill="none"
          stroke="#0d9488" strokeWidth="0.8" strokeOpacity="0.5" />

        {/* ── Outer dashed orbit ring with 4 particles — rotates CW ── */}
        <g className="ars-orbit-outer">
          <circle cx="50" cy="50" r="40" fill="none"
            stroke="#0d9488" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="2 7" />
          {/* Particles at compass points */}
          <circle cx="90" cy="50" r="2.2" fill="#14b8a6" opacity="0.85" />
          <circle cx="50" cy="10" r="1.5" fill="#14b8a6" opacity="0.55" />
          <circle cx="10" cy="50" r="2.2" fill="#14b8a6" opacity="0.85" />
          <circle cx="50" cy="90" r="1.5" fill="#0d9488"  opacity="0.55" />
        </g>

        {/* ── Mid orbit ring with 2 particles — rotates CCW ── */}
        <g className="ars-orbit-mid">
          <circle cx="50" cy="50" r="27" fill="none"
            stroke="#14b8a6" strokeWidth="0.7" strokeOpacity="0.25" strokeDasharray="1 5" />
          <circle cx="77" cy="50" r="2.4" fill="#5eead4" opacity="0.9" />
          <circle cx="23" cy="50" r="1.6" fill="#0d9488"  opacity="0.65" />
        </g>

        {/* ── Inner orbit ring — rotates CW faster ── */}
        <g className="ars-orbit-inner">
          <circle cx="50" cy="50" r="14" fill="none"
            stroke="#5eead4" strokeWidth="0.8"
            strokeOpacity={hovered ? 0.85 : 0.35}
            style={{ transition: 'stroke-opacity 0.3s' }}
          />
          <circle cx="64" cy="50" r="1.8" fill="#99f6e4" opacity="0.9" />
        </g>

        {/* ── Light rays — emerge from inner core outward ── */}
        {RAYS.map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const innerR = 9
          return (
            <line key={angle}
              x1={50 + Math.cos(rad) * innerR}
              y1={50 + Math.sin(rad) * innerR}
              x2={50 + Math.cos(rad) * rayOuter}
              y2={50 + Math.sin(rad) * rayOuter}
              stroke="#5eead4"
              strokeWidth={i % 2 === 0 ? 1.5 : 0.7}
              strokeOpacity={rayOpacity}
              strokeLinecap="round"
              style={{ transition: `all 0.38s ease ${i * 22}ms` }}
            />
          )
        })}

        {/* ── Radial glow overlay (pulses with hover) ── */}
        <circle cx="50" cy="50" r="30"
          fill={`url(#ars-glow-${uid})`}
          opacity={hovered ? 0.95 : burst ? 1 : 0.38}
          style={{ transition: 'opacity 0.4s ease' }}
        />

        {/* ── Center core: triple-layer bright spot ── */}
        <circle cx="50" cy="50" r="6.5"
          fill="#0d9488"
          filter={`url(#ars-gf-${uid})`}
          opacity={hovered ? 1 : 0.85}
          style={{ transition: 'opacity 0.3s' }}
        />
        <circle cx="50" cy="50" r="3.8" fill="#5eead4" />
        <circle cx="50" cy="50" r="2"   fill="#d1faf4" />
        <circle cx="50" cy="50" r="0.8" fill="white" />

        {/* ── Greek Α — only on large; fades in on hover ── */}
        {isLg && (
          <>
            {/* Dim version (resting) */}
            <text x="50" y="57" textAnchor="middle" fontSize="14"
              fontFamily="Georgia, 'Playfair Display', serif" fontWeight="700"
              fill="white" opacity={hovered ? 0 : 0.18}
              style={{ transition: 'opacity 0.35s', userSelect: 'none' }}>
              Α
            </text>
            {/* Glowing version (on hover) */}
            <text x="50" y="57" textAnchor="middle" fontSize="14"
              fontFamily="Georgia, 'Playfair Display', serif" fontWeight="700"
              fill="#99f6e4" opacity={hovered ? 0.95 : 0}
              filter={`url(#ars-tf-${uid})`}
              style={{ transition: 'opacity 0.35s', userSelect: 'none' }}>
              Α
            </text>
          </>
        )}
      </svg>

      {/* ── Wordmark — only on large size ── */}
      {isLg && (
        <div className="ars-wordmark">
          <div className="ars-wordmark-name">Aneuresis</div>
          <div className="ars-wordmark-greek">ἀνεύρεσις</div>
          <div className="ars-wordmark-tagline">Bringing what is hidden to light</div>
        </div>
      )}
    </div>
  )
}
