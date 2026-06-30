import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Grid, Tabs, Tab, Button, Chip, Divider, alpha,
  LinearProgress, List, ListItem, ListItemText, ListItemIcon, Paper, Avatar, TextField,
} from '@mui/material';
import {
  CompareArrows, Person, WorkOutlined, PlayArrow, TrendingUp, TrendingDown,
  CheckCircle, Warning, Error as ErrorIcon, Lightbulb, ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell,
} from 'recharts';

import { mockMatchResult } from '../../mocks/data';
import { getScoreColor, getSeverityColor } from '../../utils';
import { ACCEPTED_FILE_TYPES } from '../../constants';
import type { MatchType } from '../../types';

const MATCH_TYPES: { value: MatchType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'candidate-jd', label: 'Candidate → JD', icon: <><Person sx={{ fontSize: 18 }} /><ArrowForward sx={{ fontSize: 14 }} /><WorkOutlined sx={{ fontSize: 18 }} /></>, desc: 'Match a candidate profile against a job description' },
  { value: 'jd-candidate', label: 'JD → Candidate', icon: <><WorkOutlined sx={{ fontSize: 18 }} /><ArrowForward sx={{ fontSize: 14 }} /><Person sx={{ fontSize: 18 }} /></>, desc: 'Find best candidates for a job description' },
  { value: 'candidate-candidate', label: 'Candidate → Candidate', icon: <><Person sx={{ fontSize: 18 }} /><ArrowForward sx={{ fontSize: 14 }} /><Person sx={{ fontSize: 18 }} /></>, desc: 'Compare two candidate profiles' },
  { value: 'jd-jd', label: 'JD → JD', icon: <><WorkOutlined sx={{ fontSize: 18 }} /><ArrowForward sx={{ fontSize: 14 }} /><WorkOutlined sx={{ fontSize: 18 }} /></>, desc: 'Compare two job descriptions' },
];

