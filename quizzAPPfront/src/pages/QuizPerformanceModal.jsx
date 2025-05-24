import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  LinearProgress,
  useTheme,
  Avatar,
  Grid,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  Score as ScoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

export default function QuizPerformanceModal({ open, onClose, quizPerformance }) {
  const theme = useTheme();

  if (!quizPerformance) return null;

  const maxPoints = quizPerformance.questions
    ? quizPerformance.questions.reduce((sum, q) => sum + (q.points || 0), 0)
    : 0;

  const scorePercentage = (quizPerformance.score / maxPoints) * 100;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 60) return 'warning.main';
    return 'error.main';
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Bon';
    return 'À améliorer';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    return '💪';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: getScoreColor(scorePercentage),
              width: 56,
              height: 56,
              boxShadow: 3
            }}
          >
            <TrophyIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Résultats du Quiz
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {quizPerformance.quizTitle}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ScoreIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Score Total
                  </Typography>
                </Box>
                <Box display="flex" alignItems="baseline" gap={1}>
                  <Typography variant="h3" fontWeight={700} color={getScoreColor(scorePercentage)}>
                    {quizPerformance.score}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    / {maxPoints}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={scorePercentage}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: getScoreColor(scorePercentage)
                      }
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography 
                    variant="subtitle2" 
                    color={getScoreColor(scorePercentage)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    {getScoreLabel(scorePercentage)} {getScoreEmoji(scorePercentage)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Date de complétion
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    {new Date(quizPerformance.completionTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <QuestionAnswerIcon color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Questions répondues
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    {quizPerformance.questions?.length || 0} questions
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestionAnswerIcon color="primary" />
          Détail des Questions
        </Typography>

        <List>
          {quizPerformance.questions?.map((question, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                mb: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <Box sx={{ width: '100%', mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Question {index + 1}
                  </Typography>
                  <Chip
                    icon={question.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                    label={question.isCorrect ? "Correct" : "Incorrect"}
                    color={question.isCorrect ? "success" : "error"}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {question.text}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUpIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Points: {question.points}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Vos réponses :
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {question.userAnswers && question.userAnswers.length > 0 ? (
                    question.userAnswers.map((answer, ansIndex) => (
                      <Box 
                        key={ansIndex} 
                        display="flex" 
                        alignItems="center" 
                        gap={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: question.correctAnswers.includes(answer) 
                            ? 'success.light' 
                            : 'error.light',
                          transition: 'all 0.2s'
                        }}
                      >
                        {question.correctAnswers.includes(answer) ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                        <Typography
                          variant="body2"
                          color={question.correctAnswers.includes(answer) 
                            ? "success.dark" 
                            : "error.dark"}
                        >
                          {answer}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="error">
                      Aucune réponse donnée
                    </Typography>
                  )}
                </Box>
              </Box>

              {!question.isCorrect && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    Réponses correctes :
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {question.correctAnswers.map((answer, ansIndex) => (
                      <Box 
                        key={ansIndex} 
                        display="flex" 
                        alignItems="center" 
                        gap={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'success.light',
                          transition: 'all 0.2s'
                        }}
                      >
                        <CheckCircleIcon color="success" />
                        <Typography variant="body2" color="success.dark">
                          {answer}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}