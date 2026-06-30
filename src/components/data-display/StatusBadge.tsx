import { Chip, type ChipProps, alpha } from '@mui/material';
import { getStatusColor } from '../../utils';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: string;
  capitalize?: boolean;
}

export function StatusBadge({ status, capitalize = true, ...props }: StatusBadgeProps) {
  const color = getStatusColor(status);

  return (
    <Chip
      label={capitalize ? status.charAt(0).toUpperCase() + status.slice(1) : status}
      size="small"
      {...props}
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 24,
        bgcolor: alpha(color, 0.12),
        color: color,
        border: `1px solid ${alpha(color, 0.25)}`,
        ...props.sx,
      }}
    />
  );
}
