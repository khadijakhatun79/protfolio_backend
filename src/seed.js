/**
 * Seed + Route-Test Script – Portfolio Backend
 * ─────────────────────────────────────────────
 * Uses the LIVE dev server (http://localhost:4000) via fetch so that:
 *   1. We bypass direct DB auth (the server handles the connection).
 *   2. Every route is exercised and the response is validated.
 *
 * Run:  node src/seed.js
 * Requires Node >= 18 (global fetch) or install node-fetch.
 */

const BASE = "http://localhost:4000/api";

// ─── Colour helpers ───────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red:   "\x1b[31m",
  cyan:  "\x1b[36m",
  yellow:"\x1b[33m",
  bold:  "\x1b[1m",
  dim:   "\x1b[2m",
};
const ok  = (msg) => console.log(`${c.green}  ✔ ${c.reset}${msg}`);
const fail= (msg) => console.log(`${c.red}  ✘ ${c.reset}${msg}`);
const info= (msg) => console.log(`${c.cyan}${msg}${c.reset}`);
const sep = ()    => console.log(`${c.dim}${"─".repeat(60)}${c.reset}`);

// ─── Generic request helper ───────────────────────────────────────────────────
async function req(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  let json;
  try { json = await res.json(); } catch { json = {}; }
  return { status: res.status, json };
}

// ─── Assertion helper ─────────────────────────────────────────────────────────
let passed = 0, failed = 0;
function assert(label, condition, detail = "") {
  if (condition) {
    ok(label);
    passed++;
  } else {
    fail(`${label}${detail ? " — " + detail : ""}`);
    failed++;
  }
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications with React, Next.js, Node.js, and MongoDB — from design through deployment.",
    icon: "💻",
  },
  {
    title: "REST API Design & Development",
    description:
      "Scalable, secure REST APIs built with Express.js and Mongoose — authentication, rate-limiting, and error handling included.",
    icon: "🔌",
  },
  {
    title: "Database Architecture",
    description:
      "Schema design and optimisation for MongoDB and PostgreSQL — indexing, aggregation pipelines, and data modelling.",
    icon: "🗄️",
  },
  {
    title: "UI / UX Design",
    description:
      "Pixel-perfect, accessible UIs with a focus on performance, responsiveness, and delightful micro-interactions.",
    icon: "🎨",
  },
  {
    title: "Cloud Deployment & DevOps",
    description:
      "Deployment on AWS, Vercel, and Railway. CI/CD pipelines, Docker containerisation, and environment management.",
    icon: "☁️",
  },
];

const PROJECTS = [
  {
    title: "Portfolio Backend API",
    description:
      "A production-ready Express.js REST API powering a developer portfolio site. Features include contact-form handling, dynamic services/projects CRUD, MongoDB Atlas integration, and security middleware.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    link: "https://github.com/mohon45/protfolio_backend",
    technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST API"],
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-featured online shopping platform with product listings, cart management, Stripe payment integration, order tracking, and an admin dashboard.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
    link: "https://github.com/mohon45/ecommerce-platform",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS"],
  },
  {
    title: "Real-Time Chat Application",
    description:
      "Scalable real-time chat with private/group messaging, presence indicators, read receipts, and file sharing powered by Socket.io.",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800",
    link: "https://github.com/mohon45/realtime-chat",
    technologies: ["React", "Socket.io", "Node.js", "Redis", "PostgreSQL"],
  },
  {
    title: "Task Management Dashboard",
    description:
      "Kanban-style project management tool with drag-and-drop boards, team collaboration, deadline tracking, and analytics.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
    link: "https://github.com/mohon45/task-manager",
    technologies: ["React", "Firebase", "Material UI", "Chart.js"],
  },
];

const PORTFOLIO_SUBMISSIONS = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    subject: "Project Inquiry – E-Commerce Site",
    message:
      "Hi! I saw your portfolio and I am very impressed. I am looking for a developer to build an e-commerce site for my clothing brand. Would love to discuss scope and pricing.",
  },
  {
    name: "Bob Martinez",
    email: "bob.martinez@example.com",
    subject: "Freelance Opportunity – API Development",
    message:
      "Hello, we are a startup building a SaaS product and need an experienced backend developer to design our REST API. Your portfolio looks great – can we schedule a call?",
  },
  {
    name: "Carol Williams",
    email: "carol.williams@example.com",
    subject: "Collaboration on Open-Source Project",
    message:
      "Hey! I am working on an open-source developer tooling project and would love to collaborate. Your Node.js & MongoDB skills are exactly what we need!",
  },
];

// ─── Test runner ──────────────────────────────────────────────────────────────

