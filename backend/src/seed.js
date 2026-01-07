require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Job = require('./models/Job');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Job_Matcher';

const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Candidate.deleteMany({});
    await Job.deleteMany({});
    console.log('✅ Data cleared');

    // Create candidates
    console.log('👥 Creating candidates...');
    const candidates = [
      {
        name: "Alex Chen",
        email: "alex@example.com",
        preferredIndustries: ["IT", "SaaS", "Technology"],
        preferredRoles: ["Backend Developer", "Full Stack Developer", "Software Engineer"],
        preferredSkills: ["Node.js", "TypeScript", "JavaScript", "PostgreSQL", "AWS", "Docker", "API Design"],
        location: "Remote",
        experienceLevel: "mid",
        jobType: "full-time"
      },
      {
        name: "Jordan Lee",
        email: "jordan@example.com",
        preferredIndustries: ["Marketing", "E-commerce", "Digital Media"],
        preferredRoles: ["Marketing Manager", "Growth Hacker", "Digital Marketer"],
        preferredSkills: ["SEO", "Google Analytics", "Content Strategy", "Social Media", "Email Marketing", "PPC"],
        location: "New York, NY",
        experienceLevel: "senior",
        jobType: "full-time"
      },
      {
        name: "Taylor Smith",
        email: "taylor@example.com",
        preferredIndustries: ["Finance", "Fintech", "Banking"],
        preferredRoles: ["Data Analyst", "Financial Analyst", "Business Analyst"],
        preferredSkills: ["Python", "SQL", "Excel", "Tableau", "Statistics", "Data Visualization"],
        location: "Chicago, IL",
        experienceLevel: "entry",
        jobType: "full-time"
      }
    ];

    for (const candidateData of candidates) {
      await Candidate.create(candidateData);
    }

    // Create jobs
    console.log('💼 Creating jobs...');
    const jobs = [
      {
        title: "Backend Developer (Node.js)",
        company: "TechCorp Inc.",
        industry: "IT",
        role: "Backend Developer",
        skills: ["Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "REST APIs", "Microservices"],
        description: "Join our backend team to build scalable microservices using Node.js and TypeScript.",
        experienceLevel: "mid",
        location: "Remote",
        source: "LinkedIn",
        jobUrl: "https://linkedin.com/jobs/view/12345"
      },
      {
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        industry: "SaaS",
        role: "Full Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "AWS", "JavaScript", "TypeScript"],
        description: "Work on our SaaS platform as a full stack developer in a fast-paced startup environment.",
        experienceLevel: "mid",
        location: "San Francisco, CA",
        source: "Indeed",
        jobUrl: "https://indeed.com/jobs/67890"
      },
      {
        title: "Senior Marketing Manager",
        company: "BrandUp Marketing",
        industry: "Marketing",
        role: "Marketing Manager",
        skills: ["SEO", "Content Strategy", "Team Leadership", "Google Analytics", "Campaign Management"],
        description: "Lead our marketing team and develop strategic campaigns for enterprise clients.",
        experienceLevel: "senior",
        location: "New York, NY",
        source: "LinkedIn",
        jobUrl: "https://linkedin.com/jobs/view/54321"
      },
      {
        title: "Digital Marketing Specialist",
        company: "EcomGrow",
        industry: "E-commerce",
        role: "Digital Marketer",
        skills: ["Social Media", "Email Marketing", "Google Ads", "Content Creation", "Analytics"],
        description: "Drive customer acquisition through digital channels for our e-commerce platform.",
        experienceLevel: "mid",
        location: "Remote",
        source: "Indeed",
        jobUrl: "https://indeed.com/jobs/98765"
      },
      {
        title: "Data Analyst",
        company: "FinancePro",
        industry: "Finance",
        role: "Data Analyst",
        skills: ["Python", "SQL", "Excel", "Tableau", "Data Visualization", "Statistics"],
        description: "Analyze financial data and create reports to support business decisions.",
        experienceLevel: "entry",
        location: "Chicago, IL",
        source: "LinkedIn",
        jobUrl: "https://linkedin.com/jobs/view/13579"
      },
      {
        title: "DevOps Engineer",
        company: "CloudSystems",
        industry: "IT",
        role: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Infrastructure"],
        description: "Manage our cloud infrastructure and implement DevOps best practices.",
        experienceLevel: "senior",
        location: "Remote",
        source: "RemoteOK",
        jobUrl: "https://remoteok.io/remote-jobs/24680"
      }
    ];

    for (const jobData of jobs) {
      await Job.create(jobData);
    }

    console.log(' Database seeded successfully!');
    console.log(` Created ${await Candidate.countDocuments()} candidates`);
    console.log(` Created ${await Job.countDocuments()} jobs`);
    
    await mongoose.connection.close();
    console.log(' MongoDB connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error(' Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();