import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-web-storage";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit {

  constructor(public  router: Router, public local: LocalStorageService, public commonService: CommonService) {
  }

  smoke_alarm: boolean = false;
  central_fire_alarm: boolean = false;
  deadbolt_locks: boolean = false;
  central_bulgar_alarm: boolean = false;
  bundle_discount: boolean = false;

  ngOnInit() {
    this.loadValue();
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem('total_data');
    data['smoke_alarm'] == undefined ? this.smoke_alarm : this.smoke_alarm = data['smoke_alarm'];
    data['central_fire_alarm'] == undefined ? this.central_fire_alarm : this.central_fire_alarm = data['central_fire_alarm'];
    data['deadbolt_locks'] == undefined ? this.deadbolt_locks : this.deadbolt_locks = data['deadbolt_locks'];
    data['central_bulgar_alarm'] == undefined ? this.central_bulgar_alarm : this.central_bulgar_alarm = data['central_bulgar_alarm'];
    data['bundle_discount'] == undefined ? this.bundle_discount : this.bundle_discount = data['bundle_discount'];
  }

  validateAllInputs() {
    return true;
  }

  async goToFiveStep() {
    if (this.validateAllInputs()) {
      let data = await this.commonService.getLocalItem('total_data');
      data['smoke_alarm'] = this.smoke_alarm;
      data['central_fire_alarm'] = this.central_fire_alarm;
      data['deadbolt_locks'] = this.deadbolt_locks;
      data['central_bulgar_alarm'] = this.central_bulgar_alarm;
      data['bundle_discount'] = this.bundle_discount;
      await this.commonService.setLocalItem('total_data', data);
      this.router.navigate(['/step5']);
    }
  }
}

/*comment*/
