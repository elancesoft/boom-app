import { AfterViewInit, Component, HostListener, ViewChild } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Location } from "@angular/common";

import { filter } from "rxjs/operators";
import { slideInAnimation } from "./route-animation";
import { CommonService } from "./services/common.service";
import { LocalStorageService } from "angular-web-storage";
import * as $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [slideInAnimation]
})
export class AppComponent implements AfterViewInit {
  title = "app";
  isProcessing = true;
  private _previousUrl: string;
  private _currentUrl: string;
  private _routeHistory: string[];
  isShowFooter = false;
  public navColor: string;
  public isShowHeader = true;
  headerFooter: boolean;

  public constructor(public router: Router, public location: Location, public commonService: CommonService, private local: LocalStorageService) {
    this._routeHistory = [];

    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event) => {
      this.isShowFooter = false;
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      switch (event["url"]) {
        case "/":
          this.fitUI(1000);
          break;
        case "/step1":
          this.fitUI(1000);
          break;
        case "/step2":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/demo":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step3":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/roof":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/exterior":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step4":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step5":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step6":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step7":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step8":
          this.fitUI(1000);
          this.isShowHeader = false;
          break;
        case "/step9":
          (<HTMLElement>document.getElementsByClassName("red").item(0)).style.cssText = "background-color:#0644f4 !important;";
          this.isShowHeader = false;
          this.fitUI(1000);
          break;
      }
      this.applyHeaderColor();
      window.scrollTo(0, 0);
    });
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this._setURLs(event);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.headerFooter = event.url !== "/step3";
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.applyHeaderColor();
  }

  @HostListener("window:scroll")
  onScroll() {
    this.applyHeaderColor();
  }
  applyHeaderColor() {
    const navbar = <HTMLElement>document.querySelector("nav");
    const isHeaderCollapse = navbar && navbar.classList.contains("top-nav-collapse");
    let marginToNav,
      togglerColor = "255, 255, 255, 1";
   /*  if (isHeaderCollapse || (this.router.url !== "/" && this.router.url !== "/index")) {
      (<HTMLElement>document.getElementsByClassName("navbar").item(0)).style.cssText = "box-shadow:none";
      this.navColor = "black";
      togglerColor = "0, 0, 0, 1";
      navbar.style.backgroundColor = "white";
      this.navColor = "#ed1c24";
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.backgroundColor = "transparent";
      this.navColor = "black";
      togglerColor = "255, 255, 255, 1";
    }

    if (!(this.router.url === "/" || this.router.url === "/index")) {
      togglerColor = "0,0,0, 1";
      marginToNav = "60px";
      navbar.style.backgroundColor = "white";
      this.navColor = "black";
    } else {
      marginToNav = "0px";
    }
    togglerColor = "244, 60, 88";
    this.navColor = "244, 60, 88";
    // (<HTMLElement>document.getElementsByClassName("navbar-toggler-icon")[0]).style.cssText =
    //   'background-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">' + '<path stroke="rgba(' + togglerColor + ')" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" ' + 'd="M4 7h22M4 15h22M4 23h22"/></svg>\') !important;';

    setTimeout(() => {
      const activedLink = <HTMLElement>document.querySelector(".nav-item.active > a");
      // if (activedLink) activedLink.style.borderBottom = "solid 2px " + this.navColor;
    }, 500);*/
  }

  ngAfterViewInit(): void {
    this.applyHeaderColor();
    window.scrollTo(0, 0);
  }

  fitUI(time) {
    setTimeout(() => {
      this.isShowFooter = true;
    }, time);
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

  moveTab(isForward: boolean) {
    console.log(isForward);
    this.commonService.sendClickEvent(isForward);
  }
}
