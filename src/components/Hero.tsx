const SERVICE_CARDS = [
  { icon: '🏛️', bg: '#0d9488', title: 'Regulatory Affairs Strategy', desc: 'IND · NDA · BLA dossier preparation' },
  { icon: '⚠️', bg: '#f59e0b', title: 'REMS Design & Risk Advisory', desc: 'ETASU · Benefit-risk · Medication safety' },
  { icon: '📄', bg: '#3b82f6', title: 'Scientific & Technical Writing', desc: 'Publications · SOPs · CSRs · Submissions' },
  { icon: '🩺', bg: '#8b5cf6', title: 'Medical Device Regulatory (510K)', desc: '510(K) · De Novo · PMA advisory' },
  { icon: '✅', bg: '#10b981', title: 'Quality Management (GMP/GLP)', desc: 'QMS design · CAPA · Audit readiness' },
  { icon: '🔬', bg: '#ef4444', title: 'Pre-clinical Analytics & Toxicology', desc: 'HTS · Toxicology · Dose-response · QSAR' },
  { icon: '🧫', bg: '#14b8a6', title: 'Bioassay Development & Validation', desc: 'Cell-based · GLP validation · HCS · Potency' },
  { icon: '🧬', bg: '#a855f6', title: 'Bioassay Technology Transfer', desc: 'Protocol transfer · Comparability · Root-cause' },
  { icon: '🔭', bg: '#6366f1', title: 'Regulatory Intelligence', desc: 'Landscape · ICH/EMA · Public FDA data' },
  { icon: '🤖', bg: '#f97316', title: 'AI-Assisted Regulatory Research', desc: 'Literature mining · NLP · Doc analysis' },
]

// Duplicated for seamless CSS infinite scroll loop
const LOOPED = [...SERVICE_CARDS, ...SERVICE_CARDS]

export default function Hero() {
  const navTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">

        {/* ── Left: Text content ── */}
        <div className="hero-content">

          {/* Philosophy badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Aneuresis · ἀνεύρεσις · Bringing Science to Light
          </div>

          {/* Main headline */}
          <h1 className="hero-title">
            Bringing Hidden Knowledge Into{' '}
            <em>Regulatory Light</em>
          </h1>

          {/* Greek philosophy tagline */}
          <div className="hero-aneuresis-line">
            <span className="hero-aneuresis-word">Aneuresis</span>
            <span className="hero-aneuresis-def">
              &thinsp;(ἀνεύρεσις) — A more intense form of discovery; the act of bringing
              what is hidden to light. The philosophy behind everything we do.
            </span>
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Aneuresis Regulatory Sciences LLC channels the spirit of discovery to
            illuminate complex regulatory pathways — delivering expert advisory across
            10 specialized services: drug approval strategy, REMS design, bioassay
            sciences, GMP/GLP quality systems, medical device pathways, regulatory
            intelligence, and AI-assisted research. FDA-insider expertise. NIH scientific
            depth. Submission-ready deliverables.
          </p>

          {/* CTA buttons */}
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navTo('services')}>
              Explore Our 10 Services
            </button>
            <button className="btn btn-outline" onClick={() => navTo('contact')}>
              Schedule a Call
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { num: '15+',  label: 'Years across NIH, FDA & Red Cross' },
              { num: '15M+', label: 'HTS/HCS data points at NIH Tox21' },
              { num: '10',   label: 'Specialized consulting services' },
              { num: '12+',  label: 'Peer-reviewed publications incl. Nature' },
            ].map((s) => (
              <div className="hero-stat" key={s.num}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Auto-scrolling service carousel ── */}
        <div className="hero-visual">
          <div className="hero-cards-track">
            {LOOPED.map((c, idx) => (
              <div className="hero-card" key={`${c.title}-${idx}`}>
                <div className="hero-card-icon" style={{ background: `${c.bg}22` }}>
                  {c.icon}
                </div>
                <div className="hero-card-body">
                  <div className="hero-card-title">{c.title}</div>
                  <div className="hero-card-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
