import { useState, useContext } from "react";
import { loginRequest } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginRequest(email, password);
      login(data.access_token);

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      localStorage.setItem("usuario", JSON.stringify(payload));

      if (payload.role === "Admin") {
        navigate("/admin");
      }
      else if (payload.role === "Creador") {
        navigate("/crear-viatge");
      }
      else if (payload.role === "Viajero") {
        navigate("/viatger");
      }

    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="col-12 col-md-4">
        <h1 className="text-center text-dark mb-4">Connecta Viatges</h1>

        <div className="card shadow p-4">
          <h2 className="text-center mb-4 text-dark">Iniciar sesión</h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Entrar
            </button>

            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => navigate("/register")}
            >
              Crear cuenta
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
