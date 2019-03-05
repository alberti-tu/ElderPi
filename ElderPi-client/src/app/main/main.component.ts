import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http.service';
import { Sensor } from '../models/sensor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  headTable: string[] = ['Device ID', 'Precense', 'Battery','Hour', 'Date'];
  bodyTable: Sensor[];

  constructor(private http: HttpService) {
    this.selectAll();
  }

  ngOnInit() {  }

  selectAll() {
    this.http.sensor().subscribe(result => { return this.bodyTable = result });
  }

}
