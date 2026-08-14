# Server-side measurement / CAPI readiness

Not activated by default. Use only when volume, legal basis and consent design justify it.

Recommended sequence:
1. Browser form success returns a server-generated lead hash.
2. Server writes CRM lead.
3. With valid consent, server can emit deduplicated conversion events.
4. Use stable event_id/submission_id for browser/server deduplication.
5. Never forward raw email/Telegram/name to GA4.
6. Enhanced conversions / Meta CAPI require legal review and explicit production configuration.
