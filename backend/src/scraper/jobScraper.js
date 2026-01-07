const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job');

// Mock job data for demonstration
const mockJobs = [
  {
    title: "Senior React Developer",
    company: "TechInnovate",
    industry: "IT",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "TypeScript", "Redux", "CSS"],
    description: "Build modern web applications with React and TypeScript.",
    experienceLevel: "senior",
    location: "Remote",
    source: "MockScraper",
    jobUrl: "https://example.com/jobs/react-dev"
  },
  {
    title: "DevOps Engineer",
    company: "CloudSystems",
    industry: "IT",
    role: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    description: "Manage cloud infrastructure and DevOps pipelines.",
    experienceLevel: "mid",
    location: "San Francisco, CA",
    source: "MockScraper",
    jobUrl: "https://example.com/jobs/devops"
  },
  {
    title: "Product Manager",
    company: "ProductLabs",
    industry: "Product",
    role: "Product Manager",
    skills: ["Product Strategy", "User Research", "Agile", "Analytics"],
    description: "Lead product development from concept to launch.",
    experienceLevel: "senior",
    location: "New York, NY",
    source: "MockScraper",
    jobUrl: "https://example.com/jobs/pm"
  }
];

const scrapeJobs = async () => {
  try {
    console.log('Starting job scraping...');
    
    // In a real scenario, you would:
    // 1. Fetch HTML from job boards (Indeed, LinkedIn, etc.)
    // 2. Parse with Cheerio
    // 3. Extract job data
    // 4. Save to database
    
    // For this assessment, we'll use mock data
    console.log('Using mock job data for demonstration');
    
    // Clear existing jobs from our scraper
    await Job.deleteMany({ source: 'MockScraper' });
    
    // Add mock jobs
    for (const jobData of mockJobs) {
      const job = new Job(jobData);
      await job.save();
    }
    
    console.log(`Added ${mockJobs.length} mock jobs to database`);
    return { success: true, count: mockJobs.length };
    
  } catch (error) {
    console.error('Error scraping jobs:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { scrapeJobs };