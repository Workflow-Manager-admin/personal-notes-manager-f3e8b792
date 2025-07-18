import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../core/supabase.service';
import { firstValueFrom } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(supabase: SupabaseService, router: Router) {
    this.supabase = supabase;
    this.router = router;
  }

  private supabase: SupabaseService;
  private router: Router;

  async canActivate(): Promise<boolean> {
    const user = await firstValueFrom(this.supabase.getUser());
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
