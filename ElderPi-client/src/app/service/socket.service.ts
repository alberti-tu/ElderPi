import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as io from 'socket.io-client';
import {Sensor} from '../models/sensor';

@Injectable({ providedIn: 'root' })
export class SocketService {

  public table: Sensor[];
  private socket;

  url = location.origin;
  //url = 'https://localhost';

  constructor() {
    this.socket = io(this.url, { secure: true,  path: '/sensor/io', query: {authorization: AuthenticationService.getToken()} });
  }

  public getTable() {
    this.socket.emit('getTable');
  }


  public updateTable() {
    return new Observable(observer => {
      this.socket.on('updateTable', message => {
        this.table = message;
        observer.next(message);
      });
    });
  }

  public closeSocket() {
    this.socket.disconnect();
  }
}
