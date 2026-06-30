import { useState } from 'react';
import {
  Box, Card, Typography, Tabs, Tab, Stepper, Step, StepLabel, Chip,
  Grid, alpha, LinearProgress, Divider, IconButton, Tooltip,
} from '@mui/material';
import { ContentCopy, Download, CheckCircle, Timer, Language, Layers } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { UploadZone } from '../../components/inputs/UploadZone';
import { mockOCRResult } from '../../mocks/data';
import { ACCEPTED_FILE_TYPES } from '../../constants';
import { formatFileSize, copyToClipboard, formatDuration } from '../../utils';
import { useAppStore } from '../../store';
import type { OCRStatus } from '../../types';

const OCR_STEPS: { label: string; status: OCRStatus }[] = [
  { label: 'Upload', status: 'uploading' },
  { label: 'Processing', status: 'processing' },
  { label: 'OCR', status: 'ocr' },
  { label: 'Validation', status: 'validation' },
  { label: 'Output', status: 'completed' },
];

export function OCRPage() {
  const [ocrResult, setOcrResult] = useState(mockOCRResult);
  const [activeStep, setActiveStep] = useState(4);
  const [outputTab, setOutputTab] = useState(0);
  const [processing, setProcessing] = useState(false);
  const { themeMode } = useAppStore();

  const handleUpload = (files: File[]) => {
    if (files.length === 0) return;

    setProcessing(true);
    setActiveStep(0);

    // Simulate OCR workflow steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setProcessing(false);
        setOcrResult({
          ...mockOCRResult,
          fileName: files[0].name,
          metadata: {
            ...mockOCRResult.metadata,
            fileSize: files[0].size,
          },
        });
      }
    }, 1200);
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>OCR Processing</Typography>
          <Typography variant="body2" color="text.secondary">
            Extract text from documents using advanced Optical Character Recognition
          </Typography>
        </Box>
      </motion.div>

      {/* Upload Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Upload Document
          </Typography>
          <UploadZone
            accept={ACCEPTED_FILE_TYPES.ocr}
            onUpload={handleUpload}
            title="Drop your document here or click to browse"
            description="Supports PDF, DOC, DOCX, JPG, JPEG, PNG, TIFF — Max 10MB"
          />
        </Card>
      </motion.div>

      {/* OCR Workflow Stepper */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
            OCR Workflow
          </Typography>
          {processing && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
          <Stepper activeStep={activeStep} alternativeLabel>
            {OCR_STEPS.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>
      </motion.div>

      {/* Output Section */}
      {!processing && ocrResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {/* Metadata Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icon: <CheckCircle />, label: 'Confidence', value: `${ocrResult.metadata.confidenceScore}%`, color: '#10b981' },
              { icon: <Timer />, label: 'Processing Time', value: `${ocrResult.metadata.processingTime}s`, color: '#3b82f6' },
              { icon: <Layers />, label: 'Pages', value: ocrResult.metadata.pageCount, color: '#8b5cf6' },
              { icon: <Language />, label: 'Language', value: ocrResult.metadata.languageDetection.toUpperCase(), color: '#f59e0b' },
            ].map((item, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 2, mx: 'auto', mb: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: alpha(item.color, 0.1), color: item.color,
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800}>{item.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Output Tabs */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
              <Tabs value={outputTab} onChange={(_, v) => setOutputTab(v)}>
                <Tab label="Extracted Text" />
                <Tab label="Raw JSON" />
                <Tab label="Metadata" />
              </Tabs>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Copy">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(
                      outputTab === 0 ? ocrResult.extractedText : JSON.stringify(outputTab === 1 ? ocrResult.rawJson : ocrResult.metadata, null, 2)
                    )}
                  >
                    <ContentCopy sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton size="small">
                    <Download sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ p: 3, minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
              {outputTab === 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: '0.82rem',
                    lineHeight: 1.8,
                  }}
                >
                  {ocrResult.extractedText}
                </Typography>
              )}
              {outputTab === 1 && (
                <JsonView
                  data={ocrResult.rawJson}
                  style={themeMode === 'dark' ? darkStyles : defaultStyles}
                />
              )}
              {outputTab === 2 && (
                <Box>
                  {Object.entries(ocrResult.metadata).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {key === 'fileSize' ? formatFileSize(value as number) : key === 'processingTime' ? formatDuration((value as number) * 1000) : String(value)}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 2 }}>
                    <Chip label={`OCR v${ocrResult.metadata.ocrVersion}`} size="small" variant="outlined" />
                    <Chip label={ocrResult.fileType.toUpperCase()} size="small" sx={{ ml: 1 }} />
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
