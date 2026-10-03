import React from "react";
import { 
  getPublishedProfile, 
  getPublishedProjects, 
  getPublishedSkills, 
  getPublishedExperience, 
  getPublishedAchievements, 
  getPublishedCredentials, 
  getPublishedCurrentlyLearning 
} from "@/lib/content-store";
import TopHeader from "@/components/layout/TopHeader";
import HeroSection from "@/components/hero/HeroSection";
import SelectedWork from "@/components/sections/SelectedWork";
import AboutEducation from "@/components/sections/AboutEducation";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsGrid from "@/components/sections/SkillsGrid";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CurrentlyLearning from "@/components/sections/CurrentlyLearning";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import CinematicIntro from "@/components/intro/CinematicIntro";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const profile = await getPublishedProfile();
  const projects = await getPublishedProjects();
  const skills = await getPublishedSkills();
  const experience = await getPublishedExperience();
  const achievements = await getPublishedAchievements();
  const credentials = await getPublishedCredentials();
  const currentlyLearning = await getPublishedCurrentlyLearning();
  const introContent = {
    projects: projects.slice(0, 3).map(({ title, category }) => ({ title, category })),
    milestones: achievements.slice(0, 2).map(({ title, result, teamOrIndividual }) => ({
      title,
      result,
      teamOrIndividual,
    })),
  };

  return (
    <>
      <CinematicIntro content={introContent} />
      {/* Sticky Horizontal Top Header */}
      <TopHeader />

      <main className="min-h-screen bg-[#080808] flex flex-col selection:bg-[#FF7A00] selection:text-black">
        {/* Full-Width Centered Editorial Hero */}
        <HeroSection profile={profile} />

        {/* Selected Projects immediately below Hero */}
        <SelectedWork projects={projects} />

        {/* About and Education */}
        <AboutEducation profile={profile} />

        {/* Academic Journey / Education */}
        <ExperienceSection experience={experience} />

        {/* Skills Connected to Work */}
        <SkillsGrid skills={skills} />

        {/* Achievements and Learning Credentials */}
        <AchievementsSection achievements={achievements} credentials={credentials} />

        {/* Currently Learning */}
        <CurrentlyLearning items={currentlyLearning} />

        {/* Contact */}
        <ContactSection profile={profile} />

        {/* Minimal Footer */}
        <Footer />
      </main>
    </>
  );
}
