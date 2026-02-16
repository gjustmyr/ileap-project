from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import (
    RequirementTemplate, 
    ClassRequirementTemplate, 
    RequirementSubmission, 
    Class, 
    Student, 
    ClassEnrollment
)
from typing import List, Dict, Any
from datetime import datetime


def get_class_requirements(class_id: int, db: Session) -> Dict[str, Any]:
    """Get all requirements assigned to a specific class"""
    try:
        # Verify class exists
        class_obj = db.query(Class).filter(Class.class_id == class_id).first()
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Get requirements assigned to this class
        requirements = db.query(RequirementTemplate).join(
            ClassRequirementTemplate,
            RequirementTemplate.template_id == ClassRequirementTemplate.requirement_template_id
        ).filter(
            ClassRequirementTemplate.class_id == class_id,
            ClassRequirementTemplate.is_active == True
        ).order_by(RequirementTemplate.order_index).all()
        
        requirements_data = []
        for req in requirements:
            requirements_data.append({
                "template_id": req.template_id,
                "requirement_id": req.requirement_id,
                "title": req.title,
                "description": req.description,
                "type": req.type,
                "template_url": req.template_url,
                "is_required": req.is_required,
                "order_index": req.order_index,
                "accessible_to": req.accessible_to
            })
        
        return {
            "success": True,
            "class_info": {
                "class_id": class_obj.class_id,
                "class_section": class_obj.class_section,
                "semester": class_obj.semester,
                "school_year": class_obj.school_year
            },
            "requirements": requirements_data,
            "total_requirements": len(requirements_data)
        }
    
    except Exception as e:
        print(f"Error getting class requirements: {str(e)}")
        return {
            "success": False,
            "message": f"Error retrieving class requirements: {str(e)}"
        }


def get_student_class_requirements(student_id: int, class_id: int, db: Session) -> Dict[str, Any]:
    """Get requirements for a specific student in a specific class with submission status"""
    try:
        # Verify student is enrolled in the class
        enrollment = db.query(ClassEnrollment).filter(
            ClassEnrollment.student_id == student_id,
            ClassEnrollment.class_id == class_id,
            ClassEnrollment.status == "active"
        ).first()
        
        if not enrollment:
            raise HTTPException(
                status_code=404, 
                detail="Student not found in this class or enrollment is not active"
            )
        
        # Get student info
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get class info
        class_obj = db.query(Class).filter(Class.class_id == class_id).first()
        
        # Get requirements with submission status using raw SQL for better performance
        query = """
        SELECT 
            rt.template_id,
            rt.requirement_id,
            rt.title,
            rt.description,
            rt.type,
            rt.template_url,
            rt.is_required,
            rt.order_index,
            rt.accessible_to,
            rs.id as submission_id,
            rs.file_url,
            rs.status as submission_status,
            rs.validated,
            rs.returned,
            rs.remarks,
            rs.submitted_at,
            rs.validated_at
        FROM requirement_templates rt
        JOIN class_requirement_templates crt ON rt.template_id = crt.requirement_template_id
        LEFT JOIN requirement_submissions rs ON (
            rt.requirement_id = rs.requirement_id 
            AND rs.student_id = :student_id 
            AND rs.class_id = :class_id
        )
        WHERE crt.class_id = :class_id 
        AND crt.is_active = TRUE
        ORDER BY rt.order_index
        """
        
        result = db.execute(query, {
            "student_id": student_id,
            "class_id": class_id
        })
        
        requirements_data = []
        pre_ojt_count = 0
        post_ojt_count = 0
        pre_ojt_submitted = 0
        post_ojt_submitted = 0
        
        for row in result:
            req_data = {
                "template_id": row.template_id,
                "requirement_id": row.requirement_id,
                "title": row.title,
                "description": row.description,
                "type": row.type,
                "template_url": row.template_url,
                "is_required": row.is_required,
                "order_index": row.order_index,
                "accessible_to": row.accessible_to,
                "submission": None
            }
            
            # Add submission info if exists
            if row.submission_id:
                req_data["submission"] = {
                    "id": row.submission_id,
                    "file_url": row.file_url,
                    "status": row.submission_status,
                    "validated": row.validated,
                    "returned": row.returned,
                    "remarks": row.remarks,
                    "submitted_at": row.submitted_at.isoformat() if row.submitted_at else None,
                    "validated_at": row.validated_at.isoformat() if row.validated_at else None
                }
            
            requirements_data.append(req_data)
            
            # Count requirements by type
            if row.type == "pre":
                pre_ojt_count += 1
                if row.submission_id:
                    pre_ojt_submitted += 1
            elif row.type == "post":
                post_ojt_count += 1
                if row.submission_id:
                    post_ojt_submitted += 1
        
        return {
            "success": True,
            "student_info": {
                "student_id": student.student_id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "sr_code": student.sr_code
            },
            "class_info": {
                "class_id": class_obj.class_id,
                "class_section": class_obj.class_section,
                "semester": class_obj.semester,
                "school_year": class_obj.school_year
            },
            "requirements": requirements_data,
            "summary": {
                "total_requirements": len(requirements_data),
                "pre_ojt": {
                    "total": pre_ojt_count,
                    "submitted": pre_ojt_submitted,
                    "percentage": (pre_ojt_submitted / pre_ojt_count * 100) if pre_ojt_count > 0 else 0
                },
                "post_ojt": {
                    "total": post_ojt_count,
                    "submitted": post_ojt_submitted,
                    "percentage": (post_ojt_submitted / post_ojt_count * 100) if post_ojt_count > 0 else 0
                }
            }
        }
    
    except Exception as e:
        print(f"Error getting student class requirements: {str(e)}")
        return {
            "success": False,
            "message": f"Error retrieving student requirements: {str(e)}"
        }


