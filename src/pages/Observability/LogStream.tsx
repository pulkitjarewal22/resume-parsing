import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { useLogStore } from '../../store/logStore';
import { LogRow } from './LogRow';
import type { LogEntry } from '../../types/logs';

const ROW_HEIGHT = 60;
const OVERSCAN = 10;

export function LogStream() {
  const { filteredEntries, selectedEntry, selectEntry, isLive } = useLogStore();
  const entries = filteredEntries();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevCountRef = useRef(entries.length);

  // Track newly ingested entries for animation
  useEffect(() => {
    const prevCount = prevCountRef.current;
    if (entries.length > prevCount) {
      const newEntries = entries.slice(0, entries.length - prevCount);
      const ids = new Set(newEntries.map(e => e.id));
      setNewIds(ids);
      const timer = setTimeout(() => setNewIds(new Set()), 1500);
      prevCountRef.current = entries.length;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = entries.length;
  }, [entries.length]);

  // Auto-scroll to top when new entries arrive (live mode)
  useEffect(() => {
    if (isLive && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [entries.length, isLive]);

  // Measure container height
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      setContainerHeight(entries[0]?.contentRect.height || 600);
    });
    observer.observe(el);
    setContainerHeight(el.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = entries.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(entries.length - 1, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN);
  const visibleEntries = entries.slice(startIndex, endIndex + 1);

  if (entries.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 1.5, color: 'text.secondary' }}>
        <Typography variant="h4" sx={{ opacity: 0.3 }}>📭</Typography>
        <Typography variant="body2" fontWeight={600}>No log entries match your filters</Typography>
        <Typography variant="caption">Waiting for incoming payloads or adjust filters above</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Column headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '4px 140px 90px 120px 1fr 80px',
          gap: 1.5,
          px: 2,
          py: 0.75,
          bgcolor: 'rgba(99,102,241,0.05)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box />
        {['Time', 'Severity', 'Category', 'Event Summary', 'Age'].map(h => (
          <Typography key={h} variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {h}
          </Typography>
        ))}
      </Box>

      {/* Virtual scroll container */}
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        sx={{ height: 'calc(100vh - 420px)', minHeight: 300, overflow: 'auto', position: 'relative' }}
      >
        {/* Total height spacer */}
        <Box sx={{ height: totalHeight, position: 'relative' }}>
          {/* Visible rows */}
          <Box sx={{ position: 'absolute', top: startIndex * ROW_HEIGHT, left: 0, right: 0 }}>
            {visibleEntries.map((entry) => (
              <LogRow
                key={entry.id}
                entry={entry}
                isSelected={selectedEntry?.id === entry.id}
                onClick={() => selectEntry(selectedEntry?.id === entry.id ? null : entry)}
                isNew={newIds.has(entry.id)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Showing <b>{visibleEntries.length}</b> of <b>{entries.length.toLocaleString()}</b> entries · {ROW_HEIGHT}px row height · virtual scroll
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {isLive ? '● Live stream' : '⏸ Paused'}
        </Typography>
      </Box>
    </Box>
  );
}
