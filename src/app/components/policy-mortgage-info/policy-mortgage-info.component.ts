import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-policy-mortgage-info',
  templateUrl: './policy-mortgage-info.component.html',
  styleUrls: ['./policy-mortgage-info.component.scss']
})
export class PolicyMortgageInfoComponent implements OnInit {
  public email: string;

  public userForm: FormGroup;
  constructor(public commonService:CommonService, private router:Router) {
  }

  ngOnInit() {
    let formData = {
      emailInput: new FormControl(this.email, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    };
    this.userForm = new FormGroup(formData);
  }
  next(){
    if(this.userForm.valid){
      const total_data = this.commonService.getLocalItem('total_data');
      let mortgage_data = total_data['mortgage_data'];
      if (!mortgage_data) mortgage_data = {};
      mortgage_data['lender_email'] = this.email;
      this.commonService.applyTotalData('mortgage_data', mortgage_data);
    }
    this.router.navigateByUrl('/policy-chat');
  }
}
