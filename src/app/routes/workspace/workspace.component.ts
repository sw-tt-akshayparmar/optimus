import { Component } from '@angular/core';
import { ProjectComponent } from '../../components/projects/projects.component';
import { TerminalComponent } from '../../components/terminal/terminal.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  templateUrl: './workspace.component.html',
  imports: [ProjectComponent, TerminalComponent],
})
export class WorkspaceComponent {}
