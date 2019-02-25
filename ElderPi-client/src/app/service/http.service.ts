import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Sensor } from '../models/sensor';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient ) { }

  public login(user: User) {
    return this.http.post(location.origin + '/login', user);
  }

  public sensor() {
    return this.http.get<Sensor[]>( location.origin + '/sensor')
  }
}

// HTTP response as plain text --> {responseType: 'text'}
