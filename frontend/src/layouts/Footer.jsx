import { Container } from "react-bootstrap";
import { FaCalendarCheck } from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <Container className="app-footer__content">
        <div className="d-flex align-items-center gap-2">
          <FaCalendarCheck />
          <strong>HorarioSmart</strong>
        </div>

        <small>
          Matemáticas discretas aplicadas al desarrollo de software - Ana Moposita
        </small>
      </Container>
    </footer>
  );
}

export default Footer;