import 'bootstrap/dist/css/bootstrap.min.css';   // ← Bootstrap primero
import "./App.css";                              // ← Tu CSS después
import "./index.css";

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";

import RegisterPage from "./pages/RegisterPage";
import AdminPanel from "./pages/admin/AdminPanel";
import CreatorPanel from "./pages/creator/CreatorPanel";
import ViajeroPanel from "./pages/viajero/ViajeroPanel";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute role="Admin">
              <AdminPanel />
            </RoleRoute>
          }
        />

        <Route
          path="/crear-viatge"
          element={
            <RoleRoute role="Creador">
              <CreatorPanel />
            </RoleRoute>
          }
        />

        <Route
          path="/viatger"
          element={
            <RoleRoute role="Viajero">
              <ViajeroPanel />
            </RoleRoute>
          }
        />
      </Routes>
    </>
  );
}
