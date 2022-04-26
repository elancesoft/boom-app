import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-exterior',
  templateUrl: './exterior.component.html',
  styleUrls: ['./exterior.component.scss']
})
export class ExteriorComponent implements OnInit {


  exteriorProp: string;
  exteriorType: number = -1;
  staticAddress: string;

  constructor(private router: Router, private local: LocalStorageService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.loadValue()
  }


  async loadValue() {
    let data = await this.commonService.getLocalItem('total_data');
    this.staticAddress = data['static_address'];
    data['exterior_prop'] == undefined ? this.exteriorProp : this.exteriorProp = data['exterior_prop'];
    data['exterior_type'] == undefined ? this.exteriorType : this.exteriorType = data['exterior_type'];
  }

  validateAllInputs() {
    if (this.exteriorType == -1) {
      this.commonService.modalOpen('Error', 'Please select the exterior type.');
      return false;
    }
    return true;
  }

  async goToExteriorStep(type) {
    type ? this.exteriorType = type : '';
    if (this.validateAllInputs()) {
      let data = await this.commonService.getLocalItem('total_data');
      data['exterior_prop'] = this.exteriorProp;
      data['exterior_type'] = this.exteriorType;
      await this.commonService.setLocalItem('total_data', data);
      this.router.navigate(['/step4']);
    }
  }
}
