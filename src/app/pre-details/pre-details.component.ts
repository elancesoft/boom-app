import {Component, OnInit, Input, Output, AfterViewInit} from '@angular/core';
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-pre-details',
  templateUrl: './pre-details.component.html',
  styleUrls: ['./pre-details.component.scss']
})
export class PreDetailsComponent implements OnInit, AfterViewInit {
  @Input('lat') lat: string;
  @Input('lng') lng: string;
  @Input('zillowData') zillowData: object;
  @Input('showLoader') showLoader: boolean;
  @Input('address') address: object;

  constructor(public commonService: CommonService) {
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
}
