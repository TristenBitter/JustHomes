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

function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

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

  const current = testimonials[index];

  return (
    <div className="testimonials">
      <div
        className="testimonials__card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Quote className="testimonials__mark" aria-hidden="true" size={32} strokeWidth={1.5} />
        <p className="testimonials__quote">{current.quote}</p>
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
