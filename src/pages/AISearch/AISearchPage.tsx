import { useState, useRef, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, IconButton, Chip, Grid, Divider, alpha,
  Paper, InputAdornment, List, ListItemButton, ListItemText, ListItemIcon,
  Drawer, Avatar, Tooltip,
} from '@mui/material';
import {
  Send, Psychology, ContentCopy, Bookmark, BookmarkBorder, History,
  Speed, Token, Timer, AutoAwesome, Close, Lightbulb,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mockAIMessages, mockSavedPrompts, suggestedPrompts } from '../../mocks/data';
import { formatRelativeTime, copyToClipboard } from '../../utils';
import type { AISearchMessage } from '../../types';

export function AISearchPage() {
  const [messages, setMessages] = useState<AISearchMessage[]>(mockAIMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AISearchMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: AISearchMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `## Analysis Results\n\nBased on your query: "${input}"\n\nI found **${Math.floor(10 + Math.random() * 50)}** relevant candidates matching your criteria.\n\n### Key Findings\n- **Top match score**: ${(85 + Math.random() * 15).toFixed(1)}%\n- **Average experience**: ${(4 + Math.random() * 8).toFixed(1)} years\n- **Location spread**: 5 cities\n\n### Recommended Actions\n1. Review the top 5 candidate profiles\n2. Schedule interviews for 90%+ matches\n3. Consider expanding skill requirements for broader reach\n\n\`\`\`json\n{\n  "query": "${input}",\n  "totalResults": ${Math.floor(10 + Math.random() * 50)},\n  "processingTime": "${(0.5 + Math.random() * 3).toFixed(2)}s"\n}\n\`\`\`\n\n> *Would you like me to generate detailed profiles for the top candidates?*`,
        timestamp: new Date().toISOString(),
        metadata: {
          confidenceScore: Math.round(85 + Math.random() * 15),
          executionTime: +(0.5 + Math.random() * 3).toFixed(2),
          tokenUsage: { prompt: Math.floor(100 + Math.random() * 300), completion: Math.floor(500 + Math.random() * 2000), total: 0 },
          model: 'GPT-4-Turbo',
          citations: ['Resume Database', 'Job Market Analytics'],
        },
      };
      aiMessage.metadata!.tokenUsage.total = aiMessage.metadata!.tokenUsage.prompt + aiMessage.metadata!.tokenUsage.completion;
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleCopy = async (content: string, id: string) => {
    await copyToClipboard(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>AI Search</Typography>
            <Typography variant="body2" color="text.secondary">
              Natural language talent search powered by AI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Saved Prompts & History">
              <IconButton onClick={() => setSidebarOpen(true)}>
                <History />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {suggestedPrompts.map((prompt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Chip
                icon={<Lightbulb sx={{ fontSize: '16px !important' }} />}
                label={prompt}
                onClick={() => setInput(prompt)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.1) },
                }}
                variant="outlined"
              />
            </motion.div>
          ))}
        </Box>
      )}

      {/* Chat Messages */}
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: msg.role === 'user' ? 'primary.main' : (t) => alpha(t.palette.secondary.main, 0.15),
                      color: msg.role === 'user' ? 'primary.contrastText' : 'secondary.main',
                      flexShrink: 0,
                    }}
                  >
                    {msg.role === 'user' ? 'AJ' : <Psychology sx={{ fontSize: 20 }} />}
                  </Avatar>

                  <Box sx={{ maxWidth: '75%', minWidth: 0 }}>
                    <Paper
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: msg.role === 'user'
                          ? 'primary.main'
                          : (t) => alpha(t.palette.text.primary, 0.04),
                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                        position: 'relative',
                      }}
                    >
                      {msg.role === 'user' ? (
                        <Typography variant="body2">{msg.content}</Typography>
                      ) : (
                        <Box
                          sx={{
                            '& h2': { fontSize: '1.1rem', fontWeight: 700, mt: 1.5, mb: 1 },
                            '& h3': { fontSize: '0.95rem', fontWeight: 700, mt: 1, mb: 0.5 },
                            '& p': { fontSize: '0.85rem', mb: 1 },
                            '& ul, & ol': { pl: 2, mb: 1 },
                            '& li': { fontSize: '0.85rem', mb: 0.3 },
                            '& table': { width: '100%', borderCollapse: 'collapse', mb: 1 },
                            '& th, & td': {
                              border: '1px solid',
                              borderColor: 'divider',
                              p: 1,
                              fontSize: '0.8rem',
                              textAlign: 'left',
                            },
                            '& th': { fontWeight: 700, bgcolor: (t) => alpha(t.palette.primary.main, 0.05) },
                            '& code': {
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '0.78rem',
                              bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
                              px: 0.5,
                              py: 0.25,
                              borderRadius: 0.5,
                            },
                            '& pre': {
                              bgcolor: (t) => t.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                              p: 2,
                              borderRadius: 2,
                              overflow: 'auto',
                              mb: 1,
                              '& code': { bgcolor: 'transparent', p: 0 },
                            },
                            '& blockquote': {
                              borderLeft: '3px solid',
                              borderColor: 'primary.main',
                              pl: 2,
                              ml: 0,
                              fontStyle: 'italic',
                              color: 'text.secondary',
                            },
                            '& strong': { fontWeight: 700 },
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </Box>
                      )}

                      {/* Copy button for assistant */}
                      {msg.role === 'assistant' && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                          <Tooltip title={copiedId === msg.id ? 'Copied!' : 'Copy response'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(msg.content, msg.id)}
                            >
                              <ContentCopy sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Save prompt">
                            <IconButton size="small">
                              <BookmarkBorder sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Paper>

                    {/* Metadata for AI responses */}
                    {msg.metadata && (
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<Speed sx={{ fontSize: '14px !important' }} />}
                          label={`${msg.metadata.confidenceScore}% confidence`}
                          size="small"
                          sx={{ height: 22, fontSize: '0.68rem' }}
                          variant="outlined"
                        />
                        <Chip
                          icon={<Timer sx={{ fontSize: '14px !important' }} />}
                          label={`${msg.metadata.executionTime}s`}
                          size="small"
                          sx={{ height: 22, fontSize: '0.68rem' }}
                          variant="outlined"
                        />
                        <Chip
                          icon={<Token sx={{ fontSize: '14px !important' }} />}
                          label={`${msg.metadata.tokenUsage.total} tokens`}
                          size="small"
                          sx={{ height: 22, fontSize: '0.68rem' }}
                          variant="outlined"
                        />
                        <Chip
                          label={msg.metadata.model}
                          size="small"
                          sx={{ height: 22, fontSize: '0.68rem' }}
                          variant="outlined"
                        />
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatRelativeTime(msg.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: (t) => alpha(t.palette.secondary.main, 0.15), color: 'secondary.main' }}>
                  <Psychology sx={{ fontSize: 20 }} />
                </Avatar>
                <Paper sx={{ p: 2, borderRadius: 3, bgcolor: (t) => alpha(t.palette.text.primary, 0.04) }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.secondary', opacity: 0.5 }} />
                      </motion.div>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Ask anything about your talent pipeline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Card>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 360 }, p: 3, borderRadius: '16px 0 0 16px' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>Saved Prompts</Typography>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {mockSavedPrompts.map((sp) => (
            <ListItemButton
              key={sp.id}
              onClick={() => { setInput(sp.prompt); setSidebarOpen(false); }}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Bookmark sx={{ fontSize: 18, color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" fontWeight={600}>{sp.name}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {sp.prompt}
                  </Typography>
                }
              />
              <Chip label={sp.category} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
