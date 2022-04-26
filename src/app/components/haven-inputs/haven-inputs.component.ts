import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {ApiService} from '../../services/api-service';
import {Router} from '@angular/router';
import {IMyOptions} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-haven-inputs',
  templateUrl: './haven-inputs.component.html',
  styleUrls: ['./haven-inputs.component.scss']
})
export class HavenInputsComponent implements OnInit {
  name: string;
  dateOfBirth: string;
  gender = '0';
  coverageAmount = 0;
  coverages = [
    {value: '250000', label: '250K'},
    {value: '500000', label: '500K'},
    {value: '750000', label: '750K'},
    {value: '1000000', label: '1M'},
  ];
  genders = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
  ];
  showLoader = false;

  public myDatePickerOptions: IMyOptions = {
// Your options
  };

  constructor(public commonService: CommonService, public apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    console.log(this.commonService.getLocalItem('total_data'), 'total_data');
  }

  next() {
    if (this.validate()) {
      this.showLoader = true;
      const state = this.commonService.getAddressData()['administrative_area_level_1'];
      const {name, dateOfBirth, gender, coverageAmount} = this;
      const params = {name, dateOfBirth, gender, coverageAmount, state};
      this.apiService.getHavenLife(params).subscribe((res) => {
        this.showLoader = false;
        if (res['quotes']) {
          this.commonService.applyTotalData('havenLife', res);
          this.router.navigateByUrl('/haven-result');
        } else {
          const message = res['message'] ? res['message'] : 'An error occurred. Please try again later.';
          this.commonService.modalOpen('Error', message);
        }
      });
    }
  }

  validate() {
    if (!this.name) {
      this.commonService.modalOpen('Warning', 'Please enter the name.');
      return false;
    }
    if (!this.dateOfBirth) {
      this.commonService.modalOpen('Warning', 'Please select the birthday.');
      return false;
    }
    if (!this.gender) {
      this.commonService.modalOpen('Warning', 'Please select the gender.');
      return false;
    }
    if (!this.name) {
      this.commonService.modalOpen('Warning', 'Please select the amount of coverage.');
      return false;
    }
    return true;
  }
}
