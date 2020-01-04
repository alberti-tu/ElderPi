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

  public list: Sensor[];
  public sensor: Sensor;
  public show = false;

  constructor(private router: Router, private http: HttpService, private socket: SocketService) {
    this.socket.getTable();
    this.socket.updateTable().subscribe((sensors: Sensor[]) => {
      if (sensors.length !== 0) { this.show = true; }
      this.list = sensors;
      this.sensor = this.list[0];
    });
  }

  public ngOnInit(): void { }

  // Shows the device selected in the form
  public printItem(deviceID: string): void {
    for (const sensor of this.list) {
      if (sensor.deviceID === deviceID) {
        this.sensor = sensor;
      }
    }
  }

  // Updates the parameters of the selected device
  public updateSensor(deviceID: string, deviceName: string, deviceExpiration: string): void {
    this.http.updateSensor(deviceID, deviceName || this.sensor.deviceName, deviceExpiration || this.sensor.expiration).subscribe(result => {
      this.router.navigateByUrl('/main');
    });
  }

}
