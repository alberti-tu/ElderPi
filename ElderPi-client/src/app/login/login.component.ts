import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

import { HttpService } from '../service/http.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private http: HttpService, private toast: ToastrManager) {
    this.user = new User();
  }

  ngOnInit() {  }

  login() {
    this.http.login(this.user).subscribe(result => {
      if(result == 1) this.toast.successToastr('Welcome ' + this.user.username, 'Correct Login');
      else this.toast.errorToastr('Wrong email and / or password', 'You are not who I am waiting for')
    });
  }
}
