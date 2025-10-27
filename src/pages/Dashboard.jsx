import { useState, useEffect } from "react";
import {
  CContainer,
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
} from "@coreui/react";

const Dashboard = () => {
  const [resumen, setResumen] = useState({
    pendientes: 0,
    enAtencion: 0,
    atendidos: 0,
  });
  const [loading, setLoading] = useState(true);

  
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
      cargarResumen();
      const interval = setInterval(() => {
        cargarResumen();
      }, 7000);
      return () => clearInterval(interval);
    }, []);

  return (
    <CContainer fluid className="px-4 mt-4">
      <h1 className="mb-4 fw-bold">Dashboard</h1>

      <div className="row gy-3 justify-content-center">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <CCard className="shadow-sm text-center">
            <CCardBody>
              <CCardTitle className="text-success">Total turnos hoy</CCardTitle>
              <CCardText>
                <strong>{resumen.enAtencion}</strong>
              </CCardText>
              <CButton color="success" className="w-100">
                Ver turnos
              </CButton>
            </CCardBody>
          </CCard>
        </div>

        <div className="col-sm-6 col-md-4 col-lg-3">
          <CCard className="shadow-sm text-center">
            <CCardBody>
              <CCardTitle className="text-primary">
                Total atendidos hoy
              </CCardTitle>
              <CCardText>
                <strong>{resumen.atendidos}</strong>
              </CCardText>
              <CButton color="primary" className="w-100">
                Ver turnos
              </CButton>
            </CCardBody>
          </CCard>
        </div>

        <div className="col-sm-6 col-md-4 col-lg-3">
          <CCard className="shadow-sm text-center">
            <CCardBody>
              <CCardTitle className="text-warning">
                Total pendientes hoy
              </CCardTitle>
              <CCardText>
                <strong>{resumen.pendientes}</strong>
              </CCardText>
              <CButton color="warning" className="w-100">
                Ver turnos
              </CButton>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </CContainer>
  );
};

export default Dashboard;
