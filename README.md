# Portfolio Landing Page

A modern, responsive React-based landing page with a monochromatic design and portfolio showcase. Built with React, TypeScript, and Vite.

## Features

- 🎨 **Monochromatic Design**: Clean grayscale color scheme for professional appearance
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🖼️ **Portfolio Gallery**: Interactive photo grid with hover effects and external links
- ⚡ **Fast Performance**: Built with Vite for optimal loading speeds
- ♿ **Accessible**: Includes proper focus states and reduced motion support
- 🎯 **SEO Ready**: Semantic HTML structure for better search engine visibility

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd landing-page-ds
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Portfolio Items

Portfolio data is now separated from the main code for easy management. To add new portfolio items:

1. **Edit the portfolio data file**: `src/data/portfolioItems.ts`
2. **Add your project images**: Place images in `public/images/portfolio/`
3. **Follow the structure**:

```typescript
{
  id: 7, // Use next available ID
  title: 'Your Project Title',
  description: 'Brief description of your project',
  imageUrl: '/images/portfolio/your-image.jpg', // Local image
  // OR imageUrl: 'https://external-url.com/image.jpg', // External image
  link: 'https://github.com/your-username/your-project',
  category: 'Web Development'
}
```

📖 **Detailed guide**: See `src/data/README.md` for complete instructions

### Personal Information

Update the following sections in `src/App.tsx`:

1. **Hero Section**: Change the title and subtitle
2. **About Section**: Update the about text
3. **Contact Section**: Update email and social media links
4. **Footer**: Update copyright information

### Color Scheme

The monochromatic color scheme can be customized in `src/App.css` by modifying the CSS custom properties:

```css
:root {
  --color-primary: #1a1a1a;    /* Main dark color */
  --color-secondary: #2d2d2d;  /* Secondary dark */
  --color-tertiary: #404040;   /* Medium gray */
  --color-quaternary: #666666; /* Light gray */
  --color-light: #f5f5f5;      /* Very light gray */
  --color-white: #ffffff;      /* White */
}
```

### Images

Replace the placeholder images with your own:
- Use high-quality images (recommended: 400x300px or similar aspect ratio)
- Optimize images for web (WebP format recommended)
- Consider using a CDN for better performance

## Build and Deploy

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy

You can deploy this site to various platforms:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **Firebase Hosting**: Use Firebase CLI

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.css        # Global styles
├── main.tsx         # Application entry point
└── assets/          # Static assets
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties and Grid/Flexbox
- **Google Fonts** - Inter font family

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
