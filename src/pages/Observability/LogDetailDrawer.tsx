import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Drawer, Chip, Divider, Tooltip, alpha,
  Tabs, Tab, ButtonBase,
} from '@mui/material';
import { Close, ContentCopy, OpenInNew, ErrorOutlined, CheckCircleOutlined } from '@mui/icons-material';
import { JsonView, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { SEVERITY_CONFIG, CATEGORY_CONFIG } from './config';
import type { LogEntry, LogSeverity, LogCategory } from '../../types/logs';
import { useLogStore } from '../../store/logStore';

function Field({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.9, borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.64rem', minWidth: 110, pt: 0.2 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        {typeof value === 'string' ? (
          <Typography variant="caption" sx={{ fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: '0.78rem', wordBreak: 'break-all', color: 'text.primary' }}>
            {value}
          </Typography>
        ) : value}
      </Box>
    </Box>
  );
}

export function LogDetailDrawer() {
  const { selectedEntry, selectEntry } = useLogStore();
  const [tab, setTab] = useState(0);
  const entry = selectedEntry;

  if (!entry) return null;

  const sevCfg = SEVERITY_CONFIG[entry.severity as LogSeverity] || SEVERITY_CONFIG.info;
  const catCfg = CATEGORY_CONFIG[entry.category as LogCategory] || { label: entry.category, color: '#6366f1' };

  const copyText = (text: string) => navigator.clipboard.writeText(text).catch(() => { });

  const rawDataForJson: unknown = (() => {
    if (typeof entry.rawData === 'string') {
      try { return JSON.parse(entry.rawData); } catch { return entry.rawData; }
    }
    return entry.rawData;
  })();

  return (
    <Drawer
      anchor="right"
      open={Boolean(entry)}
      onClose={() => selectEntry(null)}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 560, md: 620 },
          background: '#0d1525',
          borderLeft: '1px solid rgba(99,102,241,0.18)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {entry.hasError
              ? <ErrorOutline sx={{ color: sevCfg.color, fontSize: 20 }} />
              : <CheckCircleOutlined sx={{ color: sevCfg.color, fontSize: 20 }} />
            }
            <Typography variant="subtitle1" fontWeight={700}>Log Inspector</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Copy entry ID">
              <IconButton size="small" onClick={() => copyText(entry.id)} sx={{ opacity: 0.7 }}>
                <ContentCopy sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => selectEntry(null)}>
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Severity + Category badges */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={sevCfg.label.toUpperCase()}
            sx={{ bgcolor: sevCfg.bg, color: sevCfg.color, fontWeight: 800, fontSize: '0.68rem', border: `1px solid ${alpha(sevCfg.color, 0.3)}` }}
          />
          <Chip
            size="small"
            label={catCfg.label}
            sx={{ bgcolor: alpha(catCfg.color, 0.1), color: catCfg.color, fontWeight: 700, fontSize: '0.68rem', border: `1px solid ${alpha(catCfg.color, 0.25)}` }}
          />
          <Chip
            size="small"
            label={entry.service}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', fontWeight: 600, fontSize: '0.68rem' }}
          />
        </Box>

        {/* Summary */}
        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: entry.hasError ? '#fca5a5' : 'text.primary', lineHeight: 1.5 }}>
            {entry.summary}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, borderBottom: '1px solid rgba(99,102,241,0.12)', minHeight: 42 }} TabIndicatorProps={{ style: { background: '#6366f1' } }}>
        {['Metadata', 'Raw Payload', 'Keywords'].map((t, i) => (
          <Tab key={t} label={t} value={i} sx={{ minHeight: 42, py: 0.5, fontSize: '0.8rem' }} />
        ))}
      </Tabs>

      {/* Tab content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2.5 }}>
        {/* ── Metadata ── */}
        {tab === 0 && (
          <Box>
            <Field label="Entry ID" value={entry.id} mono />
            <Field label="Direction" value={entry.direction} mono />
            <Field label="Identifier" value={entry.identifier} mono />
            <Field label="Service" value={entry.service} />
            <Field label="Category" value={<Chip size="small" label={catCfg.label} sx={{ bgcolor: alpha(catCfg.color, 0.12), color: catCfg.color, fontWeight: 700 }} />} />
            <Field label="Severity" value={<Chip size="small" label={sevCfg.label} sx={{ bgcolor: sevCfg.bg, color: sevCfg.color, fontWeight: 700 }} />} />
            <Field label="Timestamp" value={entry.timestamp} mono />
            <Field label="Received At" value={entry.receivedAt} mono />
            <Field label="Data Type" value={entry.dataType} />
            <Field label="Data Size" value={`${entry.dataSize.toLocaleString()} bytes`} />
            {entry.hasError && entry.errorMessage && (
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 1.5, bgcolor: alpha('#ef4444', 0.07), border: '1px solid rgba(239,68,68,0.2)' }}>
                <Typography variant="caption" color="error.main" fontWeight={700} sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Error Message
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#fca5a5', lineHeight: 1.6, wordBreak: 'break-all' }}>
                  {entry.errorMessage}
                </Typography>
              </Box>
            )}
            {entry.jobId && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(99,102,241,0.1)' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 1 }}>
                  RunPod Info
                </Typography>
                {entry.jobId && <Field label="Job ID" value={entry.jobId} mono />}
                {entry.embeddingId && <Field label="Embedding ID" value={entry.embeddingId} mono />}
                {entry.jobStatus && <Field label="Job Status" value={entry.jobStatus} />}
              </>
            )}
          </Box>
        )}

        {/* ── Raw Payload ── */}
        {tab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Tooltip title="Copy raw payload">
                <IconButton size="small" onClick={() => copyText(JSON.stringify(entry.rawData, null, 2))}>
                  <ContentCopy sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#080d1a', border: '1px solid rgba(99,102,241,0.15)', overflow: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
              {typeof rawDataForJson === 'object' ? (
                <JsonView data={rawDataForJson as object} style={darkStyles} />
              ) : (
                <Typography
                  component="pre"
                  sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 }}
                >
                  {String(rawDataForJson ?? '')}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* ── Keywords ── */}
        {tab === 2 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Auto-extracted searchable keywords from this payload:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {entry.keywords.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  size="small"
                  sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', bgcolor: 'rgba(99,102,241,0.08)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.18)' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
