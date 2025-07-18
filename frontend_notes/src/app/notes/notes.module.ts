import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesShellComponent } from './notes-shell.component';
import { NotesSidebarComponent } from './notes-sidebar.component';
import { NoteViewComponent } from './note-view.component';
import { NoteEditComponent } from './note-edit.component';
import { AuthGuard } from './notes.guard';

const routes: Routes = [
  {
    path: '',
    component: NotesShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'new', component: NoteEditComponent },
      { path: ':id/edit', component: NoteEditComponent },
      { path: ':id', component: NoteViewComponent },
      { path: '', component: NotesSidebarComponent }
    ]
  }
];

@NgModule({
  declarations: [
    NotesShellComponent,
    NotesSidebarComponent,
    NoteViewComponent,
    NoteEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [AuthGuard]
})
export class NotesModule {}
