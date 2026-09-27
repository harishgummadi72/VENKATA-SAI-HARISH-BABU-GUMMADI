import { PortfolioProfile, Project, Skill, Achievement, Credential, Experience, CurrentlyLearningItem } from '@/types/portfolio';

export const INITIAL_PROFILE: PortfolioProfile = {
  name: "VENKATA SAI HARISH BABU GUMMADI",
  preferredName: "Harish Babu",
  location: "Guntur, Andhra Pradesh, India",
  primaryRole: "Software Developer",
  supportingRole: "Full Stack Web Development · AI · Cybersecurity",
  introduction: "Computer Science and Engineering student with hands-on experience developing AI-enabled web applications and participating in competitive internal hackathons. Familiar with C, Java, Python, HTML, JavaScript, FastAPI, REST APIs, Supabase, Git, GitHub, AI/LLM technologies and web deployment. Interested in full-stack development, artificial intelligence, software engineering and cybersecurity.",
  aboutBio: [
    "I am Venkata Sai Harish Babu Gummadi, a Computer Science and Engineering undergraduate at Narasaraopeta Engineering College (JNTUK). My focus centers on software development, full-stack web engineering, artificial intelligence, and cybersecurity.",
    "I build practical applications using C, Java, Python, HTML, JavaScript, FastAPI, and Supabase, integrating AI/LLM technologies, prompt engineering, and local LLMs into functional web solutions.",
    "Passionate about collaborative development, I participate in competitive hackathons and continuously expand my software engineering capabilities through hands-on project implementation."
  ],
  languages: [
    "English",
    "Telugu"
  ],
  focusAreas: [
    "Full Stack Web Development",
    "Software Development",
    "Artificial Intelligence",
    "Generative AI",
    "Cybersecurity"
  ],
  softSkills: [
    "Problem Solving",
    "Teamwork",
    "Communication",
    "Quick Learning",
    "Adaptability",
    "Technical Learning"
  ],
  education: {
    degree: "B.Tech – Computer Science and Engineering",
    field: "Computer Science and Engineering (CSE)",
    institution: "Narasaraopeta Engineering College",
    university: "JNTUK",
    period: "2025–2029",
    cgpa: "8.46",
    disclaimer: "Independent student academic portfolio. College and university names are listed accurately as the student's enrolled institutions, without claiming official institutional endorsement.",
    history: [
      {
        level: "B.Tech",
        institution: "Narasaraopeta Engineering College",
        boardOrUniversity: "JNTUK",
        streamOrBranch: "Computer Science and Engineering (CSE)",
        periodOrYear: "2025–2029",
        score: "CGPA 8.46",
        status: "Ongoing"
      },
      {
        level: "Intermediate",
        institution: "Narayana",
        streamOrBranch: "MPC",
        periodOrYear: "2025",
        score: "91.3%",
        status: "Completed"
      },
      {
        level: "SSC",
        institution: "Kennedy English Medium High School",
        boardOrUniversity: "State Board",
        periodOrYear: "2023",
        score: "87%",
        status: "Completed"
      }
    ]
  },
  contact: {
    email: "gummadivenkatasaiharishbabu@gmail.com",
    phone: "+91 8919580966",
    github: "https://github.com/harishgummadi72",
    linkedin: "https://www.linkedin.com/in/harish-gummadi-18a3153a7/",
    availabilityStatus: "Open for software engineering opportunities, hackathons, and technical collaborations.",
    hasResume: false
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-aakash-ai",
    slug: "aakash-ai",
    title: "Aakash AI",
    tagline: "AI-powered web platform designed to provide Panchayat-level weather information and agricultural advisory services for localized farmer assistance.",
    category: "AI / Full Stack / Agriculture",
    role: "Developer / Team Member",
    contribution: "Worked on the web application, Supabase database, Panchayat/LGD data integration, backend/AI-related functionality and overall project development.",
    featured: true,
    status: "Completed",
    technologies: [
      "Python",
      "FastAPI",
      "Supabase",
      "HTML",
      "AI / LLM Technologies",
      "Git",
      "GitHub"
    ],
    overview: "Aakash AI is an AI-powered agricultural advisory platform designed to provide hyper-local weather information and crop advisory at the Panchayat level, directly assisting rural farmers with actionable data.",
    problem: "Generic weather forecasts lack micro-climate resolution at the local Panchayat level, hindering farmers from optimizing crop schedules, water usage, and preventive treatments.",
    intendedUsers: [
      "Local Farmers & Agricultural Workers",
      "Gram Panchayat Representatives",
      "Regional Agricultural Extension Workers"
    ],
    teamContext: "Collaborative team initiative engineered for agricultural impact.",
    featuresBuilt: [
      "Panchayat-level hyper-local weather information",
      "Location-aware agricultural information",
      "AI-based farmer advisory assistance",
      "AI voice/calling concept for rural accessibility",
      "Panchayat and LGD geographical data integration",
      "Supabase-based structured data management",
      "Web-based responsive user interface"
    ],
    challenges: [
      "Integrating heterogeneous Panchayat and LGD geographical datasets",
      "Structuring responsive querying for low-bandwidth rural connections"
    ],
    lessons: [
      "Designing localized interfaces tailored for real-world impact",
      "Structuring scalable relational models using Supabase"
    ],
    limitations: [
      "Voice/calling capability is structured as an architectural concept"
    ],
    liveUrl: "https://tejakandula20.github.io/Aakash-AI/",
    repoUrl: "https://github.com/TejaKandula20/Aakash-AI",
    published: true,
    order: 1,
    previewType: "authentic"
  },
  {
    id: "proj-nexora-ai",
    slug: "nexora-lost-found-ai",
    title: "Nexora – Lost & Found AI",
    tagline: "AI-assisted Lost & Found web application designed to help users report lost and found items and identify potentially related items through image-based comparison.",
    category: "AI / Web Application",
    role: "Developer / Team Member",
    contribution: "Worked on web application development, Supabase integration, image-upload functionality and AI-assisted matching functionality.",
    featured: true,
    status: "Deployed",
    technologies: [
      "HTML",
      "JavaScript",
      "Supabase",
      "AI / Image Matching",
      "GitHub",
      "Vercel"
    ],
    overview: "Nexora is an intelligent lost-and-found community web platform designed to streamline reporting and recovery using visual image comparison and database matching.",
    problem: "Traditional lost-and-found boards rely solely on text descriptions, leading to high friction, subjective descriptions, and low item recovery rates.",
    intendedUsers: [
      "Campus Students and Faculty",
      "Facility Administrators",
      "Community Members"
    ],
    teamContext: "Collaborative project with repository maintained under Harish's account.",
    featuresBuilt: [
      "Lost and found item reporting system",
      "Multi-image upload workflow",
      "AI-assisted image comparison and feature matching",
      "Potential matching item discovery",
      "Supabase backend data and storage integration",
      "Production deployment on Vercel"
    ],
    challenges: [
      "Client-side image processing and efficient cloud storage uploads",
      "Managing similarity thresholds for visual matching"
    ],
    lessons: [
      "End-to-end web deployment workflows on Vercel",
      "Integrating Supabase storage with relational tables"
    ],
    limitations: [
      "Match accuracy is dependent on clarity and lighting of uploaded photos"
    ],
    liveUrl: "https://nexora-lost-found-ai-gummadivenkatasaiharishbabu-6155.vercel.app/",
    repoUrl: "https://github.com/harishgummadi72/Nexora-Lost-Found-ai",
    published: true,
    order: 2,
    previewType: "authentic"
  },
  {
    id: "proj-learngraph-ai",
    slug: "learngraph-ai",
    title: "LearnGraph AI",
    tagline: "AI-powered adaptive learning platform designed to help students understand concepts through explanations, examples, quizzes, code assistance and knowledge-graph-based learning relationships.",
    category: "AI / Education / Adaptive Learning",
    role: "Hackathon Team Member / Developer",
    contribution: "Participated as a hackathon team member and developer. Specific individual contribution details have not yet been documented.",
    featured: true,
    status: "Hackathon Prototype",
    technologies: [
      "AI / LLMs",
      "Knowledge Graphs",
      "Python / AI Technologies",
      "Multiple LLM Providers",
      "GitHub"
    ],
    overview: "Built during a competitive 24-hour internal hackathon in 2026, LearnGraph AI combines knowledge graph topologies with large language models to construct dynamic, adaptive learning paths for students.",
    problem: "One-size-fits-all linear tutorials often overwhelm students by skipping foundational prerequisite concepts or failing to adapt to their current knowledge level.",
    intendedUsers: [
      "Computer Science Students",
      "Self-paced Technical Learners",
      "Peer Study Groups"
    ],
    teamContext: "Developed in a fast-paced 24-hour competitive internal hackathon (2026).",
    featuresBuilt: [
      "AI-powered concept explanations with tiered depth",
      "Topic and prerequisite concept matching",
      "Knowledge graph prerequisite relationships",
      "Adaptive learning progression tracking",
      "Interactive examples and code assistance",
      "Automated quiz and assessment generation",
      "Multi-provider LLM support for high uptime"
    ],
    challenges: [
      "Synthesizing hierarchical knowledge graph relationships under 24-hour sprint limits",
      "Connecting disparate LLM APIs reliably"
    ],
    lessons: [
      "Collaborative hackathon problem solving and rapid prototyping",
      "Knowledge graph modeling for LLM context augmentation"
    ],
    limitations: [
      "Developed as a 24-hour hackathon prototype; public live demo is currently in progress"
    ],
    liveUrl: "",
    repoUrl: "https://github.com/amukeshreddy465-ship-it/LearnGraph-AI",
    published: true,
    order: 3,
    previewType: "prototype"
  }
];

