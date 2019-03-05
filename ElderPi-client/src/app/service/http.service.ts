import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Sensor } from '../models/sensor';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor( private http: HttpClient ) { }

  public login(user: User) {
    return this.http.post<User>(location.origin + '/login', user);
  }

  public sensor() {
    let tokenHeader = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
    return this.http.get<Sensor[]>(location.origin + '/sensor', tokenHeader)
  }
}

// HTTP response as plain text --> {responseType: 'text'}
