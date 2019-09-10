import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor( private http: HttpClient ) {  }

  public login(user: User) {
    return this.http.post<User>(environment.url + '/login', user);
  }

  public getEmail() {
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get<{ email: string }[]>(environment.url + '/user/email', token)
  }

  public addEmail(email: string) {
    let body = { email: email };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.post(environment.url + '/user/email', body, token)
  }

  public deleteEmail(email: string) {
    let body = { email: email };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(environment.url + '/user/email', body, token)
  }

  public updateSensor(id: string, name: string, expiration: string) {
    let body = { deviceName: name, deviceID: id, expiration: expiration };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(environment.url + '/sensor', body, token)
  }

  public getHistory() {
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get(environment.url + '/sensor/history', token)
  }
}

// HTTP response as plain text --> {responseType: 'text'}
