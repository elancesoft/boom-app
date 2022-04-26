import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { ApiService } from "../../../services/api-service";
import * as $ from "jquery";
import { Router } from "@angular/router";
import { DemoPageEmailModalComponent } from "./../../demo-page-email-modal/demo-page-email-modal.component";
import { LocalStorageService } from "angular-web-storage";
import * as Chart from "../../../../assets/javascripts/Chart.js";
import { Options } from "ng5-slider";

@Component({
  selector: "app-demo-page",
  templateUrl: "./demo-page.component.html",
  styleUrls: ["./demo-page.component.scss"],
})
export class DemoPageComponent implements OnInit {
  @Output() finalPrice = new EventEmitter<number>();

  spectrum_val: number = 50;
  modal_range_picker: Options = {
    floor: 0,
    ceil: 100,
  };
  disabledInput = false;
  @Input() disabled: boolean;

  @ViewChild(DemoPageEmailModalComponent, { static: false })
  public sendPdf: DemoPageEmailModalComponent;
  public formattedAddress = "";
  public mobileAddress = "";
  hidePopUp: boolean = false;
  square = "";
  builtyear = "";
  estimate = "";
  lat: number = 0;
  lng: number = 0;
  showModal: EventEmitter<boolean> = new EventEmitter();
  prices: any;
  myPrices: any;
  total_data: any;
  dwelling: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;

  neptuneFlood = "";
  neptuneFloodPrice = 0;

  canvas: any;
  ctx: any;
  myBubbleChart: any;
  sortedPrices = [];
  flood_zone = "";
  flood_price = "";
  calArrAvg = 0;

  popupStatus = 0;

  dwellingFromhippoMax = 200;
  dwellingFromhippoMin = 0;
  dwellingFromhippo = 110;

  personalPropertyFromHippoDwell = 50;
  personalPropertyFromHippoDwellMax = 75;
  personalPropertyFromHippoDwellMin = 25;
  liabilityValue = "300,000";
  deductibleValue = "2,500";
  otherStructuresMinValue = 50;

  fcSecondLowestPrice = 0;
  fcManipulatedSecondLowestPrice = 0;
  fcDwelling = 110;
  fcLiability: Number = 300000;
  fcProperty = 50;
  fcDeductible: Number = 2500;
  fcDwellingExtension = 0;
  fcWaterBackup = 0;
  fcSewerLine = 0;
  fcEquipmentBreakdown = 0;
  fcReplacementCost = 0;

  fcDwellingPrice = 0;
  fcLiabilityPrice = 0;
  fcPropertyPrice = 0;
  fcDeductiblePrice = 0;
  fcDwellingExtensionPrice = 0;
  fcWaterBackupPrice = 0;
  fcSewerLinePrice = 0;
  fcEquipmentBreakdownPrice = 0;
  fcReplacementCostPrice = 0;

