import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import ExchangePage from "./pages/ExchangePage";
import DerivativesPage from "./pages/DerivativesPage";
import FaqPage from "./pages/FaqPage";


function ProtectedRoute() {
  const token = localStorage.getItem("Token");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
    return( <Router>
      <Routes>
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/derivatives" element={<DerivativesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        
      </Routes>
    </Router>
    )
    
}

export default App