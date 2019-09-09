import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket;

  url: string = location.origin;
  //url: string = 'https://localhost';

  constructor() {
    this.socket = io(this.url, { secure: true,  path: '/sensor/io', query: {authorization: AuthenticationService.getToken()} });
  }

  public getTable() {
    this.socket.emit('getTable');
  }

  public updateTable() {
    return new Observable(observer => {
      this.socket.on('updateTable', message => { observer.next(message) });
    });
  }

  public sensorTimeout() {
    return new Observable(observer => {
      this.socket.on('sensorTimeout', message => { observer.next(message) });
    });
  }

  public sensorLowBattery() {
    return new Observable(observer => {
      this.socket.on('sensorLowBattery', message => { observer.next(message) });
    });
  }

  public closeSocket() {
    this.socket.disconnect();
  }
}
