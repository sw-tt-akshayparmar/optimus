import { HomeComponent } from './routes/home/home.component';
import { HomeResolver } from './routes/home/home.resolver';
import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { homeData: HomeResolver },
  },
];
