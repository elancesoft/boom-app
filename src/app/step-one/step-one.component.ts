import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "ngx-useful-swiper";
import { addressData } from "../home/models";
import { Router } from "@angular/router";
import { ApiService } from "../services/api-service";
import { CommonService } from "../services/common.service";
import { MapsAPILoader } from "@agm/core";
import { LocalStorageService } from "angular-web-storage";
import { DatePickerComponent, FocusEventArgs } from "@syncfusion/ej2-angular-calendars";
import CacheManager from "../utils/CacheManager";
import * as $ from "jquery";
import { OwlCarousel } from "ngx-owl-carousel";
import * as moment from "moment";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { retry } from "rxjs/operators";

declare var google;

@Component({
  selector: "app-step-one",
  templateUrl: "./step-one.component.html",
  styleUrls: ["./step-one.component.scss"],
})
export class StepOneComponent implements AfterViewInit {
  @ViewChild("default", { static: false })
  // public datepickerObj: CalendarComponent;
  public datepickerObj: DatePickerComponent;

  onFocus(args: FocusEventArgs): void {
    this.datepickerObj.show();
  }

  @ViewChild("OwlElement", { static: false }) OwlElement: OwlCarousel;
  @ViewChild("OwlElement2", { static: false }) OwlElement2: OwlCarousel;

