# CRM field map

| Frontend field | CRM type | Required | Notes |
|---|---|---:|---|
| submission_id | text/idempotency | yes | unique per attempt |
| company | text | yes | |
| website | url | yes | |
| niche | enum/text | yes | |
| markets | text | yes | |
| budget | enum | yes | lt10 / 10-20 / 20-50 / 50plus |
| stable_sales | enum | yes | yes / partial / no |
| channels | text | no | |
| crm_data | enum | yes | yes / partial / no |
| problem | long text | no | |
| name | text | yes | PII — never send to analytics |
| contact | text | yes | PII — never send to analytics |
| segment | enum | no | from selector |
| readiness_result | enum | no | strong_fit / potential_fit / early_stage |
| readiness_answers | json/text | no | CRM only |
| cases_viewed | text | no | source context |
| utm_* | text | no | source context |
| referrer | url/text | no | strip PII if needed |
| landing | url/text | no | |
| qualification_band | enum | derived | CRM/server derived is preferred |
