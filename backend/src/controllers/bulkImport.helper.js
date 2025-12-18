/**
 * Helper functions for bulk import operations
 */

/**
 * Normalize field names from various possible formats
 * @param {Object} row - CSV row data
 * @returns {Object} Normalized product data
 */
export const normalizeProductData = (row) => {
  return {
    productName: row.productName || row['Product Name'] || row['product_name'] || '',
    qty: parseInt(row.qty || row.quantity || row.Qty || row.Quantity || 0),
    price: parseFloat(row.price || row.Price || 0),
    kategoryId: parseInt(row.kategoryId || row.categoryId || row.CategoryId || row['Category ID'] || 0),
    supplierId: parseInt(row.supplierId || row.SupplierId || row['Supplier ID'] || 0),
    barcode: row.barcode || row.Barcode || row['Product Barcode'] || null,
    lowStockThreshold: parseInt(row.lowStockThreshold || row.LowStockThreshold || row['Low Stock Threshold'] || 10)
  };
};

/**
 * Validate product data
 * @param {Object} product - Product data to validate
 * @returns {Array} Array of validation errors
 */
export const validateProductData = (product) => {
  const errors = [];
  
  if (!product.productName || product.productName.trim() === '') {
    errors.push('Product name is required');
  }
  
  if (isNaN(product.qty) || product.qty < 0) {
    errors.push('Quantity must be a valid non-negative number');
  }
  
  if (isNaN(product.price) || product.price <= 0) {
    errors.push('Price must be a valid positive number');
  }
  
  if (isNaN(product.kategoryId) || product.kategoryId <= 0) {
    errors.push('Category ID must be a valid positive number');
  }
  
  if (isNaN(product.supplierId) || product.supplierId <= 0) {
    errors.push('Supplier ID must be a valid positive number');
  }
  
  if (product.lowStockThreshold !== undefined && (isNaN(product.lowStockThreshold) || product.lowStockThreshold < 0)) {
    errors.push('Low stock threshold must be a valid non-negative number');
  }
  
  return errors;
};

/**
 * Format error messages for consistent reporting
 * @param {Array} errors - Array of error objects
 * @param {Number} rowIndex - Index of the row in the CSV
 * @returns {Array} Formatted error messages
 */
export const formatImportErrors = (errors, rowIndex) => {
  return errors.map(error => ({
    row: rowIndex + 2, // +2 because of header row and 0-based index
    message: error
  }));
};