function GaugeChart({ score, label, size = 140 }: { score: number; label: string; size?: number }) {
  const color = getScoreColor(score);
  const circumference = Math.PI * (size - 20);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          <path
            d={`M 10 ${size / 2 + 10} A ${size / 2 - 10} ${size / 2 - 10} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={`M 10 ${size / 2 + 10} A ${size / 2 - 10} ${size / 2 - 10} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <Box sx={{ position: 'absolute', bottom: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
            {score}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}

export function MatchingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  let initialMatchType: MatchType = 'candidate-jd';
  if (location.pathname.includes('/jd-to-cd')) initialMatchType = 'jd-candidate';
  else if (location.pathname.includes('/cd-to-cd')) initialMatchType = 'candidate-candidate';
  else if (location.pathname.includes('/jd-to-jd')) initialMatchType = 'jd-jd';

  const matchType = initialMatchType;


  const [showResults, setShowResults] = useState(false);
  const [sourceUploaded, setSourceUploaded] = useState(false);
  const [targetUploaded, setTargetUploaded] = useState(false);

  const match = mockMatchResult;

  const radarData = match.similarityAnalysis.map((s) => ({
    subject: s.category,
    score: s.score,
    fullMark: 100,
  }));

  const scoreBreakdown = [
    { name: 'Skills', score: match.skillScore, color: '#6366f1' },
    { name: 'Experience', score: match.experienceScore, color: '#ec4899' },
    { name: 'Education', score: match.educationScore, color: '#10b981' },
    { name: 'Keywords', score: match.keywordScore, color: '#f59e0b' },
  ];

  const handleMatch = () => {
    setShowResults(true);
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Matching Engine</Typography>
          <Typography variant="body2" color="text.secondary">
            Intelligent matching between candidates and job descriptions
          </Typography>
        </Box>
      </motion.div>

      {/* Match Type Selection */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {MATCH_TYPES.map((mt) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={mt.value}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                onClick={() => {
                  const newPath = mt.value === 'jd-candidate' ? '/matching/jd-to-cd'
                                : mt.value === 'candidate-candidate' ? '/matching/cd-to-cd'
                                : mt.value === 'jd-jd' ? '/matching/jd-to-jd'
                                : '/matching/cd-to-jd';
                  navigate(newPath);
                  setShowResults(false);
                }}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: matchType === mt.value ? 'primary.main' : 'divider',
                  bgcolor: matchType === mt.value ? (t) => alpha(t.palette.primary.main, 0.04) : 'background.paper',
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: matchType === mt.value ? 'primary.main' : 'text.secondary' }}>
                  {mt.icon}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{mt.label}</Typography>
                <Typography variant="caption" color="text.secondary">{mt.desc}</Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Upload Panels */}
      {!showResults && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                {matchType.startsWith('candidate') ? 'Candidate Profile' : 'Job Description'} (Source)
              </Typography>
              <TextField
                multiline
                rows={10}
                fullWidth
                placeholder="Paste JSON data here..."
                onChange={(e) => setSourceUploaded(!!e.target.value.trim())}
                sx={{
                  '& .MuiInputBase-root': { bgcolor: 'background.default' },
                  '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' }
                }}
              />
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                {matchType.endsWith('jd') || matchType === 'jd-jd' ? 'Job Description' : 'Candidate Profile'} (Target)
              </Typography>
              <TextField
                multiline
                rows={10}
                fullWidth
                placeholder="Paste JSON data here..."
                onChange={(e) => setTargetUploaded(!!e.target.value.trim())}
                sx={{
                  '& .MuiInputBase-root': { bgcolor: 'background.default' },
                  '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' }
                }}
              />
            </Card>
          </Grid>
        </Grid>
      )}

      {!showResults && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleMatch}
            sx={{ px: 5, py: 1.5 }}
          >
            Run Match Analysis
          </Button>
        </Box>
      )}

      {/* Results */}
      {showResults && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Overall Score */}
          <Card sx={{ p: 4, mb: 3, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.15em' }}>
              Overall Match Score
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 2, flexWrap: 'wrap' }}>
              <GaugeChart score={match.overallScore} label="Overall" size={180} />
              {scoreBreakdown.map((s) => (
                <GaugeChart key={s.name} score={s.score} label={s.name} size={120} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
              <Chip label={`${match.source.name}`} icon={<Person sx={{ fontSize: '16px !important' }} />} />
              <Chip label="vs" variant="outlined" size="small" />
              <Chip label={`${match.target.name}`} icon={<WorkOutlined sx={{ fontSize: '16px !important' }} />} />
            </Box>
          </Card>

          <Grid container spacing={2.5}>
            {/* Radar Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Similarity Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(148,163,184,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Score Breakdown */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Score Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={scoreBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={28}>
                      {scoreBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Missing Skills & Gap Analysis */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning sx={{ fontSize: 20, color: 'warning.main' }} /> Missing Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {match.missingSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                        color: 'error.main',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: (t) => alpha(t.palette.error.main, 0.2),
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Gap Analysis</Typography>
                {match.gapAnalysis.map((gap, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 2, borderLeft: '3px solid', borderLeftColor: getSeverityColor(gap.severity) }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{gap.category}</Typography>
                      <Chip
                        label={gap.severity}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          bgcolor: alpha(getSeverityColor(gap.severity), 0.1),
                          color: getSeverityColor(gap.severity),
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {gap.gap}
                    </Typography>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                      💡 {gap.recommendation}
                    </Typography>
                  </Paper>
                ))}
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lightbulb sx={{ fontSize: 20, color: 'warning.main' }} /> Recommendations
                </Typography>
                <List>
                  {match.recommendations.map((rec, i) => (
                    <ListItem key={i} sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2">{rec}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Detailed Similarity</Typography>
                {match.similarityAnalysis.map((item) => (
                  <Box key={item.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.category}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: getScoreColor(item.score) }}>
                        {item.score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.score}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: getScoreColor(item.score),
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">{item.details}</Typography>
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </Box>
  );
}
