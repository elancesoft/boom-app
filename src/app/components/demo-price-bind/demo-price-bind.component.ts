import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-price-bind',
  templateUrl: './demo-price-bind.component.html',
  styleUrls: ['./demo-price-bind.component.scss']
})
export class DemoPriceBindComponent implements OnInit {
  public hippo:Array<any> = [];
  constructor(public commonService:CommonService) { }

  ngOnInit() {
    const data = this.commonService.getLocalItem('total_data');
    try {
      this.hippo = JSON.parse(data.hippo);
    }catch (e) {
      this.hippo = [];
    }
  }
}
