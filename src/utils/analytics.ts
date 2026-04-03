import { Transaction, CategorySpending, BalanceTrend } from '../types';

export interface PredictiveInsight {
  type: 'warning' | 'success' | 'info' | 'trend';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  recommendation?: string;
}

export interface SpendingPattern {
  category: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  prediction: number; // Predicted next month spending
}

export interface FinancialHealthScore {
  score: number; // 0-100
  level: 'excellent' | 'good' | 'fair' | 'poor';
  factors: {
    savingsRate: number;
    spendingConsistency: number;
    incomeStability: number;
    debtManagement: number;
  };
  recommendations: string[];
}

// Advanced analytics engine
export class AnalyticsEngine {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Predict next month spending using linear regression
  predictNextMonthSpending(category?: string): number {
    const relevantTransactions = category 
      ? this.transactions.filter(t => t.category === category && t.type === 'expense')
      : this.transactions.filter(t => t.type === 'expense');

    if (relevantTransactions.length < 3) return 0;

    // Group by month and calculate totals
    const monthlyData = this.groupTransactionsByMonth(relevantTransactions);
    const months = Object.keys(monthlyData).sort();
    
    if (months.length < 3) return 0;

    // Simple linear regression
    const n = months.length;
    const x = months.map((_, i) => i);
    const y = months.map(month => monthlyData[month]);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next month
    const nextMonthPrediction = slope * n + intercept;
    return Math.max(0, nextMonthPrediction);
  }

  // Analyze spending patterns
  analyzeSpendingPatterns(): SpendingPattern[] {
    const categories = Array.from(new Set(this.transactions.filter(t => t.type === 'expense').map(t => t.category)));
    
    return categories.map(category => {
      const categoryTransactions = this.transactions.filter(t => t.category === category && t.type === 'expense');
      const monthlyData = this.groupTransactionsByMonth(categoryTransactions);
      const months = Object.keys(monthlyData).sort();
      
      if (months.length < 2) {
        return {
          category,
          trend: 'stable',
          changePercentage: 0,
          prediction: monthlyData[months[0]] || 0
        };
      }

      const recentMonths = months.slice(-3);
      const recentSpending = recentMonths.map(month => monthlyData[month]);
      
      // Calculate trend
      const firstMonth = recentSpending[0];
      const lastMonth = recentSpending[recentSpending.length - 1];
      const changePercentage = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (changePercentage > 10) trend = 'increasing';
      else if (changePercentage < -10) trend = 'decreasing';
      
      return {
        category,
        trend,
        changePercentage: Math.round(changePercentage),
        prediction: this.predictNextMonthSpending(category)
      };
    });
  }

  // Generate predictive insights
  generatePredictiveInsights(): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];
    const patterns = this.analyzeSpendingPatterns();
    
    // Analyze spending trends
    patterns.forEach(pattern => {
      if (pattern.trend === 'increasing' && pattern.changePercentage > 20) {
        insights.push({
          type: 'warning',
          title: `Rising ${pattern.category} Expenses`,
          description: `Your ${pattern.category.toLowerCase()} spending has increased by ${pattern.changePercentage}% recently.`,
          confidence: Math.min(95, 60 + pattern.changePercentage),
          actionable: true,
          recommendation: 'Consider setting a budget limit for this category or review recent purchases.'
        });
      }
      
      if (pattern.trend === 'decreasing' && pattern.changePercentage < -15) {
        insights.push({
          type: 'success',
          title: `Great Job on ${pattern.category} Savings!`,
          description: `You've reduced ${pattern.category.toLowerCase()} spending by ${Math.abs(pattern.changePercentage)}%.`,
          confidence: Math.min(90, 60 + Math.abs(pattern.changePercentage)),
          actionable: false
        });
      }
    });

    // Income analysis
    const incomeTransactions = this.transactions.filter(t => t.type === 'income');
    if (incomeTransactions.length >= 3) {
      const monthlyIncome = this.groupTransactionsByMonth(incomeTransactions);
      const incomeMonths = Object.keys(monthlyIncome).sort();
      const recentIncome = incomeMonths.slice(-3).map(month => monthlyIncome[month]);
      
      const incomeVariability = this.calculateVariability(recentIncome);
      if (incomeVariability > 30) {
        insights.push({
          type: 'info',
          title: 'Variable Income Detected',
          description: 'Your income shows significant month-to-month variation.',
          confidence: Math.min(85, 50 + incomeVariability),
          actionable: true,
          recommendation: 'Consider building an emergency fund to cover 3-6 months of expenses.'
        });
      }
    }

    // Savings rate analysis
    const savingsRate = this.calculateSavingsRate();
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%, which is below the recommended 20%.`,
        confidence: 90,
        actionable: true,
        recommendation: 'Try to reduce non-essential expenses or increase income to improve your savings rate.'
      });
    } else if (savingsRate > 30) {
      insights.push({
        type: 'success',
        title: 'Excellent Savings Rate!',
        description: `Your savings rate of ${savingsRate.toFixed(1)}% is well above the recommended 20%.`,
        confidence: 95,
        actionable: false
      });
    }

    // Predictive budget warnings
    patterns.forEach(pattern => {
      if (pattern.prediction > 0) {
        const currentAvg = this.getAverageMonthlySpending(pattern.category);
        if (pattern.prediction > currentAvg * 1.2) {
          insights.push({
            type: 'trend',
            title: `Budget Alert for ${pattern.category}`,
            description: `Predicted ${pattern.category} spending next month: $${pattern.prediction.toFixed(2)}`,
            confidence: 75,
            actionable: true,
            recommendation: `Consider adjusting your ${pattern.category.toLowerCase()} budget to $${(pattern.prediction * 1.1).toFixed(2)}.`
          });
        }
      }
    });

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  // Calculate comprehensive financial health score
  calculateFinancialHealthScore(): FinancialHealthScore {
    const savingsRate = this.calculateSavingsRate();
    const spendingConsistency = this.calculateSpendingConsistency();
    const incomeStability = this.calculateIncomeStability();
    const debtManagement = 100; // Placeholder - would need debt data

    const overallScore = (savingsRate + spendingConsistency + incomeStability + debtManagement) / 4;
    
    let level: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (overallScore >= 85) level = 'excellent';
    else if (overallScore >= 70) level = 'good';
    else if (overallScore >= 50) level = 'fair';

    const recommendations: string[] = [];
    if (savingsRate < 20) recommendations.push('Increase your savings rate to at least 20%');
    if (spendingConsistency < 70) recommendations.push('Work on maintaining consistent spending habits');
    if (incomeStability < 70) recommendations.push('Focus on stabilizing your income sources');
    if (overallScore < 70) recommendations.push('Create and stick to a detailed budget');

    return {
      score: Math.round(overallScore),
      level,
      factors: {
        savingsRate,
        spendingConsistency,
        incomeStability,
        debtManagement
      },
      recommendations
    };
  }

  // Helper methods
  private groupTransactionsByMonth(transactions: Transaction[]): Record<string, number> {
    const monthlyData: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += transaction.amount;
    });
    
    return monthlyData;
  }

  private calculateVariability(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return mean > 0 ? (stdDev / mean) * 100 : 0;
  }

  private calculateSavingsRate(): number {
    const lastThreeMonths = this.getLastMonthsData(3);
    const totalIncome = lastThreeMonths.income;
    const totalExpenses = lastThreeMonths.expenses;
    
    return totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  }

  private calculateSpendingConsistency(): number {
    const expensesByMonth = this.groupTransactionsByMonth(
      this.transactions.filter(t => t.type === 'expense')
    );
    const monthlyExpenses = Object.values(expensesByMonth);
    
    if (monthlyExpenses.length < 2) return 100;
    
    const variability = this.calculateVariability(monthlyExpenses);
    return Math.max(0, 100 - variability);
  }

  private calculateIncomeStability(): number {
    const incomeByMonth = this.groupTransactionsByMonth(
      this.transactions.filter(t => t.type === 'income')
    );
    const monthlyIncome = Object.values(incomeByMonth);
    
    if (monthlyIncome.length < 2) return 100;
    
    const variability = this.calculateVariability(monthlyIncome);
    return Math.max(0, 100 - variability);
  }

  private getLastMonthsData(months: number): { income: number; expenses: number } {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    const recentTransactions = this.transactions.filter(t => new Date(t.date) >= cutoffDate);
    
    const income = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses };
  }

  private getAverageMonthlySpending(category: string): number {
    const categoryTransactions = this.transactions.filter(
      t => t.category === category && t.type === 'expense'
    );
    const monthlyData = this.groupTransactionsByMonth(categoryTransactions);
    const monthlyTotals = Object.values(monthlyData);
    
    return monthlyTotals.length > 0 
      ? monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length 
      : 0;
  }
}

export default AnalyticsEngine;
