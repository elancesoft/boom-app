import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AfterViewInit, ElementRef, HostListener, NgZone} from "@angular/core";
import {ModalDirective} from "ng-uikit-pro-standard";
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";
import {MapsAPILoader} from "@agm/core";
import {LocalStorageService} from "angular-web-storage";
import CacheManager from "../../utils/CacheManager";
import {addressData} from "../../home/models";
import {BatchService} from "../../services/batch.service";

declare var google;

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss']
})

export class AddressInputComponent implements AfterViewInit {
  @ViewChild("placesRef", {static: false})
  public searchElementRef: ElementRef;

  @Input('user_email') public user_email: string;
  @Input('code') public code: string;
  @Input('address') public address: string;
  @Input('sendto') public sendto: string;
  @Input('cc') public cc: string;
  @Input('name') public name: string;
  @Input('phone') public phone: string;
  @Input('guid') public guid: string;
  @Input('autoSelect') public autoSelect: boolean;
  @Output('removeEmailRow') removeEmailRow: EventEmitter<any> = new EventEmitter();

  data = null;

  window: any = window;
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
  fullAddressText: string = "";
  isMobile: boolean;
  lat: string;
  lng: string;
  showLoader: boolean;

  plymouth: object;
  universal: object;
  stillwater: object;
  zillowData: object = {};

