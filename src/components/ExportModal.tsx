import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Transaction, ExportOptions } from '../types';
import { categories } from '../data/mockData';
import { exportToCSV, exportToJSON, exportToPDF, filterTransactionsForExport, generateFinancialSummary } from '../utils/dataExport';

interface ExportModalProps {
  show: boolean;
  onHide: () => void;
  transactions: Transaction[];
}

const ExportModal: React.FC<ExportModalProps> = ({ show, onHide, transactions }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'all',
    categories: [],
    includeCharts: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const filteredTransactions = filterTransactionsForExport(transactions, exportOptions);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `financial-data-${timestamp}`;

      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(filteredTransactions, filename);
          break;
        case 'json':
          exportToJSON(filteredTransactions, filename);
          break;
        case 'pdf':
          await exportToPDF(filteredTransactions, filename);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Also export summary if charts are included
      if (exportOptions.includeCharts) {
        const summary = generateFinancialSummary(filteredTransactions);
        const summaryContent = JSON.stringify(summary, null, 2);
        const summaryBlob = new Blob([summaryContent], { type: 'application/json' });
        const summaryUrl = window.URL.createObjectURL(summaryBlob);
        const summaryLink = document.createElement('a');
        summaryLink.href = summaryUrl;
        summaryLink.download = `financial-summary-${timestamp}.json`;
        document.body.appendChild(summaryLink);
        summaryLink.click();
        document.body.removeChild(summaryLink);
        window.URL.revokeObjectURL(summaryUrl);
      }

      onHide();
    } catch (err) {
      setError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setExportOptions(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const filteredTransactionsCount = filterTransactionsForExport(transactions, exportOptions).length;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Financial Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Export Format</Form.Label>
            <Form.Select
              value={exportOptions.format}
              onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'csv' | 'pdf' | 'json' }))}
            >
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="json">JSON (Data Format)</option>
              <option value="pdf">PDF Report</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date Range</Form.Label>
            <Form.Select
              value={exportOptions.dateRange}
              onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <div className="d-flex flex-wrap gap-2">
                {categories.filter(cat => cat !== 'All').map(category => (
                  <Button
                    key={category}
                    variant={exportOptions.categories.includes(category) ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  {exportOptions.categories.length === 0 
                    ? 'All categories will be exported' 
                    : `${exportOptions.categories.length} categor${exportOptions.categories.length === 1 ? 'y' : 'ies'} selected`}
                </small>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Include financial summary and analytics"
              checked={exportOptions.includeCharts}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
            />
          </Form.Group>

          <div className="bg-light p-3 rounded">
            <h6>Export Preview</h6>
            <p className="mb-1">
              <strong>Transactions to export:</strong> {filteredTransactionsCount}
            </p>
            <p className="mb-1">
              <strong>Format:</strong> {exportOptions.format.toUpperCase()}
            </p>
            <p className="mb-0">
              <strong>Date range:</strong> {exportOptions.dateRange === 'all' ? 'All time' : exportOptions.dateRange}
            </p>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleExport} 
          disabled={isExporting || filteredTransactionsCount === 0}
        >
          {isExporting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Exporting...
            </>
          ) : (
            <>
              <i className="bi bi-download me-2"></i>
              Export {filteredTransactionsCount} Transaction{filteredTransactionsCount !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
