import Spinner from "react-bootstrap/Spinner";

function LoadingSpinner({ message = "Cargando información..." }) {
  return (
    <div className="loading-state">
      <Spinner animation="border" role="status" />

      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;