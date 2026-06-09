import { useState } from "react";
import logo from "../../assets/logo.png";

import ProfileForm from "../ProfileForm";
import TravelManagement from "../TravelManagement";
import ViajesDisponibles from "../ViajesDisponibles";
import GestionPeticions from "../GestionPeticions";
import MisViajes from "../MisViajes";

export default function CreatorPanel() {
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
        <h2 className="mt-3 text-dark">Panel del Creador</h2>
      </div>

      {/* ============================
          1) MI PERFIL
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "perfil"}
          aria-controls="section-perfil"
          style={{ cursor: "pointer", backgroundColor: "#6f42c1" }}
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
          2) GESTIÓN DE VIAJES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-success text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "viajes"}
          aria-controls="section-viajes"
          style={{ cursor: "pointer" }}
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
          3) VIAJES DISPONIBLES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-info text-dark fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "disponibles"}
          aria-controls="section-disponibles"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("disponibles")}
          onKeyDown={(e) => handleKeyToggle(e, "disponibles")}
        >
          Viajes Disponibles
        </div>

        {openSection === "disponibles" && (
          <div id="section-disponibles" className="card-body">
            <ViajesDisponibles />
          </div>
        )}
      </div>

      {/* ============================
          4) MIS VIAJES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-primary text-white fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "misviajes"}
          aria-controls="section-misviajes"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("misviajes")}
          onKeyDown={(e) => handleKeyToggle(e, "misviajes")}
        >
          Mis Viajes
        </div>

        {openSection === "misviajes" && (
          <div id="section-misviajes" className="card-body">
            <MisViajes />
          </div>
        )}
      </div>

      {/* ============================
          5) PETICIONES DE PROMOCIONES
      ============================ */}
      <div className="card shadow mb-3">
        <div
          className="card-header bg-warning text-dark fw-bold"
          role="button"
          tabIndex="0"
          aria-expanded={openSection === "peticions"}
          aria-controls="section-peticions"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("peticions")}
          onKeyDown={(e) => handleKeyToggle(e, "peticions")}
        >
          Peticions de Promocions
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
