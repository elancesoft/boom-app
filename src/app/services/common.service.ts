import { Injectable } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { NgbdModalContent } from "../home/ngbd.modal.content";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private _location: Location, public local: LocalStorageService, private modalService: NgbModal, public spinnerService: Ng4LoadingSpinnerService, public router: Router) { }

  private tabDataSource: BehaviorSubject<string> = new BehaviorSubject('');
  currentTabData = this.tabDataSource.asObservable();

  updateTabSource(data: any) {
    console.log('data', data)
    this.tabDataSource.next(data);
  }

  private subject = new Subject<any>();

  sendClickEvent(isForward: boolean) {
    this.subject.next(isForward);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  async setLocalItem(key, value) {
    this.local.set(key, value);
  }

  getLocalItem(key) {
    return this.local.get(key);
  }

  async removeLocalItem(key) {
    this.local.remove(key);
  }

  commafy(num) {
    if (num == "" || num == undefined) {
      return "";
    }
    const str = num.toString().split(".");
    if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, "$1 ");
    }
    return str.join(".");
  }

  public getPreviousUrl(routeArray): string {
    let prevRoute = "";
    for (let i = 0; i < routeArray.length - 1; i++) {
      if (routeArray[i].url._value[0].length > 0) {
        prevRoute += routeArray[i].url._value[0].path + "/";
      }
    }
    return prevRoute;
  }

  modalOpen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;

  }

  getUniqueID() {
    const total_data = this.getLocalItem("total_data");
    let unique_id;
    try {
      unique_id = total_data.insurance_data.stillwater.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.PolicySummaryInfo.PolicyNumber;
    } catch (e) {
      unique_id = "";
    }
    return unique_id;
  }

  setUniqueID(value) {
    this.local.set("unique_id", value);
  }

  removeUniqueID() {
    this.local.remove("unique_id");
  }

  isMobileMode() {
    return window.innerWidth < 768;
  }

  getPricings(total_data) {
    let zillowData = total_data["zillow"];
    let factor = 0.0025;
    let square, estimate;
    if (typeof zillowData["square"] == "string") {
      square = parseInt(zillowData["square"].replace(",", ""));
      estimate = parseInt(zillowData["estimate"].replace(",", ""));
    } else {
      square = zillowData["square"];
      estimate = zillowData["estimate"];
    }
    let dwelling;
    if (estimate > 0) {
      dwelling = (square * 200 + estimate * 1) / 2;
    } else {
      dwelling = square * 200;
    }

    let premium = dwelling * factor;
    let alarm = total_data["is_security"] ? -75 : 0;
    let bundle = total_data["is_bundle"] ? 0.85 : 1;
    let delivery = total_data["is_smart"] ? -20 : 0;
    let premium1 = premium * bundle;
    let premium2 = premium1 + alarm + delivery;
    let penalty;
    if (square >= 2000) {
      penalty = 0;
    } else if (square < 2000) {
      penalty = 165;
    } else if (square <= 1500) {
      penalty = 295;
    }
    const lowPrice = parseInt(premium2 + penalty);
    return {
      lowPrice,
      highPrice: lowPrice + 231,
    };
  }

  /*
   *  @params=> type: number;
   * */
  getPricingForDemo(type) {
    const total_data = this.getLocalItem("total_data");
    let arr = [];
    let stillwater = 0,
      universal = 0,
      plymouthAry = [],
      lowest_price,
      medium_price,
      highest_price,
      plymouth_low_price,
      plymouth_lowest_price;
    const insuranceTypes = ["demo_homeowner_data", "demo_condo_data"];
    if (total_data) {
      const apiData = total_data[insuranceTypes[type]];
      try {
        let plymouthData = apiData["plymouth"];
        const plymouthKeys = Object.keys(plymouthData);
        for (let key in plymouthKeys) {
          let plymouthChoice = plymouthData[plymouthKeys[key]].pricing;
          let plymouth = parseFloat(plymouthChoice.replace(",", "")) * 12;
          plymouthAry.push(plymouth);
        }
        plymouth_low_price = (plymouthAry[0] - 25 + 65 + 50) * 0.8;
        plymouth_lowest_price = (plymouthAry[0] - 25 - 10) * 0.75;
        arr.push(plymouth_low_price);
        arr.push(plymouth_lowest_price);
      } catch (e) { }
      try {
        if (apiData["universal"]) {
          if (apiData["universal"]["QuoteWrapper"]["Message"] == "OK") {
            universal = apiData["universal"]["QuoteWrapper"]["Premium"];
          }
        }
      } catch (e) {
        universal = 0;
      }
      arr.push(universal);
      try {
        if (apiData["stillwater"]["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["MsgStatus"]["MsgStatusCd"] == "Success") {
          stillwater = apiData["stillwater"]["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"]["Amt"];
        }
      } catch (e) {
        stillwater = 0;
      }
      arr.push(stillwater);
    }

    arr = arr.concat(plymouthAry);
    try {
      lowest_price = arr
        .filter(function (x) {
          return parseFloat(x) !== 0 && Boolean(parseFloat(x));
        })
        .reduce(function (a, b) {
          return Math.min(a, b);
        });
      try {
        medium_price = arr
          .filter(function (x) {
            return parseFloat(x) !== 0 && Boolean(parseFloat(x));
          })
          .sort(function (a, b) {
            return a - b;
          })[1];
      } catch (e) {
        medium_price = lowest_price;
      }
      highest_price = arr
        .filter(function (x) {
          return parseFloat(x) !== 0 && Boolean(parseFloat(x));
        })
        .reduce(function (a, b) {
          return Math.max(a, b);
        });
    } catch (e) { }
    this.setLocalItem(
      "apiData",
      JSON.stringify({
        plymouthAry,
        stillwater,
        universal,
      })
    );
    return {
      lowest_price,
      medium_price,
      highest_price,
    };
  }

  clearValues() {
    this.local.remove("zillowData");
    this.local.remove("apiData");
    this.local.remove("personData");
    this.local.remove("discountsData");
    this.local.remove("carData");
    this.local.remove("total_data");
    this.local.remove("googlePlaceData");
    this.local.remove("homeData");
    this.local.remove("isMailingSameAsProperty");
    this.local.remove("isLogged");
    this.local.remove("addressData");
    this.local.remove("mailing_address");
    this.local.remove("email");
    this.local.remove("unique_id");
    this.local.remove("type");
    this.local.remove("yearData");
    this.local.remove("phone");
  }

  /**Get address data for preparing API Request params from the Google Places API Data**/

  getAddressData() {
    const total_data = this.getLocalItem("total_data");
    try {
      const addressData = total_data.address_components.address_components;
      let street_number, route, address, locality, administrative_area_level_1, administrative_area_level_2, country, postal_code;
      street_number = addressData.filter((elem) => {
        return elem["types"][0] == "street_number";
      });
      street_number = street_number ? street_number[0]["short_name"] : "";

      route = addressData.filter((elem) => {
        return elem["types"][0] == "route";
      });
      route = route ? route[0]["long_name"] : "";

      address = street_number + " " + route;

      locality = addressData.filter((elem) => {
        return elem["types"][0] == "locality";
      });
      locality = locality ? locality[0]["long_name"] : "";

      administrative_area_level_1 = addressData.filter((elem) => {
        return elem["types"][0] == "administrative_area_level_1";
      });
      administrative_area_level_1 = administrative_area_level_1 ? administrative_area_level_1[0]["short_name"] : "";

      administrative_area_level_2 = addressData.filter((elem) => {
        return elem["types"][0] == "administrative_area_level_2";
      });
      administrative_area_level_2 = administrative_area_level_2 ? administrative_area_level_2[0]["short_name"] : "";

      country = addressData.filter((elem) => {
        return elem["types"][0] == "country";
      });

      country = country ? [0]["short_name"] : "";

      postal_code = addressData.filter((elem) => {
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
        postal_code,
      };
      // if (total_data['isGooglePlace']) {
      // } else {
      //   let staticAddress = total_data['staticAddress'];
      //   staticAddress = staticAddress.split(',');
      //   let address = staticAddress[0].trim();
      //   let locality = staticAddress[1].trim();
      //   let administrative_area_level_1 = staticAddress[2].replace(/\n/g, " ").split(" ")[0].trim();
      //   let postal_code = staticAddress[2].replace(/\n/g, " ").split(" ")[1].trim();
      //   return {
      //     address,
      //     locality,
      //     administrative_area_level_1,
      //     postal_code
      //   }
      // }
    } catch (e) {
      return {
        street_number: "",
        route: "",
        address: "",
        locality: "",
        administrative_area_level_1: "",
        country: "",
        postal_code: "",
      };
    }
  }

  getBurstPrices(price) {
    const low = Number(((price - 25) * 0.93).toFixed(2));
    const high = Number(((price - 25) * 0.97).toFixed(2));
    return {
      low,
      high,
    };
  }

  applyTotalData(key, value) {
    let total_data = this.getLocalItem("total_data");
    if (!total_data) total_data = {};
    Object.assign(total_data, { [key]: value });
    this.setLocalItem("total_data", total_data);
  }
  back(curPage) {

    console.log({curPage})


    if(curPage==='initial-info-form'){
      this.router.navigate(["/step1"]);
      return
    }


    if(curPage==='demopage'){
      this.router.navigate(["/initial-info-form"]);
      return
    }


    if(curPage==='step3'){
      this.router.navigate(["/demopage"]);
      return
    }


    if(curPage==='edit-coverage'){
      this.router.navigate(["/demopage"]);
      return
    }

    
    if(curPage==='course-relation'){
      this.router.navigate(["/step3"]);
      return
    }


    if(curPage==='step6'){
      this.router.navigate(["/course-relation"]);
      return
    }

    
    if(curPage==='policy-start-date'){
      this.router.navigate(["/step6"]);
      return
    }



    if(curPage==='policy-start-date'){
      this.router.navigate(["/step6"]);
      return
    }


    if(curPage==='policy-chat'){
      this.router.navigate(["/policy-start-date"]);
      return
    }

    






    // if (curPage == "demopage") {
      
    //   this._location.back();
    //   // this.router.navigate(["/initial-info-form"]);
    // } else if (curPage == "property-form") {
    //   this.router.navigate(["/demo"]);
    // } else if (curPage == "insurance-detail") {
    //   this.router.navigate(["/step3"]);
    // } else if (curPage == "olark-chet") {
    //   //window.location.href = window.location.origin + '/policy-start-date'
    //   this.router.navigate(["/policy-start-date"]);
    // }
  }
}
