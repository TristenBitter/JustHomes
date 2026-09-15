import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import "./TestimonialsCarousel.css";

export interface Testimonial {
  quote: string;
  author: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const WHEEL_COOLDOWN_MS = 500;
const WHEEL_THRESHOLD = 25;

function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const lastWheelNav = useRef(0);

  const goTo = (next: number) => {
    setIndex((next + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goTo(index - 1);
    else if (delta < -40) goTo(index + 1);
    touchStartX.current = null;
  };

  const handleWheel = (event: React.WheelEvent) => {
    // Only react to a clearly horizontal gesture (trackpad swipe), not vertical page scroll.
    if (Math.abs(event.deltaX) < WHEEL_THRESHOLD || Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;

    const now = Date.now();
    if (now - lastWheelNav.current < WHEEL_COOLDOWN_MS) return;
    lastWheelNav.current = now;

    if (event.deltaX > 0) goTo(index + 1);
    else goTo(index - 1);
  };

  const current = testimonials[index];

  return (
    <div className="testimonials">
      <div
        className="testimonials__card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <Quote className="testimonials__mark" aria-hidden="true" size={32} strokeWidth={1.5} />
        <p className="testimonials__quote">&ldquo;{current.quote}&rdquo;</p>
        <p className="testimonials__author">{current.author}</p>
      </div>

      <div className="testimonials__controls">
        <button
          type="button"
          className="testimonials__arrow"
          onClick={() => goTo(index - 1)}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="testimonials__dots">
          {testimonials.map((testimonial, dotIndex) => (
            <button
              key={testimonial.author}
              type="button"
              className={`testimonials__dot ${dotIndex === index ? "testimonials__dot--active" : ""}`}
              aria-label={`Show testimonial from ${testimonial.author}`}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>

        <button
          type="button"
          className="testimonials__arrow"
          onClick={() => goTo(index + 1)}
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default TestimonialsCarousel;
