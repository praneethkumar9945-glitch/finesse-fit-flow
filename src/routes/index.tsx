import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Dumbbell, Flame, HeartPulse, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getClasses, type GymClass } from "@/lib/fitness.functions";

const heroImage = "/images/hero.jpg";
const ananyaImage = "/images/trainers/ananya.jpg";
const rohitImage = "/images/trainers/rohit.jpg";
const vikramImage = "/images/trainers/vikram.jpg";

const classesQuery = queryOptions({
  queryKey: ["classes"],
  queryFn: () => getClasses(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(classesQuery),
  head: () => ({
    meta: [
      { title: "Fitness Pro — Train. Track. Transform." },
      {
        name: "description",
        content:
          "High-energy group classes, expert coaches and a progress dashboard that keeps you honest. Start your Fitness Pro journey today.",
      },
      { property: "og:title", content: "Fitness Pro — Train. Track. Transform." },
      {
        property: "og:description",
        content:
          "High-energy group classes, expert coaches and a progress dashboard that keeps you honest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: classes } = useSuspenseQuery(classesQuery);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <StatsStrip />
        <Features />
        <ClassesPreview classes={classes.slice(0, 6)} />
        <Trainers />
        <Testimonials />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-surface relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <Badge variant="outline" className="mb-6 border-primary/40 text-primary">
            <Flame className="mr-1.5 h-3.5 w-3.5" /> Kolkata's most complete fitness club
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Train hard.
            <br />
            Track smart.
            <br />
            <span className="text-ember-gradient">Transform fast.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Group classes that feel like a party, coaches who know your name and a dashboard
            that shows exactly how far you've come. Everything you need to become the
            strongest version of you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild className="glow-ember">
              <Link to="/auth">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/classes">Explore classes</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" aria-hidden />
          <img
            src={heroImage}
            alt="Athletes training with battle ropes in a Fitness Pro studio"
            width={1024}
            height={1024}
            className="relative rounded-3xl object-cover shadow-2xl ring-1 ring-border/60"
          />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "12k+", label: "Members transformed" },
    { value: "40+", label: "Weekly classes" },
    { value: "25+", label: "Expert coaches" },
    { value: "4.9★", label: "Member rating" },
  ];
  return (
    <section className="border-y border-border/60 bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-bold text-primary sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Dumbbell,
      title: "Classes for every mood",
      body: "HIIT, strength, boxing, yoga, spin and dance — 40+ sessions a week from 6 AM to 10 PM.",
    },
    {
      icon: HeartPulse,
      title: "Progress you can see",
      body: "Log workouts, watch calories and streaks climb, and see your week at a glance in your dashboard.",
    },
    {
      icon: Users,
      title: "Coaches in your corner",
      body: "Certified trainers correct your form, build your plan and celebrate every PR with you.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card-surface rounded-2xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClassesPreview({ classes }: { classes: GymClass[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge className="bg-primary/15 text-primary" variant="secondary">
            <Trophy className="mr-1.5 h-3.5 w-3.5" /> Signature programs
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Find your workout
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            From heart-pounding HIIT to restorative yoga — pick what fits your day.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/classes">
            View all classes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <Link
            key={c.id}
            to="/classes"
            className="group card-surface overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
          >
            <img
              src={c.image_url ?? heroImage}
              alt={c.name}
              width={1024}
              height={1024}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-primary/15 text-primary">
                  {c.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {c.duration_minutes} min · {c.intensity} intensity
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const trainers = [
  {
    name: "Ananya Sharma",
    role: "Yoga & Mobility Lead",
    bio: "RYT-500 certified. 10 years turning stiff desk workers into flexible movers.",
    image: ananyaImage,
  },
  {
    name: "Rohit Verma",
    role: "Strength Head Coach",
    bio: "National-level powerlifter. Programs that build real, lasting strength.",
    image: rohitImage,
  },
  {
    name: "Vikram Rao",
    role: "Boxing & Conditioning",
    bio: "Ex-state champion. Rounds, footwork and fitness that hits back at stress.",
    image: vikramImage,
  },
];

function Trainers() {
  return (
    <section className="border-y border-border/60 bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
          Coaches who show up for you
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Every Fitness Pro coach is certified, background-verified and obsessed with your form.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {trainers.map((t) => (
            <div key={t.name} className="text-center">
              <img
                src={t.image}
                alt={t.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="mx-auto h-56 w-56 rounded-full object-cover ring-2 ring-primary/30"
              />
              <h3 className="mt-5 font-display text-lg font-semibold">{t.name}</h3>
              <p className="text-sm font-medium text-primary">{t.role}</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "I lost 11 kg in five months and actually look forward to the 6 AM HIIT class. The streak counter keeps me honest.",
    name: "Priya M.",
    detail: "Pro member · 8 months",
  },
  {
    quote: "Rohit fixed my squat form in one session. My deadlift went from 80 kg to 140 kg in a year.",
    name: "Arjun K.",
    detail: "Elite member · 1 year",
  },
  {
    quote: "The dashboard is genius — I can see my week, my calories, my bookings in one place. Feels like a game.",
    name: "Sneha D.",
    detail: "Starter member · 3 months",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
        Real people. Real results.
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="card-surface rounded-2xl p-7">
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-5">
              <div className="font-display font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.detail}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="glow-ember relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card p-10 text-center sm:p-16">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Your first class is on us
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Sign up free, book any class and feel the Fitness Pro energy for yourself.
        </p>
        <Button size="lg" asChild className="mt-8">
          <Link to="/auth">
            Claim your free trial <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
