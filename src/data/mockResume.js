// Comprehensive Mock Resume Dataset & Parser

export const SAMPLE_RESUMES = {
  fresher_dev: {
    id: "res_fresher_alex",
    name: "Alex Chen",
    email: "alex.chen@techmail.io",
    phone: "+1 (555) 234-5678",
    title: "Frontend & Full Stack Developer (Fresher)",
    college: "Stanford University of Technology",
    degree: "B.S. in Computer Science",
    graduationYear: "2026",
    gpa: "3.85 / 4.0",
    atsScore: 88,
    atsStatus: "PASS",
    summary: "Motivated Computer Science graduate with strong hands-on experience in modern web technologies including React, JavaScript, Python, and Node.js. Built scalable web applications with clean architecture and responsive UI design.",
    skills: {
      languages: ["JavaScript (ES6+)", "Python", "HTML5", "CSS3", "SQL"],
      frameworks: ["React.js", "Node.js", "Express.js", "Tailwind CSS"],
      tools: ["Git & GitHub", "Vite", "Postman", "VS Code", "Figma"],
      concepts: ["RESTful APIs", "State Management", "Data Structures", "Component Lifecycle"]
    },
    projects: [
      {
        title: "AI Interview Assistant Platform",
        techStack: ["React.js", "Python", "Tailwind CSS", "Web Speech API"],
        duration: "Jan 2026 - Present",
        description: "Engineered an intelligent mock interview platform with real-time speech processing, resume-grounded question evaluation, and automated performance analytics.",
        responsibilities: [
          "Developed responsive React frontend with fluid glassmorphic UI and animated interviewer avatar",
          "Integrated speech-to-text recognition and text-to-speech audio feedback loops",
          "Structured scoring algorithms to evaluate answer relevance and technical depth"
        ]
      },
      {
        title: "Real-Time Cloud Weather Dashboard",
        techStack: ["JavaScript", "OpenWeatherMap API", "Chart.js", "CSS Grid"],
        duration: "Aug 2025 - Oct 2025",
        description: "Built an interactive meteorological dashboard showing 7-day predictive forecasts, humidity trends, and geolocation weather radar.",
        responsibilities: [
          "Implemented asynchronous API fetching with custom error boundaries and caching",
          "Designed dynamic charts for temperature gradients and atmospheric pressure"
        ]
      }
    ],
    internships: [
      {
        company: "Apex Innovations Lab",
        role: "Frontend Developer Intern",
        duration: "Jun 2025 - Aug 2025",
        location: "Remote",
        responsibilities: [
          "Refactored 14 core UI components to React 18, improving page load speed by 28%",
          "Collaborated in Agile sprints with senior engineers to implement user onboarding modals"
        ]
      }
    ],
    certifications: [
      "AWS Certified Cloud Practitioner (2025)",
      "Meta Front-End Developer Professional Certificate (Coursera 2025)"
    ],
    achievements: [
      "1st Place in University 48-Hour Hackathon 2025 (Automated Study Planner)",
      "Dean's List for Academic Excellence (6 Consecutive Semesters)"
    ]
  },

  experienced_lead: {
    id: "res_lead_sarah",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@devpro.com",
    phone: "+1 (555) 987-6543",
    title: "Senior Full Stack Engineer & Tech Lead",
    college: "Georgia Institute of Technology",
    degree: "M.S. in Software Engineering",
    graduationYear: "2021",
    gpa: "3.92 / 4.0",
    atsScore: 94,
    atsStatus: "PASS",
    summary: "Senior Full Stack Engineer with 4+ years of expertise architecting high-throughput distributed microservices, leading cross-functional teams of 6 engineers, and scaling payment pipelines processing $12M+ in monthly transactions.",
    skills: {
      languages: ["TypeScript", "JavaScript", "Go", "Python", "SQL"],
      frameworks: ["React.js", "Next.js", "Node.js", "NestJS", "GraphQL", "Tailwind CSS"],
      tools: ["Docker", "Kubernetes", "AWS (ECS, Lambda, S3, RDS)", "Redis", "Kafka", "PostgreSQL"],
      concepts: ["Microservices Architecture", "CI/CD Pipelines", "System Design", "Database Sharding", "Agile Leadership"]
    },
    workExperience: [
      {
        company: "Nexus Financial Technologies",
        role: "Lead Full Stack Engineer",
        duration: "Jan 2023 - Present",
        location: "San Francisco, CA",
        responsibilities: [
          "Spearheaded the migration of legacy monolith to event-driven microservices architecture using Go, Kafka, and React",
          "Led a team of 6 software engineers through sprint planning, architectural reviews, and mentorship",
          "Reduced end-to-end API response latency by 45% utilizing Redis multi-tier caching and database indexing"
        ]
      },
      {
        company: "Vanguard Cloud Systems",
        role: "Software Engineer II",
        duration: "Jun 2021 - Dec 2022",
        location: "Austin, TX",
        responsibilities: [
          "Built real-time telemetry dashboards in React and TypeScript handling 50k concurrent WebSocket connections",
          "Automated infrastructure deployments with Terraform and GitHub Actions across AWS multi-region clusters"
        ]
      }
    ],
    projects: [
      {
        title: "Enterprise Global Multi-Currency Payment Gateway",
        techStack: ["NestJS", "TypeScript", "PostgreSQL", "Stripe API", "Docker"],
        duration: "2023 - 2024",
        description: "Engineered PCI-DSS compliant checkout microservice supporting 30+ fiat currencies and instant webhook settlements with zero downtime.",
        responsibilities: [
          "Designed idempotent webhook processing mechanisms preventing double-spending transactions",
          "Implemented comprehensive rate limiting and fraud detection algorithms"
        ]
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect – Professional (2024)",
      "Certified Kubernetes Application Developer (CKAD) (2023)"
    ],
    achievements: [
      "Engineered high-scale transaction engine that received Annual Engineering Innovation Award 2024",
      "Published technical whitepaper on 'Zero-Downtime Microservice Database Migrations'"
    ]
  },

  data_analyst_fresher: {
    id: "res_da_rohan",
    name: "Rohan Verma",
    email: "rohan.verma@analytics.net",
    phone: "+1 (555) 345-6789",
    title: "Data Analyst & ML Specialist (Fresher)",
    college: "University of Illinois Urbana-Champaign",
    degree: "B.S. in Data Science & Statistics",
    graduationYear: "2025",
    gpa: "3.78 / 4.0",
    atsScore: 82,
    atsStatus: "PASS",
    summary: "Detail-oriented Data Analyst skilled in exploratory data analysis, statistical modeling, machine learning algorithms, and SQL data warehousing. Experienced in building actionable visual dashboards in Tableau and Python.",
    skills: {
      languages: ["Python", "R", "SQL", "PostgreSQL"],
      frameworks: ["Pandas", "NumPy", "Scikit-Learn", "Matplotlib", "Seaborn", "TensorFlow Basics"],
      tools: ["Tableau", "Power BI", "Jupyter Notebook", "Git", "Google BigQuery"],
      concepts: ["Exploratory Data Analysis", "Hypothesis Testing", "Regression & Classification", "Feature Engineering"]
    },
    projects: [
      {
        title: "Predictive Telecom Customer Churn Model",
        techStack: ["Python", "Pandas", "Scikit-Learn", "Random Forest", "Tableau"],
        duration: "Aug 2025 - Nov 2025",
        description: "Built end-to-end ML classification pipeline predicting customer churn with 89.4% ROC-AUC accuracy on 100,000+ subscriber records.",
        responsibilities: [
          "Cleaned and preprocessed raw telecom data, engineering 12 novel behavioural features",
          "Tuned hyper-parameters using GridSearchCV to optimize recall and precision metrics",
          "Built executive Tableau dashboard identifying high-risk retention cohorts"
        ]
      }
    ],
    certifications: [
      "Google Advanced Data Analytics Professional Certificate (2025)",
      "SQL for Data Science Specialization - UC Davis (2024)"
    ],
    achievements: [
      "Kaggle Competition Top 10% Silver Medal in Housing Price Regression",
      "Lead Statistician in University Student Research Symposium 2025"
    ]
  },

  failing_ats_sample: {
    id: "res_fail_sample",
    name: "Jordan Sparks",
    email: "jordansparks99@email.com",
    phone: "1234567890",
    title: "Developer / Creative Freelancer",
    college: "Local College",
    degree: "Degree",
    graduationYear: "2024",
    atsScore: 48,
    atsStatus: "FAIL",
    summary: "I do coding, graphics, design, some video stuff and websites whenever needed.",
    skills: {
      languages: ["Coding"],
      frameworks: [],
      tools: ["Photoshop", "Notepad"],
      concepts: []
    },
    projects: [
      {
        title: "My Personal Website",
        techStack: ["HTML"],
        duration: "2024",
        description: "Made a website with some photos and links.",
        responsibilities: ["Wrote basic code"]
      }
    ],
    atsIssues: [
      "Critical: Missing quantifiable achievements and technical metrics",
      "Critical: Incomplete education section (missing accredited degree / field specifications)",
      "Formatting: Missing standardized industry keyword tags (e.g. React, Node, SQL, Git)",
      "Structure: Non-standard section hierarchy detected (poor parser readability)",
      "Experience: Responsibilities lack active action verbs (e.g. Architected, Engineered, Implemented)"
    ]
  }
};
