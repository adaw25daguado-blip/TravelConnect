import { useEffect, useState } from "react";

export default function TravelManagement() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  const [travels, setTravels] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [formData, setFormData] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    loadTravels();
  }, []);

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const loadTravels = async () => {
    const res = await fetch("http://127.0.0.1:8000/viatges/");
    const data = await res.json();
    setTravels(data);
  };

  const handleSelectTravel = (travel) => {
    setSelectedTravel(travel);
    setFormData({
      nombre: travel.nombre,
      destino: travel.destino,
      fecha_inicio: travel.fecha_inicio,
      fecha_fin: travel.fecha_fin,
      descripcion: travel.descripcion,
      maximo_participantes: travel.maximo_participantes,
      estado: travel.estado,
      creador_id: travel.creador_id,
      total_participantes: travel.total_participantes
    });
  };

  const handleKeySelect = (e, travel) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelectTravel(travel);
    }
  };

  const handleCreateNew = () => {
    if (!usuarioActual) return showAlert("No hay usuario logueado");

    setSelectedTravel(null);
    setFormData({
      nombre: "",
      destino: "",
      fecha_inicio: "",
      fecha_fin: "",
      descripcion: "",
      maximo_participantes: 1,
      estado: "Planificando",
      creador_id: usuarioActual.sub,
      total_participantes: 0
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!selectedTravel) return showAlert("Selecciona un viaje");

    const res = await fetch(`http://127.0.0.1:8000/viatges/${selectedTravel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) return showAlert("Error actualizando viaje");

    showAlert("Viaje actualizado");
    loadTravels();
  };

  const handleDelete = async () => {
    if (!selectedTravel) return showAlert("Selecciona un viaje");
    if (!confirm("¿Seguro que quieres eliminar este viaje?")) return;

    await fetch(`http://127.0.0.1:8000/viatges/${selectedTravel.id}`, {
      method: "DELETE"
    });

    showAlert("Viaje eliminado");
    setSelectedTravel(null);
    setFormData(null);
    loadTravels();
  };

  const handleCreate = async () => {
    const res = await fetch("http://127.0.0.1:8000/viatges/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) return showAlert("Error creando viaje");

    showAlert("Viaje creado");
    loadTravels();
  };

  return (
    <main className="text-dark" role="main">
      <h3 className="mb-3 fw-bold">Gestión de Viajes</h3>

      {alertMsg && (
        <div role="alert" className="alert alert-info">
          {alertMsg}
        </div>
      )}

      {/* LISTA DE VIAJES ACCESIBLE */}
      <div
        className="border rounded p-3 mb-3 overflow-auto"
        style={{ maxHeight: "250px" }}
        role="list"
        aria-label="Lista de viajes disponibles"
      >
        <div className="list-group">
          {travels.map((t) => (
            <button
              key={t.id}
              role="listitem"
              aria-selected={selectedTravel?.id === t.id}
              className={`list-group-item list-group-item-action ${selectedTravel?.id === t.id ? "active" : ""
                }`}
              onClick={() => handleSelectTravel(t)}
              onKeyDown={(e) => handleKeySelect(e, t)}
            >
              <strong>{t.nombre}</strong> — {t.destino}
            </button>
          ))}
        </div>
      </div>

      {/* BOTONES */}
      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-danger w-100"
          aria-label="Eliminar viaje seleccionado"
          onClick={handleDelete}
        >
          Eliminar
        </button>

        <button
          className="btn btn-primary w-100"
          aria-label="Actualizar viaje seleccionado"
          onClick={handleUpdate}
        >
          Actualizar
        </button>

        <button
          className="btn btn-success w-100"
          aria-label="Crear un nuevo viaje"
          onClick={handleCreateNew}
        >
          Crear
        </button>
      </div>

      {/* FORMULARIO ACCESIBLE */}
      {formData && (
        <div className="card shadow p-4">
          <form className="text-dark" aria-labelledby="form-travel-title">
            <h4 id="form-travel-title" className="visually-hidden">
              Formulario de gestión de viaje
            </h4>

            {/* NOMBRE */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-bold">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* DESTINO */}
            <div className="mb-3">
              <label htmlFor="destino" className="form-label fw-bold">
                Destino
              </label>
              <input
                id="destino"
                name="destino"
                className="form-control"
                value={formData.destino}
                onChange={handleChange}
              />
            </div>

            {/* FECHAS */}
            <div className="mb-3">
              <label htmlFor="fecha_inicio" className="form-label fw-bold">
                Fecha inicio
              </label>
              <input
                id="fecha_inicio"
                type="date"
                name="fecha_inicio"
                className="form-control"
                value={formData.fecha_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_fin" className="form-label fw-bold">
                Fecha fin
              </label>
              <input
                id="fecha_fin"
                type="date"
                name="fecha_fin"
                className="form-control"
                value={formData.fecha_fin}
                onChange={handleChange}
              />
            </div>

            {/* PARTICIPANTES */}
            <div className="mb-3">
              <label htmlFor="maximo_participantes" className="form-label fw-bold">
                Máximo participantes
              </label>
              <input
                id="maximo_participantes"
                type="number"
                name="maximo_participantes"
                className="form-control"
                value={formData.maximo_participantes}
                onChange={handleChange}
              />
            </div>

            {/* ESTADO */}
            <div className="mb-3">
              <label htmlFor="estado" className="form-label fw-bold">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                className="form-select"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="Planificando">Planificando</option>
                <option value="Activo">Activo</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label fw-bold">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-control"
                style={{ minHeight: "80px" }}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>

            {!selectedTravel && (
              <button
                className="btn btn-success w-100 mt-2"
                type="button"
                aria-label="Crear viaje"
                onClick={handleCreate}
              >
                Crear viaje
              </button>
            )}
          </form>
        </div>
      )}
    </main>
  );
}
