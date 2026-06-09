import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/usuaris/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName,
        bio
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert(data.detail || "Error al registrar usuario");
      return;
    }

    showAlert("Usuario registrado correctamente");
    navigate("/login");
  };

  return (
    <main
      className="container d-flex justify-content-center align-items-center vh-100"
      role="main"
    >
      <div className="col-12 col-md-4">

        {/* LOGO */}
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Logotipo de Connecta Viatges"
            style={{ width: "120px" }}
          />
        </div>

        {/* ALERTA ACCESIBLE */}
        {alertMsg && (
          <div role="alert" className="alert alert-info text-center">
            {alertMsg}
          </div>
        )}

        {/* CARD */}
        <div className="card shadow p-4">

          <h2 id="register-title" className="text-center mb-4 fw-bold">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} aria-labelledby="register-title">

            {/* NOMBRE COMPLETO */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label fw-bold">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                className="form-control"
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Introduce una contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* BIO */}
            <div className="mb-3">
              <label htmlFor="bio" className="form-label fw-bold">
                Biografía (opcional)
              </label>
              <textarea
                id="bio"
                className="form-control"
                placeholder="Cuéntanos algo sobre ti"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* BOTÓN REGISTRARSE */}
            <button
              type="submit"
              className="btn btn-success w-100 mb-2"
              aria-label="Registrarse en Connecta Viatges"
            >
              Registrarse
            </button>

            {/* BOTÓN VOLVER AL LOGIN */}
            <button
              type="button"
              className="btn btn-primary w-100"
              aria-label="Ir a la página de inicio de sesión"
              onClick={() => navigate("/login")}
            >
              Ya tengo cuenta
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
