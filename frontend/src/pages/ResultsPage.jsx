import { useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { Link } from "react-router";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEye,
  FaHistory,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";

import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

import { useScheduleHistory } from "../hooks/useScheduleHistory";
import {
  formatDateTime,
  formatModality,
} from "../utils/formatters";

import "./ResultsPage.css";

function ResultsPage() {
  const {
    generations,
    loading,
    deleting,
    removeGeneration,
  } = useScheduleHistory();

  const [generationToDelete, setGenerationToDelete] =
    useState(null);

  const handleDelete = async () => {
    if (!generationToDelete) {
      return;
    }

    const success = await removeGeneration(
      generationToDelete.id,
    );

    if (success) {
      setGenerationToDelete(null);
    }
  };

  return (
    <section className="results-page app-page">
      <Container>
        <header className="results-page__header">
          <div>
            <span className="section-eyebrow">
              <FaHistory />
              Historial
            </span>

            <h1>Generaciones realizadas</h1>

            <p>
              Consulta configuraciones anteriores, resultados y
              motivos de descarte.
            </p>
          </div>

          <Button
            as={Link}
            to="/configuracion"
            className="btn-primary-custom"
          >
            <FaPlus className="me-2" />
            Nueva generación
          </Button>
        </header>

        {loading ? (
          <LoadingSpinner message="Consultando historial..." />
        ) : generations.length === 0 ? (
          <EmptyState
            title="Todavía no existen generaciones"
            description="Configura las restricciones y genera tu primer conjunto de horarios."
          />
        ) : (
          <div className="generation-history">
            {generations.map((generation) => (
              <article
                className="generation-history__card"
                key={generation.id}
              >
                <div className="generation-history__identity">
                  <span>
                    <FaCalendarAlt />
                  </span>

                  <div>
                    <small>Generación</small>
                    <h2>#{generation.id}</h2>
                  </div>
                </div>

                <div className="generation-history__configuration">
                  <div>
                    <small>Materias</small>
                    <strong>
                      {generation.numberOfCourses}
                    </strong>
                  </div>

                  <div>
                    <small>Modalidad</small>
                    <strong>
                      {formatModality(
                        generation.requiredModality,
                      )}
                    </strong>
                  </div>

                  <div>
                    <small>Combinaciones</small>
                    <strong>
                      {generation.totalCombinations}
                    </strong>
                  </div>
                </div>

                <div className="generation-history__results">
                  <span className="generation-result generation-result--valid">
                    <FaCheckCircle />
                    {generation.validSchedulesCount} válidos
                  </span>

                  <span className="generation-result generation-result--discarded">
                    <FaTimesCircle />
                    {generation.discardedSchedulesCount} descartados
                  </span>
                </div>

                <div className="generation-history__date">
                  <small>Generado</small>

                  <strong>
                    {formatDateTime(
                      generation.generatedAt ??
                        generation.createdAt,
                    )}
                  </strong>
                </div>

                <div className="generation-history__actions">
                  <Button
                    as={Link}
                    to={`/resultados/${generation.id}`}
                    className="generation-action generation-action--view"
                  >
                    <FaEye />
                  </Button>

                  <Button
                    type="button"
                    className="generation-action generation-action--delete"
                    onClick={() =>
                      setGenerationToDelete(generation)
                    }
                  >
                    <FaTrash />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        show={Boolean(generationToDelete)}
        loading={deleting}
        title="Eliminar generación"
        message={
          generationToDelete
            ? `¿Seguro que deseas eliminar la generación #${generationToDelete.id} y todos sus horarios?`
            : ""
        }
        onCancel={() => setGenerationToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default ResultsPage;