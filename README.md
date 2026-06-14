# Resize-san

Resize-san is a free, browser-based image resizing, conversion, and compression platform. 100% private - all processing happens locally in your browser.

[Live Demo](https://resize-san.github.io/)

## Features

- **Image Resizer** - Resize by width, height, or percentage with aspect ratio lock
- **Format Converter** - Convert between JPG, PNG, and WEBP formats
- **Image Compressor** - Compress images with quality control
- **Social Media Presets** - One-click presets for Instagram, Facebook, YouTube, Twitter, LinkedIn, and more

## Technology Stack

- HTML5
- CSS3 (Modern CSS with custom properties)
- Vanilla JavaScript
- Canvas API for image processing
- JSZip for batch downloads

No frameworks, no build tools, no backend required.

## Getting Started

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resize-san.git
cd resize-san
```

2. Open `index.html` in your browser

That's it! The application works entirely client-side.

## Deployment

### GitHub Pages

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Select the main branch as source
4. Save

Your site will be available at `https://yourusername.github.io/resize-san`

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Adding Google AdSense

1. Sign up for [Google AdSense](https://www.google.com/adsense/)
2. Replace placeholder ad slot IDs in `index.html`:
```html
<!-- Replace ca-pub-XXXXXXXXX with your publisher ID -->
<!-- Replace XXXXXXXXX with your ad slot ID -->
<ins class="adsbygoogle"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto">
</ins>
```

## SEO Recommendations

The project includes:
- Semantic HTML structure
- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card tags
- Structured Data (JSON-LD)
- robots.txt and sitemap.xml

To optimize further:
1. Update the canonical URL with your actual domain
2. Generate a custom sitemap with all pages
3. Submit sitemap to Google Search Console

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires support for:
- Canvas API
- FileReader API
- Blob API

## Privacy

All image processing happens in the user's browser using the Canvas API. No images are ever uploaded to any server. This makes Resize-san:
- Completely private
- Fast (no upload/download latency)
- Secure (no data transmission)

## File Structure

```
resize-san/
├── index.html          # Main application
├── css/
│   └── styles.css    # All styles
├── js/
│   ├── app.js      # Main application logic
│   ├── resize.js   # Image resizer
│   ├── converter.js # Format converter
│   └── compressor.js # Image compressor
├── blog/
│   └── index.html  # Blog index
├── faq/
│   └── index.html # FAQ page
├── robots.txt       # robots.txt
├── sitemap.xml    # XML sitemap
└── README.md     # This file
```

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

Future tools planned:
- Image Crop Tool
- Background Remover
- QR Code Generator
- Meme Generator
- PDF to Image Converter
- SVG Converter