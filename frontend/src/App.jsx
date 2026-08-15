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

    // ======================================================
    // CONTENEUR GLOBAL : hauteur de l'écran, pas de scroll ici
    // ======================================================

    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >

      {/* ==================================================== */}
      {/* NAVBAR : fixe en haut, ne rétrécit jamais */}
      {/* ==================================================== */}

      <Box sx={{ flexShrink: 0 }}>
        <Navbar />
      </Box>


      {/* ==================================================== */}
      {/* CORPS : sidebar fixe + zone de contenu scrollable */}
      {/* ==================================================== */}

      <Stack
        direction="row"
        sx={{
          flex: 1,
          minHeight: 0
        }}
      >

        {/* SIDEBAR : fixe, ne rétrécit jamais, ne scrolle pas */}

        <Box sx={{ flexShrink: 0 }}>
          <Sidebar />
        </Box>


        {/* ZONE DE CONTENU : seule partie scrollable */}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch"
          }}
        >

          <Routes>
            <Route path="/" element={<SalePage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/:brand" element={<BrandProducts />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/statistic" element={<StatisticPage />} />
          </Routes>

        </Box>

      </Stack>

    </Box>

  );

}

export default App;