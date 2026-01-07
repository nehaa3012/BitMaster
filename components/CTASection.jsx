import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          {/* Background effects */}
          <div className="absolute inset-0 grid-background opacity-50" />
          <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-24">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Ready to become a{" "}
              <span className="gradient-text">better programmer</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Join 50,000+ developers who are mastering algorithms and landing their dream jobs. 
              Start your journey today — it's free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Practicing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border bg-transparent text-foreground hover:bg-secondary"
              >
                View All Problems
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;