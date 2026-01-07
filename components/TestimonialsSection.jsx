import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    content: "BitMaster was instrumental in my interview prep. The structured problem sets and real-time feedback helped me land my dream job at Google.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Developer at Meta",
    avatar: "MJ",
    content: "After 3 months of consistent practice on BitMaster, I went from failing every coding interview to receiving multiple offers. Highly recommend!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Backend Engineer at Amazon",
    avatar: "PS",
    content: "The company-specific problem tracks were exactly what I needed. The community solutions taught me approaches I never would have thought of.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Loved by developers worldwide
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of developers who have transformed their careers with BitMaster.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 text-foreground">"{testimonial.content}"</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
