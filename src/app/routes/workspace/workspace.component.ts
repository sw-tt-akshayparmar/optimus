import { Component } from '@angular/core';

@Component({
  selector: 'app-workspace',
  standalone: true,
  template: `
    <section class="p-6">
      <h1 class="text-2xl font-semibold">Workspace</h1>
      <p class="mt-2 text-muted-color">Organize and manage your work here.</p>
    </section>
  `,
})
export class WorkspaceComponent {}
