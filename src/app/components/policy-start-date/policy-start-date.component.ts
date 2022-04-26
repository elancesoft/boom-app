import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-policy-start-date',
  templateUrl: './policy-start-date.component.html',
  styleUrls: ['./policy-start-date.component.scss']
})
export class PolicyStartDateComponent implements OnInit {
  public start_date:string;
  public InsuranceData : any;
  public isHaveMortgage: boolean;
  listpriceWidgetCommonClass = "mr-4 ml-md-0 ml-4 col-md-4 my-2 form-row";
  constructor(public commonService:CommonService, public router:Router) {
    this.InsuranceData = this.commonService.getLocalItem('total_data').selected_insurance_data;
  }

  insuranceImgs: object = [
    // '../../assets/images/metlife_new_logo.png',
    // '../../assets/images/hous-illustrations/liberty-icon.png',
    '../../assets/images//hous-illustrations/Nationwide_Best.png',
    '../../assets/images/hous-illustrations/Travelers_Best.png',
    '../../assets/images/hous-illustrations/Universal_Best.png',
    '../../assets/images/hous-illustrations/PlymouthRock_Best.png',
    '../../assets/images/hous-illustrations/Progressive_Best.png',
    '../../assets/images/hous-illustrations/Hippo_Best.png',
    '../../assets/images/hous-illustrations/Stillwater_Best.icon'
  ];

  mobInsuranceImgs: object = [
    // '../../assets/images/metlife_new_logo.png',
    // '../../assets/images/hous-illustrations/liberty-icon.png',
    '../../assets/images//hous-illustrations/Nationwide_Best.png',
    '../../assets/images/hous-illustrations/Travelers_Best.png',
    '../../assets/images/hous-illustrations/Universal_Best.png',
    '../../assets/images/hous-illustrations/PlymouthRock_Best.png',
    '../../assets/images/hous-illustrations/Progressive_Best.png',
    '../../assets/images/hous-illustrations/Hippo_Best.png',
    '../../assets/images/hous-illustrations/Stillwater_Best.icon'
  ];

  bgColor: any = [
    "darkblue","darkgreen","red","darkred","#5bc0de","lightblue","#167EF8","green","darkyellow"
  ];
  ngOnInit() {
  }

  next(value: boolean) {
    if(!this.start_date) return;
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    this.isHaveMortgage = value;
    if (!mortgage_data) mortgage_data = {};
    mortgage_data['is_mortgage'] = this.isHaveMortgage;
    mortgage_data['startdate'] = this.start_date;
    if (!this.isHaveMortgage) {
      mortgage_data['lender_email'] = '';
      this.router.navigateByUrl('/policy-chat');
      return;
    }
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/policy-mortgage-info');
  }

}
