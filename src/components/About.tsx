import AneuresisLogo from './AneuresisLogo'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-inner">
          {/* Left column */}
          <div className="about-left">
            <div className="about-portrait">
              <AneuresisLogo size="lg" />
              <div className="about-portrait-badge">FDA · NIH · Red Cross · Est. 2025</div>
            </div>
            <div className="about-orgs">
              {['NIH / NCATS', 'FDA (Chenega)', 'American Red Cross', 'RAPS Member', 'Johns Hopkins M.S.'].map((o) => (
                <span className="about-org-tag" key={o}>{o}</span>
              ))}
            </div>

            {/* Firm philosophy quote */}
            <div className="about-philosophy">
              <div className="about-philosophy-quote">
                "We don't just advise — we illuminate the path through regulatory complexity,
                bringing what is hidden to light."
              </div>
              <div className="about-philosophy-attr">— Aneuresis Regulatory Sciences</div>
            </div>
          </div>

          {/* Right column */}
          <div className="about-right">
            <span className="section-label">Our Foundation</span>
            <h2 className="section-title">
              Built from the <em>Inside Out</em>
            </h2>

            <p className="about-intro">
              Aneuresis Regulatory Sciences LLC was founded on a rare convergence: a
              Nature-published research scientist who has also worked from <em>within</em> the FDA
              — giving our clients the perspective of the reviewer, not just the submitter.
            </p>

            <p className="about-body">
              Most regulatory consultants advise from the outside. Our firm was built from the
              inside out — shaped by 15+ years of direct institutional experience across the
              NIH Chemical Genomics Center, the FDA Division of Risk Management, and American
              Red Cross medical device compliance. That depth translates into submissions that
              anticipate reviewer questions before they are asked.
            </p>

            <p className="about-body">
              At NIH, we generated and interpreted 15M+ high-quality toxicity data points across
              the Tox21 10K compound library — the backbone of modern predictive toxicology.
              At FDA, we built regulatory intelligence programs, developed central REMS literature
              repositories, and drafted guidance documents reviewed by FDA directors. At Red Cross,
              we managed 510(K) device registrations, CAPA cycles, and change control processes
              end-to-end.
            </p>

            <p className="about-body">
              When you engage Aneuresis Regulatory Sciences, you are not hiring a generalist.
              You are accessing 15 years of domain-specific institutional knowledge — packaged
              into targeted, high-quality deliverables that move your program forward.
            </p>

            <div className="about-highlights">
              {[
                { num: 'FDA Insider', label: 'Direct experience drafting FDA guidance, REMS repositories, and regulatory intelligence reports' },
                { num: '$1.2M', label: 'Research portfolio managed at NIH Tox21 with 20% cost reduction through process optimization' },
                { num: '15M+', label: 'HTS/HCS data points analyzed — scientific depth that informs every toxicology and bioassay engagement' },
                { num: 'Nature-Level', label: 'First-author publications in Nature, ACS, and Frontiers — scientific rigor underpins every deliverable' },
              ].map((h) => (
                <div className="about-highlight" key={h.num}>
                  <div className="about-highlight-num">{h.num}</div>
                  <div className="about-highlight-label">{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
