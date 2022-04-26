import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { ModalData } from "src/app/home/models";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-price-details-modal",
  templateUrl: "./price-details-modal.component.html",
  styleUrls: ["./price-details-modal.component.scss"],
})
export class PriceDetailsModalComponent implements OnInit {
  @Input("modalData") modalData: ModalData;
  @Output("bindNow") bindNow: EventEmitter<any> = new EventEmitter();
  @Output("showChatWidget") showChatWidget: EventEmitter<any> = new EventEmitter();
  @Input("showModal") showModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("priceModal", { static: false }) priceModal: any;
  isDataLoaded: boolean = false;

  constructor(public commonService: CommonService, private router: Router) {}

  ngOnInit() {
    // console.log('This page');
    this.showModal.subscribe((data) => {
      this.isDataLoaded = data;
      setTimeout(() => this.priceModal.show());
    });
  }

  next(modalData: ModalData) {
    const total_data = this.commonService.getLocalItem("total_data");
    let mortgage_data = total_data["mortgage_data"];
    if (!mortgage_data) mortgage_data = {};
    mortgage_data["imgURL"] = modalData.imgURL;
    mortgage_data["price"] = modalData.price;
    this.commonService.applyTotalData("mortgage_data", mortgage_data);
    this.router.navigateByUrl("/preparing-policy");
  }

  requestPDF() {
    this.commonService.modalOpen("Success", "Request Sent. We will send you the quote PDF when it is available!");
  }

  bindQuoteNow() {
    this.bindNow.emit();
  }
}
