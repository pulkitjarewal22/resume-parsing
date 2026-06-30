import { useState, useCallback } from 'react';
import {
  Box, Card, Typography, Button, Chip, IconButton, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Divider, alpha, Paper, Tooltip, Alert,
} from '@mui/material';
import {
  Add, Delete, ContentCopy, PlayArrow, CheckCircle, Error as ErrorIcon,
  Code, DragIndicator, Lightbulb,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOLEAN_OPERATORS } from '../../constants';
import { copyToClipboard } from '../../utils';
import type { BooleanOperator } from '../../types';

interface QueryBlock {
  id: string;
  operator: BooleanOperator;
  field: string;
  value: string;
}

const FIELDS = ['skills', 'experience', 'location', 'education', 'company', 'role', 'certification', 'language'];

const SUGGESTIONS = [
  { label: 'React AND TypeScript', query: '(skills:React AND skills:TypeScript)' },
  { label: 'Senior NOT Junior', query: '(role:Senior NOT role:Junior)' },
  { label: 'Bay Area OR Remote', query: '(location:"Bay Area" OR location:Remote)' },
  { label: 'AWS NEAR Kubernetes', query: '(skills:AWS NEAR skills:Kubernetes)' },
  { label: 'Python IN ("ML", "AI")', query: '(skills:Python IN ("Machine Learning", "AI"))' },
];

export function BooleanQueryPage() {
  const [blocks, setBlocks] = useState<QueryBlock[]>([
    { id: '1', operator: 'AND', field: 'skills', value: 'React' },
    { id: '2', operator: 'AND', field: 'skills', value: 'TypeScript' },
    { id: '3', operator: 'OR', field: 'location', value: 'San Francisco' },
  ]);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      { id: `${Date.now()}`, operator: 'AND', field: 'skills', value: '' },
    ]);
  };

  const updateBlock = (id: string, updates: Partial<QueryBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    setValidationError(null);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const generateQuery = useCallback((): string => {
    if (blocks.length === 0) return '';

    return blocks
      .map((block, index) => {
        const prefix = index === 0 ? '' : ` ${block.operator} `;
        const val = block.value.includes(' ') ? `"${block.value}"` : block.value;

        switch (block.operator) {
          case 'NOT':
            return ` NOT ${block.field}:${val}`;
          case 'NEAR':
            return `${prefix}${block.field} NEAR ${val}`;
          case 'IN':
            return `${prefix}${block.field} IN (${val})`;
          case 'EXISTS':
            return `${prefix}EXISTS(${block.field})`;
          default:
            return `${prefix}${block.field}:${val}`;
        }
      })
      .join('');
  }, [blocks]);

  const query = generateQuery();

  const validate = () => {
    const emptyBlocks = blocks.filter((b) => !b.value && b.operator !== 'EXISTS');
    if (emptyBlocks.length > 0) {
      setValidationError('All query blocks must have a value (except EXISTS operator)');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleCopy = async () => {
    if (validate()) {
      await copyToClipboard(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Boolean Query Builder</Typography>
          <Typography variant="body2" color="text.secondary">
            Build complex search queries with visual operators
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={2.5}>
        {/* Builder Panel */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700}>Query Builder</Typography>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={addBlock}>
                Add Condition
              </Button>
            </Box>

            <AnimatePresence>
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <DragIndicator sx={{ color: 'text.secondary', fontSize: 20, cursor: 'grab' }} />

                    {/* Operator */}
                    {index > 0 ? (
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Operator</InputLabel>
                        <Select
                          value={block.operator}
                          onChange={(e) => updateBlock(block.id, { operator: e.target.value as BooleanOperator })}
                          label="Operator"
                        >
                          {BOOLEAN_OPERATORS.map((op) => (
                            <MenuItem key={op} value={op}>
                              <Chip
                                label={op}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22,
                                  bgcolor: (t) => alpha(
                                    op === 'AND' ? t.palette.primary.main :
                                    op === 'OR' ? t.palette.success.main :
                                    op === 'NOT' ? t.palette.error.main :
                                    t.palette.warning.main,
                                    0.12
                                  ),
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Box sx={{ minWidth: 100, display: 'flex', alignItems: 'center' }}>
                        <Chip label="WHERE" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: (t) => alpha(t.palette.info.main, 0.12) }} />
                      </Box>
                    )}

                    {/* Field */}
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={block.field}
                        onChange={(e) => updateBlock(block.id, { field: e.target.value })}
                        label="Field"
                      >
                        {FIELDS.map((f) => (
                          <MenuItem key={f} value={f} sx={{ textTransform: 'capitalize' }}>{f}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Value */}
                    {block.operator !== 'EXISTS' && (
                      <TextField
                        size="small"
                        placeholder="Enter value..."
                        value={block.value}
                        onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                        sx={{ flex: 1 }}
                        error={!block.value && validationError !== null}
                      />
                    )}

                    <IconButton size="small" onClick={() => removeBlock(block.id)} sx={{ color: 'text.secondary' }}>
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>

            {validationError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {validationError}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                onClick={handleCopy}
                color={copied ? 'success' : 'primary'}
              >
                {copied ? 'Copied!' : 'Copy Query'}
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => validate()}
              >
                Execute Query
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Preview & Suggestions */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Generated Query */}
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Code sx={{ fontSize: 20, color: 'primary.main' }} /> Generated Query
            </Typography>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.82rem',
                lineHeight: 1.8,
                wordBreak: 'break-all',
                minHeight: 80,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {query ? (
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                  component="pre"
                >
                  {query}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Add conditions to generate a query...
                </Typography>
              )}
            </Paper>
          </Card>

          {/* Suggestions */}
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb sx={{ fontSize: 20, color: 'warning.main' }} /> Suggestions
            </Typography>
            {SUGGESTIONS.map((sug, i) => (
              <Paper
                key={i}
                variant="outlined"
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
                  },
                }}
                onClick={() => copyToClipboard(sug.query)}
              >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{sug.label}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    color: 'primary.main',
                    fontSize: '0.72rem',
                  }}
                >
                  {sug.query}
                </Typography>
              </Paper>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
