import { UserProfile, UpskillPlan, CourseRecommendation, SkillGap } from '../types';
import { mockCourses, mockJobDescriptions } from '../data/mockData';

export function generateUpskillPlan(profile: UserProfile): UpskillPlan {
  // Find job description for the target role
  const targetJob = mockJobDescriptions.find(
    job => job.role.toLowerCase() === profile.goal_role.toLowerCase()
  );

  if (!targetJob) {
    // Create a generic plan if role not found
    return createGenericPlan(profile);
  }

  // Calculate skill gaps
  const skillGaps = calculateSkillGaps(profile.skills, targetJob.required_skills);

  // Find relevant courses
  const recommendations = findBestCourses(skillGaps, profile);

  // Create timeline
  const timeline = createTimeline(recommendations);

  // Calculate coverage score
  const coverageScore = calculateCoverageScore(skillGaps, recommendations);

  return {
    recommendations,
    skill_gaps: skillGaps,
    timeline,
    coverage_score: coverageScore,
    notes: generateNotes(skillGaps, recommendations, profile)
  };
}

function calculateSkillGaps(userSkills: string[], requiredSkills: { [skill: string]: string }): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const [skill, requiredLevel] of Object.entries(requiredSkills)) {
    const hasSkill = userSkills.includes(skill);
    const currentLevel = hasSkill ? 'Intermediate' : 'None'; // Simplified assumption
    
    let gap: SkillGap['gap'] = 'None';
    if (currentLevel === 'None') {
      gap = requiredLevel === 'Advanced' ? 'Large' : requiredLevel === 'Intermediate' ? 'Medium' : 'Small';
    } else if (currentLevel === 'Basic' && requiredLevel === 'Advanced') {
      gap = 'Medium';
    } else if (currentLevel === 'Basic' && requiredLevel === 'Intermediate') {
      gap = 'Small';
    } else if (currentLevel === 'Intermediate' && requiredLevel === 'Advanced') {
      gap = 'Small';
    }

    gaps.push({
      skill,
      current_level: currentLevel as any,
      required_level: requiredLevel as any,
      gap
    });
  }

  return gaps.sort((a, b) => {
    const gapOrder = { 'Large': 3, 'Medium': 2, 'Small': 1, 'None': 0 };
    return gapOrder[b.gap] - gapOrder[a.gap];
  });
}

function findBestCourses(skillGaps: SkillGap[], profile: UserProfile): CourseRecommendation[] {
  const neededSkills = skillGaps
    .filter(gap => gap.gap !== 'None')
    .map(gap => gap.skill);

  // Score courses based on skill coverage and preferences
  const scoredCourses = mockCourses.map(course => {
    let score = 0;
    let coveredSkills = 0;

    // Points for covering needed skills
    course.skills.forEach(skill => {
      if (neededSkills.includes(skill)) {
        score += 10;
        coveredSkills++;
      }
    });

    // Penalty for difficulty mismatch
    if (profile.difficulty_preference) {
      if (course.difficulty === profile.difficulty_preference) {
        score += 5;
      } else if (
        (profile.difficulty_preference === 'Beginner' && course.difficulty === 'Advanced') ||
        (profile.difficulty_preference === 'Advanced' && course.difficulty === 'Beginner')
      ) {
        score -= 3;
      }
    }

    // Duration preference
    if (profile.duration_limit && course.duration_weeks > profile.duration_limit / 3) {
      score -= 2;
    }

    return {
      course,
      score,
      coveredSkills
    };
  });

  // Select top 3 courses with diverse skill coverage
  const selectedCourses: CourseRecommendation[] = [];
  const coveredSkillsSet = new Set<string>();

  scoredCourses
    .sort((a, b) => b.score - a.score)
    .forEach(({ course, coveredSkills }) => {
      if (selectedCourses.length < 3) {
        const newSkills = course.skills.filter(skill => 
          neededSkills.includes(skill) && !coveredSkillsSet.has(skill)
        );
        
        if (newSkills.length > 0 || selectedCourses.length === 0) {
          newSkills.forEach(skill => coveredSkillsSet.add(skill));
          selectedCourses.push({
            course,
            why: generateWhy(course, neededSkills, profile.goal_role)
          });
        }
      }
    });

  return selectedCourses;
}

function generateWhy(course: any, neededSkills: string[], goalRole: string): string {
  const relevantSkills = course.skills.filter((skill: string) => neededSkills.includes(skill));
  
  if (relevantSkills.length === 0) {
    return `Provides foundational knowledge essential for ${goalRole} role`;
  }

  if (relevantSkills.length === 1) {
    return `Essential for mastering ${relevantSkills[0]}, a key requirement for ${goalRole} positions`;
  }

  return `Covers ${relevantSkills.slice(0, 2).join(' and ')} - critical skills for ${goalRole} success`;
}

function createTimeline(recommendations: CourseRecommendation[]): UpskillPlan['timeline'] {
  let currentWeek = 0;
  const phases = recommendations.map(rec => {
    const startWeek = currentWeek + 1;
    currentWeek += rec.course.duration_weeks;
    
    return {
      weeks: `Week ${startWeek}-${currentWeek}`,
      course: rec.course.title,
      focus: rec.course.skills.slice(0, 3)
    };
  });

  return {
    total_weeks: currentWeek,
    phases
  };
}

function calculateCoverageScore(skillGaps: SkillGap[], recommendations: CourseRecommendation[]): number {
  const totalSkills = skillGaps.length;
  const courseSkills = new Set<string>();
  
  recommendations.forEach(rec => {
    rec.course.skills.forEach(skill => courseSkills.add(skill));
  });

  const coveredSkills = skillGaps.filter(gap => 
    courseSkills.has(gap.skill) || gap.gap === 'None'
  ).length;

  return Math.round((coveredSkills / totalSkills) * 100);
}

function generateNotes(skillGaps: SkillGap[], recommendations: CourseRecommendation[], profile: UserProfile): string[] {
  const notes: string[] = [];

  const largeGaps = skillGaps.filter(gap => gap.gap === 'Large').length;
  if (largeGaps > 0) {
    notes.push(`You have ${largeGaps} major skill gap${largeGaps > 1 ? 's' : ''} to address for your target role`);
  }

  const totalDuration = recommendations.reduce((sum, rec) => sum + rec.course.duration_weeks, 0);
  if (profile.duration_limit && totalDuration > profile.duration_limit) {
    notes.push(`Timeline exceeds your preferred ${profile.duration_limit} weeks. Consider part-time study or prioritizing courses`);
  }

  if (recommendations.some(rec => rec.course.difficulty === 'Advanced') && profile.years < 2) {
    notes.push('Some advanced courses may be challenging. Consider additional practice time or prerequisites');
  }

  notes.push(`Strong foundation in ${profile.skills.join(', ')} will accelerate your learning journey`);

  return notes;
}

function createGenericPlan(profile: UserProfile): UpskillPlan {
  // Fallback plan for unknown roles
  const genericCourses = mockCourses.slice(0, 3);
  const recommendations: CourseRecommendation[] = genericCourses.map(course => ({
    course,
    why: `Builds essential skills for ${profile.goal_role} and enhances your technical capabilities`
  }));

  const timeline = createTimeline(recommendations);
  
  return {
    recommendations,
    skill_gaps: [],
    timeline,
    coverage_score: 75,
    notes: ['Generic plan created. Please refine your target role for more specific recommendations.']
  };
}