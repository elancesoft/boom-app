import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {LocalStorageService} from 'angular-web-storage';
import {CommonService} from '../services/common.service';
import {ApiService} from '../services/api-service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-step-eight',
  templateUrl: './step-eight.component.html',
  styleUrls: ['./step-eight.component.scss']
})
export class StepEightComponent implements OnInit {
  total_data: any;
  quote_date: string;

  dwelling_value = 0;
  contents = 0;
  personel_property = 0;
  structures = 0;
  liability = 0;
  deductible = 0;
  loss_of_use = 0;
  water_backup = 0;
  loss_assessment = 0;
  med_to_pay = 0;
  selectedMode: number;
  loading = false;
  coverageAry: Array<any>;
  progress = 0;
  isSelectedCompany = false;
  isSelectedCoverage = false;
  isSelectedApplicant = false;
  isSelectedProperty = false;
  isSelectedFinalAgreement = false;
  companyLogos: object = {
    'Stillwater': '../../assets/images/still-water.png',
    'Plymouth': '../../assets/images/plymouth_logo260x50.png',
  };
  buildings: Array<string> = ['Other', 'Colonial', 'Ranch', 'Mediterranean', 'Contemporary', 'Row Center', 'Split',
    'Town Home', 'Victorian'];
  roofs: Array<string> = ['Other', 'Asphalt shingle', 'Wood shingle', 'Slate', 'Rubber', 'Concrete', 'Solar', 'Tile',
    'Tar and Gravel', 'Composite shingles'];
  constructions: Array<string> = ['Other', 'Wood Frame', 'Steel Frame', 'Masonry / Brick', 'Concrete'];
  exteriors: Array<string> = ['Other', 'Aluminium Siding', 'Brick Veneer', 'Brick', 'Concrete', 'Hardiplank',
    'Stone Veneer', 'Stone', 'Stucco Siding', 'Vinyl Siding', 'Wood Siding'];
  previousUrl: string;
  static_address = '';
  constructor(
    public router: Router, private local: LocalStorageService,
    public commonService: CommonService, private apiService: ApiService
  ) {

  }

  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    let date = new Date(), month, day;
    if (date.getMonth() + 1 < 10) {
      month = '0' + (date.getMonth() + 1);
    } else {
      month = date.getMonth() + 1;
    }

    if (date.getDate() < 10) {
      day = '0' + date.getDate();
    } else {
      day = date.getDate();
    }
    this.quote_date = date.getFullYear() + '-' + month + '-' + day;
    this.total_data = this.local.get('total_data');
    this.selectedMode = this.total_data['mode'];
    let coverageAry = [];
    console.log(this.total_data,'total_data');
    try {
      coverageAry = this.total_data.insurance_data.stillwater.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.HomeLineBusiness.Dwell.Coverage;
    } catch (e) {
    }
    try {
      this.static_address = this.total_data.address_components.formatted_address;
    } catch (e) {

    }

