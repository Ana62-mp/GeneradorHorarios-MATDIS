import "./FeatureCard.css";

function FeatureCard({
  icon,
  title,
  description,
  accent = "orange",
}) {
  return (
    <article className={`feature-card feature-card--${accent}`}>
      <div className="feature-card__icon">
        {icon}
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default FeatureCard;