import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements CanActivate{

  constructor(private router: Router) { }

  canActivate() {
    if (AuthenticationService.validToken()) return true;

    this.router.navigateByUrl('/login');
    return false;
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static getToken(): string {
    return localStorage.getItem('token');
  }

  // Return the UTC seconds until the expiration of the token
  static getTokenExpirationDate(token: string): number {
    const decoded = jwt_decode(token);
    if (decoded.expiration === undefined) return null;
    return new Date().setUTCSeconds(decoded.expiration).valueOf();
  }

  // Check if this token is valid
  static validToken(): boolean {
    if(AuthenticationService.getToken() == null) return false;

    const expiration = AuthenticationService.getTokenExpirationDate( AuthenticationService.getToken() );
    if(expiration === undefined) return false;

    return expiration > new Date().valueOf();
  }
}
