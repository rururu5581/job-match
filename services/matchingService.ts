
import { JobSeekerProfile, JobOpening, MatchResult, MatchScore } from '../types';
import { SCORING_WEIGHTS } from '../constants';
import { analyzeWorkExperienceMatch } from './geminiService';

const calculateSkillScore = (seekerSkills: string[], job: JobOpening): number => {
  if (seekerSkills.length === 0) return 0;
  let matches = 0;
  const jobText = `${job.qualifications || ''} ${job.jobDescription || ''} ${job.keywords || ''}`.toLowerCase();
  
  seekerSkills.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matches++;
    }
  });
  // Avoid division by zero if seekerSkills.length is 0, though already checked.
  // If seekerSkills.length can be dynamically modified elsewhere and become 0, this is a safeguard.
  return seekerSkills.length > 0 ? (matches / seekerSkills.length) * SCORING_WEIGHTS.SKILL : 0;
};

const calculateSalaryScore = (desiredSalary: number | null, job: JobOpening): number => {
  if (desiredSalary === null) {
    return SCORING_WEIGHTS.SALARY / 2; // Neutral score if not specified
  }

  // At this point, desiredSalary is a number.
  const minJobSalary = job.minSalary;
  const maxJobSalary = job.maxSalary;

  if (minJobSalary !== null && maxJobSalary !== null) {
    // Both min and max salary for the job are defined
    if (desiredSalary >= minJobSalary && desiredSalary <= maxJobSalary) {
      return SCORING_WEIGHTS.SALARY; // Perfect match
    }
    if (desiredSalary < minJobSalary) {
      const diff = (minJobSalary - desiredSalary) / minJobSalary; // diff will be positive
      return Math.max(0, SCORING_WEIGHTS.SALARY * (1 - diff * 2)); // Penalize more if desired is much lower
    }
    // desiredSalary > maxJobSalary (only remaining possibility for this block)
    const diff = (desiredSalary - maxJobSalary) / maxJobSalary; // diff will be positive
    return Math.max(0, SCORING_WEIGHTS.SALARY * (1 - diff)); // Penalize if desired is higher
  } else if (minJobSalary !== null) {
    // Only min job salary is defined
    if (desiredSalary >= minJobSalary) {
      return SCORING_WEIGHTS.SALARY * 0.9; // Good if above or at min
    }
    // desiredSalary < minJobSalary
    const diff = (minJobSalary - desiredSalary) / minJobSalary;
    return Math.max(0, SCORING_WEIGHTS.SALARY * (0.9 - diff * 2));
  } else if (maxJobSalary !== null) {
    // Only max job salary is defined
    if (desiredSalary <= maxJobSalary) {
      return SCORING_WEIGHTS.SALARY * 0.9; // Good if below or at max
    }
    // desiredSalary > maxJobSalary
    const diff = (desiredSalary - maxJobSalary) / maxJobSalary;
    return Math.max(0, SCORING_WEIGHTS.SALARY * (0.9 - diff));
  } else {
    // Neither min nor max job salary is defined (job has no salary info)
    return SCORING_WEIGHTS.SALARY / 1.5; // Moderately good score
  }
};


const calculateLocationScore = (desiredLocation: string, jobLocation: string): number => {
  if (!desiredLocation.trim()) return SCORING_WEIGHTS.LOCATION / 2; // Neutral if not specified
  if (!jobLocation.trim()) return SCORING_WEIGHTS.LOCATION / 2; // Neutral if job location not specified
  
  const desiredLower = desiredLocation.toLowerCase();
  const jobLower = jobLocation.toLowerCase();

  if (jobLower.includes(desiredLower) || desiredLower.includes(jobLower) || desiredLower.includes("リモート") && jobLower.includes("リモート")) {
    return SCORING_WEIGHTS.LOCATION;
  }
  // Add more sophisticated partial matching if needed
  return 0;
};

export const calculateMatchScores = async (
  profile: JobSeekerProfile,
  jobs: JobOpening[]
): Promise<MatchResult[]> => {
  const results: MatchResult[] = [];

  for (const job of jobs) {
    const skillScore = calculateSkillScore(profile.skills, job);
    const salaryScore = calculateSalaryScore(profile.desiredSalary, job);
    const locationScore = calculateLocationScore(profile.desiredLocation, job.location);

    const jobDetailsForGemini = `Position: ${job.position}. Description: ${job.jobDescription}. Ideal Candidate: ${job.idealCandidate}. Qualifications: ${job.qualifications}`;
    let experienceScoreValue = 0;
    try {
        // Ensure work experience is not empty before calling API, to save costs/avoid errors
        if (profile.workExperience.trim()) {
            const geminiScore = await analyzeWorkExperienceMatch(profile.workExperience, jobDetailsForGemini);
            experienceScoreValue = (geminiScore / 100) * SCORING_WEIGHTS.EXPERIENCE;
        } else {
            experienceScoreValue = 0; // No work experience provided by seeker.
        }
    } catch (e) {
        console.warn(`Failed to get experience score for job ${job.id}: ${e instanceof Error ? e.message : String(e)}`);
        // Use a default/neutral score or propagate error
        experienceScoreValue = SCORING_WEIGHTS.EXPERIENCE / 3; // Lower neutral score if API fails
    }
    

    const totalScore = skillScore + salaryScore + experienceScoreValue + locationScore;

    const scores: MatchScore = {
      skill: Math.max(0, Math.round(skillScore)),
      salary: Math.max(0, Math.round(salaryScore)),
      experience: Math.max(0, Math.round(experienceScoreValue)),
      location: Math.max(0, Math.round(locationScore)),
      total: Math.max(0, Math.round(totalScore)),
    };

    results.push({ job, score: scores });
  }
  return results;
};