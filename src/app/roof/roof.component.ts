import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-roof',
  templateUrl: './roof.component.html',
  styleUrls: ['./roof.component.scss']
})
export class RoofComponent implements OnInit {

  roof_status: string;
  roofType: number;

  constructor(private router: Router, private local: LocalStorageService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.loadValue();
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem('total_data');
    data['roof_type'] == undefined ? this.roofType : this.roofType = data['roof_type'];
  }

  validateAllInputs() {
    if (this.roofType == undefined) {
      this.commonService.modalOpen('Error', 'Please select the roof type.');
      return false;
    }
    return true;
  }

  async goToExteriorStep(type) {
    type ? this.roofType = type : '';
    if (this.validateAllInputs()) {
      let data = await this.commonService.getLocalItem('total_data');
      data['roof_type'] = this.roofType;
      await this.commonService.setLocalItem('total_data', data);
      this.router.navigate(['/exterior']);
    }
  }
}
