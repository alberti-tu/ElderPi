import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  headTable: string[] = ['Location', 'Duration', 'Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private http: HttpService, private socket: SocketService) {
    this.getHistory();
  }

  ngOnInit() { }

  getHistory() {
    this.http.getHistory().subscribe((sensor: Sensor[]) => {
      for(let i = 0; i < sensor.length; i++){
        sensor[i].time = this.time(sensor[i].duration);
      }
      this.bodyTable = sensor;
    });
  }

  time(duraion) {
    let myDate = new Date(duraion);
    let days = '', hours = '', min = '', sec = '-';

    if(duraion >= 1000) sec = myDate.getUTCSeconds().toString() + ' sec ';
    if(duraion >= 60000) min = myDate.getUTCMinutes().toString() + ' min ';
    if(duraion >= 3600000) hours = myDate.getUTCHours().toString() + ' h ';
    if(duraion >= 86400000) days = Math.trunc(duraion / 86400000) + ' days ';

    return days + hours + min + sec;
  }
}
