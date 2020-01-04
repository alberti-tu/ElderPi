import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from '../../service/http.service';
import { AuthenticationService } from '../../service/authentication.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;

  constructor(private http: HttpService, private router: Router, private toast: ToastrService) {
    this.user = new User();
  }

  public ngOnInit(): void {
    if (AuthenticationService.validToken()) {
      this.router.navigateByUrl('/main');
    }
  }

  public login(): void {
    this.http.login(this.user).subscribe(result => {
      if (result.token === '') {
        return this.toast.error('Wrong email and / or password', 'You are not who I am waiting for');
      }

      AuthenticationService.setToken(result.token); // Save season token

      this.toast.success('Welcome ' + this.user.username, 'Correct Login');
      this.router.navigateByUrl('/main');
    });
  }
}
