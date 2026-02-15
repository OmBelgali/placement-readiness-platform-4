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
  if (!jdText || typeof jdText !== "string") {
    return { byCategory: {}, categories: ["General fresher stack"], allSkills: ["General fresher stack"] }
  }

  const text = jdText.toLowerCase()
  const byCategory = {}
  const categories = []

  for (const [key, cat] of Object.entries(SKILL_CATEGORIES)) {
    const found = []
    for (const kw of cat.keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      if (regex.test(text)) found.push(kw)
    }
    if (found.length > 0) {
      byCategory[cat.label] = found
      categories.push(cat.label)
    }
  }

  if (categories.length === 0) {
    return { byCategory: { "General": ["General fresher stack"] }, categories: ["General fresher stack"], allSkills: ["General fresher stack"] }
  }

  const allSkills = Object.values(byCategory).flat()
  return { byCategory, categories, allSkills }
}

function getChecklistForRound(roundNum, extracted) {
  const { byCategory, categories } = extracted
  const has = (cat) => categories.includes(cat)

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
    { round: "Round 1: Aptitude / Basics", items: getChecklistForRound(1, extracted) },
    { round: "Round 2: DSA + Core CS", items: getChecklistForRound(2, extracted) },
    { round: "Round 3: Tech Interview (Projects + Stack)", items: getChecklistForRound(3, extracted) },
    { round: "Round 4: Managerial / HR", items: getChecklistForRound(4, extracted) },
  ]
}

function get7DayPlan(extracted) {
  const { byCategory, categories } = extracted
  const has = (cat) => categories.includes(cat)

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

  return base.map((d) => ({ ...d, items: d.items.slice(0, 6) }))
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
  "General fresher stack": [
    "Tell me about a project you're proud of.",
    "How do you approach a new problem?",
    "Describe a time you learned something difficult.",
    "What interests you about this role?",
    "Where do you see yourself in 5 years?",
  ],
}

export function generateQuestions(extracted) {
  const { categories } = extracted
  const questions = []
  const used = new Set()

  for (const cat of categories) {
    const pool = QUESTION_TEMPLATES[cat] || QUESTION_TEMPLATES["General fresher stack"]
    for (const q of pool) {
      if (!used.has(q) && questions.length < 10) {
        questions.push(q)
        used.add(q)
      }
    }
  }

  if (questions.length < 10) {
    for (const q of QUESTION_TEMPLATES["General fresher stack"]) {
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
  const catCount = extracted.categories.filter((c) => c !== "General fresher stack").length
  score += Math.min(catCount * 5, 30)
  if (company && company.trim().length > 0) score += 10
  if (role && role.trim().length > 0) score += 10
  if (jdText && jdText.length > 800) score += 10
  return Math.min(score, 100)
}

export function analyzeJD(company, role, jdText) {
  const extracted = extractSkills(jdText)
  const checklist = generateChecklist(extracted)
  const plan = generate7DayPlan(extracted)
  const questions = generateQuestions(extracted)
  const readinessScore = calculateReadinessScore(company, role, jdText, extracted)

  return {
    extractedSkills: extracted,
    checklist,
    plan,
    questions,
    readinessScore,
  }
}
