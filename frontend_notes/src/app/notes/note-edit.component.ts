import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../core/supabase.service';

 // PUBLIC_INTERFACE
@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./notes.styles.css']
})
export class NoteEditComponent implements OnInit {
  form: FormGroup;
  noteId: string | null = null;
  submitting = false;
  error: string | null = null;

  constructor(fb: FormBuilder, supabase: SupabaseService, router: Router, route: ActivatedRoute) {
    this.form = fb.group({
      title: ['', Validators.required],
      content: ['']
    });
    this.supabase = supabase;
    this.router = router;
    this.route = route;
  }

  private supabase: SupabaseService;
  private router: Router;
  private route: ActivatedRoute;

  async ngOnInit() {
    this.noteId = this.route.snapshot.paramMap.get('id');
    if (this.noteId) {
      const note = await this.supabase.getNoteById(this.noteId);
      if (note) {
        this.form.patchValue({ title: note.title, content: note.content });
      }
    }
  }

  async submit() {
    this.error = null;
    this.submitting = true;
    if (this.form.invalid) {
      this.error = 'Title is required.';
      this.submitting = false;
      return;
    }
    const { title, content } = this.form.value;
    let res;
    if (this.noteId) {
      res = await this.supabase.updateNote(this.noteId, title, content);
    } else {
      res = await this.supabase.createNote(title, content);
    }
    this.submitting = false;
    if (res.error || !res.note) {
      this.error = res.error || 'Error';
    } else {
      this.router.navigate(['/notes', res.note.id]);
    }
  }
}
