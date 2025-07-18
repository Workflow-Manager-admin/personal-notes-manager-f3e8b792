import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../core/supabase.service';

 // PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-shell',
  templateUrl: './notes-shell.component.html',
  styleUrls: ['./notes.styles.css']
})
export class NotesShellComponent {
  showSidebar = true;

  constructor(supabase: SupabaseService, router: Router) {
    this.supabase = supabase;
    this.router = router;
  }

  private supabase: SupabaseService;
  private router: Router;

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/auth/login']);
  }
}
