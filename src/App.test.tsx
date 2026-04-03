import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders finance dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/Finance Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
