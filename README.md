# 99WRLDWIDE

Coming-soon site for 99WRLDWIDE, the clothing brand under 99 (with 99MGMT and 99ENT). Plain HTML/CSS/JS, no build step.

- `index.html` – content (English text)
- `main.js` – Danish translations and the language switch
- `styles.css` – black and white theme with jersey pinstripes
- `assets/` – 99 mark, favicons, social preview image

This repo is public (needed for free GitHub Pages), so keep pricing, costs and unreleased designs out of it.

## Publishing
Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.
One-time setup: repo Settings → Pages → Source: **GitHub Actions**.

## Custom domain (later)
1. Add a `CNAME` file containing the domain, e.g. `99wrldwide.com`.
2. At the DNS provider, add A records for the domain → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, and a CNAME `www` → `rodriguez594.github.io`.
3. In repo Settings → Pages, set the custom domain and tick "Enforce HTTPS".

When the Shopify store opens, give it its own address (e.g. `shop.99wrldwide.com`) and link to it from this page.
