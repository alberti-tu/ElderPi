import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  headTable: string[] = ['Location', 'Battery', 'Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private socket: SocketService) {
    this.setTable(socket.table);
    this.sensorData();
  }

  ngOnInit() {  }

  sensorData() {
    this.socket.updateTable().subscribe((sensors: Sensor[]) => {
      this.setTable(sensors);
    });
  }

  setTable(sensors: Sensor[]): void {
    this.bodyTable = sensors;
  }

  getTable(): Sensor[] {
    return this.bodyTable;
  }
}
