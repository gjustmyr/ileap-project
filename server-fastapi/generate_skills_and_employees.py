"""
Generate sample internship opportunities for employer
"""
import random
from datetime import datetime, timedelta
from database import get_db
from models import InternshipOpportunity, Skill
from sqlalchemy.orm import Session

# Sample skills for various industries
SKILLS = [
    # Technical Skills
    "Python Programming", "JavaScript", "Java", "C++", "C#", "PHP", "Ruby", "Go",
    "HTML/CSS", "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle Database", "Redis",
    "Git/GitHub", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
    "REST API", "GraphQL", "Microservices", "CI/CD", "Jenkins",
    
    # Data Science & AI
    "Machine Learning", "Deep Learning", "Data Analysis", "Data Visualization",
    "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn",
    "Power BI", "Tableau", "Excel Advanced", "Statistical Analysis",
    
    # Business & Management
    "Project Management", "Agile/Scrum", "Leadership", "Team Collaboration",
    "Strategic Planning", "Business Analysis", "Financial Analysis",
    "Marketing Strategy", "Sales Management", "Customer Service",
    
    # Design & Creative
    "UI/UX Design", "Graphic Design", "Adobe Photoshop", "Adobe Illustrator",
    "Figma", "Sketch", "Video Editing", "3D Modeling", "Animation",
    
    # Communication & Soft Skills
    "Written Communication", "Verbal Communication", "Public Speaking",
    "Presentation Skills", "Problem Solving", "Critical Thinking",
    "Time Management", "Adaptability", "Creativity", "Attention to Detail",
    
    # Other Professional Skills
    "Accounting", "Human Resources", "Legal Research", "Quality Assurance",
    "Network Administration", "Cybersecurity", "Technical Support",
    "Content Writing", "SEO/SEM", "Social Media Management",
    "Supply Chain Management", "Logistics", "Manufacturing", "AutoCAD",
]

# Sample internship position titles
POSITION_TITLES = [
    "Software Development Intern",
    "Web Developer Intern",
    "Mobile App Developer Intern",
    "Data Analyst Intern",
    "Business Analyst Intern",
    "Marketing Intern",
    "Social Media Marketing Intern",
    "Content Writer Intern",
    "Graphic Designer Intern",
    "UI/UX Designer Intern",
    "Human Resources Intern",
    "Administrative Assistant Intern",
    "IT Support Intern",
    "Network Administrator Intern",
    "Database Administrator Intern",
    "Quality Assurance Intern",
    "Project Management Intern",
    "Customer Service Intern",
    "Sales Intern",
    "Accounting Intern",
    "Financial Analyst Intern",
    "Research Assistant Intern",
    "Video Editor Intern",
    "SEO Specialist Intern",
    "Digital Marketing Intern",
    "Technical Writer Intern",
    "Systems Analyst Intern",
    "Cybersecurity Intern",
    "Cloud Computing Intern",
    "Machine Learning Intern",
    "Data Science Intern",
    "Frontend Developer Intern",
    "Backend Developer Intern",
    "Full Stack Developer Intern",
    "DevOps Intern",
]

# Sample departments
DEPARTMENTS = [
    "Information Technology",
    "Computer Science",
    "Marketing",
    "Human Resources",
    "Finance",
    "Operations",
    "Customer Support",
    "Product Development",
    "Research & Development",
    "Quality Assurance",
    "Design",
    "Content Creation",
    "Business Development",
]

# Sample requirements
REQUIREMENTS = [
    "Currently enrolled in a Bachelor's degree program",
    "Strong communication skills",
    "Team player with collaborative mindset",
    "Proficient in MS Office applications",
    "Good analytical and problem-solving skills",
    "Attention to detail",
    "Ability to work independently",
    "Time management skills",
    "Willingness to learn",
    "Minimum GPA of 2.5",
]

# Sample responsibilities
RESPONSIBILITIES = [
    "Assist in daily operations and administrative tasks",
    "Support team members with project deliverables",
    "Participate in team meetings and brainstorming sessions",
    "Prepare reports and documentation",
    "Conduct research and analysis",
    "Help maintain organized filing systems",
    "Communicate with stakeholders as needed",
    "Learn and apply industry best practices",
    "Complete assigned tasks within deadlines",
    "Contribute to team objectives and goals",
]


