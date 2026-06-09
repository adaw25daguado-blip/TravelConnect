import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const location = useLocation();

  // Si estamos en /login, no mostrar navbar
  if (location.pathname === "/login") {
    return null;
  }


  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd"
      }}
    >
      <h2 style={{ margin: 0 }}>Connecta Viatges</h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {!user && (
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" style={{ textDecoration: "none" }}>
            Panel Admin
          </Link>
        )}

        {user?.role === "creador" && (
          <Link to="/crear-viatge" style={{ textDecoration: "none" }}>
            Crear Viatge
          </Link>
        )}

        {user?.role === "viajero" && (
          <Link to="/viatges" style={{ textDecoration: "none" }}>
            Viatges
          </Link>
        )}

        {user && (
          <button
            onClick={logout}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#d9534f",
              color: "white",
              cursor: "pointer"
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
