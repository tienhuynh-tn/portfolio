export type EducationItem = {
  id: string
  degree: string
  institution: string
  period: string
  grade?: string
}

export const educationItems: EducationItem[] = [
  {
    id: 'fpt-university-btech-software-engineering',
    degree: 'Bachelor of Technology (B.Tech), Software Engineering',
    institution: 'FPT University',
    period: 'Sep 2019 - Nov 2023',
    grade: 'Grade: 8.0',
  },
  {
    id: 'hoang-le-kha-high-school',
    degree: 'High School Diploma, Biology',
    institution: 'Hoang Le Kha High School for the Gifted',
    period: 'Aug 2016 - May 2019',
  },
]
