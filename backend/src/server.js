require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const Candidate = require('./models/Candidate');
const Job = require('./models/Job');
const { scrapeJobs } = require('./scraper/jobScraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - FIXED
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check with better response
app.get('/', (req, res) => {
  res.json({ 
    message: 'Job Matcher API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      candidates: '/api/candidates',
      jobs: '/api/jobs',
      matches: '/api/candidates/:id/matches'
    }
  });
});

// ========== CANDIDATE ROUTES ==========
// Get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    console.log('Fetching all candidates...');
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    console.log(`Found ${candidates.length} candidates`);
    
    res.json({ 
      success: true, 
      count: candidates.length, 
      data: candidates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch candidates'
    });
  }
});

// Create a candidate
app.post('/api/candidates', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single candidate
app.get('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== JOB ROUTES ==========
// Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    console.log('Fetching all jobs...');
    const jobs = await Job.find().sort({ createdAt: -1 });
    console.log(`Found ${jobs.length} jobs`);
    
    res.json({ 
      success: true, 
      count: jobs.length, 
      data: jobs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a job
app.post('/api/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ========== MATCHING LOGIC ==========
// Match jobs for a candidate
app.get('/api/candidates/:id/matches', async (req, res) => {
  try {
    console.log(`Fetching matches for candidate: ${req.params.id}`);
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const allJobs = await Job.find();
    console.log(`Found ${allJobs.length} jobs to match against`);
    
    // Calculate match scores for each job
    const matches = allJobs.map(job => {
      const score = calculateMatchScore(candidate, job);
      const matchedSkills = findMatchedSkills(candidate.preferredSkills, job.skills);
      
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        industry: job.industry,
        role: job.role,
        skills: job.skills,
        description: job.description,
        experienceLevel: job.experienceLevel,
        location: job.location,
        source: job.source,
        jobUrl: job.jobUrl,
        matchScore: score,
        matchedSkills: matchedSkills,
        matchPercentage: `${score}%`
      };
    });

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Filter for decent matches (score >= 40)
    const recommendedMatches = matches.filter(match => match.matchScore >= 40);
    console.log(`Found ${recommendedMatches.length} matches with score >= 40`);

    res.json({
      success: true,
      candidate: {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        preferredIndustries: candidate.preferredIndustries,
        preferredRoles: candidate.preferredRoles,
        preferredSkills: candidate.preferredSkills,
        location: candidate.location,
        experienceLevel: candidate.experienceLevel,
        jobType: candidate.jobType
      },
      matches: recommendedMatches,
      totalJobs: allJobs.length,
      matchedJobs: recommendedMatches.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== MATCHING FUNCTIONS ==========
function calculateMatchScore(candidate, job) {
  let score = 0;
  const maxScore = 100;

  // 1. Skill Match (50% weight)
  const skillMatch = calculateOverlap(candidate.preferredSkills, job.skills);
  score += skillMatch * 0.5 * maxScore;

  // 2. Role Match (20% weight)
  const roleMatch = candidate.preferredRoles.some(role => 
    job.role.toLowerCase().includes(role.toLowerCase()) ||
    role.toLowerCase().includes(job.role.toLowerCase())
  ) ? 1 : 0;
  score += roleMatch * 0.2 * maxScore;

  // 3. Industry Match (15% weight)
  const industryMatch = candidate.preferredIndustries.some(industry => 
    job.industry.toLowerCase().includes(industry.toLowerCase()) ||
    industry.toLowerCase().includes(job.industry.toLowerCase())
  ) ? 1 : 0;
  score += industryMatch * 0.15 * maxScore;

  // 4. Experience Level Match (10% weight)
  const expMatch = candidate.experienceLevel === job.experienceLevel ? 1 : 0.5;
  score += expMatch * 0.1 * maxScore;

  // 5. Location Match (5% weight)
  let locationMatch = 0;
  if (candidate.location && job.location) {
    const candidateLoc = candidate.location.toLowerCase();
    const jobLoc = job.location.toLowerCase();
    
    if (candidateLoc.includes('remote') || jobLoc.includes('remote')) {
      locationMatch = 1;
    } else if (candidateLoc.includes(jobLoc) || jobLoc.includes(candidateLoc)) {
      locationMatch = 1;
    } else {
      // Check for city/state match
      const candidateCity = candidateLoc.split(',')[0]?.trim();
      const jobCity = jobLoc.split(',')[0]?.trim();
      if (candidateCity && jobCity && candidateCity === jobCity) {
        locationMatch = 0.5;
      }
    }
  }
  score += locationMatch * 0.05 * maxScore;

  return Math.min(Math.round(score), 100);
}

function calculateOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;
  
  const set1 = new Set(arr1.map(item => item.toLowerCase().trim()));
  const set2 = new Set(arr2.map(item => item.toLowerCase().trim()));
  
  let overlap = 0;
  for (const item of set1) {
    if (set2.has(item)) overlap++;
  }
  
  return overlap / Math.max(set1.size, set2.size);
}

function findMatchedSkills(candidateSkills, jobSkills) {
  if (!candidateSkills || !jobSkills) return [];
  
  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase().trim());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase().trim());
  
  const matched = [];
  for (let i = 0; i < candidateSkills.length; i++) {
    if (jobSkillsLower.includes(candidateSkillsLower[i])) {
      matched.push(candidateSkills[i]);
    }
  }
  return matched;
}
app.post('/api/scrape-jobs', async (req, res) => {
  try {
    const result = await scrapeJobs();
    if (result.success) {
      res.json({ 
        success: true, 
        message: `Successfully scraped ${result.count} jobs`,
        count: result.count 
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   http://localhost:${PORT}/api/candidates`);
  console.log(`   http://localhost:${PORT}/api/jobs`);
  console.log(`   http://localhost:${PORT}/api/candidates/:id/matches`);
  console.log(`   http://localhost:${PORT}/ (Health check)`);
});