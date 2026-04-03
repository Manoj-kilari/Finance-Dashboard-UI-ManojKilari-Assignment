import { Transaction } from '../types';

// Data validation and sanitization utilities
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Sanitize string input
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 500); // Limit length
};

// Validate and sanitize amount
export const validateAmount = (amount: string | number): number => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || !isFinite(numAmount)) {
    throw new ValidationError('Amount must be a valid number', 'amount');
  }
  
  if (numAmount <= 0) {
    throw new ValidationError('Amount must be greater than 0', 'amount');
  }
  
  if (numAmount > 999999999.99) {
    throw new ValidationError('Amount is too large', 'amount');
  }
  
  return Math.round(numAmount * 100) / 100; // Round to 2 decimal places
};

// Validate date
export const validateDate = (date: string): string => {
  if (!date || typeof date !== 'string') {
    throw new ValidationError('Date is required', 'date');
  }
  
  const dateObj = new Date(date);
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError('Invalid date format', 'date');
  }
  
  if (dateObj < oneYearAgo || dateObj > oneYearFromNow) {
    throw new ValidationError('Date must be within one year of today', 'date');
  }
  
  return dateObj.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

// Validate category
export const validateCategory = (category: string, allowedCategories: string[]): string => {
  const sanitized = sanitizeString(category);
  
  if (!sanitized) {
    throw new ValidationError('Category is required', 'category');
  }
  
  if (!allowedCategories.includes(sanitized)) {
    throw new ValidationError('Invalid category', 'category');
  }
  
  return sanitized;
};

// Validate description
export const validateDescription = (description: string): string => {
  const sanitized = sanitizeString(description);
  
  if (!sanitized) {
    throw new ValidationError('Description is required', 'description');
  }
  
  if (sanitized.length < 2) {
    throw new ValidationError('Description must be at least 2 characters', 'description');
  }
  
  return sanitized;
};

// Validate transaction type
export const validateTransactionType = (type: string): 'income' | 'expense' => {
  if (type !== 'income' && type !== 'expense') {
    throw new ValidationError('Transaction type must be income or expense', 'type');
  }
  
  return type as 'income' | 'expense';
};

// Complete transaction validation
export const validateTransaction = (
  transaction: Partial<Transaction>,
  allowedCategories: string[]
): Transaction => {
  const errors: string[] = [];
  
  try {
    const id = transaction.id || Date.now().toString();
    const date = validateDate(transaction.date || '');
    const amount = validateAmount(transaction.amount || 0);
    const category = validateCategory(transaction.category || '', allowedCategories);
    const description = validateDescription(transaction.description || '');
    const type = validateTransactionType(transaction.type || '');
    
    return {
      id,
      date,
      amount,
      category,
      description,
      type,
      tags: transaction.tags || [],
      notes: sanitizeString(transaction.notes || ''),
      isRecurring: Boolean(transaction.isRecurring),
      recurringFrequency: transaction.isRecurring && transaction.recurringFrequency 
        ? validateRecurringFrequency(sanitizeString(transaction.recurringFrequency)) 
        : undefined,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push(`${error.field}: ${error.message}`);
    } else {
      errors.push('Unknown validation error');
    }
    throw new ValidationError(errors.join('; '));
  }
};

// Validate filters
export const validateFilters = (filters: any) => {
  const sanitized: any = {};
  
  if (filters.category && typeof filters.category === 'string') {
    sanitized.category = sanitizeString(filters.category);
  }
  
  if (filters.type && (filters.type === 'income' || filters.type === 'expense' || filters.type === 'all')) {
    sanitized.type = filters.type;
  }
  
  if (filters.search && typeof filters.search === 'string') {
    sanitized.search = sanitizeString(filters.search);
  }
  
  if (filters.dateRange && typeof filters.dateRange === 'string') {
    sanitized.dateRange = sanitizeString(filters.dateRange);
  }
  
  return sanitized;
};

// Sanitize user role
export const validateUserRole = (role: string): 'viewer' | 'admin' => {
  if (role !== 'viewer' && role !== 'admin') {
    throw new ValidationError('Invalid user role');
  }
  return role as 'viewer' | 'admin';
};

// Validate recurring frequency
export const validateRecurringFrequency = (frequency: string): 'daily' | 'weekly' | 'monthly' | 'yearly' => {
  const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
  if (!validFrequencies.includes(frequency)) {
    throw new ValidationError('Recurring frequency must be daily, weekly, monthly, or yearly', 'recurringFrequency');
  }
  return frequency as 'daily' | 'weekly' | 'monthly' | 'yearly';
};
