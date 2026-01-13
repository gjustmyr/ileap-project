from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import os

# Create templates directory if it doesn't exist
os.makedirs('templates', exist_ok=True)

# Create PDF
pdf_path = 'templates/Performance_Appraisal_Form_Template.pdf'
c = canvas.Canvas(pdf_path, pagesize=letter)
width, height = letter

# Title
c.setFont("Helvetica-Bold", 18)
c.drawCentredString(width/2, height - 50, "PERFORMANCE APPRAISAL FORM")

c.setFont("Helvetica-Bold", 14)
c.drawCentredString(width/2, height - 75, "On-the-Job Training Evaluation")

# Draw a line
c.setStrokeColor(colors.HexColor("#22c55e"))
c.setLineWidth(2)
c.line(50, height - 85, width - 50, height - 85)

# Student Information Section
y_position = height - 120
c.setFont("Helvetica-Bold", 12)
c.setFillColor(colors.black)
c.drawString(50, y_position, "STUDENT INFORMATION")

y_position -= 25
c.setFont("Helvetica", 10)
c.drawString(50, y_position, "Student Name: _________________________________________")
c.drawString(350, y_position, "SR Code: _________________")

y_position -= 20
c.drawString(50, y_position, "Program: ______________________________________________")
c.drawString(350, y_position, "Year Level: ______________")

y_position -= 20
c.drawString(50, y_position, "Company/Organization: _____________________________________")

y_position -= 20
c.drawString(50, y_position, "Department: ___________________")
c.drawString(350, y_position, "Position: _____________________")

y_position -= 20
c.drawString(50, y_position, "Supervisor Name: __________________________________________")

y_position -= 20
c.drawString(50, y_position, "Evaluation Period: From ______________ To ______________")

# Performance Criteria Section
y_position -= 40
c.setFont("Helvetica-Bold", 12)
c.drawString(50, y_position, "PERFORMANCE EVALUATION CRITERIA")

y_position -= 15
c.setFont("Helvetica", 9)
c.drawString(50, y_position, "Rate the student's performance using the following scale:")
c.drawString(50, y_position - 12, "5 - Outstanding  |  4 - Very Good  |  3 - Good  |  2 - Fair  |  1 - Poor")

# Performance Table
y_position -= 40
criteria = [
    ["CRITERIA", "RATING (1-5)"],
    ["1. Quality of Work - Accuracy, thoroughness, and neatness", ""],
    ["2. Productivity - Volume of work completed", ""],
    ["3. Job Knowledge - Understanding of job duties and procedures", ""],
    ["4. Initiative - Self-starter, seeks additional responsibilities", ""],
    ["5. Communication - Oral and written communication skills", ""],
    ["6. Teamwork - Cooperation with colleagues", ""],
    ["7. Dependability - Reliability, punctuality, attendance", ""],
    ["8. Adaptability - Flexibility in handling changing priorities", ""],
    ["9. Problem Solving - Analytical and critical thinking skills", ""],
    ["10. Professional Conduct - Attitude, ethics, appearance", ""],
]

table = Table(criteria, colWidths=[4.5*inch, 1.5*inch])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#22c55e")),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))

table.wrapOn(c, width, height)
table.drawOn(c, 50, y_position - 220)

# Comments Section
y_position = y_position - 260
c.setFont("Helvetica-Bold", 12)
c.drawString(50, y_position, "COMMENTS AND RECOMMENDATIONS")

y_position -= 20
c.setFont("Helvetica", 10)
c.drawString(50, y_position, "Strengths:")
c.line(50, y_position - 5, width - 50, y_position - 5)
c.line(50, y_position - 25, width - 50, y_position - 25)

y_position -= 45
c.drawString(50, y_position, "Areas for Improvement:")
c.line(50, y_position - 5, width - 50, y_position - 5)
c.line(50, y_position - 25, width - 50, y_position - 25)

y_position -= 45
c.drawString(50, y_position, "Overall Recommendation:")
c.line(50, y_position - 5, width - 50, y_position - 5)
c.line(50, y_position - 25, width - 50, y_position - 25)

# Signature Section
y_position -= 60
c.setFont("Helvetica-Bold", 11)
c.drawString(50, y_position, "SUPERVISOR'S SIGNATURE")

y_position -= 30
c.setFont("Helvetica", 10)
c.line(50, y_position, 250, y_position)
c.drawString(50, y_position - 15, "Signature over Printed Name")

c.line(350, y_position, 500, y_position)
c.drawString(350, y_position - 15, "Date")

# Footer
c.setFont("Helvetica", 8)
c.setFillColor(colors.grey)
c.drawCentredString(width/2, 30, "This form is confidential and should be submitted to the OJT Coordinator")

c.save()

print(f"✅ Performance Appraisal Form Template created successfully!")
print(f"📄 File location: {pdf_path}")
