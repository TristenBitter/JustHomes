import type { ReactNode } from "react";
import "./PageHero.css";

interface PageHeroProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  tall?: boolean;
  children?: ReactNode;
}

function PageHero({ image, imageAlt, eyebrow, title, subtitle, tall, children }: PageHeroProps) {
  return (
    <section className={`page-hero ${tall ? "page-hero--tall" : ""}`}>
      <img src={image} alt={imageAlt} className="page-hero__image" />
      <div className="page-hero__overlay" aria-hidden="true" />
      <div className="container page-hero__inner">
        <p className="page-hero__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export default PageHero;
