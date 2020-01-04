import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public login(user: User) {
    return this.http.post<User>(environment.url + '/login', user);
  }

  public getEmail() {
    const token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get<{ email: string }[]>(environment.url + '/user/email', token);
  }

  public addEmail(email: string) {
    const body = { email };
    const token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.post(environment.url + '/user/email', body, token);
  }

  public deleteEmail(email: string) {
    const body = { email };
    const token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(environment.url + '/user/email', body, token);
  }

  public updateSensor(id: string, name: string, expiration: string) {
    const body = { deviceName: name, deviceID: id, expiration };
    const token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.put(environment.url + '/sensor', body, token);
  }

  public getHistory() {
    const token = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get(environment.url + '/sensor/history', token);
  }
}

// HTTP response as plain text --> {responseType: 'text'}
