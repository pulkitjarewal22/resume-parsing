import { Box, Typography, Chip, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import type { ActivityItem } from '../../types';
import { formatRelativeTime, getStatusColor } from '../../utils';
import {
  Description, DocumentScanner, CompareArrows,
  ErrorOutlined, Psychology, WorkOutlined,
} from '@mui/icons-material';

const iconMap: Record<string, React.ElementType> = {
  resume_parsed: Description,
  ocr_completed: DocumentScanner,
  match_found: CompareArrows,
  error: ErrorOutlined,
  ai_search: Psychology,
  jd_created: WorkOutlined,
};

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type] || Description;
        const color = getStatusColor(activity.status);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                py: 1.5,
                px: 2,
                borderRadius: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                },
              }}
            >
              {/* Timeline line and dot */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(color, 0.12),
                    color: color,
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
                {index < activities.length - 1 && (
                  <Box
                    sx={{
                      width: 2,
                      flexGrow: 1,
                      mt: 0.5,
                      bgcolor: 'divider',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flexGrow: 1, minWidth: 0, pb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.25 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>
                    {formatRelativeTime(activity.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {activity.description}
                </Typography>
                {activity.user && (
                  <Chip
                    label={activity.user}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 500,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                      color: 'primary.main',
                    }}
                  />
                )}
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
