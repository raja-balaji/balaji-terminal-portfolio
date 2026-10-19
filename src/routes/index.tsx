import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Cloud, Code, GraduationCap, Layers, Mail, MapPin, Plus, Trash2, Wrench } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { checkCredentials, isAdminSession, setAdminSession } from "@/lib/admin-auth";
import {
  clearContent,
  defaultContent,
  loadContent,
  saveContent,
  type Content,
  type Experience,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raja Balaji — Junior Software Engineer" },
      { name: "description", content: "Portfolio of Raja Balaji, junior software engineer and college student." },
      { property: "og:title", content: "Raja Balaji — Junior Software Engineer" },
      { property: "og:description", content: "Experience, skills and contact for Raja Balaji." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const skillIcons = [Code, Layers, Cloud, Wrench];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-3 w-0.5 bg-primary" />
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function Field({
  value,
  onChange,
  multiline,
  rows,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  label: string;
}) {
  return multiline ? (
    <textarea
      aria-label={label}
      className={fieldClass}
      rows={rows ?? 3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input aria-label={label} className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

function LoginDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await checkCredentials(username, password);
    setBusy(false);
    if (!ok) {
      setError("Incorrect username or password.");
      return;
    }
    setUsername("");
    setPassword("");
    setError("");
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in to edit</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <input
            aria-label="Username"
            placeholder="Username"
            autoComplete="username"
            className={fieldClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            aria-label="Password"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Index() {
  const [saved, setSaved] = useState<Content>(defaultContent);
  const [draft, setDraft] = useState<Content>(defaultContent);
  const [editing, setEditing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notice, setNotice] = useState("");

  // Load saved edits after mount so server and first client render match.
  useEffect(() => {
    const c = loadContent();
    setSaved(c);
    setDraft(c);
    if (isAdminSession()) setEditing(true);
  }, []);

  const c = editing ? draft : saved;
  const patch = (p: Partial<Content>) => setDraft((d) => ({ ...d, ...p }));
  const patchExp = (i: number, p: Partial<Experience>) =>
    patch({ experience: draft.experience.map((e, j) => (j === i ? { ...e, ...p } : e)) });

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  }

  function save() {
    try {
      saveContent(draft);
    } catch {
      flash("Could not save: browser storage is unavailable.");
      return;
    }
    setSaved(draft);
    flash("Saved");
  }

  function logout() {
    setAdminSession(false);
    setEditing(false);
    setDraft(saved);
  }

  function reset() {
    if (!window.confirm("Reset everything back to the original content?")) return;
    clearContent();
    setSaved(defaultContent);
    setDraft(defaultContent);
    flash("Reset to defaults");
  }

  const dirty = editing && JSON.stringify(draft) !== JSON.stringify(saved);

  const role = c.experience.find((e) => /present/i.test(e.period)) ?? c.experience[0];
  const setStat = (i: number, p: Partial<Content["stats"][number]>) =>
    patch({ stats: draft.stats.map((x, j) => (j === i ? { ...x, ...p } : x)) });

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${editing ? "pb-28" : ""}`}>
      <nav className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <a
            href="#top"
            className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold"
            onClick={() => {
              if (!editing) setLoginOpen(true);
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary font-mono text-xs text-primary-foreground">
              {"</>"}
            </span>
            {c.name}
          </a>
          <div className="flex shrink-0 items-center gap-5 text-sm text-muted-foreground sm:gap-8">
            <a className="hidden transition-colors hover:text-foreground sm:inline" href="#about">About</a>
            <a className="hidden transition-colors hover:text-foreground sm:inline" href="#skills">Skills</a>
            <a className="hidden transition-colors hover:text-foreground sm:inline" href="#experience">Experience</a>
            <a
              className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              href="#contact"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        {/* Hero */}
        <header className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
            <div>
              {editing ? (
                <div className="max-w-sm">
                  <Field label="Badge" value={c.badge} onChange={(v) => patch({ badge: v })} />
                </div>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  {c.badge}
                </span>
              )}
              {editing ? (
                <div className="mt-6 max-w-md">
                  <Field label="Name" value={c.name} onChange={(v) => patch({ name: v })} />
                </div>
              ) : (
                <h1 className="mt-6 whitespace-nowrap text-3xl font-bold leading-[1.05] tracking-tight min-[400px]:text-4xl sm:text-6xl">
                  I'm {c.name.split(" ")[0]}{" "}
                  <span className="text-primary">{c.name.split(" ").slice(1).join(" ")}</span>
                </h1>
              )}
              {editing ? (
                <div className="mt-4 max-w-xl">
                  <Field label="Tagline" multiline rows={2} value={c.tagline} onChange={(v) => patch({ tagline: v })} />
                </div>
              ) : (
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{c.tagline}</p>
              )}
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#about"
                  aria-label="Scroll down"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:translate-y-0.5"
                >
                  <ChevronDown className="h-6 w-6" />
                </a>
                <a
                  href="#experience"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
                >
                  View experience <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Code card in place of a photo */}
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/30 lg:max-w-none">
              <div className="flex items-center gap-1.5 border-b px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">developer.ts</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-muted-foreground">
                <span className="text-primary">const</span> developer = {"{"}
                {"\n  "}name: <span className="text-foreground">"{c.name}"</span>,
                {"\n  "}role: <span className="text-foreground">"{role?.role}"</span>,
                {"\n  "}company: <span className="text-foreground">"{role?.company}"</span>,
                {"\n  "}location: <span className="text-foreground">"{c.location}"</span>,
                {"\n  "}available: <span className="text-primary">true</span>,
                {"\n"}
                {"}"};
              </pre>
            </div>
          </div>
        </header>

        {/* About */}
        <section id="about" className="border-y bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="About me" title={`I've been building for the web since 2022`} />
              {editing ? (
                <div className="mt-6 max-w-xl">
                  <Field label="About (blank line = new paragraph)" multiline rows={9} value={c.about} onChange={(v) => patch({ about: v })} />
                </div>
              ) : (
                <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-muted-foreground">
                  {c.about.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6 lg:justify-end">
              {c.stats.map((st, i) =>
                editing ? (
                  <div key={i} className="w-40 space-y-2">
                    <Field label="Stat value" value={st.value} onChange={(v) => setStat(i, { value: v })} />
                    <Field label="Stat label" value={st.label} onChange={(v) => setStat(i, { label: v })} />
                  </div>
                ) : (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-5xl font-bold tracking-tight">{st.value}</span>
                    <span className="max-w-[6rem] text-xs leading-snug text-muted-foreground">{st.label}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <SectionHeading eyebrow="My skills" title="My extensive list of skills" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {c.skills.map((g, i) => {
              const Icon = skillIcons[i % skillIcons.length] ?? Code;
              return (
                <div key={i} className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  {editing ? (
                    <div className="mt-5 space-y-2">
                      <Field
                        label="Skill group"
                        value={g.group}
                        onChange={(v) => patch({ skills: draft.skills.map((x, j) => (j === i ? { ...x, group: v } : x)) })}
                      />
                      <Field
                        label="Skills, comma separated"
                        multiline
                        rows={3}
                        value={g.items.join(", ")}
                        onChange={(v) =>
                          patch({ skills: draft.skills.map((x, j) => (j === i ? { ...x, items: v.split(",").map((t) => t.trim()) } : x)) })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="mt-5 text-lg font-semibold">{g.group}</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {g.items.filter(Boolean).map((t) => (
                          <span key={t} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="border-y bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
            <SectionHeading eyebrow="Experience" title="Where I've Worked and What I've Built" />
            <ol className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2">
              {c.experience.map((e, i) => (
                <li key={i} className="rounded-2xl border bg-card p-6 sm:p-7">
                  {editing ? (
                    <div className="space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Field label="Role" value={e.role} onChange={(v) => patchExp(i, { role: v })} />
                        <Field label="Company" value={e.company} onChange={(v) => patchExp(i, { company: v })} />
                        <Field label="Period" value={e.period} onChange={(v) => patchExp(i, { period: v })} />
                        <Field label="Location" value={e.location} onChange={(v) => patchExp(i, { location: v })} />
                      </div>
                      <Field
                        label="Bullet points, one per line"
                        multiline
                        rows={Math.max(4, e.points.length * 3)}
                        value={e.points.join("\n")}
                        onChange={(v) => patchExp(i, { points: v.split("\n") })}
                      />
                      <button
                        type="button"
                        onClick={() => patch({ experience: draft.experience.filter((_, j) => j !== i) })}
                        className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove this entry
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">{e.period}</span>
                        <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">{e.location}</span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-snug">{e.role}</h3>
                      <p className="text-sm text-muted-foreground">{e.company}</p>
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                        {e.points
                          .filter((pt) => pt.trim())
                          .map((pt, k) => (
                            <li key={k} className="flex gap-3">
                              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                              <span>{pt}</span>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ol>
            {editing && (
              <button
                type="button"
                onClick={() =>
                  patch({
                    experience: [
                      ...draft.experience,
                      { role: "New role", company: "Company", period: "Start – End", location: "Location", points: ["Describe what you did"] },
                    ],
                  })
                }
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                <Plus className="h-4 w-4" /> Add experience
              </button>
            )}
          </div>
        </section>

        {/* Education */}
        <section id="education" className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <SectionHeading eyebrow="Education" title="Where I'm studying" />
          <div className="mt-10 flex items-start gap-4 rounded-2xl border bg-card p-6 sm:p-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            {editing ? (
              <div className="w-full space-y-2">
                <Field label="School" value={c.education.school} onChange={(v) => patch({ education: { ...draft.education, school: v } })} />
                <Field label="Degree details" value={c.education.detail} onChange={(v) => patch({ education: { ...draft.education, detail: v } })} />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">{c.education.school}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.education.detail}</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2">
            <div>
              <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Interested in working together? Let's talk <ArrowRight className="inline h-7 w-7 text-primary" />
              </h2>
            </div>
            <div className="space-y-4">
              {editing ? (
                <>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-primary" />
                    <Field label="Email" value={c.email} onChange={(v) => patch({ email: v })} />
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                    <Field label="Location" value={c.location} onChange={(v) => patch({ location: v })} />
                  </div>
                </>
              ) : (
                <>
                  <a
                    href={`mailto:${c.email}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50"
                  >
                    <span className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Email</span>
                        <span className="break-all text-sm font-medium">{c.email}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                  <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>
                      <span className="block text-xs text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">{c.location}</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="border-t">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-8">
            <span>© {new Date().getFullYear()} {c.name}</span>
            <a className="hover:text-foreground" href="#top">Back to top ↑</a>
          </div>
        </footer>
      </main>

      {editing && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="text-sm text-muted-foreground">
              Editing mode{dirty ? " · unsaved changes" : ""}
              {notice && <span className="ml-2 text-primary">{notice}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={save}
                disabled={!dirty}
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setDraft(saved)}
                disabled={!dirty}
                className="rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
              >
                Discard
              </button>
              <button type="button" onClick={reset} className="rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent">
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!dirty || window.confirm("Log out and discard unsaved changes?")) logout();
                }}
                className="rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={() => {
          setAdminSession(true);
          setLoginOpen(false);
          setDraft(saved);
          setEditing(true);
        }}
      />
    </div>
  );
}
