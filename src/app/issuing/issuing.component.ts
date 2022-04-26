import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../services/common.service";
import * as $ from "jquery";

@Component({
  selector: 'app-issuing',
  templateUrl: './issuing.component.html',
  styleUrls: ['./issuing.component.scss']
})
export class IssuingComponent implements OnInit {

  dropdownItems = [
    { name: "auto", url: "../../assets/images/button-icons/car-icon.png" },
    { name: "flood", url: "../../assets/images/button-icons/flood-icon.png" },
    { name: "life", url: "../../assets/images/button-icons/life-icon.png" },
    { name: "umbrella", url: "../../assets/images/button-icons/umbrella-icon.png" },
    { name: "condo", url: "../../assets/images/button-icons/condo-icon.png" }
  ];
  insuranceOptions = {
    home: true,
    auto: false,
    flood: false,
    life: false,
    umbrella: false,
    condo: false
  }

  constructor(private commonService: CommonService) {
    $('body').on('click',function(event){

      if($("#jumbo-dropdown-menu").hasClass('fadeInDropdown') && !$(event.target).is('#jumbo-dropdown-menu') && !$(event.target).is('.jumbo-option *')){
        $("#jumbo-dropdown-menu").removeClass('fadeInDropdown');
        $(".dropdown").removeClass('open show');
        $(".dropdown-toggle").focus();
      }
    });
  }

  ngOnInit() {
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }

  toggle(key) {
    this.insuranceOptions[key] = !this.insuranceOptions[key];
    this.commonService.applyTotalData('insuranceOptions',this.insuranceOptions)
  }
}
