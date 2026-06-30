import type {
  KPICard, ActivityItem, SearchResult, OCRResult, ParsedResume,
  MatchResult, RunPodLog, ErrorLog, AISearchMessage, SavedPrompt,
  ChartDataPoint, BulkParseJob, SavedSearch, RunPodMetrics, ErrorMetrics,
} from '../types';

// --- Dashboard KPIs ---
export const mockKPIs: KPICard[] = [
  { id: '1', title: 'Total Resumes', value: '24,856', change: 12.5, changeLabel: 'vs last month', icon: 'Description', color: '#6366f1' },
  { id: '2', title: 'OCR Requests', value: '8,432', change: 8.3, changeLabel: 'vs last month', icon: 'DocumentScanner', color: '#ec4899' },
  { id: '3', title: 'Matches Found', value: '3,217', change: -2.1, changeLabel: 'vs last month', icon: 'CompareArrows', color: '#10b981' },
  { id: '4', title: 'Active Jobs', value: '156', change: 15.7, changeLabel: 'vs last month', icon: 'WorkOutlined', color: '#f59e0b' },
  { id: '5', title: 'Failed Requests', value: '23', change: -45.2, changeLabel: 'vs last month', icon: 'ErrorOutlined', color: '#ef4444' },
  { id: '6', title: 'AI Searches', value: '1,892', change: 34.6, changeLabel: 'vs last month', icon: 'Psychology', color: '#8b5cf6' },
];

// --- Chart Data ---
export const processingTrends: ChartDataPoint[] = [
  { name: 'Mon', resumes: 420, ocr: 280, matches: 150 },
  { name: 'Tue', resumes: 380, ocr: 310, matches: 180 },
  { name: 'Wed', resumes: 520, ocr: 350, matches: 220 },
  { name: 'Thu', resumes: 490, ocr: 290, matches: 195 },
  { name: 'Fri', resumes: 610, ocr: 420, matches: 280 },
  { name: 'Sat', resumes: 230, ocr: 150, matches: 90 },
  { name: 'Sun', resumes: 180, ocr: 110, matches: 65 },
];

export const matchDistribution: ChartDataPoint[] = [
  { name: '90-100%', value: 145 },
  { name: '80-89%', value: 312 },
  { name: '70-79%', value: 478 },
  { name: '60-69%', value: 267 },
  { name: '50-59%', value: 189 },
  { name: '<50%', value: 96 },
];

export const ocrSuccessRate: ChartDataPoint[] = [
  { name: 'Jan', success: 95.2, failure: 4.8 },
  { name: 'Feb', success: 96.1, failure: 3.9 },
  { name: 'Mar', success: 94.8, failure: 5.2 },
  { name: 'Apr', success: 97.3, failure: 2.7 },
  { name: 'May', success: 98.1, failure: 1.9 },
  { name: 'Jun', success: 97.8, failure: 2.2 },
];

export const errorTrends: ChartDataPoint[] = [
  { name: 'Mon', critical: 2, high: 5, medium: 12, low: 23 },
  { name: 'Tue', critical: 1, high: 3, medium: 8, low: 19 },
  { name: 'Wed', critical: 0, high: 4, medium: 15, low: 28 },
  { name: 'Thu', critical: 3, high: 7, medium: 10, low: 16 },
  { name: 'Fri', critical: 1, high: 2, medium: 9, low: 21 },
  { name: 'Sat', critical: 0, high: 1, medium: 4, low: 8 },
  { name: 'Sun', critical: 0, high: 0, medium: 3, low: 6 },
];

// --- Activity Feed ---
export const mockActivities: ActivityItem[] = [
  { id: '1', type: 'resume_parsed', title: 'Resume Parsed', description: 'John Doe - Senior React Developer resume parsed successfully', timestamp: new Date(Date.now() - 120000).toISOString(), status: 'success', user: 'System' },
  { id: '2', type: 'match_found', title: 'High Match Found', description: '92% match: Sarah Chen → Full Stack Engineer at TechCorp', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success', user: 'Matching Engine' },
  { id: '3', type: 'ocr_completed', title: 'OCR Batch Complete', description: 'Batch #1247 - 156 documents processed (98.2% success)', timestamp: new Date(Date.now() - 480000).toISOString(), status: 'success', user: 'OCR Service' },
  { id: '4', type: 'error', title: 'Parse Failure', description: 'Failed to parse resume_corrupt.pdf - Invalid format detected', timestamp: new Date(Date.now() - 720000).toISOString(), status: 'error', user: 'Parser' },
  { id: '5', type: 'ai_search', title: 'AI Search Completed', description: '"Find senior engineers with ML experience in Bay Area"', timestamp: new Date(Date.now() - 960000).toISOString(), status: 'info', user: 'Alex Johnson' },
  { id: '6', type: 'jd_created', title: 'JD Generated', description: 'New JD created: Senior ML Engineer - AI Research Division', timestamp: new Date(Date.now() - 1200000).toISOString(), status: 'info', user: 'Alex Johnson' },
  { id: '7', type: 'match_found', title: 'Bulk Matching Complete', description: '45 candidates matched against 12 job descriptions', timestamp: new Date(Date.now() - 1500000).toISOString(), status: 'success', user: 'Matching Engine' },
  { id: '8', type: 'error', title: 'RunPod Timeout', description: 'Request rp-8842 timed out after 30s on endpoint /parse', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'warning', user: 'RunPod' },
];

// --- Search Results ---
export const mockSearchResults: SearchResult[] = Array.from({ length: 50 }, (_, i) => ({
  id: `sr-${i + 1}`,
  candidateName: [
    'Priya Sharma', 'James Wilson', 'Sarah Chen', 'Mohammed Ali', 'Emily Davis',
    'Raj Patel', 'Lisa Anderson', 'David Kim', 'Anna Kowalski', 'Chen Wei',
    'Maria Garcia', 'Alex Thompson', 'Yuki Tanaka', 'Olga Ivanova', 'Chris Lee',
  ][i % 15],
  score: Math.round((70 + Math.random() * 30) * 10) / 10,
  experience: Math.floor(2 + Math.random() * 15),
  skills: [
    ['React', 'TypeScript', 'Node.js', 'AWS'],
    ['Python', 'Django', 'PostgreSQL', 'Docker'],
    ['Java', 'Spring Boot', 'Kubernetes', 'GCP'],
    ['Go', 'gRPC', 'MongoDB', 'Terraform'],
    ['Rust', 'WebAssembly', 'Redis', 'Linux'],
  ][i % 5],
  location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Bangalore, IN', 'London, UK', 'Toronto, CA', 'Berlin, DE'][i % 8],
  status: (['active', 'shortlisted', 'active', 'inactive', 'active'] as const)[i % 5],
  lastUpdated: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  email: `candidate${i + 1}@email.com`,
  phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
  currentRole: ['Senior Engineer', 'Staff Engineer', 'Tech Lead', 'Principal Architect', 'Engineering Manager'][i % 5],
  company: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Stripe', 'Airbnb'][i % 8],
}));

export const mockSavedSearches: SavedSearch[] = [
  { id: '1', name: 'Senior React Developers', query: 'React TypeScript 5+ years', filters: { skills: ['React', 'TypeScript'], experienceMin: 5 }, createdAt: '2026-06-15T10:00:00Z', resultCount: 234 },
  { id: '2', name: 'ML Engineers Bay Area', query: 'Machine Learning Python Bay Area', filters: { skills: ['Python', 'ML'], location: 'San Francisco' }, createdAt: '2026-06-20T14:30:00Z', resultCount: 89 },
  { id: '3', name: 'Full Stack with Cloud', query: 'Full Stack AWS GCP', filters: { skills: ['AWS', 'GCP'], experienceMin: 3 }, createdAt: '2026-06-25T09:15:00Z', resultCount: 156 },
];

// --- OCR Result ---
export const mockOCRResult: OCRResult = {
  id: 'ocr-001',
  fileName: 'resume_john_doe.pdf',
  fileType: 'pdf',
  status: 'completed',
  extractedText: `JOHN DOE
Senior Software Engineer

Contact: john.doe@email.com | +1-555-0123 | San Francisco, CA
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years of expertise in building scalable web applications.
Proficient in React, TypeScript, Node.js, and cloud technologies. Strong track record of leading
cross-functional teams and delivering high-impact products.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL
Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, FastAPI, GraphQL, REST APIs
Cloud & DevOps: AWS (Lambda, ECS, S3), Docker, Kubernetes, CI/CD
Databases: PostgreSQL, MongoDB, Redis, DynamoDB
Tools: Git, Jira, Figma, Datadog, New Relic

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | Jan 2022 - Present
• Led development of microservices architecture serving 2M+ daily active users
• Reduced API response time by 40% through optimization and caching strategies
• Mentored 5 junior developers and conducted technical interviews

Software Engineer | StartupXYZ | Mar 2019 - Dec 2021
• Built real-time collaboration features using WebSocket and React
• Implemented automated testing pipeline achieving 95% code coverage
• Contributed to open-source projects with 500+ GitHub stars

EDUCATION
M.S. Computer Science | Stanford University | 2019
B.S. Computer Science | UC Berkeley | 2017`,
  rawJson: {
    pages: 1,
    blocks: [
      { type: 'header', text: 'JOHN DOE', confidence: 0.99 },
      { type: 'subheader', text: 'Senior Software Engineer', confidence: 0.98 },
      { type: 'section', text: 'PROFESSIONAL SUMMARY', confidence: 0.97 },
      { type: 'section', text: 'TECHNICAL SKILLS', confidence: 0.98 },
      { type: 'section', text: 'EXPERIENCE', confidence: 0.99 },
      { type: 'section', text: 'EDUCATION', confidence: 0.97 },
    ],
  },
  metadata: {
    confidenceScore: 97.8,
    processingTime: 2.34,
    pageCount: 1,
    languageDetection: 'en',
    ocrVersion: '3.2.1',
    fileSize: 245760,
  },
  createdAt: new Date().toISOString(),
};

// --- Parsed Resume ---
export const mockParsedResume: ParsedResume = {
  id: 'pr-001',
  candidateSummary: 'Experienced software engineer with 8+ years of expertise in building scalable web applications. Proficient in React, TypeScript, Node.js, and cloud technologies.',
  contactDetails: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  },
  skills: [
    { category: 'Programming Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'], proficiency: 'expert' },
    { category: 'Frontend', skills: ['React', 'Next.js', 'Vue.js', 'HTML5', 'CSS3'], proficiency: 'expert' },
    { category: 'Backend', skills: ['Node.js', 'Express', 'FastAPI', 'GraphQL'], proficiency: 'advanced' },
    { category: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], proficiency: 'advanced' },
    { category: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB'], proficiency: 'advanced' },
  ],
  experience: [
    {
      id: 'exp-1', company: 'TechCorp Inc.', role: 'Senior Software Engineer',
      startDate: '2022-01-01', endDate: 'Present', duration: '4 years 6 months',
      description: 'Led development of microservices architecture serving 2M+ daily active users. Reduced API response time by 40%.',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Kubernetes'], current: true,
    },
    {
      id: 'exp-2', company: 'StartupXYZ', role: 'Software Engineer',
      startDate: '2019-03-01', endDate: '2021-12-31', duration: '2 years 10 months',
      description: 'Built real-time collaboration features using WebSocket and React. Implemented automated testing pipeline.',
      skills: ['React', 'WebSocket', 'Python', 'Docker'], current: false,
    },
  ],
  education: [
    { id: 'edu-1', institution: 'Stanford University', degree: 'M.S.', field: 'Computer Science', startDate: '2017', endDate: '2019', gpa: '3.9' },
    { id: 'edu-2', institution: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science', startDate: '2013', endDate: '2017', gpa: '3.7' },
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2023-06', credentialId: 'AWS-SAP-12345' },
    { id: 'cert-2', name: 'Google Cloud Professional Data Engineer', issuer: 'Google Cloud', date: '2022-11', credentialId: 'GCP-PDE-67890' },
  ],
  projects: [
    { id: 'proj-1', name: 'Real-time Analytics Dashboard', description: 'Built a real-time analytics platform processing 10M events/day', technologies: ['React', 'D3.js', 'Kafka', 'ClickHouse'], startDate: '2023-01', endDate: '2023-06' },
    { id: 'proj-2', name: 'Open Source CLI Tool', description: 'Developer productivity CLI with 500+ GitHub stars', technologies: ['Go', 'Cobra', 'Docker'], url: 'github.com/johndoe/cli-tool', startDate: '2022-06', endDate: '2022-12' },
  ],
  rawJson: {},
};

