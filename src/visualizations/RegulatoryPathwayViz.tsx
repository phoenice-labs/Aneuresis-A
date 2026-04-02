import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const PHASES = [
  { id: 'discovery', label: 'Discovery', sub: 'Target ID', duration: '2–4 yrs', rate: 100, color: '#64748b', icon: '🔍', desc: 'Target identification, lead compound screening, structure-activity relationships. Thousands of compounds tested.' },
  { id: 'preclinical', label: 'Pre-Clinical', sub: 'Lab & Animal', duration: '1–6 yrs', rate: 70, color: '#3b82f6', icon: '🧬', desc: 'In vitro and in vivo pharmacology, ADME studies, safety/toxicity profiling. Required before any human testing.' },
  { id: 'ind', label: 'IND Filing', sub: '30-day FDA review', duration: '30 days', rate: 64, color: '#8b5cf6', icon: '📋', desc: 'Investigational New Drug application — opens the door for human trials. Includes protocol, investigator info, preclinical data package.' },
  { id: 'phase1', label: 'Phase I', sub: '20–80 volunteers', duration: '1–2 yrs', rate: 52, color: '#a855f7', icon: '👤', desc: 'First-in-human. Dose escalation, safety, pharmacokinetics, maximum tolerated dose.' },
  { id: 'phase2', label: 'Phase II', sub: '100–500 patients', duration: '2–3 yrs', rate: 28, color: '#f59e0b', icon: '📊', desc: 'Efficacy proof-of-concept in disease population. Dose ranging, side effects, early effectiveness signals. Major attrition gate.' },
  { id: 'phase3', label: 'Phase III', sub: '1,000–5,000', duration: '3–5 yrs', rate: 58, color: '#ef4444', icon: '🏥', desc: 'Confirmatory randomized controlled trials. Must demonstrate statistically significant benefit over standard of care.' },
  { id: 'nda', label: 'NDA / BLA', sub: 'Full submission', duration: '6–12 mo', rate: 86, color: '#10b981', icon: '📦', desc: 'Comprehensive dossier of all clinical, preclinical, and CMC data. Often 100,000+ pages submitted to FDA.' },
  { id: 'approved', label: '✓ Approved', sub: 'Market Launch', duration: '', rate: 100, color: '#14b8a6', icon: '🚀', desc: 'FDA approval granted. Product launches. Post-market surveillance begins. Average cost: $2.6B.' },
]

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; phase: number }

