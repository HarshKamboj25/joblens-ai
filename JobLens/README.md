# 📊 JobLens — AI Job Market Analytics Dashboard

> A full-stack web application that analyzes job market trends, visualizes in-demand skills, compares salaries, and provides an interactive Skill Gap Analyzer — built for students, freshers, and career changers.

---

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPIs, top 10 skills, role distribution, salary overview |
| **Skills Analysis** | 24 skills tracked, demand %, 12-month trends, category filter |
| **Job Roles** | 8 roles with openings, salary, growth, company examples |
| **Salary Trends** | Entry/Mid/Senior breakdown, skill premium chart, 5-year history |
| **Geography** | Top 10 cities, job counts, role distribution by location |
| **Skill Gap Analyzer** | Pick a role → see matched + missing skills, radar chart, match % |
| **AI Insights** | 6 market intelligence cards + 12-month technology forecast |

---

## 🗂 Project Structure

```
joblens/
├── frontend/                   # Vanilla JS SPA
│   ├── public/
│   │   └── index.html          # App entry HTML
│   └── src/
│       ├── main.js             # Entry point
│       ├── app.js              # Router + nav + state
│       ├── styles/
│       │   └── global.css      # Full design system
│       ├── data/
│       │   └── jobMarketData.js # All datasets
│       ├── utils/
│       │   ├── charts.js       # Chart.js factory helpers
│       │   └── ui.js           # HTML component builders
│       └── pages/
│           ├── Dashboard.js
│           ├── Skills.js
│           ├── Roles.js
│           ├── Salary.js
│           ├── Geography.js
│           ├── SkillGap.js
│           └── Insights.js
│
├── backend/                    # Python FastAPI
│   ├── main.py                 # FastAPI app + all routes
│   ├── models.py               # Pydantic data models
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── streamlit_app.py        # Streamlit alternative UI
│   ├── data/
│   │   └── seed_data.py        # Full in-memory dataset
│   ├── services/
│   │   ├── analytics.py        # Core analytics computations
│   │   ├── skill_extractor.py  # NLP skill extraction
│   │   └── gap_analyzer.py     # Skill gap engine
│   └── analysis/
│       └── job_market_analysis.py  # Standalone chart generator
│
├── docker-compose.yml
└── README.md
```

---

## ⚡ Quick Start

### Option 1 — Frontend only (no backend needed)

```bash
# Just open in browser — no build step required
open frontend/public/index.html

# OR serve with any static server
npx serve frontend/public
python -m http.server 3000 --directory frontend/public
```

> The frontend is 100% self-contained with embedded data. No backend required for full functionality.

---

### Option 2 — FastAPI Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000

# API docs available at:
# http://localhost:8000/docs      (Swagger UI)
# http://localhost:8000/redoc     (ReDoc)
```

**Key endpoints:**
```
GET  /api/skills          → All skills (filter, sort, search)
GET  /api/roles           → All job roles
GET  /api/geo             → Geographic data
GET  /api/salary          → Salary overview
POST /api/skill-gap       → Analyze skill gap
POST /api/extract-skills  → Extract skills from job description text
GET  /api/insights        → AI market insights
GET  /api/search?q=python → Universal search
```

---

### Option 3 — Streamlit Dashboard (Python UI)

```bash
cd backend
pip install -r requirements.txt
streamlit run streamlit_app.py

# Opens at http://localhost:8501
```

---

### Option 4 — Docker Compose (All services)

```bash
docker-compose up --build

# Frontend  → http://localhost:3000
# FastAPI   → http://localhost:8000
# Streamlit → http://localhost:8501
```

---

### Option 5 — Generate Static Charts (Matplotlib)

```bash
cd backend
pip install -r requirements.txt
python analysis/job_market_analysis.py

# Charts saved to backend/output/
# 1_top_skills.png
# 2_salary_distribution.png
# 3_skill_demand_vs_salary.png
# 4_role_growth.png
# 5_category_pie.png
# 6_skill_trends.png
# 7_geo_hiring.png
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Vanilla JS (ES Modules)** | SPA router, component system |
| **Chart.js 4.4** | Interactive charts (bar, line, doughnut, radar) |
| **CSS Custom Properties** | Full design system, light/dark themes |
| **DM Sans + Syne fonts** | Typography |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | REST API framework |
| **Pydantic v2** | Data validation + serialization |
| **Pandas + NumPy** | Data processing |
| **Matplotlib + Seaborn** | Static chart generation |
| **Plotly** | Interactive Python charts |
| **Streamlit** | Python-native dashboard UI |
| **scikit-learn** | ML utilities |
| **NLTK / spaCy** | NLP skill extraction |
| **Uvicorn** | ASGI server |