  constructor(public commonService: CommonService, public apiService: ApiService, private router: Router, public local: LocalStorageService) {
    this.generateMapData();
    const totalData = this.commonService.getLocalItem("total_data");
    this.formattedAddress = totalData.address_components.formatted_address;
    this.mobileAddress = totalData.address_components.name;
    this.square = totalData.zillow.square;
    this.builtyear = totalData.zillow.built_year;
    this.estimate = totalData.zillow.estimate;

    if (typeof totalData.flood != "undefined" && typeof totalData.flood.data != "undefined" && typeof totalData.flood.data.premium != "undefined") {
      this.neptuneFloodPrice = totalData.flood.data.premium;
      this.neptuneFlood = totalData.flood.data.zone;
    }
    var result = Object.keys(this.commonService.getLocalItem("calculationData")).map((key) => [key, this.commonService.getLocalItem("calculationData")[key]]);
    console.log("API price list");
    result.forEach((key) => {
      var price = key.toString();
      console.log(price.replace(",", " : "));
    });
    // For smart price

    let allBurstPrices = this.commonService.getLocalItem("calculationData");

    Object.keys(allBurstPrices).forEach((key) => {
      if (allBurstPrices[key] !== 0 && allBurstPrices != undefined) {
        this.sortedPrices.push(allBurstPrices[key]);
      }
    });
    this.sortedPrices.sort((a, b) => a - b);

    this.fcSecondLowestPrice = this.sortedPrices[1];
    this.fcManipulatedSecondLowestPrice = this.sortedPrices[1];

    this.fcManipulatedSecondLowestPrice = this.fcSecondLowestPrice;
    this.finalPrice.emit(this.fcManipulatedSecondLowestPrice);

    this.minPrice = this.sortedPrices[0];
    this.maxPrice = this.sortedPrices[this.sortedPrices.length - 1];
    this.calArrAvg = Math.round(
      this.sortedPrices.reduce(function (a, b) {
        return a + b;
      }, 0) / this.sortedPrices.length
    );

    // End smart price
    try {
      this.dwellingFromhippo = JSON.parse(this.commonService.getLocalItem("total_data").hippo).coverage_a;
      this.dwellingFromhippoMax = (this.dwellingFromhippo * 200) / 100;
      this.dwellingFromhippoMin = (this.dwellingFromhippo * 80) / 100;

      this.personalPropertyFromHippoDwell = (this.dwellingFromhippo * 50) / 100;
      this.personalPropertyFromHippoDwellMax = (this.dwellingFromhippo * 75) / 100;
      this.personalPropertyFromHippoDwellMin = (this.dwellingFromhippo * 25) / 100;
    } catch (error) {}

    this.fcDwelling = this.dwellingFromhippo;
    this.fcProperty = this.personalPropertyFromHippoDwell;
    this.setFilterInitailValues();
    // const prevFilterVal=this.commonService.getLocalItem("fcFilterData")
    // console.log('prevFilterVal',prevFilterVal)
    // const filterObject = {
    //   fcManipulatedSecondLowestPrice: this.fcManipulatedSecondLowestPrice ,
    //   fcDwellingPrice: this.fcDwellingPrice,
    //   fcDwellingExtensionPrice: this.fcDwellingExtensionPrice,
    //   fcLiabilityPrice: this.fcLiabilityPrice,
    //   fcPropertyPrice: this.fcPropertyPrice,
    //   fcDeductiblePrice: this.fcDeductiblePrice,
    //   fcWaterBackupPrice: this.fcWaterBackupPrice,
    //   fcSewerLinePrice: this.fcSewerLinePrice,
    //   fcEquipmentBreakdownPrice: this.fcEquipmentBreakdownPrice,
    //   fcReplacementCostPrice: this.fcReplacementCostPrice,

    //   fcDwelling: this.fcDwelling,
    //   fcDwellingExtension: this.fcDwellingExtension,
    //   fcLiability: this.fcLiability,
    //   fcProperty: this.fcProperty,
    //   fcDeductible: this.fcDeductible,
    //   fcWaterBackup: this.fcWaterBackup,
    //   fcSewerLine: this.fcSewerLine,
    //   fcEquipmentBreakdown: this.fcEquipmentBreakdown,
    //   fcReplacementCost: this.fcReplacementCost,
    // };
    //this.commonService.setLocalItem("fcFilterData", filterObject);
  }

  convertToLocal(data:any){
    return  parseInt(data).toLocaleString()
  }

