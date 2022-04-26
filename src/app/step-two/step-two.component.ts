import { AfterContentInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ApiService } from "../services/api-service";
import { Router } from "@angular/router";
import { addressData } from "../home/models";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../services/common.service";
import { SwiperComponent } from "ngx-useful-swiper";
import { ModalDirective } from "ng-uikit-pro-standard";

@Component({
  selector: "app-step-two",
  templateUrl: "./step-two.component.html",
  styleUrls: ["./step-two.component.scss"],
})
export class StepTwoComponent implements AfterContentInit {
  @ViewChild("placesRef", { static: false }) public searchElementRef: ElementRef;
  @ViewChild("usefulSwiper", { static: false }) public usefulSwiper: SwiperComponent;
  @ViewChild("basicModal", { static: false }) public basicModal: ModalDirective;
  addressData: addressData[] = [];
  GooglePlace: boolean = true;
  staticAddress: string;
  showMap: boolean = false;
  coverage: number;
  zillowData: object = { value: "", square: "", built_year: "", estimate: "" };
  uniqueId: string;
  isMobile: boolean;
  isMobileForSlide: boolean;
  showErrorMessage: boolean = false;
  selectedMode: number = 0;
  lat: number;
  lng: number;
  showLoader: boolean;
  showDemoLoader: boolean = false;
  showStillwaterPrice: boolean = false;
  showUniversalPrice: boolean = false;
  showPlymouthPrice: boolean = false;
  showOtherComponents: boolean = false;
  demoEmailAddr: string = "";
  ccEmail: string = "";
  stillwater: number = 0;
  universal: number = 0;
  plymouth: number = 0;
  showEmailInput: boolean = false;
  lowest_price: number;
  medium_price: number;
  highest_price: number;
  total_data: object;
  sqft: string;
  builtYear: string;
  estimate: string;
  floodZone: string;
  floodCost: any;
  isAnnual: boolean = true;
  isPriceLoaded: boolean = true;
  isPriceDiv: boolean = false;
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        this.usefulSwiper.swiper.allowSlideNext = false;
        if (this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = false;
          this.goToThreeStep();
        }
      },
    },
  };

  mapData: object;

  constructor(private router: Router, public apiService: ApiService, public commonService: CommonService, public local: LocalStorageService) {}

  async ngOnInit() {
    setInterval(() => this.loadValues(), 1000);
    window.scrollTo(0, 0);
  }

  ngAfterContentInit() {
    setTimeout(() => (this.isPriceLoaded = false), 1000);
  }

  loadValues() {
    this.setInitValues();
    this.isPriceLoaded = true;
    this.isPriceDiv = true;
    this.getPricing(this.selectedMode);
  }

  setInitValues() {
    this.total_data = this.local.get("total_data");
    try {
      this.sqft = this.total_data["zillow"]["square"];
      this.builtYear = this.total_data["zillow"]["built_year"];
      this.estimate = this.total_data["zillow"]["estimate"];
    } catch (e) {
      this.sqft = "";
      this.builtYear = "";
      this.estimate = "";
    }
    try {
      this.floodZone = this.total_data["flood"]["data"]["zone"];
      this.floodCost = this.total_data["flood"]["data"]["premium"];
    } catch (e) {
      this.floodZone = "";
      this.floodCost = "";
    }
    try {
      this.staticAddress = this.total_data["address_components"]["formatted_address"];
    } catch (e) {
      this.staticAddress = "";
    }
  }

  getPricing(type) {
    const prices = this.commonService.getPricingForDemo(type);
    this.highest_price = prices["highest_price"];
    this.lowest_price = prices["lowest_price"];
    this.medium_price = prices["medium_price"];
  }

  sendDemoEmailFunc() {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.demoEmailAddr) {
      this.commonService.modalOpen("Warning", "Please type the email address.");
      return;
    }
    if (!pattern.test(this.demoEmailAddr)) {
      this.commonService.modalOpen("Warning", "Please type the correct email address");
      return;
    }
    if (this.ccEmail !== "" && !pattern.test(this.ccEmail)) {
      this.commonService.modalOpen("Warning", "Please type the correct cc email address");
      return;
    }

    const total_data = this.commonService.getLocalItem("total_data");
    let address = "";
    try {
      address = total_data["address_components"]["formatted_address"];
    } catch (e) {}
    let prices = [
      {
        index: 1,
        amount: this.commonService.commafy(this.lowest_price),
      },

      {
        index: 2,
        amount: this.commonService.commafy(this.medium_price),
      },

      {
        index: 3,
        amount: this.commonService.commafy(this.highest_price),
      },
    ];
    let data = { address: address, email: this.demoEmailAddr, cc_email: this.ccEmail, prices };
    this.apiService.sendDemoEmail(data).subscribe(
      (res) => {
        this.basicModal.hide();
        if (res["result"] == "success") {
          this.commonService.modalOpen("Success", "Successfully sent.");
        } else {
          this.commonService.modalOpen("Error", res["msg"]);
        }
      },
      (err) => {
        this.showLoader = false;
      }
    );
  }

  async goToThreeStep() {
    const total_data = this.local.get("total_data");
    total_data["mode"] = this.selectedMode;
    this.local.set("total_data", total_data);
    this.router.navigate(["/step3"]);
  }
}

/*comment*/
