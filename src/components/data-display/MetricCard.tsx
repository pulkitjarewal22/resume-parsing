import { Box, Card, Typography, Skeleton, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import * as Icons from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
  loading?: boolean;
  index?: number;
}

export function MetricCard({ title, value, change, changeLabel, icon, color, loading, index = 0 }: MetricCardProps) {
  const theme = useTheme();
  const IconComponent = (Icons as Record<string, React.ElementType>)[icon] || Icons.Analytics;
  const isPositive = (change ?? 0) >= 0;

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="circular" width={44} height={44} />
        </Box>
        <Skeleton variant="text" width={80} height={40} />
        <Skeleton variant="text" width={120} sx={{ mt: 1 }} />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Card
        sx={{
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha(color, 0.05)})`,
              color: color,
            }}
          >
            <IconComponent sx={{ fontSize: 22 }} />
          </Box>
        </Box>

        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
          {value}
        </Typography>

        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />
            )}
            <Typography
              variant="caption"
              fontWeight={600}
              color={isPositive ? 'success.main' : 'error.main'}
            >
              {isPositive ? '+' : ''}{change}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {changeLabel}
            </Typography>
          </Box>
        )}

        {/* Decorative gradient orb */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: alpha(color, 0.06),
          }}
        />
      </Card>
    </motion.div>
  );
}
