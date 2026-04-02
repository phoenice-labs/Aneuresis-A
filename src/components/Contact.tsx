import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <span className="section-label">Get In Touch</span>
        <h2 className="section-title">Work With Us</h2>
        <p className="section-subtitle">
          Ready to navigate your regulatory challenges? Let's talk. Whether you need a strategic
          advisor, a technical writer, or a full submission partner — we're here.
        </p>

        <div className="contact-inner">
          {/* Left: Info & pitch */}
          <div className="contact-info">
            {[
              { icon: '📧', text: 'info@aneuresis-regulatory-sciences.com' },
              { icon: '📍', text: 'Clarksburg, MD — Available Nationwide' },
              { icon: '🔗', text: 'linkedin.com/company/aneuresis-regulatory-sciences' },
              { icon: '🕐', text: 'Response within 24 business hours' },
            ].map((item) => (
              <div className="contact-item" key={item.text}>
                <div className="contact-item-icon">{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}

            <div className="contact-pitch">
              <div className="contact-pitch-title">The Aneuresis Advantage</div>
              <p className="contact-pitch-text">
                Most regulatory consultants advise from the outside. We built this firm from
                the inside — shaped by direct experience at FDA, NIH, and American Red Cross.
                We understand how reviewers think, how submissions get flagged, and how to build
                regulatory programs that work the first time.
              </p>
              <p className="contact-pitch-text">
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Engagements start at a 2-hour strategy call.</strong>
                {' '}Project-based, hourly, and retainer options available.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div style={{
                background: 'rgba(13,148,136,0.2)',
                border: '1px solid rgba(13,148,136,0.5)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                color: 'white',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ color: 'white', marginBottom: 12 }}>Message Received!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Thank you for reaching out. Sampada will respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" type="text" placeholder="Jane" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" type="text" placeholder="Smith" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input className="form-input" type="text" placeholder="BioTech Inc." />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="jane@company.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Service of Interest</label>
                  <select className="form-select form-input">
                    <option value="">Select a service...</option>
                    <option>Regulatory Affairs Strategy & Submissions</option>
                    <option>REMS & Pharmaceutical Risk Management</option>
                    <option>Scientific & Regulatory Technical Writing</option>
                    <option>Medical Device Regulatory (510K / PMA)</option>
                    <option>Quality Management Systems (GMP / GLP)</option>
                    <option>Pre-clinical Data Analytics & Toxicology</option>
                    <option>Regulatory Intelligence & Landscape Analysis</option>
                    <option>AI-Assisted Regulatory Research</option>
                    <option>Multiple / General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tell us about your project</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Briefly describe your regulatory challenge or project scope..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
