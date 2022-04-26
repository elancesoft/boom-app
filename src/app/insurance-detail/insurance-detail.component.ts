import { Component, OnInit , ViewChild, EventEmitter, Output } from '@angular/core';
import {CommonService} from "../services/common.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { DatePickerComponent,  FocusEventArgs } from '@syncfusion/ej2-angular-calendars';
import {Location} from '@angular/common';
import { Options } from 'ng5-slider';
import * as $ from "jquery";
import { ApiService } from "../services/api-service";



@Component({
  selector: 'app-insurance-detail',
  templateUrl: './insurance-detail.component.html',
  styleUrls: ['./insurance-detail.component.scss']
})
export class InsuranceDetailComponent implements OnInit {


  @ViewChild('policy_start_date', { static: false })
  @Output("openModal") public openPriceModal: EventEmitter<any> = new EventEmitter<any>();
  // public datepickerObj: CalendarComponent;
  public datepickerObj : DatePickerComponent;

  onFocus(args: FocusEventArgs): void {
      this.datepickerObj.show();
  }

  spectrum_val: number = 50;
  modal_range_picker: Options = {
    floor: 0,
    ceil: 100
  };




  public InsuranceData : any;
  public zillowData : any;
  public start_date:string;
  public lender_email: string = "";
  public isHaveMortgage: boolean;
  public is_leader_email: boolean;
  public hippolink: string;
  public hippoprice: string;
  listpriceWidgetCommonClass = "mr-4 ml-md-0 ml-4 col-md-4 my-2 form-row";
  fullAddressText = "";
  startDate: any;

  square = '';
  builtyear = '';
  estimate = '';
  lat: number = 0;
  lng: number = 0;

  popupStatus =0;
  flood_zone = '';
  neptuneFlood = "";
  neptuneFloodPrice = 0;
  insuranceImgs=[]


  selectedPlan=null

  constructor(public commonService:CommonService, public router:Router, private formBuilder: FormBuilder, private _location: Location,public apiService: ApiService) {
    this.InsuranceData = this.commonService.getLocalItem('total_data').selected_insurance_data;
    this.selectedPlan = this.commonService.getLocalItem('selectedPlan')
    this.fullAddressText = this.commonService.getLocalItem("total_data").address_components.formatted_address;
    this.zillowData = this.commonService.getLocalItem("total_data").zillow;

    let hippo = this.commonService.getLocalItem("total_data").hippo;
    this.hippolink = JSON.parse(hippo).quote_url;
    this.hippoprice = JSON.parse(hippo).quote_premium;

    this.generateMapData();
    const totalData = this.commonService.getLocalItem("total_data");
    this.square = totalData.zillow.square;
    this.builtyear = totalData.zillow.built_year;
    this.estimate = totalData.zillow.estimate;

    this.flood_zone = '';
    try {
      this.flood_zone = totalData.flood.data.zone
    } catch (e) {
      this.flood_zone = '';
    }

    if(typeof totalData.flood != "undefined" && typeof totalData.flood.data != "undefined" && typeof totalData.flood.data.premium != "undefined"){
      this.neptuneFloodPrice = totalData.flood.data.premium;
      this.neptuneFlood = totalData.flood.data.zone;
    }
    console.log(this.InsuranceData)

    // this.insuranceImgs = [
    //   {
    //     slideImg:  this.InsuranceData.imgURL,
    //     caroImages: [this.InsuranceData.caroImages[0]]
    //   }
  //  ]
  //  this.isHaveMortgage=totalData['mortgage_data']['is_mortgage']
  //  this.lender_email=totalData['mortgage_data']['lender_email']
  //  this.start_date=totalData['mortgage_data']['start_date']


  }





  bgColor: any =["darkblue","darkgreen","red","darkred","#5bc0de","lightblue","#167EF8","green","darkyellow"];

  public userForm: FormGroup;

  ngOnInit() {
    this.initForm();
    this.startDate = localStorage.getItem('startDate');
  }

  next(value: boolean) {
    // if(!this.start_date) {
    //   this.commonService.modalOpen("Error", "Please select policy start date.");
    //   return;
    // }
    this.isHaveMortgage=value
    let obj={
      lender_email:this.lender_email,
      start_date:this.start_date,
      is_mortgage:this.isHaveMortgage
    }
    if(!this.isHaveMortgage){
      obj['lender_email']= ''
      this.commonService.applyTotalData('mortgage_data',obj );
      location.href = "/policy-chat";
      // this.router.navigateByUrl('/policy-chat');
      this.sendEmail(obj)
    }else{
      this.commonService.applyTotalData('mortgage_data',obj );
    }



    return
    // const total_data = this.commonService.getLocalItem('total_data');
    // let mortgage_data = total_data['mortgage_data'];
    // this.isHaveMortgage = value;
    // if(!mortgage_data) mortgage_data = {};
    // mortgage_data['is_mortgage'] = this.isHaveMortgage;
    // mortgage_data['startdate'] = this.start_date;
    // if(!this.isHaveMortgage){
    //   mortgage_data['lender_email'] = '';
    //   this.commonService.applyTotalData('mortgage_data', mortgage_data);
    //  // console.log('mortgage_data', mortgage_data)
    //    this.router.navigateByUrl('/policy-chat');
    //   // window.location.href = '/policy-chat';
    //   //location.href = "/policy-chat";
    //   return;
    // }else if(this.isHaveMortgage && this.is_leader_email != true){
    //   this.is_leader_email = true;
    //   let formData = {
    //     leader_email: new FormControl("", [Validators.required, Validators.pattern(
    //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    //   };
    //   this.userForm = new FormGroup(formData);
    // }



    /*this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/policy-mortgage-info');*/
  }

  initForm(){
    this.userForm = this.formBuilder.group({
      leader_email: ['', Validators.required],
    })
  }

  saveLeaderInfo(formValue){
    console.log('this.userForm',formValue)
    if(this.userForm.valid){
      let obj={
        lender_email:this.lender_email,
        start_date:this.start_date,
        is_mortgage:this.isHaveMortgage
      }
      this.commonService.applyTotalData('mortgage_data',obj );

       //this.router.navigateByUrl('/policy-chat');
       this.sendEmail(obj)
      location.href = "/policy-chat";
    }else{
      this.commonService.modalOpen("Error", "Please provide your contact email at your mortgage company.");
      return;
    }
  }

  sendEmail(mailData){
    this.apiService.sendMortgageEmail(mailData).subscribe((data)=>{
      console.log('email',data)
    })
  }



  back() {
    // this.openPriceModal.emit('stepsix');
    location.href = "/step3";
    // this.commonService.updateTabSource('Tab8')
    localStorage.setItem('tab', 'Tab9')
  }

  refresh() {
    location.href = "/";
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
  modalBackdrop(){
    $("body").addClass("heder_modal_backdrop");
  }
}
