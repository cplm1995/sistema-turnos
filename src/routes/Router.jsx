import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Turnos from "../pages/Turnos";
import Pacientes from "../pages/Pacientes";
import Login from "../components/Login";
import Layout from "../components/Layout";
import Servicios from "../pages/Servicios";
import PanelLlamado from "../pages/PanelLlamado";

const Router = () => {
  return (
    <Routes>
      {/* Login separado del layout */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas internas dentro del Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/panel" element={<PanelLlamado/>} />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Router;