  setFilterInitailValues() {
    let filterObject = {};
    const prevFilterVal = this.commonService.getLocalItem("fcFilterData");
    if (prevFilterVal !== null && prevFilterVal !== undefined && prevFilterVal !== {}) {
      (this.fcManipulatedSecondLowestPrice = prevFilterVal.fcManipulatedSecondLowestPrice),
        (this.fcDwellingPrice = prevFilterVal.fcDwellingPrice),
        (this.fcDwellingExtensionPrice = prevFilterVal.fcDwellingExtensionPrice),
        (this.fcLiabilityPrice = prevFilterVal.fcLiabilityPrice),
        (this.fcPropertyPrice = prevFilterVal.fcPropertyPrice),
        (this.fcDeductiblePrice = prevFilterVal.fcDeductiblePrice),
        (this.fcWaterBackupPrice = prevFilterVal.fcWaterBackupPrice),
        (this.fcSewerLinePrice = prevFilterVal.fcSewerLinePrice),
        (this.fcEquipmentBreakdownPrice = prevFilterVal.fcEquipmentBreakdownPrice),
        (this.fcReplacementCostPrice = prevFilterVal.fcReplacementCostPrice),
        (this.fcDwelling = prevFilterVal.fcDwelling),
        (this.fcDwellingExtension = prevFilterVal.fcDwellingExtension),
        (this.fcLiability = prevFilterVal.fcLiability),
        (this.fcProperty = prevFilterVal.fcProperty),
        (this.fcDeductible = prevFilterVal.fcDeductible),
        (this.fcWaterBackup = prevFilterVal.fcWaterBackup),
        (this.fcSewerLine = prevFilterVal.fcSewerLine),
        (this.fcEquipmentBreakdown = prevFilterVal.fcEquipmentBreakdown),
        (this.fcReplacementCost = prevFilterVal.fcReplacementCost),
        (filterObject = {
          fcManipulatedSecondLowestPrice: prevFilterVal.fcManipulatedSecondLowestPrice,
          fcDwellingPrice: prevFilterVal.fcDwellingPrice,
          fcDwellingExtensionPrice: prevFilterVal.fcDwellingExtensionPrice,
          fcLiabilityPrice: prevFilterVal.fcLiabilityPrice,
          fcPropertyPrice: prevFilterVal.fcPropertyPrice,
          fcDeductiblePrice: prevFilterVal.fcDeductiblePrice,
          fcWaterBackupPrice: prevFilterVal.fcWaterBackupPrice,
          fcSewerLinePrice: prevFilterVal.fcSewerLinePrice,
          fcEquipmentBreakdownPrice: prevFilterVal.fcEquipmentBreakdownPrice,
          fcReplacementCostPrice: prevFilterVal.fcReplacementCostPrice,

          fcDwelling: prevFilterVal.fcDwelling,
          fcDwellingExtension: prevFilterVal.fcDwellingExtension,
          fcLiability: prevFilterVal.fcLiability,
          fcProperty: prevFilterVal.fcProperty,
          fcDeductible: prevFilterVal.fcDeductible,
          fcWaterBackup: prevFilterVal.fcWaterBackup,
          fcSewerLine: prevFilterVal.fcSewerLine,
          fcEquipmentBreakdown: prevFilterVal.fcEquipmentBreakdown,
          fcReplacementCost: prevFilterVal.fcReplacementCost,
        });
    } else {
      filterObject = {
        fcManipulatedSecondLowestPrice: this.fcManipulatedSecondLowestPrice,
        fcDwellingPrice: this.fcDwellingPrice,
        fcDwellingExtensionPrice: this.fcDwellingExtensionPrice,
        fcLiabilityPrice: this.fcLiabilityPrice,
        fcPropertyPrice: this.fcPropertyPrice,
        fcDeductiblePrice: this.fcDeductiblePrice,
        fcWaterBackupPrice: this.fcWaterBackupPrice,
        fcSewerLinePrice: this.fcSewerLinePrice,
        fcEquipmentBreakdownPrice: this.fcEquipmentBreakdownPrice,
        fcReplacementCostPrice: this.fcReplacementCostPrice,

        fcDwelling: this.fcDwelling,
        fcDwellingExtension: this.fcDwellingExtension,
        fcLiability: this.fcLiability,
        fcProperty: this.fcProperty,
        fcDeductible: this.fcDeductible,
        fcWaterBackup: this.fcWaterBackup,
        fcSewerLine: this.fcSewerLine,
        fcEquipmentBreakdown: this.fcEquipmentBreakdown,
        fcReplacementCost: this.fcReplacementCost,
      };
    }
    this.commonService.setLocalItem("fcFilterData", filterObject);
  }

  resetDwellingExtension() {
    this.filterChange(0, "fcDwellingExtension");
    this.fcDwellingExtension = null;
  }

  liabilityChange(value) {
    this.liabilityValue = value;
    console.log(value, this.liabilityValue);
  }

  deductibleChange(value) {
    this.deductibleValue = value;
    console.log(value, this.deductibleValue);
  }

