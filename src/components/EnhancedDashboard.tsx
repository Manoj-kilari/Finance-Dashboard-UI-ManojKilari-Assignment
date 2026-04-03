import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Dropdown } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
} from 'chart.js';
import { 
  FinancialSummary, 
  CategorySpending, 
  BalanceTrend, 
  MonthlyComparison, 
  IncomeSource,
  SpendingTrend,
  BudgetItem,
  SpendingHeatMap
} from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

interface EnhancedDashboardProps {
  summary: FinancialSummary;
  categorySpending: CategorySpending[];
  balanceTrend: BalanceTrend[];
  monthlyComparison: MonthlyComparison[];
  incomeSources: IncomeSource[];
  spendingTrend: SpendingTrend[];
  budgetItems: BudgetItem[];
  spendingHeatMap: SpendingHeatMap[];
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  summary,
  categorySpending,
  balanceTrend,
  monthlyComparison,
  incomeSources,
  spendingTrend,
  budgetItems,
  spendingHeatMap,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const balanceChartData = {
    labels: balanceTrend.map(item => item.month),
    datasets: [
      {
        label: 'Balance',
        data: balanceTrend.map(item => item.balance),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Income',
        data: balanceTrend.map(item => item.income),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Expenses',
        data: balanceTrend.map(item => item.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const monthlyComparisonData = {
    labels: monthlyComparison.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyComparison.map(item => item.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Expenses',
        data: monthlyComparison.map(item => item.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Net',
        data: monthlyComparison.map(item => item.net),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const incomeSourcesData = {
    labels: incomeSources.map(source => source.source),
    datasets: [
      {
        data: incomeSources.map(source => source.amount),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(6, 182, 212)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const spendingTrendData = {
    labels: spendingTrend.slice(-30).map(item => item.date.slice(5)),
    datasets: [
      {
        label: 'Daily Spending',
        data: spendingTrend.slice(-30).map(item => item.amount),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: '7-Day Moving Average',
        data: spendingTrend.slice(-30).map(item => item.movingAverage),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderDash: [5, 5],
      },
    ],
  };

  const budgetComparisonData = {
    labels: budgetItems.map(item => item.category),
    datasets: [
      {
        label: 'Budgeted',
        data: budgetItems.map(item => item.budgeted),
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
        borderColor: 'rgb(107, 114, 128)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Actual',
        data: budgetItems.map(item => item.actual),
        backgroundColor: budgetItems.map(item => 
          item.actual > item.budgeted ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)'
        ),
        borderColor: budgetItems.map(item => 
          item.actual > item.budgeted ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)'
        ),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: 'top' as const,
        labels: {
          font: {
            size: isMobile ? 10 : 14,
            weight: 'bold' as const,
          },
          usePointStyle: true,
          padding: isMobile ? 10 : 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        padding: isMobile ? 8 : 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.parsed.y || context.parsed);
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          maxTicksLimit: isMobile ? 6 : 12,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
    animation: {
      duration: isMobile ? 1000 : 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' as const : 'right' as const,
        labels: {
          font: {
            size: isMobile ? 11 : 14,
            weight: 'bold' as const,
          },
          padding: isMobile ? 10 : 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        padding: isMobile ? 8 : 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const percentage = incomeSources[context.dataIndex].percentage;
            return [`${label}: ${value}`, `${percentage.toFixed(1)}%`];
          },
        },
      },
    },
    animation: {
      duration: isMobile ? 1000 : 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="enhanced-dashboard">
      {/* Header with Period Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Financial Dashboard</h2>
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" size="sm">
            Last {selectedPeriod === '1month' ? 'Month' : selectedPeriod === '3months' ? '3 Months' : '6 Months'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedPeriod('1month')}>Last Month</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedPeriod('3months')}>Last 3 Months</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedPeriod('6months')}>Last 6 Months</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Enhanced Summary Cards */}
      <Row className="mb-4 dashboard-grid">
        <Col xs={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm chart-card stat-card">
            <Card.Body className="text-center">
              <div className="mb-2">
                <i className={`bi bi-wallet2 ${isMobile ? 'fs-4' : 'fs-3'} text-primary`}></i>
              </div>
              <Card.Title className={`text-primary ${isMobile ? 'fs-6' : ''}`}>Balance</Card.Title>
              <h3 className={`text-primary stat-value ${isMobile ? 'fs-4' : ''}`}>{formatCurrency(summary.totalBalance)}</h3>
              {!isMobile && <Badge bg="success" className="mt-2">+12.5%</Badge>}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm chart-card stat-card">
            <Card.Body className="text-center">
              <div className="mb-2">
                <i className={`bi bi-arrow-up-circle ${isMobile ? 'fs-4' : 'fs-3'} text-success`}></i>
              </div>
              <Card.Title className={`text-success ${isMobile ? 'fs-6' : ''}`}>Income</Card.Title>
              <h3 className={`text-success stat-value ${isMobile ? 'fs-4' : ''}`}>{formatCurrency(summary.totalIncome)}</h3>
              {!isMobile && <Badge bg="success" className="mt-2">+8.2%</Badge>}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm chart-card stat-card">
            <Card.Body className="text-center">
              <div className="mb-2">
                <i className={`bi bi-arrow-down-circle ${isMobile ? 'fs-4' : 'fs-3'} text-danger`}></i>
              </div>
              <Card.Title className={`text-danger ${isMobile ? 'fs-6' : ''}`}>Expenses</Card.Title>
              <h3 className={`text-danger stat-value ${isMobile ? 'fs-4' : ''}`}>{formatCurrency(summary.totalExpenses)}</h3>
              {!isMobile && <Badge bg="danger" className="mt-2">+5.1%</Badge>}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm chart-card stat-card">
            <Card.Body className="text-center">
              <div className="mb-2">
                <i className={`bi bi-piggy-bank ${isMobile ? 'fs-4' : 'fs-3'} text-info`}></i>
              </div>
              <Card.Title className={`text-info ${isMobile ? 'fs-6' : ''}`}>Savings</Card.Title>
              <h3 className={`text-info stat-value ${isMobile ? 'fs-4' : ''}`}>{summary.savingsRate.toFixed(1)}%</h3>
              {!isMobile && <Badge bg="info" className="mt-2">Good</Badge>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Financial Health Score */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm chart-card">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <Card.Title className={`mb-0 ${isMobile ? 'fs-6' : ''}`}>Financial Health Score</Card.Title>
            </Card.Header>
            <Card.Body className={isMobile ? 'p-3' : 'p-4'}>
              <div className={`d-flex align-items-center ${isMobile ? 'flex-column text-center' : 'justify-content-between'}`}>
                <div className={isMobile ? 'mb-3' : ''}>
                  <h1 className={`fw-bold text-${getHealthScoreColor(summary.financialHealthScore)} ${isMobile ? 'fs-2' : 'display-4'}`}>
                    {summary.financialHealthScore}/100
                  </h1>
                  <Badge bg={getHealthScoreColor(summary.financialHealthScore)} className={`fs-6 ${isMobile ? 'fs-6' : ''}`}>
                    {getHealthScoreText(summary.financialHealthScore)}
                  </Badge>
                </div>
                <div className={`flex-grow-1 ${isMobile ? 'w-100 mt-3' : 'mx-4'}`}>
                  <div className="progress" style={{ height: isMobile ? '15px' : '20px' }}>
                    <div 
                      className={`progress-bar bg-${getHealthScoreColor(summary.financialHealthScore)}`}
                      style={{ width: `${summary.financialHealthScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className={isMobile ? 'mt-3' : 'text-end'}>
                  <small className="text-muted">
                    {isMobile ? 'Based on savings, expenses & income' : 'Based on savings rate, expense management, and income stability'}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Charts Row */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-graph-up me-2"></i>
                Balance Trend Overview
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '350px' }}>
                <Line data={balanceChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-success text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-pie-chart me-2"></i>
                Income Sources
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '350px' }}>
                <Doughnut data={incomeSourcesData} options={pieChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Monthly Comparison and Spending Trend */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-info text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-bar-chart me-2"></i>
                Monthly Comparison
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '300px' }}>
                <Bar data={monthlyComparisonData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-warning text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-graph-down me-2"></i>
                Spending Trend (Last 30 Days)
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '300px' }}>
                <Line data={spendingTrendData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget vs Actual */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-danger text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-calculator me-2"></i>
                Budget vs Actual Comparison
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '350px' }}>
                <Bar data={budgetComparisonData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-secondary text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-calendar-week me-2"></i>
                Spending Heat Map
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="spending-heatmap">
                {spendingHeatMap.map((day, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <span className="me-3" style={{ width: '40px' }}>{day.day}</span>
                    <div className="flex-grow-1">
                      <div className="progress" style={{ height: '25px' }}>
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${day.intensity * 100}%`,
                            backgroundColor: `rgba(239, 68, 68, ${day.intensity})`
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="ms-3 text-muted" style={{ width: '80px', textAlign: 'right' }}>
                      {formatCurrency(day.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Spending with Icons */}
      <Row>
        <Col>
          <Card className="chart-card">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-tags me-2"></i>
                Category Spending Details
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorySpending.map((category, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className={`${category.icon} me-2`} style={{ color: category.color }}></i>
                            {category.category}
                          </div>
                        </td>
                        <td>{formatCurrency(category.amount)}</td>
                        <td>{category.percentage.toFixed(1)}%</td>
                        <td>
                          <Badge bg={category.percentage > 30 ? 'warning' : 'success'}>
                            {category.percentage > 30 ? 'High' : 'Normal'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnhancedDashboard;
