import { HomeComponent } from './routes/home/home.component';
import { Routes } from '@angular/router';
import { ChatRoute } from './routes/chat/chat.route';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
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
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
