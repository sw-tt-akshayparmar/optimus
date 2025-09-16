import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, PaginatorModule],
  templateUrl: './project.component.html',
})
export class ProjectComponent {}
