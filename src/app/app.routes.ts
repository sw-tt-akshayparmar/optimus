import { HomeComponent } from './routes/home/home.component';
import { Routes } from '@angular/router';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { AuthGuard } from './auth/Authguard';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { ChatContainer } from './features/chat/components/chat-container/chat-container';
import { AIComponent } from './components/ai-chat/ai-chat';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    component: ChatContainer,
    canActivate: [AuthGuard],
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
  {
    path: 'ai',
    component: AIComponent,
    canActivate: [AuthGuard],
  },
];
