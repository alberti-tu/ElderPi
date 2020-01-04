import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public headTable: string[] = ['Location', 'Battery', 'Hour', 'Date'];
  public list: Sensor[];

  constructor(private socket: SocketService) {
    this.socket.getTable();
    this.socket.updateTable().subscribe((sensors: Sensor[]) => {
      this.list = sensors;
    });
  }

  ngOnInit() {  }

}
