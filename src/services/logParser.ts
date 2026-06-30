// ============================================================
// Log Parser Service
// Parses and classifies raw payloads into structured LogEntry
// Derived from real payload examples in logs-ref/
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type { LogEntry, LogSeverity, LogCategory, RawLogPayload } from '../types/logs';

// ─── Direction → Category map ────────────────────────────────
const DIRECTION_CATEGORY_MAP: Record<string, LogCategory> = {
  RESUME_PARSING_ERROR: 'resume_parsing',
  RESUME_PARSING_RESULT: 'resume_parsing',
  RESUME_PARSING_START: 'resume_parsing',
  RESUME_BULK_RESPONSE: 'resume_parsing',
  RESUME_BULK_OUTPUT: 'resume_parsing',
  OCR_PAYLOAD_TO_LLM: 'ocr',
  OCR_RESULT: 'ocr',
  OCR_START: 'ocr',
  JD_PARSING_ERROR: 'jd_parsing',
  JD_PARSING_RESULT: 'jd_parsing',
  JD_PARSING_START: 'jd_parsing',
  MATCH_JD_TO_CANDIDATE_ERROR: 'matching',
  MATCH_CANDIDATE_TO_JD_ERROR: 'matching',
  MATCH_JD_TO_JD_ERROR: 'matching',
  MATCH_CD_TO_CD_ERROR: 'matching',
  MATCH_RESULT: 'matching',
  MATCH_START: 'matching',
  BOOLEAN_QUERY_RESULT: 'boolean_query',
  BOOLEAN_QUERY_LLM_OUTPUT: 'boolean_query',
  BOOLEAN_QUERY_ERROR: 'boolean_query',
  VOICE_LLM_RAW_CONTENT: 'voice',
  VOICE_QUERY_RESULT: 'voice',
  RUNPOD_WEBHOOK: 'runpod',
  RUNPOD_TRIGGER: 'runpod',
  RUNPOD_CANCEL_ENTITY: 'runpod',
  RUNPOD_CANCEL_SOURCE: 'runpod',
  EMBEDDING_PROGRESS: 'embedding',
  PROGRESS: 'embedding',
  AI_SEARCH_RESULT: 'ai_search',
  AI_SEARCH_ERROR: 'ai_search',
};

// ─── Direction → Severity rules ──────────────────────────────
function deriveSeverity(direction: string, data: unknown): LogSeverity {
  const d = direction.toUpperCase();

  // Explicit error directions
  if (d.includes('_ERROR') || d.includes('ERROR_')) return 'error';

  // Check data object for error signals
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const dataObj = data as Record<string, unknown>;
    if (dataObj.error) return 'error';
    if (dataObj.status === 'FAILED' || dataObj.status === 'failed') return 'error';
    if (dataObj.status === 'CANCELLED' || dataObj.status === 'cancelled') return 'warning';
    if (dataObj.status === 'success' || dataObj.status === 'COMPLETED') return 'success';
  }

  // Detect 5xx / 4xx in string data
  if (typeof data === 'string') {
    if (/503|502|500|429|401|403/.test(data)) return 'error';
    if (/warning|warn|timeout/i.test(data)) return 'warning';
    if (/cancel/i.test(data)) return 'warning';
  }

  // Direction-based hints
  if (d.includes('_RESULT') || d.includes('_OUTPUT') || d === 'PROGRESS') return 'success';
  if (d.includes('CANCEL')) return 'warning';
  if (d.includes('START') || d.includes('TRIGGER') || d.includes('PAYLOAD') || d.includes('SUBMITTED')) return 'info';

  return 'info';
}

