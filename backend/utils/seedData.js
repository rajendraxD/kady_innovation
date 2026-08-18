import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Meeting } from '../models/Meeting.js';
import { Notification } from '../models/Notification.js';
import { Setting } from '../models/Setting.js';

export const seedInitialData = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@email.com' });
    if (!adminExists) {
      console.log('[Seed] Seeding default Admin user: admin@email.com / admin@123 ...');
      await User.create({
        name: 'System Admin',
        email: 'admin@email.com',
        password: 'admin@123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('[Seed] Seeding sample jobs and talent pool ...');

      const jobs = await Job.insertMany([
        {
          title: 'Senior Full Stack Engineer',
          department: 'Engineering',
          location: 'Bengaluru / Remote',
          workplaceType: 'Remote',
          employmentType: 'Full-time',
          experienceLevel: 'Senior',
          salaryMin: 2200000,
          salaryMax: 3000000,
          currency: 'INR',
          description: 'We are seeking a Senior Full Stack Engineer to lead the development of our high-scale cloud services and responsive web applications.',
          responsibilities: [
            'Architect, build, and deploy resilient web apps using React, Node.js, and MongoDB.',
            'Collaborate with product designers and engineering leadership to define technical roadmap.',
            'Mentor junior developers and lead code review processes.'
          ],
          requirements: [
            '5+ years of production experience in React, Node.js, and Modern Javascript.',
            'Strong understanding of REST APIs, database indexing, and microservices.',
            'Experience with AWS, Docker, and CI/CD pipelines.'
          ],
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
          vacancies: 3,
          status: 'active',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          applicantsCount: 5
        },
        {
          title: 'Lead Frontend Architect',
          department: 'Engineering',
          location: 'Gurugram / Hybrid',
          workplaceType: 'Hybrid',
          employmentType: 'Full-time',
          experienceLevel: 'Lead',
          salaryMin: 3200000,
          salaryMax: 4200000,
          currency: 'INR',
          description: 'Drive the next evolution of our user interfaces with cutting-edge React 19 design systems and micro-frontends.',
          responsibilities: [
            'Design and maintain our global design system component library.',
            'Ensure sub-second page performance, Core Web Vitals excellence, and WCAG AA accessibility.',
            'Establish state management best practices across multi-tenant frontend modules.'
          ],
          requirements: [
            '7+ years of deep frontend engineering experience.',
            'Mastery of React, Tailwind CSS, Vite, Redux Toolkit, and web performance profiling.',
            'Demonstrated track record of delivering enterprise-grade design systems.'
          ],
          skills: ['React', 'Tailwind CSS', 'Redux', 'Vite', 'Next.js', 'TypeScript', 'Web Performance'],
          vacancies: 2,
          status: 'active',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          applicantsCount: 4
        },
        {
          title: 'AI & Machine Learning Engineer',
          department: 'Data & AI',
          location: 'Hyderabad / Remote',
          workplaceType: 'Remote',
          employmentType: 'Full-time',
          experienceLevel: 'Senior',
          salaryMin: 2800000,
          salaryMax: 3800000,
          currency: 'INR',
          description: 'Build predictive recruiting models, intelligent resume matching pipelines, and LLM-powered HR assistants.',
          responsibilities: [
            'Fine-tune open-source LLMs and implement semantic embedding search pipelines.',
            'Integrate RAG (Retrieval-Augmented Generation) architectures for automated candidate assessment.',
            'Deploy scalable inference APIs with low latency.'
          ],
          requirements: [
            '4+ years in machine learning, NLP, and vector databases.',
            'Proficiency in Python, PyTorch, LangChain, and Node.js backend integration.',
            'Solid grasp of vector similarity search and transformer architectures.'
          ],
          skills: ['Python', 'LLMs', 'LangChain', 'FastAPI', 'PyTorch', 'Vector DB', 'NLP'],
          vacancies: 2,
          status: 'active',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          applicantsCount: 3
        },
        {
          title: 'Senior Product Designer (UI/UX)',
          department: 'Product & Design',
          location: 'Mumbai / Remote',
          workplaceType: 'Remote',
          employmentType: 'Full-time',
          experienceLevel: 'Mid-level',
          salaryMin: 1800000,
          salaryMax: 2600000,
          currency: 'INR',
          description: 'Craft intuitive candidate and recruiter journeys across desktop, tablet, and mobile platforms.',
          responsibilities: [
            'Conduct user interviews and translate complex recruiter workflows into clean UI.',
            'Build interactive prototypes in Figma with pixel-perfect design token specs.',
            'Collaborate daily with frontend engineers for seamless implementation.'
          ],
          requirements: [
            '4+ years of UI/UX design experience for SaaS/enterprise tools.',
            'Proficiency in Figma, design systems, and rapid prototyping.',
            'Deep empathy for user workflows and accessibility standards.'
          ],
          skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'User Research', 'Wireframing'],
          vacancies: 1,
          status: 'active',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          applicantsCount: 2
        }
      ]);

      // Seed Applications
      const fullStackJob = jobs[0];
      const frontendJob = jobs[1];
      const aiJob = jobs[2];

      const applications = await Application.insertMany([
        {
          applicationNumber: 'APP-2026-1001',
          jobId: fullStackJob._id,
          jobTitle: fullStackJob.title,
          department: fullStackJob.department,
          personalInfo: {
            fullName: 'Alexander Wright',
            email: 'alex.wright@example.com',
            phone: '+1 (555) 234-5678',
            city: 'San Francisco',
            country: 'USA',
            portfolioUrl: 'https://alexwright.dev',
            linkedinUrl: 'https://linkedin.com/in/alexwright-dev',
            githubUrl: 'https://github.com/alexwright'
          },
          experience: {
            totalYears: 6,
            currentCompany: 'CloudScale Tech',
            currentDesignation: 'Senior Full Stack Developer',
            noticePeriodDays: 15,
            currentCtc: 2000000,
            expectedCtc: 2600000
          },
          education: {
            highestDegree: "Bachelor's Degree",
            fieldOfStudy: 'Computer Science',
            institution: 'IIT Bombay',
            graduationYear: 2020,
            grade: '8.8 CGPA'
          },
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
          resumeUrl: 'https://example.com/resumes/alex_wright.pdf',
          resumeFileName: 'Alex_Wright_Resume_2026.pdf',
          coverLetter: 'I am excited to apply for the Senior Full Stack role. I have spent the last 6 years scaling React and Node.js microservices.',
          stage: 'technical_round',
          matchScore: 94,
          hrNotes: [
            {
              note: 'Cleared preliminary screening with flying colors. Strong system design fundamentals.',
              author: 'HR Lead',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
          ],
          scorecard: {
            technical: 4.8,
            communication: 4.5,
            problemSolving: 4.9,
            cultureFit: 4.7,
            overall: 4.7,
            recommendation: 'Strong Hire',
            feedbackText: 'Superb architecture understanding and clean code demonstration.'
          },
          isDeleted: false
        },
        {
          applicationNumber: 'APP-2026-1002',
          jobId: frontendJob._id,
          jobTitle: frontendJob.title,
          department: frontendJob.department,
          personalInfo: {
            fullName: 'Sophia Elena Chen',
            email: 'sophia.chen@example.com',
            phone: '+91 98765 43210',
            city: 'Bengaluru',
            country: 'India',
            portfolioUrl: 'https://sophiachen.design',
            linkedinUrl: 'https://linkedin.com/in/sophiachen',
            githubUrl: 'https://github.com/sophiachen'
          },
          experience: {
            totalYears: 7.5,
            currentCompany: 'NextGen Solutions',
            currentDesignation: 'Staff Frontend Engineer',
            noticePeriodDays: 30,
            currentCtc: 3000000,
            expectedCtc: 3800000
          },
          education: {
            highestDegree: "Master's Degree",
            fieldOfStudy: 'Human Computer Interaction',
            institution: 'IIIT Hyderabad',
            graduationYear: 2018,
            grade: '9.2 CGPA'
          },
          skills: ['React', 'Tailwind CSS', 'Redux', 'TypeScript', 'Web Performance', 'Design Systems'],
          resumeUrl: 'https://example.com/resumes/sophia_chen.pdf',
          resumeFileName: 'Sophia_Chen_Frontend_Lead.pdf',
          coverLetter: 'Passionate about building highly accessible and hyper-performant React architectures.',
          stage: 'offered',
          matchScore: 98,
          hrNotes: [
            {
              note: 'Final interview complete. Offer letter dispatched with starting date next month.',
              author: 'Talent Partner',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
          ],
          scorecard: {
            technical: 5.0,
            communication: 4.9,
            problemSolving: 4.8,
            cultureFit: 5.0,
            overall: 4.9,
            recommendation: 'Strong Hire',
            feedbackText: 'Exceptional candidate. Architected our entire demo live.'
          },
          isDeleted: false
        },
        {
          applicationNumber: 'APP-2026-1003',
          jobId: aiJob._id,
          jobTitle: aiJob.title,
          department: aiJob.department,
          personalInfo: {
            fullName: 'Marcus Vance',
            email: 'marcus.vance@example.com',
            phone: '+91 91234 56789',
            city: 'Hyderabad',
            country: 'India',
            portfolioUrl: '',
            linkedinUrl: 'https://linkedin.com/in/marcusvance',
            githubUrl: 'https://github.com/marcusvance-ai'
          },
          experience: {
            totalYears: 4,
            currentCompany: 'DeepVector Labs',
            currentDesignation: 'NLP & AI Research Engineer',
            noticePeriodDays: 30,
            currentCtc: 2400000,
            expectedCtc: 3200000
          },
          education: {
            highestDegree: "Master's Degree",
            fieldOfStudy: 'Artificial Intelligence',
            institution: 'BITS Pilani',
            graduationYear: 2022,
            grade: '9.0 CGPA'
          },
          skills: ['Python', 'LLMs', 'LangChain', 'PyTorch', 'Vector DB', 'FastAPI'],
          resumeUrl: 'https://example.com/resumes/marcus_vance.pdf',
          resumeFileName: 'Marcus_Vance_AI_CV.pdf',
          stage: 'interview_1',
          matchScore: 91,
          hrNotes: [
            {
              note: 'Screening passed. Scheduled for technical discussion on vector indexing.',
              author: 'HR Recruiter',
              createdAt: new Date()
            }
          ],
          isDeleted: false
        },
        {
          applicationNumber: 'APP-2026-1004',
          jobId: fullStackJob._id,
          jobTitle: fullStackJob.title,
          department: fullStackJob.department,
          personalInfo: {
            fullName: 'Emily Thorne',
            email: 'emily.thorne@example.com',
            phone: '+91 99887 76655',
            city: 'Gurugram',
            country: 'India',
            portfolioUrl: '',
            linkedinUrl: 'https://linkedin.com/in/emilythorne',
            githubUrl: 'https://github.com/emilythorne'
          },
          experience: {
            totalYears: 3,
            currentCompany: 'WebPulse Digital',
            currentDesignation: 'Full Stack Engineer',
            noticePeriodDays: 30,
            currentCtc: 1200000,
            expectedCtc: 1800000
          },
          education: {
            highestDegree: "Bachelor's Degree",
            fieldOfStudy: 'Software Engineering',
            institution: 'Delhi Technological University',
            graduationYear: 2023,
            grade: '8.5 CGPA'
          },
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
          resumeUrl: 'https://example.com/resumes/emily_thorne.pdf',
          resumeFileName: 'Emily_Thorne_Resume.pdf',
          stage: 'screening',
          matchScore: 82,
          isDeleted: false
        },
        {
          applicationNumber: 'APP-2026-1005',
          jobId: fullStackJob._id,
          jobTitle: fullStackJob.title,
          department: fullStackJob.department,
          personalInfo: {
            fullName: 'Robert Sterling',
            email: 'robert.sterling@example.com',
            phone: '+91 98112 23344',
            city: 'Pune',
            country: 'India',
            portfolioUrl: '',
            linkedinUrl: 'https://linkedin.com/in/robertsterling',
            githubUrl: 'https://github.com/rsterling'
          },
          experience: {
            totalYears: 1,
            currentCompany: 'TechCore Inc',
            currentDesignation: 'Junior Developer',
            noticePeriodDays: 60,
            currentCtc: 600000,
            expectedCtc: 1000000
          },
          education: {
            highestDegree: "Bachelor's Degree",
            fieldOfStudy: 'Information Systems',
            institution: 'Boston University',
            graduationYear: 2024,
            grade: '3.2 GPA'
          },
          skills: ['HTML5', 'CSS3', 'JavaScript'],
          resumeUrl: 'https://example.com/resumes/robert_sterling.pdf',
          resumeFileName: 'Robert_Sterling_CV.pdf',
          stage: 'rejected',
          matchScore: 48,
          isDeleted: true,
          deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // In recycle bin for 5 days
          retentionDays: 60
        }
      ]);

      // Seed Scheduled Meetings
      await Meeting.create([
        {
          applicationId: applications[0]._id,
          candidateName: 'Alexander Wright',
          candidateEmail: 'alex.wright@example.com',
          jobTitle: 'Senior Full Stack Engineer',
          round: 'Technical Round',
          interviewerName: 'David Miller (Lead Architect)',
          interviewerEmail: 'david.miller@company.com',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          durationMinutes: 60,
          meetingLink: 'https://meet.google.com/kady-eng-interview-4092',
          status: 'scheduled',
          notes: 'Focus on distributed caching and MongoDB aggregation pipeline optimization.'
        },
        {
          applicationId: applications[2]._id,
          candidateName: 'Marcus Vance',
          candidateEmail: 'marcus.vance@example.com',
          jobTitle: 'AI & Machine Learning Engineer',
          round: 'Initial Screening',
          interviewerName: 'Sarah Jenkins (Tech Recruiter)',
          interviewerEmail: 'sarah.j@company.com',
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          durationMinutes: 30,
          meetingLink: 'https://meet.google.com/kady-screening-8120',
          status: 'scheduled',
          notes: 'Candidate has strong published research in transformer quantization.'
        }
      ]);

      // Seed Notifications
      await Notification.insertMany([
        {
          title: 'New High-Match Application Received',
          message: 'Alexander Wright applied for Senior Full Stack Engineer (94% match score).',
          type: 'application',
          link: '/admin/candidates'
        },
        {
          title: 'Upcoming Technical Interview',
          message: 'Interview with Alexander Wright scheduled for tomorrow at 2:00 PM.',
          type: 'interview',
          link: '/admin/meetings'
        },
        {
          title: 'Candidate Offer Dispatched',
          message: 'Official offer sent to Sophia Elena Chen for Lead Frontend Architect.',
          type: 'success',
          link: '/admin/selected'
        }
      ]);

      // Seed Platform Settings
      await Setting.create({
        key: 'retention_policy_days',
        value: 60,
        description: 'Automatic GDPR retention expiration period for recycle bin items.'
      });

      console.log('[Seed] Database initialization complete!');
    }
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};
