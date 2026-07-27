import Badge from "react-bootstrap/Badge";

import {
  FaBook,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaTimesCircle,
} from "react-icons/fa";

import RejectionReasons from "./RejectionReasons";

import { formatDay } from "../../utils/formatters";

function ScheduleCard({ schedule }) {
  return (
    <article
      className={[
        "schedule-card",
        schedule.valid
          ? "schedule-card--valid"
          : "schedule-card--discarded",
      ].join(" ")}
    >
      <header className="schedule-card__header">
        <div>
          <span className="schedule-card__number">
            Combinación #{schedule.combinationNumber}
          </span>

          <h3>
            {schedule.valid ? (
              <>
                <FaCheckCircle />
                Horario válido
              </>
            ) : (
              <>
                <FaTimesCircle />
                Horario descartado
              </>
            )}
          </h3>
        </div>

        <Badge
          className={
            schedule.valid
              ? "schedule-status schedule-status--valid"
              : "schedule-status schedule-status--discarded"
          }
        >
          {schedule.valid ? "Válido" : "Descartado"}
        </Badge>
      </header>

      <div className="schedule-card__summary">
        <span>
          <FaBook />
          {schedule.courses.length} materias
        </span>

        <span>
          <FaGraduationCap />
          {schedule.totalCredits} créditos
        </span>

        <span>
          Dificultad alta: {schedule.difficultCoursesCount}
        </span>
      </div>

      <div className="schedule-card__courses">
        {schedule.courses.map((course) => (
          <div className="schedule-course" key={course.id}>
            <div>
              <strong>{course.name}</strong>

              <small>
                {course.section
                  ? `Sección ${course.section}`
                  : "Sin sección"}
              </small>
            </div>

            <div className="schedule-course__time">
              <strong>{formatDay(course.day)}</strong>

              <small>
                <FaClock />
                {course.startTime} – {course.endTime}
              </small>
            </div>

            <Badge
              className={`schedule-course__modality schedule-course__modality--${course.modality.toLowerCase()}`}
            >
              {course.modality === "VIRTUAL"
                ? "Virtual"
                : "Presencial"}
            </Badge>
          </div>
        ))}
      </div>

      <RejectionReasons reasons={schedule.reasons} />
    </article>
  );
}

export default ScheduleCard;