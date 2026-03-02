export type CertificationItem = {
  id: string
  name: string
  issuedBy?: string
  issuedDate?: string
  credentialUrl?: string | null
  credentialId?: string
  issuerLogo?: string
  badgeImage?: string
  badgeLabel?: string
}

const CERTIFICATION_FALLBACK_URL = 'https://www.linkedin.com/in/tienhuynh-tn/'

export const allCertifications: CertificationItem[] = [
  {
    id: 'oracle-java-ocp-17',
    name: 'Oracle Java OCP 17',
    issuedBy: 'Oracle',
    issuedDate: 'Issued Jan 2025',
    credentialUrl: 'https://www.oracle.com/education/certification/',
    credentialId: 'OCP-17-2025-TH',
    badgeLabel: 'OCP',
  },
  {
    id: 'aws-certified-developer-associate',
    name: 'AWS Certified Developer – Associate',
    issuedBy: 'Amazon Web Services',
    issuedDate: 'Issued Mar 2025',
    credentialUrl:
      'https://aws.amazon.com/certification/certified-developer-associate/',
    credentialId: 'AWS-DVA-2025-TH',
    badgeLabel: 'AWS',
  },
  {
    id: 'google-cloud-fundamentals',
    name: 'Google Cloud Fundamentals',
    issuedBy: 'Google',
    issuedDate: 'Issued Oct 2024',
    credentialUrl:
      'https://www.cloudskillsboost.google/paths/11',
    credentialId: 'GCF-2024-TH',
    badgeLabel: 'GCP',
  },
  {
    id: 'google-cloud-digital-leader',
    name: 'Google Cloud Digital Leader',
    issuedBy: 'Google Cloud',
    issuedDate: 'Issued Feb 2025',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'GCP',
  },
  {
    id: 'oracle-cloud-infrastructure-foundations',
    name: 'Oracle Cloud Infrastructure Foundations',
    issuedBy: 'Oracle',
    issuedDate: 'Issued Dec 2024',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'OCI',
  },
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    issuedBy: 'Amazon Web Services',
    issuedDate: 'Issued Nov 2024',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'AWS',
  },
  {
    id: 'docker-foundations',
    name: 'Docker Foundations Professional Certificate',
    issuedBy: 'Docker',
    issuedDate: 'Issued Jan 2025',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'DOC',
  },
  {
    id: 'kubernetes-fundamentals',
    name: 'Kubernetes Fundamentals',
    issuedBy: 'Cloud Native Computing Foundation',
    issuedDate: 'Issued Feb 2025',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'K8S',
  },
  {
    id: 'github-foundations',
    name: 'GitHub Foundations',
    issuedBy: 'GitHub',
    issuedDate: 'Issued Mar 2025',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'GH',
  },
  {
    id: 'microsoft-azure-fundamentals',
    name: 'Microsoft Azure Fundamentals',
    issuedBy: 'Microsoft',
    issuedDate: 'Issued Apr 2025',
    credentialUrl: CERTIFICATION_FALLBACK_URL,
    badgeLabel: 'AZ',
  },
]

export const featuredCertifications = allCertifications
