import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, AfterViewInit {
  constructionType: number;
  foundationType: number;
  isBasement: number;
  buildingType: number;
  square: number;
  built_year: number;
  ac_year: number;
  electric_year: number;
  plumbing_year: number;
  roof_year: number;
  roof_status: string;
  staticAddress: string;

  constructor(public  router: Router, public local: LocalStorageService, public commonService: CommonService) {
  }

  async ngOnInit() {
    let data = await this.commonService.getLocalItem('total_data');
    this.staticAddress = data['static_address'];
    console.log(data['zillow'])
    this.built_year = data['zillow']['built_year'].split(',').join('');
    this.square = data['zillow']['square'].split(',').join('');
    this.loadValue();
  }

  ngAfterViewInit(): void {
    // setInterval(() => this.goToFourStep(true), 1000)
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem('total_data');
    data['construction_type'] == undefined ? this.constructionType : this.constructionType = data['construction_type'];
    data['foundation_type'] == undefined ? this.foundationType : this.foundationType = data['foundation_type'];
    data['square'] == undefined ? this.square = data['zillow']['square'].split(',').join('') : this.square = data['square'];
    data['built_year'] == undefined ? this.built_year = data['zillow']['built_year'].split(',').join('') : this.built_year = data['built_year'];
    data['is_basement'] == undefined ? this.isBasement : this.isBasement = data['is_basement'];
    data['ac_year'] == undefined ? this.ac_year : this.ac_year = data['ac_year'];
    data['building_type'] == undefined ? this.buildingType : this.buildingType = data['building_type'];
    data['electric_year'] == undefined ? this.electric_year : this.electric_year = data['electric_year'];
    data['plumbing_year'] == undefined ? this.plumbing_year : this.plumbing_year = data['plumbing_year'];
    data['roof_status'] == undefined ? this.roof_status : this.roof_status = data['roof_status'];
    data['roof_year'] == undefined ? this.roof_year : this.roof_year = data['roof_year'];
  }

  validateAllInputs(rtCheck) {
    if (this.built_year == undefined) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct built year.');
      return false;
    }
    if (!(this.square > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct square footage.');
      return false;
    }
    if (!(this.constructionType > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct construction type.');
      return false;
    }
    if (!(this.foundationType > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct foundation type.');
      return false;
    }
    if (this.isBasement == undefined) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct basement.');
      return false;
    }
    if (this.roof_status == undefined) {
      this.commonService.modalOpen('Error', 'Please select the roof status.');
      return false;
    }
    if (!(this.ac_year > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct A/C year.');
      return false;
    }
    if (!(this.electric_year > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct electric year.');
      return false;
    }
    if (!(this.plumbing_year > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct plumbing year.');
      return false;
    }
    if (!(this.roof_year > 0)) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please type the correct roof year.');
      return false;
    }
    if (this.buildingType == undefined) {
      if (!rtCheck) this.commonService.modalOpen('Error', 'Please select the building type.');
      return false;
    }
    return true;
  }

  async goToFourStep(rtCheck = false) {
    if (this.validateAllInputs(rtCheck)) {
      let data = await this.commonService.getLocalItem('total_data');
      data['construction_type'] = this.constructionType;
      data['foundation_type'] = this.foundationType;
      data['square'] = this.square;
      data['built_year'] = this.built_year;
      data['is_basement'] = this.isBasement;
      data['building_type'] = this.buildingType;
      data['roof_status'] = this.roof_status;
      data['ac_year'] = this.ac_year;
      data['electric_year'] = this.electric_year;
      data['plumbing_year'] = this.plumbing_year;
      data['roof_year'] = this.roof_year;
      await this.commonService.setLocalItem('total_data', data);
      this.router.navigate(['/roof']);
    }
  }
}

/*comment*/
