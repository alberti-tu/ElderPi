import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from './socket.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements CanActivate{

  constructor(private socket: SocketService, private router: Router, private toast: ToastrManager) {
    // Check at every second if the token is valid
    setInterval(function() {
      if(!AuthenticationService.validToken() && router.url !== '/login') {
        // Close the seasion
        toast.errorToastr('Identify yourself again', 'Season token has expired');
        localStorage.clear();
        socket.closeSocket();
        router.navigateByUrl('/login');
      }
    },1000);
  }

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

  // Close the seasson
  logout(): void {
    localStorage.clear();
    this.socket.closeSocket();
    this.router.navigateByUrl('/login');
  }
}
