import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(null);

  const ROLES = ["Admin", "Creador", "Viajero"]; // roles válidos

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/usuaris/");
    const data = await res.json();
    setUsers(data);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      rol: user.rol,
      bio: user.bio === "null" ? "" : user.bio,
      password: "",
      hashed_password: user.hashed_password   // ← IMPORTANTE
    });
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setFormData({
      fullName: "",
      email: "",
      rol: "Viajero",
      bio: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!selectedUser) return alert("Selecciona un usuario");

    const body = {
      fullName: formData.fullName,
      email: formData.email,
      rol: formData.rol,
      bio: formData.bio,
    };

    // Si NO se cambia la contraseña → enviamos el hash original
    if (!formData.password || formData.password.trim() === "") {
      body.hashed_password = formData.hashed_password;
    } else {
      // Si se cambia → enviamos la nueva contraseña en texto plano
      body.hashed_password = formData.password;
    }

    const res = await fetch(`http://127.0.0.1:8000/usuaris/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error:", error);
      alert("Error actualizando usuario");
      return;
    }

    alert("Usuario actualizado");
    loadUsers();
  };



  const handleDelete = async () => {
    if (!selectedUser) return alert("Selecciona un usuario");

    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    await fetch(`http://127.0.0.1:8000/usuaris/${selectedUser.id}`, {
      method: "DELETE"
    });

    alert("Usuario eliminado");
    setSelectedUser(null);
    setFormData(null);
    loadUsers();
  };

  const handleCreate = async () => {
    await fetch("http://127.0.0.1:8000/usuaris/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    alert("Usuario creado");
    loadUsers();
  };

  return (
    <div style={{ color: "#000" }}>
      <h3>Gestión de Usuarios</h3>

      {/* LISTA DE USUARIOS CON SCROLL */}
      <div
        style={{
          maxHeight: "200px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "15px"
        }}
      >
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => handleSelectUser(u)}
            style={{
              padding: "8px",
              cursor: "pointer",
              backgroundColor:
                selectedUser?.id === u.id ? "#d0e7ff" : "transparent"
            }}
          >
            <strong>{u.fullName}</strong> — {u.rol}
          </div>
        ))}
      </div>

      {/* BOTONES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            flex: 1
          }}
          onClick={handleDelete}
        >
          Eliminar
        </button>

        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            flex: 1
          }}
          onClick={handleUpdate}
        >
          Actualizar
        </button>

        <button
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            flex: 1
          }}
          onClick={handleCreateNew}
        >
          Crear
        </button>
      </div>

      {/* FORMULARIO */}
      {formData && (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <label>
            Nombre completo:
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>

          <label>
            Email:
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>

          <label>
            Contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>


          <label>
            Rol:
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label>
            Biografía:
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", minHeight: "80px" }}
            />
          </label>

          {/* BOTÓN CREAR SOLO SI NO HAY USUARIO SELECCIONADO */}
          {!selectedUser && (
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                marginTop: "10px"
              }}
              onClick={handleCreate}
              type="button"
            >
              Crear usuario
            </button>
          )}
        </form>
      )}
    </div>
  );
}
