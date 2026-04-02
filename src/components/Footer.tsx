export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{
              width: 32, height: 32, background: '#0d9488',
              borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
            }}>S</div>
            <span>Aneuresis Regulatory Sciences LLC</span>
          </div>

          <ul className="footer-links">
            {['About', 'Services', 'Simulations', 'Credentials', 'Contact'].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <p>© {year} Aneuresis Regulatory Sciences LLC · Clarksburg, MD · All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
