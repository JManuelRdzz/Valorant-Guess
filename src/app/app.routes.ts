import { Routes } from '@angular/router';
import { GuessThePlaceComponent } from './components/guess-the-place/guess-the-place.component';

export const routes: Routes = [
  { path: '',   redirectTo: '/guess-the-place', pathMatch: 'full' },
  { path: 'guess-the-place', component: GuessThePlaceComponent}
];
