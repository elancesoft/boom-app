import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "ngx-useful-swiper";
import { addressData } from "../home/models";
import { Router } from "@angular/router";
import { ApiService } from "../api-service";
import { CommonService } from "../services/common.service";
import { MapsAPILoader } from "@agm/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalStorageService } from "angular-web-storage";
import { NgbdModalContent } from "../home/ngbd.modal.content";
import CacheManager from "../utils/CacheManager";
import DemoManager from "../utils/DemoManager";

declare var google;

@Component({
  selector: "app-step-one",
  templateUrl: "./step-one.component.html",
  styleUrls: ["./step-one.component.scss"]
})
export class StepOneComponent implements AfterViewInit {
  @ViewChild("placesRef", { static: false })
  public searchElementRef: ElementRef;
  @ViewChild("usefulSwiper", { static: false })
  public usefulSwiper: SwiperComponent;

  window: any = window;
  demoManager: any = new DemoManager();
  cacheMode: boolean = false;

  addressData: addressData = {
    address: "",
    street_number: "",
    route: "",
    locality: "",
    administrative_area_level_1: "",
    country: "",
    postal_code: ""
  };
  GooglePlace: boolean = true;
  staticAddress: string = "";
  isMobile: boolean;
  lat: string;
  lng: string;
  showLoader: boolean;
  loaderType: string = "slow";
  plymouth: object;
  universal: object;
  stillwater: object;
  isDisplay: boolean = false;
  isFinished: boolean = false;
  isProcessing: boolean = false;
  progress: number = 0;
  showGoogleMap: boolean = false;
  showGoogleApiLogo: boolean = false;
  showAwsLogo: boolean = false;
  showSecondGoogleApiLogo: boolean = false;
  showSecondAwsLogo: boolean = false;
  showZillowLogo: boolean = false;
  showZillowYear: boolean = false;
  showZillowEst: boolean = false;
  showZillowSqft: boolean = false;
  showMet: boolean = false;
  showProgressive: boolean = false;
  showTraveler: boolean = false;
  showNationwide: boolean = false;
  showPlymouth: boolean = false;
  showStateAuto: boolean = false;
  showUniversal: boolean = false;
  showCompleted: boolean = false;
  zillowData: object = {};
  showZillowPane: boolean = false;
  totalProgress: number = 0;
  selectedMode: number = 0;
  coverage: number = 25000;
  zillowParams: object = {};
  isMobileVideoDisplay: boolean = false;
  isMobileMode: boolean = this.commonService.isMobileMode();
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        this.usefulSwiper.swiper.allowSlideNext = false;
        if (this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = false;
          this.processDemoQuote();
        }
      }
    }
  };
  config1: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        this.usefulSwiper.swiper.allowSlideNext = false;
        if (this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = false;
          this.gotToStepTwo();
        }
      }
    }
  };

  constructor(
    private router: Router,
    public apiService: ApiService,
    private ngZone: NgZone,
    public commonService: CommonService,
    private mapsAPILoader: MapsAPILoader,
    private modalService: NgbModal,
    public local: LocalStorageService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  @HostListener('window:resize', ['$event'])

  onResize() {

    this.isMobileMode = this.commonService.isMobileMode();
    // this.loadVideo();
  }

  ngAfterViewInit(): void {
    // this.loadVideo();
    this.loadGooglePlace();
    this.clearValues();
  }


  // playVideoDependsOnFlag(mobileMode: Boolean) {
  //   const desktopVideo = '../../assets/videos/desktop.mp4',
  //     mobileVideo = '../../assets/videos/mobile.mp4',
  //     mp4 = document.getElementById('mp4');
  //   mp4.setAttribute('src', mobileMode ? mobileVideo : desktopVideo);
  //   this.playVideo();
  // }

  // loadVideo() {

  //   if (this.isMobileMode) {
  //     if (!this.isMobileVideoDisplay) {
  //       this.isMobileVideoDisplay = true;
  //       // this.playVideoDependsOnFlag(true);
  //     }
  //   } else if (this.isMobileVideoDisplay) {
  //     // this.playVideoDependsOnFlag(false);
  //     this.isMobileVideoDisplay = false;
  //   } else {
  //     // this.playVideoDependsOnFlag(false);
  //     this.isMobileVideoDisplay = false;
  //   }
  // }

  // playVideo() {

  //   const video = document.getElementById('video');
  //   (<HTMLVideoElement>video).load();
  //   (<HTMLVideoElement>video).muted = true;
  //   (<HTMLVideoElement>video).play();
  // }

  Modalopen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;
  }

  async loadGooglePlace() {
    let total_data = await this.commonService.getLocalItem("total_data");
    total_data ? "" : (total_data = {});
    this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(
            this.searchElementRef.nativeElement,
            {
              types: ["address"],
              componentRestrictions: { country: "USA" }
            }
          );

          autocomplete.addListener("place_changed", async () => {
            this.ngZone.run(async () => {
              let address = autocomplete.getPlace();
              total_data["address_components"] = address;
              await this.commonService.setLocalItem("total_data", total_data);
              this.handleAddressChange(address);
            });
          });
        });
      }
    });

    document.getElementById("inputAddressMD").focus();
  }

  async clearValues() {
    this.local.remove('total_data');
  }

  handleAddressChange(googlePlaceData) {
    this.lat = typeof (googlePlaceData.geometry.location.lat) === "function" ? googlePlaceData.geometry.location.lat() : googlePlaceData.geometry.location.lat;
    this.lng = typeof (googlePlaceData.geometry.location.lng) === "function" ? googlePlaceData.geometry.location.lng() : googlePlaceData.geometry.location.lng;
    console.log(this.lng, 'lng');
    console.log(this.lat, 'lat');
    const googlePlaceDataCache = { ...googlePlaceData };
    googlePlaceDataCache.geometry.location.lat = () => this.lat;
    googlePlaceDataCache.geometry.location.lng = () => this.lng;

    CacheManager.setValue("googlePlaceData", googlePlaceDataCache);

    let addressData = googlePlaceData.address_components;
    let street_number = "",
      route,
      address,
      locality,
      administrative_area_level_1,
      country,
      postal_code;

    try {
      street_number = addressData.filter(elem => {
        return elem["types"][0] == "street_number";
      });
      street_number = street_number ? street_number[0]["short_name"] : "";

      route = addressData.filter(elem => {
        return elem["types"][0] == "route";
      });
      route = route ? route[0]["long_name"] : "";

      address = street_number + " " + route;

      locality = addressData.filter(elem => {
        return elem["types"][0] == "locality";
      });
      locality = locality ? locality[0]["long_name"] : "";

      administrative_area_level_1 = addressData.filter(elem => {
        return elem["types"][0] == "administrative_area_level_1";
      });
      administrative_area_level_1 = administrative_area_level_1
        ? administrative_area_level_1[0]["short_name"]
        : "";

      country = addressData.filter(elem => {
        return elem["types"][0] == "country";
      });

      country = country ? [0]["short_name"] : "";

      postal_code = addressData.filter(elem => {
        return elem["types"][0] == "postal_code";
      });
      postal_code = postal_code ? postal_code[0]["short_name"] : "";

      this.addressData["street_number"] = street_number;
      this.addressData["route"] = route;
      this.addressData["address"] = address;
      this.addressData["locality"] = locality;
      this.addressData[
        "administrative_area_level_1"
      ] = administrative_area_level_1;
      this.addressData["country"] = country;
      this.addressData["postal_code"] = postal_code;
      this.isDisplay = true;
      this.zillowParams = {
        address: address,
        citystatezip:
          locality + ", " + administrative_area_level_1 + ", " + postal_code
      };

      console.log("this.addressData", this.addressData);
    } catch (e) {
      this.Modalopen("Error", "Please enter the correct address type.");
    }
  }

  handleAddressChangeWithCache() {
    this.cacheMode = true;
    this.handleAddressChange(CacheManager.getValue("googlePlaceData"));
  }

  async getZillowData(data) {
    return new Promise((resolve, reject) => {
      this.apiService.getZillow(data).subscribe(
        res => {
          if (res["message"]["code"] == 508) {
            this.Modalopen(
              "Error",
              "Exact address not found, please enter manually."
            );
            this.GooglePlace = false;
            reject({
              result: "error",
              code: 508,
              message: "Exact address not found, please enter manually."
            });
            return;
          } else if (res["result"] == "error") {
            reject({
              result: "error",
              code: 400,
              message: "An error occurred. Please try again later."
            });
            return;
          }
          if (res["message"]["code"] != 0) {
            this.GooglePlace = false;
            reject({
              result: "error",
              code: 400,
              message: "An error occurred. Please try again later."
            });
          } else {
            this.zillowData["value"] = res.response.results.result[0];
            const estimate =
              this.zillowData["value"].zestimate[0].amount[0]._ * 1;
            this.zillowData["square"] = this.commonService.commafy(
              this.zillowData["value"].finishedSqFt[0] * 1
            );
            this.zillowData["built_year"] = this.zillowData[
              "value"
            ].yearBuilt[0];
            this.zillowData["estimate"] =
              estimate != NaN ? this.commonService.commafy(estimate) : 0;
            resolve({
              result: "success",
              code: 200,
              message: "Successfully completed."
            });
          }
          this.getPricingDataForMobile();

        },
        err => {
          reject({
            result: "error",
            code: 400,
            message: "An error occurred. Please try again later."
          });
        }
      );
    });
  }

  async processZillowData(zillowData) {
    let total_data = await this.commonService.getLocalItem("total_data");
    if (this.GooglePlace) {
      let addressData = {
        address: this.addressData["address"],
        administrative_area_level_1: this.addressData[
          "administrative_area_level_1"
        ],
        country: this.addressData["country"],
        locality: this.addressData["locality"],
        postal_code: this.addressData["postal_code"],
        route: this.addressData["route"],
        street_number: this.addressData["street_number"]
      };

      total_data["static_address"] =
        (addressData["address"] ? addressData["address"] + ", " : "") +
        (addressData["locality"] ? addressData["locality"] + ", " : "") +
        (addressData["administrative_area_level_1"]
          ? addressData["administrative_area_level_1"]
          : "") +
        (addressData["country"] ? ", " + addressData["country"] : "");
      total_data["addressData"] = addressData;
    } else {
      total_data["static_address"] = this.staticAddress;
    }
    total_data["zillow"] = this.zillowData;
    console.log(this.zillowData, 'zillowData')
    total_data["isGooglePlace"] = this.GooglePlace;
    await this.commonService.setLocalItem("total_data", total_data);
    this.isProcessing = true;
    this.process();
  }

  async processDemoQuote() {
    if (this.cacheMode) {
      this.processDemoQuoteWithCache();
    } else {
      const zillowData = await this.getZillowData(this.zillowParams);
      CacheManager.setValue('zillowData', this.zillowData);
      this.processZillowData(zillowData);
    }
  }

  async processDemoQuoteWithCache() {
    const zillowData = CacheManager.getValue('zillowData');
    this.zillowData = zillowData;
    this.processZillowData(zillowData);
  }

  async process() {
    const n = setInterval(() => {
      if (this.totalProgress < 101) {
        this.totalProgress++;
        return;
      }
      clearInterval(n);
    }, 17); // used to be 170
    const sleep = m => new Promise(r => setTimeout(r, m));

    this.initSequences(1);
    this.showGoogleMap = true;
    await sleep(100);
    this.initSequences(1);
    this.showGoogleApiLogo = true;
    await sleep(100);
    this.initSequences(1);
    this.showAwsLogo = true;
    await sleep(100);
    this.initSequences(1);
    this.showZillowLogo = true;
    await sleep(150);
    this.initSequences(25);
    this.showZillowPane = true;
    await sleep(100);
    this.showZillowSqft = true;
    await sleep(100);
    this.showZillowYear = true;
    await sleep(100);
    this.showZillowEst = true;
    await sleep(100);
    this.initSequences(1);
    this.showSecondGoogleApiLogo = true;
    await sleep(100);
    this.initSequences(1);
    this.showSecondAwsLogo = true;
    await sleep(100);
    this.initSequences(1);
    this.showNationwide = true;
    await sleep(100);
    this.initSequences(1);
    this.showProgressive = true;
    await sleep(100);
    this.initSequences(1);
    this.showMet = true;
    await sleep(100);
    this.initSequences(1);
    this.showTraveler = true;
    await sleep(100);
    this.initSequences(1);
    this.showPlymouth = true;
    await sleep(100);
    this.initSequences(1);
    this.showStateAuto = true;
    await sleep(100);
    this.initSequences(1);
    this.showUniversal = true;
    await sleep(100);
    this.initSequences(1);
    this.gotToStepTwo();
  }

  initSequences(duration) {
    this.progress = 0;
    const n = setInterval(() => {
      if (this.progress < 101) {
        this.progress++;
      } else {
        clearInterval(n);
      }
    }, duration);
    this.showGoogleMap = false;
    this.showGoogleApiLogo = false;
    this.showAwsLogo = false;
    this.showZillowLogo = false;
    this.showZillowPane = false;
    this.showSecondGoogleApiLogo = false;
    this.showSecondAwsLogo = false;
    this.showNationwide = false;
    this.showProgressive = false;
    this.showMet = false;
    this.showTraveler = false;
    this.showPlymouth = false;
    this.showStateAuto = false;
    this.showUniversal = false;
    this.showCompleted = false;
  }

  async getPricingDataForMobile() {
    const currentYear = new Date().getFullYear();
    let electric_year, plumbing_year, roof_year;
    let city = this.addressData["locality"],
      state = this.addressData["administrative_area_level_1"],
      postal_code = this.addressData["postal_code"],
      street = this.addressData["address"],
      year_built = this.zillowData["built_year"],
      sqft = this.zillowData["square"].replace(",", ""),
      mode = this.selectedMode,
      ac_year = (electric_year = plumbing_year = roof_year = currentYear),
      construction_type = 1,
      roof_type = 1,
      foundation_type = 1,
      dwell_coverage = this.coverage,
      building_type = 1,
      roof_status = "peaked",
      is_basement = 1,
      is_demo = true;

    const demoRequestParams = {
      city,
      state,
      postal_code,
      street,
      year_built,
      sqft,
      mode,
      ac_year,
      electric_year,
      plumbing_year,
      roof_year,
      construction_type,
      roof_type,
      dwell_coverage,
      building_type,
      roof_status,
      is_basement,
      foundation_type,
      is_demo
    };

    const params = {
      is_security: true,
      is_smart: true,
      is_bundle: true
    };
    /*Homeowners API requests*/

    Object.assign(demoRequestParams, params);
    this.makeCondoRequests(demoRequestParams);
    this.makeHomeownersRequests(demoRequestParams);
    /*Condo API requests*/

    this.isFinished = true;
  }

  async makeHomeownersRequests(demoRequestParams) {
    let demo_homeowner_data = {};
    demoRequestParams['mode'] = 0;
    let universal = await this.apiService
      .getUniversalData(demoRequestParams)
      .toPromise();
    universal.result === "success"
      ? (this.universal = universal.data)
      : (this.universal = {});
    let total_data = this.local.get("total_data");
    Object.assign(demo_homeowner_data, { universal: this.universal });
    Object.assign(total_data, { demo_homeowner_data });
    this.local.set("total_data", total_data);
    let stillwater = await this.apiService
      .getStillwaterData(demoRequestParams)
      .toPromise();
    stillwater.result === "success"
      ? (this.stillwater = stillwater.data)
      : (this.stillwater = {});
    total_data = this.local.get("total_data");
    Object.assign(demo_homeowner_data, { stillwater: this.stillwater });
    Object.assign(total_data, { demo_homeowner_data });
    this.local.set("total_data", total_data);
    let plymouth = await this.apiService
      .getPlymouthData(demoRequestParams)
      .toPromise();
    plymouth.result === "success"
      ? (this.plymouth = plymouth.data)
      : (this.plymouth = {});
    total_data = this.local.get("total_data")
    Object.assign(demo_homeowner_data, { plymouth: this.plymouth });
    Object.assign(total_data, { demo_homeowner_data });
    this.local.set("total_data", total_data);
  }

  async makeCondoRequests(demoRequestParams) {

    let demo_condo_data = {};
    demoRequestParams['mode'] = 1;

    let universal = await this.apiService
      .getUniversalData(demoRequestParams)
      .toPromise();
    universal.result === "success"
      ? (this.universal = universal.data)
      : (this.universal = {});
    let total_data = this.local.get("total_data");
    Object.assign(demo_condo_data, { universal: this.universal });
    Object.assign(total_data, { demo_condo_data });
    this.local.set("total_data", total_data);

    let stillwater = await this.apiService
      .getStillwaterData(demoRequestParams)
      .toPromise();
    stillwater.result === "success"
      ? (this.stillwater = stillwater.data)
      : (this.stillwater = {});
    total_data = this.local.get("total_data");
    Object.assign(demo_condo_data, { stillwater: this.stillwater });
    Object.assign(total_data, { demo_condo_data });
    this.local.set("total_data", total_data);
    let plymouth = await this.apiService
      .getPlymouthData(demoRequestParams)
      .toPromise();
    plymouth.result === "success"
      ? (this.plymouth = plymouth.data)
      : (this.plymouth = {});
    total_data = this.local.get("total_data");
    Object.assign(demo_condo_data, { plymouth: this.plymouth });
    Object.assign(total_data, { demo_condo_data });
    this.local.set("total_data", total_data);
    console.log(demo_condo_data, 'This is the data of the API requests');
  }

  gotToStepTwo() {
    this.router.navigate(["/step2"]);
  }
}

/*comment*/
