import oracleJavaOcp17Certificate from '../assets/certificates/oracle-java-ocp-17-certificate.svg'
import awsDeveloperAssociateCertificate from '../assets/certificates/aws-certified-developer-associate-certificate.svg'
import googleCloudFundamentalsCertificate from '../assets/certificates/google-cloud-fundamentals-certificate.svg'
import googleCloudDigitalLeaderCertificate from '../assets/certificates/google-cloud-digital-leader-certificate.svg'
import oracleCloudInfrastructureCertificate from '../assets/certificates/oracle-cloud-infrastructure-foundations-certificate.svg'
import awsCloudPractitionerCertificate from '../assets/certificates/aws-cloud-practitioner-certificate.svg'
import dockerFoundationsCertificate from '../assets/certificates/docker-foundations-certificate.svg'
import kubernetesFundamentalsCertificate from '../assets/certificates/kubernetes-fundamentals-certificate.svg'
import githubFoundationsCertificate from '../assets/certificates/github-foundations-certificate.svg'
import microsoftAzureFundamentalsCertificate from '../assets/certificates/microsoft-azure-fundamentals-certificate.svg'

export type CertificationItem = {
  id: string
  name: string
  issuer: string
  issued: string
  url: string
  badgeText: string
  issuerLogoSrc: string
  certBadgeSrc?: string
  certDetailImageSrc?: string
  summary?: string
}

