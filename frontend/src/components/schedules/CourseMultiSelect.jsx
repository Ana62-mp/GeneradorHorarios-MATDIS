import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import {FaCheck,FaClock,FaSearch,} from "react-icons/fa";
import "./CourseMultiSelect.css";

const DAY_LABELS = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

function CourseMultiSelect({
  title,
  description,
  courses,
  selectedIds,
  disabledIds = [],
  onToggle,
}) {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return courses;
    }

    return courses.filter((course) =>
      `${course.name} ${course.section ?? ""}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [courses, search]);

  return (
    <section className="course-selector">
      <div className="course-selector__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <span className="course-selector__counter">
          {selectedIds.length} seleccionadas
        </span>
      </div>

      <div className="course-selector__search">
        <FaSearch />

        <Form.Control
          type="search"
          value={search}
          placeholder="Buscar materia..."
          aria-label={`Buscar en ${title}`}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="course-selector__list">
        {filteredCourses.length === 0 ? (
          <div className="course-selector__empty">
            No se encontraron materias.
          </div>
        ) : (
          filteredCourses.map((course) => {
            const selected = selectedIds.includes(course.id);
            const disabled = disabledIds.includes(course.id);

            return (
              <button
                key={course.id}
                type="button"
                disabled={disabled}
                className={[
                  "selectable-course",
                  selected ? "selectable-course--selected" : "",
                  disabled ? "selectable-course--disabled" : "",
                ].join(" ")}
                onClick={() => onToggle(course.id)}
              >
                <span className="selectable-course__check">
                  {selected && <FaCheck />}
                </span>

                <span className="selectable-course__content">
                  <strong>{course.name}</strong>

                  <small>
                    {course.section
                      ? `Sección ${course.section} · `
                      : ""}

                    {DAY_LABELS[course.day] ?? course.day}

                    <span>
                      <FaClock />
                      {course.startTime}–{course.endTime}
                    </span>
                  </small>
                </span>

                <span
                  className={`selectable-course__modality selectable-course__modality--${course.modality.toLowerCase()}`}
                >
                  {course.modality === "VIRTUAL"
                    ? "Virtual"
                    : "Presencial"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CourseMultiSelect;