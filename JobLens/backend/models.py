"""
backend/models.py  —  Pydantic data models
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class SkillModel(BaseModel):
    id:        str
    name:      str
    cat:       str
    pct:       float
    mentions:  int
    avgSalary: int
    growth:    int
    trend:     List[int]


class RoleModel(BaseModel):
    id:         str
    role:       str
    icon:       str
    color:      str
    count:      int
    avgSalary:  int
    entryS:     int
    seniorS:    int
    topSkills:  List[str]
    exp:        str
    growth:     int
    remote:     int
    description: str
    companies:  List[str]


class GeoModel(BaseModel):
    city:      str
    country:   str
    count:     int
    pct:       float
    color:     str
    topRole:   str
    avgSalary: int


class MetaResponse(BaseModel):
    totalJobs:     int
    totalSkills:   int
    dataDate:      str
    sourcesCount:  int


class SkillGapRequest(BaseModel):
    role_id:     str = Field(..., description="Target role ID (e.g. 'mle', 'ds', 'ai')")
    user_skills: List[str] = Field(..., description="List of skills the user has")


class SkillGapResponse(BaseModel):
    role_name:    str
    required:     List[str]
    have:         List[str]
    need:         List[str]
    match_pct:    int
    recommendations: List[Dict[str, Any]]


class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    total:   int
