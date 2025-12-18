import { logger } from "../utils/winston.js";
import { getAllProducts, findCategoryById, findSupplierById } from "../utils/mockDb.js";

/**
 * Get product analytics data
 */
export const getProductAnalytics = async (req, res) => {
  try {
    const products = getAllProducts();
    
    // Calculate analytics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.qty <= (p.lowStockThreshold || 10)).length;
    const outOfStockProducts = products.filter(p => p.qty === 0).length;
    
    // Category distribution
    const categoryMap = {};
    products.forEach(product => {
      const categoryId = product['kategori[id]'];
      if (categoryId) {
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = {
            id: categoryId,
            name: product['kategori[name]'] || 'Unknown',
            count: 0
          };
        }
        categoryMap[categoryId].count++;
      }
    });
    
    const categoryDistribution = Object.values(categoryMap);
    
    // Supplier distribution
    const supplierMap = {};
    products.forEach(product => {
      const supplierId = product['supplier[id]'];
      if (supplierId) {
        if (!supplierMap[supplierId]) {
          supplierMap[supplierId] = {
            id: supplierId,
            firstName: product['supplier[first_name]'] || '',
            lastName: product['supplier[last_name]'] || '',
            count: 0
          };
        }
        supplierMap[supplierId].count++;
      }
    });
    
    const supplierDistribution = Object.values(supplierMap);
    
    // Price range analysis
    const prices = products.map(p => parseFloat(p.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    
    return res.status(200).json({
      message: "success",
      result: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        categoryDistribution,
        supplierDistribution,
        priceAnalysis: {
          min: minPrice,
          max: maxPrice,
          average: parseFloat(avgPrice.toFixed(2))
        }
      }
    });
  } catch (error) {
    logger.error(`getProductAnalytics - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null
    });
  }
};

/**
 * Get low stock alert data
 */
export const getLowStockAlerts = async (req, res) => {
  try {
    const products = getAllProducts();
    const lowStockProducts = products.filter(p => p.qty <= (p.lowStockThreshold || 10));
    
    // Sort by lowest stock first
    const sortedLowStock = lowStockProducts.sort((a, b) => a.qty - b.qty);
    
    return res.status(200).json({
      message: "success",
      result: sortedLowStock.slice(0, 20) // Limit to top 20
    });
  } catch (error) {
    logger.error(`getLowStockAlerts - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null
    });
  }
};