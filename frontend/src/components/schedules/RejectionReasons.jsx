import { FaExclamationTriangle } from "react-icons/fa";

function RejectionReasons({ reasons = [] }) {
  if (reasons.length === 0) {
    return null;
  }

  return (
    <div className="rejection-reasons">
      <strong>
        <FaExclamationTriangle />
        Motivos de descarte
      </strong>

      <ul>
        {reasons.map((reason, index) => (
          <li key={`${reason}-${index}`}>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RejectionReasons;