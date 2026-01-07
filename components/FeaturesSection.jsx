import { 
  Code2, 
  BarChart3, 
  Zap, 
  Users, 
  Trophy, 
  BookOpen 
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "500+ Coding Problems",
    description: "From easy warm-ups to challenging algorithms. Practice problems from real interviews at FAANG companies.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics. See your strengths and areas to work on.",
  },
  {
    icon: Zap,
    title: "Real-time Execution",
    description: "Write and run code instantly in 15+ programming languages with instant feedback.",
  },
  {
    icon: Users,
    title: "Community Solutions",
    description: "Learn from thousands of community solutions. See different approaches to the same problem.",
  },
  {
    icon: Trophy,
    title: "Weekly Contests",
    description: "Compete with developers worldwide. Climb the leaderboard and earn badges.",
  },
  {
    icon: BookOpen,
    title: "Interview Prep Paths",
    description: "Structured learning paths for specific companies and interview types.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to ace your interviews
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            BitMaster provides all the tools and resources to help you become a better programmer and land your dream job.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
