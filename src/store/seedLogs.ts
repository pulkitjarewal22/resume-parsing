// ============================================================
// Seed Log Payloads
// Real-world payloads from logs-ref/ for demonstration
// ============================================================

export const SEED_PAYLOADS: unknown[] = [
  // Boolean query results
  { timestamp: '2026-06-24T18:39:24.179302', direction: 'BOOLEAN_QUERY_RESULT', identifier: 'voice_text', data: { status: 'success', data: ['(business analyst)'] } },
  { timestamp: '2026-06-24T18:39:25.921570', direction: 'VOICE_LLM_RAW_CONTENT', identifier: 'voice_text', data: '[{"field":"currentJobTitle","condition":"contains","value":"business analyst"}]' },
  { timestamp: '2026-06-24T18:55:54.887364', direction: 'BOOLEAN_QUERY_LLM_OUTPUT', identifier: 'boolean_query', data: '("business analyst")' },

  // Error logs — resume parsing
  { timestamp: '2026-06-19T13:42:38.881955', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_bulk_general', data: { error: "cannot access local variable 're' where it is not associated with a value" } },
  { timestamp: '2026-06-22T16:09:30.916947', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_gemini', data: { error: 'additional_properties parameter is not supported in Gemini API.', attempt: 1 } },
  { timestamp: '2026-06-22T16:09:32.844331', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_gpt', data: { error: "Error code: 400 - Invalid schema for response_format 'resume_parser'", } },
  { timestamp: '2026-06-22T18:00:42.635936', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_bulk_general', data: { error: 'The AI service is temporarily unavailable. Please try again in a moment.' } },
  { timestamp: '2026-06-23T14:28:23.144153', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_gemini', data: { error: "503 UNAVAILABLE. {'error': {'code': 503, 'message': 'This model is currently experiencing high demand.', 'status': 'UNAVAILABLE'}}", attempt: 1 } },
  { timestamp: '2026-06-24T14:32:55.977518', direction: 'JD_PARSING_ERROR', identifier: 'jd_parsing_gemini', data: { error: "429 RESOURCE_EXHAUSTED. {'error': {'code': 429, 'message': 'Your prepayment credits are depleted.', 'status': 'RESOURCE_EXHAUSTED'}}", attempt: 1 } },
  { timestamp: '2026-06-24T14:47:32.986134', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_gpt', data: { error: "Error code: 400 - max_tokens is too large: 35000. This model supports at most 16384 completion tokens." } },
  { timestamp: '2026-06-24T15:13:14.838673', direction: 'RESUME_PARSING_ERROR', identifier: 'resume_parsing_gemini', data: { error: "503 UNAVAILABLE. This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.", attempt: 1 } },

  // Matching errors
  { timestamp: '2026-06-19T15:26:11.854380', direction: 'MATCH_JD_TO_CANDIDATE_ERROR', identifier: '8712d560-d910-4c96-b0d7-009ef41644a6', data: { error: '<MilvusException: (code=2, message=Fail connecting to server on ai-testing.pharynxai.in:19530, illegal connection params or server unavailable)>', request: { type: 'jd-to-candidate', limits: 10 } } },
  { timestamp: '2026-06-19T15:26:32.093232', direction: 'MATCH_JD_TO_JD_ERROR', identifier: 'a65d4679-05df-445e-9b98-ff86d3254cd9', data: { error: '<MilvusException: (code=2, message=Fail connecting to server on ai-testing.pharynxai.in:19530, illegal connection params or server unavailable)>', request: { type: 'jd-to-jd' } } },

  // Bulk parsing success
  { timestamp: '2026-06-25T17:58:09.856544', direction: 'RESUME_BULK_RESPONSE', identifier: 'bulk_response', data: { 'First Name': 'Ayush', 'Last Name': 'Agarwal', 'Current Job Title': 'IT Analyst (IAM)', 'Current Company': 'TCS', 'Total Experience': '6.5', Bucket: 'IT Operations, Customer & Technical Support' } },
  { timestamp: '2026-06-25T17:58:09.857250', direction: 'RESUME_BULK_OUTPUT', identifier: 'bulk_parsed_output', data: { 'First Name': 'Ayush', 'Last Name': 'Agarwal', 'Email': 'ayushagarwal8956@gmail.com', 'Total Experience': '6.5' } },

  // OCR payloads
  { timestamp: '2026-06-25T13:21:54.915915', direction: 'OCR_PAYLOAD_TO_LLM', identifier: 'RajKumarM_Power Platform_20260625132127497285.pdf', data: 'OCR request payload sent — 3 pages extracted for resume parsing. Content: Power BI Data Analyst profile with 5 years experience.' },

  // RunPod webhooks
  { timestamp: '2026-06-26T12:21:29.243000', direction: 'RUNPOD_WEBHOOK', identifier: 'runpod_webhook', data: 'Resolved future for job_id=a5721b6a-2c9a-4db0-bab5-ccb353e749cc-e1 | status=COMPLETED' },
  { timestamp: '2026-06-26T15:29:25.370000', direction: 'RUNPOD_WEBHOOK', identifier: 'runpod_webhook', data: 'Submitted | job_id=4835edc0-934f-4b67-bb77-10fc3aa8c468-e2 | embedding_id=429367b6-10d7-48e5-97d5-f6512ba4dfc5 | webhook=https://tt-parsing.pharynxai.in/runpod/webhook' },
  { timestamp: '2026-06-26T15:29:47.556000', direction: 'RUNPOD_TRIGGER', identifier: 'runpod_trigger', data: "cancel_jobs_for_entity called | entity_id='3dc54704-578a-4a3d-aac8-ce4ffc0988e2' | active_jobs=15 | webhook_pending=15 | entity_webhook_jobs=0" },
  { timestamp: '2026-06-26T15:30:03.620000', direction: 'RUNPOD_WEBHOOK', identifier: 'runpod_webhook', data: 'Resolved future for job_id=b79c5b71-3e85-4bc3-a67c-21d5db1d74f1-e1 | status=COMPLETED' },
  { timestamp: '2026-06-26T15:30:04.350000', direction: 'PROGRESS', identifier: 'embedding_progress', data: 'Target Embedding ID: 429367b6-10d7-48e5-97d5-f6512ba4dfc5 | Requests Received: 5 | Requests Done: 1' },
];
