"""
backend/main.py  —  JobLens FastAPI Backend
==========================================
Run:  uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import json
import re
from collections import Counter

from models import (
    SkillModel, RoleModel, GeoModel, SkillGapRequest,
    SkillGapResponse, SearchResponse, MetaResponse
)
from services.analytics   import AnalyticsService
from services.skill_extractor import SkillExtractor
from services.gap_analyzer    import GapAnalyzer
from data.seed_data           import SKILLS_DB, ROLES_DB, GEO_DB, INSIGHTS_DB

# ── App Init ──────────────────────────────────────────────
app = FastAPI(
    title="JobLens API",
    description="AI Job Market Analytics REST API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analytics      = AnalyticsService(SKILLS_DB, ROLES_DB, GEO_DB)
skill_extractor = SkillExtractor()
gap_analyzer   = GapAnalyzer(ROLES_DB)

# ── Health ─────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "JobLens API", "version": "2.0.0"}

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "jobs_indexed": 12847, "skills_tracked": 284}

# ── Meta ───────────────────────────────────────────────────
@app.get("/api/meta", response_model=MetaResponse, tags=["Meta"])
async def get_meta():
    return analytics.get_meta()

# ── Skills ─────────────────────────────────────────────────
@app.get("/api/skills", tags=["Skills"])
async def get_skills(
    category: Optional[str] = Query(None, description="Filter by category: lang|ml|cloud|data|web"),
    sort_by:  Optional[str] = Query("pct", description="Sort field: pct|mentions|avgSalary|growth"),
    limit:    int           = Query(50, ge=1, le=284),
    q:        Optional[str] = Query(None, description="Search query"),
):
    skills = SKILLS_DB
    if category: skills = [s for s in skills if s["cat"] == category]
    if q:        skills = [s for s in skills if q.lower() in s["name"].lower()]
    skills = sorted(skills, key=lambda s: s.get(sort_by, 0), reverse=True)
    return {"data": skills[:limit], "total": len(skills)}

@app.get("/api/skills/{skill_id}", tags=["Skills"])
async def get_skill(skill_id: str):
    skill = next((s for s in SKILLS_DB if s["id"] == skill_id), None)
    if not skill: raise HTTPException(status_code=404, detail="Skill not found")
    related = analytics.get_related_skills(skill_id)
    return {**skill, "related": related}

@app.get("/api/skills/trending", tags=["Skills"])
async def get_trending_skills(limit: int = Query(10, ge=1, le=50)):
    trending = sorted(SKILLS_DB, key=lambda s: s["growth"], reverse=True)
    return {"data": trending[:limit]}

# ── Roles ──────────────────────────────────────────────────
@app.get("/api/roles", tags=["Roles"])
async def get_roles(
    sort_by: Optional[str] = Query("count", description="Sort: count|avgSalary|growth"),
):
    roles = sorted(ROLES_DB, key=lambda r: r.get(sort_by, 0), reverse=True)
    return {"data": roles, "total": len(roles)}

@app.get("/api/roles/{role_id}", tags=["Roles"])
async def get_role(role_id: str):
    role = next((r for r in ROLES_DB if r["id"] == role_id), None)
    if not role: raise HTTPException(status_code=404, detail="Role not found")
    return role

# ── Geography ─────────────────────────────────────────────
@app.get("/api/geo", tags=["Geography"])
async def get_geo(
    country: Optional[str] = Query(None),
    limit:   int           = Query(20, ge=1, le=100),
):
    geo = GEO_DB
    if country: geo = [g for g in geo if g["country"].upper() == country.upper()]
    return {"data": geo[:limit], "total": len(geo)}

# ── Salary ─────────────────────────────────────────────────
@app.get("/api/salary", tags=["Salary"])
async def get_salary_data():
    return analytics.get_salary_overview()

@app.get("/api/salary/history", tags=["Salary"])
async def get_salary_history():
    return analytics.get_salary_history()

# ── Skill Gap ─────────────────────────────────────────────
@app.post("/api/skill-gap", response_model=SkillGapResponse, tags=["Tools"])
async def analyze_skill_gap(body: SkillGapRequest):
    """
    Given a target role and user's current skills,
    returns: matched skills, missing skills, match %, learning recommendations.
    """
    return gap_analyzer.analyze(body.role_id, body.user_skills)

# ── Search ────────────────────────────────────────────────
@app.get("/api/search", tags=["Search"])
async def search(q: str = Query(..., min_length=1)):
    results = []
    q_lower = q.lower()
    for s in SKILLS_DB:
        if q_lower in s["name"].lower():
            results.append({"type": "skill", "id": s["id"], "label": s["name"], "sub": f'{s["pct"]}% demand'})
    for r in ROLES_DB:
        if q_lower in r["role"].lower():
            results.append({"type": "role", "id": r["id"], "label": r["role"], "sub": f'{r["count"]:,} openings'})
    return {"results": results[:10], "total": len(results)}

# ── Insights ──────────────────────────────────────────────
@app.get("/api/insights", tags=["Insights"])
async def get_insights():
    return {"data": INSIGHTS_DB}

# ── Skill Extractor ───────────────────────────────────────
@app.post("/api/extract-skills", tags=["Tools"])
async def extract_skills(body: dict):
    """Extract skills from a job description text."""
    text = body.get("text", "")
    if not text: raise HTTPException(status_code=400, detail="text field required")
    extracted = skill_extractor.extract(text)
    return {"skills": extracted, "count": len(extracted)}

# ── Analytics ─────────────────────────────────────────────
@app.get("/api/analytics/overview", tags=["Analytics"])
async def analytics_overview():
    return analytics.get_overview()

@app.get("/api/analytics/trends", tags=["Analytics"])
async def analytics_trends():
    return analytics.get_trends()
