import React, { useState, useMemo } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import { Transaction, UserRole } from '../types';
import { useFinance } from '../context/FinanceContext';
import { categories } from '../data/mockData';

interface TransactionsSectionProps {
  userRole: UserRole;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ userRole }) => {
  const { state, setFilters, resetFilters, deleteTransaction, addTransaction, updateTransaction } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: '',
    amount: 0,
    category: '',
    description: '',
    type: 'expense',
  });

  const filteredTransactions = useMemo(() => {
    const filtered = state.transactions.filter(transaction => {
      const matchesCategory = state.filters.category === 'All' || transaction.category === state.filters.category;
      const matchesType = state.filters.type === 'all' || transaction.type === state.filters.type;
      const matchesSearch = transaction.description.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(state.filters.search.toLowerCase());
      
      return matchesCategory && matchesType && matchesSearch;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [state.transactions, state.filters, sortField, sortDirection]);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.date && newTransaction.amount && newTransaction.category && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: newTransaction.date,
        amount: Number(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        type: newTransaction.type as 'income' | 'expense',
      };
      addTransaction(transaction);
      setNewTransaction({
        date: '',
        amount: 0,
        category: '',
        description: '',
        type: 'expense',
      });
      setShowAddModal(false);
    }
  };

  const handleEditTransaction = () => {
    if (editingTransaction && newTransaction.date && newTransaction.amount && newTransaction.category && newTransaction.description) {
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        date: newTransaction.date,
        amount: Number(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        type: newTransaction.type as 'income' | 'expense',
      };
      updateTransaction(editingTransaction.id, updatedTransaction);
      setEditingTransaction(null);
      setNewTransaction({
        date: '',
        amount: 0,
        category: '',
        description: '',
        type: 'expense',
      });
      setShowEditModal(false);
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      date: transaction.date,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      type: transaction.type,
    });
    setShowEditModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transactions</h2>
        {userRole === 'admin' && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Transaction
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  value={state.filters.search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ search: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={state.filters.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ category: e.target.value })}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={state.filters.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ type: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <div>
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('description')}
                  >
                    Description {getSortIcon('description')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('category')}
                  >
                    Category {getSortIcon('category')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('type')}
                  >
                    Type {getSortIcon('type')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('amount')}
                  >
                    Amount {getSortIcon('amount')}
                  </th>
                  {userRole === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={`badge bg-${transaction.type === 'income' ? 'success' : 'danger'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    {userRole === 'admin' && (
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(transaction)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-4">
              <p>No transactions found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Transaction Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newTransaction.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newTransaction.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newTransaction.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newTransaction.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newTransaction.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newTransaction.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newTransaction.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newTransaction.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditTransaction}>
            Update Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionsSection;
