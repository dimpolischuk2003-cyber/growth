# Status against TZ v1.0

## Implemented in frontend
- P0: sticky navigation, hero, early trust, contextual cases, diagnostic, 3 stages, founder/team layer, FAQ, 3-step form, footer/legal.
- P1: bottleneck map, segment selector, readiness assessment, operating-model comparison, interactive role map, decision cycle.
- P2 architecture: 4 niche pages, separate English localization, EU proof via Italy case.
- Separate case URLs, canonical/meta/OG, sitemap, robots, favicon/social preview.
- Modular tokens/layout/components/interactions/analytics structure.
- Progressive enhancement, reduced motion, keyboard/focus/form accessibility.
- Consent manager UI; marketing analytics remain off until consent.
- Structured case data.
- Extended dataLayer events from the TZ.
- Serverless form endpoint example with validation, Turnstile hook, idempotency key and no client secrets.
- CRM field map, dashboard spec, baseline/post-launch templates.
- Experiment plan prepared but intentionally NOT activated before baseline.

## Blocked by real inputs / access
- Live CRM integration and server deployment.
- Persistent idempotency store + real rate limiting.
- Turnstile site/secret keys.
- GTM, GA4, Google Ads, Meta Pixel/CAPI IDs and legal consent wiring.
- Real testimonials with permission.
- Confirmed team profiles/photos.
- Client logo permissions.
- Real anonymized diagnostic deliverable fragment.
- Final founder video + captions.
- Legal entity details and lawyer-approved privacy/cookie copy.
- Agreed response SLA after form submit.
- Production Lighthouse / Core Web Vitals after real tags are connected.
- Manual Safari/iOS/Firefox/Edge and screen-reader QA.

## Deliberately not activated
- CMS: TZ says only after confirmed editorial need.
- A/B tests: TZ says only after enough traffic/baseline.
- Advanced attribution / CAPI: only after volume, consent and legal basis justify it.
- Automatic visitor personalization: out of first-release scope.
