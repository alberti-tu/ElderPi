import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { SocketService } from './socket.service';
import { Sensor } from '../models/sensor';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private socket: SocketService, private router: Router, private toast: ToastrService) {
    const self = this;
    const id = setInterval(() => {
      if (!AuthenticationService.validToken()) {
        toast.error('Identify yourself again', 'Season token has expired');
        self.logout();
      }
    }, 1000);

    this.setIntervalID(id);

    this.socket.sensorTimeout().subscribe((sensor: Sensor) => {
      this.toast.error('Check the sensor ' + (sensor.deviceName || sensor.deviceID), 'Sensor timeout');
    });

    this.socket.sensorLowBattery().subscribe((sensor: Sensor) => {
      this.toast.error('Check the sensor ' + (sensor.deviceName || sensor.deviceID), 'Sensor low battery');
    });
  }

  intervalID: number[] = [];

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static getToken(): string {
    return localStorage.getItem('token');
  }

  // Check if this token is valid
  static validToken(): boolean {
    if (AuthenticationService.getToken() == null) { return false; }

    const token = jwt_decode(AuthenticationService.getToken());

    if (token.expiration === undefined) { return null; }
    return token.expiration > moment().unix();
  }

  canActivate() {
    if (AuthenticationService.validToken()) { return true; }

    this.logout();
    return false;
  }

  public setIntervalID(id: number): void {
    this.intervalID.push(id);
  }

  public clearIntervalID(): void {
    for (const id of this.intervalID) {
      clearInterval(id);
    }
  }

  // Close the seasson
  public logout(): void {
    localStorage.clear();
    this.socket.closeSocket();
    this.router.navigateByUrl('/login');
    this.clearIntervalID();
  }
}
