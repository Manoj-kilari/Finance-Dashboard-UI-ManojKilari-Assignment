import React, { useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Transaction, CategorySpending } from '../types';
import { useFinance } from '../context/FinanceContext';

const InsightsSection: React.FC = () => {
  const { state } = useFinance();

  const insights = useMemo(() => {
    const transactions = state.transactions;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Previous month transactions
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });

    // Calculate monthly totals
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Find highest spending category
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const highestSpendingCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];

    // Calculate average transaction amount
    const avgExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t, _, arr) => sum + t.amount / arr.length, 0);

    // Find most frequent transaction category
    const categoryFrequency = transactions
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostFrequentCategory = Object.entries(categoryFrequency)
      .sort(([, a], [, b]) => b - a)[0];

    // Calculate savings rate
    const savingsRate = currentMonthIncome > 0 
      ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
      : 0;

    // Monthly comparison
    const incomeChange = previousMonthIncome > 0 
      ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
      : 0;
    
    const expenseChange = previousMonthExpenses > 0 
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : 0;

    return {
      currentMonthIncome,
      currentMonthExpenses,
      previousMonthIncome,
      previousMonthExpenses,
      highestSpendingCategory,
      avgExpense,
      mostFrequentCategory,
      savingsRate,
      incomeChange,
      expenseChange,
      currentMonthTransactions: currentMonthTransactions.length,
      previousMonthTransactions: previousMonthTransactions.length,
    };
  }, [state.transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const getChangeVariant = (change: number) => {
    if (change > 0) return 'success';
    if (change < 0) return 'danger';
    return 'secondary';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <div>
      <h2 className="mb-4">Financial Insights</h2>
      
      <Row className="mb-4">
        {/* Highest Spending Category */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-danger">Highest Spending Category</Card.Title>
              <h4 className="text-danger">
                {insights.highestSpendingCategory ? insights.highestSpendingCategory[0] : 'N/A'}
              </h4>
              <p className="text-muted mb-0">
                {insights.highestSpendingCategory 
                  ? formatCurrency(insights.highestSpendingCategory[1])
                  : '$0'
                }
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Comparison */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-info">Monthly Comparison</Card.Title>
              <div className="mb-2">
                <small className="text-muted">Income</small>
                <div className="d-flex align-items-center">
                  <Badge bg={getChangeVariant(insights.incomeChange)} className="me-2">
                    {getChangeIcon(insights.incomeChange)} {formatPercent(insights.incomeChange)}
                  </Badge>
                  <span>{formatCurrency(insights.currentMonthIncome)}</span>
                </div>
              </div>
              <div>
                <small className="text-muted">Expenses</small>
                <div className="d-flex align-items-center">
                  <Badge bg={getChangeVariant(insights.expenseChange)} className="me-2">
                    {getChangeIcon(insights.expenseChange)} {formatPercent(insights.expenseChange)}
                  </Badge>
                  <span>{formatCurrency(insights.currentMonthExpenses)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Savings Rate */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-success">Savings Rate</Card.Title>
              <h4 className={insights.savingsRate >= 20 ? 'text-success' : insights.savingsRate >= 0 ? 'text-warning' : 'text-danger'}>
                {insights.savingsRate.toFixed(1)}%
              </h4>
              <p className="text-muted mb-0">
                {insights.savingsRate >= 20 
                  ? 'Excellent savings rate!'
                  : insights.savingsRate >= 0 
                  ? 'Consider increasing savings'
                  : 'Negative savings - review expenses'
                }
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Average Transaction */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-primary">Average Expense</Card.Title>
              <h4 className="text-primary">{formatCurrency(insights.avgExpense)}</h4>
              <p className="text-muted mb-0">Per transaction this month</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Most Frequent Category */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-warning">Most Frequent Category</Card.Title>
              <h4 className="text-warning">
                {insights.mostFrequentCategory ? insights.mostFrequentCategory[0] : 'N/A'}
              </h4>
              <p className="text-muted mb-0">
                {insights.mostFrequentCategory 
                  ? `${insights.mostFrequentCategory[1]} transactions`
                  : '0 transactions'
                }
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Transaction Activity */}
        <Col md={6} lg={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-secondary">Transaction Activity</Card.Title>
              <div className="mb-2">
                <small className="text-muted">This month</small>
                <div>{insights.currentMonthTransactions} transactions</div>
              </div>
              <div>
                <small className="text-muted">Previous month</small>
                <div>{insights.previousMonthTransactions} transactions</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Key Observations */}
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Key Observations</Card.Title>
        </Card.Header>
        <Card.Body>
          <ul className="mb-0">
            <li className="mb-2">
              Your highest spending category is <strong>{insights.highestSpendingCategory?.[0] || 'N/A'}</strong> with 
              {insights.highestSpendingCategory ? ` ${formatCurrency(insights.highestSpendingCategory[1])} ` : ' $0 '}
              spent. Consider reviewing expenses in this area.
            </li>
            <li className="mb-2">
              Your current savings rate is <strong>{insights.savingsRate.toFixed(1)}%</strong>. 
              {insights.savingsRate >= 20 
                ? ' This is excellent! Keep up the good work.'
                : insights.savingsRate >= 10 
                ? ' This is good, but aim for 20% or more.'
                : ' Consider reducing expenses to improve your savings rate.'
              }
            </li>
            <li className="mb-2">
              {insights.incomeChange > 0 
                ? `Your income increased by ${formatPercent(insights.incomeChange)} compared to last month.`
                : insights.incomeChange < 0
                ? `Your income decreased by ${formatPercent(Math.abs(insights.incomeChange))} compared to last month.`
                : 'Your income remained the same compared to last month.'
              }
            </li>
            <li className="mb-2">
              {insights.expenseChange > 0 
                ? `Your expenses increased by ${formatPercent(insights.expenseChange)} compared to last month.`
                : insights.expenseChange < 0
                ? `Your expenses decreased by ${formatPercent(Math.abs(insights.expenseChange))} compared to last month.`
                : 'Your expenses remained the same compared to last month.'
              }
            </li>
            <li className="mb-0">
              You made <strong>{insights.currentMonthTransactions}</strong> transactions this month, 
              {insights.currentMonthTransactions > insights.previousMonthTransactions 
                ? ' which is an increase from last month.'
                : insights.currentMonthTransactions < insights.previousMonthTransactions
                ? ' which is a decrease from last month.'
                : ' which is the same as last month.'
              }
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InsightsSection;