def generate_internship_opportunities(db: Session, employer_id: int, count: int = 50):
    """Generate sample internship opportunities"""
    print(f"💼 Generating {count} internship opportunities for employer_id={employer_id}...")
    
    # Get all available skills
    all_skills = db.query(Skill).all()
    skill_ids = [skill.skill_id for skill in all_skills]
    
    created_opportunities = []
    
    for i in range(count):
        position_title = random.choice(POSITION_TITLES)
        department = random.choice(DEPARTMENTS)
        
        # Random dates
        start_date = datetime.utcnow() + timedelta(days=random.randint(7, 90))
        end_date = start_date + timedelta(days=random.randint(90, 180))
        application_deadline = start_date - timedelta(days=random.randint(7, 30))
        
        # Random slots
        slots_available = random.choice([1, 2, 3, 5, 10])
        
        # Build description
        selected_responsibilities = random.sample(RESPONSIBILITIES, random.randint(4, 7))
        selected_requirements = random.sample(REQUIREMENTS, random.randint(3, 6))
        
        description = f"""
<strong>Department:</strong> {department}

<strong>Position Overview:</strong>
We are looking for motivated students to join our team as {position_title}. This internship offers hands-on experience and learning opportunities in a professional environment.

<strong>Key Responsibilities:</strong>
{chr(10).join(f'• {resp}' for resp in selected_responsibilities)}

<strong>Requirements:</strong>
{chr(10).join(f'• {req}' for req in selected_requirements)}

<strong>What You'll Gain:</strong>
• Practical industry experience
• Professional skill development
• Mentorship from experienced professionals
• Certificate of completion
• Potential for future employment opportunities
        """.strip()
        
        # Create internship opportunity
        opportunity = InternshipOpportunity(
            employer_id=employer_id,
            position_title=position_title,
            description=description,
            department=department,
            slots_available=slots_available,
            work_setup=random.choice(["On-site", "Remote", "Hybrid"]),
            start_date=start_date,
            end_date=end_date,
            application_deadline=application_deadline,
            status=random.choice(["open", "open", "open", "open", "closed"]),  # 80% open
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(opportunity)
        db.flush()
        
        # Assign random required skills (2-5 skills per opportunity)
        num_skills = random.randint(2, 5)
        selected_skill_ids = random.sample(skill_ids, min(num_skills, len(skill_ids)))
        
        # Assuming internship_opportunity_skills junction table exists
        for skill_id in selected_skill_ids:
            try:
                db.execute(
                    "INSERT INTO internship_opportunity_skills (opportunity_id, skill_id, created_at, updated_at) "
                    "VALUES (:opportunity_id, :skill_id, :created_at, :updated_at)",
                    {
                        "opportunity_id": opportunity.opportunity_id,
                        "skill_id": skill_id,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                )
            except Exception as e:
                # Skip if table doesn't exist
                pass
        
        created_opportunities.append({
            "title": position_title,
            "department": department,
            "slots": slots_available,
            "status": opportunity.status
        })
        
        if (i + 1) % 10 == 0:
            print(f"  ✓ Created {i + 1}/{count} opportunities...")
    
    db.commit()
    print(f"✅ Successfully created {count} internship opportunities!")
    
    # Show sample
    print("\n📋 Sample opportunities created:")
    for opp in created_opportunities[:5]:
        print(f"  • {opp['title']} ({opp['department']}) - {opp['slots']} slots - {opp['status']}")
    print(f"  ... and {len(created_opportunities) - 5} more\n")


def generate_skills(db: Session):
    """Insert all skills into database"""
    print("🎯 Generating skills...")
    
    existing_skills = db.query(Skill).all()
    existing_skill_names = {skill.skill_name for skill in existing_skills}
    
    added_count = 0
    for skill_name in SKILLS:
        if skill_name not in existing_skill_names:
            skill = Skill(
                skill_name=skill_name,
                skill_description=f"Proficiency in {skill_name}",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(skill)
            added_count += 1
    
    db.commit()
    print(f"✅ Added {added_count} new skills (Total: {len(SKILLS)})")


def main():
    """Main execution"""
    db = next(get_db())
    
    try:
        print("=" * 60)
        print("🚀 Starting data generation...")
        print("=" * 60)
        
        # Generate skills
        generate_skills(db)
        
        # Generate employees for employer_id = 1
        generate_employees(db, employer_id=1, count=50)
        
        print("=" * 60)
        print("✨ Data generation completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
