export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  tags?: string[];
  notes?: string;
  receipt?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  financialHealthScore: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
  icon?: string;
}

export interface BalanceTrend {
  month: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface IncomeSource {
  source: string;
  amount: number;
  percentage: number;
}

export interface SpendingTrend {
  date: string;
  amount: number;
  movingAverage?: number;
}

export interface CashFlowItem {
  category: string;
  amount: number;
  type: 'income' | 'expense';
  order: number;
}

export interface BudgetItem {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
}

export interface SpendingHeatMap {
  day: string;
  amount: number;
  intensity: number;
}

export type UserRole = 'viewer' | 'admin';

export interface AppFilters {
  category: string;
  type: string;
  dateRange: string;
  search: string;
  tags?: string[];
  amountRange?: [number, number];
}

export interface Theme {
  mode: 'light' | 'dark' | 'high-contrast';
  primaryColor: string;
  accentColor: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json';
  dateRange: string;
  categories: string[];
  includeCharts: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
}
