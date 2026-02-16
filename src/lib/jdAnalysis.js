/**
 * JD Analysis - Skill extraction & generation (heuristic, no external APIs)
 */

const SKILL_CATEGORIES = {
  coreCS: {
    label: "Core CS",
    keywords: ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Operating System", "Computer Networks"],
  },
  languages: {
    label: "Languages",
    keywords: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust", "Kotlin", "Swift"],
  },
  web: {
    label: "Web",
    keywords: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "Angular", "Vue", "HTML", "CSS"],
  },
  data: {
    label: "Data",
    keywords: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Elasticsearch"],
  },
  cloudDevOps: {
    label: "Cloud/DevOps",
    keywords: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Jenkins", "Terraform"],
  },
  testing: {
    label: "Testing",
    keywords: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Mocha", "Unit Testing"],
  },
}

export function extractSkills(jdText) {
  const empty = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  }

  if (!jdText || typeof jdText !== "string") {
    empty.other = ["Communication", "Problem solving", "Basic coding", "Projects"]
    return empty
  }

  const text = jdText.toLowerCase()
  const out = { ...empty }

  for (const [key, cat] of Object.entries(SKILL_CATEGORIES)) {
    const found = []
    for (const kw of cat.keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      if (regex.test(text)) found.push(kw)
    }
    const schemaKey = key === "cloudDevOps" ? "cloud" : key
    if (found.length > 0) out[schemaKey] = found
  }

  const hasAny = Object.values(out).some((arr) => arr.length > 0)
  if (!hasAny) {
    out.other = ["Communication", "Problem solving", "Basic coding", "Projects"]
  }

  return out
}

function hasCategory(extracted, cat) {
  const map = {
    "Core CS": "coreCS",
    Languages: "languages",
    Web: "web",
    Data: "data",
    "Cloud/DevOps": "cloud",
    Testing: "testing",
  }
  const key = map[cat]
  return key && Array.isArray(extracted[key]) && extracted[key].length > 0
}

function getChecklistForRound(roundNum, extracted) {
  const has = (cat) => hasCategory(extracted, cat)

  switch (roundNum) {
    case 1:
      return [
        "Revise quantitative aptitude (percentages, ratios, time & work)",
        "Practice logical reasoning and puzzles",
        "Review basic CS fundamentals (binary, number systems)",
        "Time yourself on sample aptitude tests",
        ...(has("Core CS") ? ["Brush up OS and DBMS basics", "Quick revision of Networks fundamentals"] : []),
        "Prepare for verbal reasoning if applicable",
      ].slice(0, 8)

    case 2:
      const dsaItems = has("Core CS") || has("Languages")
        ? [
            "Solve 5 medium DSA problems (arrays, strings)",
            "Revise key algorithms: sorting, searching, DP basics",
            "Practice time & space complexity analysis",
            ...(has("Languages") ? ["Implement 2 problems in your primary language"] : []),
          ]
        : ["Practice basic coding problems", "Revise control structures and loops"]
      return [
        ...dsaItems,
        ...(has("Core CS") ? ["Revise OOP concepts and design", "DBMS: joins, indexing, normalization"] : []),
        "Practice explaining your approach clearly",
      ].slice(0, 8)

    case 3:
      const techItems = [
        "Prepare 2–3 project descriptions (STAR format)",
        "Align resume points with JD requirements",
        ...(has("Web") ? ["Revise React/Node concepts and lifecycle", "Be ready to explain REST/API design"] : []),
        ...(has("Data") ? ["Explain SQL optimization and indexing", "Discuss database design choices"] : []),
        ...(has("Cloud/DevOps") ? ["Explain Docker basics and CI/CD flow", "Describe a deployment you've done"] : []),
        ...(has("Languages") ? ["Language-specific: OOP, memory, concurrency"] : []),
      ].slice(0, 8)
      return techItems.length >= 5 ? techItems : [...techItems, "Prepare system design basics (if applicable)", "Review version control (Git)"]

    case 4:
      return [
        "Prepare 'Tell me about yourself' (2 min)",
        "List 5 strengths and 5 weaknesses with examples",
        "Prepare questions to ask the interviewer",
        "Review company culture and recent news",
        "Prepare behavioral examples (conflict, leadership, failure)",
        "Dress code and punctuality checklist",
        "Relax and get good sleep the night before",
      ].slice(0, 8)

    default:
      return []
  }
}

