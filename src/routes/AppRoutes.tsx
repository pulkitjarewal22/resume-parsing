import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ObservabilityPage } from '../pages/Observability/ObservabilityPage';

// All routes now funnel to the Log Observability Platform
const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ObservabilityPage /> },
      { path: 'logs',          element: <ObservabilityPage /> },
      { path: 'runpod-logs',   element: <ObservabilityPage /> },
      { path: 'error-logs',    element: <ObservabilityPage /> },
      // Redirect all legacy routes to observability
      { path: 'search',        element: <Navigate to="/" replace /> },
      { path: 'ocr',           element: <Navigate to="/" replace /> },
      { path: 'parsing/*',     element: <Navigate to="/" replace /> },
      { path: 'matching/*',    element: <Navigate to="/" replace /> },
      { path: 'boolean-query', element: <Navigate to="/" replace /> },
      { path: 'ai-search',     element: <Navigate to="/" replace /> },
      { path: 'jd-builder',    element: <Navigate to="/" replace /> },
      { path: '*',             element: <Navigate to="/" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
