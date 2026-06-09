import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPeticions() {
  const [peticions, setPeticions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    cargarPeticions();
  }, []);

  const cargarPeticions = async () => {
    const res = await fetch("http://127.0.0.1:8000/peticio_promocio/");
    const data = await res.json();
    setPeticions(data);
  };

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleSelect = (p) => {
    setSelected({ ...p });
  };

  const handleKeySelect = (e, p) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(p);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/peticio_promocio/${selected.id}`, {
        usuari_solicitant: selected.usuari_solicitant,
        misatge_peticio: selected.misatge_peticio,
        estat: selected.estat
      });

      showAlert("Actualizado correctamente");
    } catch (error) {
      console.error(error);
      showAlert("Error al actualizar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta petición?")) return;

    await fetch(`http://127.0.0.1:8000/peticio_promocio/${selected.id}`, {
      method: "DELETE"
    });

    showAlert("Petición eliminada");
    setSelected(null);
    cargarPeticions();
  };

  const getBadgeClass = (estat) => {
    if (estat === "Aprovat") return "badge bg-success";
    if (estat === "Rebutjat") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  return (
    <main className="container mt-4" role="main">

      {alertMsg && (
        <div role="alert" className="alert alert-info">
          {alertMsg}
        </div>
      )}

      {/* LISTA ACCESIBLE */}
      <div
        className="border rounded p-3 mb-4 overflow-auto"
        style={{ maxHeight: "350px" }}
        role="list"
        aria-label="Llista de peticions de promoció"
      >
        <div className="d-flex flex-column gap-3">
          {peticions.map((p) => (
            <div
              key={p.id}
              className="card shadow-sm"
              role="button"
              tabIndex="0"
              aria-selected={selected?.id === p.id}
              onClick={() => handleSelect(p)}
              onKeyDown={(e) => handleKeySelect(e, p)}
              style={{
                cursor: "pointer",
                outline: "none",
                border:
                  selected?.id === p.id ? "2px solid #0d6efd" : "1px solid #ccc"
              }}
            >
              <div className="card-body">
                <span className={getBadgeClass(p.estat)}>{p.estat}</span>
                <p className="mt-2 mb-0 fw-bold">{p.misatge_peticio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULARIO ACCESIBLE */}
      {selected && (
        <div className="card shadow p-4">
          <h4 className="text-center mb-4">
            Editar petición #{selected.id}
          </h4>

          <div className="mb-3">
            <label htmlFor="solicitant" className="form-label fw-bold">
              Número solicitante
            </label>
            <input
              id="solicitant"
              className="form-control text-center fw-bold"
              value={selected.usuari_solicitant}
              disabled
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mensaje" className="form-label fw-bold">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              className="form-control text-center fw-bold"
              value={selected.misatge_peticio}
              disabled
              style={{ height: "100px" }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="estado" className="form-label fw-bold">
              Estado
            </label>
            <select
              id="estado"
              className="form-select text-center fw-bold"
              value={selected.estat}
              onChange={(e) =>
                setSelected({ ...selected, estat: e.target.value })
              }
            >
              <option value="Pendent">Pendent</option>
              <option value="Aprovat">Aprovat</option>
              <option value="Rebutjat">Rebutjat</option>
            </select>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-success px-4 fw-bold"
              aria-label="Guardar cambios de la petición seleccionada"
              onClick={handleUpdate}
            >
              Guardar cambios
            </button>

            <button
              className="btn btn-danger px-4 fw-bold"
              aria-label="Eliminar la petición seleccionada"
              onClick={handleDelete}
            >
              Eliminar petición
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
