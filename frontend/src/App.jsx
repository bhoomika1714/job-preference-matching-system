import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
const [scraping, setScraping] = useState(false);
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      console.log('Fetching candidates from API...');
      
      // Try to fetch from API first
      try {
        const response = await axios.get(`${API_BASE}/candidates`, {
          timeout: 5000 // 5 second timeout
        });
        
        console.log('API Response:', response.data);
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setCandidates(response.data.data);
          handleCandidateSelect(response.data.data[0]._id);
          return;
        } else {
          console.warn('API returned empty or invalid data');
        }
      } catch (apiError) {
        console.warn('API call failed, using fallback data:', apiError.message);
        setUsingFallback(true);
      }
      
      // Use fallback data if API fails
      console.log('Loading fallback candidate data...');
      const fallbackCandidates = getFallbackCandidates();
      setCandidates(fallbackCandidates);
      handleCandidateSelect(fallbackCandidates[0]._id);
      
    } catch (error) {
      console.error('Error in fetchCandidates:', error);
      setError(`Failed to load candidates. ${error.message}`);
      setUsingFallback(true);
      
      // Still load fallback data even on error
      const fallbackCandidates = getFallbackCandidates();
      setCandidates(fallbackCandidates);
      handleCandidateSelect(fallbackCandidates[0]._id);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
    setLoadingMatches(true);
    setError(null);
    
    try {
      console.log(`Fetching matches for candidate: ${candidateId}`);
      
      // Try API first
      try {
        const response = await axios.get(`${API_BASE}/candidates/${candidateId}/matches`, {
          timeout: 5000
        });
        
        if (response.data.success) {
          setSelectedCandidate(response.data.candidate);
          setMatches(response.data.matches || []);
          return;
        }
      } catch (apiError) {
        console.warn('Matches API failed, using fallback:', apiError.message);
      }
      
      // Use fallback matches if API fails
      const candidate = candidates.find(c => c._id === candidateId);
      if (candidate) {
        setSelectedCandidate(candidate);
        const fallbackMatches = getFallbackMatches(candidate);
        setMatches(fallbackMatches);
      }
      
    } catch (error) {
      console.error('Error in handleCandidateSelect:', error);
      setError(`Failed to load matches. ${error.message}`);
      
      // Still show something
      const candidate = candidates.find(c => c._id === candidateId);
      if (candidate) {
        setSelectedCandidate(candidate);
        const fallbackMatches = getFallbackMatches(candidate);
        setMatches(fallbackMatches);
      }
    } finally {
      setLoadingMatches(false);
    }
  };

  // Fallback data functions
  const getFallbackCandidates = () => [
    {
      _id: '1',
      name: 'Alex Chen',
      email: 'alex@example.com',
      preferredIndustries: ['IT', 'SaaS', 'Technology'],
      preferredRoles: ['Backend Developer', 'Full Stack Developer', 'Software Engineer'],
      preferredSkills: ['Node.js', 'TypeScript', 'JavaScript', 'PostgreSQL', 'AWS', 'Docker', 'API Design'],
      location: 'Remote',
      experienceLevel: 'mid',
      jobType: 'full-time',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      preferredIndustries: ['Marketing', 'E-commerce', 'Digital Media'],
      preferredRoles: ['Marketing Manager', 'Growth Hacker', 'Digital Marketer'],
      preferredSkills: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'Email Marketing', 'PPC'],
      location: 'New York, NY',
      experienceLevel: 'senior',
      jobType: 'full-time',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Taylor Smith',
      email: 'taylor@example.com',
      preferredIndustries: ['Finance', 'Fintech', 'Banking'],
      preferredRoles: ['Data Analyst', 'Financial Analyst', 'Business Analyst'],
      preferredSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Data Visualization'],
      location: 'Chicago, IL',
      experienceLevel: 'entry',
      jobType: 'full-time',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const getFallbackMatches = (candidate) => {
    // Generate matches based on candidate skills
    const allJobs = [
      {
        _id: 'job1',
        title: 'Backend Developer (Node.js)',
        company: 'TechCorp Inc.',
        industry: 'IT',
        role: 'Backend Developer',
        skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs', 'Microservices'],
        description: 'Join our backend team to build scalable microservices using Node.js and TypeScript. Experience with cloud platforms and containerization preferred.',
        experienceLevel: 'mid',
        location: 'Remote',
        source: 'LinkedIn',
        jobUrl: 'https://linkedin.com/jobs/view/12345',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'job2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        industry: 'SaaS',
        role: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'JavaScript', 'TypeScript', 'GraphQL'],
        description: 'Full stack role for a fast-growing SaaS company. You will work on both frontend and backend features in an agile environment.',
        experienceLevel: 'mid',
        location: 'San Francisco, CA',
        source: 'Indeed',
        jobUrl: 'https://indeed.com/jobs/67890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'job3',
        title: 'Senior Marketing Manager',
        company: 'BrandUp Marketing',
        industry: 'Marketing',
        role: 'Marketing Manager',
        skills: ['SEO', 'Content Strategy', 'Team Leadership', 'Google Analytics', 'Campaign Management', 'Marketing Automation'],
        description: 'Lead our marketing team and develop strategic campaigns for enterprise clients. Manage a team of 5+ marketers and report directly to CMO.',
        experienceLevel: 'senior',
        location: 'New York, NY',
        source: 'LinkedIn',
        jobUrl: 'https://linkedin.com/jobs/view/54321',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'job4',
        title: 'Digital Marketing Specialist',
        company: 'EcomGrow',
        industry: 'E-commerce',
        role: 'Digital Marketer',
        skills: ['Social Media', 'Email Marketing', 'Google Ads', 'Content Creation', 'Analytics', 'Conversion Optimization'],
        description: 'Drive customer acquisition through digital channels for our e-commerce platform. Manage PPC campaigns, social media, and email marketing.',
        experienceLevel: 'mid',
        location: 'Remote',
        source: 'Indeed',
        jobUrl: 'https://indeed.com/jobs/98765',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'job5',
        title: 'Data Analyst',
        company: 'FinancePro',
        industry: 'Finance',
        role: 'Data Analyst',
        skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Visualization', 'Statistics', 'Machine Learning'],
        description: 'Analyze financial data and create reports to support business decisions. Build dashboards and predictive models for financial forecasting.',
        experienceLevel: 'entry',
        location: 'Chicago, IL',
        source: 'LinkedIn',
        jobUrl: 'https://linkedin.com/jobs/view/13579',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'job6',
        title: 'DevOps Engineer',
        company: 'CloudSystems',
        industry: 'IT',
        role: 'DevOps Engineer',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Infrastructure', 'Terraform'],
        description: 'Manage our cloud infrastructure and implement DevOps best practices. Automate deployments and ensure system reliability and scalability.',
        experienceLevel: 'senior',
        location: 'Remote',
        source: 'RemoteOK',
        jobUrl: 'https://remoteok.io/remote-jobs/24680',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Calculate match scores for each job
    return allJobs.map(job => {
      const score = calculateMatchScore(candidate, job);
      const matchedSkills = findMatchedSkills(candidate.preferredSkills, job.skills);
      
      return {
        ...job,
        matchScore: score,
        matchedSkills: matchedSkills,
        matchPercentage: `${score}%`
      };
    })
    .filter(job => job.matchScore >= 40) // Only show matches >= 40%
    .sort((a, b) => b.matchScore - a.matchScore); // Sort by highest score
  };

  // Matching logic functions
  const calculateMatchScore = (candidate, job) => {
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
      }
    }
    score += locationMatch * 0.05 * maxScore;

    return Math.min(Math.round(score), 100);
  };

  const calculateOverlap = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;
    
    const set1 = new Set(arr1.map(item => item.toLowerCase().trim()));
    const set2 = new Set(arr2.map(item => item.toLowerCase().trim()));
    
    let overlap = 0;
    for (const item of set1) {
      if (set2.has(item)) overlap++;
    }
    
    return overlap / Math.max(set1.size, set2.size);
  };

  const findMatchedSkills = (candidateSkills, jobSkills) => {
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
  };

  // Loading component
  const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#64748b' }}>{text}</p>
    </div>
  );

  // Error display component
  const ErrorMessage = ({ message, onRetry, isWarning = false }) => (
    <div style={{ 
      backgroundColor: isWarning ? '#fef3c7' : '#fee2e2', 
      border: `1px solid ${isWarning ? '#f59e0b' : '#f87171'}`, 
      borderRadius: '0.5rem', 
      padding: '1rem',
      marginBottom: '1rem',
      color: isWarning ? '#92400e' : '#991b1b'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>
          {isWarning ? '⚠️' : '❌'}
        </div>
        <div style={{ flex: 1 }}>
          <strong>{isWarning ? 'Note:' : 'Error:'}</strong> {message}
          {onRetry && (
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={onRetry}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isWarning ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                {isWarning ? 'Try API Again' : 'Retry'}
              </button>
              <button 
                onClick={() => setError(null)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Job match card component
  const JobMatchCard = ({ job }) => {
    const getScoreColor = (score) => {
      if (score >= 80) return { bg: '#dcfce7', text: '#166534', label: 'Excellent Match' };
      if (score >= 60) return { bg: '#dbeafe', text: '#1e40af', label: 'Good Match' };
      return { bg: '#fef3c7', text: '#92400e', label: 'Fair Match' };
    };

    const color = getScoreColor(job.matchScore);

    return (
      <div className="job-card">
        <div className="job-header">
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
              {job.company} • {job.industry}
            </p>
          </div>
          <div className="match-badge" style={{
            backgroundColor: color.bg,
            color: color.text,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}>
            {job.matchScore}% Match
          </div>
        </div>

        <div className="job-meta">
          <span>📍 {job.location || 'Remote'}</span>
          <span>📊 {job.experienceLevel || 'Not specified'}</span>
          <span>🔗 {job.source}</span>
        </div>

        <p className="job-description">
          {job.description || 'No description available.'}
        </p>

        {/* Skills */}
        <div className="skills-container">
          <div className="skills-label">Required Skills:</div>
          <div className="skills-list">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className={`skill-tag ${job.matchedSkills?.includes(skill) ? 'matched' : ''}`}
              >
                {skill}
                {job.matchedSkills?.includes(skill) && ' ✓'}
              </span>
            ))}
          </div>
        </div>

        {/* Matched Skills Info */}
        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div style={{ 
            color: '#166534', 
            fontSize: '0.875rem', 
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>✅</span>
            {job.matchedSkills.length} of {job.skills.length} skills match candidate's profile
          </div>
        )}

        {/* Footer */}
        <div className="job-footer">
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Match strength: <strong>{getScoreColor(job.matchScore).label}</strong>
          </div>
          <button
            onClick={() => window.open(job.jobUrl, '_blank')}
            className="btn btn-primary"
          >
            View Job →
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Loading candidates..." />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
            🔍 Job Matcher
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Intelligent job matching system for recruiters
            {usingFallback && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>(Using demo data)</span>}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content container">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchCandidates}
            isWarning={usingFallback}
          />
        )}
        
        {usingFallback && !error && (
          <ErrorMessage 
            message="Backend API is not available. Showing demo data instead. Make sure the backend server is running on http://localhost:3000 for real data."
            onRetry={fetchCandidates}
            isWarning={true}
          />
        )}

        <div className="grid">
          {/* Left Column - Candidates */}
          <div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>
                👥 Candidates ({candidates.length})
              </h2>
              
              <div className="candidate-list">
                {candidates.map((candidate) => (
                  <button
                    key={candidate._id}
                    onClick={() => handleCandidateSelect(candidate._id)}
                    className={`candidate-item ${selectedCandidate?._id === candidate._id ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="candidate-name">{candidate.name}</div>
                        <div className="candidate-email">{candidate.email}</div>
                        <div className="candidate-tags">
                          <span className="tag">{candidate.experienceLevel || 'No level'}</span>
                          <span className="tag">{candidate.location || 'Remote'}</span>
                          <span className="tag">{candidate.preferredRoles?.[0] || 'Any role'}</span>
                        </div>
                      </div>
                      <span style={{ color: '#3b82f6' }}>→</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-box candidates">
                  <div className="stat-number">{candidates.length}</div>
                  <div className="stat-label">Candidates</div>
                </div>
                <div className="stat-box matches">
                  <div className="stat-number">{matches.length}</div>
                  <div className="stat-label">Matches</div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button 
                  onClick={fetchCandidates}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  ↻ Refresh Data
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>System Status</h3>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Backend API:</span>
                  <span style={{ color: usingFallback ? '#f59e0b' : '#10b981', fontWeight: '500' }}>
                    {usingFallback ? 'Offline (Demo Mode)' : 'Online'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Data Source:</span>
                  <span>{usingFallback ? 'Fallback Data' : 'Live Database'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Updated:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Matches */}
          <div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155' }}>
                  {selectedCandidate ? (
                    <>
                      ⭐ Matches for {selectedCandidate.name}
                    </>
                  ) : 'Select a candidate to view matches'}
                </h2>
                {selectedCandidate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Showing {matches.length} matches (≥40%)
                    </span>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <span style={{ color: '#10b981' }}>●</span> Excellent
                      <span style={{ marginLeft: '0.5rem', color: '#3b82f6' }}>●</span> Good
                      <span style={{ marginLeft: '0.5rem', color: '#f59e0b' }}>●</span> Fair
                    </div>
                  </div>
                )}
              </div>

              {loadingMatches ? (
                <LoadingSpinner text="Finding best matches..." />
              ) : selectedCandidate ? (
                matches.length > 0 ? (
                  <>
                    {/* Candidate Summary */}
                    <div style={{ 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '0.5rem', 
                      padding: '1rem', 
                      marginBottom: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{ fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                        Candidate Profile
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Industries: </span>
                          <span style={{ fontWeight: '500' }}>
                            {selectedCandidate.preferredIndustries?.join(', ') || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Roles: </span>
                          <span style={{ fontWeight: '500' }}>
                            {selectedCandidate.preferredRoles?.join(', ') || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Skills: </span>
                          <span style={{ fontWeight: '500' }}>
                            {selectedCandidate.preferredSkills?.slice(0, 5).join(', ') || 'Not specified'}
                            {selectedCandidate.preferredSkills?.length > 5 && '...'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Job Matches */}
                    <div>
                      {matches.map((job) => (
                        <JobMatchCard key={job._id} job={job} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                      No matches found
                    </h3>
                    <p style={{ color: '#94a3b8' }}>
                      No jobs match this candidate's profile with a score of 40% or higher.
                      Try adjusting candidate preferences or add more jobs.
                    </p>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                    Select a candidate
                  </h3>
                  <p style={{ color: '#94a3b8' }}>
                    Choose a candidate from the left panel to view their job matches.
                  </p>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: '500', color: '#475569', marginBottom: '1rem' }}>
                How Matching Works
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '1.25rem'
                  }}>
                    💻
                  </div>
                  <h4 style={{ fontWeight: '500', color: '#334155' }}>Skills Match</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>50% weight</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '1.25rem'
                  }}>
                    👔
                  </div>
                  <h4 style={{ fontWeight: '500', color: '#334155' }}>Role Match</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>20% weight</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '1.25rem'
                  }}>
                    🏢
                  </div>
                  <h4 style={{ fontWeight: '500', color: '#334155' }}>Industry Match</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>15% weight</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '1.25rem'
                  }}>
                    📍
                  </div>
                  <h4 style={{ fontWeight: '500', color: '#334155' }}>Location Match</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>15% weight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Job Matcher Assessment System • Built with React & Node.js • {new Date().getFullYear()}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Matching Algorithm: Weighted Scoring System • {usingFallback ? 'Demo Mode' : 'Live Mode'}
          </p>
        </div>
      </footer>
    </div>
  );
}




const handleScrapeJobs = async () => {
  setScraping(true);
  try {
    const response = await axios.post(`${API_BASE}/scrape-jobs`);
    if (response.data.success) {
      alert(`Successfully added ${response.data.count} new jobs!`);
      // Refresh jobs
      if (selectedCandidate) {
        handleCandidateSelect(selectedCandidate._id);
      }
    } else {
      alert(`Scraping failed: ${response.data.error}`);
    }
  } catch (error) {
    alert(`Error scraping jobs: ${error.message}`);
  } finally {
    setScraping(false);
  }
};

<div style={{ marginTop: '1rem', textAlign: 'center' }}>
  <button 
    onClick={handleScrapeJobs}
    disabled={scraping || usingFallback}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: scraping ? '#6b7280' : '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: scraping ? 'not-allowed' : 'pointer',
      width: '100%',
      opacity: usingFallback ? 0.5 : 1
    }}
  >
    {scraping ? 'Scraping...' : '🔄 Scrape New Jobs'}
  </button>
  {usingFallback && (
    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
      (Requires backend connection)
    </p>
  )}
</div>

export default App;