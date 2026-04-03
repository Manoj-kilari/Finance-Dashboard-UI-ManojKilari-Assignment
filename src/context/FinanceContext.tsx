import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Transaction, UserRole, AppFilters, FinancialSummary, CategorySpending, BalanceTrend } from '../types';
import { 
  mockTransactions, 
  mockFinancialSummary, 
  mockCategorySpending, 
  mockBalanceTrend 
} from '../data/mockData';

// Local storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'finance-transactions',
  USER_ROLE: 'finance-user-role',
  FILTERS: 'finance-filters'
};

// Load data from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};


interface FinanceState {
  transactions: Transaction[];
  summary: FinancialSummary;
  categorySpending: CategorySpending[];
  balanceTrend: BalanceTrend[];
  userRole: UserRole;
  filters: AppFilters;
}

type FinanceAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Transaction } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_FILTERS'; payload: Partial<AppFilters> }
  | { type: 'RESET_FILTERS' };

const initialState: FinanceState = {
  transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, mockTransactions),
  summary: mockFinancialSummary,
  categorySpending: mockCategorySpending,
  balanceTrend: mockBalanceTrend,
  userRole: loadFromStorage(STORAGE_KEYS.USER_ROLE, 'viewer' as UserRole),
  filters: loadFromStorage(STORAGE_KEYS.FILTERS, {
    category: 'All',
    type: 'all',
    dateRange: 'all',
    search: '',
  }),
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload.transaction : t
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          category: 'All',
          type: 'all',
          dateRange: 'all',
          search: '',
        },
      };
    
    default:
      return state;
  }
};

interface FinanceContextType {
  state: FinanceState;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setUserRole: (role: UserRole) => void;
  setFilters: (filters: Partial<AppFilters>) => void;
  resetFilters: () => void;
  getFilteredTransactions: () => Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (id: string, transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setUserRole = (role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  const setFilters = (filters: Partial<AppFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const getFilteredTransactions = (): Transaction[] => {
    return state.transactions.filter(transaction => {
      const matchesCategory = state.filters.category === 'All' || transaction.category === state.filters.category;
      const matchesType = state.filters.type === 'all' || transaction.type === state.filters.type;
      const matchesSearch = transaction.description.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(state.filters.search.toLowerCase());
      
      return matchesCategory && matchesType && matchesSearch;
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setUserRole,
        setFilters,
        resetFilters,
        getFilteredTransactions,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
