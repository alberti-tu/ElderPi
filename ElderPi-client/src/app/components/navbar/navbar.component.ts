import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../service/authentication.service';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public navbarOpen = false;

  constructor(private router: Router, private auth: AuthenticationService, private socket: SocketService, private toast: ToastrService) { }

  public ngOnInit(): void { }

  public toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  public logout(): void {
    this.toast.success('You have closed your session succesfuly', 'Session finished');
    this.auth.logout();
  }

}
