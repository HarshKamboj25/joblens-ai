// ============================================================
// data/jobMarketData.js  —  JobLens core dataset
// ============================================================

export const META = {
  totalJobs: 12847,
  totalSkills: 284,
  dataDate: "March 2025",
  sourcesCount: 18,
};

// ── Skills ─────────────────────────────────────────────────
export const SKILLS = [
  { id: "python",      name: "Python",           cat: "lang",  pct: 87, mentions: 11176, avgSalary: 125000, growth: 12,  trend: [75,77,79,80,81,83,83,84,85,86,86,87] },
  { id: "sql",         name: "SQL",              cat: "data",  pct: 79, mentions: 10145, avgSalary: 108000, growth: 8,   trend: [70,71,72,73,74,75,76,77,77,78,78,79] },
  { id: "ml",          name: "Machine Learning", cat: "ml",    pct: 68, mentions: 8736,  avgSalary: 138000, growth: 22,  trend: [52,54,57,59,62,63,65,66,67,68,68,68] },
  { id: "aws",         name: "AWS",              cat: "cloud", pct: 61, mentions: 7837,  avgSalary: 128000, growth: 18,  trend: [45,47,48,50,51,52,54,55,57,58,60,61] },
  { id: "tensorflow",  name: "TensorFlow",       cat: "ml",    pct: 54, mentions: 6937,  avgSalary: 142000, growth: 15,  trend: [42,43,45,47,48,50,51,52,53,54,54,54] },
  { id: "react",       name: "React",            cat: "web",   pct: 52, mentions: 6680,  avgSalary: 118000, growth: 11,  trend: [44,45,46,47,48,49,50,51,51,52,52,52] },
  { id: "docker",      name: "Docker",           cat: "cloud", pct: 49, mentions: 6295,  avgSalary: 132000, growth: 24,  trend: [35,37,39,41,42,44,45,46,47,48,49,49] },
  { id: "pandas",      name: "Pandas",           cat: "data",  pct: 47, mentions: 6036,  avgSalary: 112000, growth: 9,   trend: [40,41,42,43,44,44,45,45,46,46,47,47] },
  { id: "pytorch",     name: "PyTorch",          cat: "ml",    pct: 45, mentions: 5781,  avgSalary: 148000, growth: 31,  trend: [28,30,32,34,36,38,40,41,43,44,45,45] },
  { id: "kubernetes",  name: "Kubernetes",       cat: "cloud", pct: 42, mentions: 5396,  avgSalary: 145000, growth: 28,  trend: [25,27,29,31,33,35,37,38,40,41,42,42] },
  { id: "spark",       name: "Apache Spark",     cat: "data",  pct: 38, mentions: 4882,  avgSalary: 135000, growth: 14,  trend: [30,31,32,33,34,35,36,37,37,38,38,38] },
  { id: "gcp",         name: "GCP",              cat: "cloud", pct: 35, mentions: 4496,  avgSalary: 130000, growth: 20,  trend: [25,26,27,28,29,30,31,32,33,34,35,35] },
  { id: "langchain",   name: "LangChain",        cat: "ml",    pct: 32, mentions: 4111,  avgSalary: 152000, growth: 89,  trend: [4,6,8,11,15,18,21,24,27,29,31,32]  },
  { id: "typescript",  name: "TypeScript",       cat: "web",   pct: 30, mentions: 3854,  avgSalary: 122000, growth: 19,  trend: [20,21,22,23,24,25,26,27,28,29,30,30] },
  { id: "azure",       name: "Azure",            cat: "cloud", pct: 29, mentions: 3726,  avgSalary: 126000, growth: 16,  trend: [22,22,23,24,25,25,26,27,28,28,29,29] },
  { id: "dbt",         name: "dbt",              cat: "data",  pct: 27, mentions: 3468,  avgSalary: 125000, growth: 45,  trend: [12,14,16,18,20,21,22,23,24,25,26,27] },
  { id: "go",          name: "Go",               cat: "lang",  pct: 25, mentions: 3212,  avgSalary: 135000, growth: 17,  trend: [18,19,20,21,22,22,23,23,24,24,25,25] },
  { id: "fastapi",     name: "FastAPI",          cat: "web",   pct: 22, mentions: 2826,  avgSalary: 118000, growth: 38,  trend: [8,9,11,13,15,17,18,19,20,21,22,22]  },
  { id: "vectordb",    name: "Vector DB",        cat: "ml",    pct: 18, mentions: 2314,  avgSalary: 155000, growth: 120, trend: [2,3,4,6,9,11,13,14,15,16,17,18]     },
  { id: "airflow",     name: "Apache Airflow",   cat: "data",  pct: 24, mentions: 3085,  avgSalary: 128000, growth: 21,  trend: [16,17,18,19,20,21,22,22,23,23,24,24] },
  { id: "kafka",       name: "Apache Kafka",     cat: "data",  pct: 20, mentions: 2570,  avgSalary: 138000, growth: 25,  trend: [13,14,15,16,17,18,18,19,19,20,20,20] },
  { id: "nodejs",      name: "Node.js",          cat: "web",   pct: 34, mentions: 4368,  avgSalary: 115000, growth: 8,   trend: [28,29,30,31,31,32,32,33,33,34,34,34] },
  { id: "rust",        name: "Rust",             cat: "lang",  pct: 12, mentions: 1542,  avgSalary: 145000, growth: 52,  trend: [4,5,6,7,8,8,9,10,11,11,12,12]       },
  { id: "rag",         name: "RAG",              cat: "ml",    pct: 14, mentions: 1798,  avgSalary: 158000, growth: 210, trend: [1,2,3,4,6,8,10,11,12,13,14,14]      },
];

