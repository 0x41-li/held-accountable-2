
export const CAREERS_DATA = [
  {
    id: "ai-prompt-engineer",
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
Send your resume/portfolio (prompt samples/eval reports welcome) to contact@held-accountable.com with subject **AI Prompt Engineer – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "AI/ML",
  },
  {
    id: "senior-engineering-lead",
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
Send your resume/GitHub/portfolio to contact@held-accountable.com with subject **Senior Engineering Lead – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "Engineering",
  },
  {
    id: "marketing-lead",
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
Send your resume/portfolio to contact@held-accountable.com with subject **Marketing Lead – [Your Name]**.`,
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $200k base + equity",
    industry: "Marketing",
  },
];

export const FAMOUS_COMPANIES_DATA = [
  {
    id: "apple",
    name: "Apple",
    description: "Apple designs and manufactures consumer electronics, including iPhone, iPad, and Mac. Known for innovation, design, and a seamless ecosystem of hardware, software, and services.",
    logo: "ic:baseline-apple",
    search: "http://en.wikipedia.org/wiki/Apple_Inc."
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Microsoft is a technology giant offering software, hardware, and cloud services. Notable products include Windows, Office, Azure, and the Xbox gaming platform.",
    logo: "lineicons:microsoft",
    search: "http://en.wikipedia.org/wiki/Microsoft"
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Amazon is the world's largest online retailer and cloud services provider. It offers a wide range of products, digital content, and AWS cloud computing.",
    logo: "lineicons:amazon",
    search: "http://en.wikipedia.org/wiki/Amazon_(company)"
  },
  {
    id: "google",
    name: "Google",
    description: "Google specializes in search engines, digital advertising, and technology products, including Android, Chrome, YouTube, and cloud computing solutions.",
    logo: "lineicons:google",
    search: "http://en.wikipedia.org/wiki/Google"
  },
  {
    id: "tesla",
    name: "Tesla",
    description: "Tesla is a pioneer in electric vehicles, renewable energy, and battery technology. The company also develops self-driving software and energy storage solutions.",
    logo: "lineicons:tesla",
    search: "http://en.wikipedia.org/wiki/Tesla,_Inc."
  },
  {
    id: "meta",
    name: "Meta Platforms",
    description: "Meta, formerly Facebook, is a leader in social media, virtual reality, and digital communication via platforms like Facebook, Instagram, WhatsApp, and Oculus.",
    logo: "lineicons:meta",
    search: "http://en.wikipedia.org/wiki/Meta_Platforms"
  },
  {
    id: "samsung",
    name: "Samsung",
    description: "Samsung is a global electronics manufacturer, producing smartphones, TVs, semiconductors, and home appliances. It is renowned for innovation in mobile technology.",
    logo: "logos:samsung",
    search: "http://en.wikipedia.org/wiki/Samsung"
  },
  {
    id: "toyota",
    name: "Toyota",
    description: "Toyota is a top global automaker, renowned for quality vehicles, hybrid technology, and pioneering the mass adoption of fuel-efficient and reliable cars worldwide.",
    logo: "lineicons:toyota",
    search: "http://en.wikipedia.org/wiki/Toyota"
  },
  {
    id: "ibm",
    name: "IBM",
    description: "IBM specializes in enterprise technology, cloud computing, artificial intelligence, and consulting services, supporting businesses with innovative hardware and software solutions.",
    logo: "lineicons:ibm",
    search: "http://en.wikipedia.org/wiki/IBM"
  },
  {
    id: "nike",
    name: "Nike",
    description: "Nike is the world's leading sportswear and footwear brand, recognized for innovation, cutting-edge design, athlete sponsorships, and global appeal across athletes and consumers.",
    logo: "lineicons:nike",
    search: "http://en.wikipedia.org/wiki/Nike,_Inc."
  },
  {
    id: "intel",
    name: "Intel",
    description: "Intel is a leading producer of semiconductors, microprocessors, and computer components, powering millions of devices and driving advancements in computing technology.",
    logo: "lineicons:intel",
    search: "http://en.wikipedia.org/wiki/Intel"
  },
  {
    id: "netflix",
    name: "Netflix",
    description: "Netflix is a global streaming platform, offering original movies, series, and documentaries. It has revolutionized how people consume digital entertainment worldwide.",
    logo: "lineicons:netflix",
    search: "http://en.wikipedia.org/wiki/Netflix,_Inc."
  },
  {
    id: "disney",
    name: "Disney",
    description: "Disney is a diversified entertainment company creating beloved movies, TV shows, theme parks, and streaming platforms like Disney+, enchanting audiences globally.",
    logo: "tabler:brand-disney",
    search: "http://en.wikipedia.org/wiki/The_Walt_Disney_Company"
  },
  {
    id: "siemens",
    name: "Siemens",
    description: "Siemens is a multinational engineering and technology company focusing on industry, energy, healthcare, and infrastructure solutions to support sustainable global progress.",
    logo: "simple-icons:siemens",
    search: "http://en.wikipedia.org/wiki/Siemens"
  },
  {
    id: "sony",
    name: "Sony",
    description: "Sony is a global conglomerate producing electronics, gaming consoles, films, and music. PlayStation and its entertainment divisions are household names globally.",
    logo: "simple-icons:sony",
    search: "http://en.wikipedia.org/wiki/Sony"
  },
  {
    id: "mcdonalds",
    name: "McDonald's",
    description: "McDonald's is the world's largest fast-food restaurant chain, known for its burgers, fries, and extensive global presence with thousands of locations in over 100 countries.",
    logo: "simple-icons:mcdonalds",
    search: "http://en.wikipedia.org/wiki/McDonald's"
  },
  {
    id: "alibaba",
    name: "Alibaba",
    description: "Alibaba is a leading Chinese e-commerce, technology, and cloud company, connecting buyers and sellers worldwide through platforms like Alibaba.com, Taobao, and Tmall.",
    logo: "ant-design:alibaba-outlined",
    search: "http://en.wikipedia.org/wiki/Alibaba"
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Oracle is a major provider of database software, cloud solutions, and enterprise IT products, serving businesses with reliable, scalable, and secure technology solutions.",
    logo: "lineicons:oracle",
    search: "http://en.wikipedia.org/wiki/Oracle"
  }
];

export const FORTUNE_500_COMPANIES_DATA = [
  {
    id: "walmart",
    name: "Walmart",
    description: "Walmart is the world's largest retailer, operating a chain of hypermarkets, discount department stores, and grocery stores with thousands of locations worldwide.",
    logo: "simple-icons:walmart",
    search: "http://en.wikipedia.org/wiki/Walmart"
  },
  {
    id: "exxon-mobil",
    name: "Exxon Mobil",
    description: "Exxon Mobil is one of the world's largest publicly traded oil and gas companies, engaged in exploration, production, refining, and marketing of petroleum products.",
    logo: "simple-icons:exxonmobil",
    search: "http://en.wikipedia.org/wiki/ExxonMobil"
  },
  {
    id: "chevron",
    name: "Chevron",
    description: "Chevron is a major integrated energy company involved in oil and gas exploration, production, refining, and marketing operations globally.",
    logo: "simple-icons:chevron",
    search: "http://en.wikipedia.org/wiki/Chevron_Corporation"
  },
  {
    id: "berkshire-hathaway",
    name: "Berkshire Hathaway",
    description: "Berkshire Hathaway is a multinational conglomerate holding company led by Warren Buffett, with diverse investments across insurance, utilities, manufacturing, and retail.",
    logo: "simple-icons:berkshirehathaway",
    search: "http://en.wikipedia.org/wiki/Berkshire_Hathaway"
  },
  {
    id: "jpmorgan-chase",
    name: "JPMorgan Chase",
    description: "JPMorgan Chase is one of the largest financial services firms in the world, providing banking, investment, and wealth management services to consumers and businesses.",
    logo: "simple-icons:jpmorgan",
    search: "http://en.wikipedia.org/wiki/JPMorgan_Chase"
  },
  {
    id: "verizon",
    name: "Verizon",
    description: "Verizon is a leading telecommunications company providing wireless services, broadband, and enterprise solutions to millions of customers across the United States.",
    logo: "simple-icons:verizon",
    search: "http://en.wikipedia.org/wiki/Verizon"
  },
  {
    id: "att",
    name: "AT&T",
    description: "AT&T is a major telecommunications company offering wireless, broadband, and entertainment services, including DirecTV and streaming platforms.",
    logo: "simple-icons:att",
    search: "http://en.wikipedia.org/wiki/AT%26T"
  },
  {
    id: "costco",
    name: "Costco",
    description: "Costco operates membership-only warehouse clubs, offering bulk products at discounted prices to members across the United States and internationally.",
    logo: "simple-icons:costco",
    search: "http://en.wikipedia.org/wiki/Costco"
  },
  {
    id: "ford-motor",
    name: "Ford Motor",
    description: "Ford Motor Company is a leading automaker producing cars, trucks, SUVs, and electric vehicles, with a rich history in American automotive manufacturing.",
    logo: "simple-icons:ford",
    search: "http://en.wikipedia.org/wiki/Ford_Motor_Company"
  },
  {
    id: "general-motors",
    name: "General Motors",
    description: "General Motors is one of the world's largest automakers, manufacturing vehicles under brands like Chevrolet, GMC, Cadillac, and Buick.",
    logo: "simple-icons:generalmotors",
    search: "http://en.wikipedia.org/wiki/General_Motors"
  },
  {
    id: "home-depot",
    name: "The Home Depot",
    description: "The Home Depot is the largest home improvement retailer in the United States, offering tools, construction products, and services for DIY and professional customers.",
    logo: "simple-icons:homedepot",
    search: "http://en.wikipedia.org/wiki/The_Home_Depot"
  },
  {
    id: "wells-fargo",
    name: "Wells Fargo",
    description: "Wells Fargo is a major financial services company providing banking, investment, mortgage, and consumer and commercial financial services.",
    logo: "simple-icons:wellsfargo",
    search: "http://en.wikipedia.org/wiki/Wells_Fargo"
  },
  {
    id: "bank-of-america",
    name: "Bank of America",
    description: "Bank of America is one of the largest financial institutions, offering banking, investment, and wealth management services to individuals and businesses.",
    logo: "simple-icons:bankofamerica",
    search: "http://en.wikipedia.org/wiki/Bank_of_America"
  },
  {
    id: "target",
    name: "Target",
    description: "Target is a major retail corporation operating discount stores offering a wide range of products including clothing, electronics, groceries, and household items.",
    logo: "simple-icons:target",
    search: "http://en.wikipedia.org/wiki/Target_Corporation"
  },
  {
    id: "coca-cola",
    name: "The Coca-Cola Company",
    description: "Coca-Cola is the world's largest beverage company, producing and distributing soft drinks, juices, and other beverages in over 200 countries.",
    logo: "simple-icons:cocacola",
    search: "http://en.wikipedia.org/wiki/The_Coca-Cola_Company"
  },
  {
    id: "pepsico",
    name: "PepsiCo",
    description: "PepsiCo is a global food and beverage company producing snacks, soft drinks, and consumer goods under brands like Pepsi, Frito-Lay, and Quaker.",
    logo: "simple-icons:pepsi",
    search: "http://en.wikipedia.org/wiki/PepsiCo"
  },
  {
    id: "johnson-johnson",
    name: "Johnson & Johnson",
    description: "Johnson & Johnson is a multinational corporation manufacturing pharmaceuticals, medical devices, and consumer health products worldwide.",
    logo: "simple-icons:johnsonandjohnson",
    search: "http://en.wikipedia.org/wiki/Johnson_%26_Johnson"
  },
  {
    id: "pfizer",
    name: "Pfizer",
    description: "Pfizer is a leading pharmaceutical company developing and manufacturing medicines and vaccines for various diseases and health conditions.",
    logo: "simple-icons:pfizer",
    search: "http://en.wikipedia.org/wiki/Pfizer"
  },
  {
    id: "merck",
    name: "Merck",
    description: "Merck is a global healthcare company focused on discovering, developing, and providing innovative medicines, vaccines, and animal health products.",
    logo: "simple-icons:merck",
    search: "http://en.wikipedia.org/wiki/Merck_%26_Co."
  },
  {
    id: "visa",
    name: "Visa",
    description: "Visa is a global payments technology company facilitating electronic funds transfers and providing credit, debit, and prepaid card services worldwide.",
    logo: "simple-icons:visa",
    search: "http://en.wikipedia.org/wiki/Visa_Inc."
  },
  {
    id: "mastercard",
    name: "Mastercard",
    description: "Mastercard is a leading global payments technology company connecting consumers, businesses, and financial institutions through secure payment solutions.",
    logo: "simple-icons:mastercard",
    search: "http://en.wikipedia.org/wiki/Mastercard"
  },
  {
    id: "procter-gamble",
    name: "Procter & Gamble",
    description: "Procter & Gamble is a multinational consumer goods corporation manufacturing a wide range of household and personal care products.",
    logo: "simple-icons:proctergamble",
    search: "http://en.wikipedia.org/wiki/Procter_%26_Gamble"
  },
  {
    id: "unilever",
    name: "Unilever",
    description: "Unilever is a British-Dutch multinational consumer goods company producing food, beverages, cleaning agents, and personal care products.",
    logo: "simple-icons:unilever",
    search: "http://en.wikipedia.org/wiki/Unilever"
  },
  {
    id: "boeing",
    name: "Boeing",
    description: "Boeing is a major aerospace manufacturer producing commercial airplanes, defense systems, and space technology for customers worldwide.",
    logo: "simple-icons:boeing",
    search: "http://en.wikipedia.org/wiki/Boeing"
  },
  {
    id: "lockheed-martin",
    name: "Lockheed Martin",
    description: "Lockheed Martin is a global aerospace, defense, and security company developing advanced technology systems for defense and commercial applications.",
    logo: "simple-icons:lockheedmartin",
    search: "http://en.wikipedia.org/wiki/Lockheed_Martin"
  },
  {
    id: "general-electric",
    name: "General Electric",
    description: "General Electric is a multinational conglomerate operating in power, renewable energy, aviation, healthcare, and digital industrial sectors.",
    logo: "simple-icons:generalelectric",
    search: "http://en.wikipedia.org/wiki/General_Electric"
  },
  {
    id: "caterpillar",
    name: "Caterpillar",
    description: "Caterpillar is the world's leading manufacturer of construction and mining equipment, diesel and natural gas engines, and industrial turbines.",
    logo: "simple-icons:caterpillar",
    search: "http://en.wikipedia.org/wiki/Caterpillar_Inc."
  },
  {
    id: "deere",
    name: "Deere & Company",
    description: "Deere & Company manufactures agricultural, construction, and forestry machinery, diesel engines, and lawn care equipment under the John Deere brand.",
    logo: "simple-icons:johndeere",
    search: "http://en.wikipedia.org/wiki/Deere_%26_Company"
  },
  {
    id: "3m",
    name: "3M",
    description: "3M is a multinational conglomerate producing a diverse range of products including adhesives, abrasives, medical devices, and consumer goods.",
    logo: "simple-icons:3m",
    search: "http://en.wikipedia.org/wiki/3M"
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    description: "Goldman Sachs is a leading global investment banking, securities, and investment management firm serving corporations, governments, and individuals.",
    logo: "simple-icons:goldmansachs",
    search: "http://en.wikipedia.org/wiki/Goldman_Sachs"
  },
  {
    id: "morgan-stanley",
    name: "Morgan Stanley",
    description: "Morgan Stanley is a global financial services firm providing investment banking, securities, wealth management, and investment management services.",
    logo: "simple-icons:morganstanley",
    search: "http://en.wikipedia.org/wiki/Morgan_Stanley"
  },
  {
    id: "citigroup",
    name: "Citigroup",
    description: "Citigroup is a global financial services corporation providing banking, credit cards, investment services, and consumer finance to customers worldwide.",
    logo: "simple-icons:citigroup",
    search: "http://en.wikipedia.org/wiki/Citigroup"
  },
  {
    id: "american-express",
    name: "American Express",
    description: "American Express is a global financial services company known for credit cards, charge cards, and travel services for consumers and businesses.",
    logo: "simple-icons:americanexpress",
    search: "http://en.wikipedia.org/wiki/American_Express"
  },
  {
    id: "fedex",
    name: "FedEx",
    description: "FedEx is a global logistics and shipping company providing express delivery, freight, and supply chain management services worldwide.",
    logo: "simple-icons:fedex",
    search: "http://en.wikipedia.org/wiki/FedEx"
  },
  {
    id: "ups",
    name: "United Parcel Service",
    description: "UPS is a global package delivery and supply chain management company providing logistics and transportation services to businesses and consumers.",
    logo: "simple-icons:ups",
    search: "http://en.wikipedia.org/wiki/United_Parcel_Service"
  },
  {
    id: "delta-air-lines",
    name: "Delta Air Lines",
    description: "Delta Air Lines is one of the world's largest airlines, operating flights to destinations across the globe with a focus on customer service and reliability.",
    logo: "simple-icons:delta",
    search: "http://en.wikipedia.org/wiki/Delta_Air_Lines"
  },
  {
    id: "united-airlines",
    name: "United Airlines",
    description: "United Airlines is a major American airline operating domestic and international flights, serving destinations worldwide with a comprehensive route network.",
    logo: "simple-icons:unitedairlines",
    search: "http://en.wikipedia.org/wiki/United_Airlines"
  },
  {
    id: "american-airlines",
    name: "American Airlines",
    description: "American Airlines is one of the world's largest airlines, operating flights to hundreds of destinations across the Americas, Europe, and Asia.",
    logo: "simple-icons:americanairlines",
    search: "http://en.wikipedia.org/wiki/American_Airlines"
  },
  {
    id: "comcast",
    name: "Comcast",
    description: "Comcast is a global media and technology company providing cable, internet, phone, and streaming services, including NBCUniversal and Xfinity.",
    logo: "simple-icons:comcast",
    search: "http://en.wikipedia.org/wiki/Comcast"
  },
  {
    id: "disney",
    name: "The Walt Disney Company",
    description: "Disney is a diversified entertainment company creating movies, TV shows, theme parks, and streaming platforms like Disney+, enchanting audiences globally.",
    logo: "tabler:brand-disney",
    search: "http://en.wikipedia.org/wiki/The_Walt_Disney_Company"
  },
  {
    id: "starbucks",
    name: "Starbucks",
    description: "Starbucks is the world's largest coffeehouse chain, operating thousands of stores globally and offering coffee, tea, and food products.",
    logo: "simple-icons:starbucks",
    search: "http://en.wikipedia.org/wiki/Starbucks"
  },
  {
    id: "chipotle",
    name: "Chipotle Mexican Grill",
    description: "Chipotle is a fast-casual restaurant chain specializing in Mexican-inspired food, known for its commitment to fresh ingredients and sustainable sourcing.",
    logo: "simple-icons:chipotle",
    search: "http://en.wikipedia.org/wiki/Chipotle_Mexican_Grill"
  },
  {
    id: "adobe",
    name: "Adobe",
    description: "Adobe is a software company known for creative and digital marketing solutions, including Photoshop, Illustrator, and cloud-based services.",
    logo: "simple-icons:adobe",
    search: "http://en.wikipedia.org/wiki/Adobe_Inc."
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Salesforce is a cloud-based software company providing customer relationship management (CRM) and enterprise cloud computing solutions.",
    logo: "simple-icons:salesforce",
    search: "http://en.wikipedia.org/wiki/Salesforce"
  },
  {
    id: "cisco",
    name: "Cisco Systems",
    description: "Cisco is a technology conglomerate specializing in networking hardware, software, and telecommunications equipment for businesses and service providers.",
    logo: "simple-icons:cisco",
    search: "http://en.wikipedia.org/wiki/Cisco"
  },
  {
    id: "qualcomm",
    name: "Qualcomm",
    description: "Qualcomm is a semiconductor and telecommunications equipment company, known for developing mobile chipsets and wireless communication technologies.",
    logo: "simple-icons:qualcomm",
    search: "http://en.wikipedia.org/wiki/Qualcomm"
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    description: "NVIDIA is a technology company designing graphics processing units (GPUs) for gaming, data centers, and artificial intelligence applications.",
    logo: "simple-icons:nvidia",
    search: "http://en.wikipedia.org/wiki/Nvidia"
  },
  {
    id: "amd",
    name: "Advanced Micro Devices",
    description: "AMD is a semiconductor company designing and manufacturing microprocessors, graphics processors, and other computing technologies.",
    logo: "simple-icons:amd",
    search: "http://en.wikipedia.org/wiki/Advanced_Micro_Devices"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPal is a financial technology company operating an online payment system that supports money transfers and serves as an electronic alternative to traditional methods.",
    logo: "simple-icons:paypal",
    search: "http://en.wikipedia.org/wiki/PayPal"
  },
  {
    id: "ebay",
    name: "eBay",
    description: "eBay is an e-commerce platform enabling individuals and businesses to buy and sell goods through online auctions and fixed-price listings.",
    logo: "simple-icons:ebay",
    search: "http://en.wikipedia.org/wiki/EBay"
  },
  {
    id: "best-buy",
    name: "Best Buy",
    description: "Best Buy is a consumer electronics retailer operating stores and online platforms, offering electronics, appliances, and technology services.",
    logo: "simple-icons:bestbuy",
    search: "http://en.wikipedia.org/wiki/Best_Buy"
  },
  {
    id: "lowes",
    name: "Lowe's",
    description: "Lowe's is a major home improvement retailer offering tools, appliances, building materials, and services for DIY and professional customers.",
    logo: "simple-icons:lowes",
    search: "http://en.wikipedia.org/wiki/Lowe%27s"
  },
  {
    id: "kraft-heinz",
    name: "The Kraft Heinz Company",
    description: "Kraft Heinz is a food and beverage company manufacturing and marketing processed foods, condiments, and beverages under various well-known brands.",
    logo: "simple-icons:kraftheinz",
    search: "http://en.wikipedia.org/wiki/The_Kraft_Heinz_Company"
  },
  {
    id: "general-mills",
    name: "General Mills",
    description: "General Mills is a multinational manufacturer and marketer of branded consumer foods, including cereals, snacks, and baking products.",
    logo: "simple-icons:generalmills",
    search: "http://en.wikipedia.org/wiki/General_Mills"
  },
  {
    id: "kellogg",
    name: "Kellogg Company",
    description: "Kellogg's is a multinational food manufacturing company producing cereals, snacks, and convenience foods under various popular brands.",
    logo: "simple-icons:kelloggs",
    search: "http://en.wikipedia.org/wiki/Kellogg%27s"
  },
  {
    id: "honeywell",
    name: "Honeywell",
    description: "Honeywell is a multinational conglomerate producing commercial and consumer products, engineering services, and aerospace systems.",
    logo: "simple-icons:honeywell",
    search: "http://en.wikipedia.org/wiki/Honeywell"
  },
  {
    id: "raytheon",
    name: "Raytheon Technologies",
    description: "Raytheon Technologies is an aerospace and defense company providing advanced systems and services for commercial, military, and government customers.",
    logo: "simple-icons:raytheon",
    search: "http://en.wikipedia.org/wiki/Raytheon_Technologies"
  },
  {
    id: "northrop-grumman",
    name: "Northrop Grumman",
    description: "Northrop Grumman is a global aerospace and defense technology company developing advanced systems for military and commercial applications.",
    logo: "simple-icons:northropgrumman",
    search: "http://en.wikipedia.org/wiki/Northrop_Grumman"
  },
  {
    id: "deutsche-bank",
    name: "Deutsche Bank",
    description: "Deutsche Bank is a global investment bank and financial services company providing banking, investment, and asset management services.",
    logo: "simple-icons:deutschebank",
    search: "http://en.wikipedia.org/wiki/Deutsche_Bank"
  },
  {
    id: "ubs",
    name: "UBS",
    description: "UBS is a global financial services company providing wealth management, investment banking, and asset management services to clients worldwide.",
    logo: "simple-icons:ubs",
    search: "http://en.wikipedia.org/wiki/UBS"
  },
  {
    id: "sap",
    name: "SAP",
    description: "SAP is a German software corporation providing enterprise software for managing business operations and customer relations.",
    logo: "simple-icons:sap",
    search: "http://en.wikipedia.org/wiki/SAP_SE"
  },
  {
    id: "accenture",
    name: "Accenture",
    description: "Accenture is a global professional services company providing consulting, technology, and outsourcing services to help businesses improve performance.",
    logo: "simple-icons:accenture",
    search: "http://en.wikipedia.org/wiki/Accenture"
  },
  {
    id: "deloitte",
    name: "Deloitte",
    description: "Deloitte is one of the Big Four accounting firms, providing audit, consulting, tax, and advisory services to clients globally.",
    logo: "simple-icons:deloitte",
    search: "http://en.wikipedia.org/wiki/Deloitte"
  },
  {
    id: "pwc",
    name: "PricewaterhouseCoopers",
    description: "PwC is a global professional services network providing assurance, tax, and advisory services, and is one of the Big Four accounting firms.",
    logo: "simple-icons:pwc",
    search: "http://en.wikipedia.org/wiki/PricewaterhouseCoopers"
  },
  {
    id: "ernst-young",
    name: "Ernst & Young",
    description: "EY is a global professional services firm providing assurance, tax, consulting, and advisory services, and is one of the Big Four accounting firms.",
    logo: "simple-icons:ernstyoung",
    search: "http://en.wikipedia.org/wiki/Ernst_%26_Young"
  },
  {
    id: "kpmg",
    name: "KPMG",
    description: "KPMG is a global professional services network providing audit, tax, and advisory services, and is one of the Big Four accounting firms.",
    logo: "simple-icons:kpmg",
    search: "http://en.wikipedia.org/wiki/KPMG"
  }
];