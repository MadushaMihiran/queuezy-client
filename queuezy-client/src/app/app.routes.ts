import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Queue } from './pages/queue/queue';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'queue/:id', component: Queue },
];
