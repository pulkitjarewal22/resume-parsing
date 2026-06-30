import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Tabs, Tab, Grid, Chip, Divider, TextField, Button,
  LinearProgress, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  alpha, Avatar, List, ListItem, ListItemText, ListItemIcon, Paper,
} from '@mui/material';
import {
  Person, Email, Phone, LocationOn, GitHub, LinkedIn, School,
  WorkOutlined, Code, EmojiEvents, Folder, CheckCircle, Error as ErrorIcon,
  Schedule, Upload, PlayArrow,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UploadZone } from '../../components/inputs/UploadZone';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { mockParsedResume, mockBulkJobs } from '../../mocks/data';
import { ACCEPTED_FILE_TYPES } from '../../constants';

export function ParsingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabValue = location.pathname.includes('/bulk-parsing') ? 1 : location.pathname.includes('/jd-parsing') ? 2 : 0;

  const [parsed, setParsed] = useState(false);
  const [jdText, setJdText] = useState('');
  const [jdParsed, setJdParsed] = useState(false);

  const resume = mockParsedResume;

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Resume Parsing</Typography>
          <Typography variant="body2" color="text.secondary">
            Parse and extract structured data from resumes and job descriptions
          </Typography>
        </Box>
      </motion.div>

      <Tabs
        value={tabValue}
        onChange={(_, v) => {
          if (v === 0) navigate('/parsing/single-resume');
          if (v === 1) navigate('/parsing/bulk-parsing');
          if (v === 2) navigate('/parsing/jd-parsing');
        }}
        sx={{ mb: 3 }}
      >
        <Tab label="Single Resume" />
        <Tab label="Bulk Parsing" />
        <Tab label="JD Parsing" />
      </Tabs>

      {/* Tab 1: Single Resume Parsing */}
      {tabValue === 0 && (
        <Box>
          {!parsed ? (
            <Card sx={{ p: 3 }}>
              <UploadZone
                accept={ACCEPTED_FILE_TYPES.resume}
                onUpload={() => setTimeout(() => setParsed(true), 1500)}
                title="Upload a resume to parse"
                description="Supports PDF, DOC, DOCX"
              />
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Candidate Summary */}
              <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <Avatar
                    sx={{
                      width: 72, height: 72, bgcolor: 'primary.main',
                      fontSize: '1.5rem', fontWeight: 800,
                    }}
                  >
                    {resume.contactDetails.name.split(' ').map((n) => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={800}>{resume.contactDetails.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {resume.candidateSummary}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip icon={<Email sx={{ fontSize: '16px !important' }} />} label={resume.contactDetails.email} size="small" variant="outlined" />
                      <Chip icon={<Phone sx={{ fontSize: '16px !important' }} />} label={resume.contactDetails.phone} size="small" variant="outlined" />
                      <Chip icon={<LocationOn sx={{ fontSize: '16px !important' }} />} label={resume.contactDetails.location} size="small" variant="outlined" />
                      {resume.contactDetails.github && (
                        <Chip icon={<GitHub sx={{ fontSize: '16px !important' }} />} label={resume.contactDetails.github} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Card>

              <Grid container spacing={2.5}>
                {/* Skills */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Code sx={{ fontSize: 20, color: 'primary.main' }} /> Skills
                    </Typography>
                    {resume.skills.map((cat) => (
                      <Box key={cat.category} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" fontWeight={700} color="text.secondary">
                            {cat.category}
                          </Typography>
                          <StatusBadge status={cat.proficiency} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {cat.skills.map((skill) => (
                            <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.7rem', height: 24 }} />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Card>
                </Grid>

                {/* Experience Timeline */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkOutlined sx={{ fontSize: 20, color: 'primary.main' }} /> Experience
                    </Typography>
                    {resume.experience.map((exp, i) => (
                      <Box key={exp.id} sx={{ position: 'relative', pl: 3, pb: 2, mb: 1 }}>
                        {i < resume.experience.length - 1 && (
                          <Box sx={{ position: 'absolute', left: 8, top: 24, bottom: 0, width: 2, bgcolor: 'divider' }} />
                        )}
                        <Box
                          sx={{
                            position: 'absolute', left: 0, top: 6, width: 18, height: 18, borderRadius: '50%',
                            bgcolor: exp.current ? 'primary.main' : 'divider',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {exp.current && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />}
                        </Box>
                        <Typography variant="body2" fontWeight={700}>{exp.role}</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={600}>{exp.company}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {exp.startDate} — {exp.endDate} · {exp.duration}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exp.description}
                        </Typography>
                      </Box>
                    ))}
                  </Card>
                </Grid>

                {/* Education */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School sx={{ fontSize: 20, color: 'primary.main' }} /> Education
                    </Typography>
                    {resume.education.map((edu) => (
                      <Box key={edu.id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.03) }}>
                        <Typography variant="body2" fontWeight={700}>{edu.degree} in {edu.field}</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={600}>{edu.institution}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {edu.startDate} — {edu.endDate} {edu.gpa && `· GPA: ${edu.gpa}`}
                        </Typography>
                      </Box>
                    ))}
                  </Card>
                </Grid>

                {/* Certifications */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmojiEvents sx={{ fontSize: 20, color: 'primary.main' }} /> Certifications
                    </Typography>
                    {resume.certifications.map((cert) => (
                      <Box key={cert.id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: (t) => alpha(t.palette.warning.main, 0.04) }}>
                        <Typography variant="body2" fontWeight={700}>{cert.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{cert.issuer} · {cert.date}</Typography>
                        {cert.credentialId && (
                          <Chip label={cert.credentialId} size="small" sx={{ mt: 0.5, fontSize: '0.65rem', height: 20 }} variant="outlined" />
                        )}
                      </Box>
                    ))}
                  </Card>
                </Grid>

                {/* Projects */}
                <Grid size={12}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Folder sx={{ fontSize: 20, color: 'primary.main' }} /> Projects
                    </Typography>
                    <Grid container spacing={2}>
                      {resume.projects.map((proj) => (
                        <Grid size={{ xs: 12, md: 6 }} key={proj.id}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight={700}>{proj.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              {proj.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {proj.technologies.map((tech) => (
                                <Chip key={tech} label={tech} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                              ))}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Box>
      )}

      {/* Tab 2: Bulk Parsing */}
      {tabValue === 1 && (
        <Box>
          <Card sx={{ p: 3, mb: 3 }}>
            <UploadZone
              accept={ACCEPTED_FILE_TYPES.resume}
              multiple
              onUpload={() => { }}
              title="Upload multiple resumes for batch processing"
              description="Drop multiple PDF, DOC, DOCX files or a ZIP archive"
            />
          </Card>

          {/* Metrics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total', value: 5, color: '#6366f1' },
              { label: 'Completed', value: 2, color: '#10b981' },
              { label: 'Processing', value: 1, color: '#3b82f6' },
              { label: 'Failed', value: 1, color: '#ef4444' },
              { label: 'Queued', value: 1, color: '#94a3b8' },
            ].map((m) => (
              <Grid size={{ xs: 6, sm: 2.4 }} key={m.label}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: m.color }}>{m.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Queue */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Started</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockBulkJobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{job.fileName}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={job.progress}
                            sx={{ flex: 1, borderRadius: 1, height: 6 }}
                            color={job.status === 'failed' ? 'error' : 'primary'}
                          />
                          <Typography variant="caption" fontWeight={600}>{job.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {job.startedAt ? new Date(job.startedAt).toLocaleTimeString() : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {job.completedAt ? new Date(job.completedAt).toLocaleTimeString() : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* Tab 3: JD Parsing */}
      {tabValue === 2 && (
        <Box>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Paste or upload a Job Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Paste job description text here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setJdParsed(true)}
                disabled={!jdText.trim()}
              >
                Parse JD
              </Button>
              <UploadZone
                accept={ACCEPTED_FILE_TYPES.resume}
                onUpload={(files) => {
                  setJdText(`[Content from ${files[0]?.name}]`);
                  setTimeout(() => setJdParsed(true), 1000);
                }}
                title=""
                description=""
              />
            </Box>
          </Card>

          {jdParsed && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Parsed JD Summary</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">Title</Typography>
                      <Typography variant="body2">Senior Full Stack Engineer</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">Experience Required</Typography>
                      <Typography variant="body2">5-8 years</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">Education</Typography>
                      <Typography variant="body2">B.S. in Computer Science or related field</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">Required Skills</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                        {['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'GraphQL'].map((s) => (
                          <Chip key={s} label={s} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Responsibilities & Keywords</Typography>
                    <List dense>
                      {[
                        'Design and build scalable microservices architecture',
                        'Lead code reviews and mentor junior developers',
                        'Collaborate with product teams on feature development',
                        'Implement CI/CD pipelines and DevOps best practices',
                      ].map((r, i) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{r}</Typography>} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Extracted Keywords
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {['microservices', 'scalable', 'CI/CD', 'agile', 'REST', 'leadership', 'mentoring'].map((k) => (
                        <Chip key={k} label={k} size="small" sx={{ fontSize: '0.68rem' }} />
                      ))}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Box>
      )}
    </Box>
  );
}
