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
    title: 'World Time',
    description: 'Easily check the time around the world, and schedule meetings with people in different time zones.',
    imageUrl: '/images/portfolio/worldtime.png',
    link: 'https://asean-time.vercel.app/',
    category: 'Web Development'
  },
  {
    id: 2,
    title: 'Payment processing',
    description: 'Money flow management for merchants and high level analytics for transactions.',
    imageUrl: '/images/portfolio/payment.png',
    link: 'https://payment-processing-sooty.vercel.app/',
    category: 'Web Development'
  },
    {
    id: 3,
    title: 'Loan Calculator',
    description: 'Loan(mortgage, auto, personal) calculator. Helps you understand the cost of borrowing money.',
    imageUrl: '/images/portfolio/loan.png',
    link: 'https://loan-calculator.dsapoetra.com/',
    category: 'Web Development'
  },
  {
    id: 4,
    title: 'Currency Converter',
    description: 'Currency converter. Helps you understand the exchange rate between currencies.',
    imageUrl: '/images/portfolio/currency.png',
    link: 'https://currency-converter.dsapoetra.com/',
    category: 'Web Development'
  },
  {
    id: 5,
    title: 'Some Converter',
    description: 'Various converter. Helps you understand the conversion between units.',
    imageUrl: '/images/portfolio/some-converter.png',
    link: 'https://currency-converter.dsapoetra.com/',
    category: 'Web Development'
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
