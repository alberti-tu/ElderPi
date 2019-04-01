import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  list: Sensor[];

  constructor(private http: HttpService, private socket: SocketService, private router: Router) {
    this.list = this.socket.table;
  }

  ngOnInit() { }

  sendName(deviceName: string, deviceID: string) {
    this.http.setSensorName(deviceName, deviceID).subscribe(result => {
      this.router.navigateByUrl('/main');
    });
  }
}
