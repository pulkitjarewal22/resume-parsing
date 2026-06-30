// ============================================================
// Enterprise Resume Intelligence Platform - Type Definitions
// ============================================================

// --- Navigation Types ---
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

// --- Environment ---
export type Environment = 'dev' | 'qa' | 'uat' | 'prod';

// --- Theme ---
export type ThemeMode = 'light' | 'dark';

// --- KPI & Dashboard ---
export interface KPICard {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ActivityItem {
  id: string;
  type: 'resume_parsed' | 'ocr_completed' | 'match_found' | 'error' | 'ai_search' | 'jd_created';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

// --- Search ---
export interface SearchFilters {
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  location: string;
  education: string;
  warningType: string;
  severity: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
}

export interface SearchResult {
  id: string;
  candidateName: string;
  score: number;
  experience: number;
  skills: string[];
  location: string;
  status: 'active' | 'inactive' | 'shortlisted' | 'rejected';
  lastUpdated: string;
  email: string;
  phone: string;
  currentRole: string;
  company: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Partial<SearchFilters>;
  createdAt: string;
  resultCount: number;
}

// --- OCR ---
export type OCRFileType = 'pdf' | 'doc' | 'docx' | 'jpg' | 'jpeg' | 'png' | 'tiff';

export type OCRStatus = 'uploading' | 'processing' | 'ocr' | 'validation' | 'completed' | 'failed';

export interface OCRResult {
  id: string;
  fileName: string;
  fileType: OCRFileType;
  status: OCRStatus;
  extractedText: string;
  rawJson: Record<string, unknown>;
  metadata: OCRMetadata;
  createdAt: string;
}

export interface OCRMetadata {
  confidenceScore: number;
  processingTime: number;
  pageCount: number;
  languageDetection: string;
  ocrVersion: string;
  fileSize: number;
}

// --- Parsing ---
export interface ParsedResume {
  id: string;
  candidateSummary: string;
  contactDetails: ContactDetails;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  rawJson: Record<string, unknown>;
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  skills: string[];
  current: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate: string;
}

// --- Bulk Parsing ---
export interface BulkParseJob {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface BulkParseMetrics {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  queued: number;
  avgProcessingTime: number;
}

// --- JD Parsing ---
export interface ParsedJD {
  id: string;
  title: string;
  skills: string[];
  experienceRequired: string;
  education: string;
  responsibilities: string[];
  keywords: string[];
  rawJson: Record<string, unknown>;
}

// --- Matching ---
export type MatchType = 'candidate-jd' | 'jd-candidate' | 'candidate-candidate' | 'jd-jd';

export interface MatchResult {
  id: string;
  type: MatchType;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  keywordScore: number;
  missingSkills: string[];
  recommendations: string[];
  similarityAnalysis: SimilarityItem[];
  gapAnalysis: GapItem[];
  source: { name: string; id: string };
  target: { name: string; id: string };
}

export interface SimilarityItem {
  category: string;
  score: number;
  details: string;
}

export interface GapItem {
  category: string;
  gap: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

// --- Boolean Query ---
export type BooleanOperator = 'AND' | 'OR' | 'NOT' | 'NEAR' | 'IN' | 'EXISTS';

export interface QueryNode {
  id: string;
  type: 'operator' | 'field' | 'value';
  operator?: BooleanOperator;
  field?: string;
  value?: string;
  children?: QueryNode[];
}

// --- AI Search ---
export interface AISearchMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: AISearchMetadata;
}

export interface AISearchMetadata {
  confidenceScore: number;
  executionTime: number;
  tokenUsage: { prompt: number; completion: number; total: number };
  model: string;
  citations?: string[];
}

export interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  category: string;
  createdAt: string;
}

// --- RunPod Logs ---
export interface RunPodLog {
  id: string;
  requestId: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  duration: number;
  status: 'success' | 'error' | 'timeout';
  statusCode: number;
  payload: Record<string, unknown>;
  response: Record<string, unknown>;
}

export interface RunPodMetrics {
  totalRequests: number;
  successRate: number;
  failureRate: number;
  avgProcessingTime: number;
  p95ProcessingTime: number;
  activeEndpoints: number;
}

// --- JD Builder ---
export interface JDFormData {
  title: string;
  department: string;
  experience: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
}

export type JDAction = 'generate' | 'improve' | 'rewrite' | 'simplify' | 'expand' | 'ats-optimize';

// --- Error Logs ---
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorStatus = 'open' | 'investigating' | 'resolved' | 'ignored';

export interface ErrorLog {
  id: string;
  timestamp: string;
  service: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  environment: Environment;
  status: ErrorStatus;
  stackTrace?: string;
  requestPayload?: Record<string, unknown>;
  requestHeaders?: Record<string, string>;
  queryParams?: Record<string, string>;
  responseBody?: Record<string, unknown>;
  statusCode?: number;
  resolutionNotes?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  criticalErrors: number;
  resolvedErrors: number;
  openErrors: number;
  errorTrend: ChartDataPoint[];
  failingServices: { service: string; count: number; trend: number }[];
}

// --- Notification ---
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

// --- System Health ---
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  latency: number;
  lastCheck: string;
}



// --- API Response ---
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
