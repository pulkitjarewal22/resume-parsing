import type { LogSeverity, LogCategory } from '../../types/logs';

// ─── Severity config ─────────────────────────────────────────
export const SEVERITY_CONFIG: Record<LogSeverity, { color: string; bg: string; label: string; icon: string }> = {
  critical: { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Critical', icon: '🔴' },
  error:    { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'Error',    icon: '❌' },
  warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Warning', icon: '⚠️' },
  info:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', label: 'Info',    icon: 'ℹ️' },
  success:  { color: '#10b981', bg: 'rgba(16,185,129,0.10)', label: 'Success', icon: '✅' },
  debug:    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', label: 'Debug',   icon: '🔍' },
};

// ─── Category config ─────────────────────────────────────────
export const CATEGORY_CONFIG: Record<LogCategory, { label: string; color: string }> = {
  resume_parsing: { label: 'Resume Parsing',  color: '#6366f1' },
  jd_parsing:     { label: 'JD Parsing',      color: '#8b5cf6' },
  matching:       { label: 'Matching',         color: '#ec4899' },
  ocr:            { label: 'OCR',              color: '#3b82f6' },
  runpod:         { label: 'RunPod',           color: '#f59e0b' },
  boolean_query:  { label: 'Boolean Query',    color: '#10b981' },
  ai_search:      { label: 'AI Search',        color: '#06b6d4' },
  voice:          { label: 'Voice AI',         color: '#a855f7' },
  embedding:      { label: 'Embedding',        color: '#f97316' },
  webhook:        { label: 'Webhook',          color: '#14b8a6' },
  error:          { label: 'Error',            color: '#ef4444' },
  system:         { label: 'System',           color: '#64748b' },
  unknown:        { label: 'Unknown',          color: '#475569' },
};

export const TIME_RANGES = [
  { value: '5m',  label: 'Last 5m' },
  { value: '15m', label: 'Last 15m' },
  { value: '1h',  label: 'Last 1h' },
  { value: '6h',  label: 'Last 6h' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d',  label: 'Last 7d' },
  { value: 'all', label: 'All time' },
];

export const SEVERITY_OPTIONS = [
  { value: 'all',      label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'error',    label: 'Error' },
  { value: 'warning',  label: 'Warning' },
  { value: 'info',     label: 'Info' },
  { value: 'success',  label: 'Success' },
  { value: 'debug',    label: 'Debug' },
];
