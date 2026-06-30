import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Environment, ThemeMode, Notification, SystemHealth } from '../types';

// --- App Store ---
interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  environment: Environment;
  themeMode: ThemeMode;
  notifications: Notification[];
  systemHealth: SystemHealth;

  globalSearchQuery: string;

  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setEnvironment: (env: Environment) => void;
  setThemeMode: (mode: ThemeMode) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setSystemHealth: (health: SystemHealth) => void;
  setGlobalSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      environment: 'dev',
      themeMode: 'dark',
      globalSearchQuery: '',

      notifications: [
        {
          id: '1',
          title: 'OCR Processing Complete',
          message: 'Batch #1247 processed 156 resumes successfully',
          type: 'success',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          read: false,
        },
        {
          id: '2',
          title: 'Matching Engine Alert',
          message: 'High match rate detected for Senior Engineer roles',
          type: 'info',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          read: false,
        },
        {
          id: '3',
          title: 'Service Degradation',
          message: 'RunPod API latency increased by 23%',
          type: 'warning',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          read: false,
        },
      ],
      systemHealth: {
        status: 'healthy',
        uptime: 99.97,
        services: [
          { name: 'OCR Service', status: 'up', latency: 45, lastCheck: new Date().toISOString() },
          { name: 'Parsing Engine', status: 'up', latency: 32, lastCheck: new Date().toISOString() },
          { name: 'Matching Service', status: 'up', latency: 67, lastCheck: new Date().toISOString() },
          { name: 'AI Search', status: 'up', latency: 120, lastCheck: new Date().toISOString() },
          { name: 'RunPod API', status: 'degraded', latency: 234, lastCheck: new Date().toISOString() },
        ],
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setEnvironment: (environment) => set({ environment }),
      setThemeMode: (themeMode) => set({ themeMode }),
      addNotification: (notification) =>
        set((s) => ({ notifications: [notification, ...s.notifications] })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      clearNotifications: () => set({ notifications: [] }),
      setSystemHealth: (systemHealth) => set({ systemHealth }),
      setGlobalSearchQuery: (globalSearchQuery) => set({ globalSearchQuery }),
    }),
    {
      name: 'resumeiq-app-store',
      partialize: (state) => ({
        themeMode: state.themeMode,
        environment: state.environment,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
