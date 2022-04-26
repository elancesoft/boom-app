import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-gmap',
  templateUrl: './demo-gmap.component.html',
  styleUrls: ['./demo-gmap.component.scss']
})
export class DemoGmapComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public commonService: CommonService) {
  }

  showLoader: boolean = true;
  lat: number;
  lng: number;
  interval: any;

  ngOnInit() {
    let mode;
    const total_data = this.commonService.getLocalItem('total_data');
    mode = total_data['mode'];
    if (!mode) mode = 0;
    mode = 0;
    this.generateMapData();
    this.interval = setInterval(() => this.getPricing(mode), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval)
  }

  generateMapData() {
    try {
      const total_data = this.commonService.getLocalItem('total_data');
      this.lat = total_data.address_components.geometry.location.lat;
      this.lng = total_data.address_components.geometry.location.lng;
    } catch (e) {
      this.lat = 0;
      this.lng = 0;
    }
  }

  getPricing(type) {
    const prices = this.commonService.getPricingForDemo(type);
    this.showLoader = false;
  }

  send() {
    // const {highest_price, lowest_price, medium_price} = this;
  }

  ngAfterViewInit(): void {

  }
}