// ── Job Roles ──────────────────────────────────────────────
export const ROLES = [
  {
    id: "mle", role: "ML Engineer", icon: "🤖", color: "#6c63ff",
    count: 2840, avgSalary: 142000, entryS: 95000, seniorS: 195000,
    topSkills: ["PyTorch","Python","TensorFlow","AWS","Docker"],
    exp: "3–5 yrs", growth: 34, remote: 52,
    description: "Build, train and deploy machine learning models at scale.",
    companies: ["Google","Meta","OpenAI","Anthropic","Nvidia","Uber"],
  },
  {
    id: "ds",  role: "Data Scientist", icon: "📊", color: "#9d97ff",
    count: 2540, avgSalary: 128000, entryS: 85000, seniorS: 172000,
    topSkills: ["Python","SQL","Pandas","Scikit-learn","Statistics"],
    exp: "2–4 yrs", growth: 22, remote: 48,
    description: "Extract insights from complex datasets to guide business decisions.",
    companies: ["Amazon","Netflix","Spotify","Airbnb","LinkedIn","Twitter"],
  },
  {
    id: "ai",  role: "AI Engineer", icon: "✦", color: "#ff6b6b",
    count: 1920, avgSalary: 145000, entryS: 98000, seniorS: 200000,
    topSkills: ["LangChain","Python","RAG","Vector DB","FastAPI"],
    exp: "2–5 yrs", growth: 142, remote: 58,
    description: "Build production AI applications using LLMs and ML pipelines.",
    companies: ["OpenAI","Anthropic","Cohere","Mistral","Hugging Face","Scale AI"],
  },
  {
    id: "da",  role: "Data Analyst", icon: "📈", color: "#ffd166",
    count: 2180, avgSalary: 92000, entryS: 62000, seniorS: 130000,
    topSkills: ["SQL","Excel","Tableau","Python","Power BI"],
    exp: "1–3 yrs", growth: 18, remote: 44,
    description: "Translate data into actionable business insights via dashboards and reports.",
    companies: ["Deloitte","McKinsey","JPMorgan","Accenture","Salesforce","HubSpot"],
  },
  {
    id: "de",  role: "Data Engineer", icon: "⚡", color: "#06d6a0",
    count: 1680, avgSalary: 132000, entryS: 88000, seniorS: 178000,
    topSkills: ["Apache Spark","Python","SQL","Kafka","Airflow"],
    exp: "3–5 yrs", growth: 28, remote: 50,
    description: "Design and maintain data pipelines, warehouses, and infrastructure.",
    companies: ["Snowflake","Databricks","Palantir","Stripe","Square","Twilio"],
  },
  {
    id: "fs",  role: "Full Stack Dev", icon: "◈", color: "#4ecdc4",
    count: 1480, avgSalary: 118000, entryS: 78000, seniorS: 165000,
    topSkills: ["React","TypeScript","Node.js","SQL","Docker"],
    exp: "2–4 yrs", growth: 15, remote: 55,
    description: "Build end-to-end web applications from database to user interface.",
    companies: ["Shopify","Atlassian","GitHub","Vercel","Cloudflare","Figma"],
  },
  {
    id: "mlops", role: "MLOps Engineer", icon: "⚙", color: "#f7b731",
    count: 820, avgSalary: 138000, entryS: 92000, seniorS: 185000,
    topSkills: ["Kubernetes","Docker","MLflow","Python","AWS"],
    exp: "3–6 yrs", growth: 67, remote: 46,
    description: "Bridge ML models and production systems — CI/CD for machine learning.",
    companies: ["Databricks","Weights & Biases","Neptune.ai","Azure ML","SageMaker","Vertex AI"],
  },
  {
    id: "devops", role: "DevOps / SRE", icon: "☁", color: "#45b7d1",
    count: 1400, avgSalary: 125000, entryS: 82000, seniorS: 172000,
    topSkills: ["Kubernetes","Docker","AWS","Terraform","Python"],
    exp: "3–5 yrs", growth: 12, remote: 53,
    description: "Ensure reliability, scalability and deployment velocity of cloud systems.",
    companies: ["AWS","Google Cloud","Azure","HashiCorp","Datadog","PagerDuty"],
  },
];

