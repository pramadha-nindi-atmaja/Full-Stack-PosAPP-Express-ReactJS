# Bulk Product Import Feature Documentation

## Overview
The Bulk Product Import feature allows users to import multiple products at once using a CSV file, significantly reducing the time needed to add large numbers of products to the system.

## How to Use

### Accessing the Feature
1. Navigate to the Products section
2. Click on the "Bulk Import" button (next to the "Add Product" button)

### Preparing Your CSV File
Before importing, you need to prepare a CSV file with the following columns:

- `productName` (required) - The name of the product
- `qty` (required) - Initial quantity in stock
- `price` (required) - Product price
- `kategoryId` (required) - Category ID (must exist in the system)
- `supplierId` (required) - Supplier ID (must exist in the system)
- `barcode` (optional) - Product barcode
- `lowStockThreshold` (optional, defaults to 10) - Minimum stock level before low stock alert

### Downloading a Template
Click the "Download CSV Template" button to get a sample CSV file with the correct format and example data.

### Importing Products
1. Click the "Choose File" button and select your prepared CSV file
2. Click "Import Products"
3. Wait for the import process to complete
4. Review the results:
   - Number of successfully imported products
   - Number of rows with errors
   - Detailed error messages for failed rows

## Error Handling
If any rows fail validation, you'll see detailed error messages indicating:
- Which row had the error
- What specific validation failed
- How to fix the issue

Common errors include:
- Missing required fields
- Invalid category or supplier IDs
- Incorrect data types (e.g., text in numeric fields)

## Best Practices
1. Always download and use the template as a starting point
2. Verify that category and supplier IDs exist in the system before importing
3. Test with a small CSV file first to ensure everything works correctly
4. Check the import results and fix any errors before re-importing

## Technical Details
- The feature uses the `fast-csv` library for parsing
- All standard product validation rules apply
- Default images are assigned to imported products
- The import process is transactional - either all valid products are imported or none are