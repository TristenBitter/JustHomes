import { Link } from "react-router-dom";
import "./ComingSoon.css";

interface ComingSoonProps {
  title: string;
  description: string;
}

function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="coming-soon container">
      <p className="coming-soon__eyebrow">Coming soon</p>
      <h1>{title}</h1>
      <p className="coming-soon__description">{description}</p>
      <Link to="/" className="btn btn-secondary">
        Back to home
      </Link>
    </section>
  );
}

export default ComingSoon;
