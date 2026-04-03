import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, setThemeMode } = useTheme();

  const getThemeIcon = () => {
    switch (theme.mode) {
      case 'dark':
        return 'bi-moon-fill';
      case 'high-contrast':
        return 'bi-circle-half';
      default:
        return 'bi-sun-fill';
    }
  };

  const getThemeLabel = () => {
    switch (theme.mode) {
      case 'dark':
        return 'Dark Mode';
      case 'high-contrast':
        return 'High Contrast';
      default:
        return 'Light Mode';
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm" id="theme-dropdown">
        <i className={`bi ${getThemeIcon()} me-2`}></i>
        {getThemeLabel()}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={() => setThemeMode('light')}
          active={theme.mode === 'light'}
        >
          <i className="bi-sun-fill me-2"></i>
          Light Mode
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => setThemeMode('dark')}
          active={theme.mode === 'dark'}
        >
          <i className="bi-moon-fill me-2"></i>
          Dark Mode
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => setThemeMode('high-contrast')}
          active={theme.mode === 'high-contrast'}
        >
          <i className="bi-circle-half me-2"></i>
          High Contrast
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={toggleTheme}>
          <i className="bi-arrow-repeat me-2"></i>
          Toggle Theme
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeToggle;
