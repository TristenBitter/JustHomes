import { Link } from "react-router-dom";
import "./About.css";

const VALUES = [
  {
    icon: "⏱️",
    title: "Your time matters",
    description:
      "Applying for a place to live shouldn't mean printing paperwork or playing phone tag. Everything happens online, start to finish.",
  },
  {
    icon: "🤝",
    title: "Family-owned, hands-on",
    description:
      "JustHomes is a family-owned property management business. When you apply, a real person on our team reviews it — not a call center.",
  },
  {
    icon: "🌵",
    title: "Rooted in the Phoenix area",
    description: "We manage apartments and rent-to-own homes across the greater Phoenix metro area.",
  },
];

function About() {
  return (
    <div className="about container">
      <p className="about__eyebrow">About</p>
      <h1>A family-owned business, built around your time</h1>
      <p className="about__subtitle">
        JustHomes manages rental apartments and rent-to-own homes across the Phoenix, Arizona area. We built this
        site because applying for a place to live shouldn't take longer than finding one.
      </p>

      <div className="about__values">
        {VALUES.map((value) => (
          <div className="about-value-card" key={value.title}>
            <span className="about-value-card__icon" aria-hidden="true">
              {value.icon}
            </span>
            <h2>{value.title}</h2>
            <p>{value.description}</p>
          </div>
        ))}
      </div>

      <div className="about__cta">
        <h2>Ready to get started?</h2>
        <p>Browse our current process or jump straight into an application.</p>
        <Link to="/apply" className="btn btn-primary">
          Start an Application
        </Link>
      </div>
    </div>
  );
}

export default About;