export const INITIAL_SKILLS: Skill[] = [
  { id: "sk-c", name: "C", category: "Programming Languages", proficiency: "Core", relatedProjectSlugs: [] },
  { id: "sk-java", name: "Java", category: "Programming Languages", proficiency: "Core", relatedProjectSlugs: [] },
  { id: "sk-python", name: "Python", category: "Programming Languages", proficiency: "Core", relatedProjectSlugs: ["aakash-ai", "learngraph-ai"] },
  { id: "sk-html", name: "HTML", category: "Web Development", proficiency: "Core", relatedProjectSlugs: ["aakash-ai", "nexora-lost-found-ai"] },
  { id: "sk-javascript", name: "JavaScript", category: "Web Development", proficiency: "Core", relatedProjectSlugs: ["nexora-lost-found-ai"] },
  { id: "sk-fastapi", name: "FastAPI", category: "Backend & APIs", proficiency: "Core", relatedProjectSlugs: ["aakash-ai"] },
  { id: "sk-rest-apis", name: "REST APIs", category: "Backend & APIs", proficiency: "Core", relatedProjectSlugs: ["aakash-ai"] },
  { id: "sk-supabase", name: "Supabase", category: "Database / Backend Services", proficiency: "Core", relatedProjectSlugs: ["aakash-ai", "nexora-lost-found-ai"] },
  { id: "sk-ai", name: "Artificial Intelligence", category: "AI / Generative AI", proficiency: "Applied", relatedProjectSlugs: ["aakash-ai", "nexora-lost-found-ai", "learngraph-ai"] },
  { id: "sk-genai", name: "Generative AI", category: "AI / Generative AI", proficiency: "Applied", relatedProjectSlugs: ["aakash-ai", "learngraph-ai"] },
  { id: "sk-llms", name: "Large Language Models", category: "AI / Generative AI", proficiency: "Applied", relatedProjectSlugs: ["aakash-ai", "learngraph-ai"] },
  { id: "sk-prompt", name: "Prompt Engineering", category: "AI / Generative AI", proficiency: "Applied", relatedProjectSlugs: ["learngraph-ai"] },
  { id: "sk-ollama", name: "Ollama / Local LLMs", category: "AI / Generative AI", proficiency: "Foundation", relatedProjectSlugs: [] },
  { id: "sk-ai-dev", name: "AI-Assisted Application Development", category: "AI / Generative AI", proficiency: "Applied", relatedProjectSlugs: ["nexora-lost-found-ai", "learngraph-ai"] },
  { id: "sk-git", name: "Git", category: "Developer Tools", proficiency: "Core", relatedProjectSlugs: ["aakash-ai", "nexora-lost-found-ai", "learngraph-ai"] },
  { id: "sk-github", name: "GitHub", category: "Developer Tools", proficiency: "Core", relatedProjectSlugs: ["aakash-ai", "nexora-lost-found-ai", "learngraph-ai"] },
  { id: "sk-vscode", name: "Visual Studio Code", category: "Developer Tools", proficiency: "Core", relatedProjectSlugs: [] },
  { id: "sk-vercel", name: "Vercel", category: "Deployment", proficiency: "Applied", relatedProjectSlugs: ["nexora-lost-found-ai"] },
  { id: "sk-gh-pages", name: "GitHub Pages", category: "Deployment", proficiency: "Applied", relatedProjectSlugs: ["aakash-ai"] }
];

