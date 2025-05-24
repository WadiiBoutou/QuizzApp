import React, { useState, useEffect } from 'react';
import {
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  BarChart as BarChartIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  QuestionAnswer as QuestionAnswerIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QuizTakingModal from './QuizTakingModal';
import QuizPerformanceModal from './QuizPerformanceModal';

const tabLabels = ['Quiz Disponibles', 'Quiz Complétés'];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [selectedQuizPerformance, setSelectedQuizPerformance] = useState(null);
  

  useEffect(() => {
    if (tab === 0) {
      fetchAllQuizzes();
    } else if (tab === 1) {
      fetchCompletedQuizzes();
    }
  }, [tab]);
  const fetchCompletedQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/quizzes/completed', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCompletedQuizzes(data);
      } else {
        setCompletedQuizzes([]);
      }
    } catch (error) {
      setCompletedQuizzes([]);
    }
  };
  
  const fetchAllQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/quizzes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      setQuizzes([]);
    }
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setOpenQuizModal(true);
  };

  const handleViewPerformance = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching performance for quiz:', quizId);
      console.log('Token available:', !!token);
      console.log('Token value:', token);

      const url = `http://localhost:8080/api/quizzes/${quizId}/performance`;
      console.log('Request URL:', url);

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };
      console.log('Request headers:', headers);

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setSelectedQuizPerformance(data);
        setOpenPerformanceModal(true);
      } else {
        const errorText = await response.text();
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
      }
    } catch (error) {
      console.error('Error in handleViewPerformance:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                mr: 2
              }}
            >
              <SchoolIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} color="primary">
                Tableau de bord Étudiant
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Participez aux quiz et consultez vos résultats
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            mb: 3
          }}>
            <Tabs 
              value={tab} 
              onChange={(_, v) => setTab(v)}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  minWidth: 180,
                  textTransform: 'none',
                  fontSize: '1rem'
                }
              }}
            >
              {tabLabels.map((label) => (
                <Tab 
                  key={label} 
                  label={label}
                  icon={label === 'Quiz Disponibles' ? <PlayCircleOutlineIcon /> : <BarChartIcon />}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {tab === 0 && (
            <Grid container spacing={3}>
              {quizzes.map((quiz) => (
                <Grid item xs={12} md={6} key={quiz.id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {quiz.title}
                        </Typography>
                        <Chip
                          icon={<PersonIcon />}
                          label={`Prof. ${quiz.createdBy?.firstName || quiz.createdBy?.username || 'Inconnu'}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {quiz.description}
                      </Typography>

                      <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QuestionAnswerIcon color="action" fontSize="small" />
                            <Typography variant="body2">
                              <b>{quiz.questions?.length || 0}</b> Questions
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimerIcon color="action" fontSize="small" />
                            <Typography variant="body2">
                              <b>{quiz.timeLimit}</b> min
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          déposé le : {quiz.dateOfCreation ? new Date(quiz.dateOfCreation).toLocaleDateString() : '-'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Button
                        startIcon={<PlayCircleOutlineIcon />}
                        variant="contained"
                        fullWidth
                        onClick={() => handleStartQuiz(quiz)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          py: 1,
                          fontWeight: 600
                        }}
                      >
                        Commencer le Quiz
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              {completedQuizzes.length === 0 ? (
                <Box 
                  sx={{ 
                    minHeight: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '100%',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <BarChartIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    Aucun quiz complété pour le moment.
                  </Typography>
                </Box>
              ) : (
                completedQuizzes.map((quiz) => (
                  <Grid item xs={12} md={6} key={quiz.quizId}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        borderRadius: 3,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                          {quiz.quizTitle}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            Score
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(quiz.score / quiz.maxScore) * 100}
                              sx={{ 
                                flexGrow: 1,
                                height: 8,
                                borderRadius: 4
                              }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {quiz.score}/{quiz.maxScore}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarIcon color="action" fontSize="small" />
                          <Typography variant="caption" color="text.secondary">
                            Terminé le : {quiz.completionTime ? new Date(quiz.completionTime).toLocaleString() : '-'}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Button
                          startIcon={<BarChartIcon />}
                          variant="outlined"
                          fullWidth
                          onClick={() => handleViewPerformance(quiz.quizId)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            py: 1
                          }}
                        >
                          Voir les détails
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Paper>
      </Container>

      {openQuizModal && activeQuiz && (
        <QuizTakingModal
          quiz={activeQuiz}
          onClose={() => { setOpenQuizModal(false); setActiveQuiz(null); }}
        />
      )}
      {openPerformanceModal && selectedQuizPerformance && (
        <QuizPerformanceModal
          open={openPerformanceModal}
          onClose={() => { setOpenPerformanceModal(false); setSelectedQuizPerformance(null); }}
          quizPerformance={selectedQuizPerformance}
        />
      )}
    </Box>
  );
} 