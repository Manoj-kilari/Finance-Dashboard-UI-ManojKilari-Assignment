import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Badge, ProgressBar, Alert, Modal } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';

interface Budget {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const BudgetTracker: React.FC = () => {
  const { state } = useFinance();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
  });
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: ''
  });

  // Calculate current spending by category
  const currentSpending = useMemo(() => {
    const spending: Record<string, number> = {};
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    state.transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .forEach(transaction => {
        spending[transaction.category] = (spending[transaction.category] || 0) + transaction.amount;
      });
    
    return spending;
  }, [state.transactions]);

  // Mock budgets (in real app, this would come from state/backend)
  const budgets: Budget[] = useMemo(() => {
    const categories = Object.keys(currentSpending);
    return categories.map(category => ({
      category,
      budgeted: currentSpending[category] * 1.2, // 20% buffer
      actual: currentSpending[category],
      variance: currentSpending[category] * 0.2,
      period: 'monthly' as const
    }));
  }, [currentSpending]);

  // Mock savings goals
  const savingsGoals: BudgetGoal[] = useMemo(() => [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: '2024-08-31',
      category: 'Travel'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 800,
      deadline: '2024-10-31',
      category: 'Technology'
    }
  ], []);

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.actual / budget.budgeted) * 100;
    if (percentage > 100) return { variant: 'danger' as const, status: 'Over Budget' };
    if (percentage > 90) return { variant: 'warning' as const, status: 'Near Limit' };
    if (percentage > 75) return { variant: 'info' as const, status: 'On Track' };
    return { variant: 'success' as const, status: 'Good' };
  };

  const getGoalProgress = (goal: BudgetGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      progress,
      daysUntilDeadline,
      onTrack: daysUntilDeadline > 0 && progress >= (1 - daysUntilDeadline / 365) * 100
    };
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to state/backend
    console.log('Budget:', budgetForm);
    setShowBudgetModal(false);
    setBudgetForm({ category: '', amount: '', period: 'monthly' });
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to state/backend
    console.log('Goal:', goalForm);
    setShowGoalModal(false);
    setGoalForm({ name: '', targetAmount: '', deadline: '', category: '' });
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.actual, 0);
  const totalSaved = budgets.reduce((sum, b) => sum + Math.max(0, b.budgeted - b.actual), 0);

  return (
    <div>
      {/* Budget Overview */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary mb-2">${totalBudgeted.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Budgeted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning mb-2">${totalSpent.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success mb-2">${totalSaved.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Saved</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget Categories */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-piggy-bank me-2"></i>
            Budget Categories
          </h5>
          <Button variant="primary" size="sm" onClick={() => setShowBudgetModal(true)}>
            <i className="bi bi-plus-circle me-1"></i>
            Add Budget
          </Button>
        </Card.Header>
        <Card.Body>
          {budgets.length === 0 ? (
            <p className="text-muted">No budgets set. Click "Add Budget" to get started.</p>
          ) : (
            <Row>
              {budgets.map((budget, index) => {
                const status = getBudgetStatus(budget);
                const percentage = Math.min((budget.actual / budget.budgeted) * 100, 100);
                
                return (
                  <Col md={6} className="mb-3" key={index}>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{budget.category}</h6>
                          <Badge bg={status.variant}>{status.status}</Badge>
                        </div>
                        
                        <div className="mb-2">
                          <ProgressBar 
                            variant={status.variant} 
                            now={percentage} 
                            style={{ height: '8px' }}
                          />
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">
                            ${budget.actual.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                          </small>
                          <small className={`fw-bold ${
                            budget.actual > budget.budgeted ? 'text-danger' : 'text-success'
                          }`}>
                            ${Math.abs(budget.budgeted - budget.actual).toFixed(2)}
                            {budget.actual > budget.budgeted ? ' over' : ' remaining'}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Savings Goals */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-target me-2"></i>
            Savings Goals
          </h5>
          <Button variant="success" size="sm" onClick={() => setShowGoalModal(true)}>
            <i className="bi bi-plus-circle me-1"></i>
            Add Goal
          </Button>
        </Card.Header>
        <Card.Body>
          {savingsGoals.length === 0 ? (
            <p className="text-muted">No savings goals set. Click "Add Goal" to get started.</p>
          ) : (
            <Row>
              {savingsGoals.map((goal) => {
                const progress = getGoalProgress(goal);
                
                return (
                  <Col md={6} className="mb-3" key={goal.id}>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{goal.name}</h6>
                          <Badge bg={progress.onTrack ? 'success' : 'warning'}>
                            {progress.onTrack ? 'On Track' : 'Behind'}
                          </Badge>
                        </div>
                        
                        <div className="mb-2">
                          <ProgressBar 
                            variant="success" 
                            now={progress.progress} 
                            style={{ height: '8px' }}
                          />
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <small className="text-muted">
                            ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                          </small>
                          <small className="text-primary fw-bold">
                            {progress.progress.toFixed(1)}%
                          </small>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {progress.daysUntilDeadline} days left
                          </small>
                          <small className="text-muted">
                            ${Math.max(0, goal.targetAmount - goal.currentAmount).toFixed(2)} to go
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Budget Modal */}
      <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Budget Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBudgetSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                required
              >
                <option value="">Select category...</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Healthcare">Healthcare</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Budget Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={budgetForm.amount}
                onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                placeholder="Enter budget amount"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Period</Form.Label>
              <Form.Select
                value={budgetForm.period}
                onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value as any})}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowBudgetModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Budget
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Goal Modal */}
      <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Savings Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGoalSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Goal Name</Form.Label>
              <Form.Control
                type="text"
                value={goalForm.name}
                onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                placeholder="e.g., Emergency Fund, Vacation"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Target Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                placeholder="Enter target amount"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Target Date</Form.Label>
              <Form.Control
                type="date"
                value={goalForm.deadline}
                onChange={(e) => setGoalForm({...goalForm, deadline: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={goalForm.category}
                onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                placeholder="e.g., Savings, Travel, Technology"
                required
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowGoalModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add Goal
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BudgetTracker;