---

## 📸 Pages Overview

### Dashboard
- 4 KPI metric cards with animated values
- Top 10 skills horizontal bar chart
- Role distribution doughnut chart
- Salary by role animated bars
- Trending role cards with growth %
- Skills word cloud (size = demand)

### Skills Analysis
- Category filter buttons (All / Languages / AI·ML / Cloud / Data / Web)
- Live search filter
- Horizontal bar chart of skill demand
- 12-month trend line chart (top 4 skills)
- Full sortable skills directory table

### Job Roles
- 8 role metric cards
- Bar chart: openings by role
- Bar chart: YoY growth
- Role details table with top skills + salary
- Individual role profile cards with company examples

### Salary Trends
- 4 KPI cards (highest role, best premium, fastest growth, entry avg)
- Grouped bar: Entry / Mid / Senior by role
- Skill salary premium chart
- 5-year salary history line chart
- Per-role salary breakdown cards

### Geography
- City metric cards (top 4)
- City bar chart with custom colors
- City list with mini progress bars
- Full geo table with avg salary

### Skill Gap Analyzer
- Multi-select: your current skills (saved to localStorage)
- Add/remove skills with live updates
- Target role dropdown
- Matched skills (green) + skills to learn (red)
- Animated match progress bar + % score
- Radar chart: your profile vs role requirements
- 8 role match cards with live recalculation

### AI Insights
- 6 intelligence cards with hero stats
- Technology adoption forecast chart (actuals + dotted projections)
- 3 learning path recommendation cards (students / switchers / mid-career)

---

## 🎨 Design System

- **Dark theme** default with full light mode support
- **Colors:** `--accent #6c63ff`, `--green #06d6a0`, `--red #ff6b6b`, `--yellow #ffd166`
- **Typography:** Syne (headings, 800), DM Sans (body), JetBrains Mono (data)
- **Animations:** `fadeUp` on page load, bar fill transitions (1s cubic-bezier)
- **Responsive:** 4-col → 2-col → 1-col breakpoints at 1024/768px

---

## 📈 Dataset

The embedded dataset covers:
- **24 skills** with demand %, mentions, average salary, YoY growth, 12-month trend arrays
- **8 job roles** with openings, salary bands (entry/mid/senior), top skills, remote %, companies
- **10 cities** with job counts, top role, avg salary
- **5-year salary history** for all 8 roles
- **6 AI insights** with narrative analysis
- **8 skill gap profiles** with required skills per role

---

## 🔮 Extending the Project

### Connect Real Data
```python
# In backend/data/seed_data.py, replace with live scraping:
import requests
from bs4 import BeautifulSoup

def scrape_linkedin_jobs(query, location, pages=5):
    # ... scraping logic
    return jobs_df

def extract_skills_from_jd(text):
    from services.skill_extractor import SkillExtractor
    return SkillExtractor().extract(text)
```

### Add Database
```python
# pip install sqlalchemy alembic
from sqlalchemy import create_engine
engine = create_engine("sqlite:///joblens.db")
# or PostgreSQL: create_engine("postgresql://user:pass@localhost/joblens")
```

### Add Authentication
```python
# pip install python-jose passlib
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```

---

## 👨‍💻 Resume Value

This project demonstrates:
- ✅ Full-stack development (JS frontend + Python backend)
- ✅ Data analysis with Pandas / NumPy
- ✅ REST API design with FastAPI
- ✅ Interactive data visualization (Chart.js, Plotly, Matplotlib)
- ✅ NLP skill extraction
- ✅ Dashboard/SPA architecture
- ✅ Docker containerization
- ✅ Clean code organization across multiple modules
- ✅ Real-world domain: HR tech / job market intelligence

---

*Built with ❤️ using Python, FastAPI, Vanilla JS, Chart.js, and Streamlit*
