import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { ApiService } from "../../../services/api-service";

@Component({
  selector: "initial-info-form",
  templateUrl: "./initial-info-form.component.html",
  styleUrls: ["./initial-info-form.component.scss"],
})
export class InitialInfoForm implements OnInit {


  apiCallCompletion:object={
    zillo:false,
    hippo:false,
    universal:false,
    stillwater:false,
    plymouth:false,
    nationwide:false,
    neptune:false

  }


  isDisplay: boolean = false;

  isProcessing: boolean = false;
  selectedDate: Date;
  lat: string;
  lng: string;
  fullAddressText: string = "";
  zillowParams: object = {};
  zillowData: object = {};
  totalProgress: number = 0;
  progress: number = 0;
  showCompleted: boolean = false;
  selectedMode: number = 0;
  coverage: number = 25000;
  isFinished: boolean = false;
  plymouth: object;
  universal: object;
  stillwater: object;
  showFirst: boolean = false;

  square = "";
  builtyear = "";
  estimate = "";
  progressBar1Complete: boolean = false;
  GooglePlace: boolean = true;


  showZillowPane: boolean = false;
  searchedAddress: object = {};
  basicInfo = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    dob: new FormControl("", [Validators.required]),
    termsAndConditions: new FormControl(""),
  });

  constructor(public commonService: CommonService, private router: Router, public local: LocalStorageService, public apiService: ApiService) {}

  async ngOnInit() {
    this.searchedAddress = await this.local.get("searchedAddress");


  }
  onSubmitForm() {
    this.basicInfo.markAllAsTouched();
    if (this.basicInfo.valid) {
      console.log(`this.basicInfo.value`, this.basicInfo.value);

      this.local.set("fcUserBasic", this.basicInfo.value);
      this.initRequests()
    }
  }

   initRequests() {
    if (this.searchedAddress) {
      this.isProcessing = true;
      this.selectedDate = new Date();
    }

    this.commonService.applyTotalData("address_components", this.searchedAddress);

    this.lat = this.local.get("searchedAddressLat");
    this.lng = this.local.get("searchedAddressLng");
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

  async getZillowData(data) {

    this.apiService.sendSearchAddressEmail(data).subscribe((response) => {
      console.log("email", response);
    });
    return new Promise((resolve, reject) => {
      this.apiService.getZillow(data).subscribe(
        (res) => {
          this.apiCallCompletion['zillo']=true
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
            // this.clickBegin();
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
          this.apiCallCompletion['zillo']=true

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

    //this.commonService.applyTotalData("isGooglePlace", this.GooglePlace);
  }

 checkApiCompletion(){
   console.log('api com check')
   setTimeout(() => {
     console.log(this.apiCallCompletion)
    let decison=Object.keys(this.apiCallCompletion).map((key)=>this.apiCallCompletion[key]).some((data)=>!data)
      if(!decison){
        this.gotToStepTwo();
      }else{
        this.checkApiCompletion()
      }
   }, 2000);

      }
  async processDemoQuote() {
      //this.process();
      this.checkApiCompletion()
      const zillowData = await this.getZillowData(this.zillowParams);
      this.processZillowData(zillowData);
      this.getAllApiPricing();

  }







  // sleep(m) {
  //   return new Promise((r) => setTimeout(r, m));
  // }
  // async process() {
  //   window.scrollTo(0, 0);
  //   const n = setInterval(() => {
  //     if (this.totalProgress <= 104) {
  //       this.totalProgress++;
  //       return;
  //     }
  //     clearInterval(n);
  //   }, 165);
  //   await this.initSequences(310);
  //   if (typeof this.zillowData["square"] != "undefined") {
  //     if (this.selectedDate) {
  //       this.gotToStepTwo();
  //     }
  //   }
  // }

  // initSequences(duration) {
  //   return new Promise((r) => {
  //     this.progress = 0;
  //     const n = setInterval(() => {
  //       if (this.progress <= 99) {
  //         this.progress++;
  //       } else {
  //         clearInterval(n);
  //         r("success");
  //       }
  //     }, duration);
  //     this.showCompleted = false;
  //   });
  // }






  async getAllApiPricing() {
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

    console.log({demoRequestParams})
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
    this.makeHomeownersRequests(demoRequestParams);

    this.isFinished = true;
  }

  getNeptuneFloodData(params) {
    this.apiService.getNeptuneData(params).subscribe(
      (res) => {
        this.apiCallCompletion['neptune']=true
        console.log("API getNeptuneData", res);
        const total_data = this.local.get("total_data");
        total_data["flood"] = res;
        total_data["premium_data"] = res.data.premium;
        this.local.set("total_data", total_data);
      },
      (err) => {
        this.apiCallCompletion['neptune']=true
        alert("error");
        console.log(err);
      }
    );
  }

  getHippoData(params) {
    console.log("Call Hippo");
    this.apiService.getHippoData(params).subscribe(
      (res) => {
        this.apiCallCompletion['hippo']=true

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
        this.apiCallCompletion['hippo']=true

        alert("error");
        console.log(err);
      }
    );
  }

  async makeHomeownersRequests(demoRequestParams) {
    let demo_homeowner_data = {};
    demoRequestParams["mode"] = 0;
    let total_data = this.local.get("total_data");

    
    this.apiService.getPlymouthDataDemo({...demoRequestParams,...this.basicInfo.value}).subscribe((plymouth) => {
      this.apiCallCompletion['plymouth']=true

      console.log("plymouth homeowner", plymouth);
      plymouth.result === "success" ? (this.plymouth = plymouth.data) : (this.plymouth = {});
      let total_data = this.local.get("total_data");
      Object.assign(demo_homeowner_data, { plymouth: this.plymouth });
      Object.assign(total_data, { demo_homeowner_data });
      this.local.set("total_data", total_data);

      const calculationData = this.commonService.getLocalItem("calculationData");
      // calculationData.Plymouth_Good_Burst_Price = 0;
      // calculationData.Plymouth_Good_Burst_Low = 0;
      // calculationData.Plymouth_Good_Burst_High = 0;

      calculationData.Plymouth_Better_Burst_Price = 0;
      calculationData.Plymouth_Better_Burst_Low = 0;
      calculationData.Plymouth_Better_Burst_High = 0;

      // calculationData.Plymouth_Best_Burst_Price = 0;
      // calculationData.Plymouth_Best_Burst_Low = 0;
      // calculationData.Plymouth_Best_Burst_High = 0;
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
      this.apiCallCompletion['universal']=true

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
      this.apiCallCompletion['stillwater']=true

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

    //if (this.basicInfo.value.firstName != "" && this.basicInfo.value.lastName != "" && this.basicInfo.value.dob != "") {
      let naionwideParam = { ...demoRequestParams, ...this.basicInfo.value };
      this.apiService.getNationWideDataDemo(naionwideParam).subscribe((response) => {
      this.apiCallCompletion['nationwide']=true

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
            if (nationwide != 0 && nationwide != undefined) {
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
    // }
  }

  gotToStepTwo() {
    this.router.navigate(["/demopage"]);
  }
}
