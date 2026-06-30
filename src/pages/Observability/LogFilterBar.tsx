import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Select, MenuItem, FormControl,
  IconButton, Chip, Tooltip, alpha, Divider, Button,
} from '@mui/material';
import {
  Search, FilterList, AccessTime, Close, Refresh,
  FiberManualRecord,
} from '@mui/icons-material';
import { useLogStore } from '../../store/logStore';
import { SEVERITY_OPTIONS, TIME_RANGES, SEVERITY_CONFIG } from './config';
import type { LogSeverity } from '../../types/logs';

export function LogFilterBar() {
  const { filter, setFilter, resetFilter, services, directions, filteredEntries, clearLogs, isLive, toggleLive } = useLogStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const filtered = filteredEntries();
  const svcList = services();
  const dirList = directions().slice(0, 30);

  const hasActive = filter.search || filter.severity !== 'all' || filter.category !== 'all'
    || filter.service || filter.timeRange !== 'all' || filter.direction;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Row 1: search + main filters */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <TextField
          id="log-search"
          size="small"
          placeholder="Search events, errors, services, identifiers, job IDs…"
          value={filter.search}
          onChange={e => setFilter({ search: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
            endAdornment: filter.search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setFilter({ search: '' })}><Close sx={{ fontSize: 14 }} /></IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            flex: 1, minWidth: 280,
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255,255,255,0.03)',
              '&:hover': { background: 'rgba(255,255,255,0.05)' },
            },
          }}
        />

        {/* Severity */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            id="log-severity-filter"
            value={filter.severity}
            onChange={e => setFilter({ severity: e.target.value as LogSeverity | 'all' })}
            displayEmpty
            sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2 }}
          >
            {SEVERITY_OPTIONS.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.value !== 'all' && (
                  <Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: SEVERITY_CONFIG[o.value as LogSeverity]?.color, mr: 1 }} />
                )}
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Range */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            id="log-time-filter"
            value={filter.timeRange}
            onChange={e => setFilter({ timeRange: e.target.value as typeof filter.timeRange })}
            sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2 }}
            startAdornment={<AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />}
          >
            {TIME_RANGES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Advanced toggle */}
        <Tooltip title="More filters">
          <IconButton
            id="log-advanced-filter-btn"
            size="small"
            onClick={() => setShowAdvanced(p => !p)}
            sx={{ bgcolor: showAdvanced ? alpha('#6366f1', 0.15) : 'transparent', border: '1px solid', borderColor: 'divider' }}
          >
            <FilterList sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* Clear / Reset */}
        {hasActive && (
          <Button size="small" variant="outlined" onClick={resetFilter} sx={{ borderRadius: 2, py: 0.5 }}>
            Clear
          </Button>
        )}

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Live toggle */}
        <Box
          id="log-live-toggle"
          onClick={toggleLive}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.6,
            borderRadius: 2, border: '1px solid', cursor: 'pointer',
            borderColor: isLive ? alpha('#10b981', 0.3) : 'divider',
            bgcolor: isLive ? alpha('#10b981', 0.08) : 'transparent',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: isLive ? alpha('#10b981', 0.12) : 'rgba(255,255,255,0.04)' },
          }}
        >
          <FiberManualRecord
            className={isLive ? 'live-dot' : ''}
            sx={{ fontSize: 10, color: isLive ? '#10b981' : 'text.disabled' }}
          />
          <Typography variant="caption" fontWeight={700} color={isLive ? '#10b981' : 'text.secondary'}>
            {isLive ? 'LIVE' : 'PAUSED'}
          </Typography>
        </Box>

        {/* Clear logs */}
        <Tooltip title="Clear all logs">
          <IconButton size="small" onClick={clearLogs} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Refresh sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Row 2: Advanced filters */}
      {showAdvanced && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Service */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              id="log-service-filter"
              value={filter.service}
              onChange={e => setFilter({ service: e.target.value })}
              displayEmpty
              renderValue={v => v || 'All Services'}
              sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2 }}
            >
              <MenuItem value="">All Services</MenuItem>
              {svcList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Direction / Event */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              id="log-direction-filter"
              value={filter.direction}
              onChange={e => setFilter({ direction: e.target.value })}
              displayEmpty
              renderValue={v => v || 'All Event Types'}
              sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2 }}
            >
              <MenuItem value="">All Event Types</MenuItem>
              {dirList.map(d => <MenuItem key={d} value={d}><Typography variant="caption" fontFamily="monospace">{d}</Typography></MenuItem>)}
            </Select>
          </FormControl>

          {/* Has error */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {[
              { label: 'Errors only', val: true, color: '#ef4444' },
              { label: 'Clean only',  val: false, color: '#10b981' },
            ].map(opt => (
              <Chip
                key={String(opt.val)}
                label={opt.label}
                size="small"
                onClick={() => setFilter({ hasError: filter.hasError === opt.val ? null : opt.val })}
                sx={{
                  cursor: 'pointer',
                  bgcolor: filter.hasError === opt.val ? alpha(opt.color, 0.15) : 'transparent',
                  borderColor: filter.hasError === opt.val ? opt.color : 'divider',
                  color: filter.hasError === opt.val ? opt.color : 'text.secondary',
                  border: '1px solid',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Result count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <Box component="span" fontWeight={700} color="text.primary">{filtered.length.toLocaleString()}</Box> entries
          {hasActive && ' (filtered)'}
        </Typography>
        {hasActive && (
          <>
            <Divider orientation="vertical" flexItem sx={{ height: 12, alignSelf: 'center' }} />
            <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer' }} onClick={resetFilter}>
              Show all
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
