import React from 'react';
import { Form, Card, Badge } from 'react-bootstrap';
import { UserRole } from '../types';
import { useFinance } from '../context/FinanceContext';

const RoleSelector: React.FC = () => {
  const { state, setUserRole } = useFinance();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === 'admin' ? 'danger' : 'primary';
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Current Role</h5>
            <Badge bg={getRoleBadgeVariant(state.userRole)} className="mt-1">
              {state.userRole.toUpperCase()}
            </Badge>
          </div>
          <div>
            <Form.Label className="me-2 mb-0">Switch Role:</Form.Label>
            <Form.Select
              value={state.userRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              style={{ width: '150px', display: 'inline-block' }}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </div>
        </div>
        <div className="mt-3">
          <small className="text-muted">
            {state.userRole === 'admin' 
              ? 'Admin: Can add, edit, and delete transactions' 
              : 'Viewer: Can only view transactions and data'
            }
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoleSelector;
