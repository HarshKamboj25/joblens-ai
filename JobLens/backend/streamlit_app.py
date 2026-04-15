"""
backend/streamlit_app.py  —  Streamlit Dashboard (Python alternative UI)
=========================================================================
Run: streamlit run streamlit_app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from data.seed_data import SKILLS_DB, ROLES_DB, GEO_DB, INSIGHTS_DB

# ── Config ────────────────────────────────────────────────
st.set_page_config(
    page_title="JobLens — AI Job Market Analytics",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────
st.markdown("""
<style>
    .main { background: #0d0e14; }
    .stMetric { background: #1e2030; border: 1px solid #2a2d4a; border-radius: 12px; padding: 16px; }
    .stMetric label { color: #9699b0 !important; font-size: 12px !important; }
    .stMetric .metric-container { color: #e8e9f0; }
    h1, h2, h3 { color: #e8e9f0 !important; font-family: 'Syne', sans-serif !important; }
    .stSelectbox, .stMultiSelect { background: #1e2030; }
    section[data-testid="stSidebar"] { background: #13141d; border-right: 1px solid #2a2d4a; }
    .css-1d391kg { background: #13141d; }
</style>
""", unsafe_allow_html=True)

# ── Data ──────────────────────────────────────────────────
skills_df = pd.DataFrame(SKILLS_DB)
roles_df  = pd.DataFrame(ROLES_DB)
geo_df    = pd.DataFrame(GEO_DB)

PLOTLY_THEME = dict(
    paper_bgcolor="#13141d",
    plot_bgcolor="#1e2030",
    font=dict(color="#9699b0", family="DM Sans"),
    xaxis=dict(gridcolor="#2a2d4a", showline=False),
    yaxis=dict(gridcolor="#2a2d4a", showline=False),
)
CAT_COLORS = {"lang":"#6c63ff","ml":"#ff6b6b","cloud":"#06d6a0","data":"#ffd166","web":"#45b7d1"}

# ── Sidebar ───────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🔍 **JobLens**")
    st.markdown("*AI Job Market Analytics*")
    st.divider()
    page = st.radio("Navigate", [
        "📊 Dashboard",
        "◈ Skills Analysis",
        "◎ Job Roles",
        "＄ Salary Trends",
        "⊕ Geography",
        "△ Skill Gap",
        "✦ AI Insights",
    ])
    st.divider()
    st.caption("12,847 jobs · March 2025")

# ══════════════════════════════════════════════════════════
# PAGE: DASHBOARD
# ══════════════════════════════════════════════════════════
if page == "📊 Dashboard":
    st.title("AI Job Market Analytics")
    st.caption("Analyzing 12,847 job listings · Updated March 2025")

    # KPIs
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Jobs Analyzed",    "12,847",   "+18% vs last month")
    c2.metric("Unique Skills Detected", "284",      "+23 new skills")
    c3.metric("Avg Salary (Tech)",      "$118K",    "+6.2% YoY")
    c4.metric("Fastest Growing Role",   "AI Eng.",  "+142% YoY")

    st.divider()
    col1, col2 = st.columns([1.4, 1])

    with col1:
        st.subheader("Top In-Demand Skills")
        top10 = skills_df.nlargest(10, "pct")
        top10["color"] = top10["cat"].map(CAT_COLORS)
        fig = px.bar(top10, x="pct", y="name", orientation="h",
                     color="cat", color_discrete_map=CAT_COLORS,
                     labels={"pct": "Demand %", "name": "Skill", "cat": "Category"},
                     text="pct")
        fig.update_traces(texttemplate="%{text}%", textposition="outside")
        fig.update_layout(**PLOTLY_THEME, showlegend=True, height=400, margin=dict(l=0,r=40,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Role Distribution")
        cat_counts = skills_df.groupby("cat")["mentions"].sum().reset_index()
        cat_map = {"lang":"Languages","ml":"AI/ML","cloud":"Cloud","data":"Data","web":"Web"}
        cat_counts["label"] = cat_counts["cat"].map(cat_map)
        fig = px.pie(cat_counts, values="mentions", names="label",
                     color="cat", color_discrete_map=CAT_COLORS, hole=0.55)
        fig.update_layout(**PLOTLY_THEME, height=400, margin=dict(l=0,r=0,t=0,b=0))
        st.plotly_chart(fig, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        st.subheader("Salary by Role")
        fig = go.Figure()
        fig.add_bar(name="Entry",  x=roles_df["role"], y=roles_df["entryS"]/1000,  marker_color="#6c63ff55")
        fig.add_bar(name="Mid",    x=roles_df["role"], y=roles_df["avgSalary"]/1000,marker_color="#6c63ff")
        fig.add_bar(name="Senior", x=roles_df["role"], y=roles_df["seniorS"]/1000,  marker_color="#9d97ff")
        fig.update_layout(**PLOTLY_THEME, barmode="group", height=300, yaxis_tickprefix="$", yaxis_ticksuffix="K", margin=dict(l=0,r=0,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    with col4:
        st.subheader("Role Growth YoY")
        fig = px.bar(roles_df.sort_values("growth"), x="growth", y="role", orientation="h",
                     color="growth", color_continuous_scale=["#06d6a0","#ffd166","#ff6b6b"],
                     text="growth")
        fig.update_traces(texttemplate="+%{text}%", textposition="outside")
        fig.update_layout(**PLOTLY_THEME, height=300, coloraxis_showscale=False, margin=dict(l=0,r=60,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════
# PAGE: SKILLS ANALYSIS
# ══════════════════════════════════════════════════════════
elif page == "◈ Skills Analysis":
    st.title("Skills Analysis")

    col_f, col_s = st.columns([2, 1])
    with col_f:
        cat_filter = st.multiselect("Category", options=list(CAT_COLORS.keys()),
                                     format_func=lambda c: {"lang":"Languages","ml":"AI/ML","cloud":"Cloud","data":"Data","web":"Web"}.get(c, c),
                                     default=list(CAT_COLORS.keys()))
    with col_s:
        search = st.text_input("Search skill", placeholder="e.g. Python")

    filtered = skills_df[skills_df["cat"].isin(cat_filter)]
    if search: filtered = filtered[filtered["name"].str.contains(search, case=False)]

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Skill Demand")
        fig = px.bar(filtered.nlargest(16, "pct"), x="pct", y="name", orientation="h",
                     color="cat", color_discrete_map=CAT_COLORS, text="pct")
        fig.update_traces(texttemplate="%{text}%", textposition="outside")
        fig.update_layout(**PLOTLY_THEME, height=500, showlegend=False, margin=dict(l=0,r=50,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Demand vs Salary (bubble = growth)")
        fig = px.scatter(filtered, x="pct", y="avgSalary", size="growth", color="cat",
                         color_discrete_map=CAT_COLORS, text="name", hover_data=["growth"])
        fig.update_traces(textposition="top center", textfont_size=9)
        fig.update_layout(**PLOTLY_THEME, height=500, yaxis_tickprefix="$", margin=dict(l=0,r=0,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("12-Month Skill Trends")
    months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]
    top_trend = skills_df.nlargest(6, "pct")
    fig = go.Figure()
    colors_line = ["#6c63ff","#ff6b6b","#06d6a0","#ffd166","#45b7d1","#9d97ff"]
    for i, (_, row) in enumerate(top_trend.iterrows()):
        fig.add_trace(go.Scatter(x=months, y=row["trend"], name=row["name"],
                                  line=dict(color=colors_line[i], width=2.5), mode="lines+markers"))
    fig.update_layout(**PLOTLY_THEME, height=300, yaxis_ticksuffix="%", margin=dict(l=0,r=0,t=10,b=0))
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("Full Skills Table")
    display_df = filtered[["name","cat","mentions","pct","avgSalary","growth"]].rename(columns={
        "name":"Skill","cat":"Category","mentions":"Mentions","pct":"Demand %","avgSalary":"Avg Salary","growth":"Growth %"
    }).sort_values("Demand %", ascending=False)
    display_df["Category"] = display_df["Category"].map({"lang":"Languages","ml":"AI/ML","cloud":"Cloud","data":"Data","web":"Web"})
    display_df["Avg Salary"] = display_df["Avg Salary"].apply(lambda x: f"${x:,}")
    display_df["Growth %"]   = display_df["Growth %"].apply(lambda x: f"+{x}%")
    st.dataframe(display_df, use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════
# PAGE: JOB ROLES
# ══════════════════════════════════════════════════════════
elif page == "◎ Job Roles":
    st.title("Job Roles")

    cols = st.columns(4)
    for i, (_, r) in enumerate(roles_df.iloc[:4].iterrows()):
        cols[i].metric(f"{r['icon']} {r['role']}", f"{r['count']:,}", f"+{r['growth']}% YoY")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Openings by Role")
        fig = px.bar(roles_df.sort_values("count"), x="count", y="role", orientation="h",
                     color="color", color_discrete_map={r["color"]: r["color"] for _, r in roles_df.iterrows()})
        fig.update_layout(**PLOTLY_THEME, height=320, showlegend=False, margin=dict(l=0,r=0,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("YoY Growth")
        fig = px.bar(roles_df.sort_values("growth"), x="growth", y="role", orientation="h",
                     color="growth", color_continuous_scale=["#06d6a0","#ffd166","#ff6b6b"], text="growth")
        fig.update_traces(texttemplate="+%{text}%", textposition="outside")
        fig.update_layout(**PLOTLY_THEME, height=320, coloraxis_showscale=False, margin=dict(l=0,r=60,t=10,b=0))
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Role Details")
    role_display = roles_df[["role","count","avgSalary","exp","growth","remote"]].rename(columns={
        "role":"Role","count":"Openings","avgSalary":"Avg Salary","exp":"Experience","growth":"Growth %","remote":"Remote %"
    })
    role_display["Openings"]   = role_display["Openings"].apply(lambda x: f"{x:,}")
    role_display["Avg Salary"] = role_display["Avg Salary"].apply(lambda x: f"${x:,}")
    role_display["Growth %"]   = role_display["Growth %"].apply(lambda x: f"+{x}%")
    role_display["Remote %"]   = role_display["Remote %"].apply(lambda x: f"{x}%")
    st.dataframe(role_display, use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════
# PAGE: SALARY
# ══════════════════════════════════════════════════════════
elif page == "＄ Salary Trends":
    st.title("Salary Trends")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Highest Avg Role",   "AI Engineer",  "$145K average")
    c2.metric("Best Skill Premium", "RAG",          "+$63K lift")
    c3.metric("Fastest Pay Growth", "AI Engineer",  "+21% YoY")
    c4.metric("Entry Level Avg",    "$78K",         "+9% YoY")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Salary by Role (Entry / Mid / Senior)")
        fig = go.Figure()
        fig.add_bar(name="Entry",  x=roles_df["role"], y=roles_df["entryS"]/1000,  marker_color="#6c63ff55")
        fig.add_bar(name="Mid",    x=roles_df["role"], y=roles_df["avgSalary"]/1000,marker_color="#6c63ff")
        fig.add_bar(name="Senior", x=roles_df["role"], y=roles_df["seniorS"]/1000,  marker_color="#9d97ff")
        fig.update_layout(**PLOTLY_THEME, barmode="group", height=350, yaxis_tickprefix="$", yaxis_ticksuffix="K")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Top Skill Salary Premium")
        top_sal = skills_df.nlargest(10, "avgSalary").copy()
        top_sal["premium"] = ((top_sal["avgSalary"] - 95000) / 1000).round(0)
        fig = px.bar(top_sal, x="name", y="premium", color="premium",
                     color_continuous_scale=["#06d6a0","#ffd166","#ff6b6b"], text="premium")
        fig.update_traces(texttemplate="+$%{text}K", textposition="outside")
        fig.update_layout(**PLOTLY_THEME, height=350, coloraxis_showscale=False, yaxis_tickprefix="+$", yaxis_ticksuffix="K")
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Salary History 2021–2025")
    years = ["2021","2022","2023","2024","2025"]
    history = {
        "mle":    [108,118,128,136,142], "ds": [102,110,116,122,128],
        "ai":     [105,115,128,138,145], "da": [75, 80, 84, 88, 92],
        "de":     [108,115,122,128,132], "fs": [98,104,109,114,118],
        "mlops":  [102,112,122,132,138], "devops":[105,110,115,120,125],
    }
    fig = go.Figure()
    role_colors = {r["id"]: r["color"] for _, r in roles_df.iterrows()}
    for rid, vals in history.items():
        rname = roles_df[roles_df["id"] == rid]["role"].values[0]
        fig.add_trace(go.Scatter(x=years, y=vals, name=rname,
                                  line=dict(color=role_colors.get(rid,"#9699b0"), width=2.5),
                                  mode="lines+markers"))
    fig.update_layout(**PLOTLY_THEME, height=320, yaxis_tickprefix="$", yaxis_ticksuffix="K")
    st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════
# PAGE: GEOGRAPHY
# ══════════════════════════════════════════════════════════
elif page == "⊕ Geography":
    st.title("Geographic Trends")

    cols = st.columns(4)
    for i, (_, g) in enumerate(geo_df.iloc[:4].iterrows()):
        cols[i].metric(f"📍 {g['city']}", f"{g['count']:,}", g["topRole"])

    st.subheader("Top Hiring Cities")
    fig = px.bar(geo_df, x="city", y="count", color="city",
                 color_discrete_sequence=geo_df["color"].tolist(), text="count")
    fig.update_traces(texttemplate="%{text:,}", textposition="outside")
    fig.update_layout(**PLOTLY_THEME, height=350, showlegend=False, margin=dict(l=0,r=0,t=10,b=0))
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("City Details")
    geo_display = geo_df[["city","country","count","topRole","avgSalary"]].rename(columns={
        "city":"City","country":"Country","count":"Job Count","topRole":"Top Role","avgSalary":"Avg Salary"
    })
    geo_display["Job Count"]  = geo_display["Job Count"].apply(lambda x: f"{x:,}")
    geo_display["Avg Salary"] = geo_display["Avg Salary"].apply(lambda x: f"${x:,}")
    st.dataframe(geo_display, use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════
# PAGE: SKILL GAP
# ══════════════════════════════════════════════════════════
elif page == "△ Skill Gap":
    st.title("Skill Gap Analyzer")

    role_map = {
        "mle":"ML Engineer","ds":"Data Scientist","ai":"AI Engineer","da":"Data Analyst",
        "de":"Data Engineer","fs":"Full Stack Dev","mlops":"MLOps Engineer","devops":"DevOps/SRE",
    }
    req_map = {
        "mle":  ["Python","SQL","PyTorch","TensorFlow","Scikit-learn","AWS","Docker","Statistics","MLflow","Git"],
        "ds":   ["Python","SQL","Pandas","Scikit-learn","Statistics","Machine Learning","R","A/B Testing","NLP","Matplotlib"],
        "ai":   ["Python","LangChain","RAG","Vector DB","FastAPI","Docker","AWS","OpenAI API","Prompt Eng","MLOps"],
        "da":   ["SQL","Excel","Power BI","Python","Tableau","Statistics","DAX","ETL","Data Storytelling","R"],
        "de":   ["Python","SQL","Spark","Airflow","Kafka","Docker","AWS","dbt","Hadoop","Scala"],
        "fs":   ["React","TypeScript","Node.js","SQL","CSS","Git","REST APIs","Docker","Testing","AWS"],
        "mlops":["Kubernetes","Docker","Python","MLflow","AWS","Terraform","CI/CD","Prometheus","Grafana","Ansible"],
        "devops":["Kubernetes","Docker","AWS","Terraform","Python","CI/CD","Linux","Monitoring","Bash","Helm"],
    }
    ALL_SKILLS = sorted(set(s for skills in req_map.values() for s in skills))

    col1, col2 = st.columns(2)
    with col1:
        target_role = st.selectbox("Target Role", options=list(role_map.keys()), format_func=lambda k: role_map[k])
    with col2:
        user_skills = st.multiselect("Your Current Skills", options=ALL_SKILLS, default=["Python","SQL","Docker","React","Git"])

    required = req_map[target_role]
    have     = [s for s in required if s in user_skills]
    need     = [s for s in required if s not in user_skills]
    pct      = round(len(have) / len(required) * 100)

    st.divider()
    c1, c2, c3 = st.columns(3)
    c1.metric("Match Score",       f"{pct}%",         "vs role requirements")
    c2.metric("Skills You Have",   len(have),         f"of {len(required)} required")
    c3.metric("Skills to Learn",   len(need),         "remaining")

    st.progress(pct / 100)

    col3, col4 = st.columns(2)
    with col3:
        st.subheader("✅ Skills You Have")
        for s in have:
            st.success(s, icon="✓")
        if not have:
            st.info("None yet — add skills above")

    with col4:
        st.subheader("📚 Skills to Learn")
        for s in need:
            st.error(s, icon="→")

# ══════════════════════════════════════════════════════════
# PAGE: AI INSIGHTS
# ══════════════════════════════════════════════════════════
elif page == "✦ AI Insights":
    st.title("AI Insights")
    st.caption("Intelligent analysis of job market signals")

    for ins in INSIGHTS_DB:
        with st.expander(f"{ins['emoji']} {ins['title']} — **{ins['hero']}**", expanded=True):
            st.write(ins["body"])
            cols = st.columns(len(ins["tags"]))
            for i, t in enumerate(ins["tags"]):
                cols[i].markdown(f"<span style='background:{t['color']}20;color:{t['color']};padding:3px 10px;border-radius:20px;font-size:12px'>{t['label']}</span>", unsafe_allow_html=True)

    st.divider()
    st.subheader("Technology Adoption Forecast")
    labels  = ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25"]
    series  = [
        {"name":"LLM Tools",     "data":[8,14,20,28,32,38,45,52],  "color":"#ff6b6b","actual":4},
        {"name":"Cloud Native",  "data":[42,44,47,50,55,58,61,65], "color":"#06d6a0","actual":4},
        {"name":"Vector DB",     "data":[2,4,8,14,18,25,33,42],    "color":"#ffd166","actual":4},
        {"name":"Traditional BI","data":[68,65,61,57,53,50,47,44], "color":"#9699b0","actual":4},
    ]
    fig = go.Figure()
    for s in series:
        actuals   = s["data"][:s["actual"]+1]
        forecasts = [None]*s["actual"] + s["data"][s["actual"]:]
        fig.add_trace(go.Scatter(x=labels[:s["actual"]+1], y=actuals, name=s["name"],
                                  line=dict(color=s["color"], width=2.5), mode="lines+markers"))
        fig.add_trace(go.Scatter(x=labels[s["actual"]:], y=s["data"][s["actual"]:],
                                  name=s["name"]+" (forecast)",
                                  line=dict(color=s["color"], width=2, dash="dot"),
                                  mode="lines+markers", showlegend=False))
    fig.update_layout(**PLOTLY_THEME, height=350, yaxis_ticksuffix="%")
    st.plotly_chart(fig, use_container_width=True)
