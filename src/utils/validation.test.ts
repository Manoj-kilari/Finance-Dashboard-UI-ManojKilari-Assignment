import {
  ValidationError,
  sanitizeString,
  validateAmount,
  validateDate,
  validateCategory,
  validateDescription,
  validateTransactionType,
  validateTransaction,
  validateFilters,
  validateUserRole,
} from './validation';

describe('Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace and remove XSS characters', () => {
      expect(sanitizeString('  hello <script>world</script>  ')).toBe('hello world');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
      expect(sanitizeString(123 as any)).toBe('');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(600);
      expect(sanitizeString(longString)).toBe('a'.repeat(500));
    });
  });

  describe('validateAmount', () => {
    it('should validate positive numbers', () => {
      expect(validateAmount('100.50')).toBe(100.50);
      expect(validateAmount(100.50)).toBe(100.50);
    });

    it('should round to 2 decimal places', () => {
      expect(validateAmount('100.567')).toBe(100.57);
    });

    it('should throw errors for invalid amounts', () => {
      expect(() => validateAmount('invalid')).toThrow(ValidationError);
      expect(() => validateAmount(-10)).toThrow(ValidationError);
      expect(() => validateAmount(0)).toThrow(ValidationError);
      expect(() => validateAmount(1000000000)).toThrow(ValidationError);
    });
  });

  describe('validateDate', () => {
    it('should validate valid dates', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(validateDate(today)).toBe(today);
    });

    it('should throw errors for invalid dates', () => {
      expect(() => validateDate('')).toThrow(ValidationError);
      expect(() => validateDate('invalid-date')).toThrow(ValidationError);
      expect(() => validateDate('2020-01-01')).toThrow(ValidationError); // Too old
      expect(() => validateDate('2030-01-01')).toThrow(ValidationError); // Too far in future
    });
  });

  describe('validateCategory', () => {
    const allowedCategories = ['Food', 'Transport', 'Entertainment'];

    it('should validate allowed categories', () => {
      expect(validateCategory('Food', allowedCategories)).toBe('Food');
    });

    it('should throw errors for invalid categories', () => {
      expect(() => validateCategory('', allowedCategories)).toThrow(ValidationError);
      expect(() => validateCategory('Invalid', allowedCategories)).toThrow(ValidationError);
    });
  });

  describe('validateDescription', () => {
    it('should validate valid descriptions', () => {
      expect(validateDescription('Valid description')).toBe('Valid description');
    });

    it('should throw errors for invalid descriptions', () => {
      expect(() => validateDescription('')).toThrow(ValidationError);
      expect(() => validateDescription('a')).toThrow(ValidationError);
    });
  });

  describe('validateTransactionType', () => {
    it('should validate valid transaction types', () => {
      expect(validateTransactionType('income')).toBe('income');
      expect(validateTransactionType('expense')).toBe('expense');
    });

    it('should throw errors for invalid types', () => {
      expect(() => validateTransactionType('invalid')).toThrow(ValidationError);
    });
  });

  describe('validateTransaction', () => {
    const allowedCategories = ['Food', 'Transport', 'Entertainment'];

    it('should validate complete transaction', () => {
      const transaction = validateTransaction({
        date: new Date().toISOString().split('T')[0],
        amount: 100.50,
        category: 'Food',
        description: 'Test transaction',
        type: 'expense',
      }, allowedCategories);

      expect(transaction).toHaveProperty('id');
      expect(transaction.amount).toBe(100.50);
      expect(transaction.category).toBe('Food');
    });

    it('should throw errors for invalid transactions', () => {
      expect(() => validateTransaction({}, allowedCategories)).toThrow(ValidationError);
    });
  });

  describe('validateFilters', () => {
    it('should validate filters', () => {
      const filters = validateFilters({
        category: 'Food',
        type: 'expense',
        search: 'test',
        dateRange: 'month',
      });

      expect(filters.category).toBe('Food');
      expect(filters.type).toBe('expense');
    });

    it('should handle invalid filters gracefully', () => {
      const filters = validateFilters({
        category: 123,
        type: 'invalid',
        search: null,
      });

      expect(filters.category).toBeUndefined();
      expect(filters.type).toBeUndefined();
    });
  });

  describe('validateUserRole', () => {
    it('should validate valid roles', () => {
      expect(validateUserRole('viewer')).toBe('viewer');
      expect(validateUserRole('admin')).toBe('admin');
    });

    it('should throw errors for invalid roles', () => {
      expect(() => validateUserRole('invalid')).toThrow(ValidationError);
    });
  });
});
