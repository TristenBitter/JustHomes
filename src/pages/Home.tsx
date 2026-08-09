import { Link } from "react-router-dom";
import "./Home.css";

const STEPS = [
  {
    icon: "🔍",
    title: "Browse",
    description: "Search available rentals across the Phoenix area and find the right fit.",
  },
  {
    icon: "📝",
    title: "Apply Online",
    description: "Complete your rental application from any device — no printing, no office visit.",
  },
  {
    icon: "🔑",
    title: "Move In",
    description: "We review your application and get you into your new home faster.",
  },
];

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow">Phoenix, Arizona</p>
          <h1>Find your next home, without the paperwork.</h1>
          <p className="hero__subtitle">
            JustHomes is a family-owned property management company. We make renting
            simple — browse available properties and complete your entire application online.
          </p>
          <div className="hero__actions">
            <Link to="/properties" className="btn btn-primary">
              Browse Properties
            </Link>
            <Link to="/apply" className="btn btn-secondary">
              Start an Application
            </Link>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How it works</h2>
          <div className="how-it-works__grid">
            {STEPS.map((step, index) => (
              <div className="step-card" key={step.title}>
                <span className="step-card__number">{index + 1}</span>
                <span className="step-card__icon" aria-hidden="true">
                  {step.icon}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-blurb">
        <div className="container about-blurb__inner">
          <h2>A family-owned business that values your time</h2>
          <p>
            We know applying for a rental usually means paperwork, phone tag, and waiting.
            JustHomes was built to change that — a straightforward, digital application
            process so you can spend less time on forms and more time settling into your
            new home.
          </p>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Start your rental application online in just a few minutes.</p>
          </div>
          <Link to="/apply" className="btn btn-primary">
            Start an Application
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
