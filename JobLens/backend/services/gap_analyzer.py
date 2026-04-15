"""
backend/services/gap_analyzer.py  —  Skill gap computation
"""

ROLE_REQUIRED = {
    "mle":    ["Python","SQL","PyTorch","TensorFlow","Scikit-learn","AWS","Docker","Statistics","MLflow","Git"],
    "ds":     ["Python","SQL","Pandas","Scikit-learn","Statistics","Machine Learning","R","A/B Testing","NLP","Matplotlib"],
    "ai":     ["Python","LangChain","RAG","Vector DB","FastAPI","Docker","AWS","OpenAI API","Prompt Eng","MLOps"],
    "da":     ["SQL","Excel","Power BI","Python","Tableau","Statistics","DAX","ETL","Data Storytelling","R"],
    "de":     ["Python","SQL","Spark","Airflow","Kafka","Docker","AWS","dbt","Hadoop","Scala"],
    "fs":     ["React","TypeScript","Node.js","SQL","CSS","Git","REST APIs","Docker","Testing","AWS"],
    "mlops":  ["Kubernetes","Docker","Python","MLflow","AWS","Terraform","CI/CD","Prometheus","Grafana","Ansible"],
    "devops": ["Kubernetes","Docker","AWS","Terraform","Python","CI/CD","Linux","Monitoring","Bash","Helm"],
}

LEARNING_RESOURCES = {
    "Python":       {"type": "docs",   "url": "https://docs.python.org/3/tutorial/",    "title": "Official Python Tutorial"},
    "SQL":          {"type": "course", "url": "https://mode.com/sql-tutorial/",          "title": "Mode SQL Tutorial"},
    "PyTorch":      {"type": "docs",   "url": "https://pytorch.org/tutorials/",          "title": "PyTorch Official Tutorials"},
    "TensorFlow":   {"type": "docs",   "url": "https://www.tensorflow.org/tutorials",    "title": "TensorFlow Tutorials"},
    "AWS":          {"type": "cert",   "url": "https://aws.amazon.com/certification/",   "title": "AWS Certification Path"},
    "Docker":       {"type": "docs",   "url": "https://docs.docker.com/get-started/",    "title": "Docker Get Started"},
    "Kubernetes":   {"type": "docs",   "url": "https://kubernetes.io/docs/tutorials/",   "title": "Kubernetes Tutorials"},
    "LangChain":    {"type": "docs",   "url": "https://python.langchain.com/docs/",      "title": "LangChain Docs"},
    "React":        {"type": "docs",   "url": "https://react.dev/learn",                 "title": "React Learn"},
    "TypeScript":   {"type": "docs",   "url": "https://www.typescriptlang.org/docs/",    "title": "TypeScript Handbook"},
    "Pandas":       {"type": "docs",   "url": "https://pandas.pydata.org/docs/",         "title": "Pandas Documentation"},
    "Spark":        {"type": "docs",   "url": "https://spark.apache.org/docs/latest/",   "title": "Spark Documentation"},
    "dbt":          {"type": "docs",   "url": "https://docs.getdbt.com/",                "title": "dbt Documentation"},
    "Airflow":      {"type": "docs",   "url": "https://airflow.apache.org/docs/",        "title": "Airflow Documentation"},
    "Terraform":    {"type": "docs",   "url": "https://developer.hashicorp.com/terraform","title": "Terraform Learn"},
    "MLflow":       {"type": "docs",   "url": "https://mlflow.org/docs/latest/",         "title": "MLflow Documentation"},
    "RAG":          {"type": "guide",  "url": "https://python.langchain.com/docs/use_cases/question_answering/","title": "LangChain RAG Guide"},
    "Vector DB":    {"type": "docs",   "url": "https://docs.trychroma.com/",             "title": "ChromaDB Quickstart"},
}


class GapAnalyzer:
    def __init__(self, roles_db):
        self.roles_db = roles_db

    def analyze(self, role_id: str, user_skills: list) -> dict:
        if role_id not in ROLE_REQUIRED:
            raise ValueError(f"Unknown role_id: {role_id}")

        required = ROLE_REQUIRED[role_id]
        have     = [s for s in required if s in user_skills]
        need     = [s for s in required if s not in user_skills]
        pct      = round(len(have) / len(required) * 100)

        role_obj = next((r for r in self.roles_db if r["id"] == role_id), {})

        recs = []
        for skill in need[:6]:
            rec = {"skill": skill, "type": "resource", "url": "#", "title": f"Learn {skill}"}
            if skill in LEARNING_RESOURCES:
                rec.update(LEARNING_RESOURCES[skill])
            recs.append(rec)

        return {
            "role_name":       role_obj.get("role", role_id),
            "required":        required,
            "have":            have,
            "need":            need,
            "match_pct":       pct,
            "recommendations": recs,
        }
