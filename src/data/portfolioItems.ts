// Portfolio item interface
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
}

// Portfolio data - Add your portfolio items here
export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'Modern web application with React and TypeScript',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/project-alpha',
    category: 'Web Development'
  },
  {
    id: 2,
    title: 'Mobile App Beta',
    description: 'Cross-platform mobile application',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/mobile-app-beta',
    category: 'Mobile Development'
  },
  {
    id: 3,
    title: 'Design System',
    description: 'Comprehensive UI/UX design system',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/design-system',
    category: 'Design'
  },
  {
    id: 4,
    title: 'Data Visualization',
    description: 'Interactive dashboard with D3.js',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/data-viz',
    category: 'Data Science'
  },
  {
    id: 5,
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/ecommerce',
    category: 'Full Stack'
  },
  {
    id: 6,
    title: 'AI Assistant',
    description: 'Machine learning powered chatbot',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format',
    link: 'https://github.com/your-username/ai-assistant',
    category: 'AI/ML'
  }
];

// Helper function to get all unique categories
export const getCategories = (): string[] => {
  return Array.from(new Set(portfolioItems.map(item => item.category)));
};

// Helper function to filter items by category
export const getItemsByCategory = (category: string): PortfolioItem[] => {
  return portfolioItems.filter(item => item.category === category);
};
