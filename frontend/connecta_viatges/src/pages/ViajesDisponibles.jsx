import { useEffect, useState } from "react";

export default function ViajesDisponibles() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
  const [viajes, setViajes] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    cargarViajes();
  }, []);

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const cargarViajes = async () => {
    const res = await fetch("http://127.0.0.1:8000/viatges/");
    const data = await res.json();

    const disponibles = data.filter(v => v.estado === "Planificando");

    const viajesConInscripcion = await Promise.all(
      disponibles.map(async (v) => {
        const resUsers = await fetch(`http://127.0.0.1:8000/viatges/${v.id}/usuaris`);
        const usuarios = await resUsers.json();
        const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];
        const inscrito = listaUsuarios.some(u => u.id === Number(usuarioActual.sub));
        return { ...v, inscrito };
      })
    );

    setViajes(viajesConInscripcion);
  };

  const apuntarse = async (viajeId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/viatges/viajes/${viajeId}/apuntarse?usuario_id=${Number(usuarioActual.sub)}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const error = await res.json();
        showAlert("Error: " + error.detail);
        return;
      }

      showAlert("Te has apuntado correctamente");
      cargarViajes();

    } catch (error) {
      console.error("Error apuntándose:", error);
      showAlert("Error al apuntarse");
    }
  };

  return (
    <main className="text-dark" role="main">
      <h4 className="fw-bold mb-3">Viajes Disponibles</h4>

      {alertMsg && (
        <div role="alert" className="alert alert-info">
          {alertMsg}
        </div>
      )}

      <div
        className="overflow-auto"
        style={{ maxHeight: "350px" }}
        role="list"
        aria-label="Lista de viajes disponibles"
      >
        <div className="list-group">

          {viajes.length === 0 && (
            <div role="alert" className="alert alert-info text-center">
              No hay viajes disponibles en este momento.
            </div>
          )}

          {viajes.map(v => (
            <div
              key={v.id}
              className="list-group-item"
              role="listitem"
              tabIndex="0"
              aria-label={`Viaje a ${v.destino} del ${v.fecha_inicio} al ${v.fecha_fin}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 fw-bold">{v.nombre}</h5>
                  <p className="mb-1">{v.destino}</p>
                  <small className="text-muted">
                    {v.fecha_inicio} → {v.fecha_fin}
                  </small>
                </div>

                <span className="badge bg-success">
                  {v.total_participantes}/{v.maximo_participantes}
                </span>
              </div>

              {v.descripcion && (
                <p className="mt-2 mb-2 text-secondary">
                  {v.descripcion}
                </p>
              )}

              {/* BOTÓN SEGÚN ESTADO */}
              {v.estado !== "Planificando" ? (
                <button
                  className="btn btn-secondary btn-sm mt-2"
                  disabled
                  aria-label="Viaje no disponible"
                >
                  No disponible
                </button>
              ) : v.total_participantes >= v.maximo_participantes ? (
                <button
                  className="btn btn-danger btn-sm mt-2"
                  disabled
                  aria-label="Viaje completo"
                >
                  Completo
                </button>
              ) : v.inscrito ? (
                <button
                  className="btn btn-secondary btn-sm mt-2"
                  disabled
                  aria-label="Ya estás inscrito en este viaje"
                >
                  Ya inscrito
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm mt-2"
                  aria-label={`Apuntarse al viaje ${v.nombre}`}
                  onClick={() => apuntarse(v.id)}
                >
                  Apuntarme
                </button>
              )}

            </div>
          ))}

        </div>
      </div>
    </main>
  );
}
