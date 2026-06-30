import React, { useEffect, useRef } from 'react';
import { Box, Typography, Card, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useLogStore } from '../../store/logStore';
import { LogStatsBar } from './LogStatsBar';
import { LogFilterBar } from './LogFilterBar';
import { LogStream } from './LogStream';
import { LogDetailDrawer } from './LogDetailDrawer';
import { LogIngestionPanel } from './LogIngestionPanel';

export function ObservabilityPage() {
  const { lastIngestedAt, stats, isLive } = useLogStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0.5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              {/* Live pulse indicator */}
              {isLive && (
                <Box
                  className="live-dot"
                  sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', flexShrink: 0 }}
                />
              )}
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: '#e2e8f0' }}>
                Log Observability
              </Typography>
              <Box
                sx={{
                  px: 1.2, py: 0.2, borderRadius: 1, border: '1px solid rgba(99,102,241,0.25)',
                  bgcolor: 'rgba(99,102,241,0.08)',
                }}
              >
                <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Real-Time
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Receive · Parse · Categorize · Search · Inspect — {stats.total.toLocaleString()} events indexed
              {lastIngestedAt && ` · last at ${new Date(lastIngestedAt).toLocaleTimeString()}`}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* ── Stats Bar ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
          <LogStatsBar />
        </Box>
      </motion.div>

      {/* ── Main content: Stream + Ingestion ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>

          {/* ── Log stream (main) ── */}
          <Card sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {/* Filter bar inside card header */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
              <LogFilterBar />
            </Box>

            {/* Stream */}
            <LogStream />
          </Card>

          {/* ── Right panel: Ingestion ── */}
          <Box sx={{ width: 340, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            <LogIngestionPanel />

            {/* Quick stats summary */}
            <Card sx={{ mt: 2, p: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5, fontSize: '0.65rem' }}>
                Service Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {Object.entries(stats.byService)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([svc, count]) => {
                    const pct = Math.round((count / stats.total) * 100);
                    return (
                      <Box key={svc}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.73rem', color: 'text.secondary' }}>
                            {svc}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.73rem' }}>
                            {count}
                          </Typography>
                        </Box>
                        <Box sx={{ height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: '#6366f1', borderRadius: 2, transition: 'width 0.3s' }} />
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            </Card>

            {/* Error summary */}
            {stats.bySeverity.error > 0 && (
              <Card sx={{ mt: 2, p: 2, border: '1px solid rgba(239,68,68,0.2)', bgcolor: 'rgba(239,68,68,0.04)' }}>
                <Typography variant="caption" fontWeight={700} color="error.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1, fontSize: '0.65rem' }}>
                  ⚠ Active Errors
                </Typography>
                <Typography variant="h4" fontWeight={800} color="error.main">
                  {((stats.bySeverity.error || 0) + (stats.bySeverity.critical || 0)).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stats.errorRate}% error rate · {stats.bySeverity.critical || 0} critical
                </Typography>
              </Card>
            )}
          </Box>
        </Box>
      </motion.div>

      {/* ── Detail drawer ── */}
      <LogDetailDrawer />
    </Box>
  );
}
