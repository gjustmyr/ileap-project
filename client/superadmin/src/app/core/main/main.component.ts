import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log(this.isSidebarCollapsed);
  }
}
