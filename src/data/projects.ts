export type ProjectLinkSet = {
  live?: string
  source?: string
  caseStudy?: string
}

export type Project = {
  slug: string
  title: string
  featured: boolean
  coverImage: string
  shortDesc: string
  longDesc: string[]
  tech: string[]
  links: ProjectLinkSet
  highlights: string[]
  architecture?: string[]
  role?: string
  outcomes?: string[]
}

export const projects: Project[] = [
  {
    slug: 'inventory-control-service',
    title: 'Inventory Control Service',
    featured: true,
    coverImage:
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'A resilient inventory backend that handles stock movements, forecasting inputs, and audit-safe change history for operations teams.',
    longDesc: [
      'Inventory Control Service centralizes warehouse stock updates, receiving flows, and adjustment events into one consistent backend API.',
      'The system was designed around predictable transaction boundaries, clear validation rules, and auditable event history to support day-to-day operations.',
      'This project emphasized reliability under concurrent updates and maintainable service contracts that are easy to evolve over time.',
    ],
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
    links: {
      live: 'https://tienhuynh-tn.github.io',
      source: 'https://github.com/tienhuynh-tn',
      caseStudy: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Built stock movement APIs with validation and optimistic concurrency rules.',
      'Added audit-safe event records for every inventory adjustment and transfer.',
      'Implemented health checks and release-safe deployment workflows on AWS.',
    ],
    architecture: [
      'Layered service design with dedicated domain services and repositories.',
      'Transactional command handlers for stock-in, stock-out, and transfer flows.',
      'Asynchronous event publishing for downstream analytics consumers.',
    ],
    role: 'Backend developer responsible for service design, API delivery, and production readiness.',
    outcomes: [
      'Reduced inventory mismatch incidents by improving data consistency checks.',
      'Improved issue triage speed with structured logs and traceable event IDs.',
    ],
  },
  {
    slug: 'order-processing-pipeline',
    title: 'Order Processing Pipeline',
    featured: true,
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'An event-driven pipeline that validates, enriches, and routes orders with retry policies and observability for high-throughput traffic.',
    longDesc: [
      'Order Processing Pipeline handles order ingestion and orchestration through an event-driven architecture for better decoupling.',
      'Each stage introduces validation, enrichment, and routing policies with clear retry behavior and dead-letter handling.',
      'The pipeline was focused on stable throughput and transparent operational monitoring for incident response.',
    ],
    tech: ['Java', 'Kafka', 'Redis', 'Docker'],
    links: {
      live: 'https://tienhuynh-tn.github.io',
      source: 'https://github.com/tienhuynh-tn',
      caseStudy: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Implemented idempotent processors to avoid duplicate order side effects.',
      'Added retry and dead-letter queue workflows for resilience.',
      'Created operational dashboards for lag, error rates, and throughput trends.',
    ],
    architecture: [
      'Kafka topics partitioned by order key to preserve processing order.',
      'Redis-backed deduplication cache to support idempotent consumers.',
      'Containerized processing workers deployed with rolling updates.',
    ],
    role: 'Led backend pipeline design and operational readiness checks.',
    outcomes: [
      'Lowered failed order processing rates during peak traffic windows.',
      'Improved release confidence with deterministic retry behavior.',
    ],
  },
  {
    slug: 'customer-insights-platform',
    title: 'Customer Insights Platform',
    featured: true,
    coverImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'A data-to-API platform for customer behavior insights, combining scheduled ingestion, domain services, and reporting endpoints.',
    longDesc: [
      'Customer Insights Platform consolidates event and profile data into domain-ready datasets for product and operations teams.',
      'The backend supports scheduled imports, rule-based data shaping, and API endpoints for trend and segment analysis.',
      'Strong focus was placed on clean domain boundaries to keep ingestion and reporting concerns maintainable.',
    ],
    tech: ['Java', 'Spring Batch', 'MySQL', 'OpenSearch'],
    links: {
      live: 'https://tienhuynh-tn.github.io',
      source: 'https://github.com/tienhuynh-tn',
      caseStudy: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Built scheduled ingestion jobs with checkpointing and restart support.',
      'Exposed reporting APIs with filtering, aggregation, and pagination.',
      'Integrated indexed search for rapid customer segment exploration.',
    ],
    architecture: [
      'Batch pipelines for ETL and denormalized reporting snapshots.',
      'MySQL for transactional integrity and OpenSearch for query-heavy access.',
      'REST API layer with query constraints to protect service performance.',
    ],
    role: 'Implemented backend modules across ingestion, query, and indexing layers.',
    outcomes: [
      'Cut reporting latency for customer segment requests.',
      'Enabled product analytics use cases without manual data pulls.',
    ],
  },
  {
    slug: 'payments-reconciliation-tool',
    title: 'Payments Reconciliation Tool',
    featured: false,
    coverImage:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'A reconciliation workflow that matches gateway transactions and ledger records with exception queues for manual review.',
    longDesc: [
      'Payments Reconciliation Tool compares payment gateway activity against internal ledger records to detect mismatches early.',
      'The system supports automated matching, exception queueing, and operator workflows for manual resolution.',
    ],
    tech: ['Java', 'Spring Boot', 'MongoDB', 'Kubernetes'],
    links: {
      source: 'https://github.com/tienhuynh-tn',
      caseStudy: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Built matching strategies for partial, exact, and delayed settlement cases.',
      'Added operator-friendly exception views and retry controls.',
    ],
    outcomes: ['Improved reconciliation accuracy across multiple payment channels.'],
  },
  {
    slug: 'service-health-dashboard',
    title: 'Service Health Dashboard',
    featured: false,
    coverImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'A frontend observability dashboard with service status views, incident timelines, and trend summaries for engineering teams.',
    longDesc: [
      'Service Health Dashboard surfaces incidents, uptime trends, and dependency status in a single operational view.',
      'It combines service metrics and event timelines to help teams understand system health quickly.',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Charting'],
    links: {
      live: 'https://tienhuynh-tn.github.io',
      source: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Built responsive status views for desktop and mobile monitoring.',
      'Implemented chart-driven trend summaries for recent incidents.',
    ],
  },
  {
    slug: 'api-gateway-modernization',
    title: 'API Gateway Modernization',
    featured: false,
    coverImage:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    shortDesc:
      'A modernization effort that standardized API contracts, security policies, and release workflows across core backend services.',
    longDesc: [
      'API Gateway Modernization introduced consistent routing, policy, and contract standards across service teams.',
      'It reduced fragmentation in authentication rules and deployment procedures while improving delivery safety.',
    ],
    tech: ['Java', 'Spring Cloud', 'SQL', 'AWS'],
    links: {
      source: 'https://github.com/tienhuynh-tn',
      caseStudy: 'https://github.com/tienhuynh-tn',
    },
    highlights: [
      'Unified API policy enforcement across multiple backend domains.',
      'Standardized release checklists and deployment guardrails.',
    ],
    architecture: [
      'Gateway policy modules for auth, throttling, and request validation.',
      'Service contract templates with shared versioning rules.',
    ],
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export const allProjects = [...projects]

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug)
