import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Servicios = () => {
  const [form, setForm] = useState({ nombre: "", codigo: "" });
  const [servicios, setServicios] = useState([]);

  // 🔹 Cargar servicios al montar el componente
  useEffect(() => {
    obtenerServicios();
  }, []);

  // 🔹 Obtener servicios desde el backend
  const obtenerServicios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/servicios");
      const data = await res.json();
      setServicios(data.docs || data); // si usas mongoose-paginate-v2
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  // 🔹 Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error al registrar el servicio");
      }

      setForm({ nombre: "", codigo: "" });
      obtenerServicios(); // refresca tabla
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registrar Servicio</h2>

      {/* FORMULARIO CENTRADO */}
      <div className="d-flex justify-content-center mb-5">
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre del servicio</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ejemplo: Odontología"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Código del servicio</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ejemplo: ODO001"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Guardar Servicio
            </button>
          </form>
        </div>
      </div>

      {/* TABLA DE SERVICIOS */}
      <h4 className="text-center mb-3">Tabla de Servicios</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center">
          <thead className="table-success">
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Fecha de creación</th>
            </tr>
          </thead>
          <tbody>
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <tr key={servicio._id}>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.codigo}</td>
                  <td>
                    {new Date(servicio.createdAt).toLocaleDateString("es-CO")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay servicios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servicios;
