// ESM-compatible Single Source of Truth for Certificates

// ─────────────────────────────────────────────────────
// HOW TO ADD A NEW CERTIFICATE
// ─────────────────────────────────────────────────────
// 1. Save PDF → C:\Users\xav_1\OneDrive\Desktop\certificattes\
//    OR save badge PNG → C:\Users\xav_1\OneDrive\Desktop\certificattes\google bandage\
// 2. Convert PDF to JPG → drop into src/components/Certifications/certificate/
// 3. Drop badge PNG     → src/components/Certifications/gemini_badge/
// 4. Add one new object below — slider updates automatically
// ─────────────────────────────────────────────────────

import claudAIFluency from './certificate/claudAIFluency.jpg';
import claude101 from './certificate/claude101.jpg';
import claudeAnthropicAPI from './certificate/claudeAnthropicAPI.jpg';
import web from './certificate/web.jpg';
import AppEngine from './certificate/AppEngine.jpg';
import CloudNetwork from './certificate/CloudNetwork.jpg';
import CloudCompute from './certificate/CloudCompute.jpg';
import futuroMindAI from './certificate/futuroMindAI.jpg';
import inamigoes from './certificate/inamigoes.jpg';
import gemini5 from './certificate/gemini5.jpg';
import gemini6 from './certificate/gemini6.jpg';
import gemini7 from './certificate/gemini7.jpg';
import vishwakarmaProto from './certificate/vishwakarma_proto_certificate.jpg';
import leapCertificate from './certificate/leap_certificate.jpg';
import msAiConcepts from './certificate/ms_ai_concepts.jpg';
import msNlpConcepts from './certificate/ms_nlp_concepts.jpg';
import msSpeechConcepts from './certificate/ms_speech_concepts.jpg';

import AppEngineBadge from './gemini_badge/AppEngineBadge.png';
import CloudNetworkBadge from './gemini_badge/CloudNetworkBadge.png';
import CloudComputeBadge from './gemini_badge/CloudComputeBadge.png';

