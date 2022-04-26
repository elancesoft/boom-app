import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {personData} from "../home/models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../services/common.service";
import {DatePipe} from "@angular/common";

/*comment*/
@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss'],
  providers: [DatePipe]
})
export class StepFiveComponent implements OnInit {
  constructor(public  router: Router, public local: LocalStorageService, private commonService: CommonService, private datePipe: DatePipe) {
  }

  personData: personData[] = [{first_name: '', last_name: '', birthday: ''}];
  email: string = '';
  phone: string = '';
  userForm: FormGroup;
  lowPrice: number;
  highPrice: number;
  uniqueId: string;

  ngOnInit() {
    this.validateUserForm();
    this.loadValue();
  }

  async calcPriceRange(total_data) {
    const commonPricing = await this.commonService.getPricings(total_data);
    this.lowPrice = commonPricing['lowPrice'];
    this.highPrice = commonPricing['highPrice'];
  }

  validateUserForm() {

    let formData = {
      emailInput: new FormControl(this.email, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      phoneInput: new FormControl(this.phone, [Validators.required, Validators.pattern(/^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/)]),
    };
    this.userForm = new FormGroup(formData);
    for (let i = 0; i < this.personData.length; i++) {
      (<FormGroup>this.userForm).addControl('firstnameInput' + i, new FormControl(this.personData[i]['first_name'], Validators.required));
      (<FormGroup>this.userForm).addControl('lastnameInput' + i, new FormControl(this.personData[i]['last_name'], Validators.required));
      (<FormGroup>this.userForm).addControl('birthdayInput' + i, new FormControl(this.personData[i]['birthday'], Validators.required));
    }
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3]
    }
    return null
  }

  addPerson() {
    if (this.personData.length < 2) {
      this.personData.push({first_name: '', last_name: '', birthday: ''});
      this.validateUserForm();
    }
  };

  deletePerson(key) {
    this.personData.splice(key, 1);
    this.validateUserForm();
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem('total_data');
    if (data['personData'] != undefined) {
      this.personData = data['personData'];
    }
    this.email = data['email'];
    this.phone = data['phone'] != undefined ? data['phone'].replace(/-/g, '') : '';
    this.calcPriceRange(data);
    this.validateUserForm();
  }

  async submitUserData() {
    if (this.userForm.invalid) {
      this.commonService.modalOpen('Error', 'Please complete all required fields.');
      return;
    }
    this.commonService.spinnerService.show();
    let total_data = await this.commonService.getLocalItem('total_data');
    total_data['personData'] = this.personData;
    total_data['email'] = this.email;
    total_data['phone'] = this.formatPhoneNumber(this.phone);
    total_data['low_price'] = this.lowPrice;
    total_data['high_price'] = this.highPrice;
    await this.commonService.setLocalItem('total_data', total_data);
    this.router.navigate(['/step6']);
  }
}
