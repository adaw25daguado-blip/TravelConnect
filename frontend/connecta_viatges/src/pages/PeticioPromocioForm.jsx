import { useState } from "react";

export default function PeticioPromocioForm() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
  const [mensaje, setMensaje] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const enviarPeticion = async (e) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      showAlert("Debes escribir un mensaje.");
      return;
    }

    const peticion = {
      usuari_solicitant: Number(usuarioActual.sub),
      misatge_peticio: mensaje,
      estat: "Pendent"
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/peticio_promocio/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(peticion)
      });

      if (!res.ok) {
        const error = await res.json();
        showAlert("Error: " + error.detail);
        return;
      }

      showAlert("Petición enviada correctamente.");
      setMensaje("");

    } catch (error) {
      console.error("Error enviando petición:", error);
      showAlert("Error al enviar la petición.");
    }
  };

  return (
    <div className="card p-3 shadow">
      <h4 className="fw-bold mb-3">Enviar petición de promoción</h4>

      {alertMsg && (
        <div role="alert" className="alert alert-info">
          {alertMsg}
        </div>
      )}

      <form onSubmit={enviarPeticion} aria-labelledby="titulo-peticion">
        <h5 id="titulo-peticion" className="visually-hidden">
          Formulario para enviar una petición de promoción
        </h5>

        {/* Usuario solicitante */}
        <div className="mb-3">
          <label htmlFor="usuarioSolicitante" className="form-label fw-bold">
            Usuario solicitante
          </label>
          <input
            id="usuarioSolicitante"
            type="text"
            className="form-control"
            value={usuarioActual.sub}
            disabled
          />
        </div>

        {/* Mensaje */}
        <div className="mb-3">
          <label htmlFor="mensajePeticion" className="form-label fw-bold">
            Mensaje
          </label>
          <textarea
            id="mensajePeticion"
            className="form-control"
            rows="4"
            placeholder="Escribe tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            aria-required="true"
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          aria-label="Enviar petición de promoción"
        >
          Enviar petición
        </button>
      </form>
    </div>
  );
}
