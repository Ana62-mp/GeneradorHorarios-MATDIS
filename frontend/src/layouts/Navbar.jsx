import {
  Container,
  Nav,
  Navbar as BootstrapNavbar,
} from "react-bootstrap";

import { NavLink } from "react-router";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChartBar,
  FaSlidersH,
} from "react-icons/fa";

import "./Navbar.css";

function Navbar() {
  return (
    <BootstrapNavbar
      expand="lg"
      className="app-navbar"
      sticky="top"
    >
      <Container>
        <BootstrapNavbar.Brand
          as={NavLink}
          to="/"
          className="app-navbar__brand"
        >
          <span className="app-navbar__logo">
            <FaCalendarAlt />
          </span>

          <span>
            <strong>Horario</strong>
            <small>Smart</small>
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="main-navigation"
          className="app-navbar__toggle"
        />

        <BootstrapNavbar.Collapse id="main-navigation">
          <Nav className="ms-auto app-navbar__links">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>

            <Nav.Link as={NavLink} to="/materias">
              <FaBookOpen />
              Materias
            </Nav.Link>

            <Nav.Link as={NavLink} to="/configuracion">
              <FaSlidersH />
              Configurar
            </Nav.Link>

            <Nav.Link as={NavLink} to="/resultados">
              <FaChartBar />
              Historial
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;