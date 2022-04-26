import { Component, OnInit,Input  } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { ApiService } from "../../../services/api-service";
import { CommonService } from "../../../services/common.service";


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public formattedAddress = "";
  @Input("currentUrl") public currentUrl:any;
 
  //public mobileAddress = "";
  // square = "";
  // builtyear = "";
  // estimate = "";
  // dwelling: number = 0;
  // total_data: any;
  // myPrices: any;
  // popupStatus = 0;
  // neptuneFlood = "";

  // spectrum_val: number = 50;
  // modal_range_picker: Options = {
  //   floor: 0,
  //   ceil: 100,
  // };

  constructor(public commonService: CommonService, public apiService: ApiService, private router: Router, public local: LocalStorageService) {
    const searchedAddress = this.commonService.getLocalItem("searchedAddress");
    this.formattedAddress = searchedAddress.formatted_address;
    //this.mobileAddress = searchedAddress.name;
    // this.square = totalData.zillow.square;
    // this.builtyear = totalData.zillow.built_year;
    // this.estimate = totalData.zillow.estimate;
  
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  ngOnInit() {
    
    if(!this.currentUrl){
      this.currentUrl='demopage'
    }
    // const totalData = this.commonService.getLocalItem("total_data");
    // this.myPrices = Object.values(this.commonService.getLocalItem("calculationData"));
    // this.dwelling = Number(JSON.parse(this.total_data["hippo"]).coverage_a) > 0 ? Number(JSON.parse(this.total_data["hippo"]).coverage_a) : Number(totalData.zillow.estimate.replace(",", "")) * 1.2;
  }
  // ngAfterViewInit() {
  //   const totalData = this.commonService.getLocalItem("total_data");
  //   var chartPrices = this.myPrices;
  //   chartPrices.sort(function (a, b) {
  //     return a - b;
  //   });
  //   if (chartPrices.length > 8) {
  //     chartPrices.splice(8, chartPrices.length - 8);
  //   }
  // }

  // refresh() {
  //   location.href = "/";
  // }
  // getRadius(value: number, array: number[]) {
  //   let maxValue = Math.max(...array);
  //   return Math.round((value * 20) / maxValue);
  // }

  // getRandomColorHex() {
  //   return "#" + Math.floor(Math.random() * 16777215).toString(16);
  // }

  // modalBackdrop() {
  //   $("body").addClass("heder_modal_backdrop");
  // }
}
