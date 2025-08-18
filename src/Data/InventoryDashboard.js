import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

  // Inventory Health Data
    export const healthStats = [
    { title: 'Total SKUs', value: '40,689', icon: Package, color: 'bg-blue-500' },
    { title: 'Low Stock Items', value: '689', icon: AlertTriangle, color: 'bg-yellow-500' },
    { title: 'Out of Stock', value: '50', icon: TrendingDown, color: 'bg-red-500' },
    { title: 'Fast Moving', value: '809', icon: TrendingUp, color: 'bg-green-500' }
  ];

  // Inventory Status Chart Data
  export const statusData = [
    { month: 'Jan', inStock: 350, lowStock: 280, outOfStock: 150 },
    { month: 'Feb', inStock: 320, lowStock: 300, outOfStock: 140 },
    { month: 'Mar', inStock: 380, lowStock: 250, outOfStock: 120 },
    { month: 'Apr', inStock: 300, lowStock: 220, outOfStock: 100 },
    { month: 'May', inStock: 280, lowStock: 200, outOfStock: 130 },
    { month: 'Jun', inStock: 320, lowStock: 280, outOfStock: 180 },
    { month: 'Jul', inStock: 350, lowStock: 300, outOfStock: 220 },
    { month: 'Sep', inStock: 380, lowStock: 320, outOfStock: 200 },
    { month: 'Oct', inStock: 360, lowStock: 280, outOfStock: 180 },
    { month: 'Nov', inStock: 340, lowStock: 250, outOfStock: 160 },
    { month: 'Dec', inStock: 280, lowStock: 200, outOfStock: 140 }
  ];

  // Products Data
  export const products = [
    { name: 'Summer Floral Dress', price: '$430', quantity: '63 units', vendor: 'Fashion Forward Ltd.', stock: 890, status: 'In stock' },
    { name: 'Classic White Tee', price: '$157', quantity: '27 units', vendor: 'Style Innovations', stock: 0, status: 'Out of stock' },
    { name: 'Denim Jacket', price: '$48', quantity: '34 units', vendor: 'Style Innovations', stock: 290, status: 'In stock' },
    { name: 'Varsity & Co.', price: '$902', quantity: '16 units', vendor: 'Fashion Forward Ltd.', stock: 0, status: 'Out of stock' },
    { name: 'Chic Red Hills', price: '$530', quantity: '5 units', vendor: 'Chic Leaders Corp.', stock: 785, status: 'In stock' },
    { name: 'Stylish Suits', price: '$605', quantity: '10 units', vendor: 'Vogue Trendsetters LLC', stock: 434, status: 'In stock' },
    { name: 'Party Ready Attire', price: '$438', quantity: '22 units', vendor: 'Couture Fashions Co.', stock: 0, status: 'Out of stock' },
    { name: 'Glam Garments', price: '$299', quantity: '43 units', vendor: 'Design Mavericks Inc.', stock: 464, status: 'In stock' },
    { name: 'Trendy Ethnic Wear', price: '$205', quantity: '41 units', vendor: 'Trendsetters United', stock: 43, status: 'Low Stock' }
  ];

  // Fast Moving Items
  export const fastMovingItems = [
    { sku: 'SKU-001', product: 'Summer Floral Dress', vendor: 'Fashion Forward Ltd.', soldUnits: 676 },
    { sku: 'SKU-002', product: 'Classic White Tee', vendor: 'Trendsetters United', soldUnits: 876 },
    { sku: 'SKU-003', product: 'Stylish Suits', vendor: 'Design Mavericks Inc.', soldUnits: 543 },
    { sku: 'SKU-004', product: 'Trendy Ethnic Wear', vendor: 'Vogue Trendsetters LLC', soldUnits: 324 },
    { sku: 'SKU-005', product: 'Denim Jacket', vendor: 'Chic Leaders Corp.', soldUnits: 342 }
  ];

  // Dead Stock Items
  export const deadStockItems = [
    { sku: 'SKU-001', product: 'Summer Floral Dress', vendor: 'Fashion Forward Ltd.', daysStagnant: '120 days', stockUnits: 45 },
    { sku: 'SKU-002', product: 'Classic White Tee', vendor: 'Trendsetters United', daysStagnant: '95 days', stockUnits: 65 },
    { sku: 'SKU-003', product: 'Stylish Suits', vendor: 'Design Mavericks Inc.', daysStagnant: '75 days', stockUnits: 76 },
    { sku: 'SKU-004', product: 'Trendy Ethnic Wear', vendor: 'Vogue Trendsetters LLC', daysStagnant: '85 days', stockUnits: 45 },
    { sku: 'SKU-005', product: 'Denim Jacket', vendor: 'Chic Leaders Corp.', daysStagnant: '65 days', stockUnits: 62 }
  ];

  export const getStatusColor = (status) => {
    switch (status) {
      case 'In stock': return 'text-green-600 bg-green-100';
      case 'Out of stock': return 'text-red-600 bg-red-100';
      case 'Low Stock': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };