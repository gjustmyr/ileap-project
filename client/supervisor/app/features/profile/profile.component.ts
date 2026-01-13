import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { StudentService } from '../../shared/services/student.service';
import {
  CustomStepperComponent,
  Step,
} from '../../shared/components/custom-stepper/custom-stepper.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomStepperComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  profilePicture: string | null = null;
  privacyAgreed: boolean = false;
  currentStep: number = 0;

  // Skills management
  skills: any[] = [];
  availableSkills: any[] = [];
  newSkillName: string = '';
  isAddingSkill: boolean = false;

  steps: Step[] = [
    { label: 'Data Privacy Agreement', completed: false },
    { label: 'Personal Information', completed: false },
    { label: 'Contact Information', completed: false },
    { label: 'Family Background', completed: false },
    { label: 'School Information', completed: false },
    { label: 'Skills', completed: false },
    { label: 'Emergency Contact', completed: false },
  ];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
    this.loadAvailableSkills();
    this.setupBirthdateListener();
  }

  setupBirthdateListener(): void {
    this.profileForm.get('birthdate')?.valueChanges.subscribe((birthdate) => {
      if (birthdate) {
        const age = this.calculateAge(birthdate);
        this.profileForm.patchValue({ age }, { emitEvent: false });
      }
    });
  }

  calculateAge(birthdate: string): number {
    if (!birthdate) return 0;

    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      // Personal Information
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      sex: [''],
      height: [''],
      weight: [''],
      complexion: [''],
      disability: [''],
      birthdate: [''],
      birthplace: [''],
      citizenship: [''],
      civil_status: [''],
      about: [''],

      // Contact Information
      present_address: [''],
      provincial_address: [''],
      contact_number: [''],
      tel_no_present: [''],
      tel_no_provincial: [''],

      // Family Background
      father_name: [''],
      father_occupation: [''],
      mother_name: [''],
      mother_occupation: [''],
      parents_address: [''],
      parents_tel_no: [''],
      guardian_name: [''],
      guardian_tel_no: [''],

      // School Information
      program: [''],
      major: [''],
      department: [''],
      year_level: [''],
      length_of_program: [''],
      school_address: [''],
      ojt_coordinator: [''],
      ojt_coordinator_tel: [''],
      ojt_head: [''],
      ojt_head_tel: [''],
      dean: [''],
      dean_tel: [''],

      // Emergency Contact
      emergency_contact_name: [''],
      emergency_contact_relationship: [''],
      emergency_contact_address: [''],
      emergency_contact_tel: [''],
    });
  }

  loadProfile(): void {
    this.isLoading = true;

    // Load profile data
    this.studentService.getProfile().subscribe({
      next: (response) => {
        const data = response.data;
        this.profileForm.patchValue(data);
        this.profilePicture = data.profile_picture;
        this.skills = data.skills || [];

        // Recalculate age from birthdate
        if (data.birthdate) {
          const age = this.calculateAge(data.birthdate);
          this.profileForm.patchValue({ age }, { emitEvent: false });
        }

        // Load class info to auto-populate program, coordinator, and dean
        this.loadClassInfo();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile',
          confirmButtonColor: '#10b981',
        });
        this.isLoading = false;
      },
    });
  }

  loadClassInfo(): void {
    this.studentService.getClassInfo().subscribe({
      next: (response) => {
        if (response && response.data) {
          const classInfo = response.data;

          // Auto-populate program if available
          if (classInfo.program) {
            this.profileForm.patchValue(
              {
                program: classInfo.program.program_name,
              },
              { emitEvent: false }
            );
          }

          // Auto-populate department if available
          if (classInfo.department) {
            this.profileForm.patchValue(
              {
                department: classInfo.department.department_name,
                dean: classInfo.department.dean_name,
                dean_tel: classInfo.department.dean_contact,
              },
              { emitEvent: false }
            );
          }

          // Auto-populate OJT coordinator if available
          if (classInfo.ojt_coordinator) {
            this.profileForm.patchValue(
              {
                ojt_coordinator: `${classInfo.ojt_coordinator.first_name} ${classInfo.ojt_coordinator.last_name}`,
                ojt_coordinator_tel: classInfo.ojt_coordinator.contact_number,
              },
              { emitEvent: false }
            );
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        // Silent fail - student can manually enter data
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.privacyAgreed) {
      this.isSaving = true;
      this.studentService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully',
            confirmButtonColor: '#10b981',
          });
          this.isSaving = false;
          // Reload profile to reflect changes
          this.loadProfile();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update profile',
            confirmButtonColor: '#10b981',
          });
          this.isSaving = false;
        },
      });
    } else if (!this.privacyAgreed) {
      Swal.fire({
        icon: 'warning',
        title: 'Privacy Agreement',
        text: 'Please agree to the Data Privacy Agreement',
        confirmButtonColor: '#10b981',
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#10b981',
      });
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0: // Privacy Agreement
        return this.privacyAgreed;
      case 1: // Personal Information - Required fields
        const firstName = this.profileForm.get('first_name')?.value;
        const lastName = this.profileForm.get('last_name')?.value;
        const email = this.profileForm.get('email')?.value;
        return !!(
          firstName &&
          lastName &&
          email &&
          this.profileForm.get('email')?.valid
        );
      case 2: // Contact Information - At least one contact method required
        const phone = this.profileForm.get('contact_number')?.value;
        const presentAddr = this.profileForm.get('present_address')?.value;
        return !!(phone || presentAddr);
      case 3: // Family Background
        return true; // Optional fields
      case 4: // School Information
        return true; // Optional fields
      case 5: // Skills
        return true; // Optional fields
      case 6: // Emergency Contact - Required
        const emergencyName = this.profileForm.get(
          'emergency_contact_name'
        )?.value;
        const emergencyTel = this.profileForm.get(
          'emergency_contact_tel'
        )?.value;
        return !!(emergencyName && emergencyTel);
      default:
        return true;
    }
  }

  canProceedToNextStep(step: number): boolean {
    return this.isStepValid(step);
  }

  updateStepCompletion(stepIndex: number): void {
    this.steps[stepIndex].completed = this.isStepValid(stepIndex);
  }

  onStepChange(stepIndex: number): void {
    // Update completion status when navigating
    if (this.currentStep < this.steps.length) {
      this.updateStepCompletion(this.currentStep);
    }
    this.currentStep = stepIndex;
  }

  nextStep(): void {
    if (this.canProceedToNextStep(this.currentStep)) {
      this.updateStepCompletion(this.currentStep);
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  loadAvailableSkills(): void {
    this.studentService.getAllSkills().subscribe({
      next: (response) => {
        this.availableSkills = response.data || [];
      },
      error: (error) => {
        console.error('Error loading skills:', error);
      },
    });
  }

  addSkill(): void {
    if (!this.newSkillName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Skill Name Required',
        text: 'Please enter a skill name',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    this.isAddingSkill = true;
    this.studentService.addSkill(this.newSkillName.trim()).subscribe({
      next: (response) => {
        this.skills.push(response.data);
        this.newSkillName = '';
        this.isAddingSkill = false;
        this.loadAvailableSkills(); // Refresh available skills
      },
      error: (error) => {
        console.error('Error adding skill:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.detail || 'Failed to add skill',
          confirmButtonColor: '#10b981',
        });
        this.isAddingSkill = false;
      },
    });
  }

  removeSkill(skillId: number): void {
    Swal.fire({
      title: 'Remove Skill?',
      text: 'Are you sure you want to remove this skill?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.removeSkill(skillId).subscribe({
          next: () => {
            this.skills = this.skills.filter((s) => s.skill_id !== skillId);
          },
          error: (error) => {
            console.error('Error removing skill:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to remove skill',
              confirmButtonColor: '#10b981',
            });
          },
        });
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File',
          text: 'Please select an image file',
          confirmButtonColor: '#10b981',
        });
        return;
      }

      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload to server
      this.studentService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.profilePicture = response.file_url;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile picture uploaded successfully',
            confirmButtonColor: '#10b981',
          });
        },
        error: (error) => {
          console.error('Error uploading picture:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to upload profile picture',
            confirmButtonColor: '#10b981',
          });
        },
      });
    }
  }
}
