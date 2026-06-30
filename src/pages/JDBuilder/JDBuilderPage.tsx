import { useState } from 'react';
import {
  Box, Card, Typography, Grid, TextField, Button, Chip, Divider, alpha,
  FormControl, InputLabel, Select, MenuItem, Slider, Paper, IconButton,
  Tooltip, Autocomplete,
} from '@mui/material';
import {
  AutoAwesome, TrendingUp, EditNote, Compress, OpenInFull, Speed,
  ContentCopy, Download, Add, Delete, PlayArrow,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JD_ACTIONS } from '../../constants';
import { copyToClipboard, downloadFile } from '../../utils';
import type { JDAction } from '../../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  AutoAwesome: <AutoAwesome sx={{ fontSize: 18 }} />,
  TrendingUp: <TrendingUp sx={{ fontSize: 18 }} />,
  EditNote: <EditNote sx={{ fontSize: 18 }} />,
  Compress: <Compress sx={{ fontSize: 18 }} />,
  OpenInFull: <OpenInFull sx={{ fontSize: 18 }} />,
  Speed: <Speed sx={{ fontSize: 18 }} />,
};

const SAMPLE_JD = `# Senior Full Stack Engineer

## About the Role
We are looking for a talented Senior Full Stack Engineer to join our engineering team. You will be responsible for designing, developing, and maintaining scalable web applications that serve millions of users.

## Requirements
- **Experience**: 5-8 years of professional software development
- **Education**: B.S. in Computer Science or related field
- **Technical Skills**: React, TypeScript, Node.js, PostgreSQL, AWS
- **Preferred**: GraphQL, Kubernetes, CI/CD, microservices

## Responsibilities
- Design and implement scalable microservices architecture
- Lead code reviews and ensure code quality standards
- Mentor junior developers and conduct technical interviews
- Collaborate with product managers on feature roadmaps
- Implement comprehensive testing strategies

## Qualifications
- Strong problem-solving and communication skills
- Experience with agile development methodologies
- Track record of delivering high-quality software on time
- Familiarity with DevOps practices and cloud infrastructure

## Benefits
- Competitive salary: $150,000 - $200,000
- Equity compensation package
- Health, dental, and vision insurance
- Flexible remote work policy
- Annual learning & development budget ($5,000)
- 25 days PTO + company holidays

**Location**: San Francisco, CA (Hybrid) | **Type**: Full-time`;

