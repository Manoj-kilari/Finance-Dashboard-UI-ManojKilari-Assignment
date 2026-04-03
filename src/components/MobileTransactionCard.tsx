import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Transaction, UserRole } from '../types';
import { categoryColors, categoryIcons } from '../data/mockData';

interface MobileTransactionCardProps {
  transaction: Transaction;
  userRole: UserRole;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const MobileTransactionCard: React.FC<MobileTransactionCardProps> = ({
  transaction,
  userRole,
  onEdit,
  onDelete,
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      Food: '🍔',
      Transport: '🚗',
      Entertainment: '🎮',
      Shopping: '🛍️',
      Bills: '📄',
      Healthcare: '🏥',
      Education: '📚',
      Other: '📌',
    };
    return iconMap[category] || '📌';
  };

  const getCategoryColor = (category: string) => {
    return (categoryColors as any)[category] || '#6c757d';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="mobile-transaction-card mb-3" style={{ borderLeftColor: getCategoryColor(transaction.category), borderLeftWidth: '4px' }}>
      <Card.Body className="p-3">
        {/* Header with Date and Amount */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            <span className="me-2" style={{ fontSize: '1.25rem' }}>
              {getCategoryIcon(transaction.category)}
            </span>
            <div>
              <div className="fw-bold text-muted small">
                {formatDate(transaction.date)}
              </div>
              <Badge 
                bg="light" 
                text="dark" 
                className="mt-1"
                style={{ backgroundColor: getCategoryColor(transaction.category) + '20', color: getCategoryColor(transaction.category) }}
              >
                {transaction.category}
              </Badge>
            </div>
          </div>
          <div className="text-end">
            <div className={`fw-bold ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
              {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
            {transaction.isRecurring && (
              <Badge bg="info" className="mt-1 recurring-badge">
                Recurring
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="mb-0 text-truncate" title={transaction.description}>
            {transaction.description || 'No description'}
          </p>
        </div>

        {/* Action Buttons */}
        {userRole === 'admin' && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="flex-fill"
              onClick={() => onEdit(transaction)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="flex-fill"
              onClick={() => onDelete(transaction.id)}
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </Button>
          </div>
        )}

        {/* Recurring Info */}
        {transaction.isRecurring && transaction.recurringFrequency && (
          <div className="mt-2">
            <small className="text-muted viewer-recurring-info">
              <i className="bi bi-arrow-repeat me-1"></i>
              {transaction.recurringFrequency} • Ongoing
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MobileTransactionCard;
