import { useEffect, useRef, useState } from 'react'

interface Jurisdiction {
  id: string
  name: string
  flag: string
  designation: string
  standard: number   // years IND→Approval
  expedited: number  // years with fast-track
  color: string
  milestones: { t: number; label: string }[]
  details: string
}

const JURS: Jurisdiction[] = [
  {
    id: 'fda', name: 'FDA / CBER (US)', flag: '🇺🇸',
    designation: 'BTD + RMAT + Accelerated Approval',
    standard: 8, expedited: 3.5, color: '#0d9488',
    milestones: [
      { t: 0, label: 'IND' }, { t: 1.5, label: 'Ph1' }, { t: 3.5, label: 'Ph2' },
      { t: 6, label: 'BLA' }, { t: 8, label: 'Approval' },
    ],
    details: 'Breakthrough Therapy + RMAT designation provides rolling review, frequent FDA engagement, and priority review — compressing standard 8-year timeline to ~3.5 years for ATMP approvals.',
  },
  {
    id: 'ema', name: 'EMA / CAT (EU)', flag: '🇪🇺',
    designation: 'PRIME Designation',
    standard: 9, expedited: 5, color: '#3b82f6',
    milestones: [
      { t: 0, label: 'IND-Eq' }, { t: 1.5, label: 'Ph1' }, { t: 4, label: 'Ph2' },
      { t: 7, label: 'MAA' }, { t: 9, label: 'Approval' },
    ],
    details: 'PRIME designation enables early EMA scientific advice and eligibility for accelerated assessment — cutting the standard 9-year ATMP path by ~4 years via early dialogue and adaptive licensing.',
  },
  {
    id: 'pmda', name: 'PMDA (Japan)', flag: '🇯🇵',
    designation: 'Sakigake Priority Review',
    standard: 6.5, expedited: 3, color: '#8b5cf6',
    milestones: [
      { t: 0, label: 'CTA' }, { t: 1.2, label: 'Ph1' }, { t: 3, label: 'Ph2' },
      { t: 5.5, label: 'NDA' }, { t: 6.5, label: 'Approval' },
    ],
    details: 'Sakigake Designation (Japanese BTD equivalent) triggers a ~6-month review clock post-submission plus early consultation — enabling Japan approval often concurrent with US, leveraging conditional approval mechanisms under RMPA.',
  },
  {
    id: 'hc', name: 'Health Canada', flag: '🇨🇦',
    designation: 'Priority Review + NOC/c',
    standard: 7, expedited: 4, color: '#f59e0b',
    milestones: [
      { t: 0, label: 'CTA' }, { t: 1.5, label: 'Ph1' }, { t: 3.5, label: 'Ph2' },
      { t: 6, label: 'NDS' }, { t: 7, label: 'NOC' },
    ],
    details: 'Health Canada Priority Review (180-day review clock) plus Notice of Compliance with Conditions (NOC/c) pathway allows conditional approval pending post-market commitments — reducing timeline by ~3 years vs. standard submission.',
  },
  {
    id: 'anvisa', name: 'ANVISA (Brazil)', flag: '🇧🇷',
    designation: 'Regime Especial (RDC 204/2017)',
    standard: 9.5, expedited: 5.5, color: '#ef4444',
    milestones: [
      { t: 0, label: 'IND-Eq' }, { t: 2, label: 'Ph1' }, { t: 4.5, label: 'Ph2' },
      { t: 8, label: 'Reg. Sub.' }, { t: 9.5, label: 'Approval' },
    ],
    details: 'ANVISA Regime Especial priority pathway (360-day review) and post-approval via reference country reliance (US/EU approval) cuts Brazil timeline by ~4 years vs. independent standard review.',
  },
]

const MAX_YEARS = 10
const BAR_H = 28
const BAR_GAP = 20
const LABEL_W = 148
const RIGHT_PAD = 16
const TOP_PAD = 40
const CANVAS_H = TOP_PAD + JURS.length * (BAR_H + BAR_GAP) + 40
const CANVAS_W = 740

