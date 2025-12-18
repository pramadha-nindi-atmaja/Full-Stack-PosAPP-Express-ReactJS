import { axiosInstance } from "../../auth/AxiosConfig.jsx";
const axios = axiosInstance;
import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Row,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../NavbarComponent.jsx";
import ImportInstructions from "./ImportInstructions.jsx";
import ImportHistory from "./ImportHistory.jsx";
import secureLocalStorage from "react-secure-storage";

const BulkImportProduct = () => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a CSV file to import", {
        position: "top-center",
      });
      return;
    }

    // Check file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
      toast.error("Only CSV files are allowed", {
        position: "top-center",
      });
      return;
    }

    setIsSubmitting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/products-bulk-import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
        },
      });

      setImportResult(response.data.result);
      
      if (response.data.result.successCount > 0) {
        toast.success(`Successfully imported ${response.data.result.successCount} products`, {
          position: "top-center",
        });
      }
      
      if (response.data.result.errorCount > 0) {
        toast.warn(`${response.data.result.errorCount} rows had errors. Please check the details below.`, {
          position: "top-center",
        });
      }
    } catch (error) {
      const errMessage = error.response?.data?.message || "An error occurred during import";
      toast.error(errMessage, {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    // Create a link to the template file in the assets folder
    const link = document.createElement("a");
    link.href = "/src/assets/product_import_template.csv";
    link.setAttribute("download", "product_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Master</Breadcrumb.Item>
              <Breadcrumb.Item href="/product">Product</Breadcrumb.Item>
              <Breadcrumb.Item active>Bulk Import</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <h3>Bulk Import Products</h3>
            <p>Upload a CSV file to import multiple products at once.</p>
            
            <ImportInstructions />
            
            <div className="mb-4">
              <Button variant="info" onClick={downloadTemplate}>
                Download CSV Template
              </Button>
              <p className="mt-2">
                <small>Download the template to see the required format</small>
              </p>
            </div>
            
            <ImportHistory />

            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  CSV File
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Only CSV files are allowed. Maximum file size is 5MB.
                  </Form.Text>
                </Col>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => navigate("/product")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !file}
                >
                  {isSubmitting ? "Importing..." : "Import Products"}
                </Button>
              </div>
            </Form>

            {importResult && (
              <div className="mt-4">
                <h5>Import Results</h5>
                <Alert variant="info">
                  <p>
                    Successfully imported: <strong>{importResult.successCount}</strong> products<br />
                    Errors: <strong>{importResult.errorCount}</strong> rows
                  </p>
                </Alert>

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-3">
                    <h6>Error Details:</h6>
                    <div className="overflow-auto" style={{ maxHeight: "300px" }}>
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Row</th>
                            <th>Errors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importResult.errors.map((error, index) => (
                            <tr key={index}>
                              <td>Row {error.row}</td>
                              <td>
                                <ul className="mb-0">
                                  {error.errors.map((err, errIndex) => (
                                    <li key={errIndex}>{err}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BulkImportProduct;