// --- Matching Results ---
export const mockMatchResult: MatchResult = {
  id: 'match-001',
  type: 'candidate-jd',
  overallScore: 87,
  skillScore: 92,
  experienceScore: 85,
  educationScore: 88,
  keywordScore: 78,
  missingSkills: ['Terraform', 'Apache Spark', 'Scala'],
  recommendations: [
    'Strong match for the role based on technical skills and experience level',
    'Candidate exceeds the minimum experience requirement by 3 years',
    'Consider supplementary training for missing cloud infrastructure skills',
    'Leadership experience aligns well with team lead expectations',
  ],
  similarityAnalysis: [
    { category: 'Technical Skills', score: 92, details: '18/20 required skills matched' },
    { category: 'Experience Level', score: 85, details: '8 years vs 5 years required' },
    { category: 'Education', score: 88, details: "M.S. from top-tier university matches requirement" },
    { category: 'Domain Knowledge', score: 80, details: 'Strong web/cloud experience, limited ML exposure' },
    { category: 'Leadership', score: 90, details: 'Team mentoring and cross-functional collaboration' },
  ],
  gapAnalysis: [
    { category: 'Infrastructure', gap: 'No Terraform/IaC experience', severity: 'medium', recommendation: 'Provide Terraform training or pair with DevOps engineer' },
    { category: 'Big Data', gap: 'Limited Apache Spark experience', severity: 'low', recommendation: 'Not critical for role; can be learned on the job' },
    { category: 'Certifications', gap: 'No Kubernetes certification', severity: 'low', recommendation: 'Has practical K8s experience; certification not mandatory' },
  ],
  source: { name: 'John Doe', id: 'candidate-001' },
  target: { name: 'Senior Full Stack Engineer - TechCorp', id: 'jd-001' },
};