def assign_requirements_to_class(class_id: int, requirement_template_ids: List[int], db: Session) -> Dict[str, Any]:
    """Assign multiple requirement templates to a class"""
    try:
        # Verify class exists
        class_obj = db.query(Class).filter(Class.class_id == class_id).first()
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Verify all requirement templates exist
        templates = db.query(RequirementTemplate).filter(
            RequirementTemplate.template_id.in_(requirement_template_ids)
        ).all()
        
        if len(templates) != len(requirement_template_ids):
            raise HTTPException(status_code=404, detail="One or more requirement templates not found")
        
        assigned_count = 0
        skipped_count = 0
        
        for template_id in requirement_template_ids:
            # Check if already assigned
            existing = db.query(ClassRequirementTemplate).filter(
                ClassRequirementTemplate.class_id == class_id,
                ClassRequirementTemplate.requirement_template_id == template_id
            ).first()
            
            if existing:
                # Reactivate if inactive
                if not existing.is_active:
                    existing.is_active = True
                    existing.updated_at = datetime.utcnow()
                    assigned_count += 1
                else:
                    skipped_count += 1
            else:
                # Create new assignment
                assignment = ClassRequirementTemplate(
                    class_id=class_id,
                    requirement_template_id=template_id,
                    is_active=True
                )
                db.add(assignment)
                assigned_count += 1
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Successfully assigned {assigned_count} requirements to class. {skipped_count} were already assigned.",
            "assigned_count": assigned_count,
            "skipped_count": skipped_count
        }
    
    except Exception as e:
        db.rollback()
        print(f"Error assigning requirements to class: {str(e)}")
        return {
            "success": False,
            "message": f"Error assigning requirements: {str(e)}"
        }


def remove_requirements_from_class(class_id: int, requirement_template_ids: List[int], db: Session) -> Dict[str, Any]:
    """Remove requirement templates from a class (deactivate assignments)"""
    try:
        # Verify class exists
        class_obj = db.query(Class).filter(Class.class_id == class_id).first()
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Deactivate assignments
        updated_count = db.query(ClassRequirementTemplate).filter(
            ClassRequirementTemplate.class_id == class_id,
            ClassRequirementTemplate.requirement_template_id.in_(requirement_template_ids),
            ClassRequirementTemplate.is_active == True
        ).update({
            "is_active": False,
            "updated_at": datetime.utcnow()
        }, synchronize_session=False)
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Successfully removed {updated_count} requirements from class.",
            "removed_count": updated_count
        }
    
    except Exception as e:
        db.rollback()
        print(f"Error removing requirements from class: {str(e)}")
        return {
            "success": False,
            "message": f"Error removing requirements: {str(e)}"
        }


def copy_requirements_between_classes(source_class_id: int, target_class_id: int, db: Session) -> Dict[str, Any]:
    """Copy requirement assignments from one class to another"""
    try:
        # Verify both classes exist
        source_class = db.query(Class).filter(Class.class_id == source_class_id).first()
        target_class = db.query(Class).filter(Class.class_id == target_class_id).first()
        
        if not source_class:
            raise HTTPException(status_code=404, detail="Source class not found")
        if not target_class:
            raise HTTPException(status_code=404, detail="Target class not found")
        
        # Get requirements from source class
        source_requirements = db.query(ClassRequirementTemplate).filter(
            ClassRequirementTemplate.class_id == source_class_id,
            ClassRequirementTemplate.is_active == True
        ).all()
        
        if not source_requirements:
            return {
                "success": True,
                "message": "No requirements found in source class to copy.",
                "copied_count": 0
            }
        
        copied_count = 0
        skipped_count = 0
        
        for source_req in source_requirements:
            # Check if already assigned to target class
            existing = db.query(ClassRequirementTemplate).filter(
                ClassRequirementTemplate.class_id == target_class_id,
                ClassRequirementTemplate.requirement_template_id == source_req.requirement_template_id
            ).first()
            
            if existing:
                # Reactivate if inactive
                if not existing.is_active:
                    existing.is_active = True
                    existing.updated_at = datetime.utcnow()
                    copied_count += 1
                else:
                    skipped_count += 1
            else:
                # Create new assignment
                new_assignment = ClassRequirementTemplate(
                    class_id=target_class_id,
                    requirement_template_id=source_req.requirement_template_id,
                    is_active=True
                )
                db.add(new_assignment)
                copied_count += 1
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Successfully copied {copied_count} requirements from {source_class.class_section} to {target_class.class_section}. {skipped_count} were already assigned.",
            "copied_count": copied_count,
            "skipped_count": skipped_count
        }
    
    except Exception as e:
        db.rollback()
        print(f"Error copying requirements between classes: {str(e)}")
        return {
            "success": False,
            "message": f"Error copying requirements: {str(e)}"
        }