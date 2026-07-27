export function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Ocurrió un error inesperado"
  );
}