export const INITIAL_EXPERIENCE: Experience[] = [];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "24-Hour Competitive Internal Hackathon – Hospital Management System",
    event: "24-Hour Competitive Internal Hackathon",
    organizer: "Narasaraopeta Engineering College",
    result: "Hackathon Participation",
    type: "Hackathon",
    teamOrIndividual: "Team",
    year: "2026",
    description: "Participated in a 24-hour competitive internal hackathon and worked on a Hospital Management System.",
    verified: true,
    published: true,
    order: 1,
    evidenceUrl: ""
  },
  {
    id: "ach-2",
    title: "24-Hour Competitive Internal Hackathon – LearnGraph AI",
    event: "24-Hour Competitive Internal Hackathon",
    organizer: "Narasaraopeta Engineering College",
    result: "Hackathon Participation",
    type: "Hackathon",
    teamOrIndividual: "Team",
    year: "2026",
    description: "Participated in a 24-hour competitive internal hackathon and contributed to an AI-powered adaptive learning platform (LearnGraph AI).",
    verified: true,
    published: true,
    order: 2,
    evidenceUrl: ""
  }
];

export const INITIAL_CREDENTIALS: Credential[] = [];

export const INITIAL_CURRENTLY_LEARNING: CurrentlyLearningItem[] = [];
