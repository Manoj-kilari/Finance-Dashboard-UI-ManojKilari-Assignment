import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Transaction } from '../types';
import { parseCSVFile, parseJSONFile, downloadImportTemplate, ImportResult } from '../utils/dataImport';

interface ImportModalProps {
  show: boolean;
  onHide: () => void;
  onImport: (transactions: Transaction[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ show, onHide, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setImportResult(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      let result: ImportResult;
      
      if (selectedFile.name.endsWith('.csv')) {
        result = await parseCSVFile(selectedFile);
      } else if (selectedFile.name.endsWith('.json')) {
        result = await parseJSONFile(selectedFile);
      } else {
        result = {
          success: false,
          message: 'Unsupported file format. Please use CSV or JSON files.',
          imported: 0,
          errors: ['Unsupported file format'],
          transactions: []
        };
      }
      
      setImportResult(result);
      
      if (result.success && result.transactions.length > 0) {
        onImport(result.transactions);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed',
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        transactions: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = (format: 'csv' | 'json') => {
    downloadImportTemplate(format);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportResult(null);
    setIsImporting(false);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Import Financial Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="upload" className="mb-3">
          <Tab eventKey="upload" title="Upload File">
            <div
              className={`border-dashed rounded p-4 text-center ${dragActive ? 'border-primary bg-light' : 'border-secondary'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{ minHeight: '200px', cursor: 'pointer' }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv,.json"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <div>
                  <i className="bi bi-file-earmark-text fs-1 text-primary mb-3"></i>
                  <h5>{selectedFile.name}</h5>
                  <p className="text-muted mb-3">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button variant="outline-secondary" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div>
                  <i className="bi bi-cloud-upload fs-1 text-muted mb-3"></i>
                  <h5>Drop your file here or click to browse</h5>
                  <p className="text-muted">
                    Supports CSV and JSON files
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="w-100"
                >
                  {isImporting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>
                      Import {selectedFile.name}
                    </>
                  )}
                </Button>
              </div>
            )}

            {importResult && (
              <div className="mt-3">
                {importResult.success ? (
                  <Alert variant="success">
                    <Alert.Heading>Import Successful!</Alert.Heading>
                    <p>{importResult.message}</p>
                    {importResult.errors.length > 0 && (
                      <div>
                        <strong>Warnings:</strong>
                        <ul className="mb-0 mt-2">
                          {importResult.errors.map((error, index) => (
                            <li key={index} className="text-warning">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Alert>
                ) : (
                  <Alert variant="danger">
                    <Alert.Heading>Import Failed</Alert.Heading>
                    <p>{importResult.message}</p>
                    {importResult.errors.length > 0 && (
                      <div>
                        <strong>Errors:</strong>
                        <ul className="mb-0 mt-2">
                          {importResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Alert>
                )}
              </div>
            )}
          </Tab>
          
          <Tab eventKey="template" title="Download Template">
            <div className="text-center py-4">
              <i className="bi bi-file-earmark-code fs-1 text-muted mb-3"></i>
              <h5>Import Templates</h5>
              <p className="text-muted mb-4">
                Download a template file to see the expected format for importing your data.
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-primary" onClick={() => handleDownloadTemplate('csv')}>
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  CSV Template
                </Button>
                <Button variant="outline-primary" onClick={() => handleDownloadTemplate('json')}>
                  <i className="bi bi-file-earmark-code me-2"></i>
                  JSON Template
                </Button>
              </div>
              
              <div className="mt-4 text-start">
                <h6>Required Fields:</h6>
                <ul>
                  <li><strong>date:</strong> Transaction date (YYYY-MM-DD format)</li>
                  <li><strong>category:</strong> One of the predefined categories</li>
                  <li><strong>description:</strong> Transaction description</li>
                  <li><strong>amount:</strong> Positive number (transaction amount)</li>
                  <li><strong>type:</strong> "income" or "expense"</li>
                </ul>
                
                <h6>Optional Fields:</h6>
                <ul>
                  <li><strong>tags:</strong> Semicolon-separated tags (CSV) or array (JSON)</li>
                  <li><strong>notes:</strong> Additional notes about the transaction</li>
                  <li><strong>recurring:</strong> "true" or "false" for recurring transactions</li>
                  <li><strong>frequency:</strong> "daily", "weekly", "monthly", or "yearly"</li>
                </ul>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {importResult?.success ? 'Done' : 'Cancel'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