export function generateChecklist(extracted) {
  return [
    { roundTitle: "Round 1: Aptitude / Basics", items: getChecklistForRound(1, extracted) },
    { roundTitle: "Round 2: DSA + Core CS", items: getChecklistForRound(2, extracted) },
    { roundTitle: "Round 3: Tech Interview (Projects + Stack)", items: getChecklistForRound(3, extracted) },
    { roundTitle: "Round 4: Managerial / HR", items: getChecklistForRound(4, extracted) },
  ]
}

function get7DayPlan(extracted) {
  const has = (cat) => hasCategory(extracted, cat)

  const base = [
    { day: 1, title: "Basics + Core CS", items: ["Quantitative aptitude practice", "Logical reasoning", "OS & DBMS basics", "Networks fundamentals"] },
    { day: 2, title: "Core CS deep dive", items: ["OOP revision", "DBMS indexing & normalization", "Computer architecture basics", "Practice aptitude mock"] },
    { day: 3, title: "DSA + Coding", items: ["Arrays & strings (5 problems)", "Sorting & searching", "Complexity analysis", "Code in primary language"] },
    { day: 4, title: "DSA + Coding", items: ["Trees & graphs basics", "Recursion practice", "2–3 medium problems", "Debug and optimize"] },
    { day: 5, title: "Project + Resume", items: ["Document 2–3 projects", "Align resume with JD", "Prepare STAR stories", "Update LinkedIn"] },
    { day: 6, title: "Mock Interview", items: ["Practice coding aloud", "Mock HR questions", "Behavioral prep", "Time yourself"] },
    { day: 7, title: "Revision + Weak Areas", items: ["Revise weak topics", "Final DSA brush-up", "Rest and stay calm", "Prepare for D-day"] },
  ]

  if (has("Web")) {
    base[4].items.push("Frontend/backend revision")
    base[5].items.push("Explain React/Node concepts")
  }
  if (has("Data")) {
    base[1].items.push("SQL practice")
    base[3].items.push("SQL joins & subqueries")
  }
  if (has("Cloud/DevOps")) {
    base[5].items.push("Deployment & DevOps concepts")
  }
  if (has("Testing")) {
    base[4].items.push("Testing strategy for projects")
  }

  return base.map((d) => ({
    day: d.day,
    focus: d.title,
    tasks: d.items.slice(0, 6),
  }))
}

export function generate7DayPlan(extracted) {
  return get7DayPlan(extracted)
}

const QUESTION_TEMPLATES = {
  "Core CS": [
    "Explain time complexity of common sorting algorithms.",
    "How would you optimize search in sorted data?",
    "Explain OOP pillars with examples.",
    "Describe process vs thread. When to use which?",
    "Explain database indexing and when it helps.",
    "What is normalization? Explain 3NF.",
    "Explain TCP vs UDP. When is each used?",
    "Describe virtual memory and paging.",
  ],
  Languages: [
    "Explain garbage collection in your primary language.",
    "What is the difference between == and equals()?",
    "Explain concurrency and synchronization.",
    "Describe memory management in C/C++.",
    "What are decorators/generics? Give an example.",
  ],
  Web: [
    "Explain state management options in React.",
    "Describe the React lifecycle and hooks.",
    "REST vs GraphQL. When to use each?",
    "Explain authentication (JWT, sessions).",
    "What is the virtual DOM? How does React use it?",
    "Explain server-side vs client-side rendering.",
  ],
  Data: [
    "Explain indexing and when it helps.",
    "SQL: How would you optimize a slow query?",
    "NoSQL vs SQL. Trade-offs?",
    "Explain ACID properties.",
    "Describe MongoDB aggregation pipeline.",
  ],
  "Cloud/DevOps": [
    "Explain Docker vs virtual machines.",
    "What is Kubernetes? Why use it?",
    "Describe a CI/CD pipeline you've used.",
    "How would you debug a production issue?",
    "Explain infrastructure as code.",
  ],
  Testing: [
    "Explain unit vs integration testing.",
    "How do you mock dependencies in tests?",
    "Describe TDD and when to use it.",
    "How would you test an API endpoint?",
  ],
  Other: [
    "Tell me about a project you're proud of.",
    "How do you approach a new problem?",
    "Describe a time you learned something difficult.",
    "What interests you about this role?",
    "Where do you see yourself in 5 years?",
  ],
}

