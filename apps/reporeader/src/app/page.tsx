"use client";

import Link from "next/link";
import React from "react";

export default function HomePage() {
  const features = [
    {
      title: "GitHub Integration",
      description:
        "Connect your GitHub repos and generate documentation in minutes",
      icon: "💻",
    },
    {
      title: "Intelligent Analysis",
      description:
        "AI-powered component discovery across React, Vue, Angular, and Svelte",
      icon: "🧠",
    },
    {
      title: "AI Documentation",
      description:
        "Generate human-readable descriptions and practical code examples",
      icon: "📝",
    },
    {
      title: "Visual Testing",
      description:
        "Capture screenshots and test responsive behavior automatically",
      icon: "📱",
    },
  ];

  const testimonials = [
    {
      quote:
        "RepoReader cut our documentation time by 80%. It's a game-changer for our team.",
      author: "Sarah Chen",
      role: "Lead Developer at TechSolutions",
      avatar: "👩‍💻",
    },
    {
      quote:
        "The AI-generated documentation is surprisingly accurate and detailed. Highly recommended!",
      author: "Michael Rodriguez",
      role: "CTO at StartupInnovate",
      avatar: "👨‍💻",
    },
    {
      quote:
        "We integrated RepoReader into our CI/CD pipeline. Now our docs are always up-to-date.",
      author: "Emma Watson",
      role: "DevOps Engineer at CloudScale",
      avatar: "👩‍💻",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "1 public repository",
        "Basic AI enhancement",
        "Community subdomain",
        "Standard support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      features: [
        "Up to 10 repositories",
        "Full AI capabilities",
        "Custom subdomain",
        "Team access controls",
        "Usage analytics",
        "Priority support",
      ],
      cta: "Try Free for 14 Days",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited repositories",
        "Advanced security",
        "Custom integration",
        "Dedicated support",
        "Self-hosting option",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <main className="flex w-full flex-col items-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.2),transparent_70%)]" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-3xl" />
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center px-4 py-24 md:px-6 lg:py-32">
        <div className="relative z-10 flex max-w-5xl flex-col items-center space-y-8 text-center">
          <div className="inline-block rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium backdrop-blur-sm dark:bg-white/5">
            Automatic Documentation Platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              RepoReader
            </span>
            <span className="mt-2 block">AI-Enhanced Documentation</span>
          </h1>

          <p className="max-w-3xl text-xl text-muted-foreground">
            Bridge the gap between code and documentation. Automatically analyze
            repositories, extract component information, and create
            comprehensive documentation in minutes.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              Connect with GitHub
            </Link>
            <Link
              href="/demo"
              className="rounded-lg bg-secondary px-8 py-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 hover:shadow-lg"
            >
              See Demo
            </Link>
          </div>
        </div>

        {/* Code Editor Preview Mockup */}
        <div className="relative mt-16 w-full max-w-4xl rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm">
          <div className="flex items-center border-b border-border pb-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 text-xs text-muted-foreground">
              RepoReader AI Documentation Preview
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-5">
            <div className="col-span-1 border-r border-border pr-4">
              <div className="mb-2 text-xs font-medium">Components</div>
              <div className="space-y-1.5">
                {["Button", "Card", "Dialog", "TextField", "Avatar"].map(
                  (component, i) => (
                    <div
                      key={i}
                      className={`rounded px-2 py-1 text-xs ${i === 0 ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    >
                      {component}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-4 pl-4">
              <div className="mb-4">
                <div className="mb-1 text-sm font-medium">Button Component</div>
                <div className="text-xs text-muted-foreground">
                  A versatile button component that supports various styles,
                  sizes, and states.
                </div>
              </div>
              <div className="rounded-md bg-muted p-3">
                <pre className="text-xs">
                  <code>{`<Button
  variant="primary"
  size="medium"
  onClick={handleClick}
  disabled={isLoading}
>
  {isLoading ? "Processing..." : "Submit"}
</Button>`}</code>
                </pre>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["primary", "secondary", "outline", "ghost"].map((variant) => (
                  <div
                    key={variant}
                    className="rounded-md bg-card px-3 py-1.5 text-xs shadow-sm"
                  >
                    {variant}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">
            Documentation Without The Effort
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            RepoReader transforms hours of manual work into minutes of automated
            generation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-muted/30 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Simple, automated, and powered by AI.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Connect Repository",
                  description:
                    "Link your GitHub account and select repositories to document.",
                },
                {
                  step: "2",
                  title: "Automatic Analysis",
                  description:
                    "AI analyzes your codebase and identifies components and structure.",
                },
                {
                  step: "3",
                  title: "Documentation Generation",
                  description:
                    "Complete, professional documentation is generated automatically.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="z-20 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-medium text-primary-foreground shadow-lg shadow-primary/20">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full py-20">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "80%", label: "Documentation Time Saved" },
              { number: "10,000+", label: "Components Documented" },
              { number: "500+", label: "Active Users" },
              { number: "98%", label: "User Satisfaction" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-card/80 p-6 text-center backdrop-blur-sm"
              >
                <div className="text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="mt-2 text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">What Developers Say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Hear from teams who have transformed their documentation process
            with RepoReader.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 text-4xl">{testimonial.avatar}</div>
              <blockquote className="mb-4 flex-1 text-lg font-medium italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-muted/20 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Choose the plan that fits your team's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-xl border bg-card/80 p-6 backdrop-blur-sm ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/pricing/${plan.name.toLowerCase()}`}
                  className={`w-full rounded-lg py-2 text-center font-medium transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              question: "How does RepoReader handle different frameworks?",
              answer:
                "RepoReader uses specialized parsers for React, Vue, Angular, and Svelte. Our AI is trained to understand framework-specific patterns and can generate appropriate documentation for each.",
            },
            {
              question: "Can I customize the generated documentation?",
              answer:
                "Yes! You can edit the generated documentation before publishing, add your own examples, and customize the styling to match your brand.",
            },
            {
              question: "Is my code secure?",
              answer:
                "Absolutely. We never store your code permanently, and all analysis happens in isolated, secure environments. Your code is only used to generate documentation.",
            },
            {
              question: "How often is documentation updated?",
              answer:
                "You can set up webhooks to automatically update documentation when your code changes, or manually trigger updates whenever you want.",
            },
            {
              question: "Can I self-host RepoReader?",
              answer:
                "Yes, Enterprise customers can deploy RepoReader on their own infrastructure. Contact our sales team for details.",
            },
            {
              question: "What output formats are supported?",
              answer:
                "Currently, we support Storybook as our primary output format. We're working on adding Markdown, custom documentation sites, and API reference docs soon.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-2 text-lg font-medium">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Ready to revolutionize your documentation?
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Connect your GitHub account and transform your documentation
                process today. Start with a free account.
              </p>
            </div>

            <Link
              href="/login"
              className="whitespace-nowrap rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              Start For Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card/30 px-4 py-12 backdrop-blur-sm md:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="text-xl font-bold">RepoReader</div>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-Enhanced Documentation Platform
            </p>
            <div className="mt-4 flex space-x-4">
              {["Twitter", "GitHub", "LinkedIn", "Discord"].map(
                (social, index) => (
                  <Link
                    key={index}
                    href={`#${social.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {social}
                  </Link>
                ),
              )}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Demo", "Roadmap"],
            },
            {
              title: "Resources",
              links: ["Documentation", "Blog", "Guides", "Support"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Contact", "Privacy"],
            },
          ].map((column, index) => (
            <div key={index}>
              <div className="mb-4 text-sm font-medium">{column.title}</div>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RepoReader. All rights reserved.
        </div>
      </footer>

      {/* CSS for the grid pattern */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              rgba(var(--border-rgb), 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(var(--border-rgb), 0.1) 1px,
              transparent 1px
            );
        }
      `}</style>
    </main>
  );
}
