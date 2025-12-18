import fs from 'fs';
import path from 'path';

// Load data from db.json
const dbPath = path.join(process.cwd(), 'db.json');
let dbData = {};

try {
  const rawData = fs.readFileSync(dbPath, 'utf8');
  dbData = JSON.parse(rawData);
} catch (error) {
  console.error('Error loading mock database:', error);
  dbData = {
    users: [],
    suppliers: [],
    category: [],
    product: []
  };
}

// Helper functions for mock database operations
export const findUserByUsername = (username) => {
  return dbData.users.find(user => user.userName === username);
};

export const findUserById = (id) => {
  return dbData.users.find(user => user.id === parseInt(id));
};

export const getAllUsers = () => {
  return dbData.users;
};

export const getAllSuppliers = () => {
  return dbData.suppliers;
};

export const getAllCategories = () => {
  return dbData.category;
};

export const getAllProducts = () => {
  return dbData.product;
};

export const findProductById = (id) => {
  return dbData.product.find(product => product.id === parseInt(id));
};

export const findCategoryById = (id) => {
  return dbData.category.find(category => category.id === parseInt(id));
};

export const findSupplierById = (id) => {
  return dbData.suppliers.find(supplier => supplier.id === parseInt(id));
};