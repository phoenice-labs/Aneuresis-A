import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// ── Plate geometry ──────────────────────────────────────────────────────────
const ROWS = 16
const COLS = 24
const SPC  = 21          // center-to-center spacing px
const WR   = 7.5         // well radius px
const PL   = 34          // left padding (row labels)
const PT   = 28          // top padding (col labels)
const CW   = PL + COLS * SPC + 18
const CH   = PT + ROWS * SPC + 18

const ROW_LABELS = 'ABCDEFGHIJKLMNOP'.split('')

// Color scale: dark green → lime → yellow → orange → red
const COLOR = d3.scaleSequential()
  .domain([0, 100])
  .interpolator(d3.interpolateRgbBasis(['#14532d','#22c55e','#84cc16','#eab308','#f97316','#dc2626']))

interface Well { r: number; c: number; resp: number; type: 'vehicle'|'test'|'posctl'; isHit: boolean }

function buildPlate(): Well[] {
  const seed = 42
  const rng = (() => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff } })()
  const wells: Well[] = []
  for (let r = 0; r < ROWS; r++) {
    // some rows are "inactive compounds"
    const inactive = r % 4 === 3
    for (let c = 0; c < COLS; c++) {
      let resp = 0
      let type: Well['type'] = 'test'
      if (c < 2) {
        type = 'vehicle'
        resp = 3 + rng() * 5
      } else if (c >= COLS - 2) {
        type = 'posctl'
        resp = 82 + rng() * 14
      } else {
        type = 'test'
        if (inactive) {
          resp = 3 + rng() * 8
        } else {
          // Logistic dose-response across 20 columns (2-fold dilution, high→low dose)
          const doseIdx = COLS - 3 - c
          const ec50col = 6 + rng() * 4
          const x = Math.pow(2, (doseIdx - ec50col))
          const base = x / (1 + x)
          resp = Math.min(100, base * (78 + rng() * 18) + 3 + rng() * 5)
        }
      }
      wells.push({ r, c, resp: Math.max(0, resp), type, isHit: false })
    }
  }
  // mark hits (test wells > 50%)
  return wells.map(w => ({ ...w, isHit: w.type === 'test' && w.resp > 50 }))
}

const PLATE = buildPlate()

function zFactor(plate: Well[]): number {
  const pos = plate.filter(w => w.type === 'posctl').map(w => w.resp)
  const neg = plate.filter(w => w.type === 'vehicle').map(w => w.resp)
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length
  const std  = (a: number[], m: number) => Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length)
  const mp = mean(pos), mn = mean(neg)
  const sp = std(pos, mp), sn = std(neg, mn)
  return +(1 - (3 * (sp + sn)) / Math.abs(mp - mn)).toFixed(2)
}

const Z_PRIME = zFactor(PLATE)
const SB_RATIO = +( PLATE.filter(w => w.type === 'posctl').reduce((s, w) => s + w.resp, 0) / 32 /
                    PLATE.filter(w => w.type === 'vehicle').reduce((s, w) => s + w.resp, 0) * 32 ).toFixed(1)
const HITS = PLATE.filter(w => w.isHit).length
const TEST_TOTAL = PLATE.filter(w => w.type === 'test').length
const HIT_RATE = +((HITS / TEST_TOTAL) * 100).toFixed(1)

