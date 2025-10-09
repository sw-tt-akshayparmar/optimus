import { HomeComponent } from './routes/home/home.component';
import { Routes } from '@angular/router';
import { ChatRoute } from './routes/chat/chat.route';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { AuthGuard } from './auth/Authguard';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    component: ChatRoute,
    canActivate: [AuthGuard],
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [AuthGuard],
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
