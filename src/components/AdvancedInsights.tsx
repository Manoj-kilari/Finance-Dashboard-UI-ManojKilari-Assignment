import React, { useMemo } from 'react';
import { Card, Row, Col, Badge, Alert, ProgressBar, Button } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import AnalyticsEngine, { PredictiveInsight, FinancialHealthScore } from '../utils/analytics';

const AdvancedInsights: React.FC = () => {
  const { state } = useFinance();

  const analytics = useMemo(() => {
    return new AnalyticsEngine(state.transactions);
  }, [state.transactions]);

  const insights = useMemo(() => {
    return analytics.generatePredictiveInsights();
  }, [analytics]);

  const healthScore = useMemo(() => {
    return analytics.calculateFinancialHealthScore();
  }, [analytics]);

  const spendingPatterns = useMemo(() => {
    return analytics.analyzeSpendingPatterns();
  }, [analytics]);

  const getInsightIcon = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'success': return 'bi-check-circle-fill text-success';
      case 'info': return 'bi-info-circle-fill text-info';
      case 'trend': return 'bi-graph-up text-primary';
      default: return 'bi-info-circle text-secondary';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const getHealthScoreLabel = (level: FinancialHealthScore['level']) => {
    switch (level) {
      case 'excellent': return 'Excellent Financial Health';
      case 'good': return 'Good Financial Health';
      case 'fair': return 'Fair Financial Health';
      case 'poor': return 'Needs Improvement';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      {/* Financial Health Score */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-heart-pulse me-2"></i>
            Financial Health Score
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <div className="display-4 fw-bold text-primary mb-2">
              {healthScore.score}/100
            </div>
            <Badge bg={getHealthScoreColor(healthScore.score)} className="fs-6">
              {getHealthScoreLabel(healthScore.level)}
            </Badge>
          </div>
          
          <ProgressBar 
            variant={getHealthScoreColor(healthScore.score)} 
            now={healthScore.score} 
            className="mb-4"
            style={{ height: '10px' }}
          />

          <Row className="mb-3">
            <Col md={3}>
              <div className="text-center">
                <div className="fs-5 fw-bold">{healthScore.factors.savingsRate.toFixed(1)}%</div>
                <small className="text-muted">Savings Rate</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="fs-5 fw-bold">{healthScore.factors.spendingConsistency.toFixed(1)}%</div>
                <small className="text-muted">Spending Consistency</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="fs-5 fw-bold">{healthScore.factors.incomeStability.toFixed(1)}%</div>
                <small className="text-muted">Income Stability</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="fs-5 fw-bold">{healthScore.factors.debtManagement.toFixed(1)}%</div>
                <small className="text-muted">Debt Management</small>
              </div>
            </Col>
          </Row>

          {healthScore.recommendations.length > 0 && (
            <Alert variant="info">
              <h6>Recommendations:</h6>
              <ul className="mb-0">
                {healthScore.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Predictive Insights */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-lightbulb me-2"></i>
            AI-Powered Insights
          </h5>
        </Card.Header>
        <Card.Body>
          {insights.length === 0 ? (
            <p className="text-muted">No insights available yet. Add more transactions to get personalized recommendations.</p>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 5).map((insight, index) => (
                <Alert key={index} variant={insight.type === 'warning' ? 'warning' : insight.type === 'success' ? 'success' : 'info'}>
                  <div className="d-flex align-items-start">
                    <i className={`bi ${getInsightIcon(insight.type)} me-3 fs-5`}></i>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{insight.title}</h6>
                      <p className="mb-2">{insight.description}</p>
                      {insight.recommendation && (
                        <div className="d-flex align-items-center justify-content-between">
                          <small className="text-muted">
                            <strong>Recommendation:</strong> {insight.recommendation}
                          </small>
                          <Badge bg="secondary">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Spending Patterns Analysis */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Spending Patterns Analysis
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {spendingPatterns.map((pattern, index) => (
              <Col md={6} className="mb-3" key={index}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{pattern.category}</h6>
                      <Badge 
                        bg={
                          pattern.trend === 'increasing' ? 'danger' : 
                          pattern.trend === 'decreasing' ? 'success' : 'secondary'
                        }
                      >
                        {pattern.trend}
                      </Badge>
                    </div>
                    
                    {pattern.changePercentage !== 0 && (
                      <div className="mb-2">
                        <small className="text-muted">
                          Change: 
                          <span className={`fw-bold ${
                            pattern.changePercentage > 0 ? 'text-danger' : 'text-success'
                          }`}>
                            {' '}{pattern.changePercentage > 0 ? '+' : ''}{pattern.changePercentage}%
                          </span>
                        </small>
                      </div>
                    )}
                    
                    {pattern.prediction > 0 && (
                      <div>
                        <small className="text-muted">
                          Predicted next month: 
                          <span className="fw-bold text-primary ms-1">
                            ${pattern.prediction.toFixed(2)}
                          </span>
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-lightning me-2"></i>
            Quick Actions
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Button variant="outline-primary" className="w-100">
                <i className="bi bi-piggy-bank me-2"></i>
                Set Budget Goals
              </Button>
            </Col>
            <Col md={4} className="mb-3">
              <Button variant="outline-success" className="w-100">
                <i className="bi bi-download me-2"></i>
                Export Financial Report
              </Button>
            </Col>
            <Col md={4} className="mb-3">
              <Button variant="outline-info" className="w-100">
                <i className="bi bi-calendar-check me-2"></i>
                Schedule Financial Review
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdvancedInsights;
