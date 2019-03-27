import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket;

  url = location.origin;
  //url = 'https://localhost';

  constructor() { }

  public openSocket() {
    this.socket = io(this.url, { secure: true,  path: '/sensor/io', query: {authorization: AuthenticationService.getToken()} });
  }

  public updateTable() {
    return new Observable(observer => {
      this.socket.on('updateTable', (message) => { observer.next(message) });
    });
  }

  public closeSocket() {
    this.socket.disconnect();
  }
}
