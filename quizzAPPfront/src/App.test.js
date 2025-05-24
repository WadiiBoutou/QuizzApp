import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import App from './App';

const theme = createTheme();

const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

describe('App Component', () => {
  let mockNavigate;
  let logoutButton;

  beforeEach(() => {
    // Mock the navigate function before any test runs
    const mockNavigateFn = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigateFn
    }));
    mockNavigate = mockNavigateFn;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  test('renders welcome message', () => {
    customRender(<App />);
    expect(screen.getByText('Welcome to Quiz App')).toBeTruthy();
  });

  test('renders start quiz message', () => {
    customRender(<App />);
    expect(screen.getByText('Select a topic and start your quiz!')).toBeTruthy();
  });

  test('renders logout button', () => {
    customRender(<App />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeTruthy();
  });

  test('logout button is clickable', () => {
    customRender(<App />);
    logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeEnabled();
  });
});