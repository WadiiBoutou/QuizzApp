import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    username: '', 
    password: '', 
    role: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setError('Veuillez sélectionner un rôle.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setSuccess('Registration successful!');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Registration failed. Please check your input.');
      } else if (err.request) {
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <SchoolIcon 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              mb: 2
            }} 
          />
          
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            Create Account
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Join our learning community
          </Typography>

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 1
              }}
            >
              {success}
            </Alert>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 1
              }}
            >
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleRegister}
            sx={{ width: '100%' }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <FormControl 
              component="fieldset" 
              sx={{ 
                mt: 2,
                width: '100%',
                '& .MuiFormLabel-root': {
                  color: 'text.primary',
                  fontWeight: 500
                }
              }}
            >
              <FormLabel component="legend">Vous êtes ?</FormLabel>
              <RadioGroup 
                row 
                name="role" 
                value={formData.role} 
                onChange={handleRoleChange}
                sx={{ 
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <FormControlLabel 
                  value="enseignant" 
                  control={<Radio />} 
                  label="Enseignant"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: 'text.primary'
                    }
                  }}
                />
                <FormControlLabel 
                  value="etudiant" 
                  control={<Radio />} 
                  label="Etudiant"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: 'text.primary'
                    }
                  }}
                />
              </RadioGroup>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              Create Account
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
