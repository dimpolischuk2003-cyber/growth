# Form endpoint

This folder is an implementation sample, not an active endpoint.

Required environment variables:
- `CRM_WEBHOOK_URL`
- `TURNSTILE_SECRET` (if Turnstile is enabled)

Before deployment add:
- persistent idempotency storage (KV/DB);
- IP/session rate limiting;
- allowed-origin checks;
- CRM-specific field mapping;
- production logging without raw PII;
- server-side consent/legal requirements.

The GitHub Pages frontend should call a public serverless API URL via `assets/js/config.js`. CRM secrets must remain server-side.
