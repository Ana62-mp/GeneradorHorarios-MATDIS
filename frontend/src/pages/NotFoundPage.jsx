import { Button, Container } from "react-bootstrap";
import { Link } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <FaExclamationTriangle size={70} className="mb-3" />

      <h1>404</h1>
      <h2>Página no encontrada</h2>

      <p>
        La dirección solicitada no existe dentro de la aplicación.
      </p>

      <Button as={Link} to="/" variant="dark">
        Regresar al inicio
      </Button>
    </Container>
  );
}

export default NotFoundPage;