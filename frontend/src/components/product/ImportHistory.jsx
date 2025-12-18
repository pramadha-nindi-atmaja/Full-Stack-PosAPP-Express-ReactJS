import { useState, useEffect } from "react";
import { Card, Table, Badge } from "react-bootstrap";
import { FaHistory, FaCheck, FaTimes, FaHourglassHalf } from "react-icons/fa";
import secureLocalStorage from "react-secure-storage";

const ImportHistory = () => {
  const [importHistory, setImportHistory] = useState([]);

  useEffect(() => {
    // Load import history from localStorage
    const history = secureLocalStorage.getItem("productImportHistory") || [];
    setImportHistory(history);
  }, []);

  const clearHistory = () => {
    secureLocalStorage.removeItem("productImportHistory");
    setImportHistory([]);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "success": return "success";
      case "error": return "danger";
      case "partial": return "warning";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success": return <FaCheck />;
      case "error": return <FaTimes />;
      case "partial": return <FaHourglassHalf />;
      default: return null;
    }
  };

  if (importHistory.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
        <span><FaHistory className="me-2" />Import History</span>
        <button className="btn btn-sm btn-outline-light" onClick={clearHistory}>
          Clear History
        </button>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>File Name</th>
                <th>Products</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {importHistory.slice(0, 5).map((record, index) => (
                <tr key={index}>
                  <td>{formatDateTime(record.timestamp)}</td>
                  <td>{record.fileName}</td>
                  <td>{record.totalProducts}</td>
                  <td>
                    <Badge bg={getStatusVariant(record.status)}>
                      {getStatusIcon(record.status)} {record.status}
                    </Badge>
                  </td>
                  <td>
                    {record.successCount !== undefined && (
                      <small>
                        {record.successCount} success, {record.errorCount} errors
                      </small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImportHistory;