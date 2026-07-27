import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { FaBook, FaSave } from "react-icons/fa";

const INITIAL_FORM = {
  name: "",
  section: "",
  day: "LUNES",
  startTime: "08:00",
  endTime: "10:00",
  modality: "PRESENCIAL",
  difficulty: "MEDIA",
  credits: 3,
  prerequisiteIds: [],
};

const DAYS = [
  ["LUNES", "Lunes"],
  ["MARTES", "Martes"],
  ["MIERCOLES", "Miércoles"],
  ["JUEVES", "Jueves"],
  ["VIERNES", "Viernes"],
  ["SABADO", "Sábado"],
  ["DOMINGO", "Domingo"],
];

function CourseForm({
  show,
  courses,
  editingCourse,
  saving,
  onHide,
  onSubmit,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validated, setValidated] = useState(false);
  const [timeError, setTimeError] = useState("");

  const isEditing = Boolean(editingCourse);

  useEffect(() => {
    if (editingCourse) {
      setForm({
        name: editingCourse.name ?? "",
        section: editingCourse.section ?? "",
        day: editingCourse.day ?? "LUNES",
        startTime: editingCourse.startTime ?? "08:00",
        endTime: editingCourse.endTime ?? "10:00",
        modality: editingCourse.modality ?? "PRESENCIAL",
        difficulty: editingCourse.difficulty ?? "MEDIA",
        credits: editingCourse.credits ?? 3,
        prerequisiteIds:
          editingCourse.prerequisites?.map(
            (prerequisite) => prerequisite.id,
          ) ?? [],
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setValidated(false);
    setTimeError("");
  }, [editingCourse, show]);

  const availablePrerequisites = courses.filter(
    (course) => course.id !== editingCourse?.id,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "credits" ? Number(value) : value,
    }));

    if (name === "startTime" || name === "endTime") {
      setTimeError("");
    }
  };

  const handlePrerequisiteChange = (courseId) => {
    setForm((current) => {
      const exists = current.prerequisiteIds.includes(courseId);

      return {
        ...current,
        prerequisiteIds: exists
          ? current.prerequisiteIds.filter((id) => id !== courseId)
          : [...current.prerequisiteIds, courseId],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentForm = event.currentTarget;

    if (currentForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (form.startTime >= form.endTime) {
      setTimeError(
        "La hora de inicio debe ser anterior a la hora de finalización.",
      );
      return;
    }

    const success = await onSubmit({
      ...form,
      name: form.name.trim(),
      section: form.section.trim() || null,
      credits: Number(form.credits),
    });

    if (success) {
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={saving ? undefined : onHide}
      size="lg"
      centered
      backdrop={saving ? "static" : true}
      className="course-form-modal"
    >
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Modal.Header closeButton={!saving}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <span className="course-form-modal__icon">
              <FaBook />
            </span>

            {isEditing
              ? "Editar materia"
              : "Registrar nueva materia"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group controlId="course-name">
                <Form.Label>Nombre de la materia</Form.Label>

                <Form.Control
                  required
                  minLength={2}
                  maxLength={100}
                  name="name"
                  value={form.name}
                  placeholder="Ej. Programación I"
                  onChange={handleChange}
                  autoFocus
                />

                <Form.Control.Feedback type="invalid">
                  Ingresa un nombre de al menos 2 caracteres.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-section">
                <Form.Label>Paralelo o sección</Form.Label>

                <Form.Control
                  name="section"
                  value={form.section}
                  maxLength={20}
                  placeholder="Ej. A"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-day">
                <Form.Label>Día</Form.Label>

                <Form.Select
                  required
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                >
                  {DAYS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-start-time">
                <Form.Label>Hora de inicio</Form.Label>

                <Form.Control
                  required
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-end-time">
                <Form.Label>Hora de finalización</Form.Label>

                <Form.Control
                  required
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  isInvalid={Boolean(timeError)}
                  onChange={handleChange}
                />

                <Form.Control.Feedback type="invalid">
                  {timeError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-modality">
                <Form.Label>Modalidad</Form.Label>

                <Form.Select
                  name="modality"
                  value={form.modality}
                  onChange={handleChange}
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="VIRTUAL">Virtual</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-difficulty">
                <Form.Label>Dificultad</Form.Label>

                <Form.Select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="course-credits">
                <Form.Label>Créditos</Form.Label>

                <Form.Control
                  required
                  type="number"
                  min={1}
                  max={30}
                  name="credits"
                  value={form.credits}
                  onChange={handleChange}
                />

                <Form.Control.Feedback type="invalid">
                  Ingresa un número mayor que cero.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <div className="prerequisite-field">
                <div className="prerequisite-field__header">
                  <div>
                    <Form.Label className="mb-1">
                      Prerrequisitos
                    </Form.Label>

                    <p>
                      Selecciona las materias necesarias antes de
                      cursar esta asignatura.
                    </p>
                  </div>

                  <span>
                    {form.prerequisiteIds.length} seleccionados
                  </span>
                </div>

                {availablePrerequisites.length === 0 ? (
                  <div className="prerequisite-field__empty">
                    Todavía no existen otras materias disponibles.
                  </div>
                ) : (
                  <div className="prerequisite-field__options">
                    {availablePrerequisites.map((course) => (
                      <Form.Check
                        key={course.id}
                        type="checkbox"
                        id={`prerequisite-${course.id}`}
                        checked={form.prerequisiteIds.includes(
                          course.id,
                        )}
                        label={
                          course.section
                            ? `${course.name} — ${course.section}`
                            : course.name
                        }
                        onChange={() =>
                          handlePrerequisiteChange(course.id)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            disabled={saving}
            onClick={onHide}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="btn-primary-custom"
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Guardando...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                {isEditing ? "Guardar cambios" : "Registrar materia"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CourseForm;