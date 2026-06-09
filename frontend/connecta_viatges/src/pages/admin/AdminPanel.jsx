import { useState } from "react";
import logo from "../../assets/logo.png";

import ProfileForm from "../ProfileForm";
import UserManagement from "./UserManagement";
import TravelManagement from "../TravelManagement";
import GestionPeticions from "../GestionPeticions";

export default function AdminPanel() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleKeyToggle = (e, section) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleSection(section);
    }
  };

  return (
    <main className="container py-5" role="main">

      {/* LOGO + TÍTULO */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-dark">Connecta Viatges</h1>
        <img src={logo} alt="Logotip de Connecta Viatges" style={{ width: "120px" }} />
        <h2 className="mt-3 text-dark">Panel de Administración</h2>
      </div>

      {/* ============================
          1) MI PERFIL
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-purple text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "perfil"}
          aria-controls="section-perfil"
          onClick={() => toggleSection("perfil")}
          onKeyDown={(e) => handleKeyToggle(e, "perfil")}
        >
          Mi Perfil
        </div>

        {openSection === "perfil" && (
          <div id="section-perfil" className="card-body">
            <ProfileForm />
          </div>
        )}
      </div>

      {/* ============================
          2) GESTIÓN DE USUARIOS
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-primary text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "usuarios"}
          aria-controls="section-usuarios"
          onClick={() => toggleSection("usuarios")}
          onKeyDown={(e) => handleKeyToggle(e, "usuarios")}
        >
          Gestión de Usuarios
        </div>

        {openSection === "usuarios" && (
          <div id="section-usuarios" className="card-body">
            <UserManagement />
          </div>
        )}
      </div>

      {/* ============================
          3) GESTIÓN DE VIAJES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-success text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "viajes"}
          aria-controls="section-viajes"
          onClick={() => toggleSection("viajes")}
          onKeyDown={(e) => handleKeyToggle(e, "viajes")}
        >
          Gestión de Viajes
        </div>

        {openSection === "viajes" && (
          <div id="section-viajes" className="card-body">
            <TravelManagement />
          </div>
        )}
      </div>

      {/* ============================
          4) PETICIONES DE PROMOCIONES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-warning text-dark fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "peticions"}
          aria-controls="section-peticions"
          onClick={() => toggleSection("peticions")}
          onKeyDown={(e) => handleKeyToggle(e, "peticions")}
        >
          Peticiones de Promociones
        </div>

        {openSection === "peticions" && (
          <div id="section-peticions" className="card-body">
            <GestionPeticions />
          </div>
        )}
      </div>
    </main>
  );
}
