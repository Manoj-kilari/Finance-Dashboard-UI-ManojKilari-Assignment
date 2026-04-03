import React from 'react';
import { Card, Row, Col, Placeholder, Table } from 'react-bootstrap';

// Summary card skeleton
export const SummaryCardSkeleton = () => (
  <Card className="h-100">
    <Card.Body>
      <Placeholder as="div" animation="glow">
        <Placeholder xs={6} className="mb-2" />
        <Placeholder xs={8} />
      </Placeholder>
    </Card.Body>
  </Card>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div>
    {/* Summary Cards Skeleton */}
    <Row className="mb-4">
      {[1, 2, 3].map((i) => (
        <Col md={4} key={i} className="mb-3">
          <SummaryCardSkeleton />
        </Col>
      ))}
    </Row>
    
    {/* Charts Skeleton */}
    <Row className="mb-4">
      <Col md={8} className="mb-3">
        <Card>
          <Card.Header>
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
          </Card.Header>
          <Card.Body style={{ height: '300px' }}>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '100%' }} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3">
        <Card>
          <Card.Header>
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          </Card.Header>
          <Card.Body style={{ height: '300px' }}>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '100%' }} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
    {/* Category Spending Skeleton */}
    <Card>
      <Card.Header>
        <Placeholder as="h5" animation="glow">
          <Placeholder xs={5} />
        </Placeholder>
      </Card.Header>
      <Card.Body>
        <Placeholder as="div" animation="glow">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-2">
              <Placeholder xs={3} className="me-2" />
              <Placeholder xs={6} />
            </div>
          ))}
        </Placeholder>
      </Card.Body>
    </Card>
  </div>
);

// Transactions table skeleton
export const TransactionsTableSkeleton = () => (
  <Card>
    <Card.Header className="d-flex justify-content-between align-items-center">
      <Placeholder as="h5" animation="glow">
        <Placeholder xs={4} />
      </Placeholder>
      <Placeholder.Button variant="primary" xs={3} />
    </Card.Header>
    <Card.Body>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <tr key={i}>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </td>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={10} />
                </Placeholder>
              </td>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
              </td>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={4} />
                </Placeholder>
              </td>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={5} />
                </Placeholder>
              </td>
              <td>
                <Placeholder as="div" animation="glow">
                  <Placeholder.Button variant="outline-primary" xs={3} className="me-1" />
                  <Placeholder.Button variant="outline-danger" xs={3} />
                </Placeholder>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

// Insights skeleton
export const InsightsSkeleton = () => (
  <Row>
    {[1, 2, 3, 4].map((i) => (
      <Col md={6} className="mb-3" key={i}>
        <Card>
          <Card.Body>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={7} className="mb-2" />
              <Placeholder xs={4} className="mb-3" />
              <Placeholder xs={10} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

// Modal skeleton
export const ModalSkeleton = () => (
  <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <Placeholder as="h5" animation="glow">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder.Button variant="close" xs={1} />
        </div>
        <div className="modal-body">
          <Placeholder as="div" animation="glow">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-3">
                <Placeholder xs={3} className="mb-2" />
                <Placeholder xs={12} />
              </div>
            ))}
          </Placeholder>
        </div>
        <div className="modal-footer">
          <Placeholder.Button variant="secondary" xs={2} className="me-2" />
          <Placeholder.Button variant="primary" xs={2} />
        </div>
      </div>
    </div>
  </div>
);

// Loading spinner with backdrop
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div 
    className="d-flex justify-content-center align-items-center"
    style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999 
    }}
  >
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted">{message}</div>
    </div>
  </div>
);

// Small inline loader
export const InlineLoader = () => (
  <div className="d-inline-block">
    <div className="spinner-border spinner-border-sm text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default {
  SummaryCardSkeleton,
  DashboardSkeleton,
  TransactionsTableSkeleton,
  InsightsSkeleton,
  ModalSkeleton,
  LoadingOverlay,
  InlineLoader,
};
