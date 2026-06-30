// ============================================================
// Log Observability Store
// Zustand store — no manual actions, only log ingestion
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LogEntry, LogFilter, LogStats, LogSeverity, LogCategory } from '../types/logs';
import { autoParsePayload } from '../services/logParser';
import { SEED_PAYLOADS } from './seedLogs'; // Seed logs

const MAX_ENTRIES = 5000;

const DEFAULT_FILTER: LogFilter = {
  search: '',
  severity: 'all',
  category: 'all',
  service: '',
  timeRange: 'all',
  hasError: null,
  direction: '',
};

function computeStats(entries: LogEntry[]): LogStats {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  const bySeverity: Record<LogSeverity, number> = {
    critical: 0, error: 0, warning: 0, info: 0, debug: 0, success: 0,
  };
  const byCategory: Record<string, number> = {};
  const byService: Record<string, number> = {};
  let last1h = 0, last24h = 0, criticalCount = 0;

  for (const e of entries) {
    bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    byService[e.service] = (byService[e.service] || 0) + 1;

    const ts = new Date(e.receivedAt).getTime();
    if (now - ts < ONE_HOUR) last1h++;
    if (now - ts < ONE_DAY) last24h++;
    if (e.severity === 'critical') criticalCount++;
  }

  const errorCount = bySeverity.error + bySeverity.critical;
  const errorRate = entries.length > 0 ? Math.round((errorCount / entries.length) * 100) : 0;
  const ingestRatePerMin = last1h > 0 ? Math.round(last1h / 60) : 0;

  return {
    total: entries.length,
    last1h,
    last24h,
    bySeverity,
    byCategory,
    byService,
    errorRate,
    criticalCount,
    ingestRatePerMin,
  };
}

interface ObservabilityStore {
  // State
  entries: LogEntry[];
  stats: LogStats;
  filter: LogFilter;
  selectedEntry: LogEntry | null;
  isLive: boolean;
  lastIngestedAt: string | null;

  // Derived
  filteredEntries: () => LogEntry[];
  services: () => string[];
  directions: () => string[];
  categories: () => string[];

  // Actions
  ingestRaw: (raw: unknown) => void;
  clearLogs: () => void;
  setFilter: (patch: Partial<LogFilter>) => void;
  resetFilter: () => void;
  selectEntry: (entry: LogEntry | null) => void;
  toggleLive: () => void;
}

function applyFilter(entries: LogEntry[], filter: LogFilter): LogEntry[] {
  const now = Date.now();
  const TIME_MAP: Record<string, number> = {
    '5m': 5 * 60_000,
    '15m': 15 * 60_000,
    '1h': 60 * 60_000,
    '6h': 6 * 60 * 60_000,
    '24h': 24 * 60 * 60_000,
    '7d': 7 * 24 * 60 * 60_000,
    'all': Infinity,
  };

  const timeCutoff = TIME_MAP[filter.timeRange] ?? Infinity;

  return entries.filter(e => {
    // Time
    if (timeCutoff !== Infinity) {
      const ts = new Date(e.receivedAt).getTime();
      if (now - ts > timeCutoff) return false;
    }

    // Severity
    if (filter.severity !== 'all' && e.severity !== filter.severity) return false;

    // Category
    if (filter.category !== 'all' && e.category !== filter.category) return false;

    // Service
    if (filter.service && e.service !== filter.service) return false;

    // Direction
    if (filter.direction && !e.direction.toLowerCase().includes(filter.direction.toLowerCase())) return false;

    // Has error
    if (filter.hasError !== null && e.hasError !== filter.hasError) return false;

    // Full text search
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!e.searchIndex.includes(q)) return false;
    }

    return true;
  });
}

// Seed with real-world example entries on first load
const seedEntries = SEED_PAYLOADS.flatMap(raw => autoParsePayload(raw));

export const useLogStore = create<ObservabilityStore>()(
  devtools(
    (set, get) => ({
      entries: seedEntries,
      stats: computeStats(seedEntries),
      filter: DEFAULT_FILTER,
      selectedEntry: null,
      isLive: true,
      lastIngestedAt: seedEntries.length > 0 ? new Date().toISOString() : null,

      filteredEntries: () => applyFilter(get().entries, get().filter),

      services: () => [...new Set(get().entries.map(e => e.service))].sort(),
      directions: () => [...new Set(get().entries.map(e => e.direction))].sort(),
      categories: () => [...new Set(get().entries.map(e => e.category))].sort(),

      ingestRaw: (raw) => {
        const parsed = autoParsePayload(raw);
        if (parsed.length === 0) return;

        set(state => {
          const combined = [...parsed, ...state.entries];
          const trimmed = combined.slice(0, MAX_ENTRIES);
          return {
            entries: trimmed,
            stats: computeStats(trimmed),
            lastIngestedAt: new Date().toISOString(),
          };
        });
      },

      clearLogs: () => {
        set({
          entries: [],
          stats: computeStats([]),
          lastIngestedAt: null,
          selectedEntry: null,
        });
      },

      setFilter: (patch) => {
        set(state => ({ filter: { ...state.filter, ...patch } }));
      },

      resetFilter: () => {
        set({ filter: DEFAULT_FILTER });
      },

      selectEntry: (entry) => {
        set({ selectedEntry: entry });
      },

      toggleLive: () => {
        set(state => ({ isLive: !state.isLive }));
      },
    }),
    { name: 'log-observability' }
  )
);