// ── Geography ──────────────────────────────────────────────
export const GEO = [
  { city: "San Francisco", country: "US", count: 2840, pct: 100, color: "#6c63ff", topRole: "AI Engineer",    avgSalary: 168000 },
  { city: "New York",      country: "US", count: 2140, pct: 75,  color: "#9d97ff", topRole: "Data Scientist", avgSalary: 145000 },
  { city: "Seattle",       country: "US", count: 1680, pct: 59,  color: "#4ecdc4", topRole: "ML Engineer",    avgSalary: 152000 },
  { city: "Austin",        country: "US", count: 1240, pct: 44,  color: "#06d6a0", topRole: "Full Stack Dev",  avgSalary: 128000 },
  { city: "Bengaluru",     country: "IN", count: 1180, pct: 42,  color: "#ffd166", topRole: "Data Engineer",   avgSalary: 42000  },
  { city: "Remote",        country: "—",  count: 980,  pct: 35,  color: "#ff6b6b", topRole: "AI Engineer",    avgSalary: 138000 },
  { city: "Boston",        country: "US", count: 840,  pct: 30,  color: "#f7b731", topRole: "ML Engineer",    avgSalary: 148000 },
  { city: "Hyderabad",     country: "IN", count: 780,  pct: 27,  color: "#45b7d1", topRole: "Data Analyst",   avgSalary: 36000  },
  { city: "London",        country: "UK", count: 720,  pct: 25,  color: "#a29bfe", topRole: "Data Scientist", avgSalary: 95000  },
  { city: "Toronto",       country: "CA", count: 560,  pct: 20,  color: "#fd79a8", topRole: "Full Stack Dev",  avgSalary: 105000 },
];

// ── Skill Gap Role Requirements ────────────────────────────
export const SKILL_GAP_ROLES = {
  mle:   { name: "ML Engineer",    required: ["Python","PyTorch","TensorFlow","SQL","Scikit-learn","AWS","Docker","Statistics","MLflow","Git"] },
  ds:    { name: "Data Scientist",  required: ["Python","SQL","Pandas","Scikit-learn","Statistics","Machine Learning","Matplotlib","R","A/B Testing","NLP"] },
  ai:    { name: "AI Engineer",     required: ["Python","LangChain","RAG","Vector DB","FastAPI","Docker","AWS","OpenAI API","Prompt Eng","MLOps"] },
  da:    { name: "Data Analyst",    required: ["SQL","Excel","Power BI","Python","Tableau","Statistics","DAX","ETL","Data Storytelling","R"] },
  de:    { name: "Data Engineer",   required: ["Python","SQL","Apache Spark","Airflow","Kafka","Docker","AWS","dbt","Hadoop","Scala"] },
  fs:    { name: "Full Stack Dev",  required: ["React","TypeScript","Node.js","SQL","CSS","Git","REST APIs","Docker","Testing","AWS"] },
  mlops: { name: "MLOps Engineer",  required: ["Kubernetes","Docker","Python","MLflow","AWS","Terraform","CI/CD","Prometheus","Grafana","Ansible"] },
  devops:{ name: "DevOps / SRE",   required: ["Kubernetes","Docker","AWS","Terraform","Python","CI/CD","Linux","Monitoring","Bash","Helm"] },
};

// ── Monthly trend labels ───────────────────────────────────
export const MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

