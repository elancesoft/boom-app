import {AfterViewInit, Component, ElementRef, HostListener, Inject, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from 'angular-web-storage';
import {DOCUMENT} from "@angular/common";
import {CommonService} from "../services/common.service";
import {ApiService} from "../services/api-service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {

  selectedMode: number;
  mode: number;
  isMobileMode: boolean = this.commonService.isMobileMode();
  topQuoteHeight: number;
  isMobileVideoDisplay: boolean = false;
  homeSlider = { items:1, dots: true, nav: true,};
  constructor(
    private router: Router, public local: LocalStorageService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, private hostElement: ElementRef,
    private commonService: CommonService,
    public apiService: ApiService
  ) {
  }

  @HostListener('window:resize', ['$event'])

  onResize() {

    this.isMobileMode = this.commonService.isMobileMode();

    if (this.router.url == '/' || this.router.url == '/index') {
      this.loadVideo();
      if (window.innerHeight > 750) this.topQuoteHeight = window.innerHeight - 250;
      else this.topQuoteHeight = window.innerHeight - 100;
      if (window.innerWidth > 768) this.topQuoteHeight = window.innerHeight - 100;

      let navContainer = document.querySelectorAll('nav > .container').item(0);
      if (navContainer) {
        (<HTMLElement>navContainer).classList.remove('container');
        (<HTMLElement>navContainer).classList.add('container-fluid');
      }
      navContainer = document.querySelectorAll('nav > .container-fluid').item(0);

      if (!this.isMobileMode) {
        (<HTMLElement>navContainer).classList.add('pl-5');
        (<HTMLElement>navContainer).classList.add('pr-5');
      } else {
        (<HTMLElement>navContainer).classList.remove('pl-5');
        (<HTMLElement>navContainer).classList.remove('pr-5');
      }
      if (window.innerWidth < 400) {
        document.getElementById('quoteButton').style.cssText = 'margin-top:0px !important';
      }

    }
  }

  ngAfterViewInit() {

    this.isMobileVideoDisplay = this.isMobileMode;
    this.playVideoDependsOnFlag(this.isMobileVideoDisplay);
    this.onResize();
  };

  playVideoDependsOnFlag(mobileMode: Boolean) {

    const desktopVideo = '../../assets/videos/desktop.mp4',
      mobileVideo = '../../assets/videos/mobile.mp4',
      mp4 = document.getElementById('mp4');
    mp4.setAttribute('src', mobileMode ? mobileVideo : desktopVideo);
    this.playVideo();
  }

  loadVideo() {

    if (this.isMobileMode) {
      if (!this.isMobileVideoDisplay) {
        this.isMobileVideoDisplay = true;
        this.playVideoDependsOnFlag(true);
      }
    } else if (this.isMobileVideoDisplay) {
      this.playVideoDependsOnFlag(false);
      this.isMobileVideoDisplay = false;
    }
  }

  playVideo() {

    const video = document.getElementById('video');
    (<HTMLVideoElement>video).load();
    (<HTMLVideoElement>video).muted = true;
    (<HTMLVideoElement>video).play();
  }

  async selectMode(mode) {

    await this.commonService.removeLocalItem('total_data');
    this.mode = mode;
    await this.commonService.setLocalItem('total_data',
      {mode: this.mode}
    );
    this.router.navigate(['/step1']);

  }
}
