import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';
import { filter } from "rxjs/operators";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { addressData } from "../home/models";
import { CommonService } from "../services/common.service";
import {of} from "rxjs";

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements AfterViewInit {

  progress: number;
  progressTop: number;
  isProcessing: boolean;
  isProcessing2: boolean;
  isDetailsPolicyProcessing: boolean;
  isBTNProcessing: boolean;
  mapData: object;
  address: addressData[] = [];
  zillowData: object = [];
  isFinish: boolean;
  private _previousUrl: string;
  private _currentUrl: string;
  private _routeHistory: string[];

  constructor(private router: Router, private local: LocalStorageService, public commonService: CommonService,
    public elementRef: ElementRef) {
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {

    this.progressTop = document.getElementsByTagName('nav')[0].offsetHeight;
  }

  async ngAfterViewInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(async (event) => {
      const total_data = await this.commonService.getLocalItem('total_data');
      try {
        const address_components = total_data.address_components;
        this.mapData = address_components.geometry.location;

      } catch (e) {
      }

      if (total_data) {
        this.address = total_data['addressData'];
        this.zillowData = total_data['zillow'];
      }

      switch (event['url']) {
        case '/index':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = false;
          this.isFinish = false;
          break;
        case '/demo':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = false;
          this.isFinish = false;
          break;
        case '/':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = false;
          this.isFinish = false;
          break;
        case '/step2':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = true;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/step3':
          this.progress = 20;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/roof':
          this.progress = 40;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/exterior':
          this.progress = 40;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/step4':
          this.progress = 60;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/step5':
          this.progress = 80;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isFinish = false;
          break;
        case '/step6':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/step7':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = false;
          this.isFinish = false;
          break;
        case '/step8':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = false;
          this.isFinish = false;
          break;
        case '/step9':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = false;
          this.isFinish = true;
          break;
        case '/preparing-policy':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/policy-start-date':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/policy-have-mortgage':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/policy-mortgage-info':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/policy-chat':
          this.progress = 100;
          this.isProcessing = true;
          this.isProcessing2 = false;
          this.isDetailsPolicyProcessing = true;
          this.isBTNProcessing = true;
          this.isFinish = false;
          break;
        case '/haven-inputs':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = false;
          this.isFinish = false;
          break;
        case '/haven-result':
          this.progress = 0;
          this.isProcessing = false;
          this.isProcessing2 = false;
          this.isFinish = false;
          break;
      }
    });

    this.progressTop = document.getElementsByTagName('nav')[0].offsetHeight;
  }

  private _setURLs(event: NavigationEnd): void {

    this._previousUrl = this._currentUrl;
    this._currentUrl = event.urlAfterRedirects;
    this._routeHistory.push(event.urlAfterRedirects);
  }

  get previousUrl(): string {
    return this._previousUrl;
  }

  get currentUrl(): string {
    return this._currentUrl;
  }

  get routeHistory(): string[] {
    return this._routeHistory;
  }
}
