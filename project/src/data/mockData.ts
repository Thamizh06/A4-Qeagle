import { Course, JobDescription } from '../types';

export const mockCourses: Course[] = [
  {
    course_id: 'selenium-101',
    title: 'Automation with Selenium WebDriver',
    skills: ['Selenium', 'Test Automation', 'Java', 'WebDriver', 'Page Object Model'],
    difficulty: 'Beginner',
    duration_weeks: 4,
    prerequisites: ['Manual Testing', 'Basic Programming'],
    outcomes: ['Create automated test scripts', 'Implement Page Object Model', 'Handle dynamic elements'],
    description: 'Learn the fundamentals of test automation using Selenium WebDriver',
    rating: 4.6
  },
  {
    course_id: 'api-testing-postman',
    title: 'API Testing with Postman & Newman',
    skills: ['API Testing', 'Postman', 'REST APIs', 'Newman', 'JSON', 'HTTP'],
    difficulty: 'Intermediate',
    duration_weeks: 3,
    prerequisites: ['Basic Testing', 'HTTP Fundamentals'],
    outcomes: ['Test REST APIs', 'Automate API tests', 'Validate responses', 'CI/CD integration'],
    description: 'Master API testing techniques using Postman and automation with Newman',
    rating: 4.7
  },
  {
    course_id: 'cicd-qa',
    title: 'CI/CD for QA Engineers',
    skills: ['CI/CD', 'Jenkins', 'GitHub Actions', 'DevOps', 'Docker', 'Pipeline Testing'],
    difficulty: 'Advanced',
    duration_weeks: 5,
    prerequisites: ['Test Automation', 'Version Control'],
    outcomes: ['Build CI/CD pipelines', 'Integrate automated tests', 'Deploy test environments'],
    description: 'Learn DevOps practices and CI/CD pipeline implementation for QA',
    rating: 4.5
  },
  {
    course_id: 'sql-testing',
    title: 'Database Testing with SQL',
    skills: ['SQL', 'Database Testing', 'MySQL', 'PostgreSQL', 'Data Validation'],
    difficulty: 'Beginner',
    duration_weeks: 3,
    prerequisites: ['Basic Testing'],
    outcomes: ['Write complex SQL queries', 'Validate data integrity', 'Test database performance'],
    description: 'Learn comprehensive database testing techniques using SQL',
    rating: 4.4
  },
  {
    course_id: 'performance-testing',
    title: 'Performance Testing with JMeter',
    skills: ['Performance Testing', 'JMeter', 'Load Testing', 'Stress Testing', 'Performance Analysis'],
    difficulty: 'Intermediate',
    duration_weeks: 4,
    prerequisites: ['Manual Testing', 'Basic Scripting'],
    outcomes: ['Design load tests', 'Analyze performance metrics', 'Identify bottlenecks'],
    description: 'Master performance testing using Apache JMeter',
    rating: 4.3
  },
  {
    course_id: 'genai-testing',
    title: 'AI-Powered Testing Strategies',
    skills: ['AI Testing', 'Machine Learning', 'Test Data Generation', 'Intelligent Test Selection', 'GenAI'],
    difficulty: 'Advanced',
    duration_weeks: 6,
    prerequisites: ['Test Automation', 'Python', 'Basic ML Concepts'],
    outcomes: ['Implement AI in testing', 'Generate test data with AI', 'Optimize test selection'],
    description: 'Explore cutting-edge AI applications in software testing',
    rating: 4.8
  },
  {
    course_id: 'python-automation',
    title: 'Python for Test Automation',
    skills: ['Python', 'Pytest', 'Test Automation', 'Selenium Python', 'API Automation'],
    difficulty: 'Beginner',
    duration_weeks: 4,
    prerequisites: ['Manual Testing'],
    outcomes: ['Write Python test scripts', 'Use Pytest framework', 'Automate web and API tests'],
    description: 'Learn Python programming specifically for test automation',
    rating: 4.6
  },
  {
    course_id: 'mobile-testing',
    title: 'Mobile App Testing with Appium',
    skills: ['Mobile Testing', 'Appium', 'iOS Testing', 'Android Testing', 'Mobile Automation'],
    difficulty: 'Intermediate',
    duration_weeks: 5,
    prerequisites: ['Test Automation', 'Mobile Development Basics'],
    outcomes: ['Test mobile applications', 'Automate mobile tests', 'Cross-platform testing'],
    description: 'Comprehensive mobile application testing using Appium',
    rating: 4.4
  }
];

export const mockJobDescriptions: JobDescription[] = [
  {
    role: 'SDET',
    required_skills: {
      'Test Automation': 'Advanced',
      'Selenium': 'Advanced',
      'API Testing': 'Intermediate',
      'CI/CD': 'Intermediate',
      'Java': 'Intermediate',
      'Python': 'Intermediate',
      'SQL': 'Basic',
      'Manual Testing': 'Intermediate'
    },
    experience_years: 3
  },
  {
    role: 'GenAI QA Engineer',
    required_skills: {
      'AI Testing': 'Advanced',
      'Machine Learning': 'Intermediate',
      'Python': 'Advanced',
      'Test Automation': 'Advanced',
      'API Testing': 'Intermediate',
      'Manual Testing': 'Intermediate',
      'GenAI': 'Advanced'
    },
    experience_years: 4
  },
  {
    role: 'Performance Test Engineer',
    required_skills: {
      'Performance Testing': 'Advanced',
      'JMeter': 'Advanced',
      'Load Testing': 'Advanced',
      'SQL': 'Intermediate',
      'Scripting': 'Intermediate',
      'CI/CD': 'Basic',
      'Manual Testing': 'Basic'
    },
    experience_years: 3
  },
  {
    role: 'Mobile QA Engineer',
    required_skills: {
      'Mobile Testing': 'Advanced',
      'Appium': 'Advanced',
      'Test Automation': 'Intermediate',
      'Manual Testing': 'Advanced',
      'API Testing': 'Intermediate',
      'SQL': 'Basic'
    },
    experience_years: 2
  }
];

// Common skills database
export const availableSkills = [
  'Manual Testing',
  'Test Automation',
  'Selenium',
  'API Testing',
  'SQL',
  'Java',
  'Python',
  'JavaScript',
  'CI/CD',
  'Jenkins',
  'Git',
  'Postman',
  'JMeter',
  'Performance Testing',
  'Mobile Testing',
  'Appium',
  'Docker',
  'DevOps',
  'Agile',
  'Scrum',
  'Test Planning',
  'Bug Tracking',
  'JIRA',
  'TestRail',
  'Database Testing',
  'Security Testing',
  'Accessibility Testing',
  'Cross-browser Testing',
  'AI Testing',
  'Machine Learning',
  'GenAI'
];