// ─── Derive category ─────────────────────────────────────────
function deriveCategory(direction: string, identifier: string): LogCategory {
  // Direct match
  const upper = direction.toUpperCase().replace(/[^A-Z_]/g, '_');
  for (const [key, cat] of Object.entries(DIRECTION_CATEGORY_MAP)) {
    if (upper === key) return cat;
  }

  // Partial match
  const dirLower = direction.toLowerCase();
  if (dirLower.includes('resume_parsing') || identifier.includes('resume_parsing')) return 'resume_parsing';
  if (dirLower.includes('jd_parsing') || identifier.includes('jd_parsing')) return 'jd_parsing';
  if (dirLower.includes('ocr')) return 'ocr';
  if (dirLower.includes('match')) return 'matching';
  if (dirLower.includes('boolean')) return 'boolean_query';
  if (dirLower.includes('voice') || identifier.includes('voice')) return 'voice';
  if (dirLower.includes('runpod') || dirLower.includes('[runpod]')) return 'runpod';
  if (dirLower.includes('embed') || dirLower.includes('progress')) return 'embedding';
  if (dirLower.includes('ai_search')) return 'ai_search';

  return 'unknown';
}

// ─── Extract service name ────────────────────────────────────
function extractService(direction: string, identifier: string): string {
  const id = identifier.toLowerCase();
  const dir = direction.toLowerCase();

  if (id.includes('gemini') || dir.includes('gemini')) return 'gemini';
  if (id.includes('gpt') || dir.includes('gpt') || dir.includes('openai')) return 'openai-gpt';
  if (dir.includes('runpod') || dir.includes('[runpod]')) return 'runpod';
  if (id.includes('bulk')) return 'bulk-parser';
  if (id.includes('single')) return 'single-parser';
  if (id.includes('voice') || dir.includes('voice')) return 'voice-ai';
  if (dir.includes('boolean')) return 'boolean-engine';
  if (dir.includes('ocr')) return 'ocr-engine';
  if (dir.includes('match')) return 'matching-engine';
  if (dir.includes('embed') || dir.includes('progress')) return 'embedding-service';
  if (dir.includes('jd_parsing')) return 'jd-parser';

  // Fallback: use identifier up to first underscore
  const firstPart = identifier.split('_')[0];
  return firstPart || direction.split('_')[0].toLowerCase() || 'system';
}

// ─── Build human-readable summary ────────────────────────────
function buildSummary(direction: string, identifier: string, data: unknown, severity: LogSeverity): string {
  const dir = direction.replace(/_/g, ' ').toLowerCase();

  if (severity === 'error' || severity === 'critical') {
    let errMsg = '';
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const d = data as Record<string, unknown>;
      errMsg = String(d.error || d.message || '').slice(0, 120);
    } else if (typeof data === 'string') {
      errMsg = data.slice(0, 120);
    }
    return errMsg ? `${dir}: ${errMsg}` : `${direction} — ${identifier}`;
  }

  if (direction === 'PROGRESS') {
    if (data && typeof data === 'string') {
      return data.slice(0, 120);
    }
  }

  // For RUNPOD lines, show key=value pairs
  if (direction.includes('RUNPOD') || direction.includes('[RUNPOD]')) {
    if (typeof data === 'string') return data.slice(0, 120);
  }

  return `${dir} — ${identifier}`;
}

// ─── Extract keywords ─────────────────────────────────────────
function extractKeywords(direction: string, identifier: string, data: unknown): string[] {
  const kws = new Set<string>();

  // From direction tokens
  direction.split(/[_\[\]\s]+/).filter(t => t.length > 2).forEach(t => kws.add(t.toLowerCase()));

  // From identifier tokens
  identifier.split(/[_\-\s:]+/).filter(t => t.length > 2).forEach(t => kws.add(t.toLowerCase()));

  // Recursively extract strings from data
  const extractFromValue = (val: unknown, depth = 0) => {
    if (depth > 4) return;
    if (typeof val === 'string') {
      // Extract error codes, service names, status values
      const tokens = val.match(/\b[A-Z]{3,}\b|\b\w+(?:Error|Exception|_error|_result)\b/g) || [];
      tokens.slice(0, 10).forEach(t => kws.add(t.toLowerCase()));
      // HTTP status codes
      const codes = val.match(/\b[45]\d{2}\b/g) || [];
      codes.forEach(c => kws.add(c));
      // Job IDs
      const uuids = val.match(/\b[0-9a-f-]{8,}\b/g) || [];
      uuids.slice(0, 3).forEach(u => kws.add(u));
    } else if (Array.isArray(val)) {
      val.slice(0, 5).forEach(v => extractFromValue(v, depth + 1));
    } else if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>;
      Object.entries(obj).slice(0, 20).forEach(([k, v]) => {
        kws.add(k.toLowerCase());
        if (typeof v === 'string' || typeof v === 'number') {
          kws.add(String(v).toLowerCase().slice(0, 50));
        } else {
          extractFromValue(v, depth + 1);
        }
      });
    }
  };

  extractFromValue(data);

  return Array.from(kws).filter(k => k.length > 1).slice(0, 60);
}

