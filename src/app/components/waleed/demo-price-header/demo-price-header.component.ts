import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, HostListener, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from "@angular/core";
import * as $ from "jquery";
import { CommonService } from "../../../services/common.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-demo-price-header",
  templateUrl: "./demo-price-header.component.html",
  styleUrls: ["./demo-price-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPriceHeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output("sendEmail") sendEmail: EventEmitter<any> = new EventEmitter<any>();
  @Output("sendPdf") sendPdf: EventEmitter<any> = new EventEmitter<any>();
  @Input('finalPrice') finalPrice: any;

  showLoader: boolean = true;
  lat: number;
  lng: number;
  highest_price: number;
  lowest_price: number;
  medium_price: number;

  interval: any;
  isShow = false;
  public formattedAddress = "";
  public mobileAddress = "";
  square = "";
  builtyear = "";
  estimate = "";
  flood_zone = "";
  flood_price = "";
  fcManipulatedSecondLowestPrice = 0;

  constructor(public commonService: CommonService, private router: Router, private eRef: ElementRef, cdRef: ChangeDetectorRef) {
    this.generateMapData();


    // let allBurstPrices=this.commonService.getLocalItem("calculationData")
    // let sortedPrices=[]
    // Object.keys(allBurstPrices).forEach((key)=>{
    //   if(allBurstPrices[key]!==0 && allBurstPrices!=undefined){
    //     sortedPrices.push(allBurstPrices[key])
    //   }
    // })
    // sortedPrices.sort( (a, b) => a - b );
    // this.fcManipulatedSecondLowestPrice=sortedPrices[1]
  }

  ngOnChanges(){
    this.fcManipulatedSecondLowestPrice=this.finalPrice
  }

  ngOnInit() {

    // this.fcManipulatedSecondLowestPrice=this.finalPrice
    $(document).ready(function () {
      $(window)
        .scroll(function () {
          var windowBottom = $(this).scrollTop() + $(this).innerHeight();
          $(".bottomImageContainer").each(function () {
            /* Check the location of each desired element */
            var objectBottom = $(this).offset().top + $(this).outerHeight();
            /* If the element is completely within bounds of the window, fade it in */
            if (objectBottom < windowBottom) {
              //object comes into view (scrolling down)
              if ($(this).css("opacity") == 0) {
                $(this).fadeTo(100, 1, function () {
                  $(this).addClass("bounce");
                });
              }
            } else {
              //object goes out of view (scrolling up)
              if ($(this).css("opacity") == 1) {
                $(this).fadeTo(100, 0);
              }
              $(this).removeClass("bounce");
            }
          });
        })
        .scroll(); //invoke scroll-handler on page-load
    });

    let mode;
    const total_data = this.commonService.getLocalItem("total_data");
    mode = total_data["mode"];
    this.square = total_data.zillow.square;
    this.builtyear = total_data.zillow.built_year;
    this.estimate = total_data.zillow.estimate;

    this.formattedAddress = total_data.address_components.formatted_address;
    this.mobileAddress = total_data.address_components.name;
    if (!mode) mode = 0;
    mode = 0;

    this.generateMapData();
    this.interval = setInterval(() => this.getPricing(mode), 1000);
  }

  @HostListener("document:click", ["$event"]) clickout(event) {
    // Click outside of the menu was detected
    // console.log('out side of menu click !!');
    if (event.target.id == "price_toggle" && this.isShow == false) {
      this.isShow = true;
    } else {
      if (this.isShow == true) {
        this.isShow = false;
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  generateMapData() {
    try {
      const total_data = this.commonService.getLocalItem("total_data");
      this.lat = total_data.address_components.geometry.location.lat;
      this.lng = total_data.address_components.geometry.location.lng;
    } catch (e) {
      this.lat = 0;
      this.lng = 0;
    }
  }

  getPricing(type) {
    const prices = this.commonService.getPricingForDemo(type);
    this.highest_price = prices["highest_price"];
    this.lowest_price = prices["lowest_price"];
    this.medium_price = prices["medium_price"];
    this.showLoader = false;
  }

  download() {
    const { highest_price, lowest_price, medium_price } = this;
    this.sendPdf.emit({ highest_price, lowest_price, medium_price });
  }

  send() {
    const { highest_price, lowest_price, medium_price } = this;
    this.sendEmail.emit({ highest_price, lowest_price, medium_price });
  }

  ngAfterViewInit(): void {
    const totalData = this.commonService.getLocalItem("total_data");
    this.formattedAddress = totalData.address_components.formatted_address;
    this.square = totalData.zillow.square;
    this.builtyear = totalData.zillow.built_year;
    this.estimate = totalData.zillow.estimate;
    this.flood_zone = "";

    try {
      this.flood_zone = totalData.flood.data.zone;
    } catch (e) {
      this.flood_zone = "";
    }

    this.flood_price = totalData["flood"]["data"]["premium"];
    // this.cdRef.detectChanges();
  }

  async goToThreeStep() {
    const total_data = this.commonService.getLocalItem("total_data");
    // total_data['mode'] = this.selectedMode;
    total_data["mode"] = 0;
    this.commonService.setLocalItem("total_data", total_data);
    this.router.navigate(["/step3"]);
  }

  togglePrice(event: Event) {
    event.stopPropagation();
    this.isShow = true;
  }

  exitPopup() {
    this.isShow = false;
  }

  refresh() {
    location.href = "/";
  }

  handleModelClick(event: Event) {
    event.stopPropagation(); // Stop the propagation to prevent reaching document
  }

  chartModelBackdrop() {
    $("body").removeClass("heder_modal_backdrop");
  }
  toggleMonthYear(month) {
    if (month) {
      $(".fc-price-year").hide();
      $(".fc-price-month").show();

      $("#monthTog").addClass("price-active");
      $("#yearTog").removeClass("price-active");
    } else {
      $(".fc-price-year").show();
      $(".fc-price-month").hide();
      $("#monthTog").removeClass("price-active");
      $("#yearTog").addClass("price-active");
    }
  }
}
