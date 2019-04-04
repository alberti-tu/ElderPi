import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { Sensor } from '../../models/sensor'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  headTable: string[] = ['Location', 'Duration', 'Hour', 'Date'];
  bodyTable: Sensor[];

  // Type of Charts: bar, line, radar, pie, doughnut, polarArea, horizontalBar
  xAxis = [''];
  yAxis = [{ label: '', data: [0] }];

  showChart: boolean;

  constructor(private http: HttpService) {
    this.showChart = false;
    this.getHistory();
  }

  ngOnInit() {  }

  getHistory() {
    this.http.getHistory().subscribe((sensor: Sensor[]) => {
      if(sensor.length !== 0) {
        sensor[0].duration = new Date().getTime() - new Date(sensor[0].timestamp).getTime();
        sensor[0].time = HistoryComponent.time(new Date().getTime() - new Date(sensor[0].timestamp).getTime());
        for (let i = 1; i < sensor.length; i++) {
          sensor[i].time = HistoryComponent.time(sensor[i].duration);
        }
        this.bodyTable = sensor;
        this.graph(sensor);
      }
    });
  }

  graph(device: Sensor[]) {
    let sum = 0;
    let value: {deviceName: string, deviceID: string, duration: number}[] = [];

    // Sum of all ms of each sensor
    for (let i = 0; i < device.length; i++) {
      sum = sum + device[i].duration;
    }

    // Process the data
    for(let i = 0; i < device.length; i ++) {
      for(let j = 0; j < device.length; j ++) {
        let found = false;

        for(let k = 0; k < value.length; k ++) {
          if(device[i].deviceID === value[k].deviceID) found = true;
        }

        if((device[i].deviceID === device[j].deviceID) && (found == false)) {
          value.push({ deviceName: device[i].deviceName, deviceID: device[i].deviceID, duration: 0 });  // unique Device ID
          // Percentage of precense in each device
          for(let l = 0; l < device.length; l ++) {
            if(value[i].deviceID === device[l].deviceID)
              value[i].duration = value[i].duration + Math.round(device[l].duration / sum * 100);
          }
        }
      }
    }

    this.xAxis = value.map(item => { return item.deviceName || item.deviceID });
    this.yAxis = [{ label: 'Time (%)', data: value.map(item => { return item.duration }) }];

    this.showChart = true;
  }

  static time(duration) {
    let myDate = new Date(duration);
    let days = '', hours = '', min = '', sec = '';

    if(duration >= 1000) sec = myDate.getUTCSeconds().toString() + ' sec ';
    if(duration >= 60000) min = myDate.getUTCMinutes().toString() + ' min ';
    if(duration >= 3600000) hours = myDate.getUTCHours().toString() + ' h ';
    if(duration >= 86400000) days = Math.trunc(duration / 86400000) + ' days ';

    return days + hours + min + sec;
  }
}
