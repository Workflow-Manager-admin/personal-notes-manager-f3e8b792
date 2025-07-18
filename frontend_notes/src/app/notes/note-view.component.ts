import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService, Note } from '../core/supabase.service';

// Use the browser global confirm, don't redeclare it

 // PUBLIC_INTERFACE
@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./notes.styles.css']
})
export class NoteViewComponent implements OnInit {
  note: Note | null = null;
  loading = true;
  error: string | null = null;

  constructor(supabase: SupabaseService, route: ActivatedRoute, router: Router) {
    this.supabase = supabase;
    this.route = route;
    this.router = router;
  }

  private supabase: SupabaseService;
  private route: ActivatedRoute;
  private router: Router;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const note = await this.supabase.getNoteById(id);
    this.loading = false;
    if (!note) {
      this.error = 'Note not found.';
    } else {
      this.note = note;
    }
  }

  edit() {
    if (this.note)
      this.router.navigate(['/notes', this.note.id, 'edit']);
  }

  private canDeleteDialog(): boolean {
    // Avoid linter and SSR errors by referencing window strictly locally
    let result = false;
    const w: any = (typeof globalThis !== 'undefined' && 'window' in globalThis && (globalThis as any).window)
      ? (globalThis as any).window : undefined;
    if (w && typeof w.confirm === 'function') {
      result = w.confirm('Delete this note?');
    }
    return result;
  }

  async delete() {
    if (this.note && this.canDeleteDialog()) {
      const { error } = await this.supabase.deleteNote(this.note.id);
      if (!error) {
        this.router.navigate(['/notes']);
      }
    }
  }
}
