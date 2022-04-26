import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api-service";
import {NgbdModalContent} from "../home/ngbd.modal.content";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {personData} from "../home/models";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from '../services/common.service';

declare global {
  interface Number {
    pad(length: number): string;
  }
}

Number.prototype.pad = function (length: number) {

  let s = String(this);
  while (s.length < (length || 2)) {
    s = "0" + s
  }
  return s;
};

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  loading: boolean = false;
  progress: number = 0;
  haveMortgage: boolean = true;
  validatingMortage: FormGroup;
  startDate: string;
  mortgageName: string;
  lenderEmail: string;
  continueName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  loan: string;
  phoneNumber: string;
  personData: personData[] = [{first_name: '', last_name: '', birthday: ''}];
  haveUsers: boolean = false;
  uniqueId: string;
  stateAry:object = ['AL','AK','AZ','AR','CA','CO','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX',
  'UT','VT','VA','WA','WV','WI','WY'];

  constructor(private router: Router,
              private apiService: ApiService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService,
              public local: LocalStorageService,
              private commonService:CommonService) {
  }

  Modalopen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;
  }

  validateMortgageForm() {
    let formData = {
      "startDateInput":
        new FormControl(this.startDate, Validators.required),

      "phoneNumberInput":
        new FormControl(this.phoneNumber, [Validators.required, Validators.pattern(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/)])
    };
    if (this.haveMortgage) {
      formData['mortgageNameInput'] = new FormControl(this.mortgageName, [Validators.required, Validators.maxLength(15)]);
      formData['continueNameInput'] = new FormControl(this.continueName, [Validators.required, Validators.maxLength(15)]);
      formData['streetInput'] = new FormControl(this.street, Validators.required);
      formData['cityInput'] = new FormControl(this.city, Validators.required);
      formData['stateInput'] = new FormControl(this.state, Validators.required);
      formData['zipInput'] = new FormControl(this.zip, Validators.required);
      formData['loanInput'] = new FormControl(this.loan, Validators.required);
      // formData['lenderEmailInput'] = new FormControl(this.lenderEmail, [Validators.required, Validators.pattern(
      //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
    }

    this.validatingMortage = new FormGroup(formData);
  }

  get mortgageNameInput() {
    return this.validatingMortage.get('mortgageNameInput');
  }

  get phoneNumberInput() {
    return this.validatingMortage.get('phoneNumberInput');
  }

  get startDateInput() {
    return this.validatingMortage.get('startDateInput');
  }

  // get lenderEmailInput() {
  //   return this.validatingMortage.get('lenderEmailInput');
  // }

  get continueNameInput() {
    return this.validatingMortage.get('continueNameInput');
  }

  get streetInput() {
    return this.validatingMortage.get('streetInput');
  }

  get cityInput() {
    return this.validatingMortage.get('cityInput');
  }

  get stateInput() {
    return this.validatingMortage.get('stateInput');
  }

  get zipInput() {
    return this.validatingMortage.get('zipInput');
  }

  get loanInput() {
    return this.validatingMortage.get('loanInput');
  }


  issuePolicy() {

    let nowDate = new Date();
    let minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    let minTime = (new Date(minDate)).getTime();
    let maxTime = (new Date(minDate)).setDate((new Date(minDate)).getDate() + 30);
    this.validateMortgageForm();
    if ((new Date(this.startDate)).getTime() < minTime || (new Date(this.startDate)).getTime() > maxTime) {
      this.Modalopen('Error', 'Please select the valid date.');
      return;
    }

    if (!this.validatingMortage.valid && this.phoneNumberInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid phone number');
      return;
    }
    if (!this.validatingMortage.valid && this.mortgageNameInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid mortgage name');
      return;
    }

    if (!this.validatingMortage.valid && this.continueNameInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid mortgagee continued name');
      return;
    }

    if (!this.validatingMortage.valid && this.streetInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid street.');
      return;
    }

    if (!this.validatingMortage.valid && this.cityInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid city.');
      return;
    }

    if (!this.validatingMortage.valid && this.stateInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid state.');
      return;
    }
    if (!this.validatingMortage.valid && this.zipInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid zip.');
      return;
    }

    if (!this.validatingMortage.valid && this.loanInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid loan number.');
      return;
    }

    if (!this.validatingMortage.valid && this.loanInput.invalid) {
      this.Modalopen('Error', 'Please enter the valid loan number.');
      return;
    }
    let data = {};
    let city, state, postal_code;

    if (this.haveMortgage) {

      city = this.city.trim();
      state = this.state.trim();
      postal_code = this.zip.trim();
      data = {
        mortgage_name: this.mortgageName,
        continue_name: this.continueName,
        street: this.street,
        city: city,
        state: state,
        postal_code: postal_code,
        loan: this.loan,
        lender_email: this.lenderEmail,
      }
    }
    if (this.haveUsers) {
      data['personData'] = this.personData;
    }
    this.uniqueId = this.commonService.getLocalItem('unique_id') || location.href.substr(location.href.indexOf('uniqueId=') + 9);
    data['uniqueId'] = this.uniqueId;
    data['start_date'] = this.startDate;
    data['phone'] = this.phoneNumber;
    data['mortgage'] = this.validatingMortage.valid;

    this.loading = true;
    const int = setInterval(() => {
      if (this.progress <= 100) {
        this.progress = this.progress + 1;
      }
    }, 50);

    this.apiService.saveMortgage(data).subscribe(res => {
      if (res['result'] == 'success') {
        clearInterval(int);
        setTimeout(() => {
          this.router.navigate(['/esign', {
            policy_number: res['data']['policy_number'],
            start_date: res['data']['policy_start_date'],
            first_name: res['data']['first_name'],
            quote_id: res['data']['quote_id'],
            policy_doc_url: res['data']['policy_document_url']
          }]);
          this.loading = false;
        }, 500)
      } else {
        this.Modalopen('Error', 'An error occurred. Please try again.');
        this.loading = false;
      }
    });
  }

  showPersonDiv() {

    setTimeout(() => {

      this.validateMortgageForm();
      if (this.validatingMortage.valid) {
        setTimeout(() => {
          document.getElementById('addPersonDiv').scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 300)
      } else {
      }
    })
  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    let uniqueId = this.local.get('unique_id') || location.href.substr(location.href.indexOf('uniqueId=') + 9);
    this.apiService.checkValid({uniqueId: uniqueId}).subscribe(res => {
      if (res['result'] == 'success') {

        if (res['data'][0]['bind_now']) {
        } else {
          this.router.navigate(['/index']);
        }
      }
    }, (err) => {
    });

    this.validateMortgageForm();
    this.setValdiStartDate();
  }

  setValdiStartDate() {
    let maxDate = new Date(), minDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    minDate.setDate(minDate.getDate());
    let maxYear = maxDate.getFullYear(), maxMonth = (maxDate.getMonth() + 1).pad(2),
      maxDay = (maxDate.getDate()).pad(2);
    let minYear = minDate.getFullYear(), minMonth = (minDate.getMonth() + 1).pad(2),
      minDay = (minDate.getDate()).pad(2);
    return {
      maxDate: maxYear + '-' + maxMonth + '-' + maxDay,
      minDate: minYear + '-' + minMonth + '-' + minDay
    };
  }

  addPerson(i) {
    if (this.personData.length < 5) {
      this.personData[this.personData.length] = {first_name: '', last_name: '', birthday: ''};
    }
  }

  deletePerson(key) {
    this.personData.splice(key, 1);
  }
}