export const certificatesData = [
  {
    id: 1,
    name: "Claude AI Fluency",
    category: "Artificial Intelligence",
    issuer: "Anthropic",
    type: "Certificate",
    date: "2026",
    image: claudAIFluency,
    badge: AppEngineBadge,
    pills: ["Claude AI", "Fluency"],
    badgeLabel: "Claude AI Fluency",
    gradientBar: "anthropic",
  },
  {
    id: 2,
    name: "Claude with 101",
    category: "Artificial Intelligence",
    issuer: "Anthropic",
    type: "Certificate",
    date: "2026",
    image: claude101,
    badge: AppEngineBadge,
    pills: ["Claude", "Beginner"],
    badgeLabel: "Claude 101",
    gradientBar: "anthropic",
  },
  {
    id: 3,
    name: "Claude with Anthropic API",
    category: "API Development",
    issuer: "Anthropic",
    type: "Certificate",
    date: "2026",
    image: claudeAnthropicAPI,
    badge: AppEngineBadge,
    pills: ["Anthropic API", "Developer"],
    badgeLabel: "Anthropic API",
    gradientBar: "anthropic",
  },
  {
    id: 4,
    name: "Web Development",
    category: "Web Technologies",
    issuer: "Certified",
    type: "Certificate",
    date: "2026",
    image: web,
    badge: AppEngineBadge,
    pills: ["Web", "Development"],
    badgeLabel: "Web Dev",
    gradientBar: "custom",
  },
  {
    id: 5,
    name: "Deploy and Manage Applications on Google App Engine",
    category: "Application Modernization",
    issuer: "Google Cloud",
    type: "Skill Badge",
    date: "May 21, 2026",
    image: AppEngine,
    badge: AppEngineBadge,
    pills: ["App Engine", "Introductory"],
    badgeLabel: "App Engine Deploy",
    gradientBar: "google",
  },
  {
    id: 6,
    name: "Set Up a Google Cloud Network",
    category: "Infrastructure Modernization",
    issuer: "Google Cloud",
    type: "Skill Badge",
    date: "May 21, 2026",
    image: CloudNetwork,
    badge: CloudNetworkBadge,
    pills: ["Networking", "Introductory"],
    badgeLabel: "Cloud Network Setup",
    gradientBar: "google",
  },
  {
    id: 7,
    name: "The Basics of Google Cloud Compute",
    category: "Infrastructure Modernization",
    issuer: "Google Cloud",
    type: "Skill Badge",
    date: "May 21, 2026",
    image: CloudCompute,
    badge: CloudComputeBadge,
    pills: ["Compute", "Introductory"],
    badgeLabel: "Cloud Compute Basics",
    gradientBar: "google",
  },
  {
    id: 8,
    name: "Python with Artificial Intelligence: An Intensive Internship Program in AI and Machine Learning",
    category: "Artificial Intelligence",
    issuer: "BM FuturoMind AI",
    type: "Certificate",
    date: "February 28, 2026",
    image: futuroMindAI,
    badge: AppEngineBadge,
    pills: ["Python", "AI & ML"],
    badgeLabel: "Python & AI",
    gradientBar: "custom",
  },
  {
    id: 9,
    name: "Content Writing Internship",
    category: "Content Writing",
    issuer: "InAmigos Foundation",
    type: "Certificate",
    date: "February 14, 2026",
    image: inamigoes,
    badge: AppEngineBadge,
    pills: ["Content Writing", "Remote"],
    badgeLabel: "Content Writing",
    gradientBar: "custom",
  },
  {
    id: 10,
    name: "Build a Data Mesh with Dataplex",
    category: "Google Cloud",
    issuer: "Google Cloud Skill Boost",
    type: "Badge",
    date: "May 22, 2026",
    image: gemini5,
    badge: AppEngineBadge,
    pills: ["Google Cloud", "Dataplex", "Analytics"],
    badgeLabel: "Data Mesh Dataplex",
    gradientBar: "google",
  },
  {
    id: 11,
    name: "Implement Cloud Security Fundamentals on Google Cloud",
    category: "Google Cloud",
    issuer: "Google Cloud Skill Boost",
    type: "Badge",
    date: "May 23, 2026",
    image: gemini6,
    badge: AppEngineBadge,
    pills: ["Google Cloud", "Security"],
    badgeLabel: "Cloud Security",
    gradientBar: "google",
  },
  {
    id: 12,
    name: "Gemini for Data Scientists and Analysts",
    category: "Google Cloud",
    issuer: "Google Cloud Skill Boost",
    type: "Badge",
    date: "May 24, 2026",
    image: gemini7,
    badge: AppEngineBadge,
    pills: ["Google Cloud", "Gemini", "AI"],
    badgeLabel: "Gemini for Data",
    gradientBar: "google",
  },
  {
    id: 13,
    name: "Vishwakarma Awards 2025 Prototype Stage",
    category: "Engineering / Innovation",
    issuer: "Maker Bhavan Foundation",
    type: "Certificate",
    date: "February 2025",
    image: vishwakarmaProto,
    badge: AppEngineBadge,
    pills: ["Prototype", "HealTech"],
    badgeLabel: "Vishwakarma 2025",
    gradientBar: "custom",
  },
  {
    id: 14,
    name: "LEAP Certificate of Completion (LP202 - Practicum for Innovative Engineering)",
    category: "Engineering / Innovation",
    issuer: "IITM Incubation Cell",
    type: "Certificate",
    date: "August 2024 - February 2026",
    image: leapCertificate,
    badge: AppEngineBadge,
    pills: ["LEAP", "Practicum"],
    badgeLabel: "LEAP IITM",
    gradientBar: "custom",
  },
  {
    id: 15,
    name: "Introduction to AI concepts",
    category: "Artificial Intelligence",
    issuer: "Microsoft",
    type: "Certificate",
    date: "July 5, 2026",
    image: msAiConcepts,
    badge: AppEngineBadge,
    pills: ["Microsoft", "AI Concepts", "Azure"],
    badgeLabel: "MS AI Concepts",
    gradientBar: "microsoft",
  },
  {
    id: 16,
    name: "Introduction to natural language processing concepts",
    category: "Artificial Intelligence",
    issuer: "Microsoft",
    type: "Certificate",
    date: "July 5, 2026",
    image: msNlpConcepts,
    badge: AppEngineBadge,
    pills: ["Microsoft", "NLP", "Azure AI"],
    badgeLabel: "MS NLP",
    gradientBar: "microsoft",
  },
  {
    id: 17,
    name: "Introduction to AI speech concepts",
    category: "Artificial Intelligence",
    issuer: "Microsoft",
    type: "Certificate",
    date: "July 5, 2026",
    image: msSpeechConcepts,
    badge: AppEngineBadge,
    pills: ["Microsoft", "AI Speech", "Azure AI"],
    badgeLabel: "MS AI Speech",
    gradientBar: "microsoft",
  },
];
