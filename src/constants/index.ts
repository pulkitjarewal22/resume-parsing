import type { NavGroup, Environment } from '../types';

export const APP_NAME = 'ResumeIQ';
export const APP_TAGLINE = 'Enterprise Resume Intelligence';

export const ENVIRONMENTS: { value: Environment; label: string; color: string }[] = [
  { value: 'dev', label: 'Development', color: '#4caf50' },
  { value: 'qa', label: 'QA', color: '#ff9800' },
  { value: 'uat', label: 'UAT', color: '#2196f3' },
  { value: 'prod', label: 'Production', color: '#f44336' },
];

// Updated Navigation - ONLY showing active pages
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    items: [
      { id: 'home', label: 'Overview', path: '/', icon: 'Dashboard' },
    ],
  },
  {
    id: 'logging',
    label: 'Logging & Monitoring',
    items: [
      { id: 'logs', label: 'Application Logs', path: '/logs', icon: 'Terminal' },
      { id: 'runpod-logs', label: 'RunPod Logs', path: '/runpod-logs', icon: 'Terminal' },
      { id: 'error-logs', label: 'Error Logs', path: '/error-logs', icon: 'BugReport' },
    ],
  },
];

export const ACCEPTED_FILE_TYPES = {
  resume: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  ocr: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/tiff': ['.tiff'],
  },
};

export const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Cloud & DevOps',
  'Tools & Platforms',
  'Soft Skills',
  'Domain Knowledge',
];

export const BOOLEAN_OPERATORS = ['AND', 'OR', 'NOT', 'NEAR', 'IN', 'EXISTS'] as const;

export const JD_ACTIONS = [
  { value: 'generate', label: 'Generate', icon: 'AutoAwesome', color: '#7c3aed' },
  { value: 'improve', label: 'Improve', icon: 'TrendingUp', color: '#059669' },
  { value: 'rewrite', label: 'Rewrite', icon: 'EditNote', color: '#2563eb' },
  { value: 'simplify', label: 'Simplify', icon: 'Compress', color: '#d97706' },
  { value: 'expand', label: 'Expand', icon: 'OpenInFull', color: '#dc2626' },
  { value: 'ats-optimize', label: 'ATS Optimize', icon: 'Speed', color: '#0891b2' },
] as const;

export const ERROR_SEVERITIES = [
  { value: 'low', label: 'Low', color: '#4caf50' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'critical', label: 'Critical', color: '#9c27b0' },
] as const;

export const SERVICES = [
  'OCR Service',
  'Parsing Engine',
  'Matching Service',
  'AI Search',
  'RunPod API',
  'JD Builder',
  'Auth Service',
  'Gateway',
] as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.resumeiq.dev';

export const DRAWER_WIDTH = 280;
export const COLLAPSED_DRAWER_WIDTH = 72;
export const NAVBAR_HEIGHT = 64;
