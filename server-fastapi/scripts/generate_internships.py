"""
Generate diverse internship postings for cybersecurity company
Creates 100+ internships across different departments including HR, Engineering, Sales, etc.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Internship, Skill, Employer, internship_skills
from datetime import datetime
import random

# Internship templates by department
INTERNSHIP_TEMPLATES = [
    # Cybersecurity Roles (30 positions)
    {
        "title": "Cybersecurity Analyst Intern",
        "department": "Security Operations",
        "description": "Join our Security Operations Center (SOC) team to monitor, detect, and respond to security threats. Learn about SIEM tools, threat intelligence, and incident response procedures.",
        "skills": ["Network Security", "SIEM Tools", "Threat Analysis", "Incident Response", "Security Monitoring"]
    },
    {
        "title": "Penetration Testing Intern",
        "department": "Offensive Security",
        "description": "Work with our red team to identify vulnerabilities in systems and applications. Gain hands-on experience with penetration testing methodologies, tools, and reporting.",
        "skills": ["Penetration Testing", "Ethical Hacking", "Vulnerability Assessment", "Kali Linux", "Metasploit"]
    },
    {
        "title": "Security Engineer Intern",
        "department": "Security Engineering",
        "description": "Help design and implement security solutions for enterprise clients. Learn about security architecture, cloud security, and secure coding practices.",
        "skills": ["Security Architecture", "Cloud Security", "Python", "Network Security", "Firewall Configuration"]
    },
    {
        "title": "Threat Intelligence Analyst Intern",
        "department": "Threat Intelligence",
        "description": "Research and analyze emerging cyber threats, threat actors, and attack patterns. Contribute to threat intelligence reports and security advisories.",
        "skills": ["Threat Intelligence", "OSINT", "Malware Analysis", "Threat Hunting", "Security Research"]
    },
    {
        "title": "Security Compliance Intern",
        "department": "Governance, Risk & Compliance",
        "description": "Support compliance initiatives including ISO 27001, SOC 2, and GDPR. Learn about security frameworks, audit procedures, and risk assessment.",
        "skills": ["Security Compliance", "Risk Assessment", "ISO 27001", "Audit", "Policy Development"]
    },
    {
        "title": "Application Security Intern",
        "department": "Application Security",
        "description": "Review code for security vulnerabilities and help developers build secure applications. Learn about OWASP Top 10, secure coding, and security testing.",
        "skills": ["Application Security", "Secure Coding", "OWASP", "Code Review", "SAST/DAST"]
    },
    {
        "title": "Cloud Security Intern",
        "department": "Cloud Security",
        "description": "Secure cloud infrastructure on AWS, Azure, and GCP. Learn about cloud security best practices, IAM, and cloud-native security tools.",
        "skills": ["Cloud Security", "AWS", "Azure", "IAM", "Container Security"]
    },
    {
        "title": "Digital Forensics Intern",
        "department": "Forensics",
        "description": "Investigate security incidents and perform digital forensics analysis. Learn about evidence collection, forensic tools, and incident investigation.",
        "skills": ["Digital Forensics", "Incident Investigation", "Evidence Collection", "Forensic Tools", "Malware Analysis"]
    },
    {
        "title": "Security Automation Intern",
        "department": "Security Automation",
        "description": "Develop automation scripts and tools to improve security operations efficiency. Work with Python, APIs, and security orchestration platforms.",
        "skills": ["Python", "Security Automation", "API Integration", "Scripting", "SOAR"]
    },
    {
        "title": "Network Security Intern",
        "department": "Network Security",
        "description": "Monitor and secure network infrastructure. Learn about firewalls, IDS/IPS, VPNs, and network segmentation.",
        "skills": ["Network Security", "Firewall", "IDS/IPS", "VPN", "Network Monitoring"]
    },
    
    # HR & Recruitment Roles (15 positions)
    {
        "title": "HR Recruitment Intern",
        "department": "Human Resources",
        "description": "Support the recruitment team in sourcing, screening, and interviewing candidates for cybersecurity positions. Learn about talent acquisition strategies and HR best practices.",
        "skills": ["Recruitment", "Talent Acquisition", "Interviewing", "HR Management", "Applicant Tracking Systems"]
    },
    {
        "title": "HR Generalist Intern",
        "department": "Human Resources",
        "description": "Assist with various HR functions including employee onboarding, benefits administration, and HR policy implementation. Gain broad HR experience.",
        "skills": ["HR Management", "Employee Relations", "Onboarding", "Benefits Administration", "HRIS"]
    },
    {
        "title": "Talent Acquisition Intern",
        "department": "Talent Acquisition",
        "description": "Focus on sourcing top cybersecurity talent through various channels. Learn about Boolean search, LinkedIn recruiting, and candidate engagement.",
        "skills": ["Talent Sourcing", "LinkedIn Recruiting", "Boolean Search", "Candidate Engagement", "ATS"]
    },
    {
        "title": "HR Operations Intern",
        "department": "HR Operations",
        "description": "Support day-to-day HR operations including payroll processing, attendance tracking, and HR documentation. Learn about HR systems and processes.",
        "skills": ["HR Operations", "Payroll", "HRIS", "Data Entry", "Documentation"]
    },
    {
        "title": "Learning & Development Intern",
        "department": "Learning & Development",
        "description": "Help design and deliver training programs for cybersecurity professionals. Learn about instructional design, e-learning, and training coordination.",
        "skills": ["Training Coordination", "Instructional Design", "E-Learning", "Presentation Skills", "LMS"]
    },
    
    # IT & Development Roles (20 positions)
    {
        "title": "Full Stack Developer Intern",
        "department": "Engineering",
        "description": "Build web applications for internal security tools and client portals. Work with modern frameworks and learn full-stack development.",
        "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"]
    },
    {
        "title": "Frontend Developer Intern",
        "department": "Engineering",
        "description": "Create responsive and intuitive user interfaces for security dashboards and applications. Work with React, Angular, or Vue.js.",
        "skills": ["HTML", "CSS", "JavaScript", "React", "UI/UX Design"]
    },
    {
        "title": "Backend Developer Intern",
        "department": "Engineering",
        "description": "Develop APIs and backend services for security applications. Learn about microservices, databases, and API design.",
        "skills": ["Python", "FastAPI", "PostgreSQL", "REST API", "Docker"]
    },
    {
        "title": "DevOps Engineer Intern",
        "department": "DevOps",
        "description": "Automate deployment pipelines and manage cloud infrastructure. Learn about CI/CD, containerization, and infrastructure as code.",
        "skills": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"]
    },
    {
        "title": "Data Engineer Intern",
        "department": "Data Engineering",
        "description": "Build data pipelines for security analytics and threat intelligence. Work with big data technologies and ETL processes.",
        "skills": ["Python", "SQL", "ETL", "Data Pipeline", "Apache Spark"]
    },
    
    # Business & Operations Roles (15 positions)
    {
        "title": "Business Analyst Intern",
        "department": "Business Analysis",
        "description": "Analyze business requirements and translate them into technical specifications. Work with stakeholders to improve business processes.",
        "skills": ["Business Analysis", "Requirements Gathering", "Documentation", "Process Improvement", "Stakeholder Management"]
    },
    {
        "title": "Project Coordinator Intern",
        "department": "Project Management",
        "description": "Support project managers in planning, tracking, and delivering cybersecurity projects. Learn about project management methodologies and tools.",
        "skills": ["Project Management", "Coordination", "Scheduling", "Communication", "Microsoft Project"]
    },
    {
        "title": "Operations Analyst Intern",
        "department": "Operations",
        "description": "Optimize operational processes and analyze performance metrics. Help improve efficiency across security operations.",
        "skills": ["Operations Management", "Process Optimization", "Data Analysis", "Reporting", "Excel"]
    },
    {
        "title": "Quality Assurance Intern",
        "department": "Quality Assurance",
        "description": "Test security software and applications to ensure quality and reliability. Learn about testing methodologies and automation.",
        "skills": ["Software Testing", "Test Automation", "QA Methodologies", "Bug Tracking", "Selenium"]
    },
    {
        "title": "Technical Writer Intern",
        "department": "Documentation",
        "description": "Create technical documentation, user guides, and security advisories. Learn about technical writing and documentation best practices.",
        "skills": ["Technical Writing", "Documentation", "Communication", "Markdown", "Content Management"]
    },
    
    # Sales & Marketing Roles (10 positions)
    {
        "title": "Sales Development Intern",
        "department": "Sales",
        "description": "Generate leads and support the sales team in acquiring new cybersecurity clients. Learn about B2B sales and CRM systems.",
        "skills": ["Sales", "Lead Generation", "CRM", "Communication", "Business Development"]
    },
    {
        "title": "Marketing Intern",
        "department": "Marketing",
        "description": "Support marketing campaigns for cybersecurity services. Learn about digital marketing, content creation, and marketing analytics.",
        "skills": ["Digital Marketing", "Content Creation", "Social Media", "Marketing Analytics", "SEO"]
    },
    {
        "title": "Content Marketing Intern",
        "department": "Marketing",
        "description": "Create engaging content about cybersecurity topics for blogs, social media, and newsletters. Learn about content strategy and SEO.",
        "skills": ["Content Writing", "SEO", "Social Media Marketing", "Blogging", "Content Strategy"]
    },
    {
        "title": "Customer Success Intern",
        "department": "Customer Success",
        "description": "Help clients maximize value from our cybersecurity solutions. Learn about customer relationship management and technical support.",
        "skills": ["Customer Service", "Communication", "Problem Solving", "CRM", "Technical Support"]
    },
    {
        "title": "Business Development Intern",
        "department": "Business Development",
        "description": "Identify new business opportunities and support partnership initiatives. Learn about market research and strategic planning.",
        "skills": ["Business Development", "Market Research", "Presentation Skills", "Negotiation", "Strategic Planning"]
    },
    
    # Finance & Admin Roles (10 positions)
    {
        "title": "Finance Intern",
        "department": "Finance",
        "description": "Support financial operations including budgeting, forecasting, and financial reporting. Learn about corporate finance and accounting.",
        "skills": ["Accounting", "Financial Analysis", "Excel", "Budgeting", "Financial Reporting"]
    },
    {
        "title": "Administrative Assistant Intern",
        "department": "Administration",
        "description": "Provide administrative support to executives and teams. Learn about office management and administrative procedures.",
        "skills": ["Administrative Support", "Office Management", "Scheduling", "Communication", "Microsoft Office"]
    },
    {
        "title": "Legal & Compliance Intern",
        "department": "Legal",
        "description": "Support legal team with contract review, compliance monitoring, and legal research. Learn about cybersecurity law and regulations.",
        "skills": ["Legal Research", "Contract Review", "Compliance", "Documentation", "Regulatory Knowledge"]
    },
    {
        "title": "Procurement Intern",
        "department": "Procurement",
        "description": "Assist with vendor management, purchase orders, and procurement processes. Learn about supply chain and vendor relations.",
        "skills": ["Procurement", "Vendor Management", "Negotiation", "Supply Chain", "Contract Management"]
    },
    {
        "title": "Facilities Management Intern",
        "department": "Facilities",
        "description": "Support facilities operations and workplace management. Learn about office administration and facility coordination.",
        "skills": ["Facilities Management", "Coordination", "Vendor Relations", "Problem Solving", "Communication"]
    },
    
    # Data & Analytics Roles (10 positions)
    {
        "title": "Data Analyst Intern",
        "department": "Data Analytics",
        "description": "Analyze security data and create insights for decision-making. Learn about data visualization, SQL, and business intelligence.",
        "skills": ["Data Analysis", "SQL", "Excel", "Data Visualization", "Power BI"]
    },
    {
        "title": "Security Data Scientist Intern",
        "department": "Data Science",
        "description": "Apply machine learning to cybersecurity problems. Work on threat detection models and anomaly detection systems.",
        "skills": ["Machine Learning", "Python", "Data Science", "Statistics", "TensorFlow"]
    },
    {
        "title": "Business Intelligence Intern",
        "department": "Business Intelligence",
        "description": "Build dashboards and reports for business stakeholders. Learn about BI tools and data storytelling.",
        "skills": ["Business Intelligence", "Power BI", "Tableau", "SQL", "Data Visualization"]
    },
    {
        "title": "Research Analyst Intern",
        "department": "Research",
        "description": "Conduct market research and competitive analysis in the cybersecurity industry. Support strategic planning with data-driven insights.",
        "skills": ["Market Research", "Data Analysis", "Research Methodology", "Excel", "Presentation Skills"]
    },
    {
        "title": "Security Metrics Analyst Intern",
        "department": "Security Metrics",
        "description": "Track and report on security KPIs and metrics. Help develop dashboards for security program effectiveness.",
        "skills": ["Data Analysis", "KPI Tracking", "Dashboard Development", "Excel", "Reporting"]
    },
]

def get_or_create_skill(db: Session, skill_name: str) -> Skill:
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


def generate_internships(employer_id: int, count: int = 100):
    """Generate diverse internship postings"""
    db = SessionLocal()
    
    try:
        # Verify employer exists
        employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
        if not employer:
            print(f"❌ Employer with ID {employer_id} not found")
            return
        
        print(f"✓ Found employer: {employer.company_name}")
        print(f"Generating {count} internship postings...")
        print("="*60)
        
        created_count = 0
        
        # Generate multiple instances of each template
        while created_count < count:
            for template in INTERNSHIP_TEMPLATES:
                if created_count >= count:
                    break
                
                # Add variation to titles
                variation = created_count // len(INTERNSHIP_TEMPLATES) + 1
                title = template["title"]
                if variation > 1:
                    title = f"{template['title']} - Batch {variation}"
                
                # Create full description
                full_description = f"""