export default function BioassayPlateViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef   = useRef<SVGSVGElement>(null)
  const animRef  = useRef<number>(0)
  const [scanCol, setScanCol] = useState(-1)
  const [done, setDone] = useState(false)
  const [hovered, setHovered] = useState<Well | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // canvas draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let col = -1
    let glowPhase = 0

    const draw = () => {
      ctx.clearRect(0, 0, CW, CH)

      // background
      ctx.fillStyle = '#0a1929'
      ctx.fillRect(0, 0, CW, CH)

      // row labels
      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.textAlign = 'right'
      for (let r = 0; r < ROWS; r++) {
        ctx.fillText(ROW_LABELS[r], PL - 8, PT + r * SPC + 4)
      }
      // col labels
      ctx.textAlign = 'center'
      for (let c = 0; c < COLS; c++) {
        ctx.fillStyle = c < 2 ? 'rgba(34,197,94,0.6)' :
                        c >= COLS - 2 ? 'rgba(220,38,38,0.6)' :
                        'rgba(255,255,255,0.25)'
        ctx.fillText(String(c + 1), PL + c * SPC, PT - 8)
      }

      glowPhase += 0.04

      // scan bar
      if (col >= 0 && col < COLS) {
        const bx = PL + col * SPC
        const grad = ctx.createLinearGradient(bx - 14, 0, bx + 14, 0)
        grad.addColorStop(0, 'rgba(13,148,136,0)')
        grad.addColorStop(0.5, 'rgba(13,148,136,0.18)')
        grad.addColorStop(1, 'rgba(13,148,136,0)')
        ctx.fillStyle = grad
        ctx.fillRect(bx - 14, 0, 28, CH)
      }

      // wells
      for (const w of PLATE) {
        const cx = PL + w.c * SPC
        const cy = PT + w.r * SPC
        const revealed = w.c <= col

        if (!revealed) {
          // unscanned well — dark circle
          ctx.beginPath()
          ctx.arc(cx, cy, WR, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.06)'
          ctx.fill()
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'
          ctx.lineWidth = 0.5
          ctx.stroke()
          continue
        }

        const color = COLOR(w.resp)

        // outer glow for hits
        if (w.isHit) {
          const glow = Math.sin(glowPhase + w.r * 0.4) * 0.5 + 0.5
          const glowR = ctx.createRadialGradient(cx, cy, 0, cx, cy, WR + 5)
          glowR.addColorStop(0, `rgba(234,179,8,${0.35 * glow})`)
          glowR.addColorStop(1, 'rgba(234,179,8,0)')
          ctx.beginPath()
          ctx.arc(cx, cy, WR + 5, 0, Math.PI * 2)
          ctx.fillStyle = glowR
          ctx.fill()
        }

        // well fill
        const radGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, WR)
        radGrad.addColorStop(0, d3.color(color)!.brighter(0.6).toString())
        radGrad.addColorStop(1, color)
        ctx.beginPath()
        ctx.arc(cx, cy, WR, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        // hit marker
        if (w.isHit) {
          ctx.beginPath()
          ctx.arc(cx, cy, WR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(251,191,36,${0.7 + 0.3 * Math.sin(glowPhase + w.r)})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(cx, cy, WR, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(0,0,0,0.25)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // control zone labels
      if (col >= 0) {
        ctx.font = '8px Inter, sans-serif'
        ctx.fillStyle = 'rgba(34,197,94,0.7)'
        ctx.textAlign = 'center'
        ctx.fillText('CTRL−', PL + 0.5 * SPC, CH - 4)
        if (col >= COLS - 1) {
          ctx.fillStyle = 'rgba(220,38,38,0.7)'
          ctx.fillText('CTRL+', PL + (COLS - 1.5) * SPC, CH - 4)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    // animate scan
    let startTime: number | null = null
    const totalDuration = 4000
    const scanAnim = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / totalDuration, 1)
      col = Math.floor(progress * COLS)
      setScanCol(col)
      if (progress < 1) {
        requestAnimationFrame(scanAnim)
      } else {
        setDone(true)
      }
    }
    const scanRaf = requestAnimationFrame(scanAnim)

    return () => {
      cancelAnimationFrame(animRef.current)
      cancelAnimationFrame(scanRaf)
    }
  }, [])

  // hover on SVG overlay
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (CW / rect.width)
    const my = (e.clientY - rect.top)  * (CH / rect.height)
    let found: Well | null = null
    for (const w of PLATE) {
      if (w.c > scanCol) continue
      const dx = mx - (PL + w.c * SPC)
      const dy = my - (PT + w.r * SPC)
      if (dx * dx + dy * dy < WR * WR * 1.8) { found = w; break }
    }
    setHovered(found)
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const statColor = (v: number, hi: number, lo: number) =>
    v >= hi ? '#22c55e' : v >= lo ? '#eab308' : '#ef4444'

  return (
    <div style={{ width: '100%', padding: '20px 8px 8px', boxSizing: 'border-box' }}>
      {/* Plate */}
      <div style={{ position: 'relative', width: '100%', maxWidth: CW, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ width: '100%', height: 'auto', borderRadius: 8,
                   border: '1px solid rgba(13,148,136,0.25)', display: 'block' }}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CW} ${CH}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        />
        {hovered && (
          <div style={{
            position: 'absolute', left: mousePos.x + 12, top: mousePos.y - 10,
            background: 'rgba(10,25,41,0.95)', border: '1px solid rgba(13,148,136,0.5)',
            borderRadius: 6, padding: '8px 12px', pointerEvents: 'none', zIndex: 10,
            fontSize: '0.72rem', fontFamily: 'Inter, sans-serif', color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontWeight: 700, color: '#14b8a6', marginBottom: 4 }}>
              {ROW_LABELS[hovered.r]}{hovered.c + 1}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>
              Type: <span style={{ color: 'white' }}>
                {hovered.type === 'vehicle' ? 'Vehicle Control (−)' :
                 hovered.type === 'posctl'  ? 'Positive Control (+)' : 'Test Compound'}
              </span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>
              Response: <span style={{ color: COLOR(hovered.resp), fontWeight: 700 }}>
                {hovered.resp.toFixed(1)}%
              </span>
            </div>
            {hovered.isHit && (
              <div style={{ color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>⚡ ACTIVE HIT</div>
            )}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 12, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap',
      }}>
        {[
          { label: "Z'-Factor", value: done ? Z_PRIME : '—', target: '≥ 0.50',
            color: done ? statColor(Z_PRIME, 0.6, 0.5) : 'rgba(255,255,255,0.3)' },
          { label: 'S/B Ratio', value: done ? `${SB_RATIO}×` : '—', target: '≥ 5.0×',
            color: done ? statColor(SB_RATIO, 10, 5) : 'rgba(255,255,255,0.3)' },
          { label: 'Active Hits', value: done ? String(HITS) : '—', target: `${HIT_RATE}% rate`,
            color: done ? '#f97316' : 'rgba(255,255,255,0.3)' },
          { label: 'Wells Scanned', value: `${Math.min(scanCol + 1, COLS) * ROWS} / ${ROWS * COLS}`,
            target: '384-well plate', color: '#14b8a6' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '10px 18px', textAlign: 'center', minWidth: 110,
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color,
                          fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)',
                          fontFamily: 'Inter, sans-serif' }}>{s.target}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12,
                    flexWrap: 'wrap', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif',
                    color: 'rgba(255,255,255,0.45)' }}>
        {[
          { color: '#22c55e', label: 'Low Response / Vehicle Control' },
          { color: '#eab308', label: 'Mid Response' },
          { color: '#dc2626', label: 'High Response / Positive Control' },
          { color: '#fbbf24', label: '⚡ Active Hit (>50% response)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            {l.label}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
        Hover over scanned wells to inspect · Animation auto-replays on tab switch
      </div>
    </div>
  )
}
