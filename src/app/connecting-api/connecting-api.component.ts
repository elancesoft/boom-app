import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { CommonService } from "../services/common.service";

@Component({
  selector: "app-connecting-api",
  templateUrl: "./connecting-api.component.html",
  styleUrls: ["./connecting-api.component.scss"]
})
export class ConnectingAPIComponent implements OnInit, OnDestroy {
  @Input("isProcessing") isProcessing: boolean = false;
  @Input("timeout") timeout: number = 0;

  totalProgress: number = 30;
  interval: any = 0;
  internal_timeout: number = 0;

  constructor(public commonService: CommonService) {}

  ngOnInit() {
    this.totalProgress = 30;
    this.isProcessing = true;
    this.interval = setInterval(() => {
      if (this.internal_timeout++ > this.timeout)
        clearInterval(this.interval)
      else
        console.log("here loading ...");
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
