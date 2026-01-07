import React from 'react';

const JobMatchCard = ({ job }) => {
  // Determine color based on match score
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return 'fas fa-fire text-green-600';
    if (score >= 60) return 'fas fa-thumbs-up text-blue-600';
    return 'fas fa-check text-yellow-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-700 mt-1">{job.company} • {job.industry}</p>
            </div>
            <div className={`px-3 py-1 rounded-full ${getScoreColor(job.matchScore)} font-medium flex items-center`}>
              <i className={`${getScoreIcon(job.matchScore)} mr-2`}></i>
              {job.matchScore}% Match
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <div className="flex items-center mr-4">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {job.location || 'Remote'}
              </div>
              <div className="flex items-center">
                <i className="fas fa-chart-line mr-2"></i>
                {job.experienceLevel || 'Not specified'}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

            {/* Skills */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full ${
                      job.matchedSkills?.includes(skill)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {skill}
                    {job.matchedSkills?.includes(skill) && (
                      <i className="fas fa-check ml-1 text-green-600"></i>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Skills Indicator */}
            {job.matchedSkills && job.matchedSkills.length > 0 && (
              <div className="mt-3 text-sm text-green-700">
                <i className="fas fa-check-circle mr-2"></i>
                {job.matchedSkills.length} skills match candidate's profile
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-500">
          <i className="fas fa-external-link-alt mr-2"></i>
          Source: {job.source}
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button
            onClick={() => window.open(job.jobUrl, '_blank')}
            className="btn-primary text-sm"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            View Job
          </button>
          <button className="btn-secondary text-sm">
            <i className="far fa-bookmark mr-2"></i>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobMatchCard;