import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthenticationService } from '../service/authentication.service';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen: boolean = false;

  constructor(private socket: SocketService, private router: Router, private auth: AuthenticationService, private toast: ToastrManager) { }

  ngOnInit() { }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.toast.successToastr('You have closed your session succesfuly', 'Session finished');
    this.auth.logout();
  }
}
