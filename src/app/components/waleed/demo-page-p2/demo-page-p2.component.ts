import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../../../services/common.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-demo-page-p2",
  templateUrl: "./demo-page-p2.component.html",
  styleUrls: ["./demo-page-p2.component.scss"],
})
export class DemoPageP2Component implements OnInit {
  lat: string;
  lng: string;
  searchedAddress: object = {};
  secondLowestPrice:number=null

  constructor(public local: LocalStorageService, public commonService: CommonService, private router: Router) {}

  async ngOnInit() {
    this.lat = this.local.get("searchedAddressLat");
    this.lng = this.local.get("searchedAddressLng");
    this.searchedAddress = await this.local.get("searchedAddress");


    let allBurstPrices=this.commonService.getLocalItem("calculationData")
    let sortedPrices=[]
    Object.keys(allBurstPrices).forEach((key)=>{
      if(allBurstPrices[key]!==0 && allBurstPrices!=undefined){
        sortedPrices.push(allBurstPrices[key])
      }
    })
    sortedPrices.sort( (a, b) => a - b );
    console.log(sortedPrices)
    this.secondLowestPrice=sortedPrices[1]


  }

  async goToThreeStep() {
    const total_data = this.commonService.getLocalItem("total_data");
    // total_data['mode'] = this.selectedMode;
    total_data["mode"] = 0;
    this.commonService.setLocalItem("total_data", total_data);
    this.router.navigate(["/step3"]);
  }

  goToEditCoverage() {
    this.router.navigate(["/edit-coverage"]);
  }
}
