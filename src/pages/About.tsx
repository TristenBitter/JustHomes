import { Link } from "react-router-dom";
import { Clock, Handshake, MapPinHouse } from "lucide-react";
import aboutImage from "../assets/about-page.jpg";
import PageHero from "../components/marketing/PageHero";
import "./About.css";

const VALUES = [
  {
    icon: Clock,
    title: "Your time matters",
    description:
      "Applying for a place to live shouldn't mean printing paperwork or playing phone tag. Everything happens online, start to finish.",
  },
  {
    icon: Handshake,
    title: "Family-owned, hands-on",
    description:
      "JustHomes is a family-owned property management business. When you apply, a real person on our team reviews it — not a call center.",
  },
  {
    icon: MapPinHouse,
    title: "Rooted in the Phoenix area",
    description: "We manage apartments and rent-to-own homes across the greater Phoenix metro area.",
  },
];

function About() {
  return (
    <>
      <PageHero
        image={aboutImage}
        imageAlt="A JustHomes property in the Phoenix, Arizona area"
        eyebrow="About"
        title="About JustHomes"
      />

      <div className="about container">
        <div className="about__narrative">
          <p>
            JustHomes is dedicated to making quality housing and homeownership more accessible across the
            Phoenix, Arizona area. We offer comfortable rental apartments as well as rent-to-own homes
            through lease options, giving families more choices when it comes to finding a place to live and
            building toward a home of their own.
          </p>
          <p>
            We believe that having a home should be about more than simply paying rent. Our goal is to
            provide affordable housing and compassionate financing options for people who want a realistic
            path toward homeownership but may not be ready for a traditional mortgage today.
          </p>
          <p>
            With our lease option program, qualified residents can live in a home with the intention of
            purchasing it over time, giving them the opportunity to care for the property, make it their own,
            and work toward ownership.
          </p>
          <p>
            At JustHomes, we believe everyone deserves the opportunity to have a place they can truly call
            home.
          </p>
        </div>

        <div className="about__values">
          {VALUES.map((value) => (
            <div className="about-value-card" key={value.title}>
              <span className="about-value-card__icon" aria-hidden="true">
                <value.icon size={26} strokeWidth={1.75} />
              </span>
              <h2>{value.title}</h2>
              <p>{value.description}</p>
            </div>
          ))}
        </div>

        <div className="about__cta">
          <h2>Ready to get started?</h2>
          <p>Jump straight into an apartment rental or rent-to-own application.</p>
          <Link to="/apply" className="btn btn-primary">
            Start an Application
          </Link>
        </div>
      </div>
    </>
  );
}

export default About;
