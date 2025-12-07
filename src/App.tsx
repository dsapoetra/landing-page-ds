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
            From intern to engineering manager—I'm a hands-on leader who still codes. Over 10+ years, I've built backend systems with Go and Node.js across fintech, travel, and edtech industries, while growing from individual contributor to managing high-performing teams. I solve technical challenges, mentor developers, and enjoy scaling both robust systems and the people who build them.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <div className="container">
          <h2 className="section-title">Skills & Expertise</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3 className="skill-category-title">Backend Development</h3>
              <ul className="skill-list">
                <li>Go (Golang)</li>
                <li>Node.js</li>
                <li>REST APIs</li>
                <li>Microservices</li>
                <li>Database Design</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3 className="skill-category-title">Leadership & Management</h3>
              <ul className="skill-list">
                <li>Team Leadership</li>
                <li>Mentoring</li>
                <li>Agile Methodologies</li>
                <li>Project Planning</li>
                <li>Technical Strategy</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3 className="skill-category-title">Technologies & Tools</h3>
              <ul className="skill-list">
                <li>PostgreSQL / MySQL</li>
                <li>Redis / MongoDB</li>
                <li>Docker / Kubernetes</li>
                <li>Git / CI/CD</li>
                <li>AWS / GCP</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3 className="skill-category-title">Industries</h3>
              <ul className="skill-list">
                <li>Fintech</li>
                <li>Travel & Hospitality</li>
                <li>Education Technology</li>
                <li>E-commerce</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Job History Section */}
      <section className="job-history">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="job-title">Engineering Manager</h3>
                <p className="company">Tech Company</p>
                <p className="job-period">2020 - Present</p>
                <p className="job-description">
                  Leading a team of engineers in building scalable backend systems. Managing project timelines, mentoring developers, and making technical decisions while maintaining hands-on involvement in critical development tasks.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="job-title">Senior Backend Engineer</h3>
                <p className="company">Fintech Startup</p>
                <p className="job-period">2017 - 2020</p>
                <p className="job-description">
                  Developed and maintained payment processing systems using Go and Node.js. Implemented microservices architecture and improved system performance by 40%.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="job-title">Backend Engineer</h3>
                <p className="company">Travel Platform</p>
                <p className="job-period">2014 - 2017</p>
                <p className="job-description">
                  Built and maintained booking and reservation systems. Worked with databases, APIs, and third-party integrations to deliver reliable travel services.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="job-title">Software Engineering Intern</h3>
                <p className="company">Tech Startup</p>
                <p className="job-period">2013 - 2014</p>
                <p className="job-description">
                  Started my career learning full-stack development, contributing to various projects, and building foundational skills in software engineering.
                </p>
              </div>
            </div>
          </div>
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
            <a href="mailto:angga.dimassaputra@gmail.com" className="contact-link">
              Email
            </a>
            <a href="https://www.linkedin.com/in/dimasangga/" className="contact-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/dsapoetra" className="contact-link" target="_blank" rel="noopener noreferrer">
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
