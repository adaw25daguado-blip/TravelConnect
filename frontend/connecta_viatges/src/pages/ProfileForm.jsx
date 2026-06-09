import { useEffect, useState } from "react";

export default function ProfileForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub;

        const res = await fetch(`http://127.0.0.1:8000/usuaris/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    loadProfile();
  }, []);

  if (!user)
    return (
      <p role="status" className="text-center">
        Cargando perfil…
      </p>
    );

  return (
    <form
      className="text-dark"
      aria-labelledby="profile-title"
      role="form"
    >
      <h3 id="profile-title" className="visually-hidden">
        Información del perfil del usuario
      </h3>

      {/* Nombre */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label fw-bold">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          className="form-control"
          value={user.fullName}
          readOnly
          aria-readonly="true"
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={user.email}
          readOnly
          aria-readonly="true"
        />
      </div>

      {/* Rol */}
      <div className="mb-3">
        <label htmlFor="rol" className="form-label fw-bold">
          Rol
        </label>
        <input
          id="rol"
          type="text"
          className="form-control"
          value={user.rol}
          readOnly
          aria-readonly="true"
        />
      </div>

      {/* Biografía */}
      <div className="mb-3">
        <label htmlFor="bio" className="form-label fw-bold">
          Biografía
        </label>
        <textarea
          id="bio"
          className="form-control"
          value={!user.bio || user.bio === "null" ? "" : user.bio}
          readOnly
          aria-readonly="true"
          style={{ minHeight: "80px" }}
        />
      </div>
    </form>
  );
}
