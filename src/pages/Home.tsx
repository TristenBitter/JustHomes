import { Link } from "react-router-dom";
import heroImage from "../assets/hero-home.jpg";
import TestimonialsCarousel from "../components/marketing/TestimonialsCarousel";
import "./Home.css";

const TESTIMONIALS = [
  {
    quote:
      "JustHomes and David Bitter really helped us out when we needed a house. The terms and rent were very affordable. I recommend them to anyone having difficulty getting conventional financing.",
    author: "Traci & Robert",
  },
  {
    quote:
      "I have been doing business with David for nine years. He has been helping us to buy a home and repair our credit. I have found David to be very upfront and honest and what he says he does. I would highly recommend him and would send family and friends to him if needed.",
    author: "Selena",
  },
  {
    quote:
      "We have lived in one of David's homes for a little over a year, and we have loved every minute. David has been a warm, attentive, and kind landlord since day one.",
    author: "Lauren & Jeremy",
  },
];

function Home() {
  return (
    <>
      <section className="hero">
        <img
          src={heroImage}
          alt="A JustHomes property at dusk in the Phoenix, Arizona area"
          className="hero__image"
        />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="hero__eyebrow">Phoenix, Arizona</p>
          <h1>Find your next home, without the paperwork.</h1>
          <p className="hero__subtitle">
            JustHomes is a family-owned property management company offering rental apartments and
            rent-to-own homes. We make it simple to apply and start your path to a new home online.
          </p>
          <div className="hero__actions">
            <Link to="/apply" className="btn btn-primary">
              Start an Application
            </Link>
          </div>
        </div>
      </section>

      <section className="lease-option">
        <div className="container lease-option__inner">
          <p className="lease-option__eyebrow">Rent to Own · A Path to Homeownership</p>
          <h2>What is a Lease Option?</h2>
          <p>
            A Lease Option, sometimes called compassionate financing, gives you the opportunity to rent a
            home with the intent and option to purchase it over time, typically within 2–10 years. Instead
            of simply renting a house with no path forward, you are working toward making that house your
            own. During the lease period, you can care for the home, personalize it, and make it feel like
            yours while preparing for ownership. When the lease agreement is fulfilled and the purchase is
            completed, the home is officially yours.
          </p>
          <p className="lease-option__closer">
            It is more than renting. It is a structured path toward homeownership.
          </p>
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

      <section className="testimonials-section">
        <div className="container">
          <h2 className="testimonials-section__heading">What our residents say</h2>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Start your rental or rent-to-own application online in just a few minutes.</p>
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
