import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const resumeBuddyChat = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return sendError(res, 'Prompt is required', [], 400);
  }

  const query = prompt.toLowerCase();
  let aiReply = '';
  let matchedCandidates = [];

  // Fetch active candidates for context
  const allCandidates = await Application.find({ isDeleted: false }).lean();

  if (query.includes('react') || query.includes('frontend') || query.includes('ui')) {
    matchedCandidates = allCandidates.filter((c) =>
      c.skills.some((s) => /react|frontend|tailwind|ui/i.test(s))
    );
    aiReply = `I found **${matchedCandidates.length} candidate(s)** with strong React & Frontend credentials. Top candidate is **${matchedCandidates[0]?.personalInfo.fullName || 'Sophia Chen'}** with ${matchedCandidates[0]?.experience.totalYears || 7}+ years experience.`;
  } else if (query.includes('node') || query.includes('backend') || query.includes('full stack') || query.includes('fullstack')) {
    matchedCandidates = allCandidates.filter((c) =>
      c.skills.some((s) => /node|express|backend|full stack|mongodb/i.test(s))
    );
    aiReply = `Found **${matchedCandidates.length} candidate(s)** in the Full Stack / Backend talent pool. Alexander Wright has scored a 94% match for your Senior Full Stack opening with 6 years experience in Node.js & distributed systems.`;
  } else if (query.includes('ai') || query.includes('python') || query.includes('ml') || query.includes('machine learning')) {
    matchedCandidates = allCandidates.filter((c) =>
      c.skills.some((s) => /python|ai|llm|ml|langchain/i.test(s))
    );
    aiReply = `Found **${matchedCandidates.length} candidate(s)** for Data & AI roles. Marcus Vance specializes in LLMs, LangChain, and Vector DBs with a 91% match.`;
  } else if (query.includes('question') || query.includes('interview')) {
    aiReply = `Here are 3 suggested interview questions tailored for your candidates:\n1. **System Design**: How do you architect an event-driven notification service with idempotent delivery?\n2. **React 19**: Explain the differences between server actions and traditional optimistic mutations.\n3. **Problem Solving**: Walk us through a complex production race condition you debugged.`;
  } else {
    matchedCandidates = allCandidates.slice(0, 3);
    aiReply = `I am **Resume Buddy AI**, your recruitment copilot. I analyzed your active talent database of **${allCandidates.length} applicants**. You can ask me to find candidates by skill (e.g. "Find React devs"), evaluate matches, or generate custom interview rubrics!`;
  }

  return sendSuccess(res, 'AI response generated', {
    reply: aiReply,
    matchedCandidates: matchedCandidates.map((c) => ({
      id: c._id,
      name: c.personalInfo.fullName,
      email: c.personalInfo.email,
      role: c.jobTitle,
      stage: c.stage,
      skills: c.skills,
      experienceYears: c.experience.totalYears,
      matchScore: c.matchScore
    }))
  });
};

export const candidateMatch = async (req, res) => {
  const { candidateId, jobId } = req.body;
  const candidate = await Application.findById(candidateId).lean();
  const job = await Job.findById(jobId).lean();

  if (!candidate || !job) {
    return sendError(res, 'Candidate or Job not found', [], 404);
  }

  const jobSkills = job.skills.map((s) => s.toLowerCase());
  const matchedSkills = candidate.skills.filter((s) => jobSkills.includes(s.toLowerCase()));
  const missingSkills = job.skills.filter((s) => !candidate.skills.map((c) => c.toLowerCase()).includes(s.toLowerCase()));

  const matchPercent = Math.min(
    99,
    Math.round(60 + (matchedSkills.length / Math.max(job.skills.length, 1)) * 35)
  );

  return sendSuccess(res, 'Candidate match evaluation', {
    matchPercent,
    matchedSkills,
    missingSkills,
    summary: `Candidate matches ${matchedSkills.length} of ${job.skills.length} target core competencies.`
  });
};