// --- RunPod Logs ---
export const mockRunPodLogs: RunPodLog[] = Array.from({ length: 30 }, (_, i) => ({
  id: `rp-${1000 + i}`,
  requestId: `req-${String(Math.random()).slice(2, 10)}`,
  timestamp: new Date(Date.now() - i * 300000).toISOString(),
  endpoint: ['/parse', '/ocr', '/match', '/ai-search', '/jd-generate'][i % 5],
  method: (['POST', 'POST', 'POST', 'POST', 'POST'] as const)[i % 5],
  duration: Math.round(100 + Math.random() * 5000),
  status: (i % 7 === 0 ? 'error' : i % 11 === 0 ? 'timeout' : 'success') as 'success' | 'error' | 'timeout',
  statusCode: i % 7 === 0 ? 500 : i % 11 === 0 ? 408 : 200,
  payload: { input: { type: 'resume', format: 'pdf' }, model: 'v3.2' },
  response: i % 7 === 0 ? { error: 'Internal Server Error' } : { result: 'processed', id: `res-${i}` },
}));

export const mockRunPodMetrics: RunPodMetrics = {
  totalRequests: 12453,
  successRate: 97.2,
  failureRate: 2.8,
  avgProcessingTime: 1234,
  p95ProcessingTime: 3456,
  activeEndpoints: 5,
};

// --- Error Logs ---
export const mockErrorLogs: ErrorLog[] = Array.from({ length: 25 }, (_, i) => ({
  id: `err-${1000 + i}`,
  timestamp: new Date(Date.now() - i * 600000).toISOString(),
  service: ['OCR Service', 'Parsing Engine', 'Matching Service', 'AI Search', 'RunPod API', 'Gateway'][i % 6],
  code: [`E${1000 + i}`, 'TIMEOUT', 'PARSE_ERROR', 'OOM', 'RATE_LIMIT', 'AUTH_FAIL'][i % 6],
  message: [
    'OCR engine failed to process corrupted PDF file',
    'Request timeout after 30000ms on /parse endpoint',
    'Unable to extract skills section from resume format',
    'Out of memory during large batch processing',
    'API rate limit exceeded (100 req/min)',
    'Invalid authentication token provided',
  ][i % 6],
  severity: (['low', 'medium', 'high', 'critical', 'medium', 'high'] as const)[i % 6],
  environment: (['prod', 'prod', 'qa', 'prod', 'dev', 'uat'] as const)[i % 6],
  status: (['open', 'investigating', 'resolved', 'open', 'resolved', 'ignored'] as const)[i % 6],
  stackTrace: `Error: ${['OCR processing failed', 'Timeout', 'Parse error'][i % 3]}
    at processDocument (services/ocr.ts:${45 + i}:${12 + i})
    at async handler (routes/ocr.ts:${23 + i}:${8 + i})
    at async Server.handle (server.ts:${156 + i}:${5 + i})`,
  requestPayload: { documentId: `doc-${i}`, type: 'resume', format: 'pdf' },
  requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ***' },
  queryParams: { env: 'prod', version: 'v3' },
  responseBody: { error: true, code: `E${1000 + i}` },
  statusCode: [500, 408, 422, 503, 429, 401][i % 6],
}));

