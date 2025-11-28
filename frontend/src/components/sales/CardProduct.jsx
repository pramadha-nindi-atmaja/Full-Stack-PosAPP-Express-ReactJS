import PropTypes from "prop-types";
import { Card, Col } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

const CardProduct = ({ product, setCart }) => {
  return (
    <Col md={4} xs={6} className="mb-4">
      <Card 
        className={`shadow-sm border-0 ${product.isLowStock ? 'border border-danger' : ''}`} 
        onClick={() => setCart(product)}
        style={{ cursor: 'pointer' }}
      >
        <Card.Img width={"100%"} height={200} variant="top" src={product.url} />
        <Card.Body>
          <Card.Text>
            <small>{product.code}</small>
            <br />
            {product.productName.toUpperCase()} {" ( " + product.qty + " )"}
            {product.isLowStock && (
              <span className="text-danger ms-2">
                <FaExclamationTriangle /> Low Stock
              </span>
            )}
            <br />
            <strong>
              Rp. {parseInt(product.price).toLocaleString("id-ID")}
            </strong>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardProduct.propTypes = {
  product: PropTypes.object,
  setCart: PropTypes.func,
};

export default CardProduct;