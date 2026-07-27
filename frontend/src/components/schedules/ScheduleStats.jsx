import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {
  FaCheckCircle,
  FaLayerGroup,
  FaTimesCircle,
  FaThLarge,
} from "react-icons/fa";

function ScheduleStats({ statistics }) {
  const items = [
    {
      label: "Materias disponibles",
      value: statistics.totalCourses,
      icon: <FaLayerGroup />,
      className: "schedule-stat--slate",
    },
    {
      label: "Combinaciones",
      value: statistics.totalCombinations,
      icon: <FaThLarge />,
      className: "schedule-stat--violet",
    },
    {
      label: "Horarios válidos",
      value: statistics.validSchedules,
      icon: <FaCheckCircle />,
      className: "schedule-stat--valid",
    },
    {
      label: "Descartados",
      value: statistics.discardedSchedules,
      icon: <FaTimesCircle />,
      className: "schedule-stat--discarded",
    },
  ];

  return (
    <Row className="g-3">
      {items.map((item) => (
        <Col sm={6} xl={3} key={item.label}>
          <article className={`schedule-stat ${item.className}`}>
            <span className="schedule-stat__icon">
              {item.icon}
            </span>

            <div>
              <small>{item.label}</small>
              <strong>{item.value.toLocaleString()}</strong>
            </div>
          </article>
        </Col>
      ))}
    </Row>
  );
}

export default ScheduleStats;