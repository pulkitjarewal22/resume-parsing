import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { SEVERITY_CONFIG, CATEGORY_CONFIG } from './config';
import { useLogStore } from '../../store/logStore';
import type { LogSeverity, LogCategory } from '../../types/logs';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

function StatCard({ title, value, sub, color = '#6366f1', onClick, active }: StatCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: active ? color : 'rgba(99,102,241,0.12)',
        background: active ? alpha(color, 0.08) : 'rgba(255,255,255,0.02)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.18s',
        '&:hover': onClick ? { borderColor: color, background: alpha(color, 0.06) } : {},
        minWidth: 120,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem' }}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1.2, mt: 0.3 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export function LogStatsBar() {
  const { stats, filter, setFilter } = useLogStore();

  const handleSeverityClick = (sev: LogSeverity) => {
    setFilter({ severity: filter.severity === sev ? 'all' : sev });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'stretch' }}>
      {/* Total */}
      <StatCard
        title="Total Events"
        value={stats.total}
        sub={`${stats.ingestRatePerMin}/min rate`}
        color="#6366f1"
      />

      {/* Last 1h */}
      <StatCard
        title="Last Hour"
        value={stats.last1h}
        sub="events ingested"
        color="#3b82f6"
      />

      {/* Error Rate */}
      <StatCard
        title="Error Rate"
        value={`${stats.errorRate}%`}
        sub={`${(stats.bySeverity.error || 0) + (stats.bySeverity.critical || 0)} errors`}
        color={stats.errorRate > 20 ? '#ef4444' : stats.errorRate > 5 ? '#f59e0b' : '#10b981'}
      />

      {/* Divider */}
      <Box sx={{ width: 1, borderLeft: '1px solid rgba(99,102,241,0.12)', mx: 0.5 }} />

      {/* Per-severity pills */}
      {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => {
        const count = stats.bySeverity[sev as LogSeverity] || 0;
        if (count === 0) return null;
        const isActive = filter.severity === sev;
        return (
          <Box
            key={sev}
            onClick={() => handleSeverityClick(sev as LogSeverity)}
            sx={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              px: 1.5, py: 1, borderRadius: 2, border: '1px solid',
              borderColor: isActive ? cfg.color : 'rgba(99,102,241,0.12)',
              background: isActive ? alpha(cfg.color, 0.12) : 'rgba(255,255,255,0.02)',
              cursor: 'pointer', transition: 'all 0.15s', minWidth: 80,
              '&:hover': { borderColor: cfg.color, background: alpha(cfg.color, 0.07) },
            }}
          >
            <Typography variant="caption" fontWeight={700} sx={{ color: cfg.color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {cfg.label}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ color: cfg.color, lineHeight: 1.2 }}>
              {count.toLocaleString()}
            </Typography>
          </Box>
        );
      })}

      {/* Divider */}
      <Box sx={{ width: 1, borderLeft: '1px solid rgba(99,102,241,0.12)', mx: 0.5 }} />

      {/* Top categories */}
      {Object.entries(stats.byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([cat, count]) => {
          const cfg = CATEGORY_CONFIG[cat as LogCategory] || { label: cat, color: '#64748b' };
          const isActive = filter.category === cat;
          return (
            <Box
              key={cat}
              onClick={() => setFilter({ category: filter.category === cat ? 'all' : cat as LogCategory })}
              sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                px: 1.5, py: 1, borderRadius: 2, border: '1px solid',
                borderColor: isActive ? cfg.color : 'rgba(99,102,241,0.12)',
                background: isActive ? alpha(cfg.color, 0.1) : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', transition: 'all 0.15s', minWidth: 90,
                '&:hover': { borderColor: cfg.color, background: alpha(cfg.color, 0.06) },
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ color: cfg.color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {cfg.label}
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: cfg.color, lineHeight: 1.2 }}>
                {count.toLocaleString()}
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
}
