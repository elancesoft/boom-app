import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-haven-result',
  templateUrl: './haven-result.component.html',
  styleUrls: ['./haven-result.component.scss']
})
export class HavenResultComponent implements OnInit {
  price:number;
  constructor(public commonService:CommonService,public router:Router) { }

  ngOnInit() {
    try {
      this.price = this.commonService.getLocalItem('total_data')['havenLife']['quotes'][0]['monthlyRate'];
    }catch (e) {
      this.price = 0;
    }
  }
  next(){
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    if (!mortgage_data) mortgage_data = {};
    mortgage_data['imgURL'] = '../../../assets/images/companies/Haven.png';
    mortgage_data['price'] = this.price*12;
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/preparing-policy');
  }
}
