"""
backend/services/analytics.py  —  Core analytics computations
"""

from typing import List, Dict, Any


class AnalyticsService:
    def __init__(self, skills: List[Dict], roles: List[Dict], geo: List[Dict]):
        self.skills = skills
        self.roles  = roles
        self.geo    = geo

    def get_meta(self) -> Dict:
        return {
            "totalJobs":    12847,
            "totalSkills":  len(self.skills),
            "dataDate":     "March 2025",
            "sourcesCount": 18,
        }

    def get_overview(self) -> Dict:
        top_skills  = sorted(self.skills, key=lambda s: s["pct"], reverse=True)[:10]
        top_roles   = sorted(self.roles,  key=lambda r: r["count"], reverse=True)[:5]
        top_growing = sorted(self.skills, key=lambda s: s["growth"], reverse=True)[:5]
        return {
            "top_skills":   top_skills,
            "top_roles":    top_roles,
            "top_growing":  top_growing,
            "avg_salary":   int(sum(r["avgSalary"] for r in self.roles) / len(self.roles)),
        }

    def get_salary_overview(self) -> Dict:
        return {
            "by_role": [
                {
                    "role": r["role"],
                    "id":   r["id"],
                    "entry":  r["entryS"],
                    "avg":    r["avgSalary"],
                    "senior": r["seniorS"],
                }
                for r in self.roles
            ],
            "by_skill": sorted(
                [{"name": s["name"], "id": s["id"], "avgSalary": s["avgSalary"]} for s in self.skills],
                key=lambda s: s["avgSalary"], reverse=True
            )[:15],
            "overall_avg": int(sum(r["avgSalary"] for r in self.roles) / len(self.roles)),
            "highest_role": max(self.roles, key=lambda r: r["avgSalary"])["role"],
        }

    def get_salary_history(self) -> Dict:
        return {
            "years": ["2021", "2022", "2023", "2024", "2025"],
            "roles": {
                "mle":    [108000, 118000, 128000, 136000, 142000],
                "ds":     [102000, 110000, 116000, 122000, 128000],
                "ai":     [105000, 115000, 128000, 138000, 145000],
                "da":     [75000,  80000,  84000,  88000,  92000 ],
                "de":     [108000, 115000, 122000, 128000, 132000],
                "fs":     [98000,  104000, 109000, 114000, 118000],
                "mlops":  [102000, 112000, 122000, 132000, 138000],
                "devops": [105000, 110000, 115000, 120000, 125000],
            }
        }

    def get_trends(self) -> Dict:
        return {
            "months": ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
            "skills": [
                {"name": s["name"], "id": s["id"], "trend": s["trend"], "color": "#6c63ff"}
                for s in self.skills[:6]
            ]
        }

    def get_related_skills(self, skill_id: str) -> List[Dict]:
        skill = next((s for s in self.skills if s["id"] == skill_id), None)
        if not skill: return []
        related = [s for s in self.skills if s["cat"] == skill["cat"] and s["id"] != skill_id]
        return sorted(related, key=lambda s: s["pct"], reverse=True)[:5]
