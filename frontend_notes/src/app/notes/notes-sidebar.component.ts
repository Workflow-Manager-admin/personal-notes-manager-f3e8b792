import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService, Note } from '../core/supabase.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes.styles.css']
})
export class NotesSidebarComponent implements OnInit {
  notes: Note[] = [];
  search = '';
  loading = false;

  constructor(supabase: SupabaseService, router: Router) {
    this.supabase = supabase;
    this.router = router;
  }

  private supabase: SupabaseService;
  private router: Router;

  async ngOnInit() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.loading = true;
    this.notes = await this.supabase.getNotes(this.search);
    this.loading = false;
  }

  goTo(id: string) {
    this.router.navigate(['/notes', id]);
  }

  async searchNotes() {
    await this.loadNotes();
  }

  newNote() {
    this.router.navigate(['/notes/new']);
  }
}