// ── Category meta ─────────────────────────────────────────
export const CATEGORIES = {
  lang:  { label: "Languages",  color: "#6c63ff" },
  ml:    { label: "AI / ML",    color: "#ff6b6b" },
  cloud: { label: "Cloud",      color: "#06d6a0" },
  data:  { label: "Data",       color: "#ffd166" },
  web:   { label: "Web",        color: "#45b7d1" },
};

// ── Salary time series (2021–2025) ─────────────────────────
export const SALARY_HISTORY = {
  years: ["2021","2022","2023","2024","2025"],
  roles: {
    mle:    [108000, 118000, 128000, 136000, 142000],
    ds:     [102000, 110000, 116000, 122000, 128000],
    ai:     [105000, 115000, 128000, 138000, 145000],
    da:     [75000,  80000,  84000,  88000,  92000 ],
    de:     [108000, 115000, 122000, 128000, 132000],
    fs:     [98000,  104000, 109000, 114000, 118000],
    mlops:  [102000, 112000, 122000, 132000, 138000],
    devops: [105000, 110000, 115000, 120000, 125000],
  }
};

// ── Forecast data ─────────────────────────────────────────
export const FORECAST = {
  labels: ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25"],
  actual_end: 4,  // index where actuals end
  series: [
    { name: "LLM Tools",     color: "#ff6b6b", data: [8,14,20,28,32,38,45,52]  },
    { name: "Cloud Native",  color: "#06d6a0", data: [42,44,47,50,55,58,61,65] },
    { name: "Vector DB",     color: "#ffd166", data: [2,4,8,14,18,25,33,42]    },
    { name: "Traditional BI",color: "#9699b0", data: [68,65,61,57,53,50,47,44] },
  ]
};

// ── AI Insights ───────────────────────────────────────────
export const INSIGHTS = [
  {
    id: "rag", emoji: "🔥", title: "Hottest Emerging Skill: 2025",
    hero: "RAG", heroBig: true,
    body: "Retrieval-Augmented Generation now appears in 34% of AI Engineer postings, up from just 6% in 2023. Companies are hiring engineers who can build production-grade LLM pipelines with accurate, grounded outputs.",
    tags: [{ label: "AI/ML", color: "#6c63ff" }, { label: "↑ 467% YoY", color: "#06d6a0" }],
  },
  {
    id: "path", emoji: "💡", title: "Career Path Spotlight",
    hero: "Data → AI",
    body: "Data Analysts transitioning to AI roles see an average 48% salary increase. The bridge skills are Python and SQL (already known), plus LangChain, vector databases, and prompt engineering.",
    tags: [{ label: "Career Path", color: "#ffd166" }, { label: "+48% salary", color: "#06d6a0" }],
  },
  {
    id: "aieng", emoji: "📈", title: "Role Explosion: AI Engineer",
    hero: "+142%",
    body: "AI Engineer as a title barely existed in 2022. In 2025, it represents 8.4% of all tech postings. Companies want people who bridge ML research and software engineering — not pure researchers.",
    tags: [{ label: "↑ 142% YoY", color: "#ff6b6b" }, { label: "8.4% of market", color: "#9d97ff" }],
  },
  {
    id: "remote", emoji: "🌏", title: "Remote vs On-site Shift",
    hero: "38%",
    body: "Remote roles peaked at 62% in 2021 and have stabilized at 38% for tech in 2025. Hybrid (3 days office) is now dominant at 44%. Fully on-site is growing for AI research roles.",
    tags: [{ label: "Market Trend", color: "#6c63ff" }, { label: "44% hybrid", color: "#45b7d1" }],
  },
  {
    id: "depr", emoji: "⚡", title: "Skill Depreciation Alert",
    hero: "Pivot Now",
    body: "MATLAB, SAS, and standalone Tableau are declining. Companies want Python-native analytics with Polars, DuckDB, or dbt. Upskilling from these tools is urgent for mid-career analysts.",
    tags: [{ label: "↓ Declining", color: "#ff6b6b" }, { label: "Mid-career risk", color: "#ffd166" }],
  },
  {
    id: "roi", emoji: "💰", title: "Highest ROI Learning Path",
    hero: "+$31K",
    body: "For a Python developer, adding Kubernetes and AWS certifications yields the highest salary ROI — an average $31K annual increase based on comparative job postings across experience levels.",
    tags: [{ label: "+$31K avg lift", color: "#06d6a0" }, { label: "Cloud", color: "#4ecdc4" }],
  },
];
