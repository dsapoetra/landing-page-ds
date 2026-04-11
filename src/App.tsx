import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import Lenis from 'lenis'

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  category: string;
}

interface Experience {
  id: number;
  job_title: string;
  company: string;
  period: string;
  description: string;
}

interface HeroContent {
  title: string;
  subtitle: string;
  description?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  contentSnippet: string;
}

function App() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Dimas Angga',
    subtitle: 'Engineering Manager & Builder',
    cta_primary_text: 'Get In Touch',
    cta_secondary_text: 'View My Work'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'angga.dimassaputra@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dimasangga/',
    github: 'https://github.com/dsapoetra'
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  const lenisRef = useRef<Lenis | null>(null);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [portfolio, experiences, blogPosts]);

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [portfolioRes, expRes, heroRes, contactRes, blogRes] = await Promise.allSettled([
        fetch(`${API_BASE}/portfolio`),
        fetch(`${API_BASE}/experiences`),
        fetch(`${API_BASE}/content?type=hero`),
        fetch(`${API_BASE}/content?type=contact`),
        fetch(`${API_BASE}/blog`),
      ]);

      if (portfolioRes.status === 'fulfilled' && portfolioRes.value.ok) {
        const data = await portfolioRes.value.json();
        setPortfolio(data.data || []);
      }

      if (expRes.status === 'fulfilled' && expRes.value.ok) {
        const data = await expRes.value.json();
        setExperiences(data.data || []);
      }

      if (heroRes.status === 'fulfilled' && heroRes.value.ok) {
        const data = await heroRes.value.json();
        if (data.data) setHeroContent(data.data);
      }

      if (contactRes.status === 'fulfilled' && contactRes.value.ok) {
        const data = await contactRes.value.json();
        if (data.data) setContactInfo(data.data);
      }

      if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
        const data = await blogRes.value.json();
        if (data.data && data.data.length > 0) {
          setBlogPosts(data.data.slice(0, 4));
          setBlogEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, { duration: 1.2 });
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">dsapoetra</span>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollToSection('what-i-do')}>
              What I Do
            </button>
            {experiences.length > 0 && (
              <button className="nav-link" onClick={() => scrollToSection('experience')}>
                Experience
              </button>
            )}
            {portfolio.length > 0 && (
              <button className="nav-link" onClick={() => scrollToSection('portfolio')}>
                Work
              </button>
            )}
            <button className="nav-link" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-greeting">Hi, I'm</p>
            <h1 className="hero-name">{heroContent.title || 'Dimas Angga'}</h1>
            <p className="hero-title">
              {heroContent.subtitle || 'Engineering Manager & Builder'}
            </p>
            <p className="hero-description">
              {heroContent.description || 'I lead engineering teams and still ship code. 10+ years across fintech, ecommerce, and edtech — currently Engineering Manager at OLX Indonesia, available for fractional web work.'}
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => scrollToSection('contact')}
              >
                {heroContent.cta_primary_text || 'Get In Touch'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => scrollToSection('portfolio')}
              >
                {heroContent.cta_secondary_text || 'View My Work'} ↓
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="/profile.jpeg"
              alt="Dimas Angga Saputra"
              loading="eager"
            />
          </div>
        </div>
      </header>

      {/* What I Do */}
      <section id="what-i-do" className="section section-alt">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Capabilities</span>
            <h2 className="section-title">What I Do</h2>
          </div>
          <div className="what-i-do-grid reveal-stagger">
            <div className="what-i-do-column reveal">
              <h3>I Lead</h3>
              <div className="capability-item">Engineering team management & growth</div>
              <div className="capability-item">Technical strategy & architecture decisions</div>
              <div className="capability-item">Cross-team collaboration & alignment</div>
              <div className="capability-item">Hiring, mentoring & performance development</div>
              <div className="capability-item">Delivery planning & execution</div>
            </div>
            <div className="what-i-do-column reveal">
              <h3>I Build</h3>
              <div className="capability-item">Backend systems in Go & Java</div>
              <div className="capability-item">Full-stack applications with Next.js</div>
              <div className="capability-item">Database design & query optimization</div>
              <div className="capability-item">API architecture & service integrations</div>
              <div className="capability-item">CI/CD pipelines & cloud infrastructure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section id="experience" className="section">
          <div className="container">
            <div className="reveal">
              <span className="section-label">Career</span>
              <h2 className="section-title">Experience</h2>
            </div>
            <div className="timeline reveal-stagger">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item reveal">
                  <div className="timeline-dot"></div>
                  <div className="timeline-header">
                    <span className="timeline-role">{exp.job_title}</span>
                    <span className="timeline-company">at {exp.company}</span>
                  </div>
                  <div className="timeline-period">{exp.period}</div>
                  <div className="timeline-description">
                    {exp.description.split('\n').map((line, idx) => {
                      if (line.trim().startsWith('-')) {
                        return <div key={idx}>{line}</div>;
                      }
                      return line.trim() ? <p key={idx}>{line}</p> : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <section id="portfolio" className="section section-alt">
          <div className="container">
            <div className="reveal">
              <span className="section-label">Projects</span>
              <h2 className="section-title">Selected Work</h2>
            </div>
            <div className="portfolio-grid reveal-stagger">
              {portfolio.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-card reveal"
                >
                  <div className="portfolio-card-image">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="portfolio-card-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="portfolio-tag">{item.category}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {blogEnabled && blogPosts.length > 0 && (
        <section id="blog" className="section">
          <div className="container">
            <div className="reveal">
              <span className="section-label">Writing</span>
              <h2 className="section-title">Recent Posts</h2>
            </div>
            <div className="blog-list reveal">
              {blogPosts.map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-item"
                >
                  <div className="blog-item-content">
                    <div className="blog-item-title">{post.title}</div>
                    <div className="blog-item-excerpt">{post.contentSnippet}</div>
                  </div>
                  <div className="blog-item-date">
                    {new Date(post.pubDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="section section-alt contact">
        <div className="container">
          <div className="reveal">
            <h2 className="contact-heading">Let's work together.</h2>
            <p className="contact-text">
              Whether you need an engineering leader or a builder who ships — I'd like to hear from you.
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="contact-email"
            >
              {contactInfo.email}
            </a>
          </div>
          <div className="contact-social reveal">
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Dimas Angga Saputra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App
