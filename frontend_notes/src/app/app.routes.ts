import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then((m) => m.NotesModule)
  },
  {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full'
  }
];
