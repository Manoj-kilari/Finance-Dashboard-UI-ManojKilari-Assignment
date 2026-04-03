import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import { FinancialSummary, CategorySpending, BalanceTrend } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardOverviewProps {
  summary: FinancialSummary;
  categorySpending: CategorySpending[];
  balanceTrend: BalanceTrend[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  categorySpending,
  balanceTrend,
}) => {
  const balanceChartData = {
    labels: balanceTrend.map(item => item.month),
    datasets: [
      {
        label: 'Balance Trend',
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
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const spendingChartData = {
    labels: categorySpending.map(item => item.category),
    datasets: [
      {
        data: categorySpending.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
      },
    ],
  };

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `Balance: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          callback: (value: any) => formatCurrency(value)
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    }
  };

  const spendingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-primary">
            <Card.Body className="text-center">
              <Card.Title className="text-primary">Total Balance</Card.Title>
              <h3 className="text-primary">{formatCurrency(summary.totalBalance)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-success">
            <Card.Body className="text-center">
              <Card.Title className="text-success">Total Income</Card.Title>
              <h3 className="text-success">{formatCurrency(summary.totalIncome)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-danger">
            <Card.Body className="text-center">
              <Card.Title className="text-danger">Total Expenses</Card.Title>
              <h3 className="text-danger">{formatCurrency(summary.totalExpenses)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-info">
            <Card.Body className="text-center">
              <Card.Title className="text-info">Monthly Income</Card.Title>
              <h3 className="text-info">{formatCurrency(summary.monthlyIncome)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="chart-card">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <Card.Title className="mb-0 d-flex align-items-center">
                <i className="bi bi-graph-up me-2"></i>
                Balance Trend
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div style={{ height: '350px' }}>
                <Line data={balanceChartData} options={balanceChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Spending Breakdown</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut data={spendingChartData} options={spendingChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Spending Details */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Category Spending Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorySpending.map((category, index) => (
                      <tr key={index}>
                        <td>{category.category}</td>
                        <td>{formatCurrency(category.amount)}</td>
                        <td>{category.percentage.toFixed(1)}%</td>
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

export default DashboardOverview;
