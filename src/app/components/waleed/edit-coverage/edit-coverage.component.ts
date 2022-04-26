import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { Options } from "ng5-slider";
import { DemoPageEmailModalComponent } from "../../demo-page-email-modal/demo-page-email-modal.component";

@Component({
  selector: "app-edit-coverage",
  templateUrl: "./edit-coverage.component.html",
  styleUrls: ["./edit-coverage.component.scss"],
})
export class EditCoverageComponent implements OnInit {


  _finalPrice=0

  spectrum_val: number = 50;
  modal_range_picker: Options = {
    floor: 0,
    ceil: 100,
  };

  @ViewChild(DemoPageEmailModalComponent, { static: false })
  public sendPdf: DemoPageEmailModalComponent;
  prices: any;

  showModal: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit() {}



  finalPrice(data){
    this._finalPrice=data
  }




  sendEmail($event) {
    this.prices = $event;
    this.showModal.emit(true);
  }

  downloadPdf($event) {
    this.prices = $event;
    this.sendPdf.sendDemoEmailFunc(true, this.prices);
  }

}
