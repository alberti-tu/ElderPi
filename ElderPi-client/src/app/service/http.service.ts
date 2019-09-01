import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class HttpService {

  url = location.origin;
  //url = 'https://localhost';

  constructor( private http: HttpClient ) { }

  public login(user: User) {
    return this.http.post<User>(this.url + '/login', user);
  }

  public getEmail() {
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get<{ email: string }[]>(this.url + '/user/email', token)
  }

  public addEmail(email: string) {
    let body = { email: email };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.post(this.url + '/user/email', body, token)
  }

  public deleteEmail(email: string) {
    let body = { email: email };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(this.url + '/user/email', body, token)
  }

  public updateSensor(id: string, name: string, expiration: string) {
    let body = { deviceName: name, deviceID: id, expiration: expiration };
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(this.url + '/sensor', body, token)
  }

  public getHistory() {
    let token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get(this.url + '/sensor/history', token)
  }
}

// HTTP response as plain text --> {responseType: 'text'}
