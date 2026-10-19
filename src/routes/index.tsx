import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raja Balaji — Junior Software Engineer" },
      { name: "description", content: "Portfolio of Raja Balaji, junior software engineer and college student." },
      { property: "og:title", content: "Raja Balaji — Junior Software Engineer" },
      { property: "og:description", content: "Projects, skills and contact for Raja Balaji." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const projects = [
  { name: "Campus Connect", desc: "A web app helping students find study groups and events.", tech: ["React", "Node.js", "PostgreSQL"] },
  { name: "Task Tracker CLI", desc: "A fast command-line todo manager with tags and deadlines.", tech: ["Python", "SQLite"] },
  { name: "Weather Dash", desc: "Live weather dashboard with charts and location search.", tech: ["TypeScript", "REST APIs"] },
];
const skills = ["JavaScript", "TypeScript", "Python", "Java", "React", "Node.js", "SQL", "Git", "Linux"];

function Index() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 font-mono">
      <header>
        <p className="text-sm text-primary">~/raja-balaji $ whoami</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">Raja Balaji</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Junior software engineer & college student. I build clean, useful software and love learning new things.
        </p>
        <nav className="mt-6 flex gap-4 text-sm">
          <a className="underline hover:text-primary" href="#projects">Projects</a>
          <a className="underline hover:text-primary" href="#skills">Skills</a>
          <a className="underline hover:text-primary" href="#contact">Contact</a>
        </nav>
      </header>

      <section className="mt-16">
        <h2 className="text-xl font-bold"># About</h2>
        <p className="mt-3 text-muted-foreground">
          I'm studying Computer Science and gaining hands-on experience through personal projects, hackathons, and internships. I'm looking for opportunities to grow as an engineer.
        </p>
      </section>

      <section id="projects" className="mt-16">
        <h2 className="text-xl font-bold"># Projects</h2>
        <div className="mt-4 grid gap-4">
          {projects.map((p) => (
            <article key={p.name} className="rounded-lg border bg-card p-5 transition hover:border-primary">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="mt-16">
        <h2 className="text-xl font-bold"># Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="rounded-full border px-3 py-1 text-sm">{s}</span>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16">
        <h2 className="text-xl font-bold"># Contact</h2>
        <ul className="mt-3 space-y-1 text-muted-foreground">
          <li>Email: <a className="text-primary underline" href="mailto:raja.balaji@example.com">raja.balaji@example.com</a></li>
          <li>GitHub: <a className="text-primary underline" href="https://github.com/">github.com/rajabalaji</a></li>
          <li>LinkedIn: <a className="text-primary underline" href="https://linkedin.com/">linkedin.com/in/rajabalaji</a></li>
        </ul>
      </section>

      <footer className="mt-20 text-xs text-muted-foreground">© {new Date().getFullYear()} Raja Balaji</footer>
    </main>
  );
}
