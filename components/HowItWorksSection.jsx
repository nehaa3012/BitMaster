import { MousePointer2, Code, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MousePointer2,
    title: "Choose a Problem",
    description: "Browse problems by difficulty, topic, or company. Filter to find exactly what you need to practice.",
  },
  {
    number: "02",
    icon: Code,
    title: "Write Your Solution",
    description: "Code in your preferred language with our powerful in-browser editor. Get syntax highlighting and auto-complete.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Submit & Learn",
    description: "Run your code against test cases, get instant feedback, and compare with optimal solutions.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Start coding in minutes
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our streamlined process makes it easy to practice and improve your coding skills.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-24 hidden h-px w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step Number & Icon */}
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-card">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
