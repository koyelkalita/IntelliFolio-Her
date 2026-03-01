from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, JSON, Date, func, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.db.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    """Users table - stores user profiles"""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255))
    avatar_url = Column(String(255))
    firebase_uid = Column(String(255), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    api_credentials = relationship("APICredential", back_populates="user", cascade="all, delete-orphan")


class Portfolio(Base):
    """Portfolios table - generated portfolios per user"""
    __tablename__ = "portfolios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255))
    slug = Column(String(255), unique=True, index=True)
    status = Column(String(50), default="draft")  # draft, published, archived
    template_type = Column(String(50))  # contemporary, professional, minimal
    is_public = Column(Boolean, default=False)
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="portfolios")
    resume_data = relationship("ResumeData", back_populates="portfolio", cascade="all, delete-orphan")
    profile_data = relationship("ProfileData", back_populates="portfolio", cascade="all, delete-orphan", uselist=False)
    portfolio_sections = relationship("PortfolioSection", back_populates="portfolio", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="portfolio", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="portfolio", cascade="all, delete-orphan")
    social_links = relationship("SocialLink", back_populates="portfolio", cascade="all, delete-orphan")
    versions = relationship("PortfolioVersion", back_populates="portfolio", cascade="all, delete-orphan")


class ResumeData(Base):
    """Resume files and parsed data"""
    __tablename__ = "resume_data"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255))
    file_url = Column(String(255), nullable=True)  # S3 or storage URL (nullable for text uploads)
    parsed_json = Column(JSON)  # Entire parsed resume as JSON
    upload_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="resume_data")


class ProfileData(Base):
    """Merged profile data from resume + GitHub"""
    __tablename__ = "profile_data"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(20))
    location = Column(String(255))
    summary = Column(Text)
    github_username = Column(String(255), index=True)
    github_data = Column(JSON)  # Raw GitHub profile data
    resume_data = Column(JSON)  # Parsed resume data
    merged_data = Column(JSON)  # Final merged profile
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="profile_data")


class PortfolioSection(Base):
    """Individual portfolio sections (about, experience, etc)"""
    __tablename__ = "portfolio_sections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    section_type = Column(String(50), nullable=False)  # about, experience, projects, skills, education, social
    content = Column(JSON)  # Flexible structure
    order_index = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="portfolio_sections")


class Project(Base):
    """Projects extracted from resume and GitHub"""
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    url = Column(String(255))
    github_url = Column(String(255))
    technologies = Column(JSON, default=[])  # Array of tech stacks (stored as JSON)
    start_date = Column(Date)
    end_date = Column(Date)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="projects")


class Skill(Base):
    """Technical and soft skills"""
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(50))  # technical, soft, language
    proficiency_level = Column(String(50))  # beginner, intermediate, advanced, expert
    endorsement_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="skills")


class SocialLink(Base):
    """Social media and external links"""
    __tablename__ = "social_links"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    platform = Column(String(50), nullable=False)  # github, linkedin, twitter, website, etc
    url = Column(String(255), nullable=False)
    username = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="social_links")


class APICredential(Base):
    """Stored API credentials (encrypted)"""
    __tablename__ = "api_credentials"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    service = Column(String(50), nullable=False)  # github, etc
    token = Column(String(500), nullable=False)  # Store encrypted
    username = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime)

    # Relationships
    user = relationship("User", back_populates="api_credentials")


class PortfolioVersion(Base):
    """Portfolio version history for rollback"""
    __tablename__ = "portfolio_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    data = Column(JSON)  # Entire portfolio snapshot
    changed_by = Column(String(36), ForeignKey("users.id"))
    change_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="versions")
