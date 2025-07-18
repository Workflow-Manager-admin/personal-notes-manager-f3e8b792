import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../core/supabase.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./auth.styles.css']
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(fb: FormBuilder, supabase: SupabaseService, router: Router) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.supabase = supabase;
    this.router = router;
  }

  private supabase: SupabaseService;
  private router: Router;

  async submit() {
    this.error = null;
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    const { error } = await this.supabase.signInWithEmail(email, password);
    this.loading = false;
    if (error) {
      this.error = error;
    } else {
      this.router.navigate(['/notes']);
    }
  }
}
