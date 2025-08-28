import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Logistics from "./pages/Logistics";
import VendorManagement from "./pages/VendorManagement";
import UploadedProducts from "./pages/UploadedProducts";
import FinancePage from "./pages/Finance"; 
import Compliance from "./pages/Compliance";
import CustomerSupport from "./pages/CustomerSupport";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import InventoryDashboard from "./pages/InventoryHealth";
// import VendorManagement from "./pages/productInventory";
import ProductInventory from "./pages/productInventory";
import CommissionControl from "./pages/CommisionPage";

const Placeholder = ({ title }) => <h2 className="text-xl font-bold">{title}</h2>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

            <Route path="logistics" element={< Logistics/>} />
  <Route path="vendor-management" element={< VendorManagement />} />
    <Route path="uploaded-products" element={< UploadedProducts />} />
    <Route path="finance" element={< FinancePage />} />
    <Route path="compliance" element={< Compliance />} />
    <Route path="/product-inventory" element={<ProductInventory />} />
    <Route path="/commision" element={<CommissionControl />} />
    <Route path = "customer-support" element={< CustomerSupport />} />
    <Route path = "settings" element={< Settings />} />
    <Route path="notifications" element={< Notifications />} />
     <Route path="inventory-health" element={< InventoryDashboard />} />
          {/* <Route path="vendor-management" element={<Placeholder title="Vendor Management" />} />
          <Route path="uploaded-products" element={<Placeholder title="Uploaded Products" />} />
          <Route path="logistics" element={<Placeholder title="Logistics" />} />
          <Route path="compliance" element={<Placeholder title="Compliance" />} />
          <Route path="notifications" element={<Placeholder title="Notifications" />} />
          <Route path="finance" element={<Placeholder title="Finance" />} />
          <Route path="customer-support" element={<Placeholder title="Customer Support" />} />
          <Route path="inventory-health" element={<Placeholder title="Inventory Health" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
