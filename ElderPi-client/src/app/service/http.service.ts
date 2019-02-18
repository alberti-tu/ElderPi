import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient ) { }

  public login(user: User) {
    return this.http.post(location.origin + '/login', user);
  }
}

// HTTP response as plain text --> {responseType: 'text'}
