-- Seed data for testing (optional)
-- Run this after schema.sql if you want some initial data

-- Note: You should create your admin user via the /admin interface or API
-- This is just sample data for content sections

-- Sample Hero Content
INSERT INTO hero_content (title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link)
VALUES (
  'Developer Who Leads',
  'Building applications, managing teams, documenting the journey',
  'View Portfolio',
  '#portfolio',
  'Get In Touch',
  '#contact'
) ON CONFLICT (id) DO NOTHING;

-- Sample About Content
INSERT INTO about_content (content)
VALUES (
  'From intern to engineering manager—I''m a hands-on leader who still codes. Over 10+ years, I''ve built backend systems with Go and Node.js across fintech, travel, and edtech industries, while growing from individual contributor to managing high-performing teams.'
) ON CONFLICT (id) DO NOTHING;

-- Sample Contact Info
INSERT INTO contact_info (email, linkedin, github)
VALUES (
  'your-email@example.com',
  'https://www.linkedin.com/in/yourprofile/',
  'https://github.com/yourusername'
) ON CONFLICT (id) DO NOTHING;

-- Sample Skills
INSERT INTO skills (category, items, order_index) VALUES
  ('Backend Development', ARRAY['Go (Golang)', 'Node.js', 'REST APIs', 'Microservices', 'Database Design'], 0),
  ('Leadership & Management', ARRAY['Team Leadership', 'Mentoring', 'Agile Methodologies', 'Project Planning', 'Technical Strategy'], 1),
  ('Technologies & Tools', ARRAY['PostgreSQL / MySQL', 'Redis / MongoDB', 'Docker / Kubernetes', 'Git / CI/CD', 'AWS / GCP'], 2),
  ('Industries', ARRAY['Fintech', 'Travel & Hospitality', 'Education Technology', 'E-commerce'], 3);

-- Sample Experiences
INSERT INTO experiences (job_title, company, period, description, order_index) VALUES
  ('Engineering Manager', 'Tech Company', '2020 - Present', 'Leading a team of engineers in building scalable backend systems. Managing project timelines, mentoring developers, and making technical decisions while maintaining hands-on involvement in critical development tasks.', 0),
  ('Senior Backend Engineer', 'Fintech Startup', '2017 - 2020', 'Developed and maintained payment processing systems using Go and Node.js. Implemented microservices architecture and improved system performance by 40%.', 1),
  ('Backend Engineer', 'Travel Platform', '2014 - 2017', 'Built and maintained booking and reservation systems. Worked with databases, APIs, and third-party integrations to deliver reliable travel services.', 2),
  ('Software Engineering Intern', 'Tech Startup', '2013 - 2014', 'Started my career learning full-stack development, contributing to various projects, and building foundational skills in software engineering.', 3);

-- Sample Portfolio Items
INSERT INTO portfolio_items (title, description, image_url, link, category, order_index, published) VALUES
  ('Merchant Portal', 'Comprehensive merchant management platform', '/images/portfolio/merchant-portal.png', 'https://your-project-url.com', 'Web Application', 0, true),
  ('Mobile App', 'Cross-platform mobile application', '/images/portfolio/mobile-app.png', 'https://your-project-url.com', 'Mobile', 1, true),
  ('API Gateway', 'Microservices API gateway implementation', '/images/portfolio/api-gateway.png', 'https://your-project-url.com', 'Backend', 2, true);

-- Sample Blog Settings (optional - update with your actual RSS feed)
-- Uncomment and modify if you want to set up blog from the start
-- INSERT INTO blog_settings (platform, rss_url, username, enabled) VALUES
--   ('medium', 'https://medium.com/feed/@yourusername', 'yourusername', true);
