"""
backend/services/skill_extractor.py  —  NLP-based skill extraction from job descriptions
"""

import re
from typing import List


SKILL_KEYWORDS = {
    "Python": ["python"],
    "SQL": ["sql", "mysql", "postgresql", "postgres", "sqlite"],
    "Machine Learning": ["machine learning", "ml", "supervised learning", "unsupervised learning"],
    "Deep Learning": ["deep learning", "neural network", "cnn", "rnn", "lstm", "transformer"],
    "PyTorch": ["pytorch", "torch"],
    "TensorFlow": ["tensorflow", "tf2", "keras"],
    "Scikit-learn": ["scikit-learn", "sklearn"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "sagemaker"],
    "GCP": ["gcp", "google cloud", "bigquery", "vertex ai"],
    "Azure": ["azure", "microsoft azure"],
    "Docker": ["docker", "containerization", "container"],
    "Kubernetes": ["kubernetes", "k8s", "kubectl", "helm"],
    "Spark": ["apache spark", "pyspark", "spark"],
    "Kafka": ["apache kafka", "kafka"],
    "Airflow": ["apache airflow", "airflow", "dag"],
    "dbt": ["dbt", "data build tool"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "React": ["react", "reactjs", "react.js"],
    "TypeScript": ["typescript", "ts"],
    "Node.js": ["node.js", "nodejs", "express"],
    "FastAPI": ["fastapi"],
    "LangChain": ["langchain"],
    "RAG": ["rag", "retrieval augmented generation", "retrieval-augmented"],
    "Vector DB": ["vector database", "vector db", "pinecone", "weaviate", "chroma", "qdrant"],
    "Git": ["git", "github", "gitlab", "version control"],
    "Terraform": ["terraform", "infrastructure as code", "iac"],
    "MLflow": ["mlflow"],
    "Tableau": ["tableau"],
    "Power BI": ["power bi", "powerbi"],
    "Statistics": ["statistics", "statistical analysis", "hypothesis testing", "probability"],
    "NLP": ["nlp", "natural language processing", "text classification", "named entity"],
    "Computer Vision": ["computer vision", "cv", "image classification", "object detection"],
    "Rust": ["rust"],
    "Go": ["golang", " go "],
    "Scala": ["scala"],
    "R": [r"\bR\b", "rstudio", "tidyverse", "ggplot"],
}


class SkillExtractor:
    def __init__(self):
        self.patterns = {
            skill: [re.compile(r'\b' + re.escape(kw) + r'\b', re.IGNORECASE)
                    for kw in keywords]
            for skill, keywords in SKILL_KEYWORDS.items()
        }

    def extract(self, text: str) -> List[str]:
        found = []
        text_lower = text.lower()
        for skill, patterns in self.patterns.items():
            for pat in patterns:
                if pat.search(text_lower):
                    found.append(skill)
                    break
        return found


# ============================================================
# backend/services/gap_analyzer.py  —  Skill gap computation
# ============================================================

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
    "Python":       {"type": "course",   "url": "https://docs.python.org/3/tutorial/", "title": "Official Python Tutorial"},
    "SQL":          {"type": "course",   "url": "https://mode.com/sql-tutorial/",       "title": "Mode SQL Tutorial"},
    "PyTorch":      {"type": "course",   "url": "https://pytorch.org/tutorials/",       "title": "PyTorch Official Tutorials"},
    "TensorFlow":   {"type": "course",   "url": "https://www.tensorflow.org/tutorials", "title": "TensorFlow Tutorials"},
    "AWS":          {"type": "cert",     "url": "https://aws.amazon.com/certification/","title": "AWS Certification Path"},
    "Docker":       {"type": "docs",     "url": "https://docs.docker.com/get-started/","title": "Docker Get Started"},
    "Kubernetes":   {"type": "docs",     "url": "https://kubernetes.io/docs/tutorials/","title": "Kubernetes Tutorials"},
    "LangChain":    {"type": "docs",     "url": "https://python.langchain.com/docs/",   "title": "LangChain Docs"},
    "React":        {"type": "docs",     "url": "https://react.dev/learn",              "title": "React Learn"},
    "TypeScript":   {"type": "docs",     "url": "https://www.typescriptlang.org/docs/", "title": "TypeScript Handbook"},
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

        role_obj  = next((r for r in self.roles_db if r["id"] == role_id), {})
        recs = []
        for skill in need[:5]:
            rec = {"skill": skill}
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
