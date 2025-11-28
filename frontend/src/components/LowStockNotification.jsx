import { useState, useEffect } from "react";
import { Nav, Badge } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { axiosInstance } from "../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

const LowStockNotification = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await axiosInstance.get("/api/products-low-stock", {
          headers: {
            Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
          },
        });
        setLowStockCount(response.data.result.length);
        setShowAlert(response.data.result.length > 0);
      } catch (error) {
        console.error("Error fetching low stock count:", error);
      }
    };

    // Fetch immediately on mount
    fetchLowStockCount();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchLowStockCount, 30000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!showAlert) {
    return null;
  }

  return (
    <Nav.Link href="/product" className="position-relative me-3">
      <FaExclamationTriangle className="text-warning" />
      <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
        {lowStockCount}
      </Badge>
    </Nav.Link>
  );
};

export default LowStockNotification;