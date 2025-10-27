import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const normalizar = (texto) =>
  texto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const PanelLlamado = () => {
  const [turnos, setTurnos] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [resumen, setResumen] = useState({
    pendientes: 0,
    enAtencion: 0,
    atendidos: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar turnos desde el backend
  const cargarTurnos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turnos");
      const data = await res.json();

      const turnosData = Array.isArray(data)
        ? data
        : typeof data === "object"
        ? Object.values(data).flat()
        : [];

      setTurnos(turnosData);

      // Buscar turno en atención
      const turnoEnAtencion = turnosData.find(
        (t) => normalizar(t.estado) === "en atencion"
      );
      setTurnoActual(turnoEnAtencion || null);
    } catch (err) {
      console.error("Error cargando turnos:", err);
    }
  };

  // 🔹 Cambiar estado de un turno (Llamar o Finalizar)
  const cambiarEstadoTurno = async (turno) => {
    try {
      const estadoActual = normalizar(turno.estado);
      let nuevoEstado = "";

      if (estadoActual === "pendiente") nuevoEstado = "en atencion";
      else if (estadoActual === "en atencion") nuevoEstado = "atendido";
      else return;

      const res = await fetch(`http://localhost:5000/api/turnos/${turno._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      toast.success(
        nuevoEstado === "en atencion"
          ? "Turno llamado correctamente"
          : "Turno finalizado"
      );

      // Actualizar localmente
      setTurnos((prev) =>
        prev.map((t) =>
          t._id === turno._id ? { ...t, estado: nuevoEstado } : t
        )
      );

      if (nuevoEstado === "en atencion") {
        setTurnoActual({ ...turno, estado: nuevoEstado });
      } else if (nuevoEstado === "atendido") {
        setTurnoActual(null);
      }

      await cargarResumen();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      toast.error("Error al actualizar el estado del turno");
    }
  };

  // 🔹 Finalizar turno (desde el botón grande)
  const finalizarTurno = async () => {
    if (!turnoActual) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/turnos/${turnoActual._id}/finalizar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        toast.success("Turno finalizado correctamente");
        setTurnoActual(null);
        await cargarTurnos();
        await cargarResumen();
      } else {
        toast.error("Error al finalizar el turno");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo finalizar el turno");
    }
  };

  // 🔹 Cargar resumen de estados
  const cargarResumen = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turnos/resumen");
      const data = await res.json();
      setResumen(data);
    } catch (error) {
      console.error("Error cargando resumen:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Efecto inicial
  useEffect(() => {
    cargarTurnos();
    cargarResumen();
    const interval = setInterval(() => {
      cargarTurnos();
      cargarResumen();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <div className="container mt-4 text-center">
      <h2>Panel de Llamado</h2>

      {/* 🔸 Turno en atención */}
      {turnoActual && (
        <div
          style={{
            background: "#d6f5d6",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Turno en Atención</h3>
          <h1 style={{ fontSize: "5rem", color: "#007bff" }}>
            {turnoActual.codigo}
          </h1>
          <p>
            <strong>Paciente:</strong>{" "}
            {turnoActual.pacienteId?.nombre || "Sin nombre"}
          </p>
          <p>
            <strong>Servicio:</strong>{" "}
            {turnoActual.servicioId?.nombre || "Sin servicio"}
          </p>

          {/* 🔸 Botón Finalizar visible solo si está en atención */}
          {normalizar(turnoActual.estado) === "en atencion" && (
            <button className="btn btn-danger mt-3" onClick={finalizarTurno}>
              Finalizar Turno
            </button>
          )}
        </div>
      )}

      {/* 🔹 Tabla de turnos */}
      <h4>Turnos</h4>
      {turnos.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => {
              const estado = normalizar(t.estado);
              return (
                <tr key={t._id}>
                  <td>{t.codigo}</td>
                  <td>{t.pacienteId?.nombre || "Sin nombre"}</td>
                  <td>{t.servicioId?.nombre || "Sin servicio"}</td>
                  <td>{t.estado}</td>
                  <td>
                    {(estado === "pendiente" || estado === "en atencion") && (
                      <button
                        className={`btn ${
                          estado === "pendiente" ? "btn-primary" : "btn-success"
                        }`}
                        onClick={() => cambiarEstadoTurno(t)}
                      >
                        {estado === "pendiente" ? "Llamar" : "Finalizar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay turnos registrados.</p>
      )}

      {/* 🔹 Resumen */}
      <div className="row g-4 mt-4 justify-content-center">
        <div className="col-md-3">
          <div className="card text-center" style={{ backgroundColor: "#fff3cd" }}>
            <div className="card-body">
              <h5 className="text-warning">Pendientes</h5>
              <h1>{resumen.pendientes}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center" style={{ backgroundColor: "#d1ecf1" }}>
            <div className="card-body">
              <h5 className="text-info">En Atención</h5>
              <h1>{resumen.enAtencion}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center" style={{ backgroundColor: "#d4edda" }}>
            <div className="card-body">
              <h5 className="text-success">Atendidos</h5>
              <h1>{resumen.atendidos}</h1>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PanelLlamado;
