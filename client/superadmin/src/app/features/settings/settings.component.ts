import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampusesComponent } from '../school-info/campuses/campuses.component';
import { DepartmentsComponent } from '../school-info/departments/departments.component';
import { ProgramsComponent } from '../school-info/programs/programs.component';
import { IndustriesComponent } from '../industries/industries.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    CampusesComponent,
    DepartmentsComponent,
    ProgramsComponent,
    IndustriesComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  activeTab: 'school-info' | 'industries' = 'school-info';
  
  // School Info navigation
  schoolInfoView: 'campuses' | 'departments' | 'programs' = 'campuses';
  selectedCampusId: string = '';
  selectedCampusName: string = '';
  selectedDepartmentId: string = '';
  selectedDepartmentName: string = '';

  onViewDepartments(event: { campusId: string; campusName: string }): void {
    this.selectedCampusId = event.campusId;
    this.selectedCampusName = event.campusName;
    this.schoolInfoView = 'departments';
  }

  onViewPrograms(event: { departmentId: string; departmentName: string }): void {
    this.selectedDepartmentId = event.departmentId;
    this.selectedDepartmentName = event.departmentName;
    this.schoolInfoView = 'programs';
  }
}
