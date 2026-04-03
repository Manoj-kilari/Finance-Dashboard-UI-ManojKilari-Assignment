import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  InputGroup, 
  Dropdown, 
  Badge, 
  Pagination,
  Alert,
  Spinner
} from 'react-bootstrap';
import { Transaction, UserRole, AppFilters } from '../types';
import { categories, categoryColors, categoryIcons } from '../data/mockData';
import MobileTransactionCard from './MobileTransactionCard';

interface EnhancedTransactionsSectionProps {
  transactions: Transaction[];
  userRole: UserRole;
  filters: AppFilters;
  setFilters: (filters: AppFilters) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const EnhancedTransactionsSection: React.FC<EnhancedTransactionsSectionProps> = ({
  transactions,
  userRole,
  filters,
  setFilters,
  addTransaction,
  updateTransaction,
  deleteTransaction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'monthly' | 'daily' | 'weekly' | 'yearly',
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(transaction => transaction.category === selectedCategory);
    }

    // Transaction type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    // Amount range filter
    filtered = filtered.filter(transaction =>
      transaction.amount >= amountRange[0] && transaction.amount <= amountRange[1]
    );

    return filtered;
  }, [transactions, searchTerm, selectedCategory, filters.type, amountRange]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleAddTransaction = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: formData.type,
        notes: formData.notes,
        isRecurring: formData.isRecurring,
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined,
      };

      addTransaction(newTransaction);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTransaction = async () => {
    if (!selectedTransaction) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedTransaction: Transaction = {
        ...selectedTransaction,
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: formData.type,
        notes: formData.notes,
        isRecurring: formData.isRecurring,
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined,
      };

      updateTransaction(selectedTransaction.id, updatedTransaction);
      setShowEditModal(false);
      setSelectedTransaction(null);
      resetForm();
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      date: transaction.date,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      type: transaction.type,
      notes: transaction.notes || '',
      isRecurring: transaction.isRecurring || false,
      recurringFrequency: (transaction.recurringFrequency || 'monthly') as 'monthly' | 'daily' | 'weekly' | 'yearly',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      amount: '',
      category: '',
      description: '',
      type: 'expense' as 'income' | 'expense',
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly' as 'monthly' | 'daily' | 'weekly' | 'yearly',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setAmountRange([0, 10000]);
    setFilters({ category: 'All', type: 'all', dateRange: 'all', search: '' });
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== 'All',
    filters.type !== 'all',
    amountRange[0] > 0 || amountRange[1] < 10000
  ].filter(Boolean).length;

  // Detect mobile screen size
  React.useEffect(() => {
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

  return (
    <div className="enhanced-transactions-section">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Transactions</h3>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={clearFilters} disabled={activeFiltersCount === 0}>
            Clear Filters {activeFiltersCount > 0 && <Badge bg="primary" className="ms-1">{activeFiltersCount}</Badge>}
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Mobile Filters - Collapsible */}
      {isMobile && (
        <Card className="mb-3">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Filters</h6>
              <Badge bg="primary" pill>
                {activeFiltersCount}
              </Badge>
            </div>
            <Row className="g-2">
              <Col xs={12}>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                />
              </Col>
              <Col xs={6}>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="sm"
                >
                  <option value="All">All</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | 'income' | 'expense' })}
                  size="sm"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Desktop Filters */}
      {!isMobile && (
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | 'income' | 'expense' })}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={amountRange[0]}
                    onChange={(e) => setAmountRange([parseInt(e.target.value) || 0, amountRange[1]])}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={amountRange[1]}
                    onChange={(e) => setAmountRange([amountRange[0], parseInt(e.target.value) || 10000])}
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="text-muted">
            Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
          </span>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            <i className="bi bi-download me-2"></i>
            Export
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Export as CSV</Dropdown.Item>
            <Dropdown.Item>Export as PDF</Dropdown.Item>
            <Dropdown.Item>Export as JSON</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Mobile View - Cards */}
      {isMobile ? (
        <div className="mobile-table-card">
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                No transactions found
              </div>
            </div>
          ) : (
            paginatedTransactions.map((transaction) => (
              <MobileTransactionCard
                key={transaction.id}
                transaction={transaction}
                userRole={userRole}
                onEdit={openEditModal}
                onDelete={handleDeleteTransaction}
              />
            ))
          )}
        </div>
      ) : (
        /* Desktop View - Table */
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Tags</th>
                    <th>Recurring</th>
                    {userRole !== 'viewer' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={userRole === 'viewer' ? 6 : 7} className="text-center py-4">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </td>
                    </tr>
                  ) : paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={userRole === 'viewer' ? 6 : 7} className="text-center py-4">
                        <div className="text-muted">
                          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                          No transactions found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i 
                              className={`${categoryIcons[transaction.category as keyof typeof categoryIcons] || 'bi-tag'} me-2`}
                              style={{ color: categoryColors[transaction.category as keyof typeof categoryColors] }}
                            ></i>
                            {transaction.category}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{transaction.description}</div>
                            {transaction.notes && (
                              <small className="text-muted">{transaction.notes}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {transaction.tags?.map(tag => (
                              <Badge key={tag} bg="light" text="dark">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          {transaction.isRecurring ? (
                            <div className="d-flex flex-column gap-1">
                              <Badge bg="info" className="recurring-badge">
                                <i className="bi bi-arrow-repeat me-1"></i>
                                {transaction.recurringFrequency || 'Recurring'}
                              </Badge>
                              {userRole === 'admin' && (
                                <small className="text-muted admin-recurring-info">
                                  <i className="bi bi-info-circle me-1"></i>
                                  Auto-generated
                                </small>
                              )}
                              {userRole === 'viewer' && (
                                <small className="text-muted viewer-recurring-info">
                                  <i className="bi bi-clock me-1"></i>
                                  Repeats {transaction.recurringFrequency || 'monthly'}
                                </small>
                              )}
                            </div>
                          ) : (
                            <div className="d-flex flex-column gap-1">
                              <Badge bg="secondary" className="non-recurring-badge">
                                <i className="bi bi-x-circle me-1"></i>
                                One-time
                              </Badge>
                              {userRole === 'viewer' && (
                                <small className="text-muted viewer-recurring-info">
                                  <i className="bi bi-calendar-check me-1"></i>
                                  Single transaction
                                </small>
                              )}
                            </div>
                          )}
                        </td>
                        {userRole !== 'viewer' && (
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openEditModal(transaction)}
                                aria-label="Edit transaction"
                                className={userRole === 'admin' ? 'admin-action-btn' : ''}
                              >
                                <i className="bi bi-pencil"></i>
                                {userRole === 'admin' && <span className="ms-1">Edit</span>}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                aria-label="Delete transaction"
                                className={userRole === 'admin' ? 'admin-action-btn' : ''}
                              >
                                <i className="bi bi-trash"></i>
                                {userRole === 'admin' && <span className="ms-1">Delete</span>}
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Recurring Transaction"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              />
            </Form.Group>
            {formData.isRecurring && (
              <Form.Group className="mb-3">
                <Form.Label>Frequency</Form.Label>
                <Form.Select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurringFrequency: e.target.value as 'monthly' | 'daily' | 'weekly' | 'yearly' }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTransaction} disabled={isLoading}>
            {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Add Transaction'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Recurring Transaction"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              />
            </Form.Group>
            {formData.isRecurring && (
              <Form.Group className="mb-3">
                <Form.Label>Frequency</Form.Label>
                <Form.Select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurringFrequency: e.target.value as 'monthly' | 'daily' | 'weekly' | 'yearly' }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditTransaction} disabled={isLoading}>
            {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Transaction'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnhancedTransactionsSection;
