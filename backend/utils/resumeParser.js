export const parseResumeText = (rawText = '', originalFilename = '') => {
  const result = {
    fullName: '',
    email: '',
    phone: '',
    skills: [],
    experienceYears: 0,
    currentDesignation: '',
    currentCompany: '',
    highestDegree: '',
    fieldOfStudy: '',
    confidence: 0.92
  };

  const text = rawText || originalFilename;

  // Extract Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  if (emailMatch) result.email = emailMatch[1].toLowerCase();

  // Extract Phone Number
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // Common Skills Taxonomy
  const skillKeywords = [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Express', 'MongoDB', 'PostgreSQL',
    'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'Next.js', 'Python', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'REST API', 'Git', 'CI/CD', 'Figma', 'UI/UX', 'Jest',
    'C++', 'Java', 'Spring Boot', 'SQL', 'Microservices', 'Agile', 'Scrum'
  ];

  const foundSkills = new Set();
  skillKeywords.forEach((skill) => {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  });

  result.skills = Array.from(foundSkills);

  // Extract Name heuristic (from first lines or filename)
  if (!result.fullName) {
    const cleanFilename = originalFilename
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/(resume|cv|profile|updated|2024|2025|2026)/gi, '')
      .trim();

    if (cleanFilename && cleanFilename.length > 2) {
      result.fullName = cleanFilename
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    } else {
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2 && l.length < 40);
      if (lines.length > 0 && !/@|\.com|\+?\d/.test(lines[0])) {
        result.fullName = lines[0];
      }
    }
  }

  // Extract Experience Years
  const expMatch = text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years|yrs|year)\s*(?:of\s*)?(?:experience|exp)?/i);
  if (expMatch) {
    result.experienceYears = parseFloat(expMatch[1]);
  }

  // Extract Current Designation
  const titleKeywords = [
    'Senior Frontend Engineer', 'Senior Full Stack Developer', 'Software Engineer',
    'Lead Backend Developer', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer',
    'Full Stack Engineer', 'Frontend Developer', 'Backend Developer'
  ];

  for (const title of titleKeywords) {
    if (new RegExp(title, 'i').test(text)) {
      result.currentDesignation = title;
      break;
    }
  }

  // Extract Education
  if (/master|m\.tech|m\.s|mba|mca/i.test(text)) {
    result.highestDegree = "Master's Degree";
    result.fieldOfStudy = 'Computer Science';
  } else if (/bachelor|b\.tech|b\.e|b\.s|bca/i.test(text)) {
    result.highestDegree = "Bachelor's Degree";
    result.fieldOfStudy = 'Computer Science / IT';
  }

  return result;
};
