export interface QnaItem {
  question: string;
  answer: string;
  category?: 'technical' | 'experience' | 'personal' | 'project' | 'professional';
}

export const qna: QnaItem[] = [
  {
    question: 'What technologies do you use?',
    answer: `My tech stack includes:
• Frontend: React, Next.js, TypeScript, TailwindCSS
• Backend: Node.js, Express, Supabase, PostgreSQL
• DevOps: Git, GitHub Actions, Vercel
• Testing: Jest, React Testing Library
• Tools: VS Code, Postman, Docker

I'm always learning and adapting to new technologies to stay current with industry trends.`,
    category: 'technical'
  },
  {
    question: 'What is your experience?',
    answer: `I have over 4 years of development experience, focusing on:
• Full-stack web development with React and Node.js
• Building scalable applications with Next.js and TypeScript
• Database design and management with PostgreSQL and Supabase
• UI/UX design and implementation
• Performance optimization and SEO
• Team collaboration and project management

I've worked on various projects ranging from small business websites to large-scale applications.`,
    category: 'experience'
  },
  {
    question: 'How can I contact you?',
    answer: `You can reach me through:
• Email: SBBusiness2025@outlook.com
• GitHub: https://github.com/ShawnBrownDev
• Portfolio: This website!

I'm always open to discussing new opportunities and collaborations.`,
    category: 'personal'
  },
  {
    question: 'What are your notable projects?',
    answer: `Here are some of my key projects:
• Portfolio Website (This Site): Built with Next.js, TypeScript, and TailwindCSS
• [Project Name]: [Brief description of another significant project]
• [Project Name]: [Brief description of another significant project]

Each project showcases different aspects of my technical abilities and problem-solving skills.`,
    category: 'project'
  },
  {
    question: 'What is your development approach?',
    answer: `My development philosophy centers on:
• Clean, maintainable code following best practices
• Mobile-first, responsive design
• Performance optimization and accessibility
• Test-driven development when appropriate
• Continuous learning and improvement
• Strong documentation and code comments

I believe in building scalable solutions that solve real problems.`,
    category: 'technical'
  },
  {
    question: 'What are your strengths?',
    answer: `My key strengths include:
• Strong problem-solving abilities
• Quick learning and adaptation to new technologies
• Attention to detail and code quality
• Effective communication and collaboration
• Time management and project organization
• Passion for clean, efficient code

I consistently deliver high-quality work while meeting deadlines.`,
    category: 'personal'
  },
  {
    question: 'What is your education background?',
    answer: `My educational journey includes:
• [Your Degree] in [Your Field]
• Continuous self-learning through online platforms
• Regular participation in tech conferences and workshops
• Active involvement in developer communities

I believe in lifelong learning and staying current with industry trends.`,
    category: 'experience'
  },
  {
    question: 'What services do you offer?',
    answer: `I offer various development services including:
• Full-stack web application development
• Frontend development and UI/UX design
• Backend development and API integration
• Performance optimization and debugging
• Technical consultation and code review
• Website maintenance and updates

Each service is tailored to meet specific client needs and requirements.`,
    category: 'professional'
  }
]; 