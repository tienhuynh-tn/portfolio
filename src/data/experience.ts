export type ExperienceItem = {
  id: string
  role: string
  company: string
  period: string
  location?: string
  highlights: string[]
  tech: string[]
  links?: {
    company?: string
    project?: string
  }
}

export const experienceItems: ExperienceItem[] = [
  {
    id: 'fpt-senior-java-backend',
    role: 'Software Developer',
    company: 'FPT Software',
    period: 'Mar 2024 - Present',
    location: 'Ho Chi Minh City, Vietnam',
    highlights: [
      'Delivered high-throughput backend APIs for enterprise banking clients.',
      'Improved reliability via standardized observability and alerting baselines.',
      'Collaborated cross-functionally to ship stable release milestones.',
    ],
    tech: ['Java', 'Spring Boot', 'Redis', 'Kafka', 'AWS'],
    links: {
      company: 'https://www.fpt-software.com',
    },
  },
  {
    id: 'doctor-anywhere-associate-software-engineer',
    role: 'Associate Software Engineer (Contract)',
    company: 'Doctor Anywhere',
    period: 'Jan 2024 - Feb 2024',
    location: 'Ho Chi Minh City, Vietnam',
    highlights: [
      'Built backend features and maintained microservices.',
      'Improved API stability through bug fixes and refactoring.',
    ],
    tech: ['Java', 'Spring Boot', 'AWS', 'Docker'],
  },
  {
    id: 'geocomply-full-stack-intern',
    role: 'Full-stack Engineering Intern',
    company: 'GeoComply',
    period: 'May 2023 - Aug 2023',
    location: 'Ho Chi Minh City, Vietnam',
    highlights: [
      'Built internal tools and UI features supporting engineering workflows.',
      'Integrated frontend with backend APIs and improved UX.',
    ],
    tech: ['React', 'Java', 'Docker'],
  },
  {
    id: 'fpt-backend-intern',
    role: 'Back-end Engineering Intern (Apprenticeship)',
    company: 'FPT Software',
    period: 'May 2022 - Aug 2022',
    location: 'Ho Chi Minh City, Vietnam',
    highlights: [
      'Developed REST APIs and optimized SQL queries.',
      'Supported deployment and release automation.',
    ],
    tech: ['Java', 'Spring Boot', 'SQL', 'Azure'],
  },
  {
    id: 'becodeching-student-supporter',
    role: 'Student Supporter',
    company: 'BeCodeching - Chuyên Dạy Lập Trình Cho Sinh Viên Và Người Trái Ngành',
    period: 'Nov 2021 - Apr 2022',
    location: 'Ho Chi Minh City, Vietnam',
    highlights: [
      'Supported students through programming-learning activities and class coordination.',
      'Assisted communication and guidance for students and career-switching learners.',
    ],
    tech: [],
  },
]
