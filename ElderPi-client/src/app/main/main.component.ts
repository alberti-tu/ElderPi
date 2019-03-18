import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http.service';
import { SocketService } from '../service/socket.service';
import { Sensor } from '../models/sensor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  headTable: string[] = ['Device ID', 'Precense', 'Battery','Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private http: HttpService, private socket: SocketService) {
    this.socket.updateTable().subscribe((sensor: Sensor[]) => { this.bodyTable = sensor });
  }

  ngOnInit() {  }
}
