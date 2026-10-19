export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Content {
  name: string;
  badge: string;
  tagline: string;
  about: string;
  stats: { value: string; label: string }[];
  experience: Experience[];
  skills: SkillGroup[];
  education: { school: string; detail: string };
  email: string;
  location: string;
}

export const defaultContent: Content = {
  name: "Raja Balaji",
  badge: "Open to SWE Internships Summer 27",
  tagline: "Computer Science Major | Junior Software Engineer @Pragmatrix | Full-Stack Developer (React, TypeScript, AWS)",
  about:
    "I\u2019m a Computer Science student at the University of Illinois and Junior Software Engineer at Pragmatrix Technology, specializing in full-stack development and cloud infrastructure. Proficient in TypeScript, Python, Java, React, and Node.js, I build responsive interfaces, design CI/CD pipelines, and manage AWS deployments.\n\nThrough founding ventures like TheTKDevOrg and ZR Studios, I take full ownership of the product lifecycle\u2014from system architecture to API integrations. Passionate about connected vehicles and transportation tech, I am seeking software engineering internships to solve high-impact challenges.",
  stats: [
    { value: "4+", label: "Years of experience" },
    { value: "5", label: "Roles & ventures" },
  ],
  experience: [
    {
      company: "TheTKDevOrg",
      role: "Founder & Web Dev",
      period: "May 2026 – Present",
      location: "Greater Chicago Area",
      points: [
        "Architect and deploy high-performance, responsive web applications and custom client portals using React, TypeScript, Tailwind CSS, and modern backend integrations.",
        "Partner directly with small businesses and independent clients to translate operational workflows into scalable digital tools, custom internal dashboards, and optimized web storefronts.",
        "Direct end-to-end project lifecycles from initial UI/UX wireframing and database modeling to cloud deployment, performance optimization, and SEO readiness.",
      ],
    },
    {
      company: "Pragmatrix Technology",
      role: "Junior Software Engineer",
      period: "January 2026 – Present",
      location: "Greater Chicago Area",
      points: [
        "Streamlined web application deployment to AWS (EC2, S3, Amplify), reducing manual configuration errors and ensuring consistent release cycles.",
        "Managed and monitored cloud infrastructure via AWS Console and CLI to ensure high availability for internal and client-facing apps.",
        "Assisted in building CI/CD pipelines to automate build and test phases, improving code quality and delivery speed.",
      ],
    },
    {
      company: "Pragmatrix Technology",
      role: "Software Engineer Intern",
      period: "September 2024 – December 2025",
      location: "Greater Chicago Area",
      points: [
        "Developed React applications using TypeScript and JavaScript, performing rigorous testing to ensure application quality.",
        "Translated complex client requirements into wireframes to align development with client vision.",
        "Collaborated with senior developers to implement front-end best practices and improve team efficiency.",
      ],
    },
    {
      company: "Freelance",
      role: "Freelance Web Developer",
      period: "January 2022 – Present",
      location: "Naperville, IL",
      points: [
        "Design and deploy high-performance, responsive websites for local businesses using modern frameworks and SEO best practices.",
        "Partner with stakeholders to translate business goals into functional digital products, managing projects from discovery to hosting.",
        "Integrate third-party APIs, including payment gateways and CRM tools, to automate workflows and enhance engagement.",
      ],
    },
    {
      company: "ZR Studios",
      role: "Co-Founder & Director of Photography",
      period: "February 2022 – February 2025",
      location: "Naperville, IL",
      points: [
        "Founded and scaled a party services company, demonstrating strong operational and entrepreneurial leadership.",
        "Utilized expertise in audio engineering and video production to deliver high-quality multimedia services.",
      ],
    },
  ],
  skills: [
    { group: "Languages", items: ["Java", "Python", "C", "TypeScript", "JavaScript", "SQL", "HTML", "CSS"] },
    { group: "Frameworks & Libraries", items: ["React", "Node.js"] },
    { group: "Databases & Cloud", items: ["MongoDB", "AWS (EC2, S3, Amplify)", "AWS Console", "AWS CLI"] },
    { group: "Tools & Methods", items: ["CI/CD Pipelines", "Git", "Wireframing"] },
  ],
  education: {
    school: "University of Illinois",
    detail: "Bachelor of Science in Computer Science · Expected May 2028",
  },
  email: "Raja6Balaji@Gmail.Com",
  location: "Naperville, Illinois",
};

const KEY = "portfolio-content-v1";

export function loadContent(): Content {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultContent, ...JSON.parse(raw) };
  } catch {
    // storage unavailable or corrupt: fall back to defaults
  }
  return defaultContent;
}

export function saveContent(content: Content) {
  localStorage.setItem(KEY, JSON.stringify(content));
}

export function clearContent() {
  localStorage.removeItem(KEY);
}