  filterChange(value, name) {
    console.log(value, name);
    value = typeof value != "boolean" ? parseInt(value) : value;

    if (name == "fcDwelling") {
      //if block  will run when no coverage_a/dwelling comes from hippo
      if (this.dwellingFromhippoMax === 200 && this.dwellingFromhippoMin === 0) {
        this.fcDwellingPrice = (value - this.fcDwelling) * 2500;
      } else {
        const incrementBy = Math.floor((value - this.dwellingFromhippo) / 2500);
        if (incrementBy !== 0) {
          let percent = (this.fcSecondLowestPrice * 1.3) / 100;
          this.fcDwellingPrice = percent * incrementBy;
        }
      }
    }

    if (name == "fcDwellingExtension") {
      this.fcDwellingExtensionPrice = parseInt(value);
    }

    if (name == "fcLiability") {
      if (value === 300000) {
        this.fcLiabilityPrice = 0;
      }

      if (value === 100000) {
        this.fcLiabilityPrice = -12;
      }
      if (value === 500000) {
        this.fcLiabilityPrice = 12;
      }
    }

    if (name == "fcProperty") {
      console.log(value);
      if (this.personalPropertyFromHippoDwellMax === 75 && this.personalPropertyFromHippoDwellMin === 25) {
        this.fcPropertyPrice = (value - 50) * 5000;
      } else {
        const incrementBy = Math.floor((value - this.personalPropertyFromHippoDwell) / 2500);
        if (incrementBy !== 0) {
          let percent = (this.fcSecondLowestPrice * 0.5) / 100;
          this.fcPropertyPrice = percent * incrementBy;
        }
      }
    }

    if (name == "fcDeductible") {
      if (value === 2500) {
        this.fcDeductiblePrice = 0;
      }

      if (value === 5000) {
        this.fcDeductiblePrice = -105;
      }
      if (value === 1000) {
        this.fcDeductiblePrice = 65;
      }
    }

    if (name == "fcWaterBackup") {
      this.fcWaterBackupPrice = value ? 55 : 0;
    }

    if (name == "fcSewerLine") {
      this.fcSewerLinePrice = value ? 45 : 0;
    }

    if (name == "fcEquipmentBreakdown") {
      this.fcEquipmentBreakdownPrice = value ? 5 : 0;
    }
    if (name == "fcReplacementCost") {
      this.fcReplacementCostPrice = value ? 77 : 0;
    }

    this.fcManipulatedSecondLowestPrice =
      this.fcSecondLowestPrice + this.fcDwellingPrice + this.fcDwellingExtensionPrice + this.fcLiabilityPrice + this.fcPropertyPrice + this.fcDeductiblePrice + this.fcWaterBackupPrice + this.fcSewerLinePrice + this.fcEquipmentBreakdownPrice + this.fcReplacementCostPrice;

    const filterObject = {
      fcSecondLowestPrice: this.fcSecondLowestPrice,
      fcManipulatedSecondLowestPrice: this.fcManipulatedSecondLowestPrice,
      fcDwellingPrice: this.fcDwellingPrice,
      fcDwellingExtensionPrice: this.fcDwellingExtensionPrice,
      fcLiabilityPrice: this.fcLiabilityPrice,
      fcPropertyPrice: this.fcPropertyPrice,
      fcDeductiblePrice: this.fcDeductiblePrice,
      fcWaterBackupPrice: this.fcWaterBackupPrice,
      fcSewerLinePrice: this.fcSewerLinePrice,
      fcEquipmentBreakdownPrice: this.fcEquipmentBreakdownPrice,
      fcReplacementCostPrice: this.fcReplacementCostPrice,

      fcDwelling: this.fcDwelling,
      fcDwellingExtension: this.fcDwellingExtension,
      fcLiability: this.fcLiability,
      fcProperty: this.fcProperty,
      fcDeductible: this.fcDeductible,
      fcWaterBackup: this.fcWaterBackup,
      fcSewerLine: this.fcSewerLine,
      fcEquipmentBreakdown: this.fcEquipmentBreakdown,
      fcReplacementCost: this.fcReplacementCost,
    };
    this.commonService.setLocalItem("fcFilterData", filterObject);
    this.finalPrice.emit(this.fcManipulatedSecondLowestPrice);
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

  ngOnInit() {
    this.finalPrice.emit(this.fcManipulatedSecondLowestPrice);

    if (this.disabled) {
      this.disabledInput = this.disabled;
    }

    const totalData = this.commonService.getLocalItem("total_data");
    this.myPrices = Object.values(this.commonService.getLocalItem("calculationData"));
    this.total_data = this.local.get("total_data");
    // console.log("HIPPO Coverage Price: ", JSON.parse(this.total_data["hippo"]).coverage_a);
    //this.dwelling = Number(JSON.parse(this.total_data["hippo"]).coverage_a) > 0 ? Number(JSON.parse(this.total_data["hippo"]).coverage_a) : Number(totalData.zillow.estimate.replace(",", "")) * 1.2;
    //this.fcDwelling=this.dwelling
    // console.log("dwelling Price: ", this.dwelling);

    /*$(window).scroll(function(){
      let docViewTop = $(window).scrollTop();
      let docViewBottom = docViewTop + $(window).height();
      console.log("Window's Height: "+$(window).height());
      console.log("Window's view top: "+docViewTop);

      // let elem = $("app-demo-price-swiper");
      // let elemTop = $(elem).offset().top;
      // let elemBottom = elemTop + $(elem).height();

      // if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
      //   if ($(".fixed-continue").hasClass("fixed")) {
      //     $(".fixed-continue").removeClass("fixed");
      //   }
      // } else {
      //   $(".fixed-continue").addClass("fixed");
      // }
    });*/

    this.setFilterInitailValues();
  }

  ngAfterViewInit() {
    const totalData = this.commonService.getLocalItem("total_data");
    this.flood_zone = "";
    try {
      this.flood_zone = totalData.flood.data.zone;
    } catch (e) {
      this.flood_zone = "";
    }
    this.flood_price = typeof totalData["flood"] != "undefined" && typeof totalData["flood"]["data"] != "undefined" && typeof totalData["flood"]["data"]["premium"] != "undefined" ? totalData["flood"]["data"]["premium"] : "-";

    // console.log(this.myPrices)
    var chartPrices = this.myPrices;
    chartPrices.sort(function (a, b) {
      return a - b;
    });
    // if (chartPrices.length > 8) {
    //   chartPrices.splice(8, (chartPrices.length - 8));
    // }

    chartPrices.forEach((element, i) => {
      if (element != 0 && element != undefined) {
        chartPrices.splice(0, i);
      }
    });

    const bubbleData = chartPrices.map((price, index) => {
      return { x: price, y: index + 1, r: this.getRadius(price, chartPrices), text: "test" };
    });
    const backgroundColors = chartPrices.map((price) => {
      return this.getRandomColorHex();
    });
    const labels = chartPrices.map((price, index) => {
      return "$" + price.toLocaleString();
    });
    // console.log(bubbleData)

    // console.log("labels ===> ", labels);
    this.canvas = document.getElementById("canvas");
    // console.log("canvas", this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    // var yValues = [55, 49, 44, 24, 15];
    // var barColors = ["red", "green","blue","orange","brown"];

    // this.myBubbleChart=new Chart(this.ctx, {
    //   type: "bar",
    //   data: {
    //     labels: xValues,
    //     datasets: [{
    //       backgroundColor: barColors,
    //       data: yValues
    //     }]
    //   },

    // });

    this.myBubbleChart = new Chart(this.ctx, {
      type: "horizontalBar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Prices",
            data: chartPrices,
            backgroundColor: "#bee6f6",
            barThickness: this.commonService.isMobileMode() ? 20 : 25,
            barPercentage: 0.5,
          },
        ],
      },
      options: {
        layout: {
          padding: 10,
        },
        scales: {
          responsive: false,
          legend: {
            display: false,
          },
          xAxes: [
            {
              ticks: {
                fontSize: 12,
                display: false,
              },
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontSize: 12,
                beginAtZero: true,
              },
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
        },
        /* responsive: false,
        legend: {
          display: false
        },
        scales: {
          ticks: {
            maxTicksLimit: 3
          },
          xAxes: [{
            ticks: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              fontSize: 12,
              beginAtZero: true,
            },
            gridLines: {
              display: false
            }
          }]
        }, */
      },
    });
    // document.getElementById('chart_sec').style.display = "none";
  }

  ngAfterViewChecked() {
    /* $(window).scroll(function(){
      let docViewTop = $(window).scrollTop();
      let docViewBottom = docViewTop + $(window).height();
      console.log("Window's Height: "+$(window).height());
      console.log("Window's view top: "+docViewTop);

        let elem = $("app-demo-price-swiper");
        let elemTop = $(elem).offset().top;
        let elemBottom = elemTop + $(elem).height();

        if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
          if ($(".fixed-continue").hasClass("fixed")) {
            $(".fixed-continue").removeClass("fixed");
          }
        } else {
          $(".fixed-continue").addClass("fixed");
        }
    }); */
    /* console.log("Window Height: "+$(window).height());
    console.log("Window Top: "+$(window).scrollTop()); */
  }

  sendEmail($event) {
    this.prices = $event;
    this.showModal.emit(true);
  }

  downloadPdf($event) {
    this.prices = $event;
    this.sendPdf.sendDemoEmailFunc(true, this.prices);
  }

  async goToThreeStep() {
    const total_data = this.commonService.getLocalItem("total_data");
    total_data["mode"] = 0;
    this.commonService.setLocalItem("total_data", total_data);
    this.router.navigate(["/step3"]);
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

  refresh() {
    location.href = "/";
  }

  round(value) {
    return Math.round(value);
  }

  getRandomColorHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  getRadius(value: number, array: number[]) {
    let maxValue = Math.max(...array);
    return Math.round((value * 20) / maxValue);
  }

  modalBackdrop() {
    $("body").addClass("heder_modal_backdrop");
  }

  onKey(event: any) {
    // without type info
    this.otherStructuresMinValue += Number(event.target.value);
  }
}
