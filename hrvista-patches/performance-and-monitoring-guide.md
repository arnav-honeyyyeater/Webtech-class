# HR Vista 2.0: Optimization, Anti-Scraping & Monitoring Guide

## 1. Replacing Plaintext Inboxes with `ProtectedContact.tsx`

Copy `ProtectedContact.tsx` into your Next.js project under `components/ProtectedContact.tsx`.

In `app/contact/page.tsx` (and in your footer component):

```tsx
import { ProtectedEmail, ProtectedPhone } from '@/components/ProtectedContact';

// In Prof. Shankar Iyer's card:
<div class="mb-4">
  <h3 className="text-lg font-semibold text-[#F5F0EA]">Prof. Shankar Iyer</h3>
  <p className="text-sm text-[#D9CBC2]">Head - CPCG</p>
</div>
<div className="space-y-3">
  <ProtectedEmail 
    user="shankaran.iyer" 
    domain="christuniversity.in" 
    className="text-sm text-[#D9CBC2]" 
  />
  <ProtectedPhone 
    countryCode="+91" 
    number="8291200603" 
    className="text-sm text-[#D9CBC2]" 
  />
</div>
```

**Why this works:**
* Legitimate attendees see the complete email immediately upon page load and can click it to trigger `mailto:`.
* Automated web scrapers and crawlers inspecting the HTML see no email address, stopping automated harvester lists completely.

---

## 2. Fixing the Website Lag ("Kag")

### A. Remove `priority` on Speaker & Panelist Cards (Eliminates 48 Preloads)
In your speaker, guest, and panelist card mapping components:

❌ **Before (causes 48 concurrent image downloads in `<head>`):**
```tsx
<Image
  src={speaker.image}
  alt={speaker.name}
  width={400}
  height={400}
  priority // <-- REMOVE THIS LINE
/>
```

✅ **After (loads images as user scrolls, instant initial page load):**
```tsx
<Image
  src={speaker.image}
  alt={speaker.name}
  width={128}
  height={128}
  loading="lazy"
  sizes="128px"
  className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
/>
```
*(Only keep `priority` on the single main hero logo at the very top of the page).*

---

### B. Compress the 1.3 MB Background Image
The background image `public/Untitled design-6.png` is currently **1.31 MB**.
1. Convert it to WebP using [squoosh.app](https://squoosh.app) or tinypng.com to bring it down to ~70 KB.
2. In CSS, avoid `background-attachment: fixed` on mobile screens as it forces costly GPU repaints on every touch scroll.
```css
/* In globals.css */
.hero-bg {
  background-attachment: scroll;
}
@media (min-width: 768px) {
  .hero-bg {
    background-attachment: fixed;
  }
}
```

---

## 3. Prevent Internal Data Mining & Leakage

Replace your root `next.config.mjs` (or `.js`) with the provided `next.config.mjs`:
* **Blocks Clickjacking**: `X-Frame-Options: DENY` prevents malicious sites from embedding `hrvista.live` in hidden iframes.
* **Blocks Unauthorized Scripts/Miners**: `Content-Security-Policy` guarantees that no unapproved third-party scripts, crypto-miners, or tracking beacons can execute in visitors' browsers.
* **Blocks Privacy Leakage**: `interest-cohort=()` in `Permissions-Policy` prevents browser FLoC profiling.

---

## 4. Setting Up Live Domain Behavior & Health Monitoring

### A. Free 60-Second Uptime & Latency Monitoring (Better Stack)
1. Go to **[betterstack.com/uptime](https://betterstack.com/uptime)** (free tier).
2. Click **Create Monitor**:
   * **URL to monitor**: `https://www.hrvista.live/`
   * **Check interval**: 3 minutes (or 30s on free trials)
   * **Alerting**: Enter your email, SMS, or Telegram.
3. This will monitor:
   * Real response times (latency graph).
   * SSL/TLS certificate validity & expiration countdown.
   * Downtime alerts if Vercel or DNS has any outages.

### B. Vercel Speed Insights (Zero-Data-Mining Performance RUM)
In your Next.js project root, install:
```bash
npm install @vercel/speed-insights
```
In `app/layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```
* Collects anonymous Core Web Vitals (INP, LCP, CLS) to ensure your page remains fast and smooth on all real user devices without tracking any personal visitor information.
