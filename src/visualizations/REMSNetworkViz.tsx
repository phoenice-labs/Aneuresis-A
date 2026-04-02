import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string; label: string; role: string; color: string; r: number; pulse: number
}
interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  label: string; strength: number
}

const NODES: NodeDatum[] = [
  { id: 'fda', label: 'FDA', role: 'Regulates and approves REMS programs. Reviews assessments and can require modifications at any time.', color: '#0f2044', r: 44, pulse: 0 },
  { id: 'sponsor', label: 'Drug Sponsor', role: 'Pharmaceutical company responsible for designing, implementing, funding and monitoring the REMS program.', color: '#0d9488', r: 36, pulse: 0 },
  { id: 'hcp', label: 'Healthcare Providers', role: 'Must complete training and certification before prescribing. Enroll in REMS registry and verify patient eligibility.', color: '#8b5cf6', r: 30, pulse: 0 },
  { id: 'pharmacy', label: 'Pharmacies', role: 'Must be certified to dispense REMS drugs. Verify provider certification and patient enrollment before every dispense.', color: '#3b82f6', r: 28, pulse: 0 },
  { id: 'patient', label: 'Patients', role: 'May need to enroll, provide informed consent, undergo lab monitoring, or meet pregnancy testing requirements.', color: '#ef4444', r: 28, pulse: 0 },
  { id: 'distributor', label: 'Distributors', role: 'Must be authorized to distribute restricted drugs. Only ship to certified pharmacies and healthcare facilities.', color: '#f59e0b', r: 26, pulse: 0 },
  { id: 'etasu', label: 'ETASU', role: 'Elements to Assure Safe Use — specific requirements (labs, registries, monitoring) mandated by FDA for high-risk drugs.', color: '#10b981', r: 24, pulse: 0 },
  { id: 'assessor', label: 'Assessment', role: 'Periodic REMS assessments submitted to FDA at 18 months, 3 years, and 7 years to evaluate program effectiveness.', color: '#a855f7', r: 22, pulse: 0 },
]

const LINKS: LinkDatum[] = [
  { source: 'fda', target: 'sponsor', label: 'Approval & Oversight', strength: 3 },
  { source: 'fda', target: 'etasu', label: 'Mandates', strength: 2 },
  { source: 'fda', target: 'assessor', label: 'Receives', strength: 2 },
  { source: 'sponsor', target: 'hcp', label: 'Training & Enrollment', strength: 2 },
  { source: 'sponsor', target: 'pharmacy', label: 'Certification', strength: 2 },
  { source: 'sponsor', target: 'distributor', label: 'Authorization', strength: 2 },
  { source: 'sponsor', target: 'assessor', label: 'Submits', strength: 1 },
  { source: 'hcp', target: 'patient', label: 'Prescribing', strength: 2 },
  { source: 'pharmacy', target: 'patient', label: 'Dispensing', strength: 2 },
  { source: 'distributor', target: 'pharmacy', label: 'Supply Chain', strength: 1 },
  { source: 'etasu', target: 'hcp', label: 'Requirements', strength: 1 },
  { source: 'etasu', target: 'patient', label: 'Conditions', strength: 1 },
]

