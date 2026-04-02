export default function Credentials() {
  const stats = [
    { icon: '🏛️', value: '15+', label: 'Years Inside NIH, FDA & Red Cross' },
    { icon: '📰', value: '12+', label: 'Peer-Reviewed Publications' },
    { icon: '🧪', value: '15M+', label: 'HTS/HCS Data Points Analyzed' },
    { icon: '🎖️', value: '5×', label: 'Director & Achievement Awards' },
    { icon: '💰', value: '$1.2M', label: 'Research Portfolio Managed' },
    { icon: '📋', value: '100+', label: 'SOPs & Regulatory Documents Authored' },
  ]

  const trust = [
    {
      icon: '🏛️',
      title: 'FDA Insider Knowledge',
      detail: 'Former contractor at FDA\'s Division of Risk Management — built REMS repositories, drafted guidance reviewed by FDA directors, and conducted regulatory intelligence on CPOE, telehealth & combination products.',
    },
    {
      icon: '🧬',
      title: 'NIH-Grade Scientific Rigor',
      detail: 'Co-led Tox21 10K HTS campaigns at NIH/NCATS generating 15M+ quantitative toxicity data points. Our bioassay and pre-clinical analytics engagements are grounded in the same scientific standards used in landmark federal research.',
    },
    {
      icon: '🩺',
      title: 'Medical Device Compliance',
      detail: 'Managed 510(K) device registrations, deviation management, and change control processes at American Red Cross — the same rigor we bring to every device regulatory advisory engagement.',
    },
    {
      icon: '📰',
      title: 'Publication-Level Writing Quality',
      detail: 'First-author publications in Nature Communications, ACS Chemical Biology, and Frontiers in Environmental Science. Our scientific and regulatory writing deliverables are held to the same standard.',
    },
    {
      icon: '🏆',
      title: 'Recognized by the Institutions That Matter',
      detail: 'NCATS Director\'s Award (NIH, 2015) · NIH Director\'s Award (Tox21 Consortium, 2014) · 4× Distinguished Achievement Award (Kelly Government Solutions, 2012–2015). Independent validation from institutions that set the regulatory standard.',
    },
    {
      icon: '🌐',
      title: 'Cross-Domain Strategic Range',
      detail: 'From HTS automation and bioassay validation to NDA submissions, REMS frameworks, GMP gap analysis, and AI-assisted literature mining — a single firm fluent across the full regulatory and scientific continuum.',
    },
  ]

  const pubs = [
    {
      journal: 'Nature Communications',
      why: 'Informs our predictive toxicology and AI-assisted regulatory analytics services',
      text: 'Modelling the Tox21 10K chemical profiles for in vivo toxicity prediction — Huang, Xia, Shahane et al. (2016)',
    },
    {
      journal: 'ACS Chemical Biology',
      why: 'Validates our NRF2/KEAP1 pathway expertise and cancer biology consulting',
      text: 'Small Molecule Inhibitor of NRF2 Selectively Intervenes Therapeutic Resistance in KEAP1-Deficient NSCLC Tumors — Singh, Shahane et al. (2016)',
    },
    {
      journal: 'J. Biomolecular Screening',
      why: 'Demonstrates first-author bioassay development expertise — directly applied in our bioassay validation service',
      text: 'Detection of Phospholipidosis Induction: A Cell-Based Assay in HTS and HCS Format — Shahane et al. (2014) [First Author]',
    },
    {
      journal: 'Frontiers in Env. Science',
      why: 'Showcases our computational toxicology modeling depth for pre-clinical analytics clients',
      text: 'Tox21 Challenge to Build Predictive Models of Nuclear Receptor and Stress Response Pathways — Huang, Shahane et al. (2016)',
    },
    {
      journal: 'DNA Repair',
      why: 'Highlights cell-based HTS platform expertise applied in our bioassay troubleshooting service',
      text: 'Identification of novel PARP inhibitors using a cell-based TDP1 inhibitory assay — Murai, Shahane et al. (2014)',
    },
    {
      journal: 'Mutagenesis',
      why: 'Underpins our genotoxicity and regulatory toxicology advisory capabilities',
      text: 'Identification of genotoxic compounds using isogenic DNA repair deficient DT40 cell lines on qHTS — Nishihara, Shahane et al. (2016)',
    },
  ]

  return (
    <section className="credentials" id="credentials">
      <div className="container">
        <span className="section-label">Why Trust Us</span>
        <h2 className="section-title">Scientific Authority, Institutionally Proven</h2>
        <p className="section-subtitle">
          Every deliverable Aneuresis Regulatory Sciences produces is backed by direct institutional
          experience — not interpreted from guidelines, but lived inside the organizations that write them.
        </p>

        <div className="credentials-grid">
          {stats.map((s) => (
            <div className="cred-card" key={s.value}>
              <div className="cred-icon">{s.icon}</div>
              <div className="cred-value">{s.value}</div>
              <div className="cred-label">{s.label}</div>
            </div>
          ))}
        </div>

        <span className="section-label" style={{ marginBottom: 16, display: 'block' }}>
          What Our Background Means for Your Project
        </span>
        <div className="awards-grid">
          {trust.map((t) => (
            <div className="award-item award-item--trust" key={t.title}>
              <span className="award-icon">{t.icon}</span>
              <div className="award-body">
                <div className="award-name">{t.title}</div>
                <div className="award-detail">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="publications-section">
          <span className="section-label" style={{ marginBottom: 4, display: 'block' }}>
            Peer-Reviewed Science Behind Our Services
          </span>
          <p className="section-subtitle" style={{ marginBottom: 24, fontSize: '0.9rem' }}>
            Our publications are not a résumé item — they are proof of the scientific depth
            that every consulting engagement draws from.
          </p>
          <div className="pub-list">
            {pubs.map((p) => (
              <div className="pub-item" key={p.journal}>
                <div style={{ flex: 1 }}>
                  <span className="pub-journal">{p.journal}</span>
                  <span className="pub-why">→ {p.why}</span>
                  <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
