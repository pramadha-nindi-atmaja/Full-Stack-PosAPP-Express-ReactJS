import { useState, useEffect } from "react";
import { Card, Row, Col, ProgressBar, Table } from "react-bootstrap";
import { FaChartBar, FaBoxes, FaExclamationTriangle, FaDollarSign } from "react-icons/fa";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

const ProductAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get("/api/product-analytics", {
        headers: {
          Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
        },
      });
      setAnalytics(response.data.result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Body>
          <div className="text-center">Loading analytics...</div>
        </Card.Body>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <Card.Body>
          <div className="text-center">Unable to load analytics data</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <h5><FaChartBar className="me-2" />Inventory Analytics</h5>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FaBoxes className="text-primary" style={{ fontSize: '2rem' }} />
              <Card.Title className="mt-2">{analytics.totalProducts}</Card.Title>
              <Card.Text>Total Products</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FaExclamationTriangle className="text-warning" style={{ fontSize: '2rem' }} />
              <Card.Title className="mt-2">{analytics.lowStockProducts}</Card.Title>
              <Card.Text>Low Stock Items</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FaDollarSign className="text-success" style={{ fontSize: '2rem' }} />
              <Card.Title className="mt-2">Rp{analytics.priceAnalysis.average.toLocaleString()}</Card.Title>
              <Card.Text>Avg. Price</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Category Distribution</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Products</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.categoryDistribution.map((category, index) => (
                      <tr key={index}>
                        <td>{category.name}</td>
                        <td>{category.count}</td>
                        <td>
                          <ProgressBar 
                            now={(category.count / analytics.totalProducts) * 100} 
                            label={`${Math.round((category.count / analytics.totalProducts) * 100)}%`}
                            visuallyHidden
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Price Analysis</Card.Header>
            <Card.Body>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td>Highest Price:</td>
                    <td className="text-end">Rp{analytics.priceAnalysis.max.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Lowest Price:</td>
                    <td className="text-end">Rp{analytics.priceAnalysis.min.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Average Price:</td>
                    <td className="text-end">Rp{analytics.priceAnalysis.average.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
              
              <div className="mt-3">
                <h6>Stock Status</h6>
                <ProgressBar>
                  <ProgressBar 
                    variant="success" 
                    now={((analytics.totalProducts - analytics.lowStockProducts - analytics.outOfStockProducts) / analytics.totalProducts) * 100} 
                    label={`Good (${analytics.totalProducts - analytics.lowStockProducts - analytics.outOfStockProducts})`}
                    visuallyHidden
                  />
                  <ProgressBar 
                    variant="warning" 
                    now={(analytics.lowStockProducts / analytics.totalProducts) * 100} 
                    label={`Low (${analytics.lowStockProducts})`}
                    visuallyHidden
                  />
                  <ProgressBar 
                    variant="danger" 
                    now={(analytics.outOfStockProducts / analytics.totalProducts) * 100} 
                    label={`Out (${analytics.outOfStockProducts})`}
                    visuallyHidden
                  />
                </ProgressBar>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductAnalytics;