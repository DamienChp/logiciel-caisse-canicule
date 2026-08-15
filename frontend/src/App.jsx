import { useEffect } from "react";
import { Box, Stack, CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SalePage from "./pages/sale-page/SalePage";
import StockPage from "./pages/stock-page/StockPage";
import BrandProducts from "./pages/stock-page/BrandProducts";
import CustomerPage from "./pages/customer-page/CustomerPage";
import StatisticPage from "./pages/statistic/StatisticPage";
import LoginPage from "./pages/login-page/LoginPage";
import ProtectedRoute from "./components/login/ProtectedRoute";

import { useAuthStore } from "./store/auth";

function App() {

  const { checkAuth, isCheckingAuth } = useAuthStore();


  // ======================================================
  // VÉRIFIE LA SESSION AU CHARGEMENT DE L'APP
  // ======================================================

  useEffect(() => {

    checkAuth();

  }, [checkAuth]);


  // ======================================================
  // ÉCRAN DE CHARGEMENT INITIAL
  // ======================================================

  if (isCheckingAuth) {

    return (

      <Box
        sx={{
          height: "100dvh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress />
      </Box>

    );

  }


  return (

    <Routes>

      {/* ==================================================== */}
      {/* PAGE DE LOGIN : pas de navbar/sidebar */}
      {/* ==================================================== */}

      <Route path="/login" element={<LoginPage />} />


      {/* ==================================================== */}
      {/* TOUTES LES AUTRES PAGES : protégées + layout fixe */}
      {/* ==================================================== */}

      <Route
        path="/*"
        element={

          <ProtectedRoute>

            <Box
              sx={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >

              <Box sx={{ flexShrink: 0 }}>
                <Navbar />
              </Box>

              <Stack
                direction="row"
                sx={{ flex: 1, minHeight: 0 }}
              >

                <Box sx={{ flexShrink: 0 }}>
                  <Sidebar />
                </Box>

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

          </ProtectedRoute>

        }
      />

    </Routes>

  );

}

export default App;