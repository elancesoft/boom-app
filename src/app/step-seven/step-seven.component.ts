import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from 'angular-web-storage';
import {CommonService} from '../services/common.service';
import {ApiService} from '../services/api-service';

@Component({
  selector: 'app-step-seven',
  templateUrl: './step-seven.component.html',
  styleUrls: ['./step-seven.component.scss']
})
export class StepSevenComponent implements OnInit, AfterViewInit {

  startDate: string;
  isMortgage = false;
  name: string;
  mortgageForm: FormGroup;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  isBuying = false;
  isLender = false;
  full_addresss: string;
  stateAry: object = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
    'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  loading = false;
  uniqueId: string;
  progress = 0;

  constructor(
    public router: Router,
    public local: LocalStorageService,
    private commonService: CommonService,
    private apiService: ApiService) {
  }

  ngOnInit() {

    this.validateMortgageForm();

    this.validateMortgageForm();

  }

  ngAfterViewInit(): void {
    this.loadValue();
  }

  validateMortgageForm() {

    const formData = {
      'startdateInput': new FormControl(this.startDate, [Validators.required]),
      'nameInput': new FormControl(this.name, [Validators.required]),
      'addressInput': new FormControl(this.address, [Validators.required]),
      'cityInput': new FormControl(this.city, [Validators.required]),
      'stateInput': new FormControl(this.state, [Validators.required]),
      'zipInput': new FormControl(this.zip, [Validators.required]),
      'emailInput': new FormControl(this.email, [Validators.required, Validators.pattern(
        // tslint:disable-next-line:max-line-length
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    };
    this.mortgageForm = new FormGroup(formData);
  }

  get mortgageNameInput() {
    return this.mortgageForm.get('nameInput');
  }

  get phoneNumberInput() {
    return this.mortgageForm.get('phoneNumberInput');
  }

  get startDateInput() {
    return this.mortgageForm.get('startdateInput');
  }

// get lenderEmailInput() {
// return this.mortgageForm.get('lenderEmailInput');
// }

  get continueNameInput() {
    return this.mortgageForm.get('continueNameInput');
  }

  get addressInput() {
    return this.mortgageForm.get('addressInput');
  }

  get cityInput() {
    return this.mortgageForm.get('cityInput');
  }

  get stateInput() {
    return this.mortgageForm.get('stateInput');
  }

  get zipInput() {
    return this.mortgageForm.get('zipInput');
  }

  get emailInput() {
    return this.mortgageForm.get('emailInput');
  }

  loadValue() {
    this.setValdiStartDate();
    const total_data = this.local.get('total_data');
    console.log(total_data,'total_data');
    return;
    this.full_addresss = total_data['static_address'];
    const mortgage_data = total_data['mortgage_data'];
    if (mortgage_data) {
      !mortgage_data['startdate'] ? this.startDate = '' : this.startDate = mortgage_data['startdate'];
      !mortgage_data['is_mortgage'] ? this.isMortgage = false : this.isMortgage = mortgage_data['is_mortgage'];
      !mortgage_data['name'] ? this.name = '' : this.name = mortgage_data['name'];
      !mortgage_data['address'] ? this.address = '' : this.address = mortgage_data['address'];
      !mortgage_data['city'] ? this.city = '' : this.city = mortgage_data['city'];
      !mortgage_data['state'] ? this.state = '' : this.state = mortgage_data['state'];
      !mortgage_data['zip'] ? this.zip = '' : this.zip = mortgage_data['zip'];
      !mortgage_data['is_buying'] ? this.isBuying = false : this.isBuying = mortgage_data['is_buying'];
      !mortgage_data['is_lender'] ? this.isLender = false : this.isLender = mortgage_data['is_lender'];
      !mortgage_data['lender_email'] ? this.email = '' : this.email = mortgage_data['lender_email'];
    }
    const uniqueId = this.local.get('unique_id');
    this.apiService.checkValid({uniqueId: uniqueId}).subscribe(res => {
      // tslint:disable-next-line:triple-equals
      if (res['result'] == 'success') {

        if (res['data'][0]['bind_now']) {
        } else {
          setTimeout(() => {
            this.router.navigate(['/index']);
          }, 100);
        }
      }
    }, (err) => {
    });
  }


  setValdiStartDate() {
    const maxDate = new Date(), minDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    minDate.setDate(minDate.getDate());
    const maxYear = maxDate.getFullYear(), maxMonth = (maxDate.getMonth() + 1).pad(2),
      maxDay = (maxDate.getDate()).pad(2);
    const minYear = minDate.getFullYear(), minMonth = (minDate.getMonth() + 1).pad(2),
      minDay = (minDate.getDate()).pad(2);
    return {
      maxDate: maxYear + '-' + maxMonth + '-' + maxDay,
      minDate: minYear + '-' + minMonth + '-' + minDay
    };
  }


  issuePolicy() {
    const nowDate = new Date();
    const minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    const minTime = (new Date(minDate)).getTime();
    const maxTime = (new Date(minDate)).setDate((new Date(minDate)).getDate() + 30);
    this.validateMortgageForm();
    if ((new Date(this.startDate)).getTime() < minTime || (new Date(this.startDate)).getTime() > maxTime) {
      this.commonService.modalOpen('Error', 'Please select the valid date.');
      return;
    }
    const total_data = this.local.get('total_data');
    if (this.isMortgage) {
      if (!this.mortgageForm.valid && this.mortgageNameInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid mortgage name');
        return;
      }


      if (!this.mortgageForm.valid && this.addressInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid address.');
        return;
      }

      if (!this.mortgageForm.valid && this.cityInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid city.');
        return;
      }

      if (!this.mortgageForm.valid && this.stateInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid state.');
        return;
      }
      if (!this.mortgageForm.valid && this.zipInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid zip.');
        return;
      }
    }
    if (this.isLender && this.isBuying && this.isMortgage) {
      if (!this.mortgageForm.valid && this.emailInput.invalid) {
        this.commonService.modalOpen('Error', 'Please enter the valid email address.');
        return;
      }
    }
    this.router.navigate(['/step8']);

  }

  submitMortgageData() {
    const total_data = this.local.get('total_data');
    total_data['mortgage_data'] = {
      startdate: this.startDate,
      is_mortgage: this.isMortgage,
      name: this.name,
      address: this.address,
      state: this.state,
      city: this.city,
      zip: this.zip,
      is_buying: this.isBuying,
      is_lender: this.isLender,
      lender_email: this.email
    };
    this.local.set('total_data', total_data);
    this.issuePolicy();
  }
}

/*comment*/
