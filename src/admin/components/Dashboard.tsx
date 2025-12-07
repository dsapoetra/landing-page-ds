import { useState } from 'react';
import PortfolioManager from './PortfolioManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import ContentManager from './ContentManager';
import BlogSettings from './BlogSettings';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type Section = 'portfolio' | 'skills' | 'experience' | 'content' | 'blog';

function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('portfolio');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>CMS Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <nav className="dashboard-sidebar">
          <ul>
            <li className={activeSection === 'portfolio' ? 'active' : ''}>
              <button onClick={() => setActiveSection('portfolio')}>Portfolio</button>
            </li>
            <li className={activeSection === 'skills' ? 'active' : ''}>
              <button onClick={() => setActiveSection('skills')}>Skills</button>
            </li>
            <li className={activeSection === 'experience' ? 'active' : ''}>
              <button onClick={() => setActiveSection('experience')}>Experience</button>
            </li>
            <li className={activeSection === 'content' ? 'active' : ''}>
              <button onClick={() => setActiveSection('content')}>Content</button>
            </li>
            <li className={activeSection === 'blog' ? 'active' : ''}>
              <button onClick={() => setActiveSection('blog')}>Blog Settings</button>
            </li>
          </ul>
        </nav>

        <main className="dashboard-main">
          {activeSection === 'portfolio' && <PortfolioManager />}
          {activeSection === 'skills' && <SkillsManager />}
          {activeSection === 'experience' && <ExperienceManager />}
          {activeSection === 'content' && <ContentManager />}
          {activeSection === 'blog' && <BlogSettings />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
