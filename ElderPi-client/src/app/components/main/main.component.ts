import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';
import {HttpService} from '../../service/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  headTable: string[] = ['Location', 'Precense', 'Battery','Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private http: HttpService, private socket: SocketService) {
    this.sensorData();
  }

  ngOnInit() {  }

  sensorData() {
    this.socket.openSocket();
    this.socket.updateTable().subscribe((sensor: Sensor[]) => {
      this.bodyTable = sensor;
    });
  }
}
