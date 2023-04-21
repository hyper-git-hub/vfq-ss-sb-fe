import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../core/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AnonymousGuardService {
  is_authenticated: boolean = false;

  constructor(private router: Router,
    private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      // Navigate to dashboard if URL not found 
      // OR if incorrect URL is being hit on browser  
      // OR if login|change-password|first-time-login|forget-password|'' route is being hit on browser
      this.router.navigate(['/ss/dashboard/survelliance']);
      return false;
    }
    return true;
  }

}