<div class="internship-description">
    <h3>Department: {template['department']}</h3>
    <p>{template['description']}</p>
    
    <h4>What You'll Learn:</h4>
    <ul>
        <li>Hands-on experience in {template['department'].lower()}</li>
        <li>Industry best practices and professional development</li>
        <li>Mentorship from experienced professionals</li>
        <li>Real-world project experience</li>
    </ul>
    
    <h4>Requirements:</h4>
    <ul>
        <li>Currently enrolled in a relevant degree program</li>
        <li>Strong communication and teamwork skills</li>
        <li>Eagerness to learn and adapt</li>
        <li>Basic knowledge of required skills</li>
    </ul>
    
    <h4>Duration:</h4>
    <p>6 months internship program with potential for extension</p>
    
    <h4>Location:</h4>
    <p>Batangas City (Hybrid work arrangement available)</p>
</div>
                """.strip()
                
                # Create internship
                internship = Internship(
                    employer_id=employer_id,
                    title=title,
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
                    
                    # Create internship-skill relationship using insert
                    db.execute(
                        internship_skills.insert().values(
                            internship_id=internship.internship_id,
                            skill_id=skill.skill_id
                        )
                    )
                
                created_count += 1
                print(f"✓ Created: {title} ({len(template['skills'])} skills)")
        
        db.commit()
        print("="*60)
        print(f"✅ Successfully created {created_count} internship postings")
        print(f"✅ All postings are for employer: {employer.company_name}")
        
        # Summary by department
        print("\n📊 Summary by Department:")
        departments = {}
        for template in INTERNSHIP_TEMPLATES:
            dept = template['department']
            departments[dept] = departments.get(dept, 0) + (count // len(INTERNSHIP_TEMPLATES))
        
        for dept, count in sorted(departments.items()):
            print(f"   {dept}: ~{count} positions")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    print("🚀 Internship Generator for Cybersecurity Company")
    print("="*60)
    
    employer_id = 1
    count = 100
    
    generate_internships(employer_id, count)
