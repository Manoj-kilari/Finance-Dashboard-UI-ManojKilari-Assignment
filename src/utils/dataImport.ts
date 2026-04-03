import { Transaction } from '../types';
import { categories } from '../data/mockData';

export interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
  transactions: Transaction[];
}

export const parseCSVFile = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseCSVText(text);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          message: 'Failed to parse CSV file',
          imported: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          transactions: []
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
        imported: 0,
        errors: ['File reading error'],
        transactions: []
      });
    };
    
    reader.readAsText(file);
  });
};

export const parseJSONFile = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseJSONText(text);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          message: 'Failed to parse JSON file',
          imported: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          transactions: []
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
        imported: 0,
        errors: ['File reading error'],
        transactions: []
      });
    };
    
    reader.readAsText(file);
  });
};

const parseCSVText = (text: string): ImportResult => {
  const lines = text.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  const transactions: Transaction[] = [];
  
  if (lines.length < 2) {
    return {
      success: false,
      message: 'CSV file must contain at least a header and one data row',
      imported: 0,
      errors: ['Insufficient data'],
      transactions: []
    };
  }
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const expectedHeaders = ['date', 'category', 'description', 'amount', 'type'];
  
  // Check required headers
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      success: false,
      message: `Missing required headers: ${missingHeaders.join(', ')}`,
      imported: 0,
      errors: missingHeaders.map(h => `Missing header: ${h}`),
      transactions: []
    };
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }
    
    try {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      // Validate and convert data
      const transaction: Transaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: row.date,
        amount: parseFloat(row.amount),
        category: row.category,
        description: row.description,
        type: row.type.toLowerCase() as 'income' | 'expense',
        tags: row.tags ? row.tags.split(';').filter((t: string) => t.trim()) : [],
        notes: row.notes || '',
        isRecurring: row.recurring === 'true' || row.recurring === 'yes',
        recurringFrequency: row.frequency || undefined
      };
      
      // Validate transaction
      const validationErrors = validateTransaction(transaction);
      if (validationErrors.length > 0) {
        errors.push(`Row ${i + 1}: ${validationErrors.join(', ')}`);
        continue;
      }
      
      transactions.push(transaction);
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }
  
  return {
    success: transactions.length > 0,
    message: `Imported ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`,
    imported: transactions.length,
    errors,
    transactions
  };
};

const parseJSONText = (text: string): ImportResult => {
  try {
    const data = JSON.parse(text);
    const errors: string[] = [];
    const transactions: Transaction[] = [];
    
    let dataArray: any[] = [];
    
    if (Array.isArray(data)) {
      dataArray = data;
    } else if (data.transactions && Array.isArray(data.transactions)) {
      dataArray = data.transactions;
    } else {
      return {
        success: false,
        message: 'JSON file must contain an array of transactions or a "transactions" array',
        imported: 0,
        errors: ['Invalid JSON structure'],
        transactions: []
      };
    }
    
    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];
      
      try {
        const transaction: Transaction = {
          id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: item.date,
          amount: parseFloat(item.amount),
          category: item.category,
          description: item.description,
          type: (item.type || 'expense').toLowerCase() as 'income' | 'expense',
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(';').filter((t: string) => t.trim()) : []),
          notes: item.notes || '',
          isRecurring: item.isRecurring === true || item.recurring === true || item.recurring === 'yes',
          recurringFrequency: item.recurringFrequency || item.frequency
        };
        
        // Validate transaction
        const validationErrors = validateTransaction(transaction);
        if (validationErrors.length > 0) {
          errors.push(`Item ${i + 1}: ${validationErrors.join(', ')}`);
          continue;
        }
        
        transactions.push(transaction);
      } catch (error) {
        errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }
    
    return {
      success: transactions.length > 0,
      message: `Imported ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`,
      imported: transactions.length,
      errors,
      transactions
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid JSON format',
      imported: 0,
      errors: [error instanceof Error ? error.message : 'JSON parse error'],
      transactions: []
    };
  }
};

const validateTransaction = (transaction: Transaction): string[] => {
  const errors: string[] = [];
  
  // Validate date
  if (!transaction.date || !isValidDate(transaction.date)) {
    errors.push('Invalid date format (use YYYY-MM-DD)');
  }
  
  // Validate amount
  if (isNaN(transaction.amount) || transaction.amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  // Validate category
  if (!transaction.category || transaction.category.trim() === '') {
    errors.push('Category is required');
  } else if (!categories.includes(transaction.category)) {
    errors.push(`Unknown category: ${transaction.category}`);
  }
  
  // Validate description
  if (!transaction.description || transaction.description.trim() === '') {
    errors.push('Description is required');
  }
  
  // Validate type
  if (!['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be "income" or "expense"');
  }
  
  return errors;
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

export const generateImportTemplate = (format: 'csv' | 'json'): string => {
  if (format === 'csv') {
    return `date,category,description,amount,type,tags,notes,recurring,frequency
2024-01-15,Groceries,Weekly shopping,85.50,expense,food;weekly,Regular grocery run,false,
2024-01-16,Salary,Monthly salary,2500.00,income,salary;monthly,January salary,true,monthly`;
  } else {
    return JSON.stringify([
      {
        date: '2024-01-15',
        category: 'Groceries',
        description: 'Weekly shopping',
        amount: 85.50,
        type: 'expense',
        tags: ['food', 'weekly'],
        notes: 'Regular grocery run',
        isRecurring: false,
        recurringFrequency: undefined
      },
      {
        date: '2024-01-16',
        category: 'Salary',
        description: 'Monthly salary',
        amount: 2500.00,
        type: 'income',
        tags: ['salary', 'monthly'],
        notes: 'January salary',
        isRecurring: true,
        recurringFrequency: 'monthly'
      }
    ], null, 2);
  }
};

export const downloadImportTemplate = (format: 'csv' | 'json') => {
  const content = generateImportTemplate(format);
  const filename = `import-template.${format}`;
  const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
  
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