    this.dwelling_value = this.getCoverageValue(coverageAry, 'DWELL');
    this.personel_property = this.getCoverageValue(coverageAry, 'PP');
    this.structures = this.getCoverageValue(coverageAry, 'OS');
    this.liability = this.getCoverageValue(coverageAry, 'PL');
    this.med_to_pay = this.getCoverageValue(coverageAry, 'MEDPM');
    this.loss_of_use = this.getCoverageValue(coverageAry, 'LOU');
    this.water_backup = this.getCoverageValue(coverageAry, 'SEWER');
    this.loss_assessment = this.getCoverageValue(coverageAry, 'LAC');
    this.structures = this.selectedMode === 0 ? this.getCoverageValue(coverageAry, 'OS') : '';
    this.contents = coverageAry.filter(coverage => {
      return coverage['CoverageCd'] === 'RCC';
    })[0]['CurrentTermAmt']['Amt'];
    this.deductible = this.selectedMode === 1 ? coverageAry.filter(coverage => {
      return coverage['CoverageCd'] === 'PP';
    })[0]['Deductible'][0]['FormatInteger'][0] : '';
    const {
      apiType, personData, static_address, is_basement, mortgage_data, built_year, roof_year, ac_year, electric_year,
      plumbing_year, building_type, construction_type, exterior_type, roof_type, pricing
    } = this.total_data;
    const guaranteed_ary = {
      'Stillwater': 'NO GUARANTEED',
      'Plymouth': 'GUARANTEED'
    };
    const data = {
      quoteID: this.commonService.getUniqueID(),
      premium: '$' + this.commonService.commafy(pricing),
      dwelling_value: '$' + this.commonService.commafy(this.dwelling_value),
      structures: '$' + this.commonService.commafy(this.structures),
      personal_property: '$' + this.commonService.commafy(this.personel_property),
      loss_of_use: '$' + this.commonService.commafy(this.loss_of_use),
      liability: '$' + this.commonService.commafy(this.liability),
      med_to_pay: '$' + this.commonService.commafy(this.med_to_pay),
      water_backup: '10,000',
      service_line: '5,000',
      home_system: '50,000',
      address: this.total_data['static_address'],
      start_date: this.total_data['mortgage_data']['startdate'],
      quote_date: this.quote_date,
      apiType, personData, static_address, mortgage_data, built_year, roof_year, ac_year, electric_year, plumbing_year,
      dwelling_extension: guaranteed_ary[apiType],
      foundation: is_basement ? 'finished' : 'unfinished',
      building_type: this.buildings[building_type],
      roof_type: this.roofs[roof_type],
      construction_type: this.constructions[construction_type],
      exterior_type: this.exteriors[exterior_type]
    };
    this.apiService.sendDetailsEmail(data).subscribe(res => {
    }, err => {
    });
  }
  getCoverageValue(coverageAry: any, code: string) {
    let value;
    try {
      value = coverageAry.filter(coverage => {
        return coverage['CoverageCd'] === code;
      })[0]['Limit']['FormatInteger'];
    } catch (e) {
      value = '';
    }
    return value;
  }
  isValid() {
    return true;
    return this.isSelectedCompany && this.isSelectedApplicant && this.isSelectedCoverage &&
      this.isSelectedProperty && this.isSelectedFinalAgreement;
  }

  issuePolicy() {
    const total_data = this.local.get('total_data');
    this.loading = true;
    window.scrollTo(0, 0);
    let data = {};
    if (total_data['mortgage_data']['is_mortgage']) {
      data = {
        mortgage_name: total_data['mortgage_data']['name'],
        // continue_name: 'aa',
        mortgage_street: total_data['mortgage_data']['address'],
        mortgage_city: total_data['mortgage_data']['city'],
        mortgage_state: total_data['mortgage_data']['state'],
        mortgage_postal_code: total_data['mortgage_data']['zip'],
        // loan: 'aaa',
        lender_email: total_data['mortgage_data']['lender_email']
      };
    }
    console.log(data, 'data');
    console.log(total_data, 'total_data');
    if (!total_data['personData'][1]) {
      data['personData'] = total_data['personData'][1];
    }
    // if (this.haveUsers) {
    //   data['personData'] = this.personData;
    // }
    data['uniqueId'] =  this.commonService.getLocalItem('unique_id');
    data['start_date'] = total_data['mortgage_data']['startdate'];
    data['phone'] = total_data['phone'];
    data['mortgage'] = total_data['mortgage_data']['is_mortgage'];
    data['personData'] = total_data['personData'];
    this.loading = true;
    const int = setInterval(() => {
      if (this.progress < 100) {
        this.progress = this.progress + 1;
      }
    }, 70);

    this.apiService.saveMortgage(data).subscribe(res => {
      clearInterval(int);
      console.log(res, 'res');
      if (res['result'] === 'success') {
        this.progress = 100;
        setTimeout(() => {
          total_data['start_date'] = res['data']['start_date'];
          total_data['mortgage_effective_date'] = res['data']['mortgage_effective_date'];
          total_data['mortgage_expiration_date'] = res['data']['mortgage_expiration_date'];
          total_data['policy_doc_url'] = res['data']['policy_doc_url'];
          total_data['invoicePDFURL'] = res['invoicePDFURL'];
          total_data['evidencePDFURL'] = res['evidencePDFURL'];
          this.local.set('total_data', total_data);
          this.loading = false;
          this.router.navigate(['/step9']);
        }, 500);
      } else {
        this.commonService.modalOpen('Error', 'An error occurred. Please try again later.');
        this.progress = 0;
        this.loading = false;
      }
    });
  }

}

/*comment*/
