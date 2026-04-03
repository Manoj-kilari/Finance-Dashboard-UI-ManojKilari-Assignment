import React, { useState } from 'react';
import { Container, Nav, Navbar, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnhancedDashboard from './components/EnhancedDashboard';
import EnhancedTransactionsSection from './components/EnhancedTransactionsSection';
import ThemeToggle from './components/ThemeToggle';
import ExportModal from './components/ExportModal';
import ImportModal from './components/ImportModal';
import RoleSelector from './components/RoleSelector';
import { 
  mockMonthlyComparison, 
  mockIncomeSources, 
  mockSpendingTrend, 
  mockBudgetItems, 
  mockSpendingHeatMap 
} from './data/mockData';

// Main App Content Component
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { addTransaction, updateTransaction, deleteTransaction, setFilters, state } = useFinance();

  return (
    <div className="App">
      <Navbar expand="lg" className="mb-4 navbar-theme">
        <Container>
          <Navbar.Brand href="#">
            <strong>Finance Dashboard</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => setActiveTab('dashboard')}>
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab('transactions')}>
                Transactions
              </Nav.Link>
              <Nav.Link onClick={() => setShowImportModal(true)}>
                <i className="bi bi-upload me-1"></i>
                Import
              </Nav.Link>
              <Nav.Link onClick={() => setShowExportModal(true)}>
                <i className="bi bi-download me-1"></i>
                Export
              </Nav.Link>
              <ThemeToggle />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <RoleSelector />
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'dashboard')}
          className="mb-4"
        >
          <Tab eventKey="dashboard" title="Dashboard Overview">
            <EnhancedDashboard
              summary={state.summary}
              categorySpending={state.categorySpending}
              balanceTrend={state.balanceTrend}
              monthlyComparison={mockMonthlyComparison}
              incomeSources={mockIncomeSources}
              spendingTrend={mockSpendingTrend}
              budgetItems={mockBudgetItems}
              spendingHeatMap={mockSpendingHeatMap}
            />
          </Tab>
          <Tab eventKey="transactions" title="Transactions">
            <EnhancedTransactionsSection
              transactions={state.transactions}
              userRole={state.userRole}
              filters={state.filters}
              setFilters={setFilters}
              addTransaction={addTransaction}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
            />
          </Tab>
        </Tabs>
      </Container>

      {/* Export Modal */}
      <ExportModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        transactions={state.transactions}
      />

      {/* Import Modal */}
      <ImportModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onImport={(transactions) => {
          transactions.forEach(transaction => addTransaction(transaction));
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
