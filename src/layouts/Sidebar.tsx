import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText,
  Tooltip, Divider, alpha, IconButton, Collapse,
} from '@mui/material';
import {
  Dashboard, Search, DocumentScanner, Description, CompareArrows, Psychology,
  Code, WorkOutlined, Terminal, BugReport, ChevronLeft, ChevronRight, AutoAwesome,
  ExpandLess, ExpandMore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { NAV_GROUPS, DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, APP_NAME } from '../constants';
import { useAppStore } from '../store';

const iconMap: Record<string, React.ElementType> = {
  Dashboard, Search, DocumentScanner, Description, CompareArrows,
  Psychology, Code, WorkOutlined, Terminal, BugReport,
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebarCollapse } = useAppStore();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({ parsing: true });

  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const width = sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: sidebarCollapsed ? 1.5 : 2.5,
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {APP_NAME}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                Intelligence Platform
              </Typography>
            </Box>
          </Box>
        )}
        {sidebarCollapsed && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
        )}
        {!sidebarCollapsed && (
          <IconButton size="small" onClick={toggleSidebarCollapse} sx={{ ml: 1 }}>
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {NAV_GROUPS.map((group) => (
          <Box key={group.id} sx={{ mb: 0.5 }}>
            {!sidebarCollapsed && (
              <Typography
                variant="overline"
                sx={{
                  px: 2.5,
                  py: 1,
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: '0.1em',
                }}
              >
                {group.label}
              </Typography>
            )}
            {sidebarCollapsed && <Divider sx={{ my: 0.5 }} />}

            <List disablePadding sx={{ px: 1 }}>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || Dashboard;
                const hasChildren = item.children && item.children.length > 0;
                const isSubActive = hasChildren ? item.children!.some(child => location.pathname === child.path) : false;
                const isActive = location.pathname === item.path || isSubActive;
                const isOpen = openSubMenus[item.id] || false;

                const button = (
                  <ListItemButton
                    key={item.id}
                    onClick={() => {
                      if (hasChildren && !sidebarCollapsed) {
                        toggleSubMenu(item.id);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      mb: 0.25,
                      minHeight: 42,
                      px: sidebarCollapsed ? 1.5 : 2,
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      position: 'relative',
                      transition: 'all 0.2s',
                      '&.Mui-selected': {
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                        color: 'primary.main',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: 3,
                          borderRadius: '0 4px 4px 0',
                          bgcolor: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                        },
                      },
                      '&:hover': {
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarCollapsed ? 0 : 36,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    {!sidebarCollapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isActive ? 600 : 500,
                          noWrap: true,
                        }}
                      />
                    )}
                    {hasChildren && !sidebarCollapsed && (
                      isOpen ? <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 8,
                          pointerEvents: 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </ListItemButton>
                );

                return sidebarCollapsed ? (
                  <Tooltip key={item.id} title={item.label} placement="right" arrow>
                    {button}
                  </Tooltip>
                ) : (
                  <Box key={item.id}>
                    {button}
                    {hasChildren && (
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.children!.map((child) => {
                            const ChildIcon = iconMap[child.icon] || Dashboard;
                            const isChildActive = location.pathname === child.path;
                            return (
                              <ListItemButton
                                key={child.id}
                                onClick={() => navigate(child.path)}
                                selected={isChildActive}
                                sx={{
                                  borderRadius: 2,
                                  mb: 0.25,
                                  minHeight: 40,
                                  pl: 4,
                                  pr: 2,
                                  position: 'relative',
                                  transition: 'all 0.2s',
                                  '&.Mui-selected': {
                                    bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                                    color: 'primary.main',
                                    '&:hover': {
                                      bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                                    },
                                  },
                                  '&:hover': {
                                    bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 32,
                                    color: isChildActive ? 'primary.main' : 'text.secondary',
                                  }}
                                >
                                  <ChildIcon sx={{ fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={child.label}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: isChildActive ? 600 : 500,
                                    fontSize: '0.8125rem',
                                    noWrap: true,
                                  }}
                                />
                                {isChildActive && (
                                  <motion.div
                                    layoutId="activeNavChild"
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      borderRadius: 8,
                                      pointerEvents: 'none',
                                      border: '1px solid',
                                      borderColor: 'currentColor',
                                      opacity: 0.2
                                    }}
                                  />
                                )}
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Collapse toggle at bottom */}
      {sidebarCollapsed && (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <IconButton
            onClick={toggleSidebarCollapse}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
}
