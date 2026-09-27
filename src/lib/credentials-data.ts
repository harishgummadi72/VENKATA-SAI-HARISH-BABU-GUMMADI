export type LedgerCategory = 
  | "certification" 
  | "badge" 
  | "hackathon" 
  | "internship" 
  | "training" 
  | "recognition";

export interface LedgerRecord {
  id: string;
  type: LedgerCategory;
  categoryLabel: string;
  title: string;
  issuer: string;
  issuedDate: string;
  year?: string;
  description: string;
  skills: string[];
  achievement?: string;
  projectName?: string;
  credentialId?: string;
  credentialUrl?: string;
  proofUrl?: string;
  linkedInPostUrl?: string;
  certificateAsset?: string;
  verified: boolean;
  todoNotes?: string;
}

export const VERIFIED_LEDGER_RECORDS: LedgerRecord[] = [
  {
    id: "rec-internal-hackathon",
    type: "hackathon",
    categoryLabel: "HACKATHON",
    title: "24-Hour Internal Hackathon",
    issuer: "Internal Hackathon",
    issuedDate: "Participation",
    year: "",
    achievement: "Participation",
    description: "Participated in a 24-hour internal hackathon, gaining experience in time-bound problem solving, collaboration and solution development.",
    skills: ["Problem Solving", "Collaboration", "Rapid Development"],
    verified: true
  }
];
