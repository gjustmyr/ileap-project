"""
Generate sample employers and internships for testing
"""
from database import SessionLocal
from models import User, Employer, Industry, Internship, Skill, internship_skills
import bcrypt
import random
from datetime import datetime, timedelta

db = SessionLocal()

# Sample data
COMPANIES = [
    {"name": "Tech Solutions Inc", "industry": "Information Technology", "website": "techsolutions.com"},
    {"name": "Digital Innovations Corp", "industry": "Information Technology", "website": "digitalinnov.com"},
    {"name": "Creative Designs Studio", "industry": "Arts and Entertainment", "website": "creativedesigns.com"},
    {"name": "Manufacturing Excellence", "industry": "Manufacturing", "website": "manufexcellence.com"},
    {"name": "Healthcare Partners", "industry": "Healthcare", "website": "healthpartners.com"},
    {"name": "Finance Pro Services", "industry": "Finance and Banking", "website": "financepro.com"},
    {"name": "Education First", "industry": "Education", "website": "edufirst.com"},
    {"name": "Construction Masters", "industry": "Construction", "website": "constructmasters.com"},
    {"name": "Retail Excellence", "industry": "Retail", "website": "retailexcel.com"},
    {"name": "Hospitality Plus", "industry": "Hospitality and Tourism", "website": "hospitalityplus.com"},
]

INTERNSHIP_TITLES = [
    "Software Development Intern",
    "Web Development Intern",
    "Data Science Intern",
    "UI/UX Design Intern",
    "Marketing Intern",
    "Human Resources Intern",
    "Accounting Intern",
    "Business Analyst Intern",
    "Quality Assurance Intern",
    "Network Administrator Intern",
]

SKILLS_POOL = [
    "Python", "JavaScript", "Java", "C++", "React", "Angular", "Vue.js",
    "Node.js", "Django", "Flask", "SQL", "MongoDB", "Git", "Linux",
    "HTML/CSS", "TypeScript", "PHP", "WordPress", "APIs", "Testing"
]

DESCRIPTIONS = [
    "Join our dynamic team and gain hands-on experience in a fast-paced environment.",
    "We're looking for motivated interns to work on real-world projects.",
    "Get exposure to cutting-edge technology and industry best practices.",
    "Work alongside experienced professionals and develop your skills.",
    "Opportunity to contribute to meaningful projects and make an impact.",
]

QUALIFICATIONS = [
    "Currently enrolled in a relevant degree program",
    "Strong communication skills",
    "Ability to work in a team",
    "Basic knowledge of programming/software development",
    "Willingness to learn and adapt",
]

def generate_employers_and_internships(num_employers=10):
    """Generate sample employers with internships"""
    
    print(f"\n{'='*60}")
    print(f"GENERATING SAMPLE EMPLOYERS AND INTERNSHIPS")
    print(f"{'='*60}\n")
    
    # Get or create industries
    industries = {}
    industry_names = ["Information Technology", "Healthcare", "Finance and Banking", 
                     "Education", "Manufacturing", "Retail", "Hospitality and Tourism",
                     "Arts and Entertainment", "Construction"]
    
    for ind_name in industry_names:
        industry = db.query(Industry).filter(Industry.industry_name == ind_name).first()
        if not industry:
            industry = Industry(industry_name=ind_name, status="active")
            db.add(industry)
            db.flush()
        industries[ind_name] = industry.industry_id
    
    db.commit()
    print(f"✅ Industries ready")
    
    # Create or get skills
    skills = []
    for skill_name in SKILLS_POOL:
        skill = db.query(Skill).filter(Skill.skill_name == skill_name).first()
        if not skill:
            skill = Skill(skill_name=skill_name)
            db.add(skill)
            db.flush()
        skills.append(skill)
    
    db.commit()
    print(f"✅ Skills ready ({len(skills)} skills)")
    
    created_employers = []
    created_internships = []
    
    # Generate employers
    for i, company in enumerate(COMPANIES[:num_employers], 1):
        email = f"{company['name'].lower().replace(' ', '')}@company.com"
        
        # Check if employer already exists
        existing_user = db.query(User).filter(User.email_address == email).first()
        if existing_user:
            print(f"⏭️  Employer #{i} already exists: {company['name']}")
            employer = db.query(Employer).filter(Employer.user_id == existing_user.user_id).first()
            if employer:
                created_employers.append(employer)
            continue
        
        # Create user account
        password = "Password123!"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        new_user = User(
            email_address=email,
            password=hashed_password,
            role="employer"
        )
        db.add(new_user)
        db.flush()
        
        # Create employer profile
        industry_id = industries.get(company['industry'], 1)
        new_employer = Employer(
            user_id=new_user.user_id,
            company_name=company['name'],
            representative_name="Manager",
            email=email,
            phone_number=f"+6391234567{i:02}",
            industry_id=industry_id,
            address=f"{i*100} Business Street, Metro Manila",
            website=f"https://{company['website']}",
            company_overview=f"{company['name']} is a leading company in {company['industry']}.",
            eligibility="internship",
            status="approved"
        )
        db.add(new_employer)
        db.flush()
        created_employers.append(new_employer)
        
        print(f"✅ Created employer #{i}: {company['name']}")
        
        # Create 2-4 internships per employer
        num_internships = random.randint(2, 4)
        for j in range(num_internships):
            title_index = (i + j) % len(INTERNSHIP_TITLES)
            title = INTERNSHIP_TITLES[title_index]
            
            # Random skills (3-5 skills per internship)
            internship_skills_list = random.sample(skills, random.randint(3, 5))
            
            # Create a full description with all details
            description = random.choice(DESCRIPTIONS)
            skills_text = ", ".join([s.skill_name for s in internship_skills_list])
            qualifications_text = "\n".join(QUALIFICATIONS)
            
            full_description = f"""
{description}

Required Skills: {skills_text}

Qualifications:
{qualifications_text}

Work Modality: {random.choice(["onsite", "remote", "hybrid"])}
Duration: {random.randint(3, 6)} months
Hours: {random.randint(6, 8)} hours/day
Slots Available: {random.randint(3, 10)}
"""
            
            new_internship = Internship(
                employer_id=new_employer.employer_id,
                title=title,
                full_description=full_description,
                posting_type="internship",
                status="approved"
            )
            db.add(new_internship)
            db.flush()
            
            # Add skills relationship using the association table
            for skill in internship_skills_list:
                db.execute(
                    internship_skills.insert().values(
                        internship_id=new_internship.internship_id,
                        skill_id=skill.skill_id
                    )
                )
            
            created_internships.append(new_internship)
            print(f"   ✅ Added internship: {title}")

    
    db.commit()
    
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Created {len(created_employers)} employers")
    print(f"✅ Created {len(created_internships)} internships")
    print(f"\n💡 All employers use password: Password123!")
    print(f"\nSample login:")
    if created_employers:
        print(f"  Email: {created_employers[0].email}")
        print(f"  Password: Password123!")
    print(f"{'='*60}\n")
    
    return created_employers, created_internships

if __name__ == "__main__":
    try:
        employers, internships = generate_employers_and_internships(10)
        print("✅ Sample data generation completed successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
