import { Injectable } from "@angular/core";
import {Router, CanActivate, ActivatedRouteSnapshot} from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean{
    if(this.authService.isAuthenticated()){
      const isEditProfileRoute = route.routeConfig?.path === 'members/edit/:id';

      if (isEditProfileRoute) {
        const userIdFromRoute = route.paramMap.get('id');
        const userIdFromStorage = this.authService.getAuthenticatedMembersId();

        return !!(userIdFromRoute && parseInt(userIdFromRoute) == userIdFromStorage);
      }

      return true;
    } else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
