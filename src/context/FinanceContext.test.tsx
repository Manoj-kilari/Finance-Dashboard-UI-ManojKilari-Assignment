import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { FinanceProvider, useFinance } from './FinanceContext';
import { mockTransactions } from '../data/mockData';

// Test component to use the hook
const TestComponent = () => {
  const { state, addTransaction, updateTransaction, deleteTransaction, setUserRole, setFilters, resetFilters, getFilteredTransactions } = useFinance();
  
  return (
    <div>
      <div data-testid="transaction-count">{state.transactions.length}</div>
      <div data-testid="user-role">{state.userRole}</div>
      <div data-testid="filter-category">{state.filters.category}</div>
      <button 
        data-testid="add-transaction" 
        onClick={() => addTransaction({
          id: 'test-1',
          date: '2024-01-01',
          amount: 100,
          category: 'Food',
          description: 'Test transaction',
          type: 'expense'
        })}
      >
        Add Transaction
      </button>
      <button 
        data-testid="update-transaction" 
        onClick={() => updateTransaction('1', {
          id: '1',
          date: '2024-01-01',
          amount: 200,
          category: 'Food',
          description: 'Updated transaction',
          type: 'expense'
        })}
      >
        Update Transaction
      </button>
      <button 
        data-testid="delete-transaction" 
        onClick={() => deleteTransaction('1')}
      >
        Delete Transaction
      </button>
      <button 
        data-testid="set-user-role" 
        onClick={() => setUserRole('admin')}
      >
        Set User Role
      </button>
      <button 
        data-testid="set-filters" 
        onClick={() => setFilters({ category: 'Food' })}
      >
        Set Filters
      </button>
      <button 
        data-testid="reset-filters" 
        onClick={resetFilters}
      >
        Reset Filters
      </button>
      <div data-testid="filtered-count">{getFilteredTransactions().length}</div>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <FinanceProvider>
      <TestComponent />
    </FinanceProvider>
  );
};

describe('FinanceContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with mock data', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('transaction-count')).toHaveTextContent(mockTransactions.length.toString());
    expect(screen.getByTestId('user-role')).toHaveTextContent('viewer');
    expect(screen.getByTestId('filter-category')).toHaveTextContent('All');
  });

  it('should add transaction', () => {
    renderWithProvider();
    
    const addButton = screen.getByTestId('add-transaction');
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('transaction-count')).toHaveTextContent((mockTransactions.length + 1).toString());
  });

  it('should update transaction', () => {
    renderWithProvider();
    
    const updateButton = screen.getByTestId('update-transaction');
    act(() => {
      updateButton.click();
    });
    
    // Transaction count should remain the same
    expect(screen.getByTestId('transaction-count')).toHaveTextContent(mockTransactions.length.toString());
  });

  it('should delete transaction', () => {
    renderWithProvider();
    
    const deleteButton = screen.getByTestId('delete-transaction');
    act(() => {
      deleteButton.click();
    });
    
    expect(screen.getByTestId('transaction-count')).toHaveTextContent((mockTransactions.length - 1).toString());
  });

  it('should set user role', () => {
    renderWithProvider();
    
    const setRoleButton = screen.getByTestId('set-user-role');
    act(() => {
      setRoleButton.click();
    });
    
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
  });

  it('should set filters', () => {
    renderWithProvider();
    
    const setFiltersButton = screen.getByTestId('set-filters');
    act(() => {
      setFiltersButton.click();
    });
    
    expect(screen.getByTestId('filter-category')).toHaveTextContent('Food');
  });

  it('should reset filters', () => {
    renderWithProvider();
    
    // First set a filter
    const setFiltersButton = screen.getByTestId('set-filters');
    act(() => {
      setFiltersButton.click();
    });
    
    // Then reset
    const resetButton = screen.getByTestId('reset-filters');
    act(() => {
      resetButton.click();
    });
    
    expect(screen.getByTestId('filter-category')).toHaveTextContent('All');
  });

  it('should filter transactions', () => {
    renderWithProvider();
    
    // Set filter to Food category
    const setFiltersButton = screen.getByTestId('set-filters');
    act(() => {
      setFiltersButton.click();
    });
    
    const filteredCount = parseInt(screen.getByTestId('filtered-count').textContent || '0');
    const foodTransactions = mockTransactions.filter(t => t.category === 'Food');
    
    expect(filteredCount).toBe(foodTransactions.length);
  });

  it('should persist data to localStorage', () => {
    renderWithProvider();
    
    // Add a transaction
    const addButton = screen.getByTestId('add-transaction');
    act(() => {
      addButton.click();
    });
    
    // Check if data was saved to localStorage
    const savedTransactions = localStorage.getItem('finance-transactions');
    expect(savedTransactions).toBeTruthy();
    
    const parsedTransactions = JSON.parse(savedTransactions!);
    expect(parsedTransactions).toHaveLength(mockTransactions.length + 1);
  });

  it('should load data from localStorage on initialization', () => {
    // Pre-populate localStorage
    const customTransactions = [
      {
        id: 'custom-1',
        date: '2024-01-01',
        amount: 100,
        category: 'Food',
        description: 'Custom transaction',
        type: 'expense'
      }
    ];
    localStorage.setItem('finance-transactions', JSON.stringify(customTransactions));
    
    renderWithProvider();
    
    expect(screen.getByTestId('transaction-count')).toHaveTextContent('1');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = jest.fn(() => {
      throw new Error('localStorage error');
    });
    
    renderWithProvider();
    
    // Should still initialize with mock data
    expect(screen.getByTestId('transaction-count')).toHaveTextContent(mockTransactions.length.toString());
    
    // Restore original method
    localStorage.getItem = originalGetItem;
  });
});
