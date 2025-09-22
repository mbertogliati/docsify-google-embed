# Docsify Google Embed Plugin

Embed Google Docs, Sheets, and Slides in your Docsify site using a simple fenced block with optional metadata.

- Supports `docs`, `sheets`, and `slides`
- Auto-detects type and ID from common Google URLs
- Optional title/description (hidden by default), with toggles to show
- Adjustable iframe height

> Even if hidden, title and description are still added as `data-` attributes on the wrapper for automated tools.

## Installation

### Option 1: CDN (recommended)

Add the plugin JS and CSS after Docsify on your page. You can use unpkg or jsDelivr:

```html
<!-- Docsify -->
<script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- Plugin CSS -->
<link rel="stylesheet" href="https://unpkg.com/@mbertogliati/docsify-google-embed/dist/google-embed.css"/>
<!-- or: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mbertogliati/docsify-google-embed/dist/google-embed.css"/> -->

<!-- Plugin JS -->
<script src="https://unpkg.com/@mbertogliati/docsify-google-embed/dist/google-embed.js"></script>
<!-- or: <script src="https://cdn.jsdelivr.net/npm/@mbertogliati/docsify-google-embed/dist/google-embed.js"></script> -->
```

### Option 2: NPM

```bash
npm i @mbertogliati/docsify-google-embed
```

Then include the files from `node_modules/@mbertogliati/docsify-google-embed/dist/` in your Docsify HTML template:

```html
<link rel="stylesheet" href="/node_modules/@mbertogliati/docsify-google-embed/dist/google-embed.css"/>
<script src="/node_modules/@mbertogliati/docsify-google-embed/dist/google-embed.js"></script>
```

## Usage

In your markdown, add a fenced block with the language `gembed` (also accepts `google-embed`):

```gembed
{
  "url": "https://docs.google.com/document/d/1y1HWBSPeNxqzETDntClR_aadtCB-T517tH2hYj11k3E/preview",
  "type": "docs",
  "title": "Product Requirements Document",
  "description": "High-level PRD covering scope, goals, and milestones.",
  "showTitle": false,
  "showDescription": false,
  "height": 600
}
```

Supported keys:

- `url` (required): public/published Google URL
- `type` (optional): `docs` | `sheets` | `slides` (auto-inferred from URL if omitted)
- `title` (optional): metadata title
- `description` (optional): metadata description
- `showTitle` (optional, default false): set to `true` to display title
- `showDescription` (optional, default false): set to `true` to display description
- `height` (optional): iframe height in pixels (default 480)

> Note: For best results, use published/preview/embed links. Private links will not render for viewers without access.

### Google Doc Example

```gembed
{
  "url": "https://docs.google.com/document/d/1y1HWBSPeNxqzETDntClR_aadtCB-T517tH2hYj11k3E/embed",
  "type": "docs",
  "title": "Product Requirements Document",
  "description": "High-level PRD covering scope, goals, and milestones.",
  "showTitle": false,
  "showDescription": false,
  "height": 600
}
```

### Google Sheet Example

```gembed
{
  "url": "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/embed",
  "type": "sheets",
  "title": "Quarterly Metrics",
  "description": "Dashboard with KPIs and trend analysis.",
  "showTitle": true,
  "showDescription": true,
  "height": 500
}
```

### Google Slides Example

```gembed
{
  "url": "https://docs.google.com/presentation/d/1WrNnvt0GKyU4hORau10Ya_4aBNIwnHbX7vnyOYMLcRU/embed",
  "type": "slides",
  "title": "Roadmap Overview",
  "description": "Slide deck summarizing upcoming releases.",
  "showTitle": true,
  "showDescription": false,
  "height": 420
}
```

## How it works

The plugin registers a Docsify hook in `beforeEach` that searches the markdown for fenced blocks that match:

```
```gembed
{ ...json... }
```
```

It parses the JSON and emits an HTML wrapper with an iframe pointing to an embed/preview URL. For `Docs`, `Sheets`, and `Slides`, the plugin will try to infer the type and the document ID from the `url` and convert it to an appropriate embed URL. If inference fails, it will fall back to the original URL.

## Styling

Basic styles are provided by `dist/google-embed.css`. You can override CSS variables:

- `--theme-border`
- `--theme-bg`
- `--theme-text`
- `--theme-muted`

## Development

- Source files: `src/`
- Distribution files: `dist/`
- Build: `npm run build`

## License

MIT
