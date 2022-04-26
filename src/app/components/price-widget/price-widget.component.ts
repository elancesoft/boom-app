import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "../../services/common.service";
@Component({
  selector: "app-price-widget",
  templateUrl: "./price-widget.component.html",
  styleUrls: ["./price-widget.component.scss"],
})
export class PriceWidgetComponent implements OnInit {

  @Input("data") public data:any;
  @Input("hideSelectPlan") public hideSelectPlan:any=false;
  @Output("selectPlan") selectPlan: EventEmitter<any> = new EventEmitter();
  // @Input("imgURL") public imgURL: any;
  // @Input("name") public name: string;
  // @Input("bgColor") public bgColor: string;
  // @Input("price") public price: number;
  // @Input("dwelling") public dwelling: string;
  // @Input("currpage") public currpage: string;
  // @Input("pricesType") public pricesType: any;
  // @Input("showButtons") public showButtons: boolean = true;
  // @Input("static") public staticCard: boolean = false;
  // @Input() public hideGo: boolean = false;
  // @Output("openModal") public openPriceModal: EventEmitter<any> = new EventEmitter<any>();

  completeObject = [];
  homeSlider: object = {};

  constructor(public commonService: CommonService, public router: Router) {
    // console.log('data',this.data)

    //this.initOwlElement();
  }

  ngOnInit() {
    // console.log(this.data.name,this.data)
    if(this.data.name==='nationwide'){
      this.data.result.dwelling=this.data.result.dwelling.replace('$','')
      this.data.result.liability=this.data.result.liability.replace('$','')
      this.data.result.deductible=this.data.result.deductible.replace('$','')
      this.data.result.personalProperty=this.data.result.personalProperty.replace('$','')
    }
    else{
      this.data.result.dwelling=this.convertToLocalString(this.data.result.dwelling)
      this.data.result.liability=this.convertToLocalString(this.data.result.liability)
      this.data.result.deductible=this.convertToLocalString(this.data.result.deductible)
      this.data.result.personalProperty=this.convertToLocalString(this.data.result.personalProperty)
    }
   
  }
  ngOnChanges(){ 
    console.log(this.data.name,this.data.result)
    
  }

  convertToLocalString(data:any){
    if(typeof data!==undefined && typeof data!=='number'){
      return parseInt(data).toLocaleString()
    }
    return data.toLocaleString()
  }

  clickSelectPlan(plan){
    console.log('child',plan)
    this.selectPlan.emit(plan)
  }
}
