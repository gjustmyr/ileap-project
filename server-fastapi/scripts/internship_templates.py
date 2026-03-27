"""
Internship templates with specific degree requirements and unique descriptions
"""

INTERNSHIP_TEMPLATES = [
    # === CYBERSECURITY & IT SECURITY (10 positions) ===
    {
        "title": "Cybersecurity Analyst Intern",
        "department": "Security Operations Center",
        "required_programs": ["Computer Science", "Computer Engineering", "Information Technology", "Cybersecurity"],
        "description": "Monitor and analyze security events in our 24/7 Security Operations Center. Work with SIEM platforms like Splunk to detect threats, investigate incidents, and protect client infrastructure.",
        "responsibilities": [
            "Monitor security alerts and events using SIEM tools",
            "Investigate potential security incidents and document findings",
            "Assist in threat hunting and vulnerability assessments",
            "Create security incident reports and recommendations"
        ],
        "learning_outcomes": [
            "Hands-on experience with enterprise SIEM platforms",
            "Understanding of cyber threat landscape and attack patterns",
            "Incident response and forensics fundamentals",
            "Security monitoring and log analysis techniques"
        ],
        "skills": ["Network Security", "SIEM Tools", "Threat Analysis", "Incident Response", "Security Monitoring"]
    },
    
    {
        "title": "Penetration Testing Intern",
        "department": "Offensive Security",
        "required_programs": ["Computer Science", "Computer Engineering", "Cybersecurity", "Information Technology"],
        "description": "Join our red team to identify vulnerabilities in client systems and applications. Learn ethical hacking methodologies, penetration testing tools, and security assessment techniques.",
        "responsibilities": [
            "Conduct vulnerability scans and penetration tests on client systems",
            "Document security findings and create detailed reports",
            "Assist in developing proof-of-concept exploits",
            "Participate in red team exercises and security assessments"
        ],
        "learning_outcomes": [
            "Ethical hacking and penetration testing methodologies",
            "Hands-on experience with Kali Linux and security tools",
            "Vulnerability assessment and exploitation techniques",
            "Professional security reporting and documentation"
        ],
        "skills": ["Penetration Testing", "Ethical Hacking", "Vulnerability Assessment", "Kali Linux", "Metasploit"]
    },
    
    {
        "title": "Cloud Security Engineer Intern",
        "department": "Cloud Security",
        "required_programs": ["Computer Science", "Computer Engineering", "Information Technology"],
        "description": "Secure cloud infrastructure on AWS, Azure, and GCP. Learn cloud security best practices, IAM configuration, and cloud-native security tools to protect modern cloud environments.",
        "responsibilities": [
            "Review and improve cloud security configurations",
            "Implement IAM policies and access controls",
            "Monitor cloud infrastructure for security issues",
            "Assist in cloud security audits and compliance checks"
        ],
        "learning_outcomes": [
            "Cloud security architecture and best practices",
            "AWS, Azure, and GCP security services",
            "Identity and Access Management (IAM)",
            "Container and serverless security"
        ],
        "skills": ["Cloud Security", "AWS", "Azure", "IAM", "Container Security"]
    },
    
    {
        "title": "Application Security Intern",
        "department": "Application Security",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Review code for security vulnerabilities and help developers build secure applications. Learn about OWASP Top 10, secure coding practices, and application security testing.",
        "responsibilities": [
            "Perform security code reviews and identify vulnerabilities",
            "Conduct SAST and DAST testing on applications",
            "Assist developers in fixing security issues",
            "Create secure coding guidelines and documentation"
        ],
        "learning_outcomes": [
            "OWASP Top 10 vulnerabilities and mitigations",
            "Secure coding practices and code review techniques",
            "Application security testing tools (SAST/DAST)",
            "DevSecOps integration and automation"
        ],
        "skills": ["Application Security", "Secure Coding", "OWASP", "Code Review", "SAST/DAST"]
    },
    
    {
        "title": "Network Security Intern",
        "department": "Network Security",
        "required_programs": ["Computer Engineering", "Information Technology", "Computer Science"],
        "description": "Monitor and secure network infrastructure including firewalls, IDS/IPS, and VPNs. Learn network security fundamentals, traffic analysis, and network defense strategies.",
        "responsibilities": [
            "Monitor network traffic for suspicious activities",
            "Configure and maintain firewall rules",
            "Assist in IDS/IPS tuning and alert investigation",
            "Document network security configurations"
        ],
        "learning_outcomes": [
            "Network security architecture and protocols",
            "Firewall configuration and management",
            "Intrusion detection and prevention systems",
            "Network traffic analysis and monitoring"
        ],
        "skills": ["Network Security", "Firewall", "IDS/IPS", "VPN", "Network Monitoring"]
    },
    
    {
        "title": "Security Compliance Analyst Intern",
        "department": "Governance, Risk & Compliance",
        "required_programs": ["Information Systems", "Computer Science", "Business Administration", "Information Technology"],
        "description": "Support compliance initiatives including ISO 27001, SOC 2, and GDPR. Learn about security frameworks, audit procedures, risk assessment, and regulatory compliance.",
        "responsibilities": [
            "Assist in compliance audits and assessments",
            "Document security policies and procedures",
            "Track compliance metrics and KPIs",
            "Support risk assessment activities"
        ],
        "learning_outcomes": [
            "Security compliance frameworks (ISO 27001, SOC 2, GDPR)",
            "Risk assessment and management methodologies",
            "Audit procedures and documentation",
            "Policy development and governance"
        ],
        "skills": ["Security Compliance", "Risk Assessment", "ISO 27001", "Audit", "Policy Development"]
    },
    
    {
        "title": "Threat Intelligence Analyst Intern",
        "department": "Threat Intelligence",
        "required_programs": ["Computer Science", "Cybersecurity", "Information Technology"],
        "description": "Research and analyze emerging cyber threats, threat actors, and attack patterns. Contribute to threat intelligence reports and security advisories for clients.",
        "responsibilities": [
            "Monitor threat intelligence feeds and dark web sources",
            "Analyze malware samples and attack techniques",
            "Create threat intelligence reports and briefings",
            "Track threat actor groups and campaigns"
        ],
        "learning_outcomes": [
            "Threat intelligence collection and analysis",
            "OSINT (Open Source Intelligence) techniques",
            "Malware analysis fundamentals",
            "Threat actor profiling and tracking"
        ],
        "skills": ["Threat Intelligence", "OSINT", "Malware Analysis", "Threat Hunting", "Security Research"]
    },
    
    {
        "title": "Digital Forensics Intern",
        "department": "Forensics & Incident Response",
        "required_programs": ["Computer Science", "Computer Engineering", "Cybersecurity", "Information Technology"],
        "description": "Investigate security incidents and perform digital forensics analysis. Learn evidence collection, forensic tools, and incident investigation methodologies.",
        "responsibilities": [
            "Collect and preserve digital evidence",
            "Analyze forensic artifacts from compromised systems",
            "Document investigation findings and timelines",
            "Assist in incident response activities"
        ],
        "learning_outcomes": [
            "Digital forensics methodologies and tools",
            "Evidence collection and chain of custody",
            "Forensic analysis techniques",
            "Incident investigation and reporting"
        ],
        "skills": ["Digital Forensics", "Incident Investigation", "Evidence Collection", "Forensic Tools", "Malware Analysis"]
    },
    
    {
        "title": "Security Automation Engineer Intern",
        "department": "Security Automation",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Develop automation scripts and tools to improve security operations efficiency. Work with Python, APIs, and security orchestration platforms (SOAR).",
        "responsibilities": [
            "Develop Python scripts for security automation",
            "Integrate security tools via APIs",
            "Build automated workflows in SOAR platforms",
            "Create dashboards and reporting tools"
        ],
        "learning_outcomes": [
            "Security automation and orchestration",
            "Python programming for security tasks",
            "API integration and development",
            "SOAR platform configuration"
        ],
        "skills": ["Python", "Security Automation", "API Integration", "Scripting", "SOAR"]
    },
    
    {
        "title": "Security Operations Intern",
        "department": "Security Operations",
        "required_programs": ["Computer Science", "Information Technology", "Cybersecurity"],
        "description": "Support daily security operations including monitoring, alerting, and incident triage. Learn SOC processes, security tools, and operational procedures.",
        "responsibilities": [
            "Monitor security dashboards and alerts",
            "Triage and escalate security incidents",
            "Maintain security tool configurations",
            "Document operational procedures"
        ],
        "learning_outcomes": [
            "SOC operations and workflows",
            "Security tool management",
            "Incident triage and escalation",
            "Operational documentation"
        ],
        "skills": ["Security Operations", "Monitoring", "Incident Management", "SIEM", "Documentation"]
    },
    
    # === SOFTWARE DEVELOPMENT (10 positions) ===
    {
        "title": "Full Stack Developer Intern",
        "department": "Engineering",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Build web applications for internal security tools and client portals. Work with React, Node.js, and Python to create modern, responsive applications.",
        "responsibilities": [
            "Develop frontend interfaces using React and TypeScript",
            "Build backend APIs with Node.js and Python",
            "Integrate with databases and third-party services",
            "Write unit tests and documentation"
        ],
        "learning_outcomes": [
            "Full-stack web development with modern frameworks",
            "RESTful API design and implementation",
            "Database design and optimization",
            "Agile development practices"
        ],
        "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"]
    },
    
    {
        "title": "Frontend Developer Intern",
        "department": "Engineering",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology", "Multimedia Arts"],
        "description": "Create responsive and intuitive user interfaces for security dashboards and applications. Work with React, TypeScript, and modern CSS frameworks.",
        "responsibilities": [
            "Build responsive UI components with React",
            "Implement designs using Tailwind CSS",
            "Optimize frontend performance",
            "Collaborate with UX designers"
        ],
        "learning_outcomes": [
            "Modern frontend development with React",
            "Responsive design and CSS frameworks",
            "UI/UX best practices",
            "Frontend performance optimization"
        ],
        "skills": ["HTML", "CSS", "JavaScript", "React", "UI/UX Design"]
    },
    
    {
        "title": "Backend Developer Intern",
        "department": "Engineering",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Develop APIs and backend services for security applications. Learn about microservices architecture, databases, and API design using Python and FastAPI.",
        "responsibilities": [
            "Design and implement RESTful APIs",
            "Develop microservices with FastAPI",
            "Optimize database queries and schemas",
            "Implement authentication and authorization"
        ],
        "learning_outcomes": [
            "Backend development with Python and FastAPI",
            "Microservices architecture",
            "Database design and optimization",
            "API security and authentication"
        ],
        "skills": ["Python", "FastAPI", "PostgreSQL", "REST API", "Docker"]
    },
    
    {
        "title": "Mobile App Developer Intern",
        "department": "Mobile Development",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Develop mobile applications for iOS and Android platforms. Work with React Native or Flutter to create cross-platform security applications.",
        "responsibilities": [
            "Build mobile app features using React Native",
            "Implement mobile UI/UX designs",
            "Integrate with backend APIs",
            "Test and debug mobile applications"
        ],
        "learning_outcomes": [
            "Mobile app development with React Native/Flutter",
            "Cross-platform development techniques",
            "Mobile UI/UX patterns",
            "Mobile app deployment and testing"
        ],
        "skills": ["React Native", "Flutter", "Mobile Development", "JavaScript", "API Integration"]
    },
    
    {
        "title": "DevOps Engineer Intern",
        "department": "DevOps",
        "required_programs": ["Computer Science", "Computer Engineering", "Information Technology"],
        "description": "Automate deployment pipelines and manage cloud infrastructure. Learn about CI/CD, containerization with Docker, and infrastructure as code with Terraform.",
        "responsibilities": [
            "Build and maintain CI/CD pipelines",
            "Containerize applications with Docker",
            "Deploy applications to Kubernetes",
            "Implement infrastructure as code"
        ],
        "learning_outcomes": [
            "CI/CD pipeline development",
            "Container orchestration with Kubernetes",
            "Infrastructure as code with Terraform",
            "Cloud platform management"
        ],
        "skills": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"]
    },
    
    {
        "title": "QA Automation Engineer Intern",
        "department": "Quality Assurance",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Develop automated tests for security software and applications. Learn test automation frameworks, testing methodologies, and quality assurance best practices.",
        "responsibilities": [
            "Write automated tests using Selenium and Pytest",
            "Develop test plans and test cases",
            "Perform regression and integration testing",
            "Report and track bugs"
        ],
        "learning_outcomes": [
            "Test automation with Selenium and Pytest",
            "QA methodologies and best practices",
            "Bug tracking and reporting",
            "Continuous testing in CI/CD"
        ],
        "skills": ["Software Testing", "Test Automation", "Selenium", "Python", "Bug Tracking"]
    },
    
    {
        "title": "Data Engineer Intern",
        "department": "Data Engineering",
        "required_programs": ["Computer Science", "Data Science", "Information Technology"],
        "description": "Build data pipelines for security analytics and threat intelligence. Work with big data technologies, ETL processes, and data warehousing.",
        "responsibilities": [
            "Design and implement ETL pipelines",
            "Process large-scale security data",
            "Optimize data storage and retrieval",
            "Build data quality checks"
        ],
        "learning_outcomes": [
            "Data pipeline development",
            "Big data technologies (Spark, Kafka)",
            "ETL processes and data warehousing",
            "Data quality and governance"
        ],
        "skills": ["Python", "SQL", "ETL", "Data Pipeline", "Apache Spark"]
    },
    
    {
        "title": "Machine Learning Engineer Intern",
        "department": "AI/ML",
        "required_programs": ["Computer Science", "Data Science", "Software Engineering"],
        "description": "Apply machine learning to cybersecurity problems. Work on threat detection models, anomaly detection systems, and security analytics.",
        "responsibilities": [
            "Develop ML models for threat detection",
            "Train and evaluate security models",
            "Implement anomaly detection algorithms",
            "Deploy models to production"
        ],
        "learning_outcomes": [
            "Machine learning for cybersecurity",
            "Model development and evaluation",
            "Feature engineering for security data",
            "ML model deployment and monitoring"
        ],
        "skills": ["Machine Learning", "Python", "TensorFlow", "Data Science", "Statistics"]
    },
    
    {
        "title": "API Developer Intern",
        "department": "Platform Engineering",
        "required_programs": ["Computer Science", "Software Engineering", "Information Technology"],
        "description": "Design and develop RESTful APIs for security platforms. Learn API design patterns, documentation, and integration best practices.",
        "responsibilities": [
            "Design RESTful API endpoints",
            "Implement API authentication and rate limiting",
            "Write API documentation",
            "Integrate third-party APIs"
        ],
        "learning_outcomes": [
            "RESTful API design principles",
            "API security and authentication",
            "API documentation with OpenAPI/Swagger",
            "API versioning and best practices"
        ],
        "skills": ["REST API", "Python", "FastAPI", "API Design", "Documentation"]
    },
    
    {
        "title": "Database Administrator Intern",
        "department": "Database Management",
        "required_programs": ["Computer Science", "Information Technology", "Information Systems"],
        "description": "Manage and optimize databases for security applications. Learn database administration, performance tuning, and backup strategies.",
        "responsibilities": [
            "Monitor database performance and health",
            "Optimize slow queries and indexes",
            "Implement backup and recovery procedures",
            "Manage database security and access"
        ],
        "learning_outcomes": [
            "Database administration and management",
            "Query optimization and indexing",
            "Backup and disaster recovery",
            "Database security best practices"
        ],
        "skills": ["PostgreSQL", "SQL", "Database Administration", "Performance Tuning", "Backup"]
    },
    
    # === DATA & ANALYTICS (5 positions) ===
    {
        "title": "Data Analyst Intern",
        "department": "Data Analytics",
        "required_programs": ["Data Science", "Statistics", "Computer Science", "Information Systems"],
        "description": "Analyze security data and create insights for decision-making. Learn data visualization, SQL, business intelligence, and statistical analysis.",
        "responsibilities": [
            "Analyze security metrics and KPIs",
            "Create dashboards and visualizations",
            "Generate reports for stakeholders",
            "Identify trends and patterns in data"
        ],
        "learning_outcomes": [
            "Data analysis and visualization",
            "SQL and database querying",
            "Business intelligence tools (Power BI, Tableau)",
            "Statistical analysis techniques"
        ],
        "skills": ["Data Analysis", "SQL", "Excel", "Data Visualization", "Power BI"]
    },
    
    {
        "title": "Business Intelligence Analyst Intern",
        "department": "Business Intelligence",
        "required_programs": ["Information Systems", "Data Science", "Business Administration", "Computer Science"],
        "description": "Build dashboards and reports for business stakeholders. Learn BI tools, data storytelling, and business analytics.",
        "responsibilities": [
            "Develop interactive dashboards in Power BI",
            "Create business reports and presentations",
            "Analyze business metrics and trends",
            "Support data-driven decision making"
        ],
        "learning_outcomes": [
            "Business intelligence and analytics",
            "Dashboard development with Power BI/Tableau",
            "Data storytelling and visualization",
            "Business metrics and KPIs"
        ],
        "skills": ["Business Intelligence", "Power BI", "Tableau", "SQL", "Data Visualization"]
    },
    
    {
        "title": "Security Data Scientist Intern",
        "department": "Data Science",
        "required_programs": ["Data Science", "Computer Science", "Statistics", "Mathematics"],
        "description": "Apply data science to cybersecurity problems. Work on predictive models, anomaly detection, and security analytics using Python and ML libraries.",
        "responsibilities": [
            "Build predictive models for security threats",
            "Perform statistical analysis on security data",
            "Develop anomaly detection algorithms",
            "Create data science notebooks and reports"
        ],
        "learning_outcomes": [
            "Data science for cybersecurity",
            "Statistical modeling and analysis",
            "Machine learning algorithms",
            "Python data science libraries"
        ],
        "skills": ["Data Science", "Python", "Machine Learning", "Statistics", "Pandas"]
    },
    
    {
        "title": "Security Metrics Analyst Intern",
        "department": "Security Metrics",
        "required_programs": ["Information Systems", "Data Science", "Computer Science", "Business Administration"],
        "description": "Track and report on security KPIs and metrics. Help develop dashboards for security program effectiveness and compliance reporting.",
        "responsibilities": [
            "Track security KPIs and metrics",
            "Create executive security reports",
            "Develop security dashboards",
            "Analyze security program effectiveness"
        ],
        "learning_outcomes": [
            "Security metrics and KPIs",
            "Dashboard development",
            "Security reporting and communication",
            "Data analysis for security programs"
        ],
        "skills": ["Data Analysis", "KPI Tracking", "Dashboard Development", "Excel", "Reporting"]
    },
    
    {
        "title": "Research Analyst Intern",
        "department": "Research & Development",
        "required_programs": ["Computer Science", "Information Systems", "Business Administration", "Data Science"],
        "description": "Conduct market research and competitive analysis in the cybersecurity industry. Support strategic planning with data-driven insights.",
        "responsibilities": [
            "Research cybersecurity market trends",
            "Analyze competitor products and strategies",
            "Compile research reports and presentations",
            "Support strategic planning initiatives"
        ],
        "learning_outcomes": [
            "Market research methodologies",
            "Competitive analysis techniques",
            "Research documentation and reporting",
            "Strategic analysis skills"
        ],
        "skills": ["Market Research", "Data Analysis", "Research Methodology", "Excel", "Presentation Skills"]
    },
    
    # === BUSINESS & OPERATIONS (8 positions) ===
    {
        "title": "Business Analyst Intern",
        "department": "Business Analysis",
        "required_programs": ["Information Systems", "Business Administration", "Computer Science", "Industrial Engineering"],
        "description": "Analyze business requirements and translate them into technical specifications. Work with stakeholders to improve business processes and systems.",
        "responsibilities": [
            "Gather and document business requirements",
            "Create process flow diagrams and specifications",
            "Analyze business processes for improvements",
            "Facilitate meetings with stakeholders"
        ],
        "learning_outcomes": [
            "Business analysis methodologies",
            "Requirements gathering and documentation",
            "Process improvement techniques",
            "Stakeholder management"
        ],
        "skills": ["Business Analysis", "Requirements Gathering", "Documentation", "Process Improvement", "Stakeholder Management"]
    },
    
    {
        "title": "Project Coordinator Intern",
        "department": "Project Management",
        "required_programs": ["Business Administration", "Industrial Engineering", "Information Systems", "Computer Science"],
        "description": "Support project managers in planning, tracking, and delivering cybersecurity projects. Learn project management methodologies and tools.",
        "responsibilities": [
            "Track project tasks and milestones",
            "Coordinate meetings and communications",
            "Update project documentation",
            "Support project reporting and status updates"
        ],
        "learning_outcomes": [
            "Project management fundamentals",
            "Agile and Scrum methodologies",
            "Project tracking and reporting",
            "Team coordination and communication"
        ],
        "skills": ["Project Management", "Coordination", "Scheduling", "Communication", "Microsoft Project"]
    },
    
    {
        "title": "Operations Analyst Intern",
        "department": "Operations",
        "required_programs": ["Industrial Engineering", "Business Administration", "Information Systems"],
        "description": "Optimize operational processes and analyze performance metrics. Help improve efficiency across security operations and business functions.",
        "responsibilities": [
            "Analyze operational processes and workflows",
            "Identify efficiency improvement opportunities",
            "Create process documentation",
            "Track operational KPIs"
        ],
        "learning_outcomes": [
            "Operations management principles",
            "Process optimization techniques",
            "Performance metrics and KPIs",
            "Lean and Six Sigma basics"
        ],
        "skills": ["Operations Management", "Process Optimization", "Data Analysis", "Reporting", "Excel"]
    },
    
    {
        "title": "Technical Writer Intern",
        "department": "Documentation",
        "required_programs": ["English", "Communication", "Technical Writing", "Computer Science", "Information Technology"],
        "description": "Create technical documentation, user guides, and security advisories. Learn technical writing best practices and documentation tools.",
        "responsibilities": [
            "Write technical documentation and user guides",
            "Create security advisories and knowledge base articles",
            "Edit and review technical content",
            "Maintain documentation repositories"
        ],
        "learning_outcomes": [
            "Technical writing principles",
            "Documentation tools and platforms",
            "Content management systems",
            "Technical communication skills"
        ],
        "skills": ["Technical Writing", "Documentation", "Communication", "Markdown", "Content Management"]
    },
    
    {
        "title": "Customer Success Intern",
        "department": "Customer Success",
        "required_programs": ["Business Administration", "Communication", "Information Technology", "Marketing"],
        "description": "Help clients maximize value from cybersecurity solutions. Learn customer relationship management, technical support, and client engagement.",
        "responsibilities": [
            "Support client onboarding and training",
            "Respond to customer inquiries and issues",
            "Track customer satisfaction metrics",
            "Create customer success materials"
        ],
        "learning_outcomes": [
            "Customer relationship management",
            "Technical support and troubleshooting",
            "Client communication skills",
            "Customer success metrics"
        ],
        "skills": ["Customer Service", "Communication", "Problem Solving", "CRM", "Technical Support"]
    },
    
    {
        "title": "Product Management Intern",
        "department": "Product Management",
        "required_programs": ["Business Administration", "Computer Science", "Information Systems", "Industrial Engineering"],
        "description": "Support product development and strategy for security solutions. Learn product management, user research, and product roadmap planning.",
        "responsibilities": [
            "Gather product requirements from users",
            "Assist in product roadmap planning",
            "Conduct user research and testing",
            "Create product documentation"
        ],
        "learning_outcomes": [
            "Product management fundamentals",
            "User research and feedback analysis",
            "Product roadmap development",
            "Agile product development"
        ],
        "skills": ["Product Management", "User Research", "Requirements Analysis", "Agile", "Communication"]
    },
    
    {
        "title": "Supply Chain Intern",
        "department": "Supply Chain",
        "required_programs": ["Industrial Engineering", "Business Administration", "Operations Management"],
        "description": "Support supply chain operations including procurement, vendor management, and inventory control for IT and security equipment.",
        "responsibilities": [
            "Process purchase orders and requisitions",
            "Coordinate with vendors and suppliers",
            "Track inventory and shipments",
            "Maintain procurement documentation"
        ],
        "learning_outcomes": [
            "Supply chain management principles",
            "Procurement processes",
            "Vendor relationship management",
            "Inventory control systems"
        ],
        "skills": ["Procurement", "Vendor Management", "Supply Chain", "Negotiation", "Excel"]
    },
    
    {
        "title": "Process Improvement Intern",
        "department": "Continuous Improvement",
        "required_programs": ["Industrial Engineering", "Business Administration", "Operations Management"],
        "description": "Identify and implement process improvements across the organization. Learn Lean, Six Sigma, and continuous improvement methodologies.",
        "responsibilities": [
            "Map and analyze business processes",
            "Identify improvement opportunities",
            "Implement process changes",
            "Measure improvement results"
        ],
        "learning_outcomes": [
            "Lean and Six Sigma methodologies",
            "Process mapping and analysis",
            "Change management",
            "Performance measurement"
        ],
        "skills": ["Process Improvement", "Lean Six Sigma", "Process Mapping", "Data Analysis", "Change Management"]
    },
    
    # === HUMAN RESOURCES (5 positions) ===
    {
        "title": "HR Recruitment Intern",
        "department": "Human Resources",
        "required_programs": ["Human Resource Management", "Psychology", "Business Administration"],
        "description": "Support recruitment for cybersecurity positions. Learn talent acquisition strategies, interviewing techniques, and applicant tracking systems.",
        "responsibilities": [
            "Source candidates through various channels",
            "Screen resumes and conduct initial interviews",
            "Coordinate interview schedules",
            "Maintain applicant tracking system"
        ],
        "learning_outcomes": [
            "Recruitment and talent acquisition",
            "Interviewing and candidate assessment",
            "Applicant tracking systems",
            "Employer branding"
        ],
        "skills": ["Recruitment", "Talent Acquisition", "Interviewing", "HR Management", "Applicant Tracking Systems"]
    },
    
    {
        "title": "HR Generalist Intern",
        "department": "Human Resources",
        "required_programs": ["Human Resource Management", "Psychology", "Business Administration"],
        "description": "Assist with various HR functions including onboarding, benefits administration, and employee relations. Gain broad HR experience.",
        "responsibilities": [
            "Support employee onboarding process",
            "Maintain HR records and documentation",
            "Assist with benefits administration",
            "Support employee engagement initiatives"
        ],
        "learning_outcomes": [
            "HR operations and administration",
            "Employee relations and engagement",
            "Benefits and compensation basics",
            "HRIS systems"
        ],
        "skills": ["HR Management", "Employee Relations", "Onboarding", "Benefits Administration", "HRIS"]
    },
    
    {
        "title": "Learning & Development Intern",
        "department": "Learning & Development",
        "required_programs": ["Human Resource Management", "Education", "Psychology", "Communication"],
        "description": "Design and deliver training programs for cybersecurity professionals. Learn instructional design, e-learning development, and training coordination.",
        "responsibilities": [
            "Develop training materials and presentations",
            "Coordinate training sessions and workshops",
            "Manage learning management system",
            "Evaluate training effectiveness"
        ],
        "learning_outcomes": [
            "Instructional design principles",
            "E-learning development",
            "Training delivery and facilitation",
            "Learning management systems"
        ],
        "skills": ["Training Coordination", "Instructional Design", "E-Learning", "Presentation Skills", "LMS"]
    },
    
    {
        "title": "Talent Development Intern",
        "department": "Talent Development",
        "required_programs": ["Human Resource Management", "Psychology", "Business Administration"],
        "description": "Support employee development programs including career planning, performance management, and succession planning.",
        "responsibilities": [
            "Assist in performance review processes",
            "Support career development programs",
            "Coordinate talent assessments",
            "Maintain talent development records"
        ],
        "learning_outcomes": [
            "Talent management strategies",
            "Performance management systems",
            "Career development planning",
            "Succession planning"
        ],
        "skills": ["Talent Development", "Performance Management", "Career Planning", "Assessment", "HR Analytics"]
    },
    
    {
        "title": "HR Analytics Intern",
        "department": "HR Analytics",
        "required_programs": ["Human Resource Management", "Data Science", "Business Administration", "Statistics"],
        "description": "Analyze HR data and metrics to support people decisions. Learn HR analytics, workforce planning, and people analytics tools.",
        "responsibilities": [
            "Analyze HR metrics and trends",
            "Create HR dashboards and reports",
            "Support workforce planning activities",
            "Conduct employee surveys and analysis"
        ],
        "learning_outcomes": [
            "HR analytics and metrics",
            "Workforce planning and forecasting",
            "People analytics tools",
            "Data-driven HR decision making"
        ],
        "skills": ["HR Analytics", "Data Analysis", "Excel", "Power BI", "Workforce Planning"]
    },
    
    # === MARKETING & SALES (6 positions) ===
    {
        "title": "Digital Marketing Intern",
        "department": "Marketing",
        "required_programs": ["Marketing", "Business Administration", "Communication", "Multimedia Arts"],
        "description": "Support digital marketing campaigns for cybersecurity services. Learn SEO, social media marketing, content creation, and marketing analytics.",
        "responsibilities": [
            "Create social media content and campaigns",
            "Manage social media accounts",
            "Conduct SEO research and optimization",
            "Track marketing metrics and ROI"
        ],
        "learning_outcomes": [
            "Digital marketing strategies",
            "Social media marketing",
            "SEO and content marketing",
            "Marketing analytics and metrics"
        ],
        "skills": ["Digital Marketing", "Content Creation", "Social Media", "Marketing Analytics", "SEO"]
    },
    
    {
        "title": "Content Marketing Intern",
        "department": "Content Marketing",
        "required_programs": ["Marketing", "Communication", "English", "Journalism"],
        "description": "Create engaging content about cybersecurity topics for blogs, social media, and newsletters. Learn content strategy, SEO writing, and content management.",
        "responsibilities": [
            "Write blog posts and articles on cybersecurity",
            "Create email newsletters and campaigns",
            "Develop content calendar",
            "Optimize content for SEO"
        ],
        "learning_outcomes": [
            "Content marketing strategy",
            "SEO writing and optimization",
            "Content management systems",
            "Editorial planning"
        ],
        "skills": ["Content Writing", "SEO", "Social Media Marketing", "Blogging", "Content Strategy"]
    },
    
    {
        "title": "Sales Development Intern",
        "department": "Sales",
        "required_programs": ["Business Administration", "Marketing", "Communication"],
        "description": "Generate leads and support B2B sales for cybersecurity solutions. Learn sales prospecting, CRM systems, and business development.",
        "responsibilities": [
            "Research and qualify sales leads",
            "Conduct outreach to potential clients",
            "Schedule meetings for sales team",
            "Maintain CRM database"
        ],
        "learning_outcomes": [
            "B2B sales fundamentals",
            "Lead generation and qualification",
            "CRM systems and sales tools",
            "Sales communication skills"
        ],
        "skills": ["Sales", "Lead Generation", "CRM", "Communication", "Business Development"]
    },
    
    {
        "title": "Business Development Intern",
        "department": "Business Development",
        "required_programs": ["Business Administration", "Marketing", "Economics"],
        "description": "Identify new business opportunities and support partnership initiatives. Learn market research, strategic planning, and business analysis.",
        "responsibilities": [
            "Research market opportunities",
            "Analyze competitor strategies",
            "Support partnership development",
            "Create business presentations"
        ],
        "learning_outcomes": [
            "Business development strategies",
            "Market analysis and research",
            "Partnership development",
            "Strategic planning"
        ],
        "skills": ["Business Development", "Market Research", "Presentation Skills", "Negotiation", "Strategic Planning"]
    },
    
    {
        "title": "Marketing Analytics Intern",
        "department": "Marketing Analytics",
        "required_programs": ["Marketing", "Data Science", "Business Administration", "Statistics"],
        "description": "Analyze marketing data and campaign performance. Learn marketing analytics, attribution modeling, and data-driven marketing.",
        "responsibilities": [
            "Track and analyze marketing KPIs",
            "Create marketing dashboards",
            "Analyze campaign performance",
            "Generate marketing insights"
        ],
        "learning_outcomes": [
            "Marketing analytics and metrics",
            "Campaign performance analysis",
            "Marketing attribution",
            "Data visualization for marketing"
        ],
        "skills": ["Marketing Analytics", "Data Analysis", "Google Analytics", "Excel", "Dashboard Development"]
    },
    
    {
        "title": "Brand Marketing Intern",
        "department": "Brand Marketing",
        "required_programs": ["Marketing", "Communication", "Multimedia Arts", "Business Administration"],
        "description": "Support brand development and marketing initiatives. Learn brand strategy, creative development, and brand management.",
        "responsibilities": [
            "Support brand campaign development",
            "Create brand marketing materials",
            "Coordinate brand events",
            "Monitor brand perception"
        ],
        "learning_outcomes": [
            "Brand strategy and positioning",
            "Creative campaign development",
            "Brand management",
            "Event marketing"
        ],
        "skills": ["Brand Marketing", "Creative Development", "Event Planning", "Communication", "Design"]
    },
    
    # === FINANCE & ADMINISTRATION (6 positions) ===
    {
        "title": "Finance Intern",
        "department": "Finance",
        "required_programs": ["Accounting", "Finance", "Business Administration"],
        "description": "Support financial operations including budgeting, forecasting, and financial reporting. Learn corporate finance, accounting, and financial analysis.",
        "responsibilities": [
            "Assist with financial reporting and analysis",
            "Support budgeting and forecasting",
            "Process invoices and payments",
            "Maintain financial records"
        ],
        "learning_outcomes": [
            "Financial accounting and reporting",
            "Budgeting and forecasting",
            "Financial analysis techniques",
            "Accounting software systems"
        ],
        "skills": ["Accounting", "Financial Analysis", "Excel", "Budgeting", "Financial Reporting"]
    },
    
    {
        "title": "Accounting Intern",
        "department": "Accounting",
        "required_programs": ["Accounting", "Finance", "Business Administration"],
        "description": "Support accounting operations including accounts payable, receivable, and general ledger. Learn accounting principles and financial systems.",
        "responsibilities": [
            "Process accounts payable and receivable",
            "Reconcile accounts and transactions",
            "Assist with month-end closing",
            "Prepare financial statements"
        ],
        "learning_outcomes": [
            "Accounting principles and practices",
            "Financial statement preparation",
            "Account reconciliation",
            "Accounting software (QuickBooks, SAP)"
        ],
        "skills": ["Accounting", "Bookkeeping", "Financial Statements", "Reconciliation", "QuickBooks"]
    },
    
    {
        "title": "Financial Analyst Intern",
        "department": "Financial Planning & Analysis",
        "required_programs": ["Finance", "Accounting", "Economics", "Business Administration"],
        "description": "Analyze financial data and support business planning. Learn financial modeling, variance analysis, and business intelligence.",
        "responsibilities": [
            "Build financial models and forecasts",
            "Analyze financial performance",
            "Create executive financial reports",
            "Support strategic planning"
        ],
        "learning_outcomes": [
            "Financial modeling and analysis",
            "Variance analysis",
            "Business intelligence",
            "Strategic financial planning"
        ],
        "skills": ["Financial Analysis", "Financial Modeling", "Excel", "Power BI", "Forecasting"]
    },
    
    {
        "title": "Administrative Assistant Intern",
        "department": "Administration",
        "required_programs": ["Business Administration", "Office Administration", "Management"],
        "description": "Provide administrative support to executives and teams. Learn office management, scheduling, and administrative procedures.",
        "responsibilities": [
            "Manage calendars and schedule meetings",
            "Prepare documents and presentations",
            "Coordinate travel arrangements",
            "Maintain office supplies and equipment"
        ],
        "learning_outcomes": [
            "Office administration and management",
            "Executive support skills",
            "Document preparation",
            "Professional communication"
        ],
        "skills": ["Administrative Support", "Office Management", "Scheduling", "Communication", "Microsoft Office"]
    },
    
    {
        "title": "Legal & Compliance Intern",
        "department": "Legal",
        "required_programs": ["Legal Management", "Business Administration", "Political Science"],
        "description": "Support legal team with contract review, compliance monitoring, and legal research. Learn cybersecurity law, regulations, and compliance.",
        "responsibilities": [
            "Review and draft contracts",
            "Conduct legal research",
            "Monitor regulatory compliance",
            "Maintain legal documentation"
        ],
        "learning_outcomes": [
            "Contract law and review",
            "Legal research methods",
            "Regulatory compliance",
            "Cybersecurity law and regulations"
        ],
        "skills": ["Legal Research", "Contract Review", "Compliance", "Documentation", "Regulatory Knowledge"]
    },
    
    {
        "title": "Facilities Management Intern",
        "department": "Facilities",
        "required_programs": ["Business Administration", "Industrial Engineering", "Management"],
        "description": "Support facilities operations and workplace management. Learn office administration, vendor management, and facility coordination.",
        "responsibilities": [
            "Coordinate facility maintenance",
            "Manage vendor relationships",
            "Support workplace safety programs",
            "Track facility expenses"
        ],
        "learning_outcomes": [
            "Facilities management principles",
            "Vendor relationship management",
            "Workplace safety and compliance",
            "Budget management"
        ],
        "skills": ["Facilities Management", "Coordination", "Vendor Relations", "Problem Solving", "Communication"]
    },
]
