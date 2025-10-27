import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CFooter,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //Usamos useCallback para evitar conflictos entre animaciones
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  //Botón cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Sesión cerrada correctamente");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="d-flex">
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

      {/* contenido que ocupa todo el ancho */}
      <div
        className="flex-grow-1 mt-4"
        style={{
          marginLeft: sidebarVisible ? 12 : 0,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <CHeader>
          <CHeaderToggler onClick={toggleSidebar}>
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto">Sistema de Turnos</CHeaderBrand>
          <CHeaderNav>
            <CButton type="submit" onClick={handleLogout} variant="ghost" color="danger">Cerrar sesión</CButton>
          </CHeaderNav>
        </CHeader>

        <CContainer className="my-4">
          <Outlet />
        </CContainer>

        <CFooter className="text-center">
          <strong>© 2025 Sistema de Turnos</strong>
        </CFooter>
      </div>
    </div>
  );
};

export default Layout;
