import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'angular-web-storage';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-step-nine',
  templateUrl: './step-nine.component.html',
  styleUrls: ['./step-nine.component.scss']
})
export class StepNineComponent implements OnInit {

  total_data: any;
  expiration_date = '';
  effective_date = '';
  evidencePDFURL = '';
  invoicePDFURL = '';

  constructor(private local: LocalStorageService, public commonService: CommonService) {
  }

  async ngOnInit() {
    this.total_data = await this.local.get('total_data');
    const {evidencePDFURL, invoicePDFURL, mortgage_effective_date, mortgage_expiration_date} = this.total_data;
    this.evidencePDFURL = evidencePDFURL;
    this.invoicePDFURL = invoicePDFURL;
    this.effective_date = mortgage_effective_date;
    this.expiration_date = mortgage_expiration_date;
  }
}
