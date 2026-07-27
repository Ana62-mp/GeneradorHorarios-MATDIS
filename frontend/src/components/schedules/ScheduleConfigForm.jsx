import { useEffect, useMemo, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import {
  FaBolt,
  FaCalendarCheck,
  FaGraduationCap,
  FaSlidersH,
} from "react-icons/fa";

import CourseMultiSelect from "./CourseMultiSelect";
import ConfigurationPreview from "./ConfigurationPreview";

import { calculateCombinationCount } from "../../utils/combinations";

const INITIAL_CONFIGURATION = {
  numberOfCourses: 3,
  maximumCredits: 12,
  maximumDifficultCourses: 2,
  requiredModality: "CUALQUIERA",
  avoidTimeConflicts: true,
  validatePrerequisites: true,
  requiredCourseIds: [],
  completedCourseIds: [],
};

function ScheduleConfigForm({
  courses,
  generating,
  onGenerate,
}) {
  const [configuration, setConfiguration] = useState(
    INITIAL_CONFIGURATION,
  );

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (courses.length === 0) {
      return;
    }

    setConfiguration((current) => ({
      ...current,

      numberOfCourses: Math.min(
        Math.max(current.numberOfCourses, 1),
        courses.length,
      ),

      maximumDifficultCourses: Math.min(
        current.maximumDifficultCourses,
        courses.length,
      ),
    }));
  }, [courses.length]);

  const totalCombinations = useMemo(
    () =>
      calculateCombinationCount(
        courses.length,
        configuration.numberOfCourses,
      ),
    [courses.length, configuration.numberOfCourses],
  );

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setConfiguration((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));

    setFormError("");
  };

  const toggleRequiredCourse = (courseId) => {
    setConfiguration((current) => {
      const selected =
        current.requiredCourseIds.includes(courseId);

      return {
        ...current,

        requiredCourseIds: selected
          ? current.requiredCourseIds.filter(
              (id) => id !== courseId,
            )
          : [...current.requiredCourseIds, courseId],

        completedCourseIds:
          current.completedCourseIds.filter(
            (id) => id !== courseId,
          ),
      };
    });

    setFormError("");
  };

  const toggleCompletedCourse = (courseId) => {
    setConfiguration((current) => {
      const selected =
        current.completedCourseIds.includes(courseId);

      return {
        ...current,

        completedCourseIds: selected
          ? current.completedCourseIds.filter(
              (id) => id !== courseId,
            )
          : [...current.completedCourseIds, courseId],

        requiredCourseIds:
          current.requiredCourseIds.filter(
            (id) => id !== courseId,
          ),
      };
    });

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      configuration.numberOfCourses < 1 ||
      configuration.numberOfCourses > courses.length
    ) {
      setFormError(
        `Selecciona entre 1 y ${courses.length} materias por horario.`,
      );
      return;
    }

    if (
      configuration.requiredCourseIds.length >
      configuration.numberOfCourses
    ) {
      setFormError(
        "La cantidad de materias obligatorias no puede superar las materias por horario.",
      );
      return;
    }

    if (configuration.maximumCredits < 1) {
      setFormError(
        "El máximo de créditos debe ser mayor que cero.",
      );
      return;
    }

    if (
      configuration.maximumDifficultCourses >
      configuration.numberOfCourses
    ) {
      setFormError(
        "El máximo de materias difíciles no puede superar las materias por horario.",
      );
      return;
    }

    setFormError("");
    await onGenerate(configuration);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-4">
        <Col xl={8}>
          <section className="configuration-card">
            <div className="configuration-card__title">
              <span>
                <FaSlidersH />
              </span>

              <div>
                <h2>Restricciones del horario</h2>
                <p>
                  Define las condiciones que deberá cumplir cada
                  combinación.
                </p>
              </div>
            </div>

            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}

            <Row className="g-4">
              <Col md={4}>
                <Form.Group controlId="number-of-courses">
                  <Form.Label>
                    Número de materias
                  </Form.Label>

                  <Form.Control
                    required
                    type="number"
                    min={1}
                    max={courses.length}
                    name="numberOfCourses"
                    value={configuration.numberOfCourses}
                    onChange={updateField}
                  />

                  <Form.Text>
                    Cantidad exacta por horario.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="maximum-credits">
                  <Form.Label>
                    Créditos máximos
                  </Form.Label>

                  <Form.Control
                    required
                    type="number"
                    min={1}
                    name="maximumCredits"
                    value={configuration.maximumCredits}
                    onChange={updateField}
                  />

                  <Form.Text>
                    Suma máxima permitida.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="maximum-difficult">
                  <Form.Label>
                    Máximo de difíciles
                  </Form.Label>

                  <Form.Control
                    required
                    type="number"
                    min={0}
                    max={configuration.numberOfCourses}
                    name="maximumDifficultCourses"
                    value={
                      configuration.maximumDifficultCourses
                    }
                    onChange={updateField}
                  />

                  <Form.Text>
                    Materias de dificultad alta.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="required-modality">
                  <Form.Label>Modalidad requerida</Form.Label>

                  <div className="modality-options">
                    {[
                      {
                        value: "CUALQUIERA",
                        label: "Cualquiera",
                        description:
                          "No exige una modalidad específica.",
                      },
                      {
                        value: "PRESENCIAL",
                        label: "Presencial",
                        description:
                          "Debe incluir al menos una presencial.",
                      },
                      {
                        value: "VIRTUAL",
                        label: "Virtual",
                        description:
                          "Debe incluir al menos una virtual.",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={[
                          "modality-option",
                          configuration.requiredModality ===
                          option.value
                            ? "modality-option--selected"
                            : "",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="requiredModality"
                          value={option.value}
                          checked={
                            configuration.requiredModality ===
                            option.value
                          }
                          onChange={updateField}
                        />

                        <span>
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <label className="validation-switch">
                  <span className="validation-switch__icon">
                    <FaCalendarCheck />
                  </span>

                  <span className="validation-switch__content">
                    <strong>Evitar cruces</strong>
                    <small>
                      Descarta materias que coincidan en día y
                      hora.
                    </small>
                  </span>

                  <Form.Check
                    type="switch"
                    name="avoidTimeConflicts"
                    checked={
                      configuration.avoidTimeConflicts
                    }
                    onChange={updateField}
                  />
                </label>
              </Col>

              <Col md={6}>
                <label className="validation-switch">
                  <span className="validation-switch__icon validation-switch__icon--violet">
                    <FaGraduationCap />
                  </span>

                  <span className="validation-switch__content">
                    <strong>Validar prerrequisitos</strong>
                    <small>
                      Comprueba materias aprobadas o incluidas.
                    </small>
                  </span>

                  <Form.Check
                    type="switch"
                    name="validatePrerequisites"
                    checked={
                      configuration.validatePrerequisites
                    }
                    onChange={updateField}
                  />
                </label>
              </Col>
            </Row>
          </section>
        </Col>

        <Col xl={4}>
          <ConfigurationPreview
            totalCourses={courses.length}
            selectedAmount={configuration.numberOfCourses}
            totalCombinations={totalCombinations}
            requiredCount={
              configuration.requiredCourseIds.length
            }
            totalCreditsLimit={
              configuration.maximumCredits
            }
          />
        </Col>

        <Col lg={6}>
          <CourseMultiSelect
            title="Materias obligatorias"
            description="Todas deben aparecer en cada horario válido."
            courses={courses}
            selectedIds={
              configuration.requiredCourseIds
            }
            disabledIds={
              configuration.completedCourseIds
            }
            onToggle={toggleRequiredCourse}
          />
        </Col>

        <Col lg={6}>
          <CourseMultiSelect
            title="Materias aprobadas"
            description="Se utilizarán para comprobar prerrequisitos previos."
            courses={courses}
            selectedIds={
              configuration.completedCourseIds
            }
            disabledIds={
              configuration.requiredCourseIds
            }
            onToggle={toggleCompletedCourse}
          />
        </Col>

        <Col xs={12}>
          <div className="generate-panel">
            <div>
              <FaBolt />

              <span>
                <strong>Todo está listo</strong>
                <small>
                  Se evaluarán{" "}
                  {totalCombinations.toLocaleString()}{" "}
                  combinaciones posibles.
                </small>
              </span>
            </div>

            <Button
              type="submit"
              className="btn-primary-custom generate-panel__button"
              disabled={
                generating ||
                courses.length === 0 ||
                totalCombinations === 0
              }
            >
              {generating ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Generando...
                </>
              ) : (
                <>
                  <FaBolt className="me-2" />
                  Generar horarios
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default ScheduleConfigForm;