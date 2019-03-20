import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket;

  constructor() { }

  public openSocket() {
    this.socket = io(location.origin, { secure: true,  path: '/sensor', query: {authorization: AuthenticationService.getToken()} });
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
