import {Component, HostListener, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-coverage-info',
  templateUrl: './demo-coverage-info.component.html',
  styleUrls: ['./demo-coverage-info.component.scss']
})
export class DemoCoverageInfoComponent implements OnInit {

  constructor(public commonService: CommonService) {
  }

  coverage_a: string;
  coverage_b: string;
  coverage_d: string;
  personal_property: string;
  selectedTab= "coverages";
  // flag set to hide table decription
  hideTableDescription: boolean =true;

  ngOnInit() {
    const total_data = this.commonService.getLocalItem('total_data');
    console.log("total_data ===> ", total_data);

    let tmp_a = '';
//    console.log(total_data,'total_data');
//    this.personal_property = total_data.demo_homeowner_data.plymouth['better'].personalProperty;
//    this.personal_property = this.personal_property.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tmp_a = typeof total_data['hippo'] != "undefined" ? JSON.parse(total_data['hippo']).coverage_a : 0;
//    tmp_a = total_data.demo_homeowner_data.plymouth['better'].dwelling;
    this.coverage_a = tmp_a;//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.coverage_b = Math.round(Number(tmp_a) * 0.1).toString();//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.coverage_d = Math.round(Number(tmp_a) * 0.2).toString();//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.personal_property = Math.round(Number(tmp_a) * 0.7).toString();//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  }
}