export default function RegulatoryPathwayViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const svgEl = svgRef.current
    const canvasEl = canvasRef.current
    if (!svgEl || !canvasEl) return

    const W = svgEl.parentElement?.clientWidth || 900
    const H = 420
    const N = PHASES.length
    const colW = W / N
    const nodeY = H * 0.45
    const nodeR = Math.min(colW * 0.3, 34)
    const nodeX = PHASES.map((_, i) => colW * i + colW / 2)

    canvasEl.width = W
    canvasEl.height = H
    const ctx = canvasEl.getContext('2d')!

    function spawnParticle() {
      const pi = Math.floor(Math.random() * (N - 1))
      const life = 90 + Math.random() * 60
      particlesRef.current.push({
        x: nodeX[pi], y: nodeY + (Math.random() - 0.5) * 6,
        vx: (nodeX[pi + 1] - nodeX[pi]) / life,
        vy: (Math.random() - 0.5) * 0.5,
        life, maxLife: life, phase: pi,
      })
    }

    function drawCanvas() {
      ctx.clearRect(0, 0, W, H)
      // Connector tubes
      for (let i = 0; i < N - 1; i++) {
        const grad = ctx.createLinearGradient(nodeX[i], nodeY, nodeX[i + 1], nodeY)
        grad.addColorStop(0, PHASES[i].color + '55')
        grad.addColorStop(1, PHASES[i + 1].color + '55')
        ctx.strokeStyle = grad
        ctx.lineWidth = 7
        ctx.shadowBlur = 14
        ctx.shadowColor = PHASES[i].color + '88'
        ctx.beginPath()
        ctx.moveTo(nodeX[i] + nodeR, nodeY)
        ctx.lineTo(nodeX[i + 1] - nodeR, nodeY)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      // Spawn & draw particles
      if (Math.random() < 0.4) spawnParticle()
      const ps = particlesRef.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.x += p.vx; p.y += p.vy; p.life--
        if (p.life <= 0) { ps.splice(i, 1); continue }
        const alpha = Math.sin((1 - p.life / p.maxLife) * Math.PI)
        const hex = Math.round(alpha * 220).toString(16).padStart(2, '0')
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = PHASES[p.phase].color + hex
        ctx.shadowBlur = 10
        ctx.shadowColor = PHASES[p.phase].color
        ctx.fill()
        ctx.shadowBlur = 0
      }
      animRef.current = requestAnimationFrame(drawCanvas)
    }
    drawCanvas()

    // SVG layer
    const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`)
    svg.selectAll('*').remove()
    const defs = svg.append('defs')
    PHASES.forEach((ph) => {
      const rg = defs.append('radialGradient').attr('id', `pg-${ph.id}`)
      rg.append('stop').attr('offset', '0%').attr('stop-color', ph.color).attr('stop-opacity', 1)
      rg.append('stop').attr('offset', '100%').attr('stop-color', ph.color).attr('stop-opacity', 0.3)
      const filter = defs.append('filter').attr('id', `blur-${ph.id}`)
      filter.append('feGaussianBlur').attr('stdDeviation', 4)
    })

    const tooltip = d3.select(tooltipRef.current)

    PHASES.forEach((ph, i) => {
      const cx = nodeX[i]
      const g = svg.append('g').attr('transform', `translate(${cx},${nodeY})`).style('cursor', 'pointer')

      // Glow shadow
      g.append('circle').attr('r', nodeR + 12).attr('fill', ph.color).attr('opacity', 0.15)
        .attr('filter', `url(#blur-${ph.id})`)

      // Pulsing ring
      const ring = g.append('circle').attr('r', nodeR + 6).attr('fill', 'none')
        .attr('stroke', ph.color).attr('stroke-width', 1.5).attr('opacity', 0.4)
      ;(function pulse() {
        ring.transition().duration(1400 + i * 100).ease(d3.easeSinInOut)
          .attr('r', nodeR + 16).attr('opacity', 0.05)
          .transition().duration(1400 + i * 100).ease(d3.easeSinInOut)
          .attr('r', nodeR + 6).attr('opacity', 0.4)
          .on('end', pulse)
      })()

      // Node circle
      g.append('circle').attr('r', nodeR).attr('fill', `url(#pg-${ph.id})`)
        .attr('stroke', ph.color).attr('stroke-width', 2)

      // Success arc
      const arcGen = d3.arc<unknown>().innerRadius(nodeR + 3).outerRadius(nodeR + 8)
        .startAngle(-Math.PI * 0.75).cornerRadius(3)
      const arcPath = g.append('path').attr('fill', ph.color).attr('opacity', 0.9)
      arcPath.transition().delay(i * 160).duration(900).ease(d3.easeQuadOut)
        .attrTween('d', () => {
          const end = -Math.PI * 0.75 + Math.PI * 1.5 * (ph.rate / 100)
          const terp = d3.interpolate(-Math.PI * 0.75, end)
          return (t: number) => arcGen.endAngle(terp(t))({} as unknown) ?? ''
        })

      // Icon
      g.append('text').attr('text-anchor', 'middle').attr('dy', '0.15em')
        .attr('font-size', nodeR * 0.72).text(ph.icon)

      // Label below
      g.append('text').attr('text-anchor', 'middle').attr('y', nodeR + 22)
        .attr('fill', 'white').attr('font-size', Math.min(11.5, colW / 9.5)).attr('font-weight', '700')
        .text(ph.label)
      g.append('text').attr('text-anchor', 'middle').attr('y', nodeR + 35)
        .attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 8).text(ph.sub)
      if (ph.duration) {
        g.append('text').attr('text-anchor', 'middle').attr('y', nodeR + 47)
          .attr('fill', ph.color).attr('font-size', 8).attr('font-weight', '700').text(ph.duration)
      }
      // % above
      if (i > 0) {
        g.append('text').attr('text-anchor', 'middle').attr('y', -nodeR - 12)
          .attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).text(`${ph.rate}%`)
      }

      g.on('mouseover', (event: MouseEvent) => {
        d3.select(event.currentTarget as Element).select('circle:nth-of-type(3)').attr('stroke-width', 3.5).attr('stroke', 'white')
        tooltip.classed('visible', true)
          .html(`<strong>${ph.icon} ${ph.label}</strong>${ph.desc}`)
          .style('left', `${event.clientX + 14}px`).style('top', `${event.clientY - 50}px`)
      })
      .on('mousemove', (e: MouseEvent) => tooltip.style('left', `${e.clientX + 14}px`).style('top', `${e.clientY - 50}px`))
      .on('mouseout', (event: MouseEvent) => {
        d3.select(event.currentTarget as Element).select('circle:nth-of-type(3)').attr('stroke-width', 2).attr('stroke', ph.color)
        tooltip.classed('visible', false)
      })
    })

    svg.append('text').attr('x', W / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.28)').attr('font-size', 9)
      .text('Arc = % advancing to next stage · Only ~12% of Phase I candidates reach approval · Hover for details')

    return () => { cancelAnimationFrame(animRef.current); svg.selectAll('*').remove() }
  }, [])

  return (
    <div className="viz-wrapper" style={{ flexDirection: 'column', width: '100%' }}>
      <div className="d3-tooltip" ref={tooltipRef} />
      <div style={{ position: 'relative', width: '100%', height: 420 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
        <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
