import { useState } from 'react';
import {
  AppBar, Toolbar, Box, InputBase, IconButton, Badge, Avatar, Typography,
  Menu, MenuItem, ListItemIcon, Divider, Chip, alpha, Popover, List,
  ListItemButton, ListItemText, Tooltip, Switch,
} from '@mui/material';
import {
  Search, NotificationsOutlined, DarkMode, LightMode,
  FiberManualRecord, KeyboardArrowDown, Close, CheckCircle,
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { ENVIRONMENTS, NAVBAR_HEIGHT } from '../constants';
import { formatRelativeTime, getStatusColor } from '../utils';
import type { Environment } from '../types';

export function Navbar() {
  const {
    themeMode, setThemeMode, environment, setEnvironment,
    notifications, markNotificationRead, clearNotifications,
    systemHealth, globalSearchQuery, setGlobalSearchQuery,
  } = useAppStore();

  const [envAnchor, setEnvAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [healthAnchor, setHealthAnchor] = useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const healthColor = getStatusColor(systemHealth.status);
  const envConfig = ENVIRONMENTS.find((e) => e.value === environment)!;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        backdropFilter: 'blur(20px)',
        height: NAVBAR_HEIGHT,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: `${NAVBAR_HEIGHT}px !important` }}>
        {/* Global Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
            borderRadius: 2.5,
            px: 2,
            py: 0.5,
            flex: 1,
            maxWidth: 480,
            ml: { xs: 0, md: 2 },
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:focus-within': {
              borderColor: 'primary.main',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
              boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.1)}`,
            },
          }}
        >
          <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          <InputBase
            placeholder="Search candidates, jobs, documents... (⌘K)"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.85rem',
              '& input::placeholder': { opacity: 0.6 },
            }}
            inputProps={{ 'aria-label': 'Global search' }}
          />
          {globalSearchQuery && (
            <IconButton size="small" onClick={() => setGlobalSearchQuery('')}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          <Chip
            label="⌘K"
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
              ml: 0.5,
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Environment Selector */}
        <Chip
          label={envConfig.label}
          size="small"
          icon={<FiberManualRecord sx={{ fontSize: '10px !important', color: `${envConfig.color} !important` }} />}
          deleteIcon={<KeyboardArrowDown sx={{ fontSize: '16px !important' }} />}
          onDelete={() => { }}
          onClick={(e) => setEnvAnchor(e.currentTarget)}
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer',
            border: '1px solid',
            borderColor: alpha(envConfig.color, 0.3),
            bgcolor: alpha(envConfig.color, 0.08),
          }}
        />
        <Menu
          anchorEl={envAnchor}
          open={Boolean(envAnchor)}
          onClose={() => setEnvAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {ENVIRONMENTS.map((env) => (
            <MenuItem
              key={env.value}
              selected={environment === env.value}
              onClick={() => { setEnvironment(env.value as Environment); setEnvAnchor(null); }}
            >
              <ListItemIcon>
                <FiberManualRecord sx={{ fontSize: 10, color: env.color }} />
              </ListItemIcon>
              {env.label}
            </MenuItem>
          ))}
        </Menu>

        {/* System Health */}
        <Tooltip title={`System: ${systemHealth.status}`}>
          <IconButton
            size="small"
            onClick={(e) => setHealthAnchor(e.currentTarget)}
            sx={{ position: 'relative' }}
          >
            <FiberManualRecord
              sx={{
                fontSize: 14,
                color: healthColor,
                animation: systemHealth.status !== 'healthy' ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(healthAnchor)}
          anchorEl={healthAnchor}
          onClose={() => setHealthAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { width: 300, p: 2, borderRadius: 3 } } }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            System Health
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FiberManualRecord sx={{ fontSize: 12, color: healthColor }} />
            <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {systemHealth.status}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {systemHealth.uptime}% uptime
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {systemHealth.services.map((svc) => (
            <Box key={svc.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecord sx={{ fontSize: 8, color: getStatusColor(svc.status) }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>{svc.name}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{svc.latency}ms</Typography>
            </Box>
          ))}
        </Popover>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            onClick={(e) => setNotifAnchor(e.currentTarget)}
          >
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <NotificationsOutlined sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { width: 380, maxHeight: 460, borderRadius: 3 } } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => { clearNotifications(); setNotifAnchor(null); }}
            >
              Clear all
            </Typography>
          </Box>
          <Divider />
          <List disablePadding sx={{ maxHeight: 360, overflow: 'auto' }}>
            {notifications.map((notif) => (
              <ListItemButton
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                sx={{
                  py: 1.5,
                  bgcolor: notif.read ? 'transparent' : (t) => alpha(t.palette.primary.main, 0.03),
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FiberManualRecord
                    sx={{ fontSize: 10, color: getStatusColor(notif.type) }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>
                      {notif.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span" sx={{ fontSize: '0.65rem' }}>
                        {formatRelativeTime(notif.timestamp)}
                      </Typography>
                    </>
                  }
                />
                {!notif.read && (
                  <CheckCircle sx={{ fontSize: 14, color: 'primary.main', opacity: 0.5, ml: 1 }} />
                )}
              </ListItemButton>
            ))}
          </List>
        </Popover>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LightMode sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Switch
              checked={themeMode === 'dark'}
              onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              size="small"
              slotProps={{ input: { 'aria-label': 'Toggle dark mode' } }}
            />
            <DarkMode sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        </Tooltip>

      </Toolbar>
    </AppBar>
  );
}
