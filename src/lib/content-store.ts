import { 
  PortfolioProfile, 
  Project, 
  Skill, 
  Achievement, 
  Credential, 
  Experience, 
  CurrentlyLearningItem 
} from '@/types/portfolio';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCE,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CREDENTIALS,
  INITIAL_CURRENTLY_LEARNING
} from './initial-data';

export interface StorageData {
  profile: PortfolioProfile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  achievements: Achievement[];
  credentials: Credential[];
  currentlyLearning: CurrentlyLearningItem[];
}

const INITIAL_DATA: StorageData = {
  profile: INITIAL_PROFILE,
  projects: INITIAL_PROJECTS,
  skills: INITIAL_SKILLS,
  experience: INITIAL_EXPERIENCE,
  achievements: INITIAL_ACHIEVEMENTS,
  credentials: INITIAL_CREDENTIALS,
  currentlyLearning: INITIAL_CURRENTLY_LEARNING
};

import { readPortfolioStorage, writePortfolioStorage, type StoragePersistenceResult } from './github-storage.server';

async function getData(): Promise<StorageData> {
  return readPortfolioStorage<StorageData>(INITIAL_DATA);
}

// =================== PUBLIC PUBLISHED APIS ===================

export async function getPublishedProfile(): Promise<PortfolioProfile> {
  const data = await getData();
  return data.profile;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const data = await getData();
  return data.projects
    .filter(p => p.published)
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const data = await getData();
  const project = data.projects.find(p => p.slug === slug && p.published);
  return project || null;
}

export async function getPublishedSkills(): Promise<Skill[]> {
  const data = await getData();
  return data.skills;
}

export async function getPublishedExperience(): Promise<Experience[]> {
  const data = await getData();
  return data.experience.filter(e => e.published);
}

export async function getPublishedAchievements(): Promise<Achievement[]> {
  const data = await getData();
  return data.achievements
    .filter(a => a.published)
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedCredentials(): Promise<Credential[]> {
  const data = await getData();
  return data.credentials
    .filter(c => c.published)
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedCurrentlyLearning(): Promise<CurrentlyLearningItem[]> {
  const data = await getData();
  return data.currentlyLearning.filter(l => l.published);
}

// Single combined safe published snapshot for AI grounding
export async function getPublishedGroundingSnapshot() {
  const profile = await getPublishedProfile();
  const projects = await getPublishedProjects();
  const skills = await getPublishedSkills();
  const experience = await getPublishedExperience();
  const achievements = await getPublishedAchievements();
  const credentials = await getPublishedCredentials();
  const currentlyLearning = await getPublishedCurrentlyLearning();

  return {
    candidate: {
      name: profile.name,
      location: profile.location,
      primaryRole: profile.primaryRole,
      supportingRole: profile.supportingRole,
      introduction: profile.introduction,
      aboutBio: profile.aboutBio,
      education: profile.education,
      contactChannels: {
        email: profile.contact.email,
        github: profile.contact.github,
        linkedin: profile.contact.linkedin,
        availability: profile.contact.availabilityStatus
      }
    },
    projects: projects.map(p => ({
      title: p.title,
      slug: p.slug,
      role: p.role,
      contribution: p.contribution,
      technologies: p.technologies,
      overview: p.overview,
      problem: p.problem,
      featuresBuilt: p.featuresBuilt,
      challenges: p.challenges,
      lessons: p.lessons,
      limitations: p.limitations,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl
    })),
    skills: skills.map(s => ({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      relatedProjects: s.relatedProjectSlugs
    })),
    experience: experience.map(e => ({
      role: e.role,
      company: e.company,
      cooDistinction: e.cooDistinction,
      period: e.period,
      contributions: e.contributions
    })),
    achievements: achievements.map(a => ({
      title: a.title,
      type: a.type,
      event: a.event,
      organizer: a.organizer,
      result: a.result,
      teamOrIndividual: a.teamOrIndividual,
      year: a.year,
      description: a.description
    })),
    credentials: credentials.map(c => ({
      title: c.title,
      type: c.type,
      category: c.category,
      issuer: c.issuer,
      date: c.date,
      summary: c.summary,
      credentialId: c.credentialId,
      isJourney: c.isJourney
    })),
    currentlyLearning: currentlyLearning.map(l => ({
      topic: l.topic,
      area: l.area,
      dated: l.dated,
      notes: l.notes
    }))
  };
}

export async function getPublishedPortfolioKnowledge(): Promise<string> {
  const snapshot = await getPublishedGroundingSnapshot();
  const c = snapshot.candidate;

  return `
# PUBLISHED PORTFOLIO KNOWLEDGE BASE (VENKATA SAI HARISH BABU GUMMADI)
Strict instruction: You are Harish's AI Portfolio Assistant. You must answer ONLY from the published records below. Never invent details, credentials, scores, or private data. If a requested detail is not in this document, state truthfully that it is not part of Harish's published portfolio records.

## 1. CANDIDATE PROFILE & BIOGRAPHY
- Name: ${c.name}
- Preferred Name: Harish Babu
- Location: ${c.location}
- Primary Role: ${c.primaryRole}
- Supporting Role: ${c.supportingRole}
- Bio / Overview: ${c.introduction} ${c.aboutBio.join(" ")}
- Academic Education:
  * B.Tech in Computer Science and Engineering (CSE) at Narasaraopeta Engineering College (JNTUK), Period: 2025–2029 (Ongoing), CGPA: 8.46.
  * Intermediate (12th): Narayana, MPC, Completed 2025, 91.3%.
  * SSC (10th): Kennedy English Medium High School, State Board, Completed 2023, 87%.
- Career Interests & Focus Areas: Software Development, Full Stack Web Development, Cybersecurity.
- Languages Known: English, Telugu.
- Approved Contact Channels:
  * Email: ${c.contactChannels.email}
  * Phone: +91 8919580966
  * GitHub: ${c.contactChannels.github}
  * Availability: ${c.contactChannels.availability}
- Important Note: No separate LinkedIn or portfolio URL has been provided. No work experience or internship records are present.

## 2. TECHNICAL SKILLS & PROFICIENCY
${snapshot.skills.map(s => `
- ${s.name} (${s.category})
`).join('\n')}
(Skills strictly limited to: C, Java, Python, HTML, Supabase).

## 3. PROJECTS STATUS
- Status: Projects currently in progress. Harish is building and documenting practical software projects; selected work will be published on GitHub (${c.contactChannels.github}) as it becomes ready.

## 4. HACKATHONS & ACHIEVEMENTS
${snapshot.achievements.map(a => `
- ${a.title}:
  * Type: ${a.type}
  * Event / Context: ${a.event} (${a.organizer})
  * Result: ${a.result}
  * Summary: ${a.description}
`).join('\n')}
`.trim();
}


// =================== STUDIO / AUTHENTICATED MUTATIONS ===================

export async function getAllContentForStudio(): Promise<StorageData> {
  return getData();
}

export async function saveStudioContent(updatedData: StorageData): Promise<StoragePersistenceResult> {
  return writePortfolioStorage(updatedData);
}
