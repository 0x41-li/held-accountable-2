
export const CAREERS_DATA = [
  {
    vacancy: "AI Prompt Engineer (LLM Applications)",
    short_description: `We’re looking for an AI Prompt Engineer to design, test, and scale high-quality prompts and prompt-driven workflows across our products. You’ll sit at the intersection of product, applied ML, and engineering—turning fuzzy user needs into reliable LLM behaviors, then hardening those behaviors for production.`,
    responsibilities: `## Responsibilities
- Design and iterate prompts (zero-/few-shot, tool/function calling, JSON-mode) for Q&A, summarization, extraction, and agentic workflows
- Build evaluation harnesses (automatic + human-in-the-loop) to measure quality, hallucinations, latency, and cost.
- Create prompt chains/graphs and retrieval-augmented generation (RAG) pipelines; tune chunking, metadata, and citations.
- Partner with PM/Design to translate requirements into LLM specs: context windows, grounding data, fallbacks, and guardrails.
- Instrument A/B tests and track metrics: answer quality, deflection/containment, CSAT, and unit cost.
- Productionize flows with versioning, observability/tracing, retries/rate limits, safety filters, and incident playbooks.
- Maintain a prompt library with documentation, reusable patterns, and red-teaming checklists.`,
    qualifications: `## Minimum qualifications:
- 3+ years in software, data, or applied ML (or equivalent practical experience).
- Strong Python or TypeScript; comfort with APIs/SDKs and JSON schemas.
- Hands-on experience with modern LLMs, embeddings, vector stores, and evaluation techniques.
- Experience designing experiments with clear acceptance criteria for model behavior.
- Excellent written communication and a safety- and reliability-first mindset.

## Preferred qualifications:
- RAG at scale (indexing pipelines, hybrid search, metadata filtering).
- Fine-tuning/adapters and advanced tool/function calling.
- MLOps/observability for LLMs (prompt/version telemetry, tracing, cost controls).
- Domain experience in support automation, knowledge search, or productivity tools.
- Knowledge of data privacy, safety guardrails, and prompt injection mitigations.`,
    about: `## About the role
We’re looking for an AI Prompt Engineer to design, test, and scale high-quality prompts and prompt-driven workflows across our products. You’ll sit at the intersection of product, applied ML, and engineering—turning fuzzy user needs into reliable LLM behaviors, then hardening those behaviors for production.

## How we work
Remote-friendly with flexible collaboration hours. We value clear writing, measurable outcomes, and safety-first design. You’ll partner closely with PM, Design, and Engineering to get real features into customers’ hands.

## What success looks like (first 90 days)
- Reduce hallucinations by ≥30% on a target task through prompt/eval iteration.
- Launch one production prompt flow with <2% failure rate and a clear rollback plan.
- Publish a prompt style guide and decision log adopted by partner teams.

## How to apply
Send your resume/portfolio (prompt samples/eval reports welcome) to careers@held-accountable.com with subject **AI Prompt Engineer – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "AI/ML",
  },
  {
    vacancy: "Senior Engineering Lead, Held Accountable (AI News Platform)",
    short_description: `We’re hiring a Senior Engineering Lead to own the technical roadmap and lead a small, high-impact team building our core platform: real-time news ingestion, AI summarization, polling, personalization, and analytics—hardened with reliability, safety, and speed. You’ll stay hands-on while setting standards for architecture, code quality, and delivery.`,
    responsibilities: `## Responsibilities
- Lead architecture and delivery for news ingestion, summarization (LLMs/RAG), polling, insights, and notifications.
- Design scalable, low-latency services and APIs; drive reliability (SLOs, error budgets, incident response).
- Own data pipelines: crawling/feeds, deduping, enrichment, provenance, and safety/quality guardrails.
- Implement LLM integrations (prompting, evals, fallbacks) with cost controls and red-teaming practices.
- Establish engineering standards: code review, testing strategy, CI/CD, versioning, and release management.
- Mentor engineers; plan roadmaps; manage execution with measurable outcomes.
- Partner with Product/Editorial on requirements; translate user needs into clear technical specs.
- Implement privacy/security best practices (PII handling, access controls, audit trails).
- Drive observability (tracing, metrics, logs) and capacity planning for traffic spikes during breaking news.`,
    qualifications: `## Minimum qualifications:
- 8+ years of software engineering experience, including 2+ years leading teams or major initiatives.
- Strong with **TypeScript/Node.js** and/or **Python**; experience designing and operating distributed systems.
- Cloud infrastructure (AWS/GCP), containers, IaC, and CI/CD; solid grasp of caching and performance tuning.
- Datastores such as Postgres, Redis, Elasticsearch/OpenSearch, and a vector DB (e.g., Pinecone/pgvector).
- Building and monitoring production services with alerting, dashboards, and on-call rotation.

## Preferred qualifications:
- RAG pipelines, embeddings, and evaluation frameworks for LLM quality/safety.
- Event streaming (Kafka/PubSub), real-time feeds, and content integrity/provenance.
- Personalization/recommendation systems; experimentation frameworks (A/B, feature flags).
- Security practices for media/news platforms; compliance-minded development.
- Experience in consumer media, news, or high-traffic content platforms.`,
    about: `## About Held Accountable
Held Accountable is an AI-powered, news-first platform that makes getting trustworthy information effortless—no noise, no spin. We use AI to generate concise news briefs, power real-time polls, and surface actionable insights so audiences can understand what matters fast.

## About the role
We’re hiring a Senior Engineering Lead to own the technical roadmap and lead a small, high-impact team building our core platform: real-time news ingestion, AI summarization, polling, personalization, and analytics—hardened with reliability, safety, and speed. You’ll stay hands-on while setting standards for architecture, code quality, and delivery.

## How we work
We ship quickly, test rigorously, and instrument everything. We value clear writing, lightweight processes, and ethical AI. You’ll partner tightly with Product and Editorial to turn breaking news into dependable features.

## What success looks like (first 90 days)
- Ship a resilient ingestion → RAG/LLM → publish pipeline with p95 < 1.5s end-to-end latency.
- Launch polls & insights v2 with improved participation and +X% D7 retention.
- Stand up observability (tracing, logs, metrics) with SLOs and an on-call playbook.
- Document a platform architecture and engineering style guide adopted by the team.

## How to apply
Send your resume/GitHub/portfolio to careers@held-accountable.com with subject **Senior Engineering Lead – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "Engineering",
  },
  {
    vacancy: "Marketing Lead, Held Accountable (AI News Platform)",
    short_description: `We’re hiring a Marketing Lead to define our narrative, accelerate growth, and turn our AI features (news postings, polls, insights) into habit-forming experiences. You’ll own brand, product marketing, lifecycle, and growth across owned, earned, and paid channels—partnering tightly with Product, Editorial, and Partnerships.`,
    responsibilities: `## Responsibilities
- Own GTM strategy and calendar for feature launches (AI news briefs, polls, insights, notifications, newsletters).
- Define ICPs/segments and craft positioning, messaging, and narrative that differentiates Held Accountable.
- Build predictable growth via SEO/news SEO, social/editorial, newsletters, partnerships, and creator/influencer programs.
- Partner with PM/Design to translate requirements into LLM specs: context windows, grounding data, fallbacks, and guardrails.
- Lead product marketing: packaging, pricing, competitive analysis, sales/partner enablement (decks, one-pagers, case studies).
- Design lifecycle programs (email, push, in-app) that improve activation, retention, and referral; run continuous A/B tests.
- Implement analytics and attribution (GA4/Amplitude/Mixpanel + Looker/BI); set north-star and channel KPIs; report insights to execs.
- Partner with Editorial on content calendars and breaking-news playbooks; align campaigns to major news moments.
- Own PR/communications and social presence; manage reputation and crisis comms during fast-moving news cycles.
- Recruit and coach a small team; manage agencies/vendors; own budget, forecasting, and ROI on spend.`,
    qualifications: `## Minimum qualifications:
- 6+ years in consumer media, news, or B2C product marketing/growth with ownership of acquisition and retention goals.
- Proven track record running integrated campaigns end-to-end (strategy → creative → execution → measurement).
- Fluency with marketing analytics and experimentation (GA4/Amplitude/Mixpanel, Looker/BI, A/B testing); comfort with funnels and attribution.
- Strong storytelling and copywriting that translates complex topics into simple, trustworthy narratives.
- Cross-functional leadership with Product, Design, Editorial, and Partnerships.

## Preferred qualifications:
- Experience in news/media growth, newsletters, and social distribution; familiarity with SEO for news and topical authority.
- Lifecycle/CRM expertise (Braze, Customer.io, HubSpot/Marketo) including segmentation and multivariate testing.
- Creator/influencer programs and media partnerships; event and webinar strategy.
- Comfort working with AI-assisted content workflows, safety/quality guidelines, and transparency best practices.
- Basic SQL or spreadsheet modeling for cohorts, retention, and LTV/CAC analysis.`,
    about: `## About Held Accountable
Held Accountable is an AI-powered, news-first platform that makes getting trustworthy information effortless—no noise, no spin. We use AI to generate concise news briefs, power real-time polls, and surface actionable insights so audiences can understand what matters fast. Our ambition is bold: build a product experience so clear and useful that legacy feeds feel obsolete.

## About the role
We’re hiring a Marketing Lead to define our narrative, accelerate growth, and turn our AI features (news postings, polls, insights) into habit-forming experiences. You’ll own brand, product marketing, lifecycle, and growth across owned, earned, and paid channels—partnering tightly with Product, Editorial, and Partnerships.

## How we work
We move quickly, test rigorously, and let user insight + data guide decisions. You’ll mentor a small, high-impact team while rolling up your sleeves on launches, campaigns, and analytics—always with an emphasis on accuracy, transparency, and trust.

## What success looks like (first 90 days)
- Publish a crisp positioning/messaging framework and brand voice adopted across product, editorial, and social.
- Launch an integrated campaign highlighting AI news briefs + polls, driving X new sign-ups and Y% increase in DAU/retention.
- Stand up a measurement stack and weekly dashboards for DAU, D1/D7 retention, poll participation rate, CPA/CAC, share ratio, and newsletter open/CTR.

## How to apply
Send your resume/portfolio to careers@held-accountable.com with subject **Marketing Lead – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "Marketing",
  },
];