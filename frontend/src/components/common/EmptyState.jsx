import Button from "react-bootstrap/Button";
import { FaBookOpen, FaPlus } from "react-icons/fa";

function EmptyState({
  title = "No existen materias registradas",
  description = "Registra la primera materia para comenzar a generar horarios.",
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <FaBookOpen />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      {onAction && (
        <Button
          type="button"
          className="btn-primary-custom"
          onClick={onAction}
        >
          <FaPlus className="me-2" />
          Registrar materia
        </Button>
      )}
    </div>
  );
}

export default EmptyState;