  @ViewChild("placesRef", { static: false })
  public searchElementRef: ElementRef;
  @ViewChild("usefulSwiper", { static: false })
  public usefulSwiper: SwiperComponent;
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        if (!!this.usefulSwiper && !!this.usefulSwiper.swiper && this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = true;
          // this.next.emit();
          this.processDemoQuote();
        }
      },
    },
  };
  window: any = window;
  cacheMode: boolean = false;
  progressBar1Complete: boolean = false;

  addressData: addressData = {
    address: "",
    street_number: "",
    route: "",
    locality: "",
    administrative_area_level_1: "",
    country: "",
    postal_code: "",
  };
  GooglePlace: boolean = true;
  fullAddressText: string = "";
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
  showStillWater: boolean = false;
  showNeptune: boolean = false;
  show2ndGoogleMap: boolean = false;
  show2ndGoogleApiLogo: boolean = false;
  show2ndAwsLogo: boolean = false;
  showZ2ndillowLogo: boolean = false;
  show2ndMet: boolean = false;
  show2ndProgressive: boolean = false;
  show2ndTraveler: boolean = false;
  show2ndNationwide: boolean = false;
  show2ndPlymouth: boolean = false;
  show2ndStateAuto: boolean = false;
  show2ndUniversal: boolean = false;
  show2ndStillWater: boolean = false;
  show2ndNeptune: boolean = false;
  showCompleted: boolean = false;
  zillowData: object = {};
  showZillowPane: boolean = false;
  show2ndZillowPane: boolean = false;
  showZillowOuterContainer: boolean = false;
  totalProgress: number = 0;
  selectedMode: number = 0;
  coverage: number = 25000;
  zillowParams: object = {};
  isMobileVideoDisplay: boolean = false;
  isMobileMode: boolean = this.commonService.isMobileMode();
  showFirst: boolean = false;
  square = "";
  builtyear = "";
  estimate = "";
  homeSlider: object = {};
  homeSlider2: object = {};
  selectedDate: Date;
  public format: string = "dd/MM/yyyy "; // common format as a model value.
  isDatepickerDisabled: boolean = true;
  minDate = new Date();
  maxDate = moment().add(2, "months").format("YYYY-MM-DD");
  insuranceImgs = [
    {
      caroImages: ["../../assets/images/caro-slider-images/Universal_Good.png", "../../assets/images/caro-slider-images/Universal_Better.png", "../../assets/images/caro-slider-images/Universal_Best.png"],
    },
    {
      caroImages: ["../../assets/images/caro-slider-images/Nationwide_Good.png", "../../assets/images/caro-slider-images/Nationwide_Better.png", "../../assets/images/caro-slider-images/Nationwide_Best.png"],
    },
    {
      caroImages: ["../../assets/images/caro-slider-images/Travelers_Good.png", "../../assets/images/caro-slider-images/Travelers_Better.png", "../../assets/images/caro-slider-images/Travelers_Best.png"],
    },
    {
      caroImages: ["../../assets/images/caro-slider-images/PlymouthRock_Good.png", "../../assets/images/caro-slider-images/PlymouthRock_Better.png", "../../assets/images/caro-slider-images/PlymouthRock_Best.png"],
    },
  ];

  insuranceImgsMobile = [
    {
      slideImg: "../../assets/images/SVG/nationwide-icon.png",
      caroImages: ["../../assets/images/caro-slider-images/Nationwide_Good.png", "../../assets/images/caro-slider-images/Nationwide_Better.png", "../../assets/images/caro-slider-images/Nationwide_Best.png"],
    },
    {
      slideImg: "../../assets/images/SVG/travelers-icon.png",
      caroImages: ["../../assets/images/caro-slider-images/Travelers_Good.png", "../../assets/images/caro-slider-images/Travelers_Better.png", "../../assets/images/caro-slider-images/Travelers_Best.png"],
    },
    {
      slideImg: "../../assets/images/SVG/universal-icon.png",
      caroImages: ["../../assets/images/caro-slider-images/Universal_Good.png", "../../assets/images/caro-slider-images/Universal_Better.png", "../../assets/images/caro-slider-images/Universal_Best.png"],
    },
    {
      slideImg: "../../assets/images/SVG/plymouth-rock-icon.png",
      caroImages: ["../../assets/images/caro-slider-images/PlymouthRock_Good.png", "../../assets/images/caro-slider-images/PlymouthRock_Better.png", "../../assets/images/caro-slider-images/PlymouthRock_Best.png"],
    },
    {
      slideImg: "../../assets/images/SVG/progressive-icon.png",
      caroImages: ["../../assets/images/caro-slider-images/Progressive_Good.png", "../../assets/images/caro-slider-images/Progressive_Better.png", "../../assets/images/caro-slider-images/Progressive_Best.png"],
    },
    {
      slideImg: "../../assets/images/companies/hippo.png",
      caroImages: ["../../assets/images/caro-slider-images/Hippo_Good.png", "../../assets/images/caro-slider-images/Hippo_Better.png", "../../assets/images/caro-slider-images/Hippo_Best.png"],
    },
    {
      slideImg: "../../assets/images/companies/stillwater.png",
      caroImages: ["../../assets/images/caro-slider-images/Stillwater_Good.png", "../../assets/images/caro-slider-images/Stillwater_Better.png", "../../assets/images/caro-slider-images/Stillwater_Best.png"],
    },
  ];
  mobileCarouselLabel = ["Basic", "Better", "Best"];
  addressToInsure = "what property do you need to insure?";

  basicInfo = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    dob: new FormControl("", [Validators.required]),
    termsAndConditions: new FormControl(""),
  });
  fcModalForm: any;

  @ViewChild("content", { static: false }) private content;
  constructor(private modalService: NgbModal, private router: Router, public apiService: ApiService, private ngZone: NgZone, public commonService: CommonService, private mapsAPILoader: MapsAPILoader, public local: LocalStorageService) {
    this.progress = 0;
    this.totalProgress = 0;
    this.isProcessing = false;
    this.homeSlider = { items: 1, dots: true, nav: false, autoplay: false, autoplayTimeout: 10000, loop: true };
    this.clickBegin();
    this.initOwlElement2();
  }
  ngAfterContentInit() {
    this.clickBegin();

    //   setTimeout(() => {
    //     let x=this.modalService.open(this.content);

    //     x.result.then(function () {
    //       alert('Modal success');
    //     }, function () {
    //       alert('Modal dismissed');
    //     });
    // }, 1000);
  }

  ngOnInit() {
    this.commonService.setLocalItem("toLastStep", false);
    localStorage.removeItem("tab");
    this.isMobileOrDesk();
    this.OwlElement.reInit();
    this.OwlElement2.reInit();
    window.scrollTo(0, 0);
  }
  onSubmitModalForm() {
    this.basicInfo.markAllAsTouched();
    if (this.basicInfo.valid) {
      console.log(`this.basicInfo.value`, this.basicInfo.value);
      this.local.set("fcUserBasic", this.basicInfo.value);
      this.fcModalForm.dismiss();
    }
  }

  isMobileOrDesk() {
    if (window.innerWidth < 768) {
      this.addressToInsure = "address to insure?";
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.addressToInsure = "address to insure?";
    }
    this.isMobileMode = this.commonService.isMobileMode();
  }

  ngAfterViewInit(): void {
    this.OwlElement.reInit();
    if (this.showFirst) {
      this.loadGooglePlace();
    }
    this.removeimg_wrap();
    this.commonService.clearValues();
  }

  initOwlElement2() {
    this.homeSlider2 = {
      items: 1,
      navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
      nav: true,
      autoplay: false,
      autoplayTimeout: 10000,
      loop: true,
      dots: true,
    };
  }

  removeimg_wrap() {
    if (document.getElementById("home-page-slider")) {
      let divs = document.getElementsByClassName("home_slide");
      for (let index = 0; index < divs.length; ++index) {
        if (divs[index].classList.contains("home-page-slider-load")) {
          divs[index].classList.remove("home-page-slider-load");
        }
      }
    }
  }

  async loadGooglePlace() {
    this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"],
            componentRestrictions: { country: "USA" },
          });
          autocomplete.addListener("place_changed", async () => {
            this.ngZone.run(async () => {
              let address = autocomplete.getPlace();


               this.local.set("searchedAddress", address);
               this.local.set("searchedAddressLat", address.geometry.location.lat());
               this.local.set("searchedAddressLng", address.geometry.location.lng());
              //this.commonService.applyTotalData("address_components", address);
              this.router.navigateByUrl("/initial-info-form");
              return;
              this.fcModalForm = this.modalService.open(this.content, {
                backdrop: "static",
                keyboard: false,
                windowClass: "custom-modal-content", // add a custom class here where you open the modal
              });
              let that = this;
              this.fcModalForm.result.then(
                function () {
                  //alert('Modal success');
                },
                function () {
                  // alert('Modal dismissed');
                  that.handleAddressChange(address);
                  console.clear();
                  console.log(address);
                }
              );
              this.handleAddressChange(address);
            });
          });
        });
      }
    });
    if (document.getElementById("inputAddressMD")) {
      document.getElementById("inputAddressMD").focus();
    }
  }

  handleAddressChange(googlePlaceData) {
    if (googlePlaceData) {
      // this.datepickerObj.show();
      // this.isDatepickerDisabled = false;
      this.isProcessing = true;
      this.selectedDate = new Date();
    }
    googlePlaceData.started_time = new Date();
    this.commonService.applyTotalData("address_components", googlePlaceData);
    this.lat = typeof googlePlaceData.geometry.location.lat === "function" ? googlePlaceData.geometry.location.lat() : googlePlaceData.geometry.location.lat;
    this.lng = typeof googlePlaceData.geometry.location.lng === "function" ? googlePlaceData.geometry.location.lng() : googlePlaceData.geometry.location.lng;
    const googlePlaceDataCache = { ...googlePlaceData };
    googlePlaceDataCache.geometry.location.lat = () => this.lat;
    googlePlaceDataCache.geometry.location.lng = () => this.lng;
    CacheManager.setValue("googlePlaceData", googlePlaceDataCache);
    try {
      this.fullAddressText = this.commonService.getLocalItem("total_data").address_components.formatted_address;
    } catch (e) {
      this.fullAddressText = "";
    }
    // this.isProcessing = true;
    try {
      const { address, locality, administrative_area_level_1, postal_code } = this.commonService.getAddressData();
      this.isDisplay = true;
      this.zillowParams = {
        address: address,
        citystatezip: locality + ", " + administrative_area_level_1 + ", " + postal_code,
      };

      this.processDemoQuote();
    } catch (e) {
      this.commonService.modalOpen("Error", "Please enter the correct address type.");
      this.isProcessing = false;
      this.showFirst = true;
      return;
    }
  }

  handleAddressChangeWithCache() {
    this.cacheMode = true;
    this.handleAddressChange(CacheManager.getValue("googlePlaceData"));
  }

  async getZillowData(data) {
    const address = {
      address: this.zillowParams,
    };
    this.apiService.sendSearchAddressEmail(address).subscribe((data) => {
      console.log("email", data);
    });
    return new Promise((resolve, reject) => {
      this.apiService.getZillow(data).subscribe(
        (res) => {
          console.log("API getZillow", res);
          if (!res.hasOwnProperty("price")) {
            this.isDisplay = false;
            this.commonService.modalOpen("Error", "Exact address not found, please enter manually.");

            this.isProcessing = false;
            this.showFirst = true;
            this.totalProgress = 0;
            /* this.square = "";
            this.builtyear = "";
            this.estimate = ""; */
            // this.GooglePlace = false;

            reject({
              result: "error",
              code: 508,
              message: "Exact address not found, please enter manually.",
            });
            this.clickBegin();
            return;
          } else if (res["result"] == "error") {
            this.isDisplay = false;
            reject({
              result: "error",
              code: 400,
              message: "An error occurred. Please try again later.",
            });
            return;
          }
          if (res.hasOwnProperty("price")) {
            const estimate = res.price;
            this.square = this.zillowData["square"] = res.building_size;
            this.builtyear = this.zillowData["built_year"] = res.year_built;
            this.estimate = this.zillowData["estimate"] = estimate != NaN ? this.commonService.commafy(estimate) : 0;
            resolve({
              result: "success",
              code: 200,
              message: "Successfully completed.",
            });
          }
        },
        (err) => {
          reject({
            result: "error",
            code: 400,
            message: "An error occurred. Please try again later.",
          });
        }
      );
    });
  }

  async processZillowData(zillowData) {
    //this.progress = 33;
    this.progressBar1Complete = true;
    this.commonService.applyTotalData("zillow", this.zillowData);

    this.commonService.applyTotalData("isGooglePlace", this.GooglePlace);
  }

  async processDemoQuote() {
    setTimeout(() => {
      // this.fcModalForm= this.modalService.open(this.content, {
      //   windowClass: 'custom-modal-content' // add a custom class here where you open the modal
      // });
      //this.fcModalForm.result.then(function () {
      //alert('Modal success');
      //}, function () {
      //alert('Modal dismissed');
      //});
    }, 2000);

    if (this.cacheMode) {
      this.processDemoQuoteWithCache();
    } else {
      this.process();
      const zillowData = await this.getZillowData(this.zillowParams);
      CacheManager.setValue("zillowData", this.zillowData);
      // this.isProcessing = true;
      $(".footerFlag").addClass("d-none");
      this.processZillowData(zillowData);

      const total_data = this.commonService.getLocalItem("total_data");
      if (total_data["insuranceOptions"]) {
        if (total_data["insuranceOptions"]["life"]) {
          this.router.navigateByUrl("/haven-inputs");
        } else {
          this.getPricingDataForMobile();
        }
      } else {
        this.getPricingDataForMobile();
      }
    }
  }

  async processDemoQuoteWithCache() {
    const zillowData = CacheManager.getValue("zillowData");
    this.zillowData = zillowData;
    this.processZillowData(zillowData);
  }

  // async blinkSequenceFirstImgs(isNext?) {
  async blinkSequenceFirstImgs() {
    this.showGoogleApiLogo = true;
    await this.sleep(1200);
    this.showGoogleApiLogo = false;
    this.showAwsLogo = true;
    await this.sleep(1200);
    this.showAwsLogo = false;
    this.showZillowPane = true;
    await this.sleep(1200);
    this.showZillowPane = false;
    this.showNationwide = true;
    await this.sleep(1200);
    this.showNationwide = false;
    this.showProgressive = true;
    await this.sleep(1200);
    this.showProgressive = false;
    this.showMet = true;
    await this.sleep(1200);
    this.showMet = false;
    this.showTraveler = true;
    await this.sleep(1200);
    this.showTraveler = false;
    this.showPlymouth = true;
    await this.sleep(1200);
    this.showPlymouth = false;
    this.showStateAuto = true;
    await this.sleep(1200);
    this.showStateAuto = false;
    this.showUniversal = true;
    await this.sleep(1200);
    this.showUniversal = false;
    this.showStillWater = true;
    await this.sleep(1200);
    this.showStillWater = false;
    this.showNeptune = true;
    await this.sleep(1200);
    this.showNeptune = false;
    this.show2ndGoogleApiLogo = true;
    await this.sleep(1200);
    // ---------
    this.show2ndGoogleApiLogo = false;
    this.show2ndAwsLogo = true;
    await this.sleep(1200);
    this.show2ndAwsLogo = false;
    this.show2ndZillowPane = true;
    await this.sleep(1200);
    this.show2ndZillowPane = false;
    this.show2ndNationwide = true;
    await this.sleep(1200);
    this.show2ndNationwide = false;
    this.show2ndProgressive = true;
    await this.sleep(1200);
    this.show2ndProgressive = false;
    this.show2ndMet = true;
    await this.sleep(1200);
    this.show2ndMet = false;
    this.show2ndTraveler = true;
    await this.sleep(1200);
    this.show2ndTraveler = false;
    this.show2ndPlymouth = true;
    await this.sleep(1200);
    this.show2ndPlymouth = false;
    this.show2ndStateAuto = true;
    await this.sleep(1200);
    this.show2ndStateAuto = false;
    this.show2ndUniversal = true;
    await this.sleep(1200);
    this.show2ndUniversal = false;
    this.show2ndStillWater = true;
    await this.sleep(1200);
    this.show2ndStillWater = false;
    this.show2ndNeptune = true;
    await this.sleep(1200);
    this.show2ndNeptune = false;
    await this.sleep(1200);
    if (this.progress <= 99) {
      // this.blinkSequenceFirstImgs(true);
      this.blinkSequenceFirstImgs();
    }
    return new Promise((r) => {
      r("success");
    });
  }

  sleep(m) {
    return new Promise((r) => setTimeout(r, m));
  }

  async process() {
    window.scrollTo(0, 0);
    const n = setInterval(() => {
      if (this.totalProgress <= 104) {
        this.totalProgress++;
        return;
      }
      clearInterval(n);
    }, 165);
    // this.showGoogleApiLogo = true; // Show initial image

    this.blinkSequenceFirstImgs();
    await this.initSequences(310);
    if (typeof this.zillowData["square"] != "undefined") {
      if (this.selectedDate) {
        this.gotToStepTwo();
      }
    }
  }

  onChange(event) {
    if (event) {
      this.selectedDate = event.value;
      this.isProcessing = true;
      let date = moment(event.value).format("MM/DD/YYYY");
      localStorage.setItem("startDate", date);
    }
  }

  initSequences(duration) {
    return new Promise((r) => {
      this.progress = 0;
      const n = setInterval(() => {
        if (this.progress <= 99) {
          this.progress++;
        } else {
          clearInterval(n);
          r("success");
        }
      }, duration);
      this.showCompleted = false;
    });
  }

  async getPricingDataForMobile() {
    const currentYear = new Date().getFullYear();
    let electric_year, plumbing_year, roof_year;
    const addressData = this.commonService.getAddressData();
    let city = addressData["locality"],
      state = addressData["administrative_area_level_1"],
      postal_code = addressData["postal_code"],
      street = addressData["address"],
      year_built = this.zillowData["built_year"],
      sqft = this.zillowData["square"], //.replace(",", ""),
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
      is_demo,
    };

    const params = {
      is_security: true,
      is_smart: true,
      is_bundle: true,
    };

    this.commonService.setLocalItem("calculationData", {});
    console.log("calculationData empty");

    /*Homeowners API requests*/

    Object.assign(demoRequestParams, params);
    this.getNeptuneFloodData(demoRequestParams);
    this.getHippoData(demoRequestParams);
    this.makeCondoRequests(demoRequestParams);
    this.makeHomeownersRequests(demoRequestParams);
    /*Condo API requests*/

    this.isFinished = true;
  }

  getNeptuneFloodData(params) {
    this.apiService.getNeptuneData(params).subscribe(
      (res) => {
        console.log("API getNeptuneData", res);
        const total_data = this.local.get("total_data");
        total_data["flood"] = res;
        total_data["premium_data"] = res.data.premium;
        this.local.set("total_data", total_data);
      },
      (err) => {
        alert("error");
        console.log(err);
      }
    );
  }

  getHippoData(params) {
    console.log("Call Hippo");
    this.apiService.getHippoData(params).subscribe(
      (res) => {
        console.log("API getHippo", res);
        const total_data = this.local.get("total_data");
        if (typeof JSON.parse(res.data).quote_premium != undefined && JSON.parse(res.data).quote_premium != null && JSON.parse(res.data).quote_premium > 0) {
          total_data["hippo"] = res["data"];

          let pricing: number = JSON.parse(res.data).quote_premium;

          pricing = parseFloat(String(pricing));
          pricing = pricing < 0 ? 0 : pricing;
          if (pricing != 0) {
            let { high, low } = this.commonService.getBurstPrices(pricing);

            high = Math.floor(high);
            low = Math.floor(low);
            pricing = Math.floor(pricing);

            const calculationData = this.commonService.getLocalItem("calculationData");
            calculationData.HIPPO_API_Price = pricing;
            calculationData.HIPPO_Burst_Low = low;
            calculationData.HIPPO_Burst_High = high;
            this.commonService.setLocalItem("calculationData", calculationData);
          } else {
            /* const calculationData = this.commonService.getLocalItem('calculationData');
            calculationData.HIPPO_API_Price = pricing;
            calculationData.HIPPO_Burst_Low = 0;
            calculationData.HIPPO_Burst_High = 0;
            this.commonService.setLocalItem('calculationData',calculationData); */
          }
        } else {
          total_data["hippo"] = JSON.stringify({ coverage_a: 0, quote_premium: 0 });
        }
        this.local.set("total_data", total_data);

        if (!JSON.parse(res.data).success) return;
      },
      (err) => {
        alert("error");
        console.log(err);
      }
    );
  }

  async makeHomeownersRequests(demoRequestParams) {
    let demo_homeowner_data = {};
    demoRequestParams["mode"] = 0;
    let total_data = this.local.get("total_data");
    this.apiService.getPlymouthData(demoRequestParams).subscribe((plymouth) => {
      console.log("plymouth homeowner", plymouth);
      plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
      let total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { plymouth: this.plymouth });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);

      const calculationData = this.commonService.getLocalItem("calculationData");
      calculationData.Plymouth_Good_Burst_Price = 0;
      calculationData.Plymouth_Good_Burst_Low = 0;
      calculationData.Plymouth_Good_Burst_High = 0;

      calculationData.Plymouth_Better_Burst_Price = 0;
      calculationData.Plymouth_Better_Burst_Low = 0;
      calculationData.Plymouth_Better_Burst_High = 0;

      calculationData.Plymouth_Best_Burst_Price = 0;
      calculationData.Plymouth_Best_Burst_Low = 0;
      calculationData.Plymouth_Best_Burst_High = 0;
      this.commonService.setLocalItem("calculationData", calculationData);

      Object.keys(plymouth.data).map((item) => {
        let pricing: any = parseFloat(plymouth.data[item].pricing);
        pricing = pricing * 12;
        const { high, low } = this.commonService.getBurstPrices(pricing);

        let high1 = Math.floor(high);
        let low1 = Math.floor(low);
        let pricing1 = Math.floor(pricing);

        //console.log (item);
        if (item == "good") {
          const calculationData = this.commonService.getLocalItem("calculationData");
          calculationData.Plymouth_Good_Burst_Price = pricing1;
          calculationData.Plymouth_Good_Burst_Low = low1;
          calculationData.Plymouth_Good_Burst_High = high1;
          this.commonService.setLocalItem("calculationData", calculationData);
        } else if (item == "better") {
          const calculationData = this.commonService.getLocalItem("calculationData");
          calculationData.Plymouth_Better_Burst_Price = pricing1;
          calculationData.Plymouth_Better_Burst_Low = low1;
          calculationData.Plymouth_Better_Burst_High = high1;
          this.commonService.setLocalItem("calculationData", calculationData);
        } else if (item == "best") {
          const calculationData = this.commonService.getLocalItem("calculationData");
          calculationData.Plymouth_Best_Burst_Price = pricing1;
          calculationData.Plymouth_Best_Burst_Low = low1;
          calculationData.Plymouth_Best_Burst_High = high1;
          this.commonService.setLocalItem("calculationData", calculationData);
        }
      });
    });
    this.apiService.getUniversalDataDemo(demoRequestParams).subscribe((universal) => {
      console.log("universal homeowner", universal);

      universal.result === "success" ? (this.universal = universal.data) : (this.universal = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { universal: this.universal });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);

      // univarsal.
      let pricing: number = universal.data.QuoteWrapper.Premium;
      pricing = parseFloat(String(pricing));
      pricing = pricing < 0 ? 0 : pricing;
      if (pricing != 0) {
        let { high, low } = this.commonService.getBurstPrices(pricing);
        high = Math.floor(high);
        low = Math.floor(low);
        pricing = Math.floor(pricing);

        const calculationData = this.commonService.getLocalItem("calculationData");
        calculationData.Universal_API_Price = pricing;
        calculationData.Universal_Burst_Low = low;
        calculationData.Universal_Burst_High = high;
        this.commonService.setLocalItem("calculationData", calculationData);
      } else {
        /* const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Universal_API_Price = pricing;
        calculationData.Universal_Burst_Low = 0;
        calculationData.Universal_Burst_High = 0;
        this.commonService.setLocalItem('calculationData',calculationData); */
      }
    });

    var stillwaterdata = demoRequestParams;
    stillwaterdata["api_type"] = "homeowner";
    this.apiService.getStillwaterDemoData(demoRequestParams).subscribe((stillwater) => {
      console.log("API stillwater homeowner", stillwater);
      stillwater.result === "success" ? (this.stillwater = stillwater.data) : (this.stillwater = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { stillwater: this.stillwater });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);

      const uniqueId = stillwater.data.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.PolicySummaryInfo.PolicyNumber;
      this.commonService.setLocalItem("unique_id", uniqueId);
      if (typeof stillwater.data["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"] != "undefined") {
        let pricing: number = stillwater.data["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"]["Amt"];
        pricing = parseFloat(String(pricing));
        pricing = pricing < 0 ? 0 : pricing;
        if (pricing != 0) {
          let { high, low } = this.commonService.getBurstPrices(pricing);
          high = Math.floor(high);
          low = Math.floor(low);
          pricing = Math.floor(pricing);

          const calculationData = this.commonService.getLocalItem("calculationData");
          calculationData.Stillwater_Burst_Price = pricing;
          calculationData.Stillwater_Burst_Low = low;
          calculationData.Stillwater_Burst_High = high;
          this.commonService.setLocalItem("calculationData", calculationData);
        } else {
          /* const calculationData = this.commonService.getLocalItem('calculationData');
          calculationData.Stillwater_Burst_Price = pricing;
          calculationData.Stillwater_Burst_Low = 0;
          calculationData.Stillwater_Burst_High = 0;
          this.commonService.setLocalItem('calculationData',calculationData); */
        }
      }
    });

    console.log("demoRequestParams", demoRequestParams, this.basicInfo.value);

    if (this.basicInfo.value.firstName != "" && this.basicInfo.value.lastName != "" && this.basicInfo.value.dob != "") {
      let naionwideParam = { ...demoRequestParams, ...this.basicInfo.value };
      this.apiService.getNationWideDataDemo(naionwideParam).subscribe((response) => {
        console.log("API natiowide ", response);
        if (response.result === "success") {
          console.log("nationwide", response);
          try {
            total_data = this.local.get("total_data");
            let nationwide = null;

            if (response["data"]["offeredQuotes"] != undefined && response["data"]["offeredQuotes"].length > 0) {
              var quotePremium = response["data"]["offeredQuotes"][0];
              nationwide = typeof quotePremium["premium"] != "undefined" && typeof quotePremium["premium"]["total"] != "undefined" && typeof quotePremium["premium"]["total"]["amount"] != "undefined" ? quotePremium["premium"]["total"]["amount"] : 0;
            }
            console.log("nationwide", nationwide);
            if (nationwide != 0) {
              let { high, low } = this.commonService.getBurstPrices(nationwide);
              high = Math.floor(high);
              low = Math.floor(low);
              nationwide = Math.floor(nationwide);

              const calculationData = this.commonService.getLocalItem("calculationData");
              calculationData.Nationwide_Burst_Price = nationwide;
              calculationData.Nationwide_Burst_Low = low;
              calculationData.Nationwide_Burst_High = high;
              this.commonService.setLocalItem("calculationData", calculationData);
            }
          } catch (error) {}
        }
      });
    }
  }

  async makeCondoRequests(demoRequestParams) {
    let demo_condo_data = {};
    demoRequestParams["mode"] = 1;
    let total_data = this.local.get("total_data");
    this.apiService.getPlymouthData(demoRequestParams).subscribe((plymouth) => {
      console.log("plymouth condo", plymouth);
      plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
      let total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { plymouth: this.plymouth });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });
    this.apiService.getUniversalDataDemo(demoRequestParams).subscribe((universal) => {
      console.log("universal condo", universal);
      universal.result === "success" ? (this.universal = universal.data) : (this.universal = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { universal: this.universal });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });

    var stillwaterdata = demoRequestParams;
    stillwaterdata["api_type"] = "condo";
    this.apiService.getStillwaterDemoData(stillwaterdata).subscribe((stillwater) => {
      console.log("API stillwater condo", stillwater);
      stillwater.result === "success" ? (this.stillwater = stillwater.data) : (this.stillwater = {});
      total_data = this.local.get("total_data");
      Object.assign(demo_condo_data, { stillwater: this.stillwater });
      Object.assign(total_data, { demo_condo_data });
      this.local.set("total_data", total_data);
    });
  }

  gotToStepTwo() {
    this.router.navigate(["/demo"]);
  }

  clickBegin() {
    this.isProcessing = false;
    this.showFirst = true;
    this.totalProgress = 0;
    this.loadGooglePlace();
    $("#home-page-slider").removeClass("home-page-slider-load");
    $(".navbar").addClass("d-none");
    $("#address_div").removeClass("d-none");
    $(".footerFlag").addClass("d-none");
    $(".mobileFoward").removeClass("d-none");
    if (window.innerWidth < 600) {
      $("#gif_div").addClass("d-none");
    }
  }

  refresh() {
    location.href = "/";
  }
}

/*comment*/
