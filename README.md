# Resize-san

Resize-san is a free, browser-based image resizing, conversion, and compression platform. 100% private - all processing happens locally in your browser.

[Live Demo](https://resize-san.netlify.app/)

## Features

- **Image Resizer** - Resize by width, height, or percentage with aspect ratio lock
- **Format Converter** - Convert between JPG, PNG, and WEBP formats
- **Image Compressor** - Compress images with quality control
- **Social Media Presets** - One-click presets for Instagram, Facebook, YouTube, Twitter, LinkedIn, and more
- **100% Private** - All processing happens in your browser

## Technology Stack

- HTML5
- CSS3 (Modern CSS with custom properties)
- Vanilla JavaScript
- Canvas API for image processing
- JSZip for batch downloads

No frameworks, no build tools, no backend required.

---

## Deployment

### Netlify (Current)

Your site is deployed at: https://resize-san.netlify.app/

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the static site
3. Deploy!

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

---

## SEO Setup

### Files Included

- `robots.txt` - Allows all crawlers, points to sitemap
- `sitemap.xml` - Lists all pages for search engines

### Meta Tags

The site includes:
- Unique title tags for each page
- Meta descriptions (unique per page)
- Canonical URLs
- Open Graph tags
- Twitter Card tags

### Structured Data (JSON-LD)

- Organization schema
- WebSite schema
- SoftwareApplication schema
- FAQPage schema (on FAQ page)

---

## Google Search Console Setup

### Option 1: HTML File (Recommended for Netlify)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://resize-san.netlify.app/`
3. Download the verification HTML file
4. Place it in your project root
5. Push to GitHub - Netlify will deploy it automatically

### Option 2: Meta Tag

1. In `index.html`, find this comment:
```html
<!-- Google Search Console Verification - REPLACE WITH YOUR VERIFICATION CODE -->
<!-- <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE"> -->
```

2. Uncomment and replace `YOUR_VERIFICATION_CODE_HERE` with your verification code from Google Search Console

### Submit Sitemap

1. After verification, go to Sitemaps in Google Search Console
2. Submit: `https://resize-san.netlify.app/sitemap.xml`
3. Click "Submit"

---

## Google AdSense Setup

### Requirements for Approval

- Quality content with original value
- Functional, user-friendly site
- Privacy policy page
- At least 100 organic visitors/month (before applying)
- 18+ years age for AdSense account

### Implementing Ads

1. Sign up for [Google AdSense](https://www.google.com/adsense/)
2. Get your publisher ID (ca-pub-XXXXXXXXX)
3. Create ad units in AdSense dashboard
4. In `index.html`, find the AdSense placeholder sections
5. Replace with your actual ad code:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Ad Placements (Already Reserved)

The following ad placements are reserved in the code:
- Header banner (728x90 or responsive)
- In-content (300x250 or responsive)
- FAQ section (300x250 or responsive)
- Footer (728x90 or responsive)

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires support for:
- Canvas API
- FileReader API
- Blob API

---

## Privacy

All image processing happens in the user's browser using the Canvas API. No images are ever uploaded to any server. This makes Resize-san:
- Completely private
- Fast (no upload/download latency)
- Secure (no data transmission)

---

## File Structure

```
resize-san/
├── index.html          # Main application
├── css/
│   └── styles.css    # All styles
├── js/
│   ├── app.js       # Main application logic
│   ├── resize.js    # Image resizer
│   ├── converter.js # Format converter
│   └── compressor.js # Image compressor
├── blog/
│   └── index.html   # Blog index
├── faq/
│   └── index.html   # FAQ page
├── robots.txt        # Crawler instructions
├── sitemap.xml      # XML sitemap
└── README.md       # This file
```

---

## License

MIT License - Feel free to use for personal or commercial projects.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Roadmap

Future tools planned:
- Image Crop Tool
- Background Remover
- QR Code Generator
- Meme Generator
- PDF to Image Converter
- SVG Converter