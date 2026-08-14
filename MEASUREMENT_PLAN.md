# Measurement plan

## Основні події
- `cta_click`: label, placement, section_id, segment
- `segment_select`: segment
- `bottleneck_node_view`: node, source
- `bottleneck_pair_view`: pair
- `readiness_start`
- `readiness_answer`: step, answer
- `readiness_complete`: result, answers_summary
- `case_filter`: filter
- `case_open`: case_id, source
- `diagnostic_preview_open`: artifact_id
- `team_role_view`: role, segment
- `faq_open`: faq_id, category
- `form_start`: form_id, source
- `form_step_view`: step, completion_state
- `form_field_error`: field, error_type, step
- `form_back`: step
- `form_submit`: qualification_band, segment, budget_band, crm_state
- `form_success`: lead_id_hash, qualification_band
- `form_failure`
- `contact_method_click`
- `footer_link_click`
- `consent_preferences_open`
- `consent_update`

## PII rule
Не передавати raw email, Telegram, ім’я, текст проблеми, повний URL із PII у GA4 / Meta.

## Additional events implemented in Wave 5
- `nav_click`
- `hero_cta_click`
- `hero_secondary_click`
- `trust_item_click`
- `credential_click`
- `bottleneck_cta_click`
- `readiness_cta_click`
- `segment_page_click`
- `case_metric_view`
- `case_cta_click`
- `case_share`
- `diagnostic_timeline_step`
- `diagnostic_scope_view`
- `diagnostic_cta_click`
- `founder_bio_open`
- `team_cta_click`
- `process_artifact_open`
- `process_cta_click`
- `method_case_open`
- `faq_deeplink_copy`
