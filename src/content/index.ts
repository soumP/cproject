import type { CaseStudy } from "./types";
import { dauDrop } from "./case-studies/dau-drop";
import { instagramStories } from "./case-studies/instagram-stories";
import { spotifyWrapped } from "./case-studies/spotify-wrapped";
import { prioritizeRoadmap } from "./case-studies/prioritize-roadmap";

export const caseStudies: CaseStudy[] = [dauDrop, instagramStories, spotifyWrapped, prioritizeRoadmap];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudiesUsingFramework(slug: string): CaseStudy[] {
  return caseStudies.filter((c) => c.frameworks.includes(slug));
}

export * from "./types";
export * from "./tracks";
export * from "./frameworks";
