# Performance report — static build

Implemented:
- no webfonts;
- hero is CSS/SVG, no heavy initial hero image;
- YouTube player loads only after click;
- CSS/JS split into modules;
- external marketing tags are not loaded by prototype;
- dimensions are reserved for main UI blocks;
- reduced-motion supported.

Production targets from TZ:
- LCP < 2.5 s p75 mobile
- INP < 200 ms
- CLS < 0.1
- Lighthouse mobile: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+

A real Lighthouse report requires production-like hosting and must be rerun after GTM/consent/CRM integrations.
