import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../core/supabase.service';

/* global setTimeout */

// PUBLIC_INTERFACE
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./auth.styles.css']
})
export class RegisterComponent {
  form: FormGroup;
  error: string | null = null;
  loading = false;
  success = false;

  constructor(fb: FormBuilder, private supabase: SupabaseService, private router: Router) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async submit() {
    this.error = null;
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    const { error } = await this.supabase.signUpWithEmail(email, password);
    this.loading = false;
    if (error) {
      this.error = error;
    } else {
      this.success = true;
      setTimeout(() => this.router.navigate(['/auth/login']), 1200);
    }
  }
}
