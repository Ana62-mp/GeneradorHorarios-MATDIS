import { useNavigate } from "react-router";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import {
  FaArrowRight,
  FaBookOpen,
  FaSlidersH,
} from "react-icons/fa";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ScheduleConfigForm from "../components/schedules/ScheduleConfigForm";

import { useScheduleGenerator } from "../hooks/useScheduleGenerator";

import "./ScheduleConfigPage.css";

function ScheduleConfigPage() {
  const navigate = useNavigate();

  const {
    courses,
    loadingCourses,
    generating,
    generate,
  } = useScheduleGenerator();

  const handleGenerate = async (configuration) => {
    const result = await generate(configuration);

    if (!result) {
      return;
    }

    navigate(`/resultados/${result.configurationId}`, {
      state: {
        generationResult: result,
      },
    });
  };

  if (loadingCourses) {
    return (
      <section className="schedule-config-page app-page">
        <Container>
          <LoadingSpinner message="Preparando las materias disponibles..." />
        </Container>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="schedule-config-page app-page">
        <Container>
          <div className="configuration-empty">
            <span>
              <FaBookOpen />
            </span>

            <h1>Primero registra tus materias</h1>

            <p>
              El conjunto universal está vacío. Necesitas al menos
              una materia antes de generar combinaciones.
            </p>

            <Button
              type="button"
              className="btn-primary-custom"
              onClick={() => navigate("/materias")}
            >
              Registrar materias
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="schedule-config-page app-page">
      <Container>
        <header className="schedule-config-page__header">
          <span className="section-eyebrow">
            <FaSlidersH />
            Paso 2 de 3
          </span>

          <h1>Configura tu horario ideal</h1>

          <p>
            Selecciona las restricciones académicas y observa en
            tiempo real cuántas combinaciones deberá evaluar el
            sistema.
          </p>
        </header>

        <ScheduleConfigForm
          courses={courses}
          generating={generating}
          onGenerate={handleGenerate}
        />
      </Container>
    </section>
  );
}

export default ScheduleConfigPage;