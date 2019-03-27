import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import {Router} from '@angular/router';
import {Sensor} from '../../models/sensor';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  //list = [{ deviceID: '123' }, { deviceID: '1234' }, { deviceID: '490024001151373331333230' }];
  list = [{ deviceID: '490024001151373331333230' }];

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() { }

  sendName(deviceName: string, deviceID: string) {
    this.http.setSensorName(deviceName, deviceID).subscribe(result => {
      this.router.navigateByUrl('/main');
    });
  }
}
