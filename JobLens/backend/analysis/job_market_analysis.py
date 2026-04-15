"""
backend/analysis/job_market_analysis.py
========================================
Standalone analysis script.
Run:  python analysis/job_market_analysis.py
Generates charts to ./output/ directory.
"""

import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from collections import Counter

OUTPUT_DIR = "./output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Style ─────────────────────────────────────────────────
plt.style.use("dark_background")
PALETTE = ["#6c63ff","#ff6b6b","#06d6a0","#ffd166","#45b7d1","#9d97ff","#f7b731","#4ecdc4"]
sns.set_palette(PALETTE)

# ── Load data ─────────────────────────────────────────────
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from data.seed_data import SKILLS_DB, ROLES_DB, GEO_DB

skills_df = pd.DataFrame(SKILLS_DB)
roles_df  = pd.DataFrame(ROLES_DB)
geo_df    = pd.DataFrame(GEO_DB)

print("=== JobLens Market Analysis ===")
print(f"Skills tracked : {len(skills_df)}")
print(f"Roles analyzed : {len(roles_df)}")
print(f"Cities indexed : {len(geo_df)}")
print()


# ── 1. Top Skills Bar Chart ───────────────────────────────
def plot_top_skills():
    fig, ax = plt.subplots(figsize=(12, 7))
    top = skills_df.nlargest(15, "pct")
    colors = [{"lang":"#6c63ff","ml":"#ff6b6b","cloud":"#06d6a0","data":"#ffd166","web":"#45b7d1"}.get(c,"#9699b0") for c in top["cat"]]
    bars = ax.barh(top["name"], top["pct"], color=colors, height=0.65, edgecolor="none")
    for bar, pct in zip(bars, top["pct"]):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2, f"{pct}%", va="center", color="#9699b0", fontsize=10)
    ax.set_xlabel("Demand (%)", color="#9699b0")
    ax.set_title("Top 15 In-Demand Skills — March 2025", color="white", fontsize=15, fontweight="bold", pad=16)
    ax.tick_params(colors="#9699b0")
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    legend_patches = [
        mpatches.Patch(color="#6c63ff", label="Languages"),
        mpatches.Patch(color="#ff6b6b", label="AI / ML"),
        mpatches.Patch(color="#06d6a0", label="Cloud"),
        mpatches.Patch(color="#ffd166", label="Data"),
        mpatches.Patch(color="#45b7d1", label="Web"),
    ]
    ax.legend(handles=legend_patches, loc="lower right", framealpha=0.2)
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/1_top_skills.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 2. Salary Distribution by Role ───────────────────────
def plot_salary_distribution():
    fig, ax = plt.subplots(figsize=(13, 6))
    x       = np.arange(len(roles_df))
    w       = 0.25
    ax.bar(x - w,   roles_df["entryS"] / 1000,  w, label="Entry",  color="#6c63ff88", edgecolor="none")
    ax.bar(x,       roles_df["avgSalary"] / 1000, w, label="Mid",    color="#6c63ff",   edgecolor="none")
    ax.bar(x + w,   roles_df["seniorS"] / 1000,  w, label="Senior", color="#9d97ff",   edgecolor="none")
    ax.set_xticks(x)
    ax.set_xticklabels(roles_df["role"], rotation=25, ha="right", color="#9699b0", fontsize=10)
    ax.set_ylabel("Annual Salary (USD $K)", color="#9699b0")
    ax.set_title("Salary Distribution by Role (Entry / Mid / Senior)", color="white", fontsize=14, fontweight="bold", pad=14)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"${int(v)}K"))
    ax.tick_params(colors="#9699b0")
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    ax.legend(framealpha=0.2, labelcolor="#e8e9f0")
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/2_salary_distribution.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 3. Skill Growth Heatmap ───────────────────────────────
def plot_growth_scatter():
    fig, ax = plt.subplots(figsize=(12, 7))
    x       = skills_df["pct"]
    y       = skills_df["avgSalary"] / 1000
    sizes   = np.clip(skills_df["growth"] * 3, 20, 600)
    cats    = skills_df["cat"]
    cat_colors = {"lang":"#6c63ff","ml":"#ff6b6b","cloud":"#06d6a0","data":"#ffd166","web":"#45b7d1"}
    colors  = [cat_colors.get(c, "#9699b0") for c in cats]
    sc      = ax.scatter(x, y, s=sizes, c=colors, alpha=0.8, edgecolors="white", linewidths=0.3)
    for _, row in skills_df.iterrows():
        if row["pct"] > 30 or row["growth"] > 40:
            ax.annotate(row["name"], (row["pct"], row["avgSalary"] / 1000),
                        fontsize=8, color="#e8e9f0", ha="left", va="bottom",
                        xytext=(4, 4), textcoords="offset points")
    ax.set_xlabel("Demand (%)", color="#9699b0")
    ax.set_ylabel("Avg Salary ($K)", color="#9699b0")
    ax.set_title("Skill Demand vs Salary  (bubble size = YoY growth)", color="white", fontsize=14, fontweight="bold", pad=14)
    ax.tick_params(colors="#9699b0")
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    legend_patches = [mpatches.Patch(color=v, label=k.upper()) for k, v in cat_colors.items()]
    ax.legend(handles=legend_patches, framealpha=0.2, labelcolor="#e8e9f0")
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/3_skill_demand_vs_salary.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 4. Role Growth Bar ────────────────────────────────────
def plot_role_growth():
    fig, ax = plt.subplots(figsize=(10, 5))
    df_sorted = roles_df.sort_values("growth", ascending=True)
    colors = ["#ff6b6b" if g > 50 else "#ffd166" if g > 20 else "#06d6a0" for g in df_sorted["growth"]]
    bars = ax.barh(df_sorted["role"], df_sorted["growth"], color=colors, height=0.6, edgecolor="none")
    for bar, g in zip(bars, df_sorted["growth"]):
        ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height() / 2, f"+{g}%", va="center", color="#e8e9f0", fontsize=10)
    ax.set_xlabel("YoY Growth (%)", color="#9699b0")
    ax.set_title("Year-over-Year Role Growth", color="white", fontsize=14, fontweight="bold", pad=14)
    ax.tick_params(colors="#9699b0")
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/4_role_growth.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 5. Category Pie Chart ─────────────────────────────────
def plot_category_pie():
    cat_map  = {"lang":"Languages","ml":"AI/ML","cloud":"Cloud","data":"Data","web":"Web"}
    cat_colors = {"lang":"#6c63ff","ml":"#ff6b6b","cloud":"#06d6a0","data":"#ffd166","web":"#45b7d1"}
    counts   = skills_df.groupby("cat")["mentions"].sum()
    labels   = [cat_map.get(c, c) for c in counts.index]
    colors   = [cat_colors.get(c, "#9699b0") for c in counts.index]
    fig, ax  = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(counts, labels=labels, autopct="%1.0f%%",
                                       colors=colors, startangle=140,
                                       wedgeprops={"edgecolor":"#13141d","linewidth":2},
                                       textprops={"color":"#e8e9f0"})
    for at in autotexts: at.set_color("#13141d"); at.set_fontweight("bold")
    ax.set_title("Job Market by Skill Category", color="white", fontsize=14, fontweight="bold", pad=16)
    fig.patch.set_facecolor("#13141d")
    ax.set_facecolor("#13141d")
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/5_category_pie.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 6. Skill Trend Lines ──────────────────────────────────
def plot_skill_trends():
    months  = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]
    top5    = skills_df.nlargest(5, "pct")
    fig, ax = plt.subplots(figsize=(12, 6))
    for i, (_, row) in enumerate(top5.iterrows()):
        ax.plot(months, row["trend"], color=PALETTE[i], linewidth=2.5, label=row["name"], marker="o", markersize=4)
    ax.set_title("Top 5 Skill Demand — 12-Month Trend", color="white", fontsize=14, fontweight="bold", pad=14)
    ax.set_ylabel("Demand (%)", color="#9699b0")
    ax.tick_params(colors="#9699b0", rotation=30)
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    ax.legend(framealpha=0.2, labelcolor="#e8e9f0")
    ax.grid(axis="y", color="#2a2d4a", linewidth=0.5)
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/6_skill_trends.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── 7. Geo Bar Chart ──────────────────────────────────────
def plot_geo():
    fig, ax = plt.subplots(figsize=(11, 5))
    colors  = [g["color"] for _, g in geo_df.iterrows()]
    bars    = ax.bar(geo_df["city"], geo_df["count"], color=colors, edgecolor="none", width=0.6)
    for bar, count in zip(bars, geo_df["count"]):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 30, f"{count:,}",
                ha="center", color="#9699b0", fontsize=9)
    ax.set_title("Top Hiring Cities — Job Count", color="white", fontsize=14, fontweight="bold", pad=14)
    ax.set_ylabel("Open Positions", color="#9699b0")
    ax.tick_params(colors="#9699b0", rotation=25)
    ax.spines[:].set_visible(False)
    ax.set_facecolor("#1e2030")
    fig.patch.set_facecolor("#13141d")
    plt.tight_layout()
    path = f"{OUTPUT_DIR}/7_geo_hiring.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved: {path}")