// ─── Extract error message ────────────────────────────────────
function extractErrorMessage(data: unknown): string | undefined {
  if (!data) return undefined;
  if (typeof data === 'string') {
    if (data.includes('error') || data.includes('Error') || data.includes('FAILED')) {
      return data.slice(0, 500);
    }
    return undefined;
  }
  if (typeof data === 'object' && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (d.error) return String(d.error).slice(0, 500);
    if (d.message) return String(d.message).slice(0, 500);
  }
  return undefined;
}

// ─── Extract RunPod fields ────────────────────────────────────
function extractRunpodFields(data: unknown): { jobId?: string; embeddingId?: string; jobStatus?: string } {
  const result: { jobId?: string; embeddingId?: string; jobStatus?: string } = {};
  if (typeof data === 'string') {
    const jobMatch = data.match(/job_id=([a-zA-Z0-9-]+)/);
    if (jobMatch) result.jobId = jobMatch[1];
    const embedMatch = data.match(/embedding_id=([a-zA-Z0-9-:]+)/);
    if (embedMatch) result.embeddingId = embedMatch[1];
    const statusMatch = data.match(/status=([A-Z_]+)/);
    if (statusMatch) result.jobStatus = statusMatch[1];
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (d.job_id) result.jobId = String(d.job_id);
    if (d.embedding_id) result.embeddingId = String(d.embedding_id);
    if (d.status) result.jobStatus = String(d.status);
  }
  return result;
}

// ─── Determine data type ──────────────────────────────────────
function getDataType(data: unknown): LogEntry['dataType'] {
  if (data === null || data === undefined) return 'null';
  if (Array.isArray(data)) return 'array';
  if (typeof data === 'object') return 'object';
  if (typeof data === 'number') return 'number';
  return 'string';
}

// ─── Compute data size ────────────────────────────────────────
function getDataSize(data: unknown): number {
  try {
    return new Blob([JSON.stringify(data) ?? '']).size;
  } catch {
    return 0;
  }
}

