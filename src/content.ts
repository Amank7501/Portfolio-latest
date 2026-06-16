// content.ts
// Single source of truth for portfolio content.
// Title set to "Research Associate" per current role (resume shows "Software Developer").

export const profile = {
  name: "Aman Kumar",
  role: "Research Associate · Full-Stack & AI Systems",
  tagline:
    "I build low-code platforms, AI codegen pipelines, and collaboration systems with offline-first sync.",
  summary:
    "Full-stack engineer with 2+ years building scalable low-code platform, end-to-end AI code-generation pipelines, and multi-user collaboration systems with offline-first sync. At CTRI-DG / IIIT Bangalore I own the full frontend generation module of RASP — drag-and-drop builder, live preview engine, AI codegen workflows, and the distributed collaboration layer. Shipped production apps like nodues.iiitb.net end-to-end in 2 days, serving 300+ students. Strong foundation in distributed architecture with a track record of leading teams and delivering high-impact platform capabilities at research-grade scale.",
  location: "Bengaluru, India",
  links: {
    email: "kaman7501@gmail.com",
    phone: "+91-7681824426",
    github: "https://github.com/Amank7501",
    linkedin: "https://www.linkedin.com/in/aman-kumar-818412172",
    resume: "/AmanKumar_Resume.pdf",
  },
} as const;

export const experience = [
  {
    title: "Research Associate", // full-time
    org: "CTRI–Digital Governance, IIIT Bangalore",
    period: "July 2024 – Present",
    summary:
      "Own the end-to-end platform frontend generation module of RASP — code generation, live preview, distributed multi-user collaboration, and AI codegen integration.",
    highlights: [
      "Engineered the frontend generation module from scratch, converting abstract UI models into production-ready React apps with complex component hierarchies, dynamic state, and automatic routing.",
      "Designed a full code-generation pipeline (dynamic component composition, style integration, API bindings) letting non-technical users generate full-stack apps with zero code.",
      "Built a distributed multi-user collaboration system with offline-first sync, unit-level versioning, and hash-based conflict detection — supporting 10+ concurrent users.",
      "Integrated AI codegen for automated Spring Boot backend generation via workflow orchestration and resumable multi-step flows — cutting backend scaffolding time by 70%.",
      "Designed a typed multi-stage code-generation pipeline that transforms a structured backend definition into validated frontend specifications — data models, store, DTOs, adapters, view-models, and a design-token/theme layer — under an MVVM + Zustand architecture, driving automated React generation with consistent styling.",
      "Delivered the production No-Dues app for IIIT Bangalore (nodues.iiitb.net) end-to-end in 2 days using RASP — serving 300+ students.",
      "Deployed and managed 3+ production services via Docker; mentored 20+ interns and junior engineers.",
    ],
  },
  {
    title: "Research Associate", // intern
    org: "CTRI–Digital Governance, IIIT Bangalore",
    period: "Jan 2024 – June 2024",
    summary:
      "Built the foundational frontend generation module and component pipeline for a model-driven low-code platform.",
    highlights: [
      "Built the core frontend generation engine (React, TypeScript, Node.js), translating metadata-driven UI configs into production React components.",
      "Established Node.js APIs converting abstract UI models into downloadable React apps across 5+ component types with dynamic prop binding and style injection.",
      "Co-architected the component generation pipeline, defining extensible patterns later adopted platform-wide.",
    ],
  },
] as const;

export const projects = [
  {
    name: "DevPulse",
    blurb:
      "Full-stack GitHub activity analytics dashboard with real-time sync and contribution insights.",
    description:
      "Signs users in with GitHub OAuth (AES-encrypted token storage), then a BullMQ worker syncs all accessible repos every 5 minutes using ETags to skip unchanged repos. Sync progress streams live to the client over WebSockets via Redis pub/sub, and the dashboard renders a 365-day contribution heatmap, streaks, peak-hour analysis, and a repo leaderboard.",
    highlights: [
      "GitHub OAuth 2.0 with CSRF state validation + AES-encrypted tokens",
      "Real-time sync progress over WebSockets + Redis pub/sub",
      "Per-repo ETag caching and Redis-based rate-limit guarding with backoff",
      "Fully containerized: multi-stage Docker builds + nginx reverse proxy",
    ],
    stack: [
      "React", "TypeScript", "Vite", "TanStack Query", "Recharts",
      "Node.js", "Express", "PostgreSQL", "Knex", "Redis", "BullMQ",
      "WebSockets", "Docker", "nginx",
    ],
    repo: "https://github.com/Amank7501/devpulse",
    featured: true,
  },
  {
    name: "Small Content Creator",
    blurb:
      "AI video editing SaaS that turns long-form video into ready-to-publish shorts.",
    description:
      "Uploads are transcribed, then Gemini/OpenAI generates a JSON Edit Decision List (cuts, tone, highlights). A BullMQ worker applies the plan with FFmpeg — trimming, burning stylized captions, and overlaying music — before the user previews in a React editor and one-click uploads to YouTube via Google OAuth. Files are stored in MinIO (S3-compatible).",
    highlights: [
      "AI-generated Edit Decision Lists from video transcripts",
      "FFmpeg rendering pipeline orchestrated through BullMQ background jobs",
      "MinIO (S3-compatible) local-first storage proxy",
      "Direct YouTube publishing via Google OAuth 2.0; RBAC (Admin / Creator)",
    ],
    stack: [
      "React 19", "Vite", "Tailwind CSS", "Node.js", "Express", "Prisma",
      "PostgreSQL", "Redis", "BullMQ", "FFmpeg", "MinIO",
      "Google Gemini", "OpenAI", "Google OAuth", "JWT",
    ],
    repo: "https://github.com/Amank7501/Content-Creator",
    featured: true,
  },
  {
    name: "Clinic-OS",
    blurb:
      "Multi-tenant clinic operating system — a NestJS + Turborepo monorepo for end-to-end clinic operations.",
    description:
      "A production-grade, multi-tenant SaaS platform covering the full clinic lifecycle: appointments, patient records, consultations, billing, and queue management. The NestJS API enforces tenancy with clinic-context guards, role-based access, and subscription guards, with an audit interceptor logging actions across the system. A dedicated BullMQ worker handles background jobs (notifications, recovery), and prescription documents are stored in MinIO.",
    highlights: [
      "Multi-tenant architecture with clinic-context, role, and subscription guards",
      "Domain modules: appointments, consultations, billing, patients, queue, notifications",
      "System-wide audit logging via NestJS interceptors and decorators",
      "Dedicated BullMQ worker for background jobs; MinIO for document storage",
    ],
    stack: [
      "TypeScript", "NestJS", "React", "Zustand", "TanStack Query", "Tailwind CSS", "Prisma", "PostgreSQL", "Redis", "BullMQ", "MinIO", "JWT"
    ],
    repo: "https://github.com/Amank7501/Clinic-OS",
    featured: false,
  },
  {
    name: "CrowdContract",
    blurb:
      "Web3 crowdfunding dApp built on smart contracts with a React frontend.",
    description:
      "A decentralized crowdfunding platform where campaigns and contributions are handled on-chain via Solidity smart contracts, with the React/Vite client connecting through thirdweb and ethers.js. Includes a backend service and Ansible-based deployment playbooks for infrastructure provisioning.",
    highlights: [
      "On-chain campaign + contribution logic via Solidity contracts",
      "Wallet/contract integration through thirdweb SDK + ethers.js",
      "React + Vite + Tailwind client",
      "Ansible playbooks for repeatable deployment",
    ],
    stack: [
      "Solidity", "thirdweb", "ethers.js", "React", "Vite", "Tailwind CSS",
      "Node.js", "Docker", "Ansible",
    ],
    repo: "https://github.com/Amank7501/CrowdContract",
    featured: false,
  },
] as const;

export const skills = {
  "Languages & Core": ["JavaScript/TypeScript", "Java", "C/C++", "SQL"],
  Frontend: ["React", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  "State & UI Systems": ["Zustand", "React Flow", "React DnD", "AG Grid", "TanStack Query"],
  "Backend & Real-time": ["Node.js", "Express.js", "REST APIs", "WebSockets", "Socket.IO", "JWT"],
  Architecture: [
    "Distributed systems","Multi-user collaboration systems with offline-first sync", "Conflict detection & resolution",
    "Low-code Code Generation", "Workflow orchestration",
    "Live preview", "Version control",
  ],
  "Data & DevOps": [
    "MongoDB", "MySQL", "PostgreSQL", "Prisma","Docker", "GitHub Actions", "CI/CD"
  ],
} as const;

export const education = [
  {
    degree: "M.Tech, Computer Science & Engineering",
    specialization: "Artificial Intelligence & Machine Learning",
    institution: "International Institute of Information Technology, Bangalore",
    period: "2022 – 2024",
  },
  {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "Gandhi Institute for Technological Advancement, Bhubaneswar",
    period: "2017 – 2021",
  },
] as const;

export const achievements = [
  {
    title: "Exhibitor — Bangalore International Tech Summit 2025",
    detail:
      "Represented CTRI-DG @ IIIT Bangalore; ran live demos of RASP (drag-and-drop builder, workflow engine, full-stack generation) for industry leaders, government officials, and international delegates.",
  },
  {
    title: "GATE 2022 — 97.96 percentile",
    detail: "Computer Science & Engineering.",
  },
  {
    title: "300+ DSA Coding Questions Solved",
    detail:
      "Active problem solver on platforms like LeetCode, focusing on data structures, algorithms, and programmatic efficiency.",
  },
] as const;
