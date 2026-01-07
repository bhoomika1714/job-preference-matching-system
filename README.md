# **Job Preference Matching System**

A full-stack application that matches job candidates with job listings based on their preferences, skills, and experience. Features a professional dashboard for managing candidates, jobs, and viewing intelligent matches.

##  Features

### Core Features
- **Candidate Management**: Create, view, and manage candidate profiles with preferences
- **Job Management**: Add, scrape, and manage job listings from various sources
- **Intelligent Matching**: Rule-based matching algorithm with weighted scoring
- **Real-time Dashboard**: Monitor system statistics and activity
- **Admin Interface**: View detailed match breakdowns and analytics

### **Technical Features**
- **MongoDB Database**: NoSQL database for flexible data storage
- **Express.js Backend**: RESTful API with MVC architecture
- **Professional Frontend**: Clean, responsive UI with smooth navigation
- **Job Scraping**: Ethical web scraping from job portals
- **Real-time Updates**: Live data synchronization

##  Quick Start

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### **Installation**

1. **Clone and navigate to project:**
```bash
git clone <repository-url>
cd job-preference-matcher
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. **Start MongoDB:**
```bash
# On Windows (PowerShell as Admin):
net start MongoDB

# Or run MongoDB daemon:
mongod
```

5. **Seed the database:**
```bash
npm run seed
```

6. **Start the application:**
```bash
npm run dev
```

7. **Open your browser:**
```
http://localhost:3000
```

## **🛠️ Technology Stack**

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Scraping**: Axios + Cheerio
- **Validation**: Express Validator

### **Frontend**
- **UI**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Routing**: Client-side navigation

### **Development Tools**
- **Hot Reload**: Nodemon
- **Environment**: dotenv
- **API Testing**: Built-in endpoints

## **📁 Project Structure**

```
job-preference-matcher/
├── src/
│   ├── app.js                 # Express application entry point
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── Candidate.js       # Candidate schema
│   │   └── Job.js            # Job schema
│   ├── controllers/
│   │   ├── candidateController.js
│   │   ├── jobController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── matcherService.js  # Matching algorithm
│   │   └── scraperService.js  # Job scraping
│   ├── routes/
│   │   ├── candidateRoutes.js
│   │   ├── jobRoutes.js
│   │   └── adminRoutes.js
│   └── seed.js               # Database seeding
├── public/
│   ├── index.html            # Dashboard
│   ├── candidates.html       # Candidates page
│   ├── jobs.html            # Jobs page
│   ├── matches.html         # Matches page
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── utils.js         # Shared utilities
│   │   ├── dashboard.js     # Dashboard logic
│   │   ├── candidates.js    # Candidates page logic
│   │   ├── jobs.js         # Jobs page logic
│   │   └── matches.js      # Matches page logic
│   └── components/
│       └── navbar.html      # Navigation component
├── .env                      # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md               # This file
```

##  API Endpoints

### **Candidates**
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate by ID

### **Jobs**
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `POST /api/jobs/scrape` - Scrape jobs from portals

### **Admin & Matching**
- `GET /api/admin/match/:candidateId` - Get matches for candidate
- `GET /api/admin/breakdown/:candidateId/:jobId` - Get match breakdown

### **System**
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

##  Matching Algorithm

### **Weighted Scoring System**
| Factor | Weight | Description |
|--------|--------|-------------|
| Skills Match | 40% | Overlap between candidate skills and job requirements |
| Role Match | 25% | Alignment between preferred roles and job title |
| Industry Match | 15% | Match between preferred and job industries |
| Location Match | 10% | Geographic preference alignment |
| Experience Match | 10% | Experience level compatibility |

### **Scoring Formula**
```
Total Score = (Skill Match × 0.4) + (Role Match × 0.25) + 
              (Industry Match × 0.15) + (Location Match × 0.1) + 
              (Experience Match × 0.1)
```

### **Qualification Criteria**
- Minimum score: 50%
- At least one skill match required
- Experience level compatibility checked

## ** Job Scraping**

### **Approach**
- **Ethical Scraping**: Limited requests with proper headers
- **Multiple Sources**: Indeed, LinkedIn, Internshala support
- **Mock Mode**: Safe testing with sample data
- **Skill Extraction**: Automated from job descriptions

### **Fields Extracted**
- Job title, company, location
- Required skills (extracted from description)
- Experience level, industry
- Job URL and source

## **💡 Key Features Implementation**

### **Real-time Data Sync**
- Global state management across pages
- LocalStorage for persistence
- Custom events for updates
- Cross-tab synchronization

### **Professional UI**
- Responsive design for all devices
- Smooth page transitions
- Loading states and toast notifications
- Accessible navigation with breadcrumbs

### **Error Handling**
- Graceful degradation
- User-friendly error messages
- API status monitoring
- Fallback mechanisms

## ** Development Scripts**

```bash
npm run dev      # Start development server with hot reload
npm run seed     # Seed database with sample data
npm run start    # Start production server
npm test         # Run tests (if available)
```

## ** Environment Variables**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/job_matcher
NODE_ENV=development
```

##  Database Schemas

### **Candidate Schema**
```javascript
{
  name: String,
  email: String,
  preferredSkills: [String],
  preferredIndustries: [String],
  preferredRoles: [String],
  preferredLocations: [String],
  experienceLevel: String, // Intern, Junior, Mid, Senior
  jobType: String, // Full-time, Part-time, Internship, Contract
  createdAt: Date,
  updatedAt: Date
}
```

### **Job Schema**
```javascript
{
  title: String,
  company: String,
  industry: String,
  requiredSkills: [String],
  description: String,
  experienceLevel: String,
  location: String,
  source: String, // LinkedIn, Indeed, Internshala, Other
  jobUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

##  UI Components

### **Dashboard**
- System statistics cards
- Recent activity feed
- Quick action buttons
- Real-time API status

### **Candidates Page**
- Tabular candidate list
- Add/edit candidate form
- Search and filtering
- Action buttons (view matches, edit, delete)

### **Jobs Page**
- Job listings table
- Scraping controls
- Source filtering
- Job details modal

### **Matches Page**
- Match cards with scores
- Detailed breakdown modal
- Analytics charts
- Advanced filtering

## ** Testing the Application**

1. **Initial Setup**
   ```bash
   npm run seed
   npm run dev
   ```

2. **Basic Flow Test**
   - Add a candidate via Candidates page
   - Add jobs via Jobs page (or use scraping)
   - View matches in Matches page
   - Check match breakdown details

3. **API Testing**
   ```bash
   # Health check
   curl http://localhost:3000/api/health

   # Get candidates
   curl http://localhost:3000/api/candidates

   # Get jobs
   curl http://localhost:3000/api/jobs
   ```