export default function GlobalRegMapViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<Jurisdiction>(JURS[0])
  const [, setProgress] = useState(0)

  const barW = CANVAS_W - LABEL_W - RIGHT_PAD
  const xScale = (years: number) => (years / MAX_YEARS) * barW

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let prog = 0
    let tickRef = 0
    let pulsePhase = 0

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // background
      ctx.fillStyle = '#060d1e'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      pulsePhase += 0.04

      // grid lines + year labels
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      for (let y = 0; y <= MAX_YEARS; y += 1) {
        const x = LABEL_W + xScale(y)
        ctx.strokeStyle = y % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, TOP_PAD - 12)
        ctx.lineTo(x, CANVAS_H - 22)
        ctx.stroke()
        if (y % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)'
          ctx.fillText(`Yr ${y}`, x, TOP_PAD - 16)
        }
      }

      // axis label
      ctx.font = '9px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.textAlign = 'center'
      ctx.fillText('← Years from First IND / CTA to Market Approval →', LABEL_W + barW / 2, CANVAS_H - 6)

      JURS.forEach((j, i) => {
        const y0 = TOP_PAD + i * (BAR_H + BAR_GAP)
        const isHov = hovered === j.id
        const isSel = selected.id === j.id

        // row highlight
        if (isSel || isHov) {
          ctx.fillStyle = isHov ? 'rgba(255,255,255,0.04)' : 'rgba(13,148,136,0.06)'
          ctx.fillRect(0, y0 - 4, CANVAS_W, BAR_H + 8)
        }

        // flag + name label
        ctx.font = '11px Inter, sans-serif'
        ctx.fillStyle = isSel ? '#ffffff' : 'rgba(255,255,255,0.65)'
        ctx.textAlign = 'left'
        ctx.fillText(`${j.flag}  ${j.name}`, 8, y0 + BAR_H / 2 + 4)

        // designation chip
        ctx.font = '8px Inter, sans-serif'
        ctx.fillStyle = j.color + '99'
        ctx.fillText(j.designation, 8, y0 + BAR_H / 2 + 16)

        const bx = LABEL_W
        const revealedStd = Math.min(xScale(j.standard), xScale(j.standard) * prog)
        const revealedExp = Math.min(xScale(j.expedited), xScale(j.expedited) * prog)

        // Standard pathway track (faint background)
        const rnd = 4
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.beginPath()
        ctx.roundRect(bx, y0 + BAR_H / 2, xScale(j.standard), BAR_H / 2, [0, rnd, rnd, 0])
        ctx.fill()

        // Standard bar (filling)
        if (revealedStd > 0) {
          const gStd = ctx.createLinearGradient(bx, 0, bx + revealedStd, 0)
          gStd.addColorStop(0, j.color + '66')
          gStd.addColorStop(1, j.color + 'aa')
          ctx.fillStyle = gStd
          ctx.beginPath()
          ctx.roundRect(bx, y0 + BAR_H / 2, revealedStd, BAR_H / 2, [0, rnd, rnd, 0])
          ctx.fill()
          // label
          if (revealedStd > 60) {
            ctx.font = '8px Inter, sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.45)'
            ctx.textAlign = 'left'
            ctx.fillText(`Standard: ${j.standard} yr`, bx + 6, y0 + BAR_H - 2)
          }
        }

        // Expedited bar (filling)
        if (revealedExp > 0) {
          const gExp = ctx.createLinearGradient(bx, 0, bx + revealedExp, 0)
          gExp.addColorStop(0, j.color + 'cc')
          gExp.addColorStop(1, j.color)
          ctx.fillStyle = gExp
          ctx.beginPath()
          ctx.roundRect(bx, y0, revealedExp, BAR_H / 2, [0, rnd, rnd, 0])
          ctx.fill()
          // label
          if (revealedExp > 40) {
            ctx.font = '8px Inter, sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.textAlign = 'left'
            ctx.fillText(`Expedited: ${j.expedited} yr`, bx + 6, y0 + BAR_H / 2 - 4)
          }
        }

        // Milestones
        j.milestones.forEach(ms => {
          const mx = bx + xScale(ms.t)
          const revealThreshold = ms.t / j.standard
          if (prog < revealThreshold * 0.98) return

          const pulseFactor = 0.5 + 0.5 * Math.sin(pulsePhase + i * 1.1 + ms.t)
          const r = 5 + pulseFactor * 2

          // outer pulse ring
          ctx.beginPath()
          ctx.arc(mx, y0 + BAR_H / 2, r + 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${0.08 * pulseFactor})`
          ctx.fill()

          // dot
          ctx.beginPath()
          ctx.arc(mx, y0 + BAR_H / 2, 5, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
          ctx.strokeStyle = j.color
          ctx.lineWidth = 2
          ctx.stroke()

          // label
          ctx.font = '7.5px Inter, sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.textAlign = 'center'
          const labelY = i % 2 === 0 ? y0 - 4 : y0 + BAR_H + 10
          ctx.fillText(ms.label, mx, labelY)
        })

        // time savings annotation
        if (prog > 0.98) {
          const saved = j.standard - j.expedited
          const sx = bx + xScale(j.expedited)
          ctx.font = '9px Inter, sans-serif'
          ctx.fillStyle = '#14b8a6'
          ctx.textAlign = 'left'
          ctx.fillText(`↩ ${saved.toFixed(1)} yr saved`, sx + 6, y0 + BAR_H / 4 + 2)
        }
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    // animate fill
    const DURATION = 2800
    let start: number | null = null
    const fillAnim = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / DURATION, 1)
      // ease out cubic
      prog = 1 - Math.pow(1 - p, 3)
      setProgress(prog)
      if (p < 1) { tickRef = requestAnimationFrame(fillAnim) }
    }
    tickRef = requestAnimationFrame(fillAnim)

    return () => {
      cancelAnimationFrame(animRef.current)
      cancelAnimationFrame(tickRef)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height)
    const hitIdx = Math.floor((my - TOP_PAD) / (BAR_H + BAR_GAP))
    if (hitIdx >= 0 && hitIdx < JURS.length) {
      setHovered(JURS[hitIdx].id)
    } else {
      setHovered(null)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height)
    const hitIdx = Math.floor((my - TOP_PAD) / (BAR_H + BAR_GAP))
    if (hitIdx >= 0 && hitIdx < JURS.length) setSelected(JURS[hitIdx])
  }

  return (
    <div style={{ width: '100%', padding: '12px 8px 8px', boxSizing: 'border-box' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ width: '100%', height: 'auto', borderRadius: 8, cursor: 'pointer',
                 border: '1px solid rgba(13,148,136,0.2)', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={handleClick}
      />

      {/* Detail panel for selected jurisdiction */}
      <div style={{
        marginTop: 14, background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected.color}44`,
        borderLeft: `4px solid ${selected.color}`,
        borderRadius: 8, padding: '14px 18px',
        display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white',
                        fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
            {selected.flag} {selected.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: selected.color,
                        fontFamily: 'Inter, sans-serif', marginBottom: 8, fontWeight: 600 }}>
            {selected.designation}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)',
                        fontFamily: 'Georgia, serif', lineHeight: 1.7 }}>
            {selected.details}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 150 }}>
          {[
            { label: 'Standard Timeline', value: `${selected.standard} yr`, color: 'rgba(255,255,255,0.45)' },
            { label: 'Expedited Timeline', value: `${selected.expedited} yr`, color: selected.color },
            { label: 'Time Savings', value: `${(selected.standard - selected.expedited).toFixed(1)} yr`, color: '#14b8a6' },
            { label: 'Milestones', value: `${selected.milestones.length} tracked`, color: 'rgba(255,255,255,0.4)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 6,
              padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: s.color,
                            fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)',
                            fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 10,
                    flexWrap: 'wrap', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif',
                    color: 'rgba(255,255,255,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 8, borderRadius: 2, background: 'rgba(13,148,136,0.6)' }} />
          Standard Approval Path
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 8, borderRadius: 2, background: '#0d9488' }} />
          Expedited / Priority Path
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white',
                        border: '2px solid #0d9488', flexShrink: 0 }} />
          Key Regulatory Milestone
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
        Click any jurisdiction row for details · Analysis based on publicly available regulatory data
      </div>
    </div>
  )
}
