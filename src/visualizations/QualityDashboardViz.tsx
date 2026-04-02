import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const METRICS = [
  { label: 'GMP Compliance', score: 92, color: '#14b8a6', desc: 'Good Manufacturing Practice adherence across production processes, facilities, and documentation systems.' },
  { label: 'GLP Standards', score: 87, color: '#3b82f6', desc: 'Good Laboratory Practice compliance in pre-clinical studies, sample integrity, and laboratory audit trails.' },
  { label: 'Documentation', score: 95, color: '#10b981', desc: 'SOP completeness, version control, metadata accuracy, and regulatory document quality index.' },
  { label: 'Training Records', score: 78, color: '#8b5cf6', desc: 'Personnel training completion rate, competency assessments, and qualification verification status.' },
  { label: 'CAPA Closure', score: 84, color: '#f59e0b', desc: 'Corrective and Preventive Action timeliness, effectiveness verification, and systemic root cause resolution.' },
  { label: 'Audit Readiness', score: 89, color: '#ef4444', desc: 'Overall audit readiness score based on documentation completeness, training, and system compliance.' },
]

export default function QualityDashboardViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!svgRef.current || !canvasRef.current) return
    const W = svgRef.current.parentElement?.clientWidth || 800
    const H = 380
    canvasRef.current.width = W
    canvasRef.current.height = H
    const ctx = canvasRef.current.getContext('2d')!

    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${W} ${H}`)
    svg.selectAll('*').remove()
    const defs = svg.append('defs')

    const cols = 3, rows = 2
    const padX = 24, padY = 20
    const gW = (W - padX * 2) / cols
    const gH = (H - padY * 2) / rows
    const tooltip = d3.select(tooltipRef.current)

    // Particle positions for canvas
    interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }
    const sparks: Spark[] = []

    function spawnSpark(cx: number, cy: number, color: string) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.6 + Math.random() * 1.2
      sparks.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color,
      })
    }

    function drawCanvas() {
      ctx.clearRect(0, 0, W, H)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx; s.y += s.vy; s.vy += 0.02; s.life--
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        const alpha = s.life / s.maxLife
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = s.color + Math.round(alpha * 180).toString(16).padStart(2, '0')
        ctx.shadowBlur = 6; ctx.shadowColor = s.color
        ctx.fill(); ctx.shadowBlur = 0
      }
      animRef.current = requestAnimationFrame(drawCanvas)
    }
    drawCanvas()

    METRICS.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols)
      const cx = padX + col * gW + gW / 2
      const cy = padY + row * gH + gH / 2
      const r = Math.min(gW, gH) * 0.3
      const sw = r * 0.22

      // Radial gradient for node
      const rg = defs.append('radialGradient').attr('id', `qg-${i}`)
      rg.append('stop').attr('offset', '0%').attr('stop-color', m.color).attr('stop-opacity', 0.25)
      rg.append('stop').attr('offset', '100%').attr('stop-color', m.color).attr('stop-opacity', 0.05)

      const g = svg.append('g').attr('transform', `translate(${cx},${cy})`).style('cursor', 'pointer')

      // Background circle glow
      g.append('circle').attr('r', r + sw + 10).attr('fill', `url(#qg-${i})`).attr('opacity', 0.8)

      // Track arc (full circle, muted)
      const trackArc = d3.arc<unknown>()
        .innerRadius(r - sw / 2).outerRadius(r + sw / 2)
        .startAngle(-Math.PI * 0.85).endAngle(Math.PI * 0.85).cornerRadius(sw)
      g.append('path').attr('d', trackArc({} as unknown) ?? '')
        .attr('fill', 'rgba(255,255,255,0.07)')

      // Value arc (animated)
      const startA = -Math.PI * 0.85
      const endA = startA + Math.PI * 1.7 * (m.score / 100)
      const fillArc = d3.arc<unknown>()
        .innerRadius(r - sw / 2).outerRadius(r + sw / 2).cornerRadius(sw / 2)
      const fillPath = g.append('path').attr('fill', m.color).attr('opacity', 0.9)
      fillPath.transition().delay(i * 140).duration(1000).ease(d3.easeElasticOut.amplitude(1.1).period(0.55))
        .attrTween('d', () => {
          const terp = d3.interpolate(startA, endA)
          return (t: number) => fillArc.startAngle(startA).endAngle(terp(t))({} as unknown) ?? ''
        })

      // Needle indicator
      const needleAngle = startA + Math.PI * 1.7 * (m.score / 100)
      const nx = Math.sin(needleAngle) * (r + sw)
      const ny = -Math.cos(needleAngle) * (r + sw)
      const needleDot = g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', sw * 0.7)
        .attr('fill', m.color).attr('opacity', 0)
      needleDot.transition().delay(i * 140 + 1000).duration(300).attr('opacity', 1)
        .attr('cx', nx).attr('cy', ny)

      // Score number (count-up)
      const scoreText = g.append('text').attr('text-anchor', 'middle').attr('y', 6)
        .attr('fill', 'white').attr('font-size', r * 0.52).attr('font-weight', '800').text('0')
      scoreText.transition().delay(i * 140).duration(1000)
        .tween('text', () => {
          const terp = d3.interpolateNumber(0, m.score)
          return (t: number) => { scoreText.text(`${Math.round(terp(t))}`) }
        })

      // % symbol
      g.append('text').attr('text-anchor', 'middle').attr('y', r * 0.35)
        .attr('fill', m.color).attr('font-size', r * 0.2).attr('font-weight', '600').text('%')

      // Label below
      g.append('text').attr('text-anchor', 'middle').attr('y', r + sw + 22)
        .attr('fill', 'rgba(255,255,255,0.8)').attr('font-size', 10).attr('font-weight', '700')
        .text(m.label)

      // Rating badge
      const rating = m.score >= 90 ? { t: '⭐ Excellent', c: '#22c55e' } : m.score >= 80 ? { t: '✅ Good', c: '#eab308' } : { t: '⚠️ Attention', c: '#ef4444' }
      g.append('text').attr('text-anchor', 'middle').attr('y', r + sw + 36)
        .attr('fill', rating.c).attr('font-size', 8.5).attr('font-weight', '700').text(rating.t)

      // Hover
      g.on('mouseover', (event: MouseEvent) => {
        if (Math.random() < 0.7) {
          for (let k = 0; k < 12; k++) spawnSpark(cx, cy, m.color)
        }
        tooltip.classed('visible', true)
          .html(`<strong>${m.label}</strong>${m.desc}<br/><span style="color:${m.color}">Score: ${m.score}% — ${m.score >= 90 ? 'Excellent' : m.score >= 80 ? 'Good' : 'Needs attention'}</span>`)
          .style('left', `${event.clientX + 14}px`).style('top', `${event.clientY - 50}px`)
      })
      .on('mousemove', (e: MouseEvent) => tooltip.style('left', `${e.clientX + 14}px`).style('top', `${e.clientY - 50}px`))
      .on('mouseout', () => tooltip.classed('visible', false))
    })

    svg.append('text').attr('x', W / 2).attr('y', H - 6)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.28)').attr('font-size', 9)
      .text('Representative QMS metrics · Hover each gauge for description · Sparks on hover')

    return () => { cancelAnimationFrame(animRef.current); svg.selectAll('*').remove() }
  }, [])

  return (
    <div className="viz-wrapper" style={{ flexDirection: 'column', width: '100%' }}>
      <div className="d3-tooltip" ref={tooltipRef} />
      <div style={{ position: 'relative', width: '100%', height: 380 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
        <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
