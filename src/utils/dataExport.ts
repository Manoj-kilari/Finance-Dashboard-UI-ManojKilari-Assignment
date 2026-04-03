import { Transaction, ExportOptions } from '../types';

export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions') => {
  const headers = ['Date', 'Category', 'Description', 'Amount', 'Type', 'Tags', 'Notes', 'Recurring'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date,
      transaction.category,
      `"${transaction.description}"`,
      transaction.amount,
      transaction.type,
      `"${transaction.tags?.join(';') || ''}"`,
      `"${transaction.notes || ''}"`,
      transaction.isRecurring ? transaction.recurringFrequency : ''
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

export const exportToJSON = (transactions: Transaction[], filename: string = 'transactions') => {
  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

export const exportToPDF = async (transactions: Transaction[], filename: string = 'transactions') => {
  // This would require a PDF library like jsPDF or puppeteer
  // For now, we'll create a simple HTML-to-PDF conversion
  const htmlContent = generateHTMLReport(transactions);
  
  // In a real implementation, you would use a library like jsPDF
  // For demo purposes, we'll open the HTML in a new window
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.print();
  }
};

const generateHTMLReport = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netAmount = totalIncome - totalExpenses;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Financial Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
        .summary-item { text-align: center; }
        .summary-item h3 { margin: 0; }
        .summary-item p { margin: 5px 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .income { color: green; }
        .expense { color: red; }
        .tags { font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Financial Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="summary">
        <div class="summary-item">
          <h3 class="income">$${totalIncome.toFixed(2)}</h3>
          <p>Total Income</p>
        </div>
        <div class="summary-item">
          <h3 class="expense">$${totalExpenses.toFixed(2)}</h3>
          <p>Total Expenses</p>
        </div>
        <div class="summary-item">
          <h3 class="${netAmount >= 0 ? 'income' : 'expense'}">$${netAmount.toFixed(2)}</h3>
          <p>Net Amount</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Tags</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(transaction => `
            <tr>
              <td>${transaction.date}</td>
              <td>${transaction.category}</td>
              <td>${transaction.description}</td>
              <td class="${transaction.type}">$${transaction.amount.toFixed(2)}</td>
              <td>${transaction.type}</td>
              <td class="tags">${transaction.tags?.join(', ') || ''}</td>
              <td>${transaction.notes || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const filterTransactionsForExport = (
  transactions: Transaction[], 
  options: ExportOptions
): Transaction[] => {
  let filtered = transactions;

  // Filter by date range
  if (options.dateRange !== 'all') {
    const now = new Date();
    const startDate = new Date();
    
    switch (options.dateRange) {
      case 'last30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'last6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'lastyear':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    filtered = filtered.filter(t => new Date(t.date) >= startDate);
  }

  // Filter by categories
  if (options.categories.length > 0) {
    filtered = filtered.filter(t => options.categories.includes(t.category));
  }

  return filtered;
};

export const generateFinancialSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netAmount = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Category breakdown
  const categoryBreakdown = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { income: 0, expense: 0, count: 0 };
    }
    if (transaction.type === 'income') {
      acc[transaction.category].income += transaction.amount;
    } else {
      acc[transaction.category].expense += transaction.amount;
    }
    acc[transaction.category].count++;
    return acc;
  }, {} as Record<string, { income: number; expense: number; count: number }>);

  // Monthly trends
  const monthlyTrends = transactions.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0, transactions: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    acc[month].transactions++;
    return acc;
  }, {} as Record<string, { income: number; expense: number; transactions: number }>);

  return {
    totalIncome,
    totalExpenses,
    netAmount,
    savingsRate,
    transactionCount: transactions.length,
    categoryBreakdown,
    monthlyTrends,
    averageTransaction: transactions.length > 0 ? totalIncome + totalExpenses / transactions.length : 0,
    largestExpense: Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0),
    largestIncome: Math.max(...transactions.filter(t => t.type === 'income').map(t => t.amount), 0),
  };
};
