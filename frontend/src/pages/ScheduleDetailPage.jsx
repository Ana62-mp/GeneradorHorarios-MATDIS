import { useMemo, useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { Link, useParams } from "react-router";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ScheduleCard from "../components/schedules/ScheduleCard";
import ScheduleStats from "../components/schedules/ScheduleStats";

import { useScheduleResults } from "../hooks/useScheduleResults";

import {
  formatDateTime,
  formatModality,
} from "../utils/formatters";

import "./ScheduleDetailPage.css";

function ScheduleDetailPage() {
  const { id } = useParams();

  const {
    generation,
    loading,
    loadGeneration,
  } = useScheduleResults(id);

  const [filter, setFilter] = useState("VALIDOS");

  const filteredSchedules = useMemo(() => {
    if (!generation) {
      return [];
    }

    if (filter === "TODOS") {
      return generation.schedules;
    }

    if (filter === "VALIDOS") {
      return generation.schedules.filter(
        (schedule) => schedule.valid,
      );
    }

    return generation.schedules.filter(
      (schedule) => !schedule.valid,
    );
  }, [generation, filter]);

  if (loading) {
    return (
      <section className="schedule-detail-page app-page">
        <Container>
          <LoadingSpinner message="Consultando la generación..." />
        </Container>
      </section>
    );
  }

  if (!generation) {
    return (
      <section className="schedule-detail-page app-page">
        <Container className="text-center">
          <h1>Generación no encontrada</h1>

          <Button
            as={Link}
            to="/resultados"
            className="btn-primary-custom mt-3"
          >
            Regresar al historial
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="schedule-detail-page app-page">
      <Container>
        <header className="schedule-detail-page__header">
          <div>
            <Button
              as={Link}
              to="/resultados"
              variant="link"
              className="schedule-detail-page__back"
            >
              <FaArrowLeft />
              Volver al historial
            </Button>

            <span className="section-eyebrow">
              <FaCalendarAlt />
              Generación #{generation.id}
            </span>

            <h1>Resultados de horarios</h1>

            <p>
              Generado el{" "}
              <strong>
                {formatDateTime(
                  generation.generatedAt ??
                    generation.createdAt,
                )}
              </strong>
            </p>
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={loadGeneration}
          >
            <FaSyncAlt className="me-2" />
            Actualizar
          </Button>
        </header>

        <ScheduleStats statistics={generation.statistics} />

        <section className="generation-configuration">
          <div>
            <small>Materias por horario</small>
            <strong>
              {generation.configuration.numberOfCourses}
            </strong>
          </div>

          <div>
            <small>Créditos máximos</small>
            <strong>
              {generation.configuration.maximumCredits}
            </strong>
          </div>

          <div>
            <small>Máximo difíciles</small>
            <strong>
              {
                generation.configuration
                  .maximumDifficultCourses
              }
            </strong>
          </div>

          <div>
            <small>Modalidad</small>
            <strong>
              {formatModality(
                generation.configuration.requiredModality,
              )}
            </strong>
          </div>

          <div>
            <small>Evitar cruces</small>
            <strong>
              {generation.configuration.avoidTimeConflicts
                ? "Sí"
                : "No"}
            </strong>
          </div>

          <div>
            <small>Prerrequisitos</small>
            <strong>
              {generation.configuration.validatePrerequisites
                ? "Activos"
                : "Inactivos"}
            </strong>
          </div>
        </section>

        <div className="schedule-results-toolbar">
          <div>
            <FaFilter />
            <span>Filtrar resultados</span>
          </div>

          <Form.Select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="VALIDOS">
              Horarios válidos
            </option>

            <option value="DESCARTADOS">
              Horarios descartados
            </option>

            <option value="TODOS">
              Todos los horarios
            </option>
          </Form.Select>
        </div>

        <div className="schedule-results-count">
          Mostrando{" "}
          <strong>{filteredSchedules.length}</strong>{" "}
          resultados
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="schedule-results-empty">
            <FaCalendarAlt />

            <h3>No existen horarios en este filtro</h3>

            <p>
              Cambia el filtro para consultar otros resultados.
            </p>
          </div>
        ) : (
          <div className="schedule-results-grid">
            {filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default ScheduleDetailPage;