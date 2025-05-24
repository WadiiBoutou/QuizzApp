import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, LinearProgress, Checkbox, FormControlLabel, 
  Pagination, Paper, useTheme, useMediaQuery, IconButton, Tooltip,
  CircularProgress, Avatar
} from '@mui/material';
import {
  Timer as TimerIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Close as CloseIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export default function QuizTakingModal({ quiz, onClose }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() =>
    quiz.questions.reduce((acc, q) => ({ ...acc, [q.id]: [] }), {})
  );
  const [timer, setTimer] = useState(quiz.timeLimit * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Timer logic
  useEffect(() => {
    if (timer <= 0) { handleSubmit(); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleCheck = (qid, aid) => {
    setAnswers(prev => {
      const arr = prev[qid] || [];
      return {
        ...prev,
        [qid]: arr.includes(aid) ? arr.filter(id => id !== aid) : [...arr, aid]
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(answers), 
      });
  
      if (response.ok) {
        alert('Quiz submitted successfully!');
      } else {
        alert('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
      onClose();
    }
  };

  const handlePageChange = (_, value) => setCurrent(value - 1);

  const getTimerColor = (time) => {
    if (time < 300) return 'error.main';
    if (time < 600) return 'warning.main';
    return 'primary.main';
  };

  return (
    <Dialog 
      open={true} 
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48
              }}
            >
              <QuestionAnswerIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary">
                {quiz.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {quiz.description}
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: getTimerColor(timer),
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s'
            }}
          >
            <TimerIcon />
            <Typography variant="h6" fontWeight={600}>
              {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Question {current + 1} sur {quiz.questions.length}
            </Typography>
            <Typography variant="subtitle2" color="primary" fontWeight={600}>
              {quiz.questions[current].points} points
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={((current + 1) / quiz.questions.length) * 100}
            sx={{ 
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            transition: 'all 0.2s'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {quiz.questions[current].text}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {quiz.questions[current].answers.map(ans => (
              <FormControlLabel
                key={ans.id}
                control={
                  <Checkbox
                    checked={answers[quiz.questions[current].id].includes(ans.id)}
                    onChange={() => handleCheck(quiz.questions[current].id, ans.id)}
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    {ans.text}
                  </Typography>
                }
                sx={{
                  m: 0,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)'
                  }
                }}
              />
            ))}
          </Box>
        </Paper>

        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            count={quiz.questions.length}
            page={current + 1}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Annuler
        </Button>
        <Box sx={{ flex: 1 }} />
        {current > 0 && (
          <Button 
            onClick={() => setCurrent(current - 1)}
            startIcon={<PrevIcon />}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Précédent
          </Button>
        )}
        {current < quiz.questions.length - 1 ? (
          <Button 
            onClick={() => setCurrent(current + 1)}
            endIcon={<NextIcon />}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Suivant
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowConfirm(true)}
            endIcon={<CheckCircleIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Terminer le test
          </Button>
        )}
      </DialogActions>

      {/* Confirmation Dialog */}
      <Dialog 
        open={showConfirm} 
        onClose={() => setShowConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'warning.main'
        }}>
          <WarningIcon /> Confirmer la soumission
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir terminer le test ? Vous ne pourrez plus modifier vos réponses.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowConfirm(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Confirmer'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
} 