export const mockErrorMetrics: ErrorMetrics = {
  totalErrors: 247,
  criticalErrors: 12,
  resolvedErrors: 198,
  openErrors: 37,
  errorTrend: errorTrends,
  failingServices: [
    { service: 'OCR Service', count: 45, trend: -12 },
    { service: 'RunPod API', count: 38, trend: 23 },
    { service: 'Parsing Engine', count: 22, trend: -5 },
    { service: 'AI Search', count: 15, trend: 8 },
  ],
};

// --- AI Search Messages ---
export const mockAIMessages: AISearchMessage[] = [
  {
    id: 'ai-1',
    role: 'user',
    content: 'Find senior React developers with TypeScript experience in the Bay Area who have worked at FAANG companies',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'ai-2',
    role: 'assistant',
    content: `## Search Results

I found **23 candidates** matching your criteria. Here are the top matches:

### Top Candidates

| Rank | Name | Match Score | Experience | Current Company |
|------|------|-------------|------------|-----------------|
| 1 | **Sarah Chen** | 96.5% | 8 years | Meta |
| 2 | **David Kim** | 94.2% | 6 years | Google |
| 3 | **Priya Sharma** | 91.8% | 7 years | Apple |
| 4 | **James Wilson** | 89.3% | 5 years | Netflix |

### Key Insights
- **Average experience**: 6.8 years
- **Most common skills**: React (100%), TypeScript (100%), Node.js (87%), GraphQL (65%)
- **Location distribution**: San Francisco (52%), San Jose (26%), Oakland (22%)

### Recommendations
1. Sarah Chen is an exceptionally strong match with leadership experience
2. Consider expanding search to include Palo Alto for 15% more candidates
3. 78% of matched candidates are currently employed - competitive offers needed

*Would you like me to generate detailed profiles or schedule outreach?*`,
    timestamp: new Date(Date.now() - 30000).toISOString(),
    metadata: {
      confidenceScore: 94.5,
      executionTime: 2.34,
      tokenUsage: { prompt: 245, completion: 1823, total: 2068 },
      model: 'GPT-4-Turbo',
      citations: ['Resume Database', 'LinkedIn Integration', 'Job Market Data'],
    },
  },
];

export const mockSavedPrompts: SavedPrompt[] = [
  { id: '1', name: 'FAANG Engineers', prompt: 'Find engineers from FAANG companies with 5+ years experience', category: 'Sourcing', createdAt: '2026-06-15T10:00:00Z' },
  { id: '2', name: 'ML Pipeline Experts', prompt: 'Search for ML engineers experienced in building production pipelines', category: 'Technical', createdAt: '2026-06-18T14:30:00Z' },
  { id: '3', name: 'Diversity Candidates', prompt: 'Find diverse candidates for senior engineering roles in fintech', category: 'DEI', createdAt: '2026-06-22T09:00:00Z' },
];

export const suggestedPrompts = [
  'Find senior engineers with cloud architecture experience',
  'Compare top 10 candidates for the ML Engineer position',
  'Analyze skill gaps in our current engineering team',
  'Suggest interview questions for a React developer role',
  'Generate a market analysis for DevOps salaries in NYC',
];

// --- Bulk Parse Jobs ---
export const mockBulkJobs: BulkParseJob[] = [
  { id: 'bj-1', fileName: 'batch_resumes_q2.zip', status: 'completed', progress: 100, startedAt: '2026-06-28T10:00:00Z', completedAt: '2026-06-28T10:15:00Z' },
  { id: 'bj-2', fileName: 'engineering_candidates.zip', status: 'processing', progress: 67, startedAt: '2026-06-29T09:00:00Z' },
  { id: 'bj-3', fileName: 'marketing_resumes.zip', status: 'queued', progress: 0 },
  { id: 'bj-4', fileName: 'intern_applications.zip', status: 'failed', progress: 45, startedAt: '2026-06-29T08:30:00Z', error: 'Invalid file format in archive' },
  { id: 'bj-5', fileName: 'senior_developers.zip', status: 'completed', progress: 100, startedAt: '2026-06-27T14:00:00Z', completedAt: '2026-06-27T14:22:00Z' },
];
