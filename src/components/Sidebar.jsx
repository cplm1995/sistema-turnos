import { CSidebar, CSidebarNav, CNavItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilHome, cilPeople, cilCalendar, cilSettings, cilSpeedometer } from "@coreui/icons";
import { NavLink } from "react-router-dom";

const SIDEBAR_WIDTH = 250;

const Sidebar = ({ visible, setVisible }) => {
  const baseStyle = {
    width: SIDEBAR_WIDTH,
    maxWidth: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    transition: "transform 300ms ease, width 300ms ease, opacity 300ms ease",
    zIndex: 1040, // encima del contenido
  };

  const openStyle = {
    ...baseStyle,
    transform: "translateX(0)",
    opacity: 1,
    pointerEvents: "auto",
  };

  const closedStyle = {
    ...baseStyle,
    transform: `translateX(-${SIDEBAR_WIDTH}px)`, // fuera del viewport
    opacity: 0,
    pointerEvents: "none",
    width: SIDEBAR_WIDTH, // mantiene el mismo ancho pero está oculto mediante transform
  };

  return (
    <CSidebar
      visible={visible}
      onVisibleChange={(v) => {
        if (v !== visible) setVisible(v);
      }}
      className="mt-4"
      unfoldable={false}
      position="fixed"
      style={visible ? openStyle : closedStyle}
    >
      <CSidebarNav>
        <CNavItem>
          <NavLink to="/dashboard" className="nav-link">
            <CIcon icon={cilHome} className="me-2" />
            Inicio
          </NavLink>
        </CNavItem>
        <CNavItem>
          <NavLink to="/turnos" className="nav-link">
            <CIcon icon={cilCalendar} className="me-2" />
            Turnos
          </NavLink>
        </CNavItem>
        <CNavItem>
          <NavLink to="/pacientes" className="nav-link">
            <CIcon icon={cilPeople} className="me-2" />
            Pacientes
          </NavLink>
        </CNavItem>
        <CNavItem>
          <NavLink to="/servicios" className="nav-link">
            <CIcon icon={cilSettings} className="me-2" />
            Servicios
          </NavLink>
        </CNavItem>
        <CNavItem>
          <NavLink to="/panel" className="nav-link">
            <CIcon icon={cilSpeedometer} className="me-2" />
            Panel
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
