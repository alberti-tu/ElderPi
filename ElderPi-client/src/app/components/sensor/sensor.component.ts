import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
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
  sensor: Sensor;
  show: boolean = false;

  constructor(private http: HttpService, private socket: SocketService, private router: Router, private toast: ToastrManager) {
    this.socket.getTable();
    this.socket.updateTable().subscribe((sensors: Sensor[]) => {
      if(sensors.length !== 0) this.show = true;
      this.list = sensors;
      this.sensor = this.list[0];
    });
  }

  ngOnInit() { }

  // Shows the device selected in the form
  printItem(deviceID: string) {
    for(let i = 0; i < this.list.length; i++) {
      if(this.list[i].deviceID === deviceID) {
        this.sensor = this.list[i];
      }
    }
  }

  // Updates the parameters of the selected device
  updateSensor(deviceID: string, deviceName: string, deviceExpiration: string) {
    this.http.updateSensor(deviceID, deviceName || this.sensor.deviceName, deviceExpiration || this.sensor.expiration).subscribe(result => {
      this.router.navigateByUrl('/main');
    });
  }
}
