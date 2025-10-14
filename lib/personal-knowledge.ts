// You can expand this later or replace with vector DB.

export type Doc = { id: string; title: string; text: string; url?: string }

export const knowledge: Doc[] = [
  {
    id: "resume",
    title: "Summary",
    text: "Full‑Stack AI Developer with React, TypeScript, Node, Express, MongoDB, and PostgreSQL. Experience with AWS and Cloudflare Workers AI. Two international hackathon wins. Focus: AI agents, RAG systems, and Web3 solutions.",
  },
  {
    id: "work-parul",
    title: "Parul University — Software Engineer Intern (2025–Present)",
    text: "Built AI-driven support ticketing for 100k+ users. Java Spring Boot + PostgreSQL + GitHub Actions. SvelteKit UI improved mobile resolver dashboard. Integrated GPT-style LLMs with Qdrant for auto-classification and priority tagging; automated ~70% triage.",
  },
  {
    id: "project-cartify",
    title: "Cartify — AI Shopping Agent",
    text: "React, TypeScript, Groq (Llama 3.1), Supabase. Voice-based search on 50k+ Walmart items. Increased engagement and search efficiency; won Groq track at Raise Your Hack 2025.",
    url: "https://github.com/teja-pola/Cartify",
  },
  {
    id: "project-zesty",
    title: "Zesty — Unrecommendation Engine",
    text: "Integrated Qloo API + Groq LLM to suggest contrasting content. React + Tailwind + TypeScript. Honorable Mention at Qloo LLM Hackathon 2025.",
    url: "https://github.com/teja-pola/Zesty",
  },
  {
    id: "project-zeo",
    title: "Zeo — AI Mental Health Companion",
    text: "Real-time empathetic interactions (WebRTC), privacy-first, no auth. Supabase for encrypted sessions. 3rd Prize at NovaSpark 2025.",
    url: "https://github.com/teja-pola/Zeo",
  },
  {
    id: "skills",
    title: "Skills",
    text: "Frontend: React, TypeScript, Tailwind CSS, Shadcn UI. Backend: Node, Express, Hono, Flask. Databases: MongoDB, PostgreSQL. Cloud: AWS, Cloudflare. DevOps: CI/CD, GitHub. Languages: Java, Python.",
  },
  {
    id: "links",
    title: "Links",
    text: "LinkedIn: https://www.linkedin.com/in/dharmatejapola — GitHub: https://github.com/teja-pola — X: https://x.com/tejapola — Instagram: https://www.instagram.com/teja.techh/ — Telegram: @tejapola — Email: dharmatejapola@gmail.com",
  },
]

export const sources = Object.fromEntries(knowledge.map((d) => [d.id, d.url || null]))
