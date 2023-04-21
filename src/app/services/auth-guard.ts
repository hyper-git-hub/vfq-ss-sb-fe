import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let is_authenticated: boolean;
    if (this.auth.isAuthenticated()) {
      // If user is loggedIn then let him access the URL
      is_authenticated = true;
    } else {
      // If user is not loggedIn then dont let him access the URL and navigate him to login screen
      this.router.navigate(['']);
      is_authenticated = false;
    }
    return is_authenticated;
  }
}
