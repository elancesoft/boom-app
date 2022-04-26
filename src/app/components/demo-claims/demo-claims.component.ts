import {Component, HostListener, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-demo-claims',
  templateUrl: './demo-claims.component.html',
  styleUrls: ['./demo-claims.component.scss']
})
export class DemoClaimsComponent implements OnInit {

  constructor(public commonService: CommonService) {
  }

  ngOnInit() {

  }
}
