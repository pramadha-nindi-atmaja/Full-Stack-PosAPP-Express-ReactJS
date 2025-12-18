import { Card, Col, Row } from "react-bootstrap";
import { FaFileCsv, FaInfoCircle, FaCheck } from "react-icons/fa";

const ImportInstructions = () => {
  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <FaInfoCircle className="me-2" />
        How to Import Products
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h6><FaCheck className="text-success me-2" />Required Fields</h6>
            <ul>
              <li>productName - Name of the product</li>
              <li>qty - Quantity in stock</li>
              <li>price - Selling price</li>
              <li>kategoryId - Category ID (must exist)</li>
              <li>supplierId - Supplier ID (must exist)</li>
            </ul>
          </Col>
          <Col md={6}>
            <h6><FaCheck className="text-success me-2" />Optional Fields</h6>
            <ul>
              <li>barcode - Product barcode</li>
              <li>lowStockThreshold - Minimum stock level (defaults to 10)</li>
            </ul>
            <h6><FaFileCsv className="text-info me-2" />File Requirements</h6>
            <ul>
              <li>CSV format only</li>
              <li>Maximum 5MB file size</li>
              <li>UTF-8 encoding recommended</li>
            </ul>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ImportInstructions;