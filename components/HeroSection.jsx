import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background" />
      
      {/* Gradient Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Now with AI-powered hints</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Master Coding Interviews with{" "}
            <span className="gradient-text">BitMaster</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Practice 500+ coding problems, track your progress, and land your dream job 
            at top tech companies. Join 50,000+ developers already leveling up.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-in">
            <Button 
              size="lg" 
              className="glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Practicing Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border bg-transparent text-foreground hover:bg-secondary"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "500+", label: "Problems" },
              { value: "50K+", label: "Users" },
              { value: "1M+", label: "Submissions" },
              { value: "95%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Code Editor Preview */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl glow-accent">
              {/* Editor Header */}
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
                <span className="ml-4 text-sm text-muted-foreground">two-sum.js</span>
              </div>
              {/* Editor Content */}
              <div className="p-6 font-mono text-sm">
                <pre className="text-left">
                  <code>
                    <span className="text-accent">function</span>{" "}
                    <span className="text-primary">twoSum</span>
                    <span className="text-foreground">(nums, target) {"{"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">  {"// Your solution here"}</span>
                    {"\n"}
                    <span className="text-foreground">  </span>
                    <span className="text-accent">const</span>
                    <span className="text-foreground"> map = </span>
                    <span className="text-accent">new</span>
                    <span className="text-foreground"> Map();</span>
                    {"\n"}
                    <span className="text-foreground">  </span>
                    <span className="text-accent">for</span>
                    <span className="text-foreground"> (</span>
                    <span className="text-accent">let</span>
                    <span className="text-foreground"> i = 0; i {"<"} nums.length; i++) {"{"}</span>
                    {"\n"}
                    <span className="text-foreground">    </span>
                    <span className="text-accent">const</span>
                    <span className="text-foreground"> complement = target - nums[i];</span>
                    {"\n"}
                    <span className="text-foreground">    </span>
                    <span className="text-accent">if</span>
                    <span className="text-foreground"> (map.has(complement)) {"{"}</span>
                    {"\n"}
                    <span className="text-foreground">      </span>
                    <span className="text-accent">return</span>
                    <span className="text-foreground"> [map.get(complement), i];</span>
                    {"\n"}
                    <span className="text-foreground">    {"}"}</span>
                    {"\n"}
                    <span className="text-foreground">    map.set(nums[i], i);</span>
                    {"\n"}
                    <span className="text-foreground">  {"}"}</span>
                    {"\n"}
                    <span className="text-foreground">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
