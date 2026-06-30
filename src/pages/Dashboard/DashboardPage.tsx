import { Box, Grid, Card, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ActivityTimeline } from '../../components/data-display/ActivityTimeline';
import { mockKPIs, processingTrends, matchDistribution, ocrSuccessRate, errorTrends, mockActivities } from '../../mocks/data';

const CHART_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
const PIE_COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ef4444', '#94a3b8'];

export function DashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, Alex. Here's what's happening with your talent pipeline today.
          </Typography>
        </Box>
      </motion.div>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {mockKPIs.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={kpi.id}>
            <MetricCard {...kpi} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Processing Trends */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Processing Trends
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={processingTrends}>
                  <defs>
                    <linearGradient id="gradResumes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOcr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradMatches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="resumes" stroke="#6366f1" fill="url(#gradResumes)" strokeWidth={2} name="Resumes" />
                  <Area type="monotone" dataKey="ocr" stroke="#ec4899" fill="url(#gradOcr)" strokeWidth={2} name="OCR" />
                  <Area type="monotone" dataKey="matches" stroke="#10b981" fill="url(#gradMatches)" strokeWidth={2} name="Matches" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>

        {/* Match Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Match Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={matchDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {matchDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* OCR Success Rate */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                OCR Success Rate
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ocrSuccessRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" domain={[90, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: 13 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="success" fill="#10b981" radius={[6, 6, 0, 0]} name="Success %" />
                  <Bar dataKey="failure" fill="#ef4444" radius={[6, 6, 0, 0]} name="Failure %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>

        {/* Error Trends */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Error Trends
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={errorTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgba(148,163,184,0.5)" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: 13 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="critical" stackId="a" fill="#9c27b0" name="Critical" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="high" stackId="a" fill="#f44336" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#ff9800" name="Medium" />
                  <Bar dataKey="low" stackId="a" fill="#4caf50" name="Low" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Activity Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Recent Activity
          </Typography>
          <ActivityTimeline activities={mockActivities} />
        </Card>
      </motion.div>
    </Box>
  );
}
