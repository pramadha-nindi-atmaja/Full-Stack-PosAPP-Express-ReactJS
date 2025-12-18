import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaFileExport, FaFileCsv, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

const ExportProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      let url = "";
      let filename = "";
      
      switch (exportFormat) {
        case "csv":
          url = "/api/products-excel"; // Using existing endpoint
          filename = "products.csv";
          break;
        case "pdf":
          url = "/api/products-pdf";
          filename = "products.pdf";
          break;
        case "excel":
          url = "/api/products-excel";
          filename = "products.xlsx";
          break;
        default:
          throw new Error("Invalid export format");
      }
      
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
        },
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline-primary" 
        size="sm" 
        onClick={() => setShowModal(true)}
        className="me-2"
      >
        <FaFileExport className="me-1" /> Export
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Export Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose the format you want to export your products data to:</p>
          
          <Form>
            <Form.Check
              type="radio"
              id="csv"
              name="exportFormat"
              label={
                <span>
                  <FaFileCsv className="me-2 text-info" /> 
                  CSV Format
                </span>
              }
              value="csv"
              checked={exportFormat === "csv"}
              onChange={(e) => setExportFormat(e.target.value)}
              className="mb-2"
            />
            
            <Form.Check
              type="radio"
              id="pdf"
              name="exportFormat"
              label={
                <span>
                  <FaFilePdf className="me-2 text-danger" /> 
                  PDF Format
                </span>
              }
              value="pdf"
              checked={exportFormat === "pdf"}
              onChange={(e) => setExportFormat(e.target.value)}
              className="mb-2"
            />
            
            <Form.Check
              type="radio"
              id="excel"
              name="exportFormat"
              label={
                <span>
                  <FaFileExcel className="me-2 text-success" /> 
                  Excel Format
                </span>
              }
              value="excel"
              checked={exportFormat === "excel"}
              onChange={(e) => setExportFormat(e.target.value)}
              className="mb-2"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export Products"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExportProducts;