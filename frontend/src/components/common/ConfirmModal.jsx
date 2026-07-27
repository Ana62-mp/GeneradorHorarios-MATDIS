import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import { FaExclamationTriangle, FaTrash } from "react-icons/fa";

function ConfirmModal({
  show,
  title,
  message,
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      show={show}
      onHide={loading ? undefined : onCancel}
      centered
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaExclamationTriangle className="text-warning" />
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          variant="outline-secondary"
          disabled={loading}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="danger"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? (
            <>
              <Spinner
                size="sm"
                animation="border"
                className="me-2"
              />
              Eliminando...
            </>
          ) : (
            <>
              <FaTrash className="me-2" />
              Eliminar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;