import { useState, useEffect } from 'react';
import {
  Box, Card, Typography, Grid, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TablePagination, IconButton, Chip, TextField, InputAdornment,
  Switch, FormControlLabel, Tooltip, alpha, Drawer, Divider,
} from '@mui/material';
import {
  Refresh, Download, Search, Timer, CheckCircle, Error as ErrorIcon,
  Schedule, Visibility, Close, FiberManualRecord, Speed,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { MetricCard } from '../../components/data-display/MetricCard';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { mockRunPodLogs, mockRunPodMetrics } from '../../mocks/data';
import { formatDateTime, formatDuration, downloadFile } from '../../utils';
import { useAppStore } from '../../store';
import type { RunPodLog } from '../../types';

export function RunPodLogsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<RunPodLog | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { themeMode } = useAppStore();

  const metrics = mockRunPodMetrics;

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = mockRunPodLogs.filter(
    (log) =>
      log.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    const csv = [
      'Request ID,Timestamp,Endpoint,Method,Duration,Status,Status Code',
      ...filteredLogs.map((l) =>
        `${l.requestId},${l.timestamp},${l.endpoint},${l.method},${l.duration}ms,${l.status},${l.statusCode}`
      ),
    ].join('\n');
    downloadFile(csv, 'runpod_logs.csv', 'text/csv');
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>RunPod Logs</Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor API requests and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={<Switch checked={autoRefresh} onChange={(_, v) => setAutoRefresh(v)} size="small" />}
              label={<Typography variant="caption" fontWeight={600}>Auto-refresh</Typography>}
            />
            {autoRefresh && (
              <Chip
                icon={<FiberManualRecord sx={{ fontSize: '10px !important', color: '#10b981 !important' }} />}
                label="Live"
                size="small"
                sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 700 }}
              />
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={() => setLastRefresh(new Date())}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Logs">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="Total Requests" value={metrics.totalRequests.toLocaleString()} icon="Http" color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="Success Rate" value={`${metrics.successRate}%`} icon="CheckCircle" color="#10b981" />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="Failure Rate" value={`${metrics.failureRate}%`} icon="ErrorOutlined" color="#ef4444" />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="Avg Time" value={formatDuration(metrics.avgProcessingTime)} icon="Timer" color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="P95 Time" value={formatDuration(metrics.p95ProcessingTime)} icon="Speed" color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <MetricCard title="Endpoints" value={metrics.activeEndpoints} icon="Api" color="#ec4899" />
        </Grid>
      </Grid>

      {/* Search & Table */}
      <Card>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search by Request ID or Endpoint..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 350 }}
          />
          <Typography variant="caption" color="text.secondary">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </Typography>
        </Box>
        <Divider />

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Code</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedLog(log)}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem' }}
                      >
                        {log.requestId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.endpoint}
                        size="small"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.72rem',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.method}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          height: 22,
                          bgcolor: alpha('#3b82f6', 0.1),
                          color: '#3b82f6',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Timer sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{formatDuration(log.duration)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={log.statusCode}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: 22,
                          bgcolor: log.statusCode < 400 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                          color: log.statusCode < 400 ? '#10b981' : '#ef4444',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedLog(log)}>
                          <Visibility sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 }, borderRadius: '16px 0 0 16px' } }}
      >
        {selectedLog && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Request Details</Typography>
              <IconButton onClick={() => setSelectedLog(null)}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              {[
                { label: 'Request ID', value: selectedLog.requestId },
                { label: 'Endpoint', value: selectedLog.endpoint },
                { label: 'Method', value: selectedLog.method },
                { label: 'Duration', value: formatDuration(selectedLog.duration) },
                { label: 'Status Code', value: selectedLog.statusCode },
                { label: 'Timestamp', value: formatDateTime(selectedLog.timestamp) },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.value}</Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Request Payload</Typography>
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa', border: '1px solid', borderColor: 'divider' }}>
              <JsonView data={selectedLog.payload} style={themeMode === 'dark' ? darkStyles : defaultStyles} />
            </Box>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Response Body</Typography>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa', border: '1px solid', borderColor: 'divider' }}>
              <JsonView data={selectedLog.response} style={themeMode === 'dark' ? darkStyles : defaultStyles} />
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
