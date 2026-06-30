import React, { memo } from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { SEVERITY_CONFIG, CATEGORY_CONFIG } from './config';
import type { LogEntry, LogSeverity, LogCategory } from '../../types/logs';

interface LogRowProps {
  entry: LogEntry;
  isSelected: boolean;
  onClick: () => void;
  isNew?: boolean;
}

function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts.slice(11, 19) || ts;
  }
}

export const LogRow = memo(function LogRow({ entry, isSelected, onClick, isNew }: LogRowProps) {
  const sevCfg = SEVERITY_CONFIG[entry.severity] || SEVERITY_CONFIG.info;
  const catCfg = CATEGORY_CONFIG[entry.category as LogCategory] || { label: entry.category, color: '#64748b' };

  return (
    <Box
      id={`log-row-${entry.id}`}
      onClick={onClick}
      className={isNew ? 'log-entry-new' : undefined}
      sx={{
        display: 'grid',
        gridTemplateColumns: '4px 140px 90px 120px 1fr 80px',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.2,
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderBottomColor: 'rgba(99,102,241,0.07)',
        bgcolor: isSelected ? alpha('#6366f1', 0.08) : 'transparent',
        transition: 'background 0.12s',
        '&:hover': { bgcolor: isSelected ? alpha('#6366f1', 0.1) : 'rgba(99,102,241,0.04)' },
        // Left severity bar
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: '0 2px 2px 0',
          bgcolor: sevCfg.color,
          opacity: 0.8,
        },
      }}
    >
      {/* Severity indicator (blank — bar on left via ::before) */}
      <Box />

      {/* Timestamp */}
      <Typography
        variant="caption"
        sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1 }}
      >
        {formatTime(entry.timestamp)}
      </Typography>

      {/* Severity chip */}
      <Box
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          px: 1, py: 0.3, borderRadius: 1,
          bgcolor: sevCfg.bg, border: `1px solid ${alpha(sevCfg.color, 0.25)}`,
          width: 'fit-content',
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: sevCfg.color, flexShrink: 0 }} />
        <Typography variant="caption" fontWeight={700} sx={{ color: sevCfg.color, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {sevCfg.label}
        </Typography>
      </Box>

      {/* Category */}
      <Typography variant="caption" fontWeight={600} sx={{ color: catCfg.color, fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {catCfg.label}
      </Typography>

      {/* Summary */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            color: entry.hasError ? '#fca5a5' : 'text.primary',
          }}
        >
          {entry.summary}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', fontFamily: 'monospace' }}>
          {entry.direction} · {entry.service}
          {entry.jobId && ` · ${entry.jobId.slice(0, 16)}…`}
        </Typography>
      </Box>

      {/* Relative time */}
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
        {formatRelativeTime(entry.receivedAt)}
      </Typography>
    </Box>
  );
});
