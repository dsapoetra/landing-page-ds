import './App.css'
import { portfolioItems } from './data/portfolioItems'

function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Developer Who Leads
          </h1>
          <p className="hero-subtitle">
            Building applications, managing teams, documenting the journey
          </p>
          <div className="hero-cta">
            <button className="cta-button primary">
              View Portfolio
            </button>
            <button className="cta-button secondary">
              Get In Touch
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shape">
            <img className='profile' src='/profile.jpeg' alt='Hero Image' />
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <p className="about-text">
            From intern to engineering manager—I'm a hands-on leader who still codes. Over 8+ years, I've built backend systems with Go and Node.js across fintech, travel, and edtech industries, while growing from individual contributor to managing high-performing teams. I solve technical challenges, mentor developers, and enjoy scaling both robust systems and the people who build them.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio">
        <div className="container">
          <h2 className="section-title">Portfolio</h2>
          <div className="portfolio-grid">
            {portfolioItems.map((item) => (
              <div key={item.id} className="portfolio-item">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <div className="portfolio-image">
                    <img src={item.imageUrl} alt={item.title} />
                    <div className="portfolio-overlay">
                      <div className="portfolio-overlay-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <span className="portfolio-category">{item.category}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <div className="container">
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-text">
            Ready to bring your ideas to life? Let's discuss your next project.
          </p>
          <div className="contact-links">
            <a href="mailto:your.email@example.com" className="contact-link">
              Email
            </a>
            <a href="https://linkedin.com/in/yourprofile" className="contact-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/yourusername" className="contact-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
