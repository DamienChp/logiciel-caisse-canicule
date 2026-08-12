import { Box, Stack } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SalePage from "./pages/sale-page/SalePage";
import StockPage from "./pages/stock-page/StockPage";
import BrandProducts from "./pages/stock-page/BrandProducts";
import CustomerPage from "./pages/customer-page/CustomerPage";
import StatisticPage from "./pages/statistic/StatisticPage";

function App() {
  return (
    <Box>
      <Navbar />
      <Stack direction='row'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<SalePage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/stock/:brand" element={<BrandProducts />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/statistic" element={<StatisticPage />} />
        </Routes>
      </Stack>
    </Box>
  );
}

export default App;
