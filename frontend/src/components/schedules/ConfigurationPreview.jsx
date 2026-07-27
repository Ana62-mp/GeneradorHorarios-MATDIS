import {
  FaBookOpen,
  FaCalculator,
  FaExclamationTriangle,
  FaLayerGroup,
} from "react-icons/fa";

function ConfigurationPreview({
  totalCourses,
  selectedAmount,
  totalCombinations,
  requiredCount,
  totalCreditsLimit,
}) {
  const isValidAmount =
    selectedAmount > 0 && selectedAmount <= totalCourses;

  return (
    <aside className="configuration-preview">
      <div className="configuration-preview__header">
        <FaCalculator />
        <div>
          <span>Vista previa matemática</span>
          <strong>Combinaciones sin repetición</strong>
        </div>
      </div>

      <div className="configuration-preview__formula">
        <span>
          C({totalCourses}, {selectedAmount})
        </span>

        <small>=</small>

        <strong>
          {isValidAmount
            ? totalCombinations.toLocaleString()
            : 0}
        </strong>
      </div>

      <div className="configuration-preview__stats">
        <div>
          <FaLayerGroup />
          <span>Conjunto universal</span>
          <strong>{totalCourses}</strong>
        </div>

        <div>
          <FaBookOpen />
          <span>Materias por horario</span>
          <strong>{selectedAmount}</strong>
        </div>

        <div>
          <span className="configuration-preview__symbol">⊆</span>
          <span>Obligatorias</span>
          <strong>{requiredCount}</strong>
        </div>
      </div>

      <div className="configuration-preview__rule">
        <small>Regla lógica aplicada</small>
        <strong>T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ P</strong>
      </div>

      <div className="configuration-preview__limit">
        Máximo permitido:{" "}
        <strong>{totalCreditsLimit} créditos</strong>
      </div>

      {!isValidAmount && (
        <div className="configuration-preview__warning">
          <FaExclamationTriangle />
          La cantidad seleccionada supera las materias disponibles.
        </div>
      )}
    </aside>
  );
}

export default ConfigurationPreview;