export function JDBuilderPage() {
  const [title, setTitle] = useState('Senior Full Stack Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [experience, setExperience] = useState('5-8 years');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS']);
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Design and implement scalable microservices architecture',
    'Lead code reviews and ensure code quality standards',
    'Mentor junior developers and conduct technical interviews',
  ]);
  const [qualifications, setQualifications] = useState<string[]>([
    'B.S. in Computer Science or related field',
    'Strong problem-solving skills',
    'Experience with agile methodologies',
  ]);
  const [benefits, setBenefits] = useState<string[]>([
    'Competitive salary',
    'Equity compensation',
    'Health insurance',
    'Remote work policy',
  ]);
  const [location, setLocation] = useState('San Francisco, CA');
  const [employmentType, setEmploymentType] = useState('full-time');
  const [salaryRange, setSalaryRange] = useState<number[]>([150000, 200000]);
  const [preview, setPreview] = useState(SAMPLE_JD);
  const [activeAction, setActiveAction] = useState<JDAction | null>(null);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAction = (action: JDAction) => {
    setActiveAction(action);
    // Simulate AI processing
    setTimeout(() => {
      setPreview(SAMPLE_JD);
      setActiveAction(null);
    }, 1500);
  };

  const handleCopy = async () => {
    await copyToClipboard(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: 'txt' | 'md') => {
    const ext = format === 'md' ? 'md' : 'txt';
    const content = format === 'md' ? preview : preview.replace(/[#*_]/g, '');
    downloadFile(content, `${title.replace(/\s+/g, '_')}.${ext}`, 'text/plain');
  };

  const addListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>JD Builder</Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered job description generator with live preview
          </Typography>
        </Box>
      </motion.div>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {JD_ACTIONS.map((action) => (
          <motion.div key={action.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={activeAction === action.value ? 'contained' : 'outlined'}
              startIcon={ICON_MAP[action.icon]}
              onClick={() => handleAction(action.value as JDAction)}
              disabled={activeAction !== null}
              sx={{
                borderColor: alpha(action.color, 0.4),
                color: activeAction === action.value ? '#fff' : action.color,
                bgcolor: activeAction === action.value ? action.color : 'transparent',
                '&:hover': {
                  borderColor: action.color,
                  bgcolor: alpha(action.color, 0.08),
                },
              }}
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* Two-Panel Layout */}
      <Grid container spacing={2.5}>
        {/* Editor Panel */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Job Description Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Job Title" fullWidth size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
              <TextField label="Department" fullWidth size="small" value={department} onChange={(e) => setDepartment(e.target.value)} />
              <TextField label="Experience Required" fullWidth size="small" value={experience} onChange={(e) => setExperience(e.target.value)} />
              <TextField label="Location" fullWidth size="small" value={location} onChange={(e) => setLocation(e.target.value)} />

              <FormControl fullWidth size="small">
                <InputLabel>Employment Type</InputLabel>
                <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} label="Employment Type">
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="freelance">Freelance</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Salary Range: ${salaryRange[0].toLocaleString()} — ${salaryRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={salaryRange}
                  onChange={(_, v) => setSalaryRange(v as number[])}
                  min={50000}
                  max={500000}
                  step={5000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `$${(v / 1000).toFixed(0)}K`}
                  size="small"
                />
              </Box>

              <Divider />

              {/* Skills */}
              <Autocomplete
                multiple
                freeSolo
                options={['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB']}
                value={skills}
                onChange={(_, v) => setSkills(v)}
                renderInput={(params) => <TextField {...params} label="Required Skills" size="small" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option} label={option} size="small" color="primary" variant="outlined" />
                  ))
                }
              />

              {/* Responsibilities */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Responsibilities
                </Typography>
                {responsibilities.map((r, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{r}</Typography>
                    <IconButton size="small" onClick={() => setResponsibilities(responsibilities.filter((_, j) => j !== i))}>
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add responsibility..."
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addListItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => addListItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Qualifications */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Qualifications
                </Typography>
                {qualifications.map((q, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{q}</Typography>
                    <IconButton size="small" onClick={() => setQualifications(qualifications.filter((_, j) => j !== i))}>
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add qualification..."
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addListItem(qualifications, setQualifications, newQualification, setNewQualification)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small" color="primary" onClick={() => addListItem(qualifications, setQualifications, newQualification, setNewQualification)}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Benefits */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Benefits
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {benefits.map((b, i) => (
                    <Chip key={i} label={b} size="small" onDelete={() => setBenefits(benefits.filter((_, j) => j !== i))} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addListItem(benefits, setBenefits, newBenefit, setNewBenefit)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small" color="primary" onClick={() => addListItem(benefits, setBenefits, newBenefit, setNewBenefit)}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Preview Panel */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 0, overflow: 'hidden', position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Live Preview</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton size="small" onClick={handleCopy}>
                    <ContentCopy sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export as Markdown">
                  <IconButton size="small" onClick={() => handleExport('md')}>
                    <Download sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                p: 4,
                maxHeight: 'calc(100vh - 220px)',
                overflow: 'auto',
                '& h1': { fontSize: '1.5rem', fontWeight: 800, mb: 1.5, color: 'primary.main' },
                '& h2': { fontSize: '1.1rem', fontWeight: 700, mt: 2.5, mb: 1, color: 'text.primary' },
                '& p': { fontSize: '0.9rem', lineHeight: 1.7, mb: 1, color: 'text.secondary' },
                '& ul, & ol': { pl: 2.5, mb: 1.5 },
                '& li': { fontSize: '0.9rem', lineHeight: 1.7, color: 'text.secondary', mb: 0.3 },
                '& strong': { color: 'text.primary', fontWeight: 700 },
                '& hr': { border: 'none', borderTop: '1px solid', borderColor: 'divider', my: 2 },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {preview}
              </ReactMarkdown>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
