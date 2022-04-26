import { Component, EventEmitter, Input, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ng-uikit-pro-standard";
import { CommonService } from "../../services/common.service";
import { ApiService } from "../../services/api-service";

@Component({
  selector: "app-demo-page-email-modal",
  templateUrl: "./demo-page-email-modal.component.html",
  styleUrls: ["./demo-page-email-modal.component.scss"],
})
export class DemoPageEmailModalComponent implements OnInit {
  demoEmailAddr: string = "";
  ccEmail: string = "";
  @ViewChild("basicModal", { static: false }) public basicModal: ModalDirective;
  @Input("prices") prices: any;
  @Input("showModal") showModal: EventEmitter<boolean>;

  constructor(private commonService: CommonService, private apiService: ApiService) {}

  ngOnInit() {
    if (this.showModal) {
      this.showModal.subscribe((data) => {
        this.basicModal.show();
      });
    }
  }

  sendDemoEmailFunc(isPdf?: boolean, price?: any) {
    if (isPdf) {
      this.prices = price;
    }
    console.log(this.prices, "this.prices");
    if (!isPdf) {
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
    }
    const total_data = this.commonService.getLocalItem("total_data");
    let formatted_address = "";
    try {
      formatted_address = total_data["address_components"]["formatted_address"];
    } catch (e) {}
    let prices = [
      {
        index: 1,
        amount: this.commonService.commafy(this.prices.lowest_price),
      },

      {
        index: 2,
        amount: this.commonService.commafy(this.prices.medium_price),
      },

      {
        index: 3,
        amount: this.commonService.commafy(this.prices.highest_price),
      },
    ];
    const addressData = this.commonService.getAddressData();
    let hippoPrice = "";
    let coverage_a = "";
    try {
      hippoPrice = JSON.parse(total_data["hippo"]).quote_premium;
      coverage_a = JSON.parse(total_data["hippo"]).coverage_a;
    } catch (e) {
      hippoPrice = "";
      coverage_a = "";
    }
    let flood_zone = "";
    try {
      flood_zone = total_data.flood.data.zone;
    } catch (e) {
      flood_zone = "";
    }
    const zillow = total_data["zillow"];
    let data = {
      formatted_address: formatted_address,
      email: this.demoEmailAddr,
      cc_email: this.ccEmail,
      prices,
      quote_id: this.commonService.getLocalItem("unique_id"),
      address: addressData["address"],
      city: addressData["locality"],
      county: addressData["administrative_area_level_2"],
      state: addressData["administrative_area_level_1"],
      zip_code: addressData["postal_code"],
      lowPrice: Math.round(this.prices.lowest_price),
      highPrice: Math.round(this.prices.highest_price),
      pricing: Math.round(this.prices.medium_price),
      sqft: zillow["square"],
      year_built: zillow["built_year"],
      estimate: zillow["estimate"],
      chartImgStr: total_data["chartbase64Img"],
      flood_zone,
      hippoPrice,
      coverage_a,
    };
    if (!isPdf) {
      this.apiService.sendDemoEmail(data).subscribe(
        (res) => {
          this.basicModal.hide();
          if (res["result"] == "success") {
            this.commonService.modalOpen("Success", "Successfully sent.");
          } else {
            this.commonService.modalOpen("Error", res["msg"]);
          }
        },
        (err) => {}
      );
    } else {
      this.apiService.getPdfLink(data).subscribe((res) => {
        let pdf_link = "";
        if (res["msg"] == "successfully received.") {
          pdf_link = res["result"];
        }
        this.apiService.getPdfDownloaded({ url: pdf_link }).subscribe((val) => {
          const file1 = new Blob([val], { type: "application/pdf" });
          let reader = new FileReader();
          reader.readAsDataURL(file1);
          const fileURL = URL.createObjectURL(file1);
          window.open(fileURL);
        });
      });
    }
  }
}