async function testServices() {
  info("\n📦  SERVICES");
  sep();

  const createdIds = [];

  // CREATE
  for (const svc of SERVICES) {
    const { status, json } = await req("POST", "/services", svc);
    const id = json?.data?._id;
    assert(
      `POST /services "${svc.title}"`,
      status === 201 && id,
      `status=${status}`
    );
    if (id) createdIds.push(id);
  }

  // GET ALL
  {
    const { status, json } = await req("GET", "/services");
    assert(
      "GET /services (list all)",
      status === 200 && Array.isArray(json?.data),
      `status=${status} count=${json?.data?.length}`
    );
  }

  // GET ONE
  if (createdIds[0]) {
    const { status, json } = await req("GET", `/services/${createdIds[0]}`);
    assert(
      "GET /services/:id",
      status === 200 && json?.data?._id === createdIds[0],
      `status=${status}`
    );
  }

  // UPDATE
  if (createdIds[0]) {
    const { status, json } = await req("PATCH", `/services/${createdIds[0]}`, {
      description: "Updated description for testing purposes.",
    });
    assert(
      "PATCH /services/:id",
      status === 200,
      `status=${status}`
    );
  }

  // DELETE one (last created)
  const toDelete = createdIds.pop();
  if (toDelete) {
    const { status } = await req("DELETE", `/services/${toDelete}`);
    assert("DELETE /services/:id", status === 200, `status=${status}`);
  }

  return createdIds;
}

async function testProjects() {
  info("\n🚀  PROJECTS");
  sep();

  const createdIds = [];

  // CREATE
  for (const proj of PROJECTS) {
    const { status, json } = await req("POST", "/projects", proj);
    const id = json?.data?._id;
    assert(
      `POST /projects "${proj.title}"`,
      status === 201 && id,
      `status=${status}`
    );
    if (id) createdIds.push(id);
  }

  // GET ALL
  {
    const { status, json } = await req("GET", "/projects");
    assert(
      "GET /projects (list all)",
      status === 200 && Array.isArray(json?.data),
      `status=${status} count=${json?.data?.length}`
    );
  }

  // GET ONE
  if (createdIds[0]) {
    const { status, json } = await req("GET", `/projects/${createdIds[0]}`);
    assert(
      "GET /projects/:id",
      status === 200 && json?.data?._id === createdIds[0],
      `status=${status}`
    );
  }

  // UPDATE
  if (createdIds[0]) {
    const { status } = await req("PATCH", `/projects/${createdIds[0]}`, {
      description: "Updated project description for testing.",
    });
    assert("PATCH /projects/:id", status === 200, `status=${status}`);
  }

  // DELETE last
  const toDelete = createdIds.pop();
  if (toDelete) {
    const { status } = await req("DELETE", `/projects/${toDelete}`);
    assert("DELETE /projects/:id", status === 200, `status=${status}`);
  }

  return createdIds;
}

async function testPortfolio() {
  info("\n📬  PORTFOLIO (Contact Form Submissions)");
  sep();

  const createdIds = [];

  // SUBMIT FORM
  for (const sub of PORTFOLIO_SUBMISSIONS) {
    const { status, json } = await req("POST", "/portfolio", sub);
    const id = json?.data?._id;
    assert(
      `POST /portfolio "${sub.name}"`,
      status === 201 && id,
      `status=${status}`
    );
    if (id) createdIds.push(id);
  }

  // GET ALL SUBMISSIONS
  {
    const { status, json } = await req("GET", "/portfolio");
    assert(
      "GET /portfolio (list all)",
      status === 200 && Array.isArray(json?.data),
      `status=${status} count=${json?.data?.length}`
    );
  }

  // GET ONE SUBMISSION
  if (createdIds[0]) {
    const { status, json } = await req("GET", `/portfolio/${createdIds[0]}`);
    assert(
      "GET /portfolio/:id",
      status === 200 && json?.data?._id === createdIds[0],
      `status=${status}`
    );
  }

  // DELETE one submission
  const toDelete = createdIds.pop();
  if (toDelete) {
    const { status } = await req("DELETE", `/portfolio/${toDelete}`);
    assert("DELETE /portfolio/:id", status === 200, `status=${status}`);
  }

  return createdIds;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n${c.bold}${c.cyan}🌱  Portfolio Backend — Seed + Route Test${c.reset}`);
  console.log(`${c.dim}   Target: ${BASE}${c.reset}\n`);

  try {
    await testServices();
    await testProjects();
    await testPortfolio();
  } catch (err) {
    console.error(`\n${c.red}💥  Unexpected error: ${err.message}${c.reset}`);
    console.error(`${c.dim}   Is the dev server running on port 4000?${c.reset}\n`);
    process.exit(1);
  }

  sep();
  const total = passed + failed;
  const colour = failed === 0 ? c.green : c.red;
  console.log(
    `\n${colour}${c.bold}  Results: ${passed}/${total} tests passed${c.reset}` +
    (failed > 0 ? `  ${c.red}(${failed} failed)${c.reset}` : "  🎉") +
    "\n"
  );

  if (failed > 0) process.exit(1);
})();