  isDisplay: boolean = false;
  isFinished: boolean = false;
  isProcessing: boolean = false;
  progress: number = 0;
  rowIndex: number = 0;
  showZillowPane: boolean = false;
  show2ndZillowPane: boolean = false;
  showZillowOuterContainer: boolean = false;
  totalProgress: number = 0;
  selectedMode: number = 0;
  coverage: number = 25000;
  zillowParams: object = {};
  isMobileMode: boolean = this.commonService.isMobileMode();
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
      }
    }
  };

  successBadge: boolean = false;
  failureBadge:boolean = false;
  highest_price: number;
  lowest_price: number;
  medium_price: number;

  total_prices: number = 0;
  pdf_link: string = '';
  addressInputed: boolean = false;

  getplymouthdata_finished: boolean = false;
  getuniversaldata_finished: boolean = false;
  getstillwaterdata_finished: boolean = false;
  gethippodata_finished: boolean = true;
  getflooddata_finished: boolean = true;

  googlePlaceData: any;
  prices_array = [];

  constructor(public apiService: ApiService,
              private ngZone: NgZone,
              private batchService: BatchService,
              public commonService: CommonService,
              public elemRef: ElementRef,
              private mapsAPILoader: MapsAPILoader,
              public local: LocalStorageService) {
              
  }

  ngOnInit() {
    const index = this.guid.split('_');
    this.rowIndex = index && index.length > 1 ? parseInt(index[1]): this.rowIndex; 
  }

  ngAfterViewInit(): void {
    this.loadGooglePlace();
    this.commonService.clearValues();
  }

  async loadGooglePlace() {
    this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(
            this.searchElementRef.nativeElement,
            {
              types: ["address"],
              componentRestrictions: {country: "USA"}
            }
          );

          autocomplete.addListener("place_changed", async () => {
              this.ngZone.run(async () => {
              let address = autocomplete.getPlace();
              this.handleAddressChange(address);
            });
          });
        });
      }
    });
  }

  handleAutoSelect(val){
    this.ngZone.run(async () => {
      this.handleAddressChange(val);
    });
  }

  handleAddressChange(googlePlaceData) {
    this.googlePlaceData = googlePlaceData;
    this.commonService.applyTotalData('address_components', googlePlaceData);
    const googlePlaceDataCache = {...googlePlaceData};
    if(googlePlaceData && googlePlaceData.geometry && googlePlaceData.geometry.location){
    this.lat = typeof (googlePlaceData.geometry.location.lat) === "function" ? googlePlaceData.geometry.location.lat() : googlePlaceData.geometry.location.lat;
    this.lng = typeof (googlePlaceData.geometry.location.lng) === "function" ? googlePlaceData.geometry.location.lng() : googlePlaceData.geometry.location.lng;
      googlePlaceDataCache.geometry.location.lat = () => this.lat;
    googlePlaceDataCache.geometry.location.lng = () => this.lng;
    }
    CacheManager.setValue("googlePlaceData", googlePlaceDataCache);
    try {
      this.fullAddressText = this.commonService.getLocalItem('total_data').address_components.formatted_address;
      this.addressInputed = true;
    } catch (e) {
      this.fullAddressText = '';
    }
    try {
      const {address, locality, administrative_area_level_1, postal_code} = this.getAddressData();
      this.isDisplay = true;
      this.zillowParams = {
        address: address,
        citystatezip:
        locality + ", " + administrative_area_level_1 + ", " + postal_code
      };

      this.processDemoQuote();
    } catch (e) {
      this.commonService.modalOpen("Error", "Please enter the correct address type.");
    }
  }

  async getZillowData(data) {
    return new Promise((resolve, reject) => {
      this.successBadge = false;  
      this.apiService.getZillow(data).subscribe(
        res => {
          if (!res.hasOwnProperty('price')) {
            if (!this.autoSelect) {
              this.commonService.modalOpen(
                "Error",
                "Exact address not found, please enter manually."
              );
            }
            this.failureBadge = true;
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
            this.failureBadge = true;
            this.commonService.modalOpen(
              "Error",
              "An error occurred. Please try again later."
            );

            return;
          }
              if (res.hasOwnProperty('price')) {
                  const estimate = res.price
                  this.zillowData['square'] = res.building_size;
                  this.zillowData['built_year'] = res.year_built;
                  this.zillowData['estimate'] = estimate != NaN ? this.commonService.commafy(estimate) : 0;
                  this.successBadge = true;
                  resolve({
                      result: "success",
                      code: 200,
                      message: "Successfully completed."
                  });
              }

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
    this.commonService.applyTotalData("zillow", this.zillowData);
    this.commonService.applyTotalData("isGooglePlace", this.GooglePlace);
  }

  async processDemoQuote() {
    const zillowData = await this.getZillowData(this.zillowParams);
    CacheManager.setValue('zillowData', this.zillowData);
    this.isProcessing = true;

    this.processZillowData(zillowData);

    const total_data = this.commonService.getLocalItem('total_data');
    if (total_data['insuranceOptions']) {
      if (total_data['insuranceOptions']['life']) {
        // this.router.navigateByUrl('/haven-inputs');
      } else {
        this.getPricingDataForMobile();
        this.process();
      }
    } else {
      this.getPricingDataForMobile();
      this.process();
      this.getPdfLink();
    }
  }

  async blinkSequenceFirstImgs() {

    await this.sleep(5000);
    if (this.progress <= 99) {
      // this.blinkSequenceFirstImgs(true);
      this.blinkSequenceFirstImgs();
    }
    return new Promise(r => {
      r('success');
    });
  }

  sleep(m) {
    return new Promise(r => setTimeout(r, m));
  }

  async process() {
    const n = setInterval(() => {
      if (this.totalProgress <= 99) {
        this.totalProgress++;
        return;
      }
      clearInterval(n);
    }, 150);

    this.blinkSequenceFirstImgs();
    await this.initSequences(300);
    this.isFinished = true;
  }

  initSequences(duration) {
    return new Promise(r => {
      this.progress = 0;
      const n = setInterval(() => {
        if (this.progress <= 99) {
          this.progress++;
        } else {
          clearInterval(n);
          r('success');
        }
      }, duration);
    });
  }

  async getPricingDataForMobile() {
    const currentYear = new Date().getFullYear();
    let electric_year, plumbing_year, roof_year;
    const addressData = this.getAddressData();
    let city = addressData["locality"],
      state = addressData["administrative_area_level_1"],
      postal_code = addressData["postal_code"],
      street = addressData["address"],
      year_built = this.zillowData["built_year"],
      sqft = this.zillowData ? this.zillowData["square"]: '',
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

    this.getNeptuneFloodData(demoRequestParams);
    this.getHippoData(demoRequestParams);
    // this.makeCondoRequests(demoRequestParams);
    this.makeHomeownersRequests(demoRequestParams);
    /*Condo API requests*/

    //this.isFinished = true;
  }

  getNeptuneFloodData(params) {
    this.apiService.getNeptuneData(params)
      .subscribe((res) => {
          const total_data = this.local.get('total_data');
          total_data['flood'] = res;
          this.local.set('total_data', total_data);
          this.total_prices += 1;
          this.getflooddata_finished = true;
          this.getPdfLink();
        }, (err) => {
        }
      )
  }

  getHippoData(params) {
    this.apiService.getHippoData(params)
      .subscribe((res) => {
          if (!res['success']) return;
          const total_data = this.local.get('total_data');
          total_data['hippo'] = res['data'];
          this.local.set('total_data', total_data);
          this.total_prices += 3;
          this.gethippodata_finished = true;
          this.getPdfLink();
        }, (err) => {
        }
      )
  }

async makeHomeownersRequests(demoRequestParams) {
    let demo_homeowner_data = {};
    demoRequestParams['mode'] = 0;
    let total_data = this.local.get("total_data");

    let stillwater = 0, universal = 0, plymouthAry = [], plymouth_low_price, plymouth_lowest_price;

    this.apiService.getPlymouthData(demoRequestParams)
      .subscribe(plymouth => {
        plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
        let total_data = this.local.get("total_data");
        Object.assign(demo_homeowner_data, {plymouth: this.plymouth});
        Object.assign(total_data, {demo_homeowner_data});
        this.local.set("total_data", total_data);
        if (plymouth.result === "success") {
          this.total_prices += 9;

          let plymouthData = this.plymouth;
          const plymouthKeys = Object.keys(plymouthData);
          for (let key in plymouthKeys) {
            let plymouthChoice = plymouthData[plymouthKeys[key]].pricing;
            let plymouth = parseFloat(plymouthChoice.replace(',', '')) * 12;
            plymouthAry.push(plymouth)
          }
          plymouth_low_price = (plymouthAry[0] - 25 + 65 + 50) * .8;
          plymouth_lowest_price = (plymouthAry[0] - 25 - 10) * .75;
          this.prices_array.push(plymouth_low_price);
          this.prices_array.push(plymouth_lowest_price);
          this.prices_array = this.prices_array.concat(plymouthAry);
        }

        this.getplymouthdata_finished = true;
        this.getPdfLink();
      });

    this.apiService.getUniversalData(demoRequestParams)
      .subscribe(universal => {
        universal.result === "success"
          ? (this.universal = universal.data)
          : (this.universal = {});
        total_data = this.local.get("total_data");
        Object.assign(demo_homeowner_data, {universal: this.universal});
        Object.assign(total_data, {demo_homeowner_data});
        this.local.set("total_data", total_data);

        if (universal.result === "success") {
          this.total_prices += 3;

          if (this.universal["QuoteWrapper"]["Message"] == 'OK') {
            universal = this.universal["QuoteWrapper"]['Premium'];
            this.prices_array.push(universal);
          }
          
        }
        this.getuniversaldata_finished = true;
        this.getPdfLink();
      });

    this.apiService.getStillwaterData(demoRequestParams)
      .subscribe(stillwater => {
        stillwater.result === "success"
          ? (this.stillwater = stillwater.data)
          : (this.stillwater = {});
        total_data = this.local.get("total_data");
        Object.assign(demo_homeowner_data, {stillwater: this.stillwater});
        Object.assign(total_data, {demo_homeowner_data});
        this.local.set("total_data", total_data);
        if (stillwater.result === "success") {
          this.total_prices += 3;

          if (this.stillwater["ACORD"]['InsuranceSvcRs']['HomePolicyQuoteInqRs']['MsgStatus']['MsgStatusCd'] == 'Success') {
            stillwater = this.stillwater["ACORD"]['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']["FullTermAmt"]["Amt"];
            this.prices_array.push(stillwater);
          }
        }
        this.getstillwaterdata_finished = true;
        this.getPdfLink();
      });
  }

  async makeCondoRequests(demoRequestParams) {

    let demo_condo_data = {};
    demoRequestParams['mode'] = 1;
    let total_data = this.local.get("total_data");
    this.apiService.getPlymouthData(demoRequestParams)
      .subscribe(plymouth => {
        plymouth.result === "success"
          ? (this.plymouth = plymouth.data)
          : (this.plymouth = {});
        let total_data = this.local.get("total_data");
        Object.assign(demo_condo_data, {plymouth: this.plymouth});
        Object.assign(total_data, {demo_condo_data});
        this.local.set("total_data", total_data);
      });

    this.apiService.getUniversalData(demoRequestParams)
      .subscribe(universal => {
        universal.result === "success"
          ? (this.universal = universal.data)
          : (this.universal = {});
        total_data = this.local.get("total_data");
        Object.assign(demo_condo_data, {universal: this.universal});
        Object.assign(total_data, {demo_condo_data});
        this.local.set("total_data", total_data);
      });

    this.apiService.getStillwaterData(demoRequestParams)
      .subscribe(stillwater => {
        stillwater.result === "success"
          ? (this.stillwater = stillwater.data)
          : (this.stillwater = {});
        total_data = this.local.get("total_data");
        Object.assign(demo_condo_data, {stillwater: this.stillwater});
        Object.assign(total_data, {demo_condo_data});
        this.local.set("total_data", total_data);
      });
  }

    downloadPdf() {
        this.apiService.getPdfDownloaded({url: this.pdf_link}).subscribe(val => {
            const file1 = new Blob([val], { type: 'application/pdf' });
            let reader = new FileReader();
            reader.readAsDataURL(file1);
            const fileURL = URL.createObjectURL(file1);
            window.open(fileURL);
        })
    }

  getPdfLink () {

    let total_data = this.local.get("total_data");
    let formatted_address = '';
    try {
      formatted_address = this.fullAddressText;
    } catch (e) {
    }

    let mode;
    mode = total_data['mode'];
    if (!mode) mode = 0;
    mode = 0;
    this.getPricing(mode);

    if (this.lowest_price === undefined || this.medium_price === undefined || this.highest_price === undefined) {
      return;
    }

    if (!this.gethippodata_finished || !this.getflooddata_finished || !this.getstillwaterdata_finished || !this.getflooddata_finished || !this.getplymouthdata_finished) {
      return;
    }

    let prices = [
      {
        index: 1,
        amount: this.commonService.commafy(this.lowest_price)
      },

      {
        index: 2,
        amount: this.commonService.commafy(this.medium_price)
      },

      {
        index: 3,
        amount: this.commonService.commafy(this.highest_price)
      }
    ];
    const addressData = this.getAddressData();
    let hippoPrice = '';
    let coverage_a = '';
    try {
      hippoPrice = JSON.parse(total_data['hippo']).quote_premium;
      coverage_a = JSON.parse(total_data['hippo']).coverage_a;
    } catch (e) {
      hippoPrice = '';
      coverage_a = '';
    }
    let flood_zone = '';
    try {
      flood_zone = total_data.flood.data.zone
    } catch (e) {
      flood_zone = '';
    }

    if (hippoPrice === undefined) {
      hippoPrice = '';
    }

    if (coverage_a === undefined) {
      coverage_a = '';
    }

    const zillow = total_data['zillow'];
    let data = {
      formatted_address: formatted_address,
      email: 'sendto',
      cc_email: 'cc', prices,
      quote_id: this.commonService.getLocalItem('unique_id'),
      address: addressData['address'],
      city: addressData['locality'],
      county: addressData['administrative_area_level_2'],
      state: addressData['administrative_area_level_1'],
      zip_code: addressData['postal_code'],
      lowPrice: Math.round(this.lowest_price),
      highPrice: Math.round(this.highest_price),
      pricing: Math.round(this.medium_price),
      sqft: zillow['square'] || '',
      year_built: zillow['built_year'],
      estimate: zillow['estimate'],
      chartImgStr: total_data['chartbase64Img'],
      flood_zone, hippoPrice, coverage_a
    };

    this.apiService.getPdfLink(data).subscribe(res => {
      if (res['msg'] == 'successfully received.') {
        this.pdf_link = res['result'];
      } else {
      }
    }, (err) => {
    });
  }

    remove(event) {
        const data =
        {
            id: this.guid,
            address: this.fullAddressText,
            sendto: this.sendto,
            cc: this.cc,
            name: this.name,
            phone: this.phone
        };
        this.removeEmailRow.emit(data);
    }

getAddressData() {
    try {
      const addressData = this.googlePlaceData.address_components;
      let street_number, route, address, locality, administrative_area_level_1,administrative_area_level_2, country, postal_code;
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

      administrative_area_level_2 = addressData.filter(elem => {
        return elem["types"][0] == "administrative_area_level_2";
      });
      administrative_area_level_2 = administrative_area_level_2
        ? administrative_area_level_2[0]["short_name"]
        : "";

      country = addressData.filter(elem => {
        return elem["types"][0] == "country";
      });

      country = country ? [0]["short_name"] : "";

      postal_code = addressData.filter(elem => {
        return elem["types"][0] == "postal_code";
      });
      postal_code = postal_code ? postal_code[0]["short_name"] : "";
      return {
        street_number,
        route,
        address,
        locality,
        administrative_area_level_1,
        administrative_area_level_2,
        country,
        postal_code
      }
    } catch (e) {
      return {
        street_number: '',
        route: '',
        address: '',
        locality: '',
        administrative_area_level_1: '',
        country: '',
        postal_code: ''
      }
    }
  }

  sendEmail (sendto, cc, name, phone, bulk_mode) {
    const pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!sendto) {
      this.commonService.modalOpen('Warning', 'Please type the email address.');
      return;
    }
    if (!pattern.test(sendto)) {
      this.commonService.modalOpen('Warning', 'Please type the correct email address');
      return;
    }
    if (cc !== undefined && cc !== '' && !pattern.test(cc)) {
      this.commonService.modalOpen('Warning', 'Please type the correct cc email address');
      return;
    }

    const total_data = this.local.get("total_data");

    let formatted_address = '';
    try {
      formatted_address = this.fullAddressText;
    } catch (e) {

    }

    let mode;
    mode = total_data['mode'];
    if (!mode) mode = 0;
    mode = 0;
    this.getPricing(mode);

    let prices = [
      {
        index: 1,
        amount: this.commonService.commafy(this.lowest_price)
      },

      {
        index: 2,
        amount: this.commonService.commafy(this.medium_price)
      },

      {
        index: 3,
        amount: this.commonService.commafy(this.highest_price)
      }
    ];
    const addressData = this.getAddressData();
    let hippoPrice = '';
    let coverage_a = '';
    try {
      hippoPrice = JSON.parse(total_data['hippo']).quote_premium;
      coverage_a = JSON.parse(total_data['hippo']).coverage_a;
    } catch (e) {
      hippoPrice = '';
      coverage_a = '';
    }
    let flood_zone = '';
    try {
      flood_zone = total_data.flood.data.zone
    } catch (e) {
      flood_zone = '';
    }

    const zillow = total_data['zillow'];
    let data = {
      formatted_address: this.fullAddressText,
      email: sendto,
      cc_email: cc, prices,
      quote_id: this.commonService.getLocalItem('unique_id'),
      address: addressData['address'],
      city: addressData['locality'],
      county: addressData['administrative_area_level_2'],
      state: addressData['administrative_area_level_1'],
      zip_code: addressData['postal_code'],
      lowPrice: Math.round(this.lowest_price),
      highPrice: Math.round(this.highest_price),
      pricing: Math.round(this.medium_price),
      sqft: zillow['square'],
      year_built: zillow['built_year'],
      estimate: zillow['estimate'],
      chartImgStr: total_data['chartbase64Img'],
      flood_zone, hippoPrice, coverage_a
    };

    this.apiService.sendDemoEmail(data).subscribe(res => {
      if (res['result'] == 'success') {
        if (!bulk_mode)
          this.commonService.modalOpen('Success', 'Successfully sent.');
	      console.log ("sent email");

        const bulk = {
          user_email: this.user_email,
          code: this.code,
          address: this.fullAddressText,
          sendto: sendto,
          cc: cc,
          name: name,
          phone: phone
        };

        this.batchService.bulk_create(bulk).subscribe(
          response => {
            console.log (response);
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.commonService.modalOpen('Error', res['msg'])
      }
    }, (err) => {
    });
  }

  getPricing(type) {
    let lowest_price = 0, medium_price = 0, highest_price = 0;
    try {
      lowest_price = this.prices_array.filter(function (x) {
        return parseFloat(x) !== 0 && Boolean(parseFloat(x));
      })
        .reduce(function (a, b) {
          return Math.min(a, b);
        });
      try {

        medium_price = this.prices_array.filter(function (x) {
          return parseFloat(x) !== 0 && Boolean(parseFloat(x));
        })
          .sort(function (a, b) {
            return a - b
          })[1];
      } catch (e) {
        medium_price = lowest_price;
      }
      highest_price = this.prices_array.filter(function (x) {
        return parseFloat(x) !== 0 && Boolean(parseFloat(x));
      })
        .reduce(function (a, b) {
          return Math.max(a, b);
        });
    } catch (e) {
    }
    if (medium_price == undefined) medium_price = lowest_price;

    this.highest_price = highest_price;
    this.lowest_price = lowest_price;
    this.medium_price = medium_price;
  }
}
