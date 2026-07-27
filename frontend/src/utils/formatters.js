export function formatDateTime(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatModality(value) {
  const labels = {
    CUALQUIERA: "Cualquiera",
    PRESENCIAL: "Presencial",
    VIRTUAL: "Virtual",
  };

  return labels[value] ?? value;
}

export function formatDay(value) {
  const labels = {
    LUNES: "Lunes",
    MARTES: "Martes",
    MIERCOLES: "Miércoles",
    JUEVES: "Jueves",
    VIERNES: "Viernes",
    SABADO: "Sábado",
    DOMINGO: "Domingo",
  };

  return labels[value] ?? value;
}