export default function REMSNetworkViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!svgRef.current || !canvasRef.current) return
    const W = svgRef.current.parentElement?.clientWidth || 800
    const H = 420
    canvasRef.current.width = W
    canvasRef.current.height = H
    const ctx = canvasRef.current.getContext('2d')!

    const nodes: NodeDatum[] = NODES.map((d) => ({
      ...d,
      pulse: Math.random() * Math.PI * 2,
      // Start all nodes near centre so they settle inward, not outward
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H / 2 + (Math.random() - 0.5) * 80,
    }))

    const PAD = 20   // minimum gap from the SVG edge

    const sim = d3.forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(LINKS).id((d) => d.id).distance(95).strength(0.45))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.08))
      .force('x', d3.forceX<NodeDatum>(W / 2).strength(0.04))
      .force('y', d3.forceY<NodeDatum>(H / 2).strength(0.06))
      .force('collision', d3.forceCollide<NodeDatum>().radius((d) => d.r + 10))

    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${W} ${H}`)
    svg.selectAll('*').remove()
    const defs = svg.append('defs')
    defs.append('marker').attr('id', 'arrow-rems').attr('viewBox', '0 -4 8 8')
      .attr('refX', 8).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', 'rgba(255,255,255,0.25)')

    const tooltip = d3.select(tooltipRef.current)

    // Canvas loop — draw glowing edges and node halos
    let t = 0
    function drawCanvas() {
      ctx.clearRect(0, 0, W, H)
      t += 0.018

      // Draw pulsing link beams
      LINKS.forEach((lk) => {
        const src = nodes.find((n) => n.id === (lk.source as NodeDatum).id || n === lk.source)!
        const tgt = nodes.find((n) => n.id === (lk.target as NodeDatum).id || n === lk.target)!
        if (!src?.x || !tgt?.x) return
        const grd = ctx.createLinearGradient(src.x, src.y!, tgt.x!, tgt.y!)
        grd.addColorStop(0, src.color + '44')
        grd.addColorStop(1, tgt.color + '44')
        ctx.strokeStyle = grd
        ctx.lineWidth = lk.strength * 1.5
        ctx.shadowBlur = 8
        ctx.shadowColor = src.color + '88'
        ctx.beginPath()
        ctx.moveTo(src.x!, src.y!)
        ctx.lineTo(tgt.x!, tgt.y!)
        ctx.stroke()
        ctx.shadowBlur = 0

        // Traveling dot along edge
        const progress = (Math.sin(t + src.r) * 0.5 + 0.5)
        const px = src.x! + (tgt.x! - src.x!) * progress
        const py = src.y! + (tgt.y! - src.y!) * progress
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = src.color + 'cc'
        ctx.shadowBlur = 10
        ctx.shadowColor = src.color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Node halos
      nodes.forEach((n) => {
        if (!n.x) return
        n.pulse = (n.pulse ?? 0) + 0.03
        const haloR = n.r + 8 + Math.sin(n.pulse) * 4
        const grd = ctx.createRadialGradient(n.x!, n.y!, n.r, n.x!, n.y!, haloR + 12)
        grd.addColorStop(0, n.color + '55')
        grd.addColorStop(1, n.color + '00')
        ctx.beginPath()
        ctx.arc(n.x!, n.y!, haloR + 12, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(drawCanvas)
    }
    drawCanvas()

    // SVG: node circles + labels + drag
    const nodeG = svg.selectAll<SVGGElement, NodeDatum>('g.node')
      .data(nodes).join('g').attr('class', 'node').style('cursor', 'grab')
      .call(
        d3.drag<SVGGElement, NodeDatum>()
          .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag', (event, d) => {
            d.fx = Math.max(d.r + PAD, Math.min(W - d.r - PAD, event.x))
            d.fy = Math.max(d.r + PAD, Math.min(H - d.r - PAD, event.y))
          })
          .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
      )

    nodeG.append('circle').attr('r', (d) => d.r)
      .attr('fill', (d) => d.color)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 3)

    nodeG.each(function(d) {
      const lines = d.label.split(' ')
      const g = d3.select(this)
      if (lines.length === 1) {
        g.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('fill', 'white').attr('font-size', Math.min(11, d.r / 2.4)).attr('font-weight', '700').text(d.label)
      } else {
        lines.forEach((line, i) => {
          g.append('text').attr('text-anchor', 'middle')
            .attr('dy', `${(i - (lines.length - 1) / 2) * 13}`)
            .attr('fill', 'white').attr('font-size', Math.min(10, d.r / 2.6)).attr('font-weight', '700').text(line)
        })
      }
    })

    nodeG.on('mouseover', (event: MouseEvent, d: NodeDatum) => {
      d3.select(event.currentTarget as Element).select('circle').attr('stroke', 'white').attr('stroke-width', 4)
      tooltip.classed('visible', true)
        .html(`<strong>${d.label}</strong>${d.role}`)
        .style('left', `${event.clientX + 14}px`).style('top', `${event.clientY - 50}px`)
    })
    .on('mousemove', (e: MouseEvent) => tooltip.style('left', `${e.clientX + 14}px`).style('top', `${e.clientY - 50}px`))
    .on('mouseout', (event: MouseEvent, d: NodeDatum) => {
      d3.select(event.currentTarget as Element).select('circle').attr('stroke', d.color).attr('stroke-width', 3)
      tooltip.classed('visible', false)
    })

    // SVG link labels
    const linkLabelG = svg.append('g')
    LINKS.forEach((lk) => {
      linkLabelG.append('text').attr('class', `lk-${(lk.source as NodeDatum).id}-${(lk.target as NodeDatum).id}`)
        .attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', 7.5).attr('text-anchor', 'middle').text(lk.label)
    })

    sim.on('tick', () => {
      // Hard-clamp every node inside the SVG boundary
      nodes.forEach((d) => {
        d.x = Math.max(d.r + PAD, Math.min(W - d.r - PAD, d.x ?? W / 2))
        d.y = Math.max(d.r + PAD, Math.min(H - d.r - PAD, d.y ?? H / 2))
      })
      nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
      LINKS.forEach((lk) => {
        const src = lk.source as NodeDatum
        const tgt = lk.target as NodeDatum
        linkLabelG.select(`.lk-${src.id}-${tgt.id}`)
          .attr('x', ((src.x ?? 0) + (tgt.x ?? 0)) / 2)
          .attr('y', ((src.y ?? 0) + (tgt.y ?? 0)) / 2)
      })
    })

    svg.append('text').attr('x', W / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.28)').attr('font-size', 9)
      .text('Drag nodes · Hover for stakeholder role · Live signals show data flow')

    return () => { sim.stop(); cancelAnimationFrame(animRef.current); svg.selectAll('*').remove() }
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
