import { useState, useMemo } from 'react';
import {
  Box, Card, Typography, TextField, Tabs, Tab, Chip, InputAdornment, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TablePagination,
  TableSortLabel, Checkbox, Button, Grid, Select, MenuItem, FormControl, InputLabel,
  Slider, Drawer, alpha, Tooltip, Avatar, LinearProgress, Autocomplete,
} from '@mui/material';
import {
  Search, FilterList, Download, Bookmark, BookmarkBorder, History, 
  TuneOutlined, Close, Visibility, Email, Phone, Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { mockSearchResults, mockSavedSearches } from '../../mocks/data';
import { formatDate, getScoreColor, exportToCSV } from '../../utils';
import type { SearchResult } from '../../types';

type SortField = 'candidateName' | 'score' | 'experience' | 'lastUpdated';
type SortDir = 'asc' | 'desc';

export function SearchPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<string[]>([]);
  const [searchHistory] = useState(['React developers in NY', 'Python ML Engineers', 'Senior architects with AWS']);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 20]);
  const [detailDrawer, setDetailDrawer] = useState<SearchResult | null>(null);

  const filteredResults = useMemo(() => {
    let results = [...mockSearchResults];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.candidateName.toLowerCase().includes(q) ||
          r.skills.some((s) => s.toLowerCase().includes(q)) ||
          r.location.toLowerCase().includes(q) ||
          r.currentRole.toLowerCase().includes(q)
      );
    }

    if (skillFilter.length > 0) {
      results = results.filter((r) => skillFilter.some((s) => r.skills.includes(s)));
    }
    if (locationFilter) {
      results = results.filter((r) => r.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (statusFilter) {
      results = results.filter((r) => r.status === statusFilter);
    }
    results = results.filter(
      (r) => r.experience >= experienceRange[0] && r.experience <= experienceRange[1]
    );

    results.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'string') return aVal.localeCompare(bVal as string) * dir;
      return ((aVal as number) - (bVal as number)) * dir;
    });

    return results;
  }, [searchQuery, skillFilter, locationFilter, statusFilter, experienceRange, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredResults.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const allSkills = [...new Set(mockSearchResults.flatMap((r) => r.skills))];

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Search</Typography>
            <Typography variant="body2" color="text.secondary">
              Search and discover talent from {mockSearchResults.length.toLocaleString()} candidate profiles
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => exportToCSV(filteredResults as unknown as Record<string, unknown>[], 'search_results')}
              disabled={filteredResults.length === 0}
            >
              Export CSV
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Search Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{ mb: 2, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 } }}
      >
        <Tab label="Free Search" icon={<Search sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Advanced Filters" icon={<TuneOutlined sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {/* Free Search */}
      {tabValue === 0 && (
        <Card sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search with natural language: e.g., 'Senior React developers with 5+ years in Bay Area'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Saved Searches */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Bookmark sx={{ fontSize: 14 }} /> Saved Searches
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {mockSavedSearches.map((s) => (
                <Chip
                  key={s.id}
                  label={`${s.name} (${s.resultCount})`}
                  size="small"
                  onClick={() => setSearchQuery(s.query)}
                  icon={<BookmarkBorder sx={{ fontSize: '14px !important' }} />}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Box>

          {/* Search History */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <History sx={{ fontSize: 14 }} /> Recent Searches
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchHistory.map((q, i) => (
                <Chip
                  key={i}
                  label={q}
                  size="small"
                  variant="outlined"
                  onClick={() => setSearchQuery(q)}
                  sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>
        </Card>
      )}

      {/* Advanced Filters */}
      {tabValue === 1 && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={allSkills}
                value={skillFilter}
                onChange={(_, v) => setSkillFilter(v)}
                renderInput={(params) => <TextField {...params} label="Skills" size="small" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                  ))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Location"
                size="small"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" gutterBottom>
                Experience Range: {experienceRange[0]} - {experienceRange[1]} years
              </Typography>
              <Slider
                value={experienceRange}
                onChange={(_, v) => setExperienceRange(v as number[])}
                min={0}
                max={20}
                valueLabelDisplay="auto"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSkillFilter([]);
                  setLocationFilter('');
                  setStatusFilter('');
                  setExperienceRange([0, 20]);
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {filteredResults.length} results found
          {selected.length > 0 && (
            <Chip label={`${selected.length} selected`} size="small" color="primary" sx={{ ml: 1 }} />
          )}
        </Typography>
        <IconButton onClick={() => setFilterOpen(!filterOpen)} color={filterOpen ? 'primary' : 'default'}>
          <FilterList />
        </IconButton>
      </Box>

      {/* Results Table */}
      <Card>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredResults.length}
                    checked={filteredResults.length > 0 && selected.length === filteredResults.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'candidateName'}
                    direction={sortField === 'candidateName' ? sortDir : 'asc'}
                    onClick={() => handleSort('candidateName')}
                  >
                    Candidate
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortField === 'score'}
                    direction={sortField === 'score' ? sortDir : 'asc'}
                    onClick={() => handleSort('score')}
                  >
                    Score
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortField === 'experience'}
                    direction={sortField === 'experience' ? sortDir : 'asc'}
                    onClick={() => handleSort('experience')}
                  >
                    Experience
                  </TableSortLabel>
                </TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'lastUpdated'}
                    direction={sortField === 'lastUpdated' ? sortDir : 'asc'}
                    onClick={() => handleSort('lastUpdated')}
                  >
                    Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((result, index) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      component={TableRow}
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => setDetailDrawer(result)}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected.includes(result.id)}
                          onChange={() => handleSelect(result.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: alpha(getScoreColor(result.score), 0.12),
                              color: getScoreColor(result.score),
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}
                          >
                            {result.candidateName.split(' ').map((n) => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {result.candidateName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {result.currentRole} @ {result.company}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 14, color: getScoreColor(result.score) }} />
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ color: getScoreColor(result.score) }}
                          >
                            {result.score}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{result.experience} yrs</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {result.skills.slice(0, 3).map((skill) => (
                            <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.68rem', height: 22 }} />
                          ))}
                          {result.skills.length > 3 && (
                            <Chip label={`+${result.skills.length - 3}`} size="small" sx={{ fontSize: '0.68rem', height: 22 }} variant="outlined" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{result.location}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={result.status} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(result.lastUpdated)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="View Profile">
                          <IconButton size="small" onClick={() => setDetailDrawer(result)}>
                            <Visibility sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        {filteredResults.length === 0 && (
          <EmptyState
            title="No candidates found"
            description="Try adjusting your search query or filters to find matching candidates."
          />
        )}

        <TablePagination
          component="div"
          count={filteredResults.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(detailDrawer)}
        onClose={() => setDetailDrawer(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3, borderRadius: '16px 0 0 16px' } }}
      >
        {detailDrawer && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>{detailDrawer.candidateName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {detailDrawer.currentRole} @ {detailDrawer.company}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailDrawer(null)}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (t) => alpha(getScoreColor(detailDrawer.score), 0.08),
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={800} sx={{ color: getScoreColor(detailDrawer.score) }}>
                  {detailDrawer.score}%
                </Typography>
                <Typography variant="caption" color="text.secondary">Match Score</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800}>{detailDrawer.experience}</Typography>
                <Typography variant="caption" color="text.secondary">Years Exp.</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Contact</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{detailDrawer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{detailDrawer.phone}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Skills</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {detailDrawer.skills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Location</Typography>
              <Typography variant="body2">{detailDrawer.location}</Typography>
            </Box>

            <StatusBadge status={detailDrawer.status} />
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
