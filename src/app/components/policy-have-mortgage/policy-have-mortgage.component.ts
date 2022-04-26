import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-policy-have-mortgage',
  templateUrl: './policy-have-mortgage.component.html',
  styleUrls: ['./policy-have-mortgage.component.scss']
})
export class PolicyHaveMortgageComponent implements OnInit {
  public isHaveMortgage: boolean;

  constructor(public commonService: CommonService, private router: Router) {
  }

  ngOnInit() {
  }

  next(value: boolean) {
    this.isHaveMortgage = value;
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    if (!mortgage_data) mortgage_data = {};
    mortgage_data['is_mortgage'] = this.isHaveMortgage;
    if (!this.isHaveMortgage) {
      mortgage_data['lender_email'] = '';
      this.router.navigateByUrl('/policy-chat');
      return;
    }
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/policy-mortgage-info');
  }
}
