import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { SocketService } from '../../service/socket.service';
import { Sensor } from '../../models/sensor';

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
      this.bodyTable = sensor;
    });
  }
}