function getCategoriesFromExtracted(extracted) {
  const order = ["Core CS", "Languages", "Web", "Data", "Cloud/DevOps", "Testing", "Other"]
  const map = {
    coreCS: "Core CS",
    languages: "Languages",
    web: "Web",
    data: "Data",
    cloud: "Cloud/DevOps",
    testing: "Testing",
    other: "Other",
  }
  const cats = []
  for (const [key, label] of Object.entries(map)) {
    if (Array.isArray(extracted[key]) && extracted[key].length > 0) cats.push(label)
  }
  return cats.length > 0 ? cats : ["Other"]
}

export function generateQuestions(extracted) {
  const categories = getCategoriesFromExtracted(extracted)
  const questions = []
  const used = new Set()

  for (const cat of categories) {
    const pool = QUESTION_TEMPLATES[cat] || QUESTION_TEMPLATES.Other
    for (const q of pool) {
      if (!used.has(q) && questions.length < 10) {
        questions.push(q)
        used.add(q)
      }
    }
  }

  if (questions.length < 10) {
    for (const q of QUESTION_TEMPLATES.Other) {
      if (!used.has(q) && questions.length < 10) {
        questions.push(q)
        used.add(q)
      }
    }
  }

  return questions.slice(0, 10)
}

export function calculateReadinessScore(company, role, jdText, extracted) {
  let score = 35
  const categories = getCategoriesFromExtracted(extracted)
  const catCount = categories.filter((c) => c !== "Other").length
  score += Math.min(catCount * 5, 30)
  if (company && company.trim().length > 0) score += 10
  if (role && role.trim().length > 0) score += 10
  if (jdText && jdText.length > 800) score += 10
  return Math.min(score, 100)
}

const ENTERPRISE_COMPANIES = [
  "amazon", "google", "microsoft", "meta", "apple", "infosys", "tcs", "wipro", "hcl",
  "accenture", "capgemini", "cognizant", "deloitte", "oracle", "sap", "ibm", "salesforce",
  "adobe", "netflix", "uber", "airbnb", "goldman sachs", "morgan stanley", "jpmorgan",
  "flipkart", "paypal", "vmware", "intel", "qualcomm",
]

const INDUSTRY_KEYWORDS = [
  { keywords: ["finance", "banking", "fintech", "investment"], industry: "Financial Services" },
  { keywords: ["healthcare", "medical", "pharma", "clinical"], industry: "Healthcare" },
  { keywords: ["e-commerce", "ecommerce", "retail", "marketplace"], industry: "E-commerce" },
  { keywords: ["education", "edtech", "learning"], industry: "EdTech" },
  { keywords: ["manufacturing", "automotive", "industrial"], industry: "Manufacturing" },
]

export function getCompanyIntel(company, jdText) {
  if (!company || typeof company !== "string" || !company.trim()) {
    return null
  }

  const name = company.trim()
  const nameLower = name.toLowerCase()
  const text = (jdText || "").toLowerCase()

  let size = "Startup"
  let sizeLabel = "Startup (<200)"
  if (ENTERPRISE_COMPANIES.some((c) => nameLower.includes(c))) {
    size = "Enterprise"
    sizeLabel = "Enterprise (2000+)"
  } else if (text.includes("200") && (text.includes("2000") || text.includes("500"))) {
    size = "Mid-size"
    sizeLabel = "Mid-size (200–2000)"
  }

  let industry = "Technology Services"
  for (const { keywords, industry: ind } of INDUSTRY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) {
      industry = ind
      break
    }
  }

  const hiringFocus = size === "Enterprise"
    ? "Structured DSA rounds, strong core CS fundamentals, and standardized aptitude screening. Expect multiple technical rounds with algorithm-heavy focus."
    : "Practical problem-solving, stack depth, and hands-on coding. Startups often value project fit and culture over formal process."

  return {
    name,
    industry,
    size,
    sizeLabel,
    hiringFocus,
  }
}

