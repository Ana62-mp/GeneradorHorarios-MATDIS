import { useMemo, useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaLaptop,
  FaPlus,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CourseForm from "../components/courses/CourseForm";
import CourseTable from "../components/courses/CourseTable";

import { useCourses } from "../hooks/useCourses";

import "./CoursesPage.css";

function CoursesPage() {
  const {
    courses,
    loading,
    saving,
    deleting,
    loadCourses,
    saveCourse,
    removeCourse,
  } = useCourses();

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [modalityFilter, setModalityFilter] = useState("TODAS");

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.name.toLowerCase().includes(normalizedSearch) ||
        course.section?.toLowerCase().includes(normalizedSearch);

      const matchesModality =
        modalityFilter === "TODAS" ||
        course.modality === modalityFilter;

      return matchesSearch && matchesModality;
    });
  }, [courses, search, modalityFilter]);

  const statistics = useMemo(
    () => ({
      total: courses.length,

      presencial: courses.filter(
        (course) => course.modality === "PRESENCIAL",
      ).length,

      virtual: courses.filter(
        (course) => course.modality === "VIRTUAL",
      ).length,
    }),
    [courses],
  );

  const openCreateForm = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleSave = (courseData) =>
    saveCourse(courseData, editingCourse?.id);

  const handleDelete = async () => {
    if (!courseToDelete) {
      return;
    }

    const success = await removeCourse(courseToDelete.id);

    if (success) {
      setCourseToDelete(null);
    }
  };

  return (
    <section className="courses-page app-page">
      <Container>
        <div className="courses-page__header">
          <div>
            <span className="section-eyebrow">
              <FaBookOpen />
              Conjunto universal
            </span>

            <h1>Administración de materias</h1>

            <p>
              Registra cada oferta académica con su horario,
              modalidad, dificultad, créditos y prerrequisitos.
            </p>
          </div>

          <Button
            type="button"
            className="btn-primary-custom"
            onClick={openCreateForm}
          >
            <FaPlus className="me-2" />
            Nueva materia
          </Button>
        </div>

        <Row className="g-4 courses-statistics">
          <Col md={4}>
            <article className="course-stat-card">
              <div className="course-stat-card__icon">
                <FaBookOpen />
              </div>

              <div>
                <span>Total de materias</span>
                <strong>{statistics.total}</strong>
              </div>
            </article>
          </Col>

          <Col md={4}>
            <article className="course-stat-card">
              <div className="course-stat-card__icon course-stat-card__icon--slate">
                <FaChalkboardTeacher />
              </div>

              <div>
                <span>Presenciales</span>
                <strong>{statistics.presencial}</strong>
              </div>
            </article>
          </Col>

          <Col md={4}>
            <article className="course-stat-card">
              <div className="course-stat-card__icon course-stat-card__icon--violet">
                <FaLaptop />
              </div>

              <div>
                <span>Virtuales</span>
                <strong>{statistics.virtual}</strong>
              </div>
            </article>
          </Col>
        </Row>

        <div className="courses-toolbar">
          <InputGroup className="courses-toolbar__search">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>

            <Form.Control
              type="search"
              value={search}
              placeholder="Buscar por materia o sección..."
              aria-label="Buscar materias"
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>

          <Form.Select
            value={modalityFilter}
            aria-label="Filtrar por modalidad"
            onChange={(event) =>
              setModalityFilter(event.target.value)
            }
          >
            <option value="TODAS">Todas las modalidades</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="VIRTUAL">Virtual</option>
          </Form.Select>

          <Button
            type="button"
            variant="outline-secondary"
            className="courses-toolbar__reload"
            disabled={loading}
            onClick={loadCourses}
          >
            <FaSyncAlt className={loading ? "spin" : ""} />
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner message="Consultando materias..." />
        ) : courses.length === 0 ? (
          <EmptyState onAction={openCreateForm} />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="No se encontraron resultados"
            description="Prueba con otro término de búsqueda o cambia el filtro de modalidad."
          />
        ) : (
          <>
            <div className="courses-results">
              Mostrando{" "}
              <strong>{filteredCourses.length}</strong> de{" "}
              <strong>{courses.length}</strong> materias
            </div>

            <CourseTable
              courses={filteredCourses}
              onEdit={openEditForm}
              onDelete={setCourseToDelete}
            />
          </>
        )}
      </Container>

      <CourseForm
        show={showForm}
        courses={courses}
        editingCourse={editingCourse}
        saving={saving}
        onHide={closeForm}
        onSubmit={handleSave}
      />

      <ConfirmModal
        show={Boolean(courseToDelete)}
        loading={deleting}
        title="Eliminar materia"
        message={
          courseToDelete
            ? `¿Seguro que deseas eliminar “${courseToDelete.name}”? También se eliminarán sus relaciones de prerrequisitos.`
            : ""
        }
        onCancel={() => setCourseToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default CoursesPage;