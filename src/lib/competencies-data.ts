export interface ProjectEvidenceLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface ProjectEvidenceItem {
  name: string;
  description: string;
  links?: ProjectEvidenceLink[];
}

export interface CompetencySkill {
  id: string;
  name: string;
  classification: string;
  shortUsage: string;
  appliedIn: string;
  practicalUsage: string;
  relatedTechnologies: string[];
  areasOfImplementation: string[];
  projectEvidence?: ProjectEvidenceItem[];
  directLinks?: ProjectEvidenceLink[];
}

export interface CompetencyCategory {
  id: string;
  number: string;
  name: string;
  label: string;
  tagline: string;
  skills: CompetencySkill[];
}

export const COMPETENCY_CATEGORIES: CompetencyCategory[] = [
  {
    id: "programming-languages",
    number: "01",
    name: "Programming Languages",
    label: "01 — Programming Languages",
    tagline: "Core syntax, algorithmic logic, procedural foundations, and object-oriented architecture.",
    skills: [
      {
        id: "lang-c",
        name: "C",
        classification: "Procedural & Systems Programming",
        shortUsage: "Foundational programming language used for structured problem solving, memory understanding, and core algorithms.",
        appliedIn: "Academic computer science curriculum at Narasaraopeta Engineering College.",
        practicalUsage: "Studying pointers, memory allocation, structured programming, control flow, and computational problem solving.",
        relatedTechnologies: ["Data Structures", "Algorithms", "Procedural Logic"],
        areasOfImplementation: [
          "Procedural Programming",
          "Algorithmic Problem Solving",
          "Data Structure Implementation"
        ]
      },
      {
        id: "lang-java",
        name: "Java",
        classification: "Object-Oriented Programming",
        shortUsage: "Strong object-oriented programming foundation emphasizing encapsulation, modular design, and typed problem solving.",
        appliedIn: "Academic software engineering coursework and modular problem solving.",
        practicalUsage: "Developing OOP concepts, classes, inheritance, polymorphism, and modular solution architectures.",
        relatedTechnologies: ["Object-Oriented Design", "Standard Libraries", "Modular Systems"],
        areasOfImplementation: [
          "Object-Oriented Design",
          "Modular Programming",
          "Algorithms & Logic"
        ]
      },
      {
        id: "lang-python",
        name: "Python",
        classification: "Scripting & Backend Development",
        shortUsage: "Core language for backend microservices, data structures, AI/LLM integration, and fast iterative development.",
        appliedIn: "Aakash AI agricultural platform and LearnGraph AI study agent.",
        practicalUsage: "Writing backend logic with FastAPI, data processing, calling LLM endpoints, and rapid application prototyping.",
        relatedTechnologies: ["FastAPI", "REST APIs", "AI / LLM APIs", "Data Processing"],
        areasOfImplementation: [
          "Backend Development",
          "AI Application Logic",
          "Data Integration"
        ],
        projectEvidence: [
          {
            name: "Aakash AI",
            description: "Backend architecture and AI-assisted agricultural advisory queries.",
            links: [{ label: "Case Study", url: "/projects/aakash-ai" }]
          },
          {
            name: "LearnGraph AI",
            description: "AI-powered adaptive study agent logic.",
            links: [{ label: "Case Study", url: "/projects/learngraph-ai" }]
          }
        ]
      }
    ]
  },
  {
    id: "web-development",
    number: "02",
    name: "Web Development",
    label: "02 — Web Development",
    tagline: "Semantic markup, client-side scripting, responsive interfaces, and DOM manipulation.",
    skills: [
      {
        id: "web-html",
        name: "HTML",
        classification: "Semantic Markup & Interface Structure",
        shortUsage: "Creating accessible, semantic structural foundations for responsive web applications.",
        appliedIn: "Aakash AI and Nexora – Lost & Found AI user interfaces.",
        practicalUsage: "Structuring responsive application layouts, forms, media containers, and interactive web elements.",
        relatedTechnologies: ["DOM Structure", "Web Standards", "Responsive Design"],
        areasOfImplementation: [
          "Semantic Web Layouts",
          "Accessible Form Architecture",
          "Interface Scaffolding"
        ],
        projectEvidence: [
          {
            name: "Nexora – Lost & Found AI",
            description: "Interactive reporting and upload interface.",
            links: [{ label: "Case Study", url: "/projects/nexora-lost-found-ai" }]
          }
        ]
      },
      {
        id: "web-javascript",
        name: "JavaScript",
        classification: "Client-Side Scripting & Interactivity",
        shortUsage: "Dynamic UI event handling, async data fetching, image upload workflows, and client state.",
        appliedIn: "Nexora – Lost & Found AI web application.",
        practicalUsage: "Handling file uploads, calling Supabase APIs, dynamic DOM updates, and interactive user feedback.",
        relatedTechnologies: ["Async / Await", "Fetch API", "Event-Driven Programming"],
        areasOfImplementation: [
          "Client-Side Logic",
          "API Integration",
          "Dynamic User Interfaces"
        ],
        projectEvidence: [
          {
            name: "Nexora – Lost & Found AI",
            description: "Client-side image handling and Supabase communication.",
            links: [{ label: "Case Study", url: "/projects/nexora-lost-found-ai" }]
          }
        ]
      }
    ]
  },
  {
    id: "backend-apis-database",
    number: "03",
    name: "Backend, APIs & Database",
    label: "03 — Backend & Database",
    tagline: "High-performance Python APIs, RESTful service architecture, and modern cloud databases.",
    skills: [
      {
        id: "back-fastapi",
        name: "FastAPI",
        classification: "Modern High-Performance Python Web Framework",
        shortUsage: "Building fast, asynchronous REST APIs with type-validated request/response schemas.",
        appliedIn: "Aakash AI hyper-local weather advisory backend.",
        practicalUsage: "Developing endpoints for Panchayat weather data queries, advisory responses, and database communication.",
        relatedTechnologies: ["Python", "REST APIs", "Pydantic", "Async IO"],
        areasOfImplementation: [
          "RESTful Service Architecture",
          "API Schema Validation",
          "Microservice Development"
        ],
        projectEvidence: [
          {
            name: "Aakash AI",
            description: "Panchayat advisory API and data pipelines.",
            links: [{ label: "Case Study", url: "/projects/aakash-ai" }]
          }
        ]
      },
      {
        id: "back-rest",
        name: "REST APIs",
        classification: "HTTP Architectural Style",
        shortUsage: "Designing standard HTTP interfaces, clean request routing, JSON payloads, and status codes.",
        appliedIn: "Aakash AI and cross-application client-server integration.",
        practicalUsage: "Consuming and serving structured JSON data between frontend interfaces and backend logic.",
        relatedTechnologies: ["HTTP / JSON", "Client-Server Architecture", "Status Codes"],
        areasOfImplementation: [
          "API Design",
          "Data Serialization",
          "Service Integration"
        ]
      },
      {
        id: "back-supabase",
        name: "Supabase",
        classification: "Backend-as-a-Service & PostgreSQL Platform",
        shortUsage: "Managing relational database storage, media asset buckets, and automated REST query interfaces.",
        appliedIn: "Aakash AI (Panchayat data) and Nexora (item reports & image storage).",
        practicalUsage: "Designing tables, storing geographical and item records, handling file buckets, and executing queries.",
        relatedTechnologies: ["PostgreSQL", "Cloud Storage", "Relational Modeling"],
        areasOfImplementation: [
          "Relational Database Design",
          "Media Asset Storage",
          "Database Querying"
        ],
        projectEvidence: [
          {
            name: "Nexora – Lost & Found AI",
            description: "Relational item tracking and image asset storage.",
            links: [{ label: "Case Study", url: "/projects/nexora-lost-found-ai" }]
          }
        ]
      }
    ]
  },
  {
    id: "ai-generative-ai",
    number: "04",
    name: "Artificial Intelligence & LLMs",
    label: "04 — AI & Generative AI",
    tagline: "LLM integration, prompt engineering, local model inference, and practical AI applications.",
    skills: [
      {
        id: "ai-core",
        name: "Artificial Intelligence",
        classification: "Applied Machine Intelligence",
        shortUsage: "Leveraging modern AI concepts, image matching models, and intelligent assistance logic.",
        appliedIn: "Nexora – Lost & Found AI, Aakash AI, and LearnGraph AI.",
        practicalUsage: "Incorporating AI-assisted recommendations, image comparison workflows, and adaptive learning agents.",
        relatedTechnologies: ["Image Matching", "Adaptive Agents", "Intelligent Systems"],
        areasOfImplementation: [
          "Visual Feature Comparison",
          "Automated Advisory",
          "Adaptive Learning"
        ]
      },
      {
        id: "ai-llms",
        name: "Large Language Models & GenAI",
        classification: "Generative AI Systems",
        shortUsage: "Connecting multi-provider LLMs, structuring prompts, and generating contextual educational/advisory responses.",
        appliedIn: "LearnGraph AI adaptive study agent and Aakash AI farmer advisory.",
        practicalUsage: "Prompt design, temperature tuning, concept explanation generation, and interactive quiz synthesis.",
        relatedTechnologies: ["Prompt Engineering", "Multi-Provider LLMs", "Ollama / Local LLMs"],
        areasOfImplementation: [
          "Prompt Engineering",
          "Context Augmentation",
          "Autonomous Study Agents"
        ],
        projectEvidence: [
          {
            name: "LearnGraph AI",
            description: "Autonomous study agent with adaptive knowledge graphs.",
            links: [{ label: "Case Study", url: "/projects/learngraph-ai" }]
          }
        ]
      }
    ]
  },
  {
    id: "developer-tools-deployment",
    number: "05",
    name: "Developer Tools & Deployment",
    label: "05 — Tools & Deployment",
    tagline: "Version control collaboration, local workflow efficiency, and production web deployment.",
    skills: [
      {
        id: "tool-git",
        name: "Git & GitHub",
        classification: "Version Control & Collaboration",
        shortUsage: "Managing project source code, branching workflows, team repository commits, and open-source releases.",
        appliedIn: "All project development workflows, team repositories, and GitHub Pages deployments.",
        practicalUsage: "Tracking changes, collaborating in team hackathon sprints, managing branches, and pushing production code.",
        relatedTechnologies: ["Version Control", "Branching", "Code Collaboration"],
        areasOfImplementation: [
          "Team Sprint Collaboration",
          "Repository Governance",
          "Code Maintenance"
        ]
      },
      {
        id: "tool-deploy",
        name: "Vercel & GitHub Pages",
        classification: "Web Hosting & Deployment Platforms",
        shortUsage: "Deploying production web applications, configuring preview environments, and managing live URLs.",
        appliedIn: "Nexora – Lost & Found AI (Vercel) and Aakash AI (GitHub Pages).",
        practicalUsage: "Continuous deployment from Git branches, DNS configuration, and live production application management.",
        relatedTechnologies: ["Cloud Deployment", "Preview Deployments", "Static & Dynamic Hosting"],
        areasOfImplementation: [
          "Production Web Deployment",
          "Environment Configuration",
          "Live Host Management"
        ]
      }
    ]
  }
];
