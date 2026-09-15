import { Link } from "react-router-dom";
import contactImage from "../assets/contact-page.jpg";
import PageHero from "../components/marketing/PageHero";
import "./Contact.css";

function Contact() {
  return (
    <>
      <PageHero
        image={contactImage}
        imageAlt="A member of the JustHomes team on a phone call"
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Have a question before you apply, or already submitted an application and need to follow up? Reach out — a real person on our team will get back to you."
        tall
      />

      <div className="contact container">
        <div className="contact-card">
          <h2>Email us</h2>
          <a className="contact-card__link" href="mailto:david@justhomes.us">
            david@justhomes.us
          </a>
          <p>We typically respond within one business day.</p>
        </div>

        <div className="contact-card">
          <h2>Call us</h2>
          <a className="contact-card__link" href="tel:+14804204881">
            480-420-4881
          </a>
        </div>

        <div className="contact-card">
          <h2>Looking to apply?</h2>
          <p>If you're ready to start a rental or rent-to-own application, you don't need to contact us first.</p>
          <Link to="/apply" className="btn btn-primary">
            Start an Application
          </Link>
        </div>
      </div>
    </>
  );
}

export default Contact;
