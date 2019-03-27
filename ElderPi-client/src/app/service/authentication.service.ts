import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from './socket.service';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';

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

  // Check if this token is valid
  static validToken(): boolean {
    if(AuthenticationService.getToken() == null) return false;

    const token = jwt_decode(AuthenticationService.getToken());

    if (token.expiration === undefined) return null;
    return token.expiration > moment().unix();
  }

  // Close the seasson
  logout(): void {
    localStorage.clear();
    this.socket.closeSocket();
    this.router.navigateByUrl('/login');
  }
}
