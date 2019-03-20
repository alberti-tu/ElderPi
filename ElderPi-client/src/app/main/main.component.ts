import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { AuthenticationService } from '../service/authentication.service';
import { Sensor } from '../models/sensor';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  headTable: string[] = ['Device ID', 'Precense', 'Battery','Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private socket: SocketService, private auth: AuthenticationService, private toast: ToastrManager) {
    this.sensorData();
  }

  ngOnInit() {  }

  sensorData() {
    this.socket.openSocket();
    this.socket.updateTable().subscribe((sensor: Sensor[]) => {
      if(AuthenticationService.validToken())
        this.bodyTable = sensor;
      else {
        this.toast.errorToastr('Identify yourself again', 'Seasson token expired');
        this.auth.logout();
      }
    });
  }
}
