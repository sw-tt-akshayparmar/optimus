import { HomeComponent } from './routes/home/home.component';
import { Routes } from '@angular/router';
import { ChatRoute } from './routes/chat/chat.route';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'chat',
    component: ChatRoute,
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
  },
];
