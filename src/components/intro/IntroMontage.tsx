export interface IntroContent {
  projects: { title: string; category: string }[];
  milestones: { title: string; result: string; teamOrIndividual: string }[];
  leadership?: { company: string; role: string };
}

// Vector compositions use published portfolio content for Harish Babu.
export default function IntroMontage({ content }: { content: IntroContent }) {
  const projects = content.projects;
  const milestone = content.milestones[0];

  return (
    <g fontFamily="var(--font-inter), sans-serif">
      <rect width="2400" height="1300" fill="#080808" />
      <g transform="translate(28 26)">
        <rect width="760" height="580" fill="#151515" stroke="#262626" strokeWidth="2" />
        <image href="/assets/images/nec-college-building.jpg" x="0" y="0" width="760" height="375" preserveAspectRatio="xMidYMid slice" />
        <rect width="760" height="375" fill="#080808" opacity=".5" />
        <rect x="32" y="32" width="54" height="54" fill="#121212" stroke="#FF7A00" strokeWidth="1" />
        <text x="44" y="68" fill="#FF7A00" fontSize="23" fontWeight="700">01</text>
        <text x="36" y="436" fill="#FF7A00" fontSize="15" letterSpacing="5">AI / FULL STACK</text>
        <text x="34" y="505" fill="#F5F5F5" fontSize="57" fontWeight="700">{projects[0]?.title ?? "Aakash AI"}</text>
        <text x="36" y="548" fill="#B7B7B7" fontSize="19">{projects[0]?.category ?? "AI & Web Development"}</text>
      </g>

      <g transform="translate(810 26)">
        <rect width="600" height="580" fill="#121212" stroke="#262626" strokeWidth="2" />
        <path d="M300 82 421 132v117c0 91-121 155-121 155s-121-64-121-155V132Z" fill="none" stroke="#FF7A00" strokeWidth="2" />
        <path d="M300 111 394 150v95c0 65-94 121-94 121s-94-56-94-121v-95Z" fill="none" stroke="#FF7A00" opacity=".35" />
        <path d="m256 226 30 30 63-68" fill="none" stroke="#FF9D33" strokeWidth="8" />
        <text x="36" y="445" fill="#FF7A00" fontSize="15" letterSpacing="5">AI / APPLICATION</text>
        <text x="34" y="506" fill="#F5F5F5" fontSize="45" fontWeight="700">{projects[1]?.title ?? "Nexora AI"}</text>
        <text x="36" y="547" fill="#B7B7B7" fontSize="19">{projects[1]?.category ?? "Lost & Found AI"}</text>
      </g>

      <g transform="translate(1432 26)">
        <rect width="920" height="580" fill="#151515" stroke="#262626" strokeWidth="2" />
        <path d="M470 100v245m0-208c-61-47-125-41-176-27v210c55-16 118-20 176 25 61-45 124-41 176-25V110c-56-14-113-20-176 27Z" fill="none" stroke="#FF7A00" strokeWidth="3" />
        <text x="36" y="445" fill="#FF7A00" fontSize="15" letterSpacing="5">AI / ADAPTIVE LEARNING</text>
        <text x="34" y="506" fill="#F5F5F5" fontSize="43" fontWeight="700">{projects[2]?.title ?? "LearnGraph AI"}</text>
        <text x="36" y="547" fill="#B7B7B7" fontSize="19">{projects[2]?.category ?? "Autonomous Study Agent"}</text>
      </g>

      <g transform="translate(28 628)">
        <rect width="590" height="610" fill="#121212" stroke="#262626" strokeWidth="2" />
        <text x="36" y="57" fill="#FF7A00" fontSize="15" letterSpacing="5">LEARN. BUILD. COLLABORATE.</text>
        <g fontFamily="monospace" fontSize="25" fill="#F5F5F5">
          <text x="36" y="154" fill="#FF9D33">const engineer = &#123;</text>
          <text x="60" y="208">focus: &apos;full_stack&apos;,</text>
          <text x="60" y="262">domain: &apos;ai_software&apos;,</text>
          <text x="60" y="316">curiosity: true</text>
          <text x="36" y="370" fill="#FF9D33">&#125;;</text>
          <text x="36" y="477" fill="#818181">{"// Computer Science & Engineering"}</text>
        </g>
      </g>

      <g transform="translate(640 628)">
        <rect width="770" height="610" fill="#151515" stroke="#262626" strokeWidth="2" />
        <circle cx="390" cy="234" r="139" fill="none" stroke="#FF7A00" strokeWidth="2" />
        <circle cx="390" cy="234" r="120" fill="none" stroke="#FF7A00" opacity=".4" />
        <path d="m390 167 19 42 46 5-34 31 10 46-41-24-41 24 10-46-34-31 46-5Z" fill="#FF7A00" />
        <text x="36" y="435" fill="#FF7A00" fontSize="15" letterSpacing="4">{milestone?.teamOrIndividual?.toUpperCase() ?? "COMPETITIVE"} / HACKATHON</text>
        <text x="34" y="495" fill="#F5F5F5" fontSize="44" fontWeight="750">{milestone?.result ?? "Hackathon Sprint"}</text>
        <text x="36" y="542" fill="#B7B7B7" fontSize="21">{milestone?.title ?? "24-Hour Competitive Internal Hackathon"}</text>
      </g>

      <g transform="translate(1432 628)">
        <rect width="920" height="610" fill="#121212" stroke="#262626" strokeWidth="2" />
        <path d="M66 89h782M66 383h782" stroke="#262626" strokeWidth="2" />
        <text x="62" y="155" fill="#FF7A00" fontSize="15" letterSpacing="5">ENGINEERING / ASPIRATION</text>
        <text x="60" y="296" fill="#F5F5F5" fontSize="80" fontWeight="750">Harish Babu</text>
        <text x="66" y="453" fill="#B7B7B7" fontSize="30">Software Developer · CSE Undergraduate</text>
        <text x="66" y="513" fill="#818181" fontSize="20">Crafting thoughtful full-stack & AI-enabled software solutions.</text>
      </g>
    </g>
  );
}