# ── Run all ───────────────────────────────────────────────
if __name__ == "__main__":
    print("\n📊 Generating charts...\n")
    plot_top_skills()
    plot_salary_distribution()
    plot_growth_scatter()
    plot_role_growth()
    plot_category_pie()
    plot_skill_trends()
    plot_geo()

    print(f"\n✅ All charts saved to ./{OUTPUT_DIR}/")
    print("\n📋 Summary Statistics:")
    print(f"  Highest demand skill : {skills_df.loc[skills_df['pct'].idxmax(), 'name']} ({skills_df['pct'].max()}%)")
    print(f"  Highest salary skill : {skills_df.loc[skills_df['avgSalary'].idxmax(), 'name']} (${skills_df['avgSalary'].max():,})")
    print(f"  Fastest growing skill: {skills_df.loc[skills_df['growth'].idxmax(), 'name']} (+{skills_df['growth'].max()}% YoY)")
    print(f"  Most openings role   : {roles_df.loc[roles_df['count'].idxmax(), 'role']} ({roles_df['count'].max():,})")
    print(f"  Highest salary role  : {roles_df.loc[roles_df['avgSalary'].idxmax(), 'role']} (${roles_df['avgSalary'].max():,})")
    print(f"  Top hiring city      : {geo_df.loc[geo_df['count'].idxmax(), 'city']} ({geo_df['count'].max():,} jobs)")