// ─── Build full-text search index ────────────────────────────
function buildSearchIndex(entry: Partial<LogEntry>): string {
  const parts = [
    entry.direction,
    entry.identifier,
    entry.service,
    entry.category,
    entry.severity,
    entry.summary,
    entry.errorMessage,
    entry.jobId,
    entry.embeddingId,
    entry.jobStatus,
    ...(entry.keywords || []),
    JSON.stringify(entry.rawData ?? '').slice(0, 2000),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

// ─── Parse a plain-text RunPod log line ──────────────────────
export function parsePlainTextRunpodLine(line: string, receivedAt: string): LogEntry | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed === '================================================================================') return null;

  // Timestamp pattern: 2026-06-26 12:21:29,243 -
  const tsMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d+) - (.+)$/);
  if (!tsMatch) return null;

  const rawTs = tsMatch[1];
  const message = tsMatch[2];

  // Extract direction bracket: [RUNPOD][WEBHOOK]
  const dirMatch = message.match(/^\[([^\]]+)\]\[([^\]]+)\]/);
  const direction = dirMatch ? `${dirMatch[1]}_${dirMatch[2]}` : 'PROGRESS';

  const timestamp = rawTs.replace(',', '.').replace(' ', 'T');
  const identifier = 'runpod_log';

  const severity = deriveSeverity(direction, message);
  const category: LogCategory = 'runpod';
  const service = 'runpod';
  const keywords = extractKeywords(direction, identifier, message);
  const runpodFields = extractRunpodFields(message);

  const partial: Partial<LogEntry> = {
    direction,
    identifier,
    service,
    category,
    severity,
    summary: message.slice(0, 150),
    keywords,
    rawData: message,
    errorMessage: undefined,
    jobId: runpodFields.jobId,
    embeddingId: runpodFields.embeddingId,
    jobStatus: runpodFields.jobStatus,
  };

  const entry: LogEntry = {
    id: uuidv4(),
    receivedAt,
    timestamp,
    direction,
    identifier,
    rawData: message,
    severity,
    category,
    service,
    summary: message.slice(0, 150),
    keywords,
    hasError: false,
    dataSize: message.length,
    dataType: 'string',
    searchIndex: '',
    ...runpodFields,
  };
  entry.searchIndex = buildSearchIndex(entry);
  return entry;
}

// ─── Main: parse a JSON payload into a LogEntry ──────────────
export function parseLogPayload(raw: RawLogPayload): LogEntry {
  const { timestamp, direction, identifier, data } = raw;
  const receivedAt = new Date().toISOString();

  const severity = deriveSeverity(direction, data);
  const category = deriveCategory(direction, identifier);
  const service = extractService(direction, identifier);
  const keywords = extractKeywords(direction, identifier, data);
  const errorMessage = extractErrorMessage(data);
  const hasError = severity === 'error' || severity === 'critical';
  const summary = buildSummary(direction, identifier, data, severity);
  const runpodFields = extractRunpodFields(data);
  const dataType = getDataType(data);
  const dataSize = getDataSize(data);

  // Try to parse stringified JSON in data
  let parsedData: unknown = data;
  if (typeof data === 'string') {
    try {
      const trimmed = data.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        parsedData = JSON.parse(trimmed);
      }
    } catch {
      // keep as string
    }
  }

  const entry: LogEntry = {
    id: uuidv4(),
    receivedAt,
    timestamp,
    direction,
    identifier,
    rawData: parsedData,
    severity,
    category,
    service,
    summary,
    keywords,
    hasError,
    errorMessage,
    dataSize,
    dataType,
    searchIndex: '',
    ...runpodFields,
  };

  entry.searchIndex = buildSearchIndex(entry);
  return entry;
}

// ─── Parse a batch of raw payloads ───────────────────────────
export function parseLogBatch(raws: RawLogPayload[]): LogEntry[] {
  return raws.map(parseLogPayload);
}

// ─── Auto-detect format and parse ────────────────────────────
export function autoParsePayload(input: unknown): LogEntry[] {
  const receivedAt = new Date().toISOString();

  if (typeof input === 'string') {
    const lines = input.split('\n').filter(l => l.trim());
    const entries: LogEntry[] = [];
    for (const line of lines) {
      // Try JSON first
      const trimmed = line.trim();
      if (trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed) as RawLogPayload;
          if (parsed.timestamp && parsed.direction && parsed.identifier !== undefined) {
            entries.push(parseLogPayload(parsed));
            continue;
          }
        } catch { /* fallthrough */ }
      }
      // Plain text
      const plain = parsePlainTextRunpodLine(trimmed, receivedAt);
      if (plain) entries.push(plain);
    }
    return entries;
  }

  if (Array.isArray(input)) {
    return input.flatMap(item => autoParsePayload(item));
  }

  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    if (obj.timestamp && obj.direction) {
      return [parseLogPayload(obj as unknown as RawLogPayload)];
    }
  }

  return [];
}
