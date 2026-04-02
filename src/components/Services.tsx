interface Service {
  num: string; icon: string; bg: string; name: string
  desc: string; tags: string[]; bioassay?: boolean
}

const SERVICES: Service[] = [
  {
    num: '01',
    icon: '🏛️',
    bg: '#0d948822',
    name: 'Regulatory Affairs Strategy & Advisory',
    desc: 'Comprehensive FDA regulatory strategy and submission-ready dossier preparation for drugs, biologics, and combination products. We craft complete IND, NDA, and BLA packages — clinical, preclinical, and CMC sections — that the client submits through their own FDA-registered sponsor account. Includes pre-submission meeting strategy, briefing document preparation, and FDA correspondence advisory.',
    tags: ['IND Strategy', 'NDA/BLA Prep', 'Pre-Sub Advisory', 'Submission Dossier'],
  },
  {
    num: '02',
    icon: '⚠️',
    bg: '#f59e0b22',
    name: 'REMS Design & Risk Management Advisory',
    desc: 'Expert design and documentation of Risk Evaluation and Mitigation Strategy programs — including ETASU requirements, stakeholder communication materials, benefit-risk frameworks, and REMS assessment reports. We deliver fully submission-ready REMS packages for the sponsor (NDA/BLA holder) to execute and submit. Includes medication error prevention analysis and risk communication strategy.',
    tags: ['REMS Design', 'Benefit-Risk', 'ETASU Documentation', 'Medication Safety'],
  },
  {
    num: '03',
    icon: '📄',
    bg: '#3b82f622',
    name: 'Scientific & Regulatory Technical Writing',
    desc: 'Peer-reviewed manuscript preparation, regulatory guidance documents, SOPs, clinical study reports, and executive summaries — authored to journal and FDA standards. Experienced first-author in Nature, Science, and leading biomedical journals. Includes literature review, stakeholder comment integration, multi-draft quality control, and final publication-ready deliverables.',
    tags: ['SOP Writing', 'Manuscripts', 'Guidance Docs', 'CSRs', 'Executive Summaries'],
  },
  {
    num: '04',
    icon: '🩺',
    bg: '#8b5cf622',
    name: 'Medical Device Regulatory Consulting (510K / PMA)',
    desc: 'End-to-end advisory and documentation for FDA medical device regulatory pathways. We prepare complete 510(K) and De Novo submission packages — predicate device analysis, performance testing summaries, biocompatibility documentation, and labeling — for the client to submit via their establishment account. Includes step-by-step FURLS registration guidance, GTIN/GMDN coordination advisory, and device change management support.',
    tags: ['510(K) Prep', 'De Novo Advisory', 'PMA Strategy', 'Registration Guidance'],
  },
  {
    num: '05',
    icon: '✅',
    bg: '#10b98122',
    name: 'Quality Management Systems (GMP / GLP)',
    desc: 'Quality system design, gap analysis, and remediation advisory for GMP and GLP compliance. Deliverables include master SOP libraries, deviation and CAPA management frameworks, change control procedures, audit preparation playbooks, and training curricula — all tailored to FDA inspection readiness.',
    tags: ['GMP', 'GLP', 'QMS Design', 'CAPA', 'Audit Readiness'],
  },
  {
    num: '06',
    icon: '🔬',
    bg: '#ef444422',
    name: 'Pre-clinical Data Analytics & Toxicology',
    desc: 'Expert analysis and interpretation of pre-clinical study data — including HTS/HCS dose-response modeling, IC50/EC50 determination, toxicology study summaries, and QSAR interpretation. We transform raw experimental data into regulatory-grade summary reports, validation matrices, and public-domain dissemination documents.',
    tags: ['HTS Analysis', 'Toxicology', 'Dose-Response', 'QSAR', 'Study Summaries'],
  },
  {
    num: '07',
    icon: '🧫',
    bg: '#14b8a622',
    bioassay: true,
    name: 'Bioassay Development & Validation',
    desc: 'Cell-based and biochemical bioassay design, optimization, and full GLP-compliant validation consulting — from assay concept through a complete validation package. Expertise spans potency assays for biologics, genotoxicity assays (Micronucleus, γH2AX), phospholipidosis detection, ELISA, qPCR, and high-content imaging (HCS). Deliverables: validation protocols, assay performance matrices, master SOPs, and signed validation reports.',
    tags: ['Cell-Based Assays', 'GLP Validation', 'HTS/HCS', 'Potency Assays', 'Genotoxicity'],
  },
  {
    num: '08',
    icon: '🧬',
    bg: '#a855f622',
    bioassay: true,
    name: 'Bioassay Technology Transfer & Troubleshooting',
    desc: 'Advisory and documentation for transferring established cell-based or biochemical assays between laboratories — including protocol adaptation, reagent qualification, comparability documentation, and cross-site validation. Specializing in HTS format transfers (384-well, 1536-well), assay miniaturization strategy, and systematic troubleshooting with root-cause analysis reports. All deliverables are lab-independent — no specialized platform access required.',
    tags: ['Tech Transfer', 'Comparability Docs', 'Format Adaptation', 'Root-Cause Analysis'],
  },
  {
    num: '09',
    icon: '🔭',
    bg: '#6366f122',
    name: 'Regulatory Intelligence & Landscape Analysis',
    desc: 'In-depth regulatory landscape research using fully public sources — FDA Drugs@FDA, Federal Register, CDER/CDRH guidance databases, EMA, and ICH platforms. Deliverables include pathway comparison reports, emerging regulation briefings, public-private partnership opportunity analyses, and executive summaries for leadership decision-making.',
    tags: ['Reg Intelligence', 'ICH/EMA', 'Public FDA Data', 'Landscape Reports'],
  },
  {
    num: '10',
    icon: '🤖',
    bg: '#f9731622',
    name: 'AI-Assisted Regulatory & Scientific Research',
    desc: 'Leveraging AI tools for regulatory literature mining, large-scale document review, scientific model training for life sciences datasets, and accelerated intelligence gathering — applied entirely to client-owned data and publicly available regulatory sources. Includes AI model evaluation, prompt engineering for regulatory workflows, and NLP-based document comparison.',
    tags: ['AI', 'Literature Mining', 'NLP', 'Regulatory Automation'],
  },
]

import { useState, lazy, Suspense } from 'react'
import { SERVICE_SAMPLES } from '../data/serviceSamples'

const SampleModal = lazy(() => import('./SampleModal'))

export default function Services() {
  const [openSample, setOpenSample] = useState<string | null>(null)
  const activeSample = SERVICE_SAMPLES.find(s => s.serviceNum === openSample) ?? null

  return (
    <section className="services" id="services">
      <div className="container">
        <span className="section-label">What We Offer</span>
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Ten high-value regulatory and scientific consulting services — all delivered as
          expert advisory and documentation work, fully independent of any FDA-restricted
          or third-party system access.
        </p>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className={`service-card${s.bioassay ? ' service-card--bioassay' : ''}`} key={s.num}>
              <div className="service-icon" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div className="service-num">{s.num}</div>
              <h3 className="service-name">{s.name}</h3>
              {s.bioassay && (
                <span className="service-badge">Bioassay Specialty</span>
              )}
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span className="service-tag" key={t}>{t}</span>
                ))}
              </div>
              <button
                className="service-sample-btn"
                onClick={() => setOpenSample(s.num)}
                aria-label={`View sample output for ${s.name}`}
              >
                📄 View Sample Output
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeSample && (
        <Suspense fallback={null}>
          <SampleModal sample={activeSample} onClose={() => setOpenSample(null)} />
        </Suspense>
      )}
    </section>
  )
}
