export type CertificationItem = {
  id: string
  name: string
  issuedBy: string
  issuedDate: string
  credentialUrl: string
  credentialId?: string
  issuerLogo?: string
}

export const allCertifications: CertificationItem[] = [
  {
    id: 'oracle-java-ocp-17',
    name: 'Oracle Java OCP 17',
    issuedBy: 'Oracle',
    issuedDate: 'Issued Jan 2025',
    credentialUrl: 'https://www.oracle.com/education/certification/',
    credentialId: 'OCP-17-2025-TH',
  },
  {
    id: 'aws-certified-developer-associate',
    name: 'AWS Certified Developer – Associate',
    issuedBy: 'Amazon Web Services',
    issuedDate: 'Issued Mar 2025',
    credentialUrl:
      'https://aws.amazon.com/certification/certified-developer-associate/',
    credentialId: 'AWS-DVA-2025-TH',
  },
  {
    id: 'google-cloud-fundamentals',
    name: 'Google Cloud Fundamentals',
    issuedBy: 'Google',
    issuedDate: 'Issued Oct 2024',
    credentialUrl:
      'https://www.cloudskillsboost.google/paths/11',
    credentialId: 'GCF-2024-TH',
  },
]

export const featuredCertifications = allCertifications.slice(0, 3)
