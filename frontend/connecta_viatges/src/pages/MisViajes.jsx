import { useEffect, useState } from "react";

export default function MisViajes() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  const [viajes, setViajes] = useState([]);
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    cargarMisViajes();
  }, []);

  const cargarMisViajes = async () => {
    const url = `http://127.0.0.1:8000/usuaris/${Number(usuarioActual.sub)}/viatges`;
    const res = await fetch(url);
    const data = await res.json();
    setViajes(Array.isArray(data) ? data : []);
  };

  const cargarChat = async (viajeId) => {
    const res = await fetch(
      `http://127.0.0.1:8000/viatges/${viajeId}/comentaris`
    );
    const data = await res.json();
    setMensajes(data);
  };

  const seleccionarViaje = (viaje) => {
    setViajeSeleccionado(viaje);
    cargarChat(viaje.id);
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    await fetch("http://127.0.0.1:8000/misatge_xat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        viatge_id: viajeSeleccionado.id,
        autor_id: usuarioActual.sub,
        contingut: nuevoMensaje,
        timestamp: new Date().toISOString()
      })
    });

    setNuevoMensaje("");
    cargarChat(viajeSeleccionado.id);
  };

  const borrarse = async (viajeId) => {
    const res = await fetch(
      `http://127.0.0.1:8000/viatges/viajes/${viajeId}/borrarse?usuario_id=${usuarioActual.sub}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const error = await res.json();
      alert("Error: " + error.detail);
      return;
    }

    alert("Te has borrado del viaje");
    setViajeSeleccionado(null);
    cargarMisViajes();
  };

  return (
    <main className="text-dark" role="main">
      <h4 className="fw-bold mb-3">Mis Viajes</h4>

      {!viajeSeleccionado && (
        <div className="overflow-auto" style={{ maxHeight: "350px" }}>
          <div className="list-group" role="list">
            {viajes.length === 0 && (
              <div role="alert" className="alert alert-info text-center">
                No estás inscrito en ningún viaje.
              </div>
            )}

            {viajes.map((v) => (
              <button
                key={v.id}
                className="list-group-item list-group-item-action"
                role="listitem"
                aria-label={`Viaje a ${v.destino} del ${v.fecha_inicio} al ${v.fecha_fin}`}
                onClick={() => seleccionarViaje(v)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1">{v.nombre}</h5>
                    <p className="mb-1">{v.destino}</p>
                    <small className="text-muted">
                      {v.fecha_inicio} → {v.fecha_fin}
                    </small>
                  </div>

                  <span className="badge bg-primary">
                    {v.total_participantes}/{v.maximo_participantes}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {viajeSeleccionado && (
        <div className="card p-3">
          <button
            className="btn btn-secondary btn-sm mb-3"
            aria-label="Volver a la lista de viajes"
            onClick={() => setViajeSeleccionado(null)}
          >
            ← Volver
          </button>

          <h5 className="fw-bold">{viajeSeleccionado.nombre}</h5>
          <p>{viajeSeleccionado.destino}</p>
          <p className="text-muted">
            {viajeSeleccionado.fecha_inicio} → {viajeSeleccionado.fecha_fin}
          </p>
          <p>{viajeSeleccionado.descripcion}</p>

          <span className="badge bg-info mb-3">
            Estado: {viajeSeleccionado.estado}
          </span>

          {viajeSeleccionado.estado === "Planificando" ? (
            <button
              className="btn btn-danger btn-sm mb-3"
              aria-label="Desapuntarse del viaje"
              onClick={() => borrarse(viajeSeleccionado.id)}
            >
              Desapuntarme
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm mb-3" disabled>
              No disponible
            </button>
          )}

          <h6 className="fw-bold mt-3">Chat del viaje</h6>

          {/* CHAT ACCESIBLE */}
          <div
            className="border rounded p-2 mb-2"
            style={{ height: "200px", overflowY: "auto" }}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {mensajes.map((m, i) => (
              <div key={i} role="listitem" className="mb-1">
                {m.contingut}
              </div>
            ))}
          </div>

          {/* INPUT ACCESIBLE */}
          <div className="input-group">
            <label htmlFor="nuevoMensaje" className="visually-hidden">
              Escribe un mensaje
            </label>
            <input
              id="nuevoMensaje"
              type="text"
              className="form-control"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button
              className="btn btn-primary"
              aria-label="Enviar mensaje al chat"
              onClick={enviarMensaje}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
