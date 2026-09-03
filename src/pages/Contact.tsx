import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact container">
      <p className="contact__eyebrow">Contact</p>
      <h1>Get in touch</h1>
      <p className="contact__subtitle">
        Have a question before you apply, or already submitted an application and need to follow up? Reach out —
        a real person on our team will get back to you.
      </p>

      <div className="contact-card">
        <h2>Email us</h2>
        <a className="contact-card__email" href="mailto:david@justhomes.us">
          david@justhomes.us
        </a>
        <p>We typically respond within one business day.</p>
      </div>

      <div className="contact-card">
        <h2>Looking to apply?</h2>
        <p>If you're ready to start a rental or rent-to-own application, you don't need to contact us first.</p>
        <Link to="/apply" className="btn btn-primary">
          Start an Application
        </Link>
      </div>
    </div>
  );
}

export default Contact;
