import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url: string = 'http://localhost:3000';

  constructor( private http: HttpClient ) {}

  public login(user: User) {
    return this.http.post(this.url + '/login', user);
  }
}

// HTTP response as plain text --> {responseType: 'text'}
