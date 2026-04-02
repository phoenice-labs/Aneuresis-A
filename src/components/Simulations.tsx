import { useState, Suspense, lazy } from 'react'

const RegulatoryPathwayViz = lazy(() => import('../visualizations/RegulatoryPathwayViz'))
const REMSNetworkViz        = lazy(() => import('../visualizations/REMSNetworkViz'))
const BioassayPlateViz      = lazy(() => import('../visualizations/BioassayPlateViz'))
const DoseResponseViz       = lazy(() => import('../visualizations/DoseResponseViz'))
const GlobalRegMapViz       = lazy(() => import('../visualizations/GlobalRegMapViz'))
const QualityDashboardViz   = lazy(() => import('../visualizations/QualityDashboardViz'))

interface Tab {
  id: string
  label: string
  service: string
  title: string
  desc: string
  component: React.ComponentType
}

const TABS: Tab[] = [
  {
    id: 'pathway',
    label: '🏛️ Drug Pathway',
    service: 'Service 01 — Regulatory Affairs Strategy & Advisory',
    title: 'FDA Drug Approval Pathway Simulator',
    desc: 'Animated particle flow through all eight FDA regulatory phases — Pre-clinical → IND → Phase 1–3 → NDA/BLA submission → FDA Review → Post-Market Surveillance. Each phase shows real-world success rates and typical durations. This is the strategic roadmap Aneuresis Regulatory Sciences navigates with every drug client.',
    component: RegulatoryPathwayViz,
  },
  {
    id: 'rems',
    label: '⚠️ REMS Network',
    service: 'Service 02 — REMS Design & Risk Management Advisory',
    title: 'REMS Stakeholder Ecosystem — Force-Directed Network',
    desc: 'Interactive force-directed graph of the full REMS stakeholder ecosystem: FDA, sponsor, REMS administrators, healthcare providers, pharmacies, distributors, and patients — all linked by compliance obligations. Drag any node to explore relationships. Hover for each stakeholder\'s role and ETASU requirements. Exactly the complexity we design and document for clients.',
    component: REMSNetworkViz,
  },
  {
    id: 'bioassay',
    label: '🧫 Bioassay Plate',
    service: 'Services 07 & 08 — Bioassay Development, Validation & Technology Transfer',
    title: '384-Well Plate Reader — Live HTS Scan Simulation',
    desc: 'Animated simulation of a 384-well high-throughput screening plate scan — the core workflow in bioassay development and technology transfer. The scan sweeps column by column revealing dose-response gradients across compound dilution series, vehicle controls (Col 1–2), and positive controls (Col 23–24). Real-time Z\'-factor, S/B ratio, and hit count metrics update as scanning completes. Hover any well for details.',
    component: BioassayPlateViz,
  },
  {
    id: 'dose',
    label: '🔬 Dose-Response',
    service: 'Service 06 — Pre-clinical Data Analytics & Toxicology',
    title: 'Hill Equation Dose-Response Explorer — IC₅₀ / EC₅₀ Modeling',
    desc: 'Live simulation of the Hill equation dose-response model — the core analytical framework for pre-clinical HTS and toxicology data. Adjust EC₅₀ (potency), Hill coefficient (slope), and Emax (maximum effect) using the sliders to see real-time curve changes. The shaded NOAEL zone shows how safe FIH starting doses are determined. Based on 15M+ compound data points analyzed at NIH Tox21.',
    component: DoseResponseViz,
  },
  {
    id: 'regmap',
    label: '🔭 Global Reg Map',
    service: 'Service 09 — Regulatory Intelligence & Landscape Analysis',
    title: 'Global Regulatory Timeline Intelligence — 5-Jurisdiction Comparison',
    desc: 'Animated Gantt-style timeline comparing regulatory approval pathways across five major jurisdictions: FDA (US), EMA (EU), PMDA (Japan), Health Canada, and ANVISA (Brazil). Standard vs. expedited timelines with key milestone markers. Click any row to explore pathway details, time savings, and strategic recommendations — the kind of intelligence briefing Aneuresis Regulatory Sciences delivers from public data sources.',
    component: GlobalRegMapViz,
  },
  {
    id: 'quality',
    label: '✅ QMS Dashboard',
    service: 'Service 05 — Quality Management Systems (GMP / GLP)',
    title: 'GMP / GLP Quality Management Dashboard — Live Compliance Metrics',
    desc: 'Animated arc gauge dashboard visualizing six critical quality KPIs: GMP Adherence, GLP Compliance, Documentation Control, Training Records, CAPA Closure Rate, and Audit Readiness Score. Each gauge animates to its score with color-coded ratings. Hover any gauge for a spark animation — representing the real-time quality system visibility Aneuresis Regulatory Sciences builds for clients facing FDA inspections.',
    component: QualityDashboardViz,
  },
]

const VizFallback = () => (
  <div style={{
    width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem',
  }}>
    Loading visualization...
  </div>
)

export default function Simulations() {
  const [activeTab, setActiveTab] = useState('pathway')
  const current = TABS.find((t) => t.id === activeTab)!
  const Viz = current.component

  return (
    <section className="simulations" id="simulations">
      <div className="container">
        <span className="section-label">Interactive Simulations</span>
        <h2 className="section-title">See Our Expertise in Action</h2>
        <p className="section-subtitle">
          Six interactive simulations — each built around a core service we deliver. Explore the
          analytical models, regulatory frameworks, and scientific workflows behind our work.
        </p>

        <div className="sim-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`sim-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sim-panel">
          <div className="sim-panel-header">
            <div className="sim-service-tag">{current.service}</div>
            <div className="sim-panel-title">{current.title}</div>
            <div className="sim-panel-desc">{current.desc}</div>
          </div>
          <Suspense fallback={<VizFallback />}>
            <Viz />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