const ROUND_WHY = {
  "Online Test (DSA + Aptitude)": "Filters candidates on core aptitude and coding basics before face-to-face rounds.",
  "Technical (DSA + Core CS)": "Assesses depth in algorithms and CS fundamentals. Expect coding and theory.",
  "Tech + Projects": "Evaluates real-world application and project experience aligned with the role.",
  "HR": "Culture fit, behavioral alignment, and communication. Your chance to ask about the team.",
  "Practical coding": "Quick validation of hands-on coding ability. Often live coding or take-home.",
  "System discussion": "Assesses architectural thinking, stack depth, and trade-off reasoning.",
  "Culture fit": "Startup teams value alignment, ownership, and growth mindset over formal credentials.",
  "Aptitude / Basics": "Tests quantitative and logical reasoning. Many companies screen here first.",
  "DSA + Core CS": "Deep dive into data structures and algorithms. Be ready to code and explain.",
  "Projects + Stack": "Discussion of your projects and how they map to the tech stack.",
}

export function getRoundMapping(company, extracted, jdText) {
  const intel = getCompanyIntel(company, jdText || "")
  const size = intel?.size || "Startup"
  const has = (cat) => hasCategory(extracted || {}, cat)
  const hasWeb = has("Web")
  const hasDSA = has("Core CS") || has("Languages")

  const focusFor = (title) => {
    const m = title.match(/(?:Round \d+:\s*)?(.+)/)
    return m ? m[1].split(/[+,]/).map((s) => s.trim()).filter(Boolean) : []
  }

  if (size === "Enterprise" && hasDSA) {
    const rounds = [
      { round: "Round 1: Online Test (DSA + Aptitude)", why: ROUND_WHY["Online Test (DSA + Aptitude)"] },
      { round: "Round 2: Technical (DSA + Core CS)", why: ROUND_WHY["Technical (DSA + Core CS)"] },
      { round: "Round 3: Tech + Projects", why: ROUND_WHY["Tech + Projects"] },
      { round: "Round 4: HR", why: ROUND_WHY["HR"] },
    ]
    return rounds.map((r) => ({ roundTitle: r.round, focusAreas: focusFor(r.round), whyItMatters: r.why }))
  }

  if (size === "Startup" && hasWeb) {
    const rounds = [
      { round: "Round 1: Practical coding", why: ROUND_WHY["Practical coding"] },
      { round: "Round 2: System discussion", why: ROUND_WHY["System discussion"] },
      { round: "Round 3: Culture fit", why: ROUND_WHY["Culture fit"] },
    ]
    return rounds.map((r) => ({ roundTitle: r.round, focusAreas: focusFor(r.round), whyItMatters: r.why }))
  }

  if (size === "Enterprise") {
    const rounds = [
      { round: "Round 1: Aptitude / Basics", why: ROUND_WHY["Aptitude / Basics"] },
      { round: "Round 2: Technical (DSA + Core CS)", why: ROUND_WHY["Technical (DSA + Core CS)"] },
      { round: "Round 3: Tech + Projects", why: ROUND_WHY["Tech + Projects"] },
      { round: "Round 4: HR", why: ROUND_WHY["HR"] },
    ]
    return rounds.map((r) => ({ roundTitle: r.round, focusAreas: focusFor(r.round), whyItMatters: r.why }))
  }

  const rounds = [
    { round: "Round 1: Practical coding", why: ROUND_WHY["Practical coding"] },
    { round: "Round 2: Projects + Stack", why: ROUND_WHY["Projects + Stack"] },
    { round: "Round 3: Culture fit", why: ROUND_WHY["Culture fit"] },
  ]
  return rounds.map((r) => ({ roundTitle: r.round, focusAreas: focusFor(r.round), whyItMatters: r.why }))
}

export function analyzeJD(company, role, jdText) {
  const extracted = extractSkills(jdText)
  const checklist = generateChecklist(extracted)
  const plan7Days = generate7DayPlan(extracted)
  const questions = generateQuestions(extracted)
  const baseScore = calculateReadinessScore(company, role, jdText, extracted)
  const companyIntel = getCompanyIntel(company, jdText)
  const roundMapping = getRoundMapping(company, extracted, jdText)

  return {
    extractedSkills: extracted,
    checklist,
    plan7Days,
    questions,
    baseScore,
    companyIntel,
    roundMapping,
  }
}
