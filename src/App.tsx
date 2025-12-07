import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  category: string;
}

interface Skill {
  id: number;
  category: string;
  items: string[];
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
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

interface AboutContent {
  content: string;
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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Developer Who Leads',
    subtitle: 'Building applications, managing teams, documenting the journey',
    cta_primary_text: 'View Portfolio',
    cta_secondary_text: 'Get In Touch'
  });
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    content: 'From intern to engineering manager—I\'m a hands-on leader who still codes. Over 10+ years, I\'ve built backend systems with Go and Node.js across fintech, travel, and edtech industries.'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'angga.dimassaputra@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dimasangga/',
    github: 'https://github.com/dsapoetra'
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogEnabled, setBlogEnabled] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch portfolio
      const portfolioRes = await fetch(`${API_BASE}/portfolio`);
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData.data || []);
      }

      // Fetch skills
      const skillsRes = await fetch(`${API_BASE}/skills`);
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData.data || []);
      }

      // Fetch experiences
      const expRes = await fetch(`${API_BASE}/experiences`);
      if (expRes.ok) {
        const expData = await expRes.json();
        setExperiences(expData.data || []);
      }

      // Fetch hero content
      const heroRes = await fetch(`${API_BASE}/content?type=hero`);
      if (heroRes.ok) {
        const heroData = await heroRes.json();
        if (heroData.data) {
          setHeroContent(heroData.data);
        }
      }

      // Fetch about content
      const aboutRes = await fetch(`${API_BASE}/content?type=about`);
      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        if (aboutData.data) {
          setAboutContent(aboutData.data);
        }
      }

      // Fetch contact info
      const contactRes = await fetch(`${API_BASE}/content?type=contact`);
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        if (contactData.data) {
          setContactInfo(contactData.data);
        }
      }

      // Fetch blog posts
      const blogRes = await fetch(`${API_BASE}/blog`);
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        if (blogData.data && blogData.data.length > 0) {
          setBlogPosts(blogData.data.slice(0, 6));
          setBlogEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {heroContent.title}
          </h1>
          <p className="hero-subtitle">
            {heroContent.subtitle}
          </p>
          <div className="hero-cta">
            <button
              className="cta-button primary"
              onClick={() => scrollToSection('portfolio')}
            >
              {heroContent.cta_primary_text || 'View Portfolio'}
            </button>
            <button
              className="cta-button secondary"
              onClick={() => scrollToSection('contact')}
            >
              {heroContent.cta_secondary_text || 'Get In Touch'}
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
            {aboutContent.content}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="skills">
          <div className="container">
            <h2 className="section-title">Skills & Expertise</h2>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-category">
                  <h3 className="skill-category-title">{skill.category}</h3>
                  <ul className="skill-list">
                    {skill.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job History Section */}
      {experiences.length > 0 && (
        <section className="job-history">
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="job-title">{exp.job_title}</h3>
                    <p className="company">{exp.company}</p>
                    <p className="job-period">{exp.period}</p>
                    <p className="job-description">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {portfolio.length > 0 && (
        <section id="portfolio" className="portfolio">
          <div className="container">
            <h2 className="section-title">Portfolio</h2>
            <div className="portfolio-grid">
              {portfolio.map((item) => (
                <div key={item.id} className="portfolio-item">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    <div className="portfolio-image">
                      <img src={item.image_url} alt={item.title} />
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
      )}

      {/* Blog Section */}
      {blogEnabled && blogPosts.length > 0 && (
        <section className="blog">
          <div className="container">
            <h2 className="section-title">Latest Blog Posts</h2>
            <div className="blog-grid">
              {blogPosts.map((post, index) => (
                <article key={index} className="blog-card">
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-meta">
                    {post.author} • {new Date(post.pubDate).toLocaleDateString()}
                  </p>
                  <p className="blog-excerpt">{post.contentSnippet}</p>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-link"
                  >
                    Read more →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-text">
            Ready to bring your ideas to life? Let's discuss your next project.
          </p>
          <div className="contact-links">
            <a href={`mailto:${contactInfo.email}`} className="contact-link">
              Email
            </a>
            <a href={contactInfo.linkedin} className="contact-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={contactInfo.github} className="contact-link" target="_blank" rel="noopener noreferrer">
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
