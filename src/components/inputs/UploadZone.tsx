import { useCallback, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Box, Typography, LinearProgress, alpha, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CloudUpload, InsertDriveFile, Close, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize } from '../../utils';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

interface UploadZoneProps {
  accept?: Accept;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  title?: string;
  description?: string;
}

export function UploadZone({
  accept,
  multiple = false,
  maxSize = 10485760,
  onUpload,
  title = 'Drop files here or click to browse',
  description = 'Supported formats: PDF, DOC, DOCX, JPG, PNG, TIFF',
}: UploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`,
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    onUpload(acceptedFiles);

    // Simulate upload progress
    newFiles.forEach((uf) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, progress: 100, status: 'complete' } : f))
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, progress } : f))
          );
        }
      }, 200);
    });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 3,
          p: 5,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          bgcolor: isDragActive
            ? (t) => alpha(t.palette.primary.main, 0.04)
            : 'transparent',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          },
        }}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <CloudUpload
            sx={{
              fontSize: 48,
              color: isDragActive ? 'primary.main' : 'text.secondary',
              opacity: 0.6,
              mb: 1,
            }}
          />
        </motion.div>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {isDragActive ? 'Drop files here...' : title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Max file size: {formatFileSize(maxSize)}
        </Typography>
      </Box>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <List sx={{ mt: 2 }}>
              {files.map((uf) => (
                <ListItem
                  key={uf.id}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  secondaryAction={
                    <IconButton size="small" onClick={() => removeFile(uf.id)}>
                      <Close fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {uf.status === 'complete' ? (
                      <CheckCircle color="success" />
                    ) : uf.status === 'error' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <InsertDriveFile color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {uf.file.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(uf.file.size)}
                        </Typography>
                        {uf.status === 'uploading' && (
                          <LinearProgress
                            variant="determinate"
                            value={uf.progress}
                            sx={{ mt: 0.5, borderRadius: 1, height: 4 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
