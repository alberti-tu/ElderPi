import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor( private http: HttpClient ) { }

  public login(user: User) {
    return this.http.post<User>(location.origin + '/login', user);
  }
}

// HTTP response as plain text --> {responseType: 'text'}

/*
public getTable() {
  let tokenHeader = { headers: new HttpHeaders().set('authorization', AuthenticationService.getToken()) };
  return this.http.get<Sensor[]>('https://192.168.1.13' + '/sensor', tokenHeader)
}
*/
