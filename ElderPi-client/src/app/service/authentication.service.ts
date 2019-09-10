import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from './socket.service';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { Sensor } from '../models/sensor';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements CanActivate{

  intervalID: number[] = [];

  constructor(private socket: SocketService, private router: Router, private toast: ToastrManager) {
    // Check at every second if the token is valid
    let self = this;
    let id = setInterval(function() {
      if(!AuthenticationService.validToken()) {
        toast.errorToastr('Identify yourself again', 'Season token has expired');
        self.logout();
      }
    },1000);

    this.setIntervalID(id);

    this.socket.sensorTimeout().subscribe((sensor: Sensor) => {
      this.toast.errorToastr('Check the sensor ' + (sensor.deviceName || sensor.deviceID), 'Sensor timeout');
    });

    this.socket.sensorLowBattery().subscribe((sensor: Sensor) => {
      this.toast.errorToastr('Check the sensor ' + (sensor.deviceName || sensor.deviceID), 'Sensor low battery');
    });
  }

  canActivate() {
    if (AuthenticationService.validToken()) return true;

    this.logout();
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

  public setIntervalID(id: number): void {
    this.intervalID.push(id);
  }

  public clearIntervalID(): void {
    for(let i = 0; i < this.intervalID.length; i++) {
      clearInterval(this.intervalID[i]);
    }
  }

  // Close the seasson
  logout(): void {
    localStorage.clear();
    this.socket.closeSocket();
    this.router.navigateByUrl('/login');
    this.clearIntervalID();
  }
}
