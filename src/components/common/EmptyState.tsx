import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        gap: 2,
      }}
    >
      {icon || (
        <InboxOutlined
          sx={{
            fontSize: 64,
            color: 'text.secondary',
            opacity: 0.4,
          }}
        />
      )}
      <Typography variant="h6" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        maxWidth={400}
      >
        {description}
      </Typography>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}
