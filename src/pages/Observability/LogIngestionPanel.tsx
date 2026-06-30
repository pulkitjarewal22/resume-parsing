import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, TextField, alpha, Snackbar, Alert,
} from '@mui/material';
import { Upload, Code } from '@mui/icons-material';
import { useLogStore } from '../../store/logStore';

export function LogIngestionPanel() {
  const { ingestRaw } = useLogStore();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ open: boolean; count: number; error?: string }>({ open: false, count: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleIngest = () => {
    if (!input.trim()) return;
    try {
      // Try JSON array
      let parsed: unknown;
      try { parsed = JSON.parse(input); } catch { parsed = input; }
      ingestRaw(parsed);
      const count = Array.isArray(parsed) ? parsed.length : 1;
      setFeedback({ open: true, count });
      setInput('');
    } catch (e) {
      setFeedback({ open: true, count: 0, error: String(e) });
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      ingestRaw(text);
      setFeedback({ open: true, count: text.split('\n').filter(l => l.trim()).length });
    };
    reader.readAsText(file);
  };

  return (
    <Box
      sx={{
        p: 2.5,
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 2,
        background: 'rgba(99,102,241,0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Code sx={{ color: '#6366f1', fontSize: 18 }} />
        <Typography variant="subtitle2" fontWeight={700}>Ingest Payload</Typography>
        <Typography variant="caption" color="text.secondary">
          Paste JSON payload(s) or upload a log file
        </Typography>
      </Box>

      <TextField
        multiline
        rows={4}
        fullWidth
        size="small"
        placeholder={`Paste log payloads — JSON object, JSON array, or newline-delimited JSON lines\n\n{"timestamp":"...","direction":"RESUME_PARSING_ERROR","identifier":"...","data":{...}}`}
        value={input}
        onChange={e => setInput(e.target.value)}
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            background: 'rgba(0,0,0,0.2)',
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          id="ingest-submit-btn"
          variant="contained"
          size="small"
          onClick={handleIngest}
          disabled={!input.trim()}
          sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
        >
          Ingest
        </Button>
        <Button
          id="ingest-file-btn"
          variant="outlined"
          size="small"
          startIcon={<Upload sx={{ fontSize: 15 }} />}
          onClick={() => fileRef.current?.click()}
          sx={{ borderColor: 'rgba(99,102,241,0.3)', color: 'text.secondary' }}
        >
          Upload file
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.txt,.log,.ndjson"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={feedback.error ? 'error' : 'success'} onClose={() => setFeedback(p => ({ ...p, open: false }))}>
          {feedback.error ? `Ingest error: ${feedback.error}` : `✓ ${feedback.count} log entries ingested`}
        </Alert>
      </Snackbar>
    </Box>
  );
}
