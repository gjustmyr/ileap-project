"""
Generate diverse internship postings for cybersecurity company
Creates 50 unique internships with specific degree requirements and tailored descriptions
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Internship, Skill, Employer, internship_skills
from datetime import datetime

# Import templates from separate file
from internship_templates import INTERNSHIP_TEMPLATES

def get_or_create_skill(db: Session, skill_name: str):
    """Get existing skill or create new one"""
    skill = db.query(Skill).filter(Skill.skill_name == skill_name).first()
    if not skill:
        skill = Skill(
            skill_name=skill_name,
            status="active",
            created_at=datetime.utcnow()
        )
        db.add(skill)
        db.flush()
    return skill


def generate_internships(employer_id: int):
    """Generate diverse internship postings"""
    db = SessionLocal()
    
    try:
        # Verify employer exists
        employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
        if not employer:
            print(f"❌ Employer with ID {employer_id} not found")
            return
        
        print(f"✓ Found employer: {employer.company_name}")
        print(f"Generating {len(INTERNSHIP_TEMPLATES)} unique internship postings...")
        print("="*70)
        
        created_count = 0
        
        for template in INTERNSHIP_TEMPLATES:
            # Build full description with specific requirements
            programs_list = ", ".join(template["required_programs"])
            
            responsibilities_html = "\n".join([f"        <li>{r}</li>" for r in template["responsibilities"]])
            learning_html = "\n".join([f"        <li>{l}</li>" for l in template["learning_outcomes"]])
            
            full_description = f"""
<div class="internship-description">
    <h3>Department: {template['department']}</h3>
    <p>{template['description']}</p>
    
    <h4>🎓 Required Program/Degree:</h4>
    <p><strong>{programs_list}</strong></p>
    <p>Students from these programs will find this role highly relevant to their field of study.</p>
    
    <h4>📋 Key Responsibilities:</h4>
    <ul>
{responsibilities_html}
    </ul>
    
    <h4>🎯 Learning Outcomes:</h4>
    <ul>
{learning_html}
    </ul>
    
    <h4>✅ Qualifications:</h4>
    <ul>
        <li>Currently enrolled in {programs_list}</li>
        <li>Strong analytical and problem-solving skills</li>
        <li>Good communication and teamwork abilities</li>
        <li>Eagerness to learn and adapt to new technologies</li>
        <li>Basic knowledge of required technical skills</li>
    </ul>
    
    <h4>⏱️ Duration & Schedule:</h4>
    <p>6-month internship program with flexible scheduling options. Potential for extension based on performance.</p>
    
    <h4>📍 Location:</h4>
    <p>Batangas City - Hybrid work arrangement available (3 days onsite, 2 days remote)</p>
    
    <h4>💼 What We Offer:</h4>
    <ul>
        <li>Mentorship from industry professionals</li>
        <li>Real-world project experience</li>
        <li>Professional development opportunities</li>
        <li>Certificate of completion</li>
        <li>Potential for full-time employment</li>
    </ul>
</div>
            """.strip()
            
            # Create internship
            internship = Internship(
                employer_id=employer_id,
                title=template["title"],
                full_description=full_description,
                posting_type="internship",
                status="open",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.add(internship)
            db.flush()
            
            # Add skills
            for skill_name in template["skills"]:
                skill = get_or_create_skill(db, skill_name)
                db.execute(
                    internship_skills.insert().values(
                        internship_id=internship.internship_id,
                        skill_id=skill.skill_id
                    )
                )
            
            created_count += 1
            print(f"✓ {created_count}. {template['title']}")
            print(f"   Programs: {programs_list}")
            print(f"   Skills: {len(template['skills'])}")
        
        db.commit()
        print("="*70)
        print(f"✅ Successfully created {created_count} unique internship postings")
        print(f"✅ Employer: {employer.company_name}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    print("🚀 Internship Generator - Unique Postings with Degree Requirements")
    print("="*70)
    
    employer_id = 1
    generate_internships(employer_id)
