import { Container } from "react-bootstrap";
import { useParams } from "react-router";

function ScheduleDetailPage() {
  const { id } = useParams();

  return (
    <Container className="py-5">
      <h1>Detalle de generación</h1>
      <p>Identificador: {id}</p>
    </Container>
  );
}

export default ScheduleDetailPage;