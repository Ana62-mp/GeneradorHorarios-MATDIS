import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import {
  FaClock,
  FaEdit,
  FaLaptop,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";

const DAY_LABELS = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

function CourseTable({ courses, onEdit, onDelete }) {
  return (
    <div className="course-table-wrapper">
      <Table responsive hover className="course-table mb-0">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Horario</th>
            <th>Modalidad</th>
            <th>Dificultad</th>
            <th>Créditos</th>
            <th>Prerrequisitos</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <div className="course-name">
                  <strong>{course.name}</strong>

                  <span>
                    {course.section
                      ? `Sección ${course.section}`
                      : "Sin sección"}
                  </span>
                </div>
              </td>

              <td>
                <div className="course-schedule">
                  <strong>
                    {DAY_LABELS[course.day] ?? course.day}
                  </strong>

                  <span>
                    <FaClock />
                    {course.startTime} – {course.endTime}
                  </span>
                </div>
              </td>

              <td>
                <Badge
                  className={`course-badge course-badge--${course.modality.toLowerCase()}`}
                >
                  {course.modality === "VIRTUAL" ? (
                    <FaLaptop />
                  ) : (
                    <FaMapMarkerAlt />
                  )}

                  {course.modality === "VIRTUAL"
                    ? "Virtual"
                    : "Presencial"}
                </Badge>
              </td>

              <td>
                <Badge
                  className={`difficulty-badge difficulty-badge--${course.difficulty.toLowerCase()}`}
                >
                  {course.difficulty}
                </Badge>
              </td>

              <td>
                <strong>{course.credits}</strong>
              </td>

              <td>
                {course.prerequisites?.length > 0 ? (
                  <div className="prerequisite-tags">
                    {course.prerequisites.map((prerequisite) => (
                      <span key={prerequisite.id}>
                        {prerequisite.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">Ninguno</span>
                )}
              </td>

              <td>
                <div className="course-actions">
                  <Button
                    type="button"
                    className="course-action course-action--edit"
                    aria-label={`Editar ${course.name}`}
                    onClick={() => onEdit(course)}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    type="button"
                    className="course-action course-action--delete"
                    aria-label={`Eliminar ${course.name}`}
                    onClick={() => onDelete(course)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CourseTable;