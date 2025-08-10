# Portfolio Data

This directory contains the portfolio data for your landing page. You can easily add, edit, or remove portfolio items without touching the main application code.

## Adding New Portfolio Items

To add a new portfolio item, simply add a new object to the `portfolioItems` array in `portfolioItems.ts`:

```typescript
{
  id: 7, // Use the next available ID number
  title: 'Your New Project',
  description: 'Brief description of your project',
  imageUrl: 'https://your-image-url.com/image.jpg',
  link: 'https://github.com/your-username/your-project',
  category: 'Your Category'
}
```

## Portfolio Item Properties

Each portfolio item should have the following properties:

- **id**: Unique number identifier (increment from the last used ID)
- **title**: Project name/title
- **description**: Brief description of the project (keep it concise, 1-2 lines)
- **imageUrl**: URL to the project image (recommended: 400x300px aspect ratio)
- **link**: URL where users can view/access the project
- **category**: Project category (e.g., "Web Development", "Mobile App", "Design", etc.)

## Image Guidelines

### Image Sources
- **Local Images**: Place images in `public/images/portfolio/` and reference as `/images/portfolio/your-image.jpg`
- **External URLs**: Use CDN services like Unsplash, Cloudinary, or your own hosting
- **Recommended Size**: 400x300px (4:3 aspect ratio) for consistent display

### Image Optimization
- Use WebP format when possible for better performance
- Compress images to keep file sizes under 200KB
- Ensure images look good in grayscale (they start as grayscale and show color on hover)

## Categories

The design automatically handles different categories. Common categories include:
- Web Development
- Mobile Development
- Design
- Data Science
- AI/ML
- Full Stack
- Backend
- Frontend
- DevOps
- UI/UX

## Example: Adding a Local Image

1. Place your image in `public/images/portfolio/my-project.jpg`
2. Add the portfolio item:

```typescript
{
  id: 7,
  title: 'My Awesome Project',
  description: 'A revolutionary web application built with modern technologies',
  imageUrl: '/images/portfolio/my-project.jpg',
  link: 'https://github.com/yourusername/awesome-project',
  category: 'Web Development'
}
```

## Responsive Design

The portfolio grid automatically adapts to different screen sizes:
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 2-3 columns
- **Large screens**: Maximum 3 columns for optimal readability

The design scales beautifully whether you have 3 items or 30 items!

## Tips

1. **Keep descriptions concise** - They appear on hover, so shorter is better
2. **Use consistent image sizes** - This ensures a clean, professional look
3. **Choose meaningful categories** - They help organize your work
4. **Test your links** - Make sure all project links work correctly
5. **Update IDs sequentially** - Always use the next available number

## File Structure

```
src/data/
├── portfolioItems.ts    # Main portfolio data file
└── README.md           # This documentation file
```

Happy portfolio building! 🚀
