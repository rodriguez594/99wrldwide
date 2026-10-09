# 99WRLDWIDE Shopify theme

This branch holds the custom Shopify theme for 99WRLDWIDE (Online Store 2.0). The theme files sit at the branch root so Shopify's GitHub integration can sync them.

**Do not merge this branch into `main`.** `main` is the GitHub Pages coming-soon site; this branch removes those files.

This repo is public, so keep pricing, costs, margins and unreleased designs out of it.

## What's in it
- `layout/` – `theme.liquid` (every page) and `password.liquid` (pre-launch page)
- `templates/` – home, product, collection, collections list, cart, search, 404, page, contact page, blog, article, password, gift card
- `sections/` – header, footer, hero, featured product, featured collection, email sign-up, rich text, plus the `main-*` section for each template
- `snippets/` – product card, price, icons, EN/DA language switch, pagination, newsletter form, NINETY 99 placeholder
- `assets/` – `base.css`, `theme.js`, the 99 mark and icons, and the self-hosted fonts (Bodoni Moda, Inter). The fonts are served from Shopify, not Google Fonts, so visitor IPs aren't sent to Google (GDPR).
- `locales/` – English (`en.default.json`) and Danish (`da.json`) storefront text

The design matches 99management.dk: black and white, Bodoni Moda headings, Inter body text, jersey pinstripes.

## Connect it to Shopify
1. Shopify admin → Online Store → Themes → Add theme → **Connect from GitHub**.
2. Pick `rodriguez594/99wrldwide` and this branch.
3. Preview, customize, then Publish when ready.

Edits made in the theme editor are committed back to this branch by Shopify (mostly `config/settings_data.json` and `templates/*.json`), so pull before editing code.

## Set up in the Shopify admin
- **Menus** (Online Store → Navigation): `main-menu` for the header (e.g. Shop → /collections/all), `footer` for the footer (shipping, returns, privacy, terms, contact).
- **Pages:** a "Size guide" page (pick it in the product page's Size guide block), "Shipping and returns" (14-day right of withdrawal), and a "Contact" page using the `page.contact` template.
- **Policies:** Settings → Policies (refund, privacy, terms, shipping).
- **Danish:** Settings → Languages → add Danish and publish it. The theme's UI text is already translated. Translate your own content (product text, section headings) with the free Translate & Adapt app. The DA/EN button then appears in the header.
- **Taxes:** Settings → Taxes → "Include tax in prices", so prices show with 25% VAT and the theme says "Incl. VAT."
- **Pre-launch:** Online Store → Preferences → Password protection. Visitors see the password page with the email sign-up. Sign-ups are saved as customers tagged `newsletter`.
- **Home page:** in the theme editor, pick "The 99 Jersey" in the Featured product section and a collection in Featured collection. Until then they show the NINETY 99 placeholder.

## Check the code
```
npm i -g @shopify/cli
shopify theme check --path .
shopify theme dev --store <store>.myshopify.com   # local preview against a real store
```
