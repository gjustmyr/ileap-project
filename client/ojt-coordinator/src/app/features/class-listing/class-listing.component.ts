import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-listing',
  imports: [CommonModule, FormsModule],
  templateUrl: './class-listing.component.html',
  styleUrl: './class-listing.component.css',
  standalone: true,
})
export class ClassListingComponent implements OnInit {
  classList: any[] = [];
  filteredClassList: any[] = [];
  classListPageNo: number = 1;
  classListPageSize: number = 10;
  showCreateClassModal: boolean = false;

  classListFilters = {
    searchTerm: '',
    schoolYear: null,
    semester: null,
    program: null,
  };

  schoolYearOptions = [
    { label: '2024-2025', value: '2024-2025' },
    { label: '2025-2026', value: '2025-2026' },
    { label: '2026-2027', value: '2026-2027' },
  ];

  semesterOptions = [
    { label: 'First Semester', value: 'FIRST' },
    { label: 'Second Semester', value: 'SECOND' },
    { label: 'Summer', value: 'SUMMER' },
  ];

  programOptions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClassList();
    this.loadProgramOptions();
  }

  loadClassList(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http.get<any>(`${environment.apiUrl}/classes`, { headers }).subscribe({
      next: (response) => {
        this.classList = response.classes || [];
        this.applyClassListFilters();
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      },
    });
  }

  loadProgramOptions(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http
      .get<any[]>(`${environment.apiUrl}/classes/programs`, { headers })
      .subscribe({
        next: (programs) => {
          this.programOptions = programs;
        },
        error: (error) => {
          console.error('Error loading programs:', error);
        },
      });
  }

  applyClassListFilters(): void {
    this.filteredClassList = this.classList.filter((classItem) => {
      const matchesSearch =
        !this.classListFilters.searchTerm ||
        classItem.classSection
          ?.toLowerCase()
          .includes(this.classListFilters.searchTerm.toLowerCase()) ||
        classItem.schoolyear
          ?.toLowerCase()
          .includes(this.classListFilters.searchTerm.toLowerCase());

      const matchesSchoolYear =
        !this.classListFilters.schoolYear ||
        classItem.schoolyear === this.classListFilters.schoolYear;

      const matchesSemester =
        !this.classListFilters.semester ||
        classItem.semester === this.classListFilters.semester;

      const matchesProgram =
        !this.classListFilters.program ||
        classItem.classSection?.startsWith(this.classListFilters.program);

      return (
        matchesSearch && matchesSchoolYear && matchesSemester && matchesProgram
      );
    });
    this.classListPageNo = 1;
  }

  clearClassListFilters(): void {
    this.classListFilters = {
      searchTerm: '',
      schoolYear: null,
      semester: null,
      program: null,
    };
    this.applyClassListFilters();
  }

  getPaginatedClassList(): any[] {
    const startIndex = (this.classListPageNo - 1) * this.classListPageSize;
    const endIndex = startIndex + this.classListPageSize;
    return this.filteredClassList.slice(startIndex, endIndex);
  }

  getClassListTotalPages(): number {
    return Math.ceil(this.filteredClassList.length / this.classListPageSize);
  }

  getClassListShowingStart(): number {
    return this.filteredClassList.length === 0
      ? 0
      : (this.classListPageNo - 1) * this.classListPageSize + 1;
  }

  getClassListShowingEnd(): number {
    const end = this.classListPageNo * this.classListPageSize;
    return end > this.filteredClassList.length
      ? this.filteredClassList.length
      : end;
  }

  previousClassListPage(): void {
    if (this.classListPageNo > 1) {
      this.classListPageNo--;
    }
  }

  nextClassListPage(): void {
    if (this.classListPageNo < this.getClassListTotalPages()) {
      this.classListPageNo++;
    }
  }

  openDialog(section: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Class Details',
      text: `Viewing students for ${section}`,
      confirmButtonColor: '#10b981',
    });
  }
}
