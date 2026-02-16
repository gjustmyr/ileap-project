import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';

import { ProgramsService } from './programs.service';
import { SectionsService } from './sections.service';
import { DropdownsService } from '../../../shared/services/dropdowns.service';
import { SelectModule } from 'primeng/select';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
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
export class ProgramsComponent implements OnChanges {
  @Input() campusId?: string;
  @Input() campusName?: string;
  @Input() departmentId?: string;
  @Input() departmentName?: string;

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
  selectedProgramName: string = '';

  isSectionsDialogVisible = false;
  isUpdateSectionDialogVisible = false;
  selectedSectionId: string | null = null;
  sections: any[] = [];
  selectedProgramIdForSections!: number;

  tempSectionName = '';
  sectionNameList: string[] = [];

  newProgramForm!: FormGroup;
  updateProgramForm!: FormGroup;
  newSectionForm!: FormGroup;
  updateSectionForm!: FormGroup;

  tempProgram = '';
  programList: string[] = [];

  constructor(
    private programsService: ProgramsService,
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
      department_id: [null, Validators.required],
      program_name: ['', Validators.required],
      abbrev: [''],
      status: ['active', Validators.required],
    });

    this.newSectionForm = this.fb.group({
      program_id: [null, Validators.required],
      year_level: ['', Validators.required],
      status: ['active', Validators.required]
    });

    this.updateSectionForm = this.fb.group({
      program_id: [null, Validators.required],
      year_level: [null, Validators.required],
      section_name: ['', Validators.required],
      status: ['active', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check if properties are provided as Input
    if (this.departmentId && this.departmentName && this.campusId && this.campusName) {
      this.currentDepartmentId = +this.departmentId;
      this.currentDepartmentName = this.departmentName;
      this.currentCampusId = +this.campusId;
      this.currentCampusName = this.campusName;
      this.selectedDepartmentId = this.currentDepartmentId;
      this.newProgramForm.patchValue({
        department_id: this.currentDepartmentId,
      });
      this.loadPrograms();
    } else {
      // Fall back to query params for backward compatibility
      this.route.queryParams.subscribe((params) => {
        this.currentDepartmentId = +params['department_id'];
        this.currentDepartmentName = params['department_name'] || '';
        this.currentCampusId = +params['campus_id'];
        this.currentCampusName = params['campus_name'] || '';

        if (this.currentDepartmentId) {
          this.selectedDepartmentId = this.currentDepartmentId;
          this.newProgramForm.patchValue({
            department_id: this.currentDepartmentId,
          });
          this.loadPrograms();
        }
      });
    }

    this.loadDepartments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to Input properties
    if ((changes['departmentId'] || changes['campusId']) && !changes['departmentId']?.firstChange) {
      if (this.departmentId && this.departmentName && this.campusId && this.campusName) {
        this.currentDepartmentId = +this.departmentId;
        this.currentDepartmentName = this.departmentName;
        this.currentCampusId = +this.campusId;
        this.currentCampusName = this.campusName;
        this.selectedDepartmentId = this.currentDepartmentId;
        this.newProgramForm.patchValue({
          department_id: this.currentDepartmentId,
        });
        this.loadPrograms();
      }
    }
  }

  loadPrograms(): void {
    this.programsService
      .getAllPrograms(
        this.pageNo,
        this.pageSize,
        this.keyword,
        this.selectedDepartmentId?.toString()
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.programs = res.data.programs || [];
            this.totalRecords = res.data.pagination?.totalRecords || 0;
          }
        },
        error: (err: any) => {
          console.error('Error loading programs:', err);
        },
      });
  }

  loadDepartments(): void {
    this.dropdownService.getDepartments().subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.departments = res.data || [];
        }
      },
      error: (err: any) => {
        console.error('Error loading departments:', err);
      },
    });
  }

  onPageChange(event: any): void {
    this.pageNo = event.page + 1;
    this.pageSize = event.rows;
    this.loadPrograms();
  }

  onSearch(): void {
    this.pageNo = 1;
    this.loadPrograms();
  }

  onDepartmentChange(): void {
    this.pageNo = 1;
    this.loadPrograms();
  }

  // Program CRUD Methods
  openAddDialog(): void {
    this.isAddDialogVisible = true;
    this.newProgramForm.reset({
      department_id: this.currentDepartmentId,
      status: 'active',
    });
  }

  closeAddDialog(): void {
    this.isAddDialogVisible = false;
    this.newProgramForm.reset();
  }

  submitNewProgram(): void {
    if (this.newProgramForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this program?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, add it!',
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
                this.loadPrograms();
                this.closeAddDialog();
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
              console.error('Add program error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while adding program',
                confirmButtonColor: '#ef4444'
              });
            }
          });
        }
      });
    }
  }

  handleUpdateDialog(program: any): void {
    this.selectedProgramId = program.program_id;
    this.updateProgramForm.patchValue(program);
    this.isUpdateDialogVisible = true;
  }

  closeUpdateDialog(): void {
    this.isUpdateDialogVisible = false;
    this.updateProgramForm.reset();
    this.selectedProgramId = null;
  }

  submitUpdatedProgram(): void {
    if (this.updateProgramForm.valid && this.selectedProgramId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this program?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, update it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.programsService
            .updateProgram(this.selectedProgramId!, this.updateProgramForm.value)
            .subscribe({
              next: (res) => {
                if (res?.success) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Program updated successfully',
                    confirmButtonColor: '#3b82f6'
                  });
                  this.loadPrograms();
                  this.closeUpdateDialog();
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
                console.error('Update program error:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'Something went wrong while updating program',
                  confirmButtonColor: '#ef4444'
                });
              }
            });
        }
      });
    }
  }

  handleUpdateProgramStatus(event: Event, programId: string, currentStatus: string): void {
    event.stopPropagation();
    
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this program?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.programsService.toggleProgramStatus(programId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Program ${action}d successfully`,
                confirmButtonColor: '#3b82f6'
              });
              this.loadPrograms();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || `Failed to ${action} program`,
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error(`${action} program error:`, err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: `Something went wrong while ${action}ing program`,
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  // Sections Management Methods
  viewSections(program: any): void {
    this.selectedProgramId = program.program_id;
    this.selectedProgramName = program.program_name;
    this.selectedProgramIdForSections = program.program_id;
    this.newSectionForm.patchValue({ program_id: program.program_id });
    this.isSectionsDialogVisible = true;
    this.loadSections();
  }

  closeSectionsDialog(): void {
    this.isSectionsDialogVisible = false;
    this.sections = [];
    this.selectedProgramId = null;
    this.selectedProgramName = '';
    this.newSectionForm.reset({ status: 'active' });
  }

  loadSections(): void {
    if (!this.selectedProgramId) return;
    
    this.sectionsService.getAllSections(1, 1000, '', this.selectedProgramId).subscribe({
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
      const sectionCount = this.sectionNameList.length;
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to add ${sectionCount} section(s)?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, add them!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Create an array of section creation requests
          const sectionRequests = this.sectionNameList.map(sectionName => {
            const sectionData = {
              ...this.newSectionForm.value,
              section_name: sectionName
            };
            return this.sectionsService.addSection(sectionData);
          });

          // Execute all requests
          let successCount = 0;
          let errorCount = 0;
          
          sectionRequests.forEach((request, index) => {
            request.subscribe({
              next: (res) => {
                if (res?.success) {
                  successCount++;
                } else {
                  errorCount++;
                }
                
                // Check if this is the last request
                if (index === sectionRequests.length - 1) {
                  // Show final result after all requests complete
                  setTimeout(() => {
                    if (errorCount === 0) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: `${successCount} section(s) added successfully`,
                        confirmButtonColor: '#3b82f6'
                      });
                    } else if (successCount === 0) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to add sections',
                        confirmButtonColor: '#ef4444'
                      });
                    } else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Partial Success',
                        text: `${successCount} section(s) added, ${errorCount} failed`,
                        confirmButtonColor: '#f59e0b'
                      });
                    }
                    this.loadSections();
                    this.sectionNameList = [];
                    this.newSectionForm.reset({
                      program_id: this.selectedProgramIdForSections,
                      year_level: '',
                      status: 'active'
                    });
                  }, 500);
                }
              },
              error: (err) => {
                console.error('Add section error:', err);
                errorCount++;
                
                // Check if this is the last request
                if (index === sectionRequests.length - 1) {
                  setTimeout(() => {
                    if (successCount > 0) {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Partial Success',
                        text: `${successCount} section(s) added, ${errorCount} failed`,
                        confirmButtonColor: '#f59e0b'
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to add sections',
                        confirmButtonColor: '#ef4444'
                      });
                    }
                    this.loadSections();
                    this.sectionNameList = [];
                    this.newSectionForm.reset({
                      program_id: this.selectedProgramIdForSections,
                      year_level: '',
                      status: 'active'
                    });
                  }, 500);
                }
              }
            });
          });
        }
      });
    }
  }

  handleUpdateSectionDialog(section: any): void {
    this.selectedSectionId = section.section_id;
    this.updateSectionForm.patchValue(section);
    this.isUpdateSectionDialogVisible = true;
  }

  submitUpdatedSection(): void {
    if (this.updateSectionForm.valid && this.selectedSectionId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this section?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, update it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.sectionsService
            .updateSection(this.selectedSectionId!, this.updateSectionForm.value)
            .subscribe({
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
    event.stopPropagation();
    
    const action = currentStatus === 'active' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this section?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionsService.toggleSectionStatus(sectionId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Section ${action}d successfully`,
                confirmButtonColor: '#3b82f6'
              });
              this.loadSections();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || `Failed to ${action} section`,
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error(`${action} section error:`, err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: `Something went wrong while ${action}ing section`,
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  closeUpdateSectionDialog(): void {
    this.isUpdateSectionDialogVisible = false;
    this.updateSectionForm.reset();
    this.selectedSectionId = null;
  }

  addSectionName(): void {
    const name = this.tempSectionName.trim();
    if (name && !this.sectionNameList.includes(name)) {
      this.sectionNameList.push(name);
      this.tempSectionName = '';
    }
  }

  removeSectionName(index: number): void {
    this.sectionNameList.splice(index, 1);
  }

  handleAddDialog(): void {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    if (this.isAddDialogVisible) {
      this.newProgramForm.reset({
        department_id: this.currentDepartmentId,
        status: 'active',
      });
    }
  }

  handleSearch(): void {
    this.pageNo = 1;
    this.loadPrograms();
  }

  handleUpdateStatus(event: Event, programId: string, currentStatus: string): void {
    this.handleUpdateProgramStatus(event, programId, currentStatus);
  }

  // Pagination helper methods
  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.loadPrograms();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.loadPrograms();
    }
  }
}