const LINKEDIN_CERTIFICATIONS_URL = 'https://www.linkedin.com/in/tienhuynh-tn/'
const withBaseUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`
const ORACLE_LOGO = withBaseUrl('issuers/oracle.svg')
const AWS_LOGO = withBaseUrl('issuers/aws.svg')
const GOOGLE_LOGO = withBaseUrl('issuers/google.svg')
const DOCKER_LOGO = withBaseUrl('issuers/docker.svg')
const CNCF_LOGO = withBaseUrl('issuers/cncf.svg')
const GITHUB_LOGO = withBaseUrl('issuers/github.svg')
const MICROSOFT_LOGO = withBaseUrl('issuers/microsoft.svg')

export const allCertifications: CertificationItem[] = [
  {
    id: 'oracle-java-ocp-17',
    name: 'Oracle Java OCP 17',
    issuer: 'Oracle',
    issued: 'Jan 2025',
    url: 'https://www.oracle.com/education/certification/',
    badgeText: 'OCP',
    issuerLogoSrc: ORACLE_LOGO,
    certBadgeSrc: withBaseUrl('certs/oracle-java-ocp-17.svg'),
    certDetailImageSrc: oracleJavaOcp17Certificate,
    summary: 'Professional Java certification focused on modern Java 17 language features and enterprise development.',
  },
  {
    id: 'aws-certified-developer-associate',
    name: 'AWS Certified Developer Associate',
    issuer: 'Amazon Web Services',
    issued: 'Mar 2025',
    url: 'https://aws.amazon.com/certification/certified-developer-associate/',
    badgeText: 'AWS',
    issuerLogoSrc: AWS_LOGO,
    certBadgeSrc: withBaseUrl('certs/aws-certified-developer-associate.svg'),
    certDetailImageSrc: awsDeveloperAssociateCertificate,
    summary: 'Validated AWS application development, deployment, and troubleshooting skills across cloud-native workloads.',
  },
  {
    id: 'google-cloud-fundamentals',
    name: 'Google Cloud Fundamentals',
    issuer: 'Google',
    issued: 'Oct 2024',
    url: 'https://www.cloudskillsboost.google/paths/11',
    badgeText: 'GCP',
    issuerLogoSrc: GOOGLE_LOGO,
    certBadgeSrc: withBaseUrl('certs/google-cloud-fundamentals.svg'),
    certDetailImageSrc: googleCloudFundamentalsCertificate,
    summary: 'Introduced Google Cloud core services, infrastructure basics, and platform navigation for production teams.',
  },
  {
    id: 'google-cloud-digital-leader',
    name: 'Google Cloud Digital Leader',
    issuer: 'Google Cloud',
    issued: 'Feb 2025',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'GCP',
    issuerLogoSrc: GOOGLE_LOGO,
    certBadgeSrc: withBaseUrl('certs/google-cloud-digital-leader.svg'),
    certDetailImageSrc: googleCloudDigitalLeaderCertificate,
    summary: 'Covers cloud value, digital transformation, and platform decision-making for cross-functional delivery.',
  },
  {
    id: 'oracle-cloud-infrastructure-foundations',
    name: 'Oracle Cloud Infrastructure Foundations',
    issuer: 'Oracle',
    issued: 'Dec 2024',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'OCI',
    issuerLogoSrc: ORACLE_LOGO,
    certBadgeSrc: withBaseUrl('certs/oracle-cloud-infrastructure-foundations.svg'),
    certDetailImageSrc: oracleCloudInfrastructureCertificate,
    summary: 'Foundation-level certification for OCI core services, identity, storage, and networking concepts.',
  },
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: 'Nov 2024',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'AWS',
    issuerLogoSrc: AWS_LOGO,
    certBadgeSrc: withBaseUrl('certs/aws-cloud-practitioner.svg'),
    certDetailImageSrc: awsCloudPractitionerCertificate,
    summary: 'Baseline AWS certification covering cloud concepts, pricing, security, and foundational services.',
  },
  {
    id: 'docker-foundations',
    name: 'Docker Foundations Professional Certificate',
    issuer: 'Docker',
    issued: 'Jan 2025',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'DOC',
    issuerLogoSrc: DOCKER_LOGO,
    certBadgeSrc: withBaseUrl('certs/docker-foundations.svg'),
    certDetailImageSrc: dockerFoundationsCertificate,
    summary: 'Focuses on container fundamentals, image workflows, local development, and portable runtime practices.',
  },
  {
    id: 'kubernetes-fundamentals',
    name: 'Kubernetes Fundamentals',
    issuer: 'Cloud Native Computing Foundation',
    issued: 'Feb 2025',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'K8S',
    issuerLogoSrc: CNCF_LOGO,
    certBadgeSrc: withBaseUrl('certs/kubernetes-fundamentals.svg'),
    certDetailImageSrc: kubernetesFundamentalsCertificate,
    summary: 'Introduces core Kubernetes primitives, deployment models, and orchestration concepts for scalable systems.',
  },
  {
    id: 'github-foundations',
    name: 'GitHub Foundations',
    issuer: 'GitHub',
    issued: 'Mar 2025',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'GH',
    issuerLogoSrc: GITHUB_LOGO,
    certBadgeSrc: withBaseUrl('certs/github-foundations.svg'),
    certDetailImageSrc: githubFoundationsCertificate,
    summary: 'Validates GitHub collaboration, repository management, branching, and workflow automation fundamentals.',
  },
  {
    id: 'microsoft-azure-fundamentals',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    issued: 'Apr 2025',
    url: LINKEDIN_CERTIFICATIONS_URL,
    badgeText: 'AZ',
    issuerLogoSrc: MICROSOFT_LOGO,
    certBadgeSrc: withBaseUrl('certs/microsoft-azure-fundamentals.svg'),
    certDetailImageSrc: microsoftAzureFundamentalsCertificate,
    summary: 'Baseline Azure credential covering cloud concepts, core services, governance, and platform capabilities.',
  },
]

export const featuredCertifications = allCertifications

export function getCertificationBadgeText(certification: CertificationItem) {
  return certification.badgeText || certification.name.slice(0, 3).toUpperCase()
}

export function getCertificationIssuerText(certification: CertificationItem) {
  const normalizedIssuer = certification.issuer.trim().toLowerCase()

  if (normalizedIssuer === 'oracle') return 'ORA'
  if (normalizedIssuer === 'amazon web services') return 'AWS'
  if (normalizedIssuer === 'google') return 'GGL'
  if (normalizedIssuer === 'google cloud') return 'GCP'
  if (normalizedIssuer === 'docker') return 'DOC'
  if (normalizedIssuer === 'cloud native computing foundation') return 'CNCF'
  if (normalizedIssuer === 'github') return 'GH'
  if (normalizedIssuer === 'microsoft') return 'MS'

  return certification.issuer
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 4)
    .toUpperCase()
}
