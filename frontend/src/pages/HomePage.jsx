import {
  Badge,
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";

import { Link } from "react-router";

import {
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
  FaCodeBranch,
  FaLayerGroup,
  FaProjectDiagram,
} from "react-icons/fa";

import FeatureCard from "../components/common/FeatureCard";

import "./HomePage.css";

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-section__shape hero-section__shape--one" />
        <div className="hero-section__shape hero-section__shape--two" />

        <Container className="position-relative">
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <Badge className="hero-section__badge">
                Matemáticas discretas + desarrollo web
              </Badge>

              <h1 className="hero-section__title">
                Construye tu horario
                <span> sin cruces ni complicaciones.</span>
              </h1>

              <p className="hero-section__description">
                Registra materias, configura restricciones
                académicas y genera automáticamente todas las
                combinaciones válidas mediante conjuntos,
                combinatoria y lógica proposicional.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/configuracion"
                  className="btn-primary-custom"
                >
                  Generar horario
                  <FaArrowRight className="ms-2" />
                </Button>

                <Button
                  as={Link}
                  to="/materias"
                  className="btn-secondary-custom"
                >
                  Administrar materias
                </Button>
              </div>

              <div className="hero-section__checks">
                <span>
                  <FaCheckCircle />
                  Detecta cruces
                </span>

                <span>
                  <FaCheckCircle />
                  Valida prerrequisitos
                </span>

                <span>
                  <FaCheckCircle />
                  Explica descartes
                </span>
              </div>
            </Col>

            <Col lg={5}>
              <div className="logic-panel">
                <div className="logic-panel__header">
                  <span>Modelo matemático</span>
                  <span className="logic-panel__status">
                    Activo
                  </span>
                </div>

                <div className="logic-panel__formula">
                  C(n, r)
                </div>

                <p>
                  Generación de combinaciones sin repetición.
                </p>

                <div className="logic-panel__rule">
                  <small>Regla principal</small>
                  <strong>
                    T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ P
                  </strong>
                </div>

                <div className="logic-panel__subset">
                  Materias obligatorias
                  <span>⊆</span>
                  Materias del horario
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="home-features app-page">
        <Container>
          <div className="text-center mb-5">
            <span className="section-eyebrow">
              <FaLayerGroup />
              Funcionamiento
            </span>

            <h2 className="section-title mx-auto">
              Todo el proceso académico en una sola aplicación
            </h2>

            <p className="section-description mx-auto">
              El sistema conecta directamente los conceptos de
              matemáticas discretas con operaciones reales de
              desarrollo de software.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={4}>
              <FeatureCard
                icon={<FaBookOpen />}
                title="Conjunto de materias"
                description="Las materias registradas forman el conjunto universal disponible para generar horarios."
                accent="slate"
              />
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard
                icon={<FaCodeBranch />}
                title="Combinatoria"
                description="El sistema calcula C(n,r) y construye cada combinación posible sin repetir horarios."
                accent="orange"
              />
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard
                icon={<FaProjectDiagram />}
                title="Reglas lógicas"
                description="Cada horario es evaluado con condiciones AND, OR y NOT para determinar su validez."
                accent="violet"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="home-steps">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="home-step">
                <span>01</span>
                <h3>Registra</h3>
                <p>
                  Ingresa materias, horarios, créditos,
                  dificultad y prerrequisitos.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="home-step">
                <span>02</span>
                <h3>Configura</h3>
                <p>
                  Define las restricciones académicas que debe
                  cumplir el horario.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="home-step">
                <span>03</span>
                <h3>Genera</h3>
                <p>
                  Obtén combinaciones válidas y conoce por qué
                  las demás fueron descartadas.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomePage;