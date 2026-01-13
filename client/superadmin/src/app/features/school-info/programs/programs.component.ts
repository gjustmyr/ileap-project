import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';

import { ProgramsService } from './programs.service';
import { MajorsService } from './majors.service';
import { SectionsService } from './sections.service';
import { DropdownsService } from '../../../shared/services/dropdowns.service';
import { SelectModule } from 'primeng/select';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css',
})
export class ProgramsComponent {
  programs: any[] = [];
  departments: any[] = [];

  pageNo = 1;
  pageSize = 10;
  keyword = '';
  sortField = '';
  sortOrder = 1;
  totalRecords = 0;
  selectedDepartmentId!: number | string;
  currentDepartmentId!: number;
  currentDepartmentName: string = '';
  currentCampusId!: number;
  currentCampusName: string = '';

  isAddDialogVisible = false;
  isUpdateDialogVisible = false;
  selectedProgramId: string | null = null;

  isMajorsDialogVisible = false;
  isUpdateMajorDialogVisible = false;
  selectedProgramName: string = '';
  selectedMajorId: string | null = null;
  majors: any[] = [];

  isSectionsDialogVisible = false;
  isUpdateSectionDialogVisible = false;
  selectedSectionId: string | null = null;
  sections: any[] = [];
  selectedProgramIdForSections!: number;

  tempSectionName = '';
  sectionNameList: string[] = [];

  newProgramForm!: FormGroup;
  updateProgramForm!: FormGroup;
  newMajorForm!: FormGroup;
  updateMajorForm!: FormGroup;
  newSectionForm!: FormGroup;
  updateSectionForm!: FormGroup;

  tempProgram = '';
  programList: string[] = [];

  constructor(
    private programsService: ProgramsService,
    private majorsService: MajorsService,
    private sectionsService: SectionsService,
    private dropdownService: DropdownsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.newProgramForm = this.fb.group({
      department_id: [null, Validators.required],
      program_name: ['', Validators.required],
      abbrev: [''],
      status: ['active', Validators.required],
    });

    this.updateProgramForm = this.fb.group({
      program_name: ['', Validators.required],
      department_id: [null, Validators.required],
      abbrev: [''],
      status: ['', Validators.required],
    });

    this.newMajorForm = this.fb.group({
      major_name: ['', Validators.required],
      abbrev: [''],
      program_id: [null],
      status: ['active']
    });

    this.updateMajorForm = this.fb.group({
      major_name: ['', Validators.required],
      abbrev: [''],
      program_id: [null],
      status: ['', Validators.required]
    });

    this.newSectionForm = this.fb.group({
      program_id: [null, Validators.required],
      major_id: [null],
      year_level: ['', Validators.required],
      status: ['active', Validators.required]
    });

    this.updateSectionForm = this.fb.group({
      program_id: [null, Validators.required],
      major_id: [null],
      year_level: [null, Validators.required],
      section_name: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentDepartmentId = +params['departmentId'];
      this.currentDepartmentName = params['departmentName'] || '';
      this.currentCampusId = +params['campusId'];
      this.currentCampusName = params['campusName'] || '';
      this.selectedDepartmentId = this.currentDepartmentId || '';
      this.getAllPrograms();
    });
    this.getDepartmentsDropdown();
  }

  getDepartmentsDropdown(): void {
    this.dropdownService.getActiveDepartments().subscribe((res) => {
      this.departments = res;
      this.selectedDepartmentId = this.departments[0]?.department_id ?? '';
    });
  }

  handleSearch() {
    this.pageNo = 1;
    this.getAllPrograms();
  }

  handleAddDialog(): void {
    this.isAddDialogVisible = true;
    this.newProgramForm.reset({
      department_id: this.currentDepartmentId || null,
      program_name: '',
      abbrev: '',
      status: 'active'
    });
    this.programList = [];
    this.tempProgram = '';
  }

  handleUpdateDialog(programId: string): void {
    this.selectedProgramId = programId;

    this.programsService.getProgramById(programId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.updateProgramForm.patchValue(res.data);
          this.isUpdateDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Error fetching program:', err);
      },
    });
  }

  addProgram() {
    const name = this.tempProgram.trim();
    if (name && !this.programList.includes(name)) {
      this.programList.push(name);
      this.tempProgram = '';
    }
  }

  removeProgram(index: number) {
    this.programList.splice(index, 1);
  }

  submitNewProgram(): void {
    if (this.newProgramForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this program?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.programsService.addProgram(this.newProgramForm.value).subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Program added successfully',
                  confirmButtonColor: '#3b82f6'
                });
                this.getAllPrograms();
                this.isAddDialogVisible = false;
                this.newProgramForm.reset({
                  department_id: this.currentDepartmentId || null,
                  program_name: '',
                  abbrev: '',
                  status: 'active'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to add program',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Add error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while adding program',
                confirmButtonColor: '#ef4444'
              });
            },
          });
        }
      });
    } else {
      this.newProgramForm.markAllAsTouched();
    }
  }

  submitUpdatedProgram(): void {
    if (!this.selectedProgramId || !this.updateProgramForm.valid) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this program?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.programsService
          .updateProgram(
            this.selectedProgramId as string,
            this.updateProgramForm.value
          )
          .subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Program updated successfully',
                  confirmButtonColor: '#3b82f6'
                });
                this.getAllPrograms();
                this.isUpdateDialogVisible = false;
                this.updateProgramForm.reset();
                this.selectedProgramId = null;
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to update program',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Update error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while updating program',
                confirmButtonColor: '#ef4444'
              });
            },
          });
      }
    });
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartmentId = event?.value?.department_id || '';
    this.getAllPrograms();
  }

  pageChange(event: any): void {
    this.pageNo = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.getAllPrograms();
  }

  getAllPrograms(): void {
    this.programsService
      .getAllPrograms(
        this.pageNo,
        this.pageSize,
        this.keyword || '',
        this.selectedDepartmentId || ''
      )
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.programs = res.data.programs || [];
            this.totalRecords = res.data.pagination?.totalRecords || 0;
          }
        },
        error: (err) => {
          console.error('Error fetching programs:', err);
        },
      });
  }

  handleUpdateStatus(
    event: Event,
    programId: string,
    currentStatus: string
  ): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'inactive' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this program?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.programsService.toggleProgramStatus(programId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Program is now ${newStatus}`,
                confirmButtonColor: '#3b82f6'
              });
              this.getAllPrograms();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || 'Failed to update status',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error('Status update error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while updating status',
              confirmButtonColor: '#ef4444'
            });
          },
        });
      }
    });
  }

  // Pagination helper methods
  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllPrograms();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllPrograms();
    }
  }

  onPageSizeChange() {
    this.pageNo = 1;
    this.getAllPrograms();
  }

  // Majors Management Methods
  viewMajors(program: any): void {
    this.selectedProgramId = program.program_id;
    this.selectedProgramName = program.program_name;
    this.newMajorForm.patchValue({ program_id: program.program_id });
    this.isMajorsDialogVisible = true;
    this.loadMajors();
  }

  closeMajorsDialog(): void {
    this.isMajorsDialogVisible = false;
    this.majors = [];
    this.selectedProgramId = null;
    this.selectedProgramName = '';
    this.newMajorForm.reset({ status: 'active' });
  }

  loadMajors(): void {
    if (!this.selectedProgramId) return;
    
    this.majorsService.getAllMajors(1, 1000, '', this.selectedProgramId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.majors = res.data.majors || [];
        }
      },
      error: (err) => {
        console.error('Error loading majors:', err);
      }
    });
  }

  submitNewMajor(): void {
    if (this.newMajorForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this major?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.majorsService.addMajor(this.newMajorForm.value).subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Major added successfully',
                  confirmButtonColor: '#3b82f6'
                });
                this.loadMajors();
                this.newMajorForm.reset({
                  program_id: this.selectedProgramId,
                  major_name: '',
                  abbrev: '',
                  status: 'active'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to add major',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Add major error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while adding major',
                confirmButtonColor: '#ef4444'
              });
            }
          });
        }
      });
    }
  }

  handleUpdateMajorDialog(major: any): void {
    this.selectedMajorId = major.major_id;
    this.updateMajorForm.patchValue(major);
    this.isUpdateMajorDialogVisible = true;
  }

  submitUpdatedMajor(): void {
    if (!this.selectedMajorId || !this.updateMajorForm.valid) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this major?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.majorsService.updateMajor(this.selectedMajorId as string, this.updateMajorForm.value).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Major updated successfully',
                confirmButtonColor: '#3b82f6'
              });
              this.loadMajors();
              this.isUpdateMajorDialogVisible = false;
              this.updateMajorForm.reset();
              this.selectedMajorId = null;
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || 'Failed to update major',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error('Update major error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while updating major',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  handleUpdateMajorStatus(event: Event, majorId: string, currentStatus: string): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'inactive' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this major?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.majorsService.toggleMajorStatus(majorId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Major is now ${newStatus}`,
                confirmButtonColor: '#3b82f6'
              });
              this.loadMajors();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || 'Failed to update status',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error('Status update error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while updating status',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  // ========== SECTIONS MANAGEMENT ==========
  viewSections(program: any): void {
    this.selectedProgramIdForSections = program.program_id;
    this.selectedProgramName = program.program_name;
    this.isSectionsDialogVisible = true;
    this.newSectionForm.reset({
      program_id: this.selectedProgramIdForSections,
      major_id: null,
      year_level: '',
      status: 'active'
    });
    this.sectionNameList = [];
    this.tempSectionName = '';
    this.loadSections();
    // Load majors for the dropdown
    this.majorsService.getAllMajors(1, 100, '', this.selectedProgramIdForSections).subscribe({
      next: (res) => {
        if (res?.success) {
          this.majors = res.data.majors || [];
        }
      },
      error: (err) => {
        console.error('Error loading majors:', err);
      }
    });
  }

  closeSectionsDialog(): void {
    this.isSectionsDialogVisible = false;
    this.sections = [];
    this.sectionNameList = [];
    this.tempSectionName = '';
    this.newSectionForm.reset({
      program_id: null,
      major_id: null,
      year_level: '',
      status: 'active'
    });
  }

  loadSections(): void {
    this.sectionsService.getAllSections(1, 100, '', this.selectedProgramIdForSections).subscribe({
      next: (res) => {
        if (res?.success) {
          this.sections = res.data.sections || [];
        }
      },
      error: (err) => {
        console.error('Error loading sections:', err);
      }
    });
  }

  submitNewSection(): void {
    if (this.newSectionForm.valid && this.sectionNameList.length > 0) {
      const baseData = this.newSectionForm.value;
      const sections = this.sectionNameList.map(sectionName => ({
        program_id: this.selectedProgramIdForSections,
        major_id: baseData.major_id,
        year_level: baseData.year_level,
        section_name: sectionName,
        status: baseData.status
      }));

      let completedRequests = 0;
      const totalRequests = sections.length;
      const errors: string[] = [];

      sections.forEach((section, index) => {
        this.sectionsService.addSection(section).subscribe({
          next: (res) => {
            completedRequests++;
            if (!res?.success) {
              errors.push(`Failed to add section "${section.section_name}"`);
            }
            
            if (completedRequests === totalRequests) {
              if (errors.length === 0) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: `${totalRequests} section(s) added successfully`,
                  confirmButtonColor: '#3b82f6',
                  timer: 1500,
                  showConfirmButton: false
                });
                this.newSectionForm.reset({
                  program_id: this.selectedProgramIdForSections,
                  major_id: null,
                  year_level: '',
                  status: 'active'
                });
                this.sectionNameList = [];
                this.tempSectionName = '';
                this.loadSections();
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Partial Success',
                  html: `Some sections failed to add:<br>${errors.join('<br>')}`,
                  confirmButtonColor: '#f59e0b'
                });
                this.loadSections();
              }
            }
          },
          error: (err) => {
            completedRequests++;
            errors.push(`Error adding section "${section.section_name}"`);
            
            if (completedRequests === totalRequests) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                html: errors.join('<br>'),
                confirmButtonColor: '#ef4444'
              });
            }
          }
        });
      });
    }
  }

  addSectionName(): void {
    if (this.tempSectionName.trim()) {
      this.sectionNameList.push(this.tempSectionName.trim());
      this.tempSectionName = '';
    }
  }

  removeSectionName(index: number): void {
    this.sectionNameList.splice(index, 1);
  }

  handleUpdateSectionDialog(section: any): void {
    this.selectedSectionId = section.section_id;
    if (!this.selectedSectionId) return;
    
    this.sectionsService.getSectionById(this.selectedSectionId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.updateSectionForm.patchValue({
            program_id: res.data.program_id,
            major_id: res.data.major_id,
            year_level: res.data.year_level,
            section_name: res.data.section_name,
            status: res.data.status
          });
          this.isUpdateSectionDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Error fetching section:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load section data',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  closeUpdateSectionDialog(): void {
    this.isUpdateSectionDialogVisible = false;
    this.updateSectionForm.reset();
    this.selectedSectionId = null;
  }

  submitUpdatedSection(): void {
    if (this.updateSectionForm.valid && this.selectedSectionId) {
      const payload = this.updateSectionForm.value;

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this section?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.sectionsService.updateSection(this.selectedSectionId!, payload).subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Section updated successfully',
                  confirmButtonColor: '#3b82f6'
                });
                this.loadSections();
                this.isUpdateSectionDialogVisible = false;
                this.updateSectionForm.reset();
                this.selectedSectionId = null;
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to update section',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Update section error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while updating section',
                confirmButtonColor: '#ef4444'
              });
            }
          });
        }
      });
    }
  }

  handleUpdateSectionStatus(event: Event, sectionId: string, currentStatus: string): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'inactive' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this section?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionsService.toggleSectionStatus(sectionId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Section is now ${newStatus}`,
                confirmButtonColor: '#3b82f6'
              });
              this.loadSections();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || 'Failed to update status',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error('Status update error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while updating status',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }
}
