import { useState, useEffect } from "react";
import "../Turnero.css";

const Turnero = () => {
  const [paso, setPaso] = useState(1);
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipoAtencion, setTipoAtencion] = useState("");
  const [servicios, setServicios] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [cargandoServicios, setCargandoServicios] = useState(true);

  // 🔹 Cargar servicios disponibles
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/servicios");
        const data = await res.json();

        // Asegurar que sea un array
        if (data && Array.isArray(data.docs)) {
          setServicios(data.docs);
        } else {
          setServicios([]);
        }

        console.log("✅ Servicios cargados:", data.docs);
      } catch (error) {
        console.error("❌ Error cargando servicios:", error);
        setServicios([]);
      } finally {
        setCargandoServicios(false);
      }
    };

    cargarServicios();
  }, []);

  // 🔹 Agregar y borrar números del documento
  const agregarNumero = (num) => {
    setDocumento((prev) => (prev.length < 10 ? prev + num : prev));
  };

  const borrarNumero = () => setDocumento("");

  // 🔹 Verificar si el paciente existe
  const enviarDocumento = async () => {
    if (documento.trim() === "") return;

    try {
      const res = await fetch(`http://localhost:5000/api/pacientes/${documento}`);
      if (res.ok) {
        setPaso(2); // paciente encontrado
      } else if (res.status === 404) {
        setPaso(1.5); // paciente no existe
      } else {
        throw new Error("Error desconocido");
      }
    } catch (error) {
      console.error("Error verificando paciente:", error);
      setPaso(1.5);
    }
  };

  // 🔹 Registrar paciente nuevo
  const registrarPaciente = async () => {
    if (!nombre.trim()) return alert("Por favor ingrese el nombre");

    try {
      const res = await fetch("http://localhost:5000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          documento,
          servicioId: null,
          tipoAtencion: null,
        }),
      });

      if (res.ok) {
        setPaso(2);
      } else {
        const err = await res.text();
        console.error("Error del servidor:", err);
        alert("No se pudo registrar el paciente");
      }
    } catch (error) {
      console.error("Error al registrar paciente:", error);
    }
  };

  // 🔹 Seleccionar tipo de atención
  const seleccionarTipo = (tipo) => {
    setTipoAtencion(tipo);
    setPaso(3);
  };

  // 🔹 Imprimir ticket de turno
  const imprimirTicket = (turno) => {
    const ventana = window.open("", "_blank", "width=400,height=600");
    ventana.document.write(`
      <html>
        <head>
          <title>Ticket de Turno</title>
          <style>
            body { font-family: Arial; text-align: center; }
            h2 { color: #2c3e50; }
            p { font-size: 18px; margin: 5px 0; }
            .codigo { font-size: 36px; font-weight: bold; color: #2980b9; }
          </style>
        </head>
        <body>
          <h2>Turno Asignado</h2>
          <p><strong>Paciente:</strong> ${turno?.pacienteId?.nombre || "Desconocido"}</p>
          <p><strong>Servicio:</strong> ${turno?.servicioId?.nombre || "Sin servicio"}</p>
          <p class="codigo">${turno?.codigo || "----"}</p>
          <p>Gracias por su espera</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  // 🔹 Seleccionar servicio y crear turno
  const seleccionarServicio = async (servicioId) => {
    try {
      const res = await fetch("http://localhost:5000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento, servicioId, tipoAtencion }),
      });

      const data = await res.json();

      if (res.ok && data.turno) {
        setResultado(data.turno);
        setPaso(4);
        imprimirTicket(data.turno);
      } else {
        alert("No se pudo generar el turno");
      }
    } catch (error) {
      console.error("Error al crear turno:", error);
    }
  };

  // ------------------ INTERFAZ ---------------------
  return (
    <div className="container text-center mt-5">
      {/* PASO 1: DOCUMENTO */}
      {paso === 1 && (
        <div>
          <h4>Por favor digite su número de documento</h4>
          <input
            type="text"
            value={documento}
            readOnly
            className="form-control text-center my-3"
            style={{ fontSize: "1.5rem", width: "300px", margin: "auto" }}
          />
          <div className="teclado">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                className="tecla w-100"
                onClick={() => agregarNumero(num)}
              >
                {num}
              </button>
            ))}
            <button className="btn btn-success w-100 mt-2" onClick={enviarDocumento}>
              Enviar
            </button>
            <button className="btn btn-danger w-100 mt-2" onClick={borrarNumero}>
              Borrar
            </button>
          </div>
        </div>
      )}

      {/* PASO 1.5: REGISTRO NUEVO */}
      {paso === 1.5 && (
        <div>
          <h4>Paciente no registrado</h4>
          <p>Por favor ingrese su nombre:</p>
          <input
            type="text"
            className="form-control text-center my-3"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            style={{ width: "300px", margin: "auto" }}
          />
          <button className="btn btn-success" onClick={registrarPaciente}>
            Registrar
          </button>
        </div>
      )}

      {/* PASO 2: TIPO DE ATENCIÓN */}
      {paso === 2 && (
        <div>
          <h4>Seleccione tipo de atención</h4>
          <div className="mt-4">
            <button
              className="btn btn-outline-primary mx-3 p-3"
              onClick={() => seleccionarTipo("Normal")}
            >
              Normal
            </button>
            <button
              className="btn btn-outline-warning mx-3 p-3"
              onClick={() => seleccionarTipo("Preferencial")}
            >
              Preferencial
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: SERVICIO */}
      {paso === 3 && (
        <div>
          <h4>Seleccione el servicio</h4>
          {cargandoServicios ? (
            <p>Cargando servicios...</p>
          ) : (
            <div className="d-flex justify-content-center flex-wrap mt-4">
              {Array.isArray(servicios) && servicios.length > 0 ? (
                servicios.map((s) => (
                  <div
                    key={s._id}
                    className="card m-2 p-3 text-center shadow"
                    style={{
                      width: "200px",
                      cursor: "pointer",
                      background: "#e8f8ff",
                    }}
                    onClick={() => seleccionarServicio(s._id)}
                  >
                    <h5>{s.nombre}</h5>
                    <p className="text-muted">{s.codigo}</p>
                  </div>
                ))
              ) : (
                <p>No hay servicios disponibles</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* PASO 4: RESULTADO */}
      {paso === 4 && resultado && (
        <div
          className="p-4 mt-4"
          style={{
            background: "#cce9ff",
            borderRadius: "10px",
            display: "inline-block",
          }}
        >
          <h4>Turno Asignado</h4>
          <p>
            <strong>Paciente:</strong> {resultado.pacienteId?.nombre || "Desconocido"}
          </p>
          <p>
            <strong>Servicio:</strong> {resultado.servicioId?.nombre || "Sin servicio"}
          </p>
          <p>
            <strong>Turno:</strong> {resultado.codigo || "----"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Turnero;
