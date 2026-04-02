import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

function hillResponse(x: number, ec50: number, n: number, emax = 100) {
  return (emax * Math.pow(x, n)) / (Math.pow(ec50, n) + Math.pow(x, n))
}

const REF_COMPOUNDS = [
  { label: 'Compound A (Reference)', color: '#14b8a6', ec50: 1.0, hill: 1.5, dash: '6 3' },
  { label: 'Compound B (Potent, steep)', color: '#f59e0b', ec50: 0.08, hill: 2.8, dash: '4 4' },
  { label: 'Compound C (Weak, flat)', color: '#8b5cf6', ec50: 18.0, hill: 0.8, dash: '2 4' },
]

export default function DoseResponseViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [ec50, setEc50] = useState(1.0)
  const [hill, setHill] = useState(1.5)
  const [emax, setEmax] = useState(100)

  useEffect(() => {
    if (!svgRef.current) return
    const W = svgRef.current.parentElement?.clientWidth || 760
    const H = 310
    const margin = { top: 28, right: 28, bottom: 54, left: 60 }
    const iW = W - margin.left - margin.right
    const iH = H - margin.top - margin.bottom

    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${W} ${H}`)
    svg.selectAll('*').remove()
    const defs = svg.append('defs')

    // Gradient fill under user curve
    const areaGrad = defs.append('linearGradient').attr('id', 'area-grad').attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1')
    areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff').attr('stop-opacity', 0.18)
    areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ffffff').attr('stop-opacity', 0)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLog().domain([0.001, 1000]).range([0, iW])
    const yScale = d3.scaleLinear().domain([0, 115]).range([iH, 0])

    // Background grid
    yScale.ticks(5).forEach((tick) => {
      g.append('line').attr('x1', 0).attr('x2', iW)
        .attr('y1', yScale(tick)).attr('y2', yScale(tick))
        .attr('stroke', 'rgba(255,255,255,0.06)')
    })
    xScale.ticks(7).forEach((tick) => {
      g.append('line').attr('y1', 0).attr('y2', iH)
        .attr('x1', xScale(tick)).attr('x2', xScale(tick))
        .attr('stroke', 'rgba(255,255,255,0.06)')
    })

    // Axes
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(xScale).ticks(6, '.0e').tickSize(4))
      .call((ax) => ax.select('.domain').attr('stroke', 'rgba(255,255,255,0.25)'))
      .call((ax) => ax.selectAll('text').attr('fill', 'rgba(255,255,255,0.45)').attr('font-size', 9))
      .call((ax) => ax.selectAll('line').attr('stroke', 'rgba(255,255,255,0.15)'))
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}%`).tickSize(4))
      .call((ax) => ax.select('.domain').attr('stroke', 'rgba(255,255,255,0.25)'))
      .call((ax) => ax.selectAll('text').attr('fill', 'rgba(255,255,255,0.45)').attr('font-size', 9))
      .call((ax) => ax.selectAll('line').attr('stroke', 'rgba(255,255,255,0.15)'))

    // Axis labels
    g.append('text').attr('x', iW / 2).attr('y', iH + 44)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.45)').attr('font-size', 10)
      .text('Concentration (μM) — log scale')
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -iH / 2).attr('y', -46)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.45)').attr('font-size', 10)
      .text('% Response')

    // Helper: generate curve points
    const pts = (e50: number, n: number, em: number) =>
      d3.range(-3, 3.05, 0.04).map((lx) => {
        const x = Math.pow(10, lx)
        return [xScale(x), yScale(hillResponse(x, e50, n, em))] as [number, number]
      })

    const lineGen = d3.line<[number, number]>().x((d) => d[0]).y((d) => d[1]).curve(d3.curveCatmullRom)

    // Reference curves (dashed, muted)
    REF_COMPOUNDS.forEach((c) => {
      g.append('path').datum(pts(c.ec50, c.hill, 100))
        .attr('fill', 'none').attr('stroke', c.color)
        .attr('stroke-width', 1.5).attr('stroke-dasharray', c.dash).attr('opacity', 0.45)
        .attr('d', lineGen)
      // EC50 tick
      g.append('line')
        .attr('x1', xScale(c.ec50)).attr('x2', xScale(c.ec50))
        .attr('y1', yScale(50)).attr('y2', yScale(0))
        .attr('stroke', c.color).attr('stroke-width', 1).attr('stroke-dasharray', '3 4').attr('opacity', 0.3)
    })

    // Area fill under user curve
    const userPts = pts(ec50, hill, emax)
    const areaGen = d3.area<[number, number]>().x((d) => d[0])
      .y0(iH).y1((d) => d[1]).curve(d3.curveCatmullRom)
    g.append('path').datum(userPts).attr('fill', 'url(#area-grad)').attr('d', areaGen)

    // User curve (bright, animated)
    const userPath = g.append('path').datum(userPts)
      .attr('fill', 'none').attr('stroke', 'white').attr('stroke-width', 3)
      .attr('d', lineGen)
    const tLen = (userPath.node() as SVGPathElement).getTotalLength()
    userPath.attr('stroke-dasharray', `${tLen} ${tLen}`).attr('stroke-dashoffset', tLen)
      .transition().duration(900).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0)

    // EC50 indicator
    const safeX = Math.max(0.001, Math.min(ec50, 999))
    if (xScale(safeX) >= 0 && xScale(safeX) <= iW) {
      g.append('line')
        .attr('x1', xScale(safeX)).attr('x2', xScale(safeX))
        .attr('y1', yScale(emax * 0.5)).attr('y2', yScale(0))
        .attr('stroke', '#14b8a6').attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4').attr('opacity', 0.8)
      g.append('line')
        .attr('x1', 0).attr('x2', xScale(safeX))
        .attr('y1', yScale(emax * 0.5)).attr('y2', yScale(emax * 0.5))
        .attr('stroke', '#14b8a6').attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4').attr('opacity', 0.8)

      // EC50 label bubble
      const bx = xScale(safeX), by = yScale(emax * 0.5) - 22
      g.append('rect').attr('x', bx - 52).attr('y', by - 12).attr('width', 104).attr('height', 22)
        .attr('rx', 4).attr('fill', '#14b8a6').attr('opacity', 0.85)
      g.append('text').attr('x', bx).attr('y', by + 4).attr('text-anchor', 'middle')
        .attr('fill', 'white').attr('font-size', 10).attr('font-weight', '700')
        .text(`EC₅₀ = ${ec50.toFixed(2)} μM · n = ${hill.toFixed(1)}`)

      // Emax line
      g.append('line')
        .attr('x1', 0).attr('x2', iW)
        .attr('y1', yScale(emax)).attr('y2', yScale(emax))
        .attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-dasharray', '6 4')
      g.append('text').attr('x', iW - 4).attr('y', yScale(emax) - 5)
        .attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9)
        .text(`Emax = ${emax}%`)
    }

    // Legend
    const legItems = [...REF_COMPOUNDS.map((c) => ({ label: c.label, color: c.color, width: 1.5, dash: c.dash, opacity: 0.65 })),
      { label: `Your Curve  (EC₅₀=${ec50.toFixed(2)}, n=${hill.toFixed(1)}, Emax=${emax}%)`, color: '#ffffff', width: 3, dash: 'none', opacity: 1 }]
    legItems.forEach((l, i) => {
      g.append('line').attr('x1', 0).attr('x2', 18).attr('y1', i * 15 + 5).attr('y2', i * 15 + 5)
        .attr('stroke', l.color).attr('stroke-width', l.width)
        .attr('stroke-dasharray', l.dash).attr('opacity', l.opacity)
      g.append('text').attr('x', 22).attr('y', i * 15 + 9)
        .attr('fill', l.color).attr('font-size', 9).attr('font-weight', i === 3 ? '700' : '400')
        .attr('opacity', l.opacity).text(l.label)
    })

    return () => { svg.selectAll('*').remove() }
  }, [ec50, hill, emax])

  return (
    <div className="viz-wrapper" style={{ flexDirection: 'column', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 310 }} />
      <div className="sim-controls">
        <div className="sim-control-group">
          <label className="sim-control-label">EC₅₀ (potency): <span className="sim-control-value">{ec50.toFixed(2)} μM</span></label>
          <input type="range" className="sim-slider" min={0.01} max={50} step={0.01} value={ec50} onChange={(e) => setEc50(parseFloat(e.target.value))} />
        </div>
        <div className="sim-control-group">
          <label className="sim-control-label">Hill Coefficient (slope): <span className="sim-control-value">{hill.toFixed(1)}</span></label>
          <input type="range" className="sim-slider" min={0.3} max={4} step={0.1} value={hill} onChange={(e) => setHill(parseFloat(e.target.value))} />
        </div>
        <div className="sim-control-group">
          <label className="sim-control-label">Emax (ceiling): <span className="sim-control-value">{emax}%</span></label>
          <input type="range" className="sim-slider" min={20} max={100} step={1} value={emax} onChange={(e) => setEmax(parseInt(e.target.value))} />
        </div>
      </div>
    </div>
  )
}
