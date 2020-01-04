import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { AuthenticationService } from './authentication.service';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() {
    this.socket = io(environment.url, { secure: true,  path: '/sensor/io', query: {authorization: AuthenticationService.getToken()} });
  }

  public getTable(): void {
    this.socket.emit('getTable');
  }

  public updateTable(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('updateTable', message => observer.next(message) );
    });
  }

  public sensorTimeout(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('sensorTimeout', message => observer.next(message) );
    });
  }

  public sensorLowBattery(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('sensorLowBattery', message => observer.next(message) );
    });
  }

  public closeSocket(): void {
    this.socket.disconnect();
  }
}
