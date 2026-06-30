import { useState } from 'react';
import {
  Box, Card, Typography, Grid, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TablePagination, TextField, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, Chip, IconButton, Drawer, Divider, alpha,
  Tooltip, Paper,
} from '@mui/material';
import {
  Search, FilterList, Visibility, Close, BugReport, TrendingDown,
  CheckCircle, Warning, Error as ErrorIcon, InfoOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { mockErrorLogs, mockErrorMetrics, errorTrends } from '../../mocks/data';
import { formatDateTime, getSeverityColor } from '../../utils';
import { ERROR_SEVERITIES, SERVICES, ENVIRONMENTS } from '../../constants';
import type { ErrorLog } from '../../types';

export function ErrorLogsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [envFilter, setEnvFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const metrics = mockErrorMetrics;

  const filteredLogs = mockErrorLogs.filter((log) => {
    const matchSearch = !searchQuery ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = !severityFilter || log.severity === severityFilter;
    const matchService = !serviceFilter || log.service === serviceFilter;
    const matchEnv = !envFilter || log.environment === envFilter;
    const matchStatus = !statusFilter || log.status === statusFilter;
    return matchSearch && matchSeverity && matchService && matchEnv && matchStatus;
  });

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Error Logs</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and analyze system errors across all services
          </Typography>
        </Box>
      </motion.div>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard title="Total Errors" value={metrics.totalErrors} icon="BugReport" color="#ef4444" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard title="Critical" value={metrics.criticalErrors} icon="ErrorOutlined" color="#9c27b0" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard title="Open" value={metrics.openErrors} icon="Warning" color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard title="Resolved" value={metrics.resolvedErrors} icon="CheckCircle" color="#10b981" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Error Trends</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={errorTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                <RTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="critical" stackId="a" fill="#9c27b0" name="Critical" />
                <Bar dataKey="high" stackId="a" fill="#f44336" name="High" />
                <Bar dataKey="medium" stackId="a" fill="#ff9800" name="Medium" />
                <Bar dataKey="low" stackId="a" fill="#4caf50" name="Low" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Failing Services</Typography>
            {metrics.failingServices.map((svc, i) => (
              <motion.div
                key={svc.service}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: i < metrics.failingServices.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugReport sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="body2" fontWeight={600}>{svc.service}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`${svc.count} errors`} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', height: 24 }} color="error" variant="outlined" />
                    <Chip
                      icon={svc.trend < 0 ? <TrendingDown sx={{ fontSize: '14px !important' }} /> : undefined}
                      label={`${svc.trend > 0 ? '+' : ''}${svc.trend}%`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        bgcolor: alpha(svc.trend < 0 ? '#10b981' : '#ef4444', 0.08),
                        color: svc.trend < 0 ? '#10b981' : '#ef4444',
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search errors..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment>,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} label="Severity">
              <MenuItem value="">All</MenuItem>
              {ERROR_SEVERITIES.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
                    {s.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Service</InputLabel>
            <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} label="Service">
              <MenuItem value="">All</MenuItem>
              {SERVICES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Environment</InputLabel>
            <Select value={envFilter} onChange={(e) => setEnvFilter(e.target.value)} label="Environment">
              <MenuItem value="">All</MenuItem>
              {ENVIRONMENTS.map((e) => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="investigating">Investigating</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="ignored">Ignored</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Error Table */}
      <Card>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="center">Severity</TableCell>
                <TableCell align="center">Environment</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedError(log)}>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{log.service}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.code}
                        size="small"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" noWrap>{log.message}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={log.severity}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          height: 22,
                          bgcolor: alpha(getSeverityColor(log.severity), 0.1),
                          color: getSeverityColor(log.severity),
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <StatusBadge status={log.environment} />
                    </TableCell>
                    <TableCell align="center">
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedError(log)}>
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
        open={Boolean(selectedError)}
        onClose={() => setSelectedError(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 560 }, borderRadius: '16px 0 0 16px' } }}
      >
        {selectedError && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Error Details</Typography>
                <Chip
                  label={selectedError.severity}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    bgcolor: alpha(getSeverityColor(selectedError.severity), 0.12),
                    color: getSeverityColor(selectedError.severity),
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
              <IconButton onClick={() => setSelectedError(null)}>
                <Close />
              </IconButton>
            </Box>

            {/* Error Info */}
            {[
              { label: 'Service', value: selectedError.service },
              { label: 'Error Code', value: selectedError.code },
              { label: 'Environment', value: selectedError.environment.toUpperCase() },
              { label: 'Status Code', value: selectedError.statusCode },
              { label: 'Timestamp', value: formatDateTime(selectedError.timestamp) },
              { label: 'Status', value: selectedError.status },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                <Typography variant="body2" color="text.secondary">{item.value}</Typography>
              </Box>
            ))}

            {/* Error Message */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Error Message</Typography>
              <Paper sx={{ p: 2, borderRadius: 2, bgcolor: (t) => alpha(t.palette.error.main, 0.04), border: '1px solid', borderColor: (t) => alpha(t.palette.error.main, 0.15) }}>
                <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.82rem' }}>
                  {selectedError.message}
                </Typography>
              </Paper>
            </Box>

            {/* Stack Trace */}
            {selectedError.stackTrace && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Stack Trace</Typography>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa', border: '1px solid', borderColor: 'divider', overflow: 'auto' }}>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.75rem',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      m: 0,
                    }}
                  >
                    {selectedError.stackTrace}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Request Details */}
            {selectedError.requestPayload && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Request Payload</Typography>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', m: 0 }}>
                    {JSON.stringify(selectedError.requestPayload, null, 2)}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Headers */}
            {selectedError.requestHeaders && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Request Headers</Typography>
                {Object.entries(selectedError.requestHeaders).map(([key, val]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" fontWeight={600}>{key}</Typography>
                    <Typography variant="caption" color="text.secondary">{val}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Resolution Notes */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Resolution Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add resolution notes..."
                defaultValue={selectedError.resolutionNotes || ''}
                size="small"
              />
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
