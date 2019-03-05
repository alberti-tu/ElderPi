import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

import { HttpService } from '../service/http.service';
import { User } from '../models/user';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private http: HttpService, private router: Router, private auth: AuthenticationService, private toast: ToastrManager) {
    this.user = new User();
  }

  ngOnInit() {
    if(AuthenticationService.validToken())
      this.router.navigateByUrl('/main');
  }

  login() {
    this.http.login(this.user).subscribe(result => {
      if(result.token == '') return this.toast.errorToastr('Wrong email and / or password', 'You are not who I am waiting for');

      AuthenticationService.setToken(result.token); // Save seasson token

      this.toast.successToastr('Welcome ' + this.user.username, 'Correct Login');
      this.router.navigateByUrl('/main');
    });
  }
}
