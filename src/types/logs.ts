// ============================================================
// Log Observability Platform — Core Type Definitions
// Derived from real payload structures in logs-ref/
// ============================================================

// ─── Raw Payload ────────────────────────────────────────────
export interface RawLogPayload {
  timestamp: string;
  direction: string;   // event type / operation name
  identifier: string;  // service/source context
  data: unknown;       // variable — string, object, nested
}

// ─── Severity ───────────────────────────────────────────────
export type LogSeverity = 'critical' | 'error' | 'warning' | 'info' | 'debug' | 'success';

// ─── Category ───────────────────────────────────────────────
export type LogCategory =
  | 'resume_parsing'
  | 'jd_parsing'
  | 'matching'
  | 'ocr'
  | 'runpod'
  | 'boolean_query'
  | 'ai_search'
  | 'voice'
  | 'embedding'
  | 'webhook'
  | 'error'
  | 'system'
  | 'unknown';

// ─── Processed Log Entry ────────────────────────────────────
export interface LogEntry {
  // Identity
  id: string;                       // uuid generated on receipt
  receivedAt: string;               // ISO timestamp when dashboard received it
  // From payload
  timestamp: string;                // original source timestamp
  direction: string;                // raw event/operation name
  identifier: string;               // source / service context
  rawData: unknown;                 // the original `data` field as-is
  // Derived / auto-classified
  severity: LogSeverity;
  category: LogCategory;
  service: string;                  // extracted service name
  summary: string;                  // short human-readable summary
  keywords: string[];               // extracted searchable keywords
  hasError: boolean;
  errorMessage?: string;
  // Metadata
  dataSize: number;                 // bytes of the data field
  dataType: 'string' | 'object' | 'array' | 'number' | 'null';
  // RunPod extras (when applicable)
  jobId?: string;
  embeddingId?: string;
  jobStatus?: string;
  // Search index — full searchable text
  searchIndex: string;
}

// ─── Live Stats ─────────────────────────────────────────────
export interface LogStats {
  total: number;
  last1h: number;
  last24h: number;
  bySeverity: Record<LogSeverity, number>;
  byCategory: Record<string, number>;
  byService: Record<string, number>;
  errorRate: number;        // 0–100
  criticalCount: number;
  ingestRatePerMin: number;
}

// ─── Filter State ────────────────────────────────────────────
export interface LogFilter {
  search: string;
  severity: LogSeverity | 'all';
  category: LogCategory | 'all';
  service: string;
  timeRange: '5m' | '15m' | '1h' | '6h' | '24h' | '7d' | 'all';
  hasError: boolean | null;
  direction: string;
}

// ─── Store ──────────────────────────────────────────────────
export interface LogStore {
  entries: LogEntry[];
  stats: LogStats;
  filter: LogFilter;
  selectedEntry: LogEntry | null;
  isLive: boolean;
  lastIngestedAt: string | null;
  maxEntries: number;
}
