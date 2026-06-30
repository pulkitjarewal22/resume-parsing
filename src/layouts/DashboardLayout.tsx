import { Outlet, useLocation } from 'react-router-dom';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { NAV_GROUPS } from '../constants';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export function DashboardLayout() {
  const location = useLocation();

  // Build breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentNavItem = NAV_GROUPS
    .flatMap((g) => g.items)
    .find((item) => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '16px',
          mt: '68px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: `calc(100vh - 68px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Breadcrumbs */}
        {pathSegments.length > 0 && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16 }} />} sx={{ fontSize: '0.8rem' }}>
              <Link
                underline="hover"
                color="text.secondary"
                href="/"
                sx={{ fontSize: 'inherit', fontWeight: 500 }}
              >
                Dashboard
              </Link>
              <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 600 }}>
                {currentNavItem?.label || pathSegments[pathSegments.length - 1]}
              </Typography>
            </Breadcrumbs>
          </Box>
        )}

        {/* Page Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
}
