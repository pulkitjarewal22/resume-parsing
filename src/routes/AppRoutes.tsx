import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ObservabilityPage } from '../pages/Observability/ObservabilityPage';

// Only the active routes - everything points to Observability for now
const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ObservabilityPage /> },
      { path: 'logs', element: <ObservabilityPage /> },
      { path: 'runpod-logs', element: <ObservabilityPage /> },
      { path: 'error-logs', element: <ObservabilityPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
