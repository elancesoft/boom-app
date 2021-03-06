import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../services/common.service";
import { ApiService } from "../services/api-service";
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import * as $ from "jquery";
import { Subscription } from "rxjs";
import { DatePickerComponent, FocusEventArgs } from "@syncfusion/ej2-angular-calendars";
import * as moment from "moment";
import { Options } from "ng5-slider";

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-property-form",
  templateUrl: "./property-form.component.html",
  styleUrls: ["./property-form.component.scss"],
})
export class PropertyFormComponent implements OnInit, DoCheck {
  @ViewChild("property_form", { static: false })
  // public datepickerObj: CalendarComponent;
  public datepickerObj: DatePickerComponent;

  onFocus(args: FocusEventArgs): void {
    this.datepickerObj.show();
  }

  spectrum_val: number = 50;
  modal_range_picker: Options = {
    floor: 0,
    ceil: 100,
  };

  minForDOB = moment().subtract(18, "years").format("MM/DD/YYYY");

  builtyear = "";

  constructionType: number;
  foundationType: number;
  isBasement: number;
  buildingType: number;
  square: number;
  built_year: number;

  HomeType: string = "";
  RoofShape: string = "";
  RoofType: string = "";

  ac_year: string = "";
  electric_year: string = "";
  plumbing_year: string = "";
  roof_year: string = "";

  roof_status: string;
  staticAddress: string;
  roof_type: number;
  exterior_type: number;
  progress = 10;
  currentTab = "Tab1";
  sliderCurrentIndex = 0;
  cards = [];
  estimate = "";

  flood_zone = "";
  neptuneFlood = "";
  neptuneFloodPrice = 0;

  formattedAddress = "";
  personData = [
    {
      first_name: "",
      last_name: "",
      birthday: "1995-02-14",
      dob: "",
    },
  ];
  email: string = "";
  phone: string = "";
  // userForm: FormGroup;
  highPrice: number;
  lowPrice: number;

  popupStatus = 0;

  isForward: boolean;
  currentDate = new Date();
  roofTypeValues: any;
  sliderCards = [
    {
      title: "Asphalt shingle",
      description: "",
      img: "../../assets/images/roofs/asphalt-shingle.png",
    },
    {
      title: "Wood shingle",
      description: "",
      img: "../../assets/images/roofs/wood%20shingle.png",
    },
    {
      title: "Slate roof",
      description: "",
      img: "../../assets/images/roofs/slate%20roof.png",
    },
    {
      title: "Rubber",
      description: "",
      img: "../../assets/images/roofs/rubber.png",
    },
    {
      title: "Concrete Tile",
      description: "",
      img: "../../assets/images/roofs/concrete%20tile.png",
    },
    {
      title: "Solar",
      description: "",
      img: "../../assets/images/roofs/solar.png",
    },
    {
      title: "Tile roof",
      description: "",
      img: "../../assets/images/roofs/tile%20roof.png",
    },
    {
      title: "Tar and Gravel",
      description: "",
      img: "../../assets/images/roofs/tar%20and%20gravel.png",
    },
    {
      title: "Composition Shingle",
      description: "",
      img: "../../assets/images/roofs/compostion%20shingle.png",
    },
  ];
  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  clickEventsubscription: Subscription;
  homeSlider: object = {
    items: 4,
    dots: true,
    nav: true,
    autoplay: false,
    loop: false,
    margin: 15,
    responsive: {
      0: {
        items: 2,
        dots: false,
      },
      400: {
        items: 2,
        dots: false,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
  };
  lat: number;
  lng: number;
  sqft: number;
  year: number;

  update_zillow: boolean = false;

  fcPrivacyCheck: boolean = false;
  fcShowTermsAndConditions: boolean = true;

  userForm: FormGroup;

  get relations() {
    return this.userForm.controls["relations"] as FormArray;
  }

  addRelation() {
    this.relations.push(
      this.formBuilder.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        dob: ["", Validators.required],
        relation: ["", Validators.required],
      })
    );
  }

  deleteRelation(relationIndex: number) {
    this.relations.removeAt(relationIndex);
  }
  open(privacyContent) {
    this.modalService.open(privacyContent, { ariaLabelledBy: "modal-basic-title" }).result.then(
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  constructor(private modalService: NgbModal, public router: Router, public local: LocalStorageService, public commonService: CommonService, public apiService: ApiService, private formBuilder: FormBuilder) {
    this.clickEventsubscription = this.commonService.getClickEvent().subscribe((isForward) => {
      this.isForward = isForward;
      this.moveTab(this.isForward);
    });

    this.generateMapData();
    const totalData = this.commonService.getLocalItem("total_data");
    this.builtyear = totalData.zillow.built_year;
    this.flood_zone = "";
    try {
      this.flood_zone = totalData.flood.data.zone;
    } catch (e) {
      this.flood_zone = "";
    }

    if (typeof totalData.flood != "undefined" && typeof totalData.flood.data != "undefined" && typeof totalData.flood.data.premium != "undefined") {
      this.neptuneFloodPrice = totalData.flood.data.premium;
      this.neptuneFlood = totalData.flood.data.zone;
    }

    this.roofTypeValues = [
      { label: this.currentDate.getFullYear(), value: this.currentDate.getFullYear() },
      { label: this.currentDate.getFullYear() - 1, value: this.currentDate.getFullYear() - 1 },
      { label: this.currentDate.getFullYear() - 2, value: this.currentDate.getFullYear() - 2 },
      { label: this.currentDate.getFullYear() - 3, value: this.currentDate.getFullYear() - 3 },
      { label: this.currentDate.getFullYear() - 4, value: this.currentDate.getFullYear() - 4 },
      { label: this.currentDate.getFullYear() - 5, value: this.currentDate.getFullYear() - 5 },
      {
        label: this.currentDate.getFullYear() - 6 + " - " + (this.currentDate.getFullYear() - 20),
        value: this.currentDate.getFullYear() - 6 + " - " + (this.currentDate.getFullYear() - 20),
      },
      { label: this.currentDate.getFullYear() - 20 + " +", value: this.currentDate.getFullYear() - 20 + " +" },
    ];
  }

  async ngOnInit() {
    console.log("this.minForDOB", this.minForDOB);
    let toLastStep = await this.commonService.getLocalItem("toLastStep");
    if (toLastStep) {
      this.currentTab = "Tab9";
    }
    //this.initUserForm();
    let data = await this.commonService.getLocalItem("total_data");
    this.staticAddress = data["static_address"];
    this.estimate = data["zillow"]["estimate"];
    this.built_year = data["zillow"]["built_year"];
    this.square = data["zillow"]["square"];
    this.formattedAddress = data["address_components"]["formatted_address"];
    this.slides = this.chunk(this.sliderCards, this.commonService.isMobileMode() ? 2 : 4);
    this.cards = this.slides[this.sliderCurrentIndex];
    this.loadValue();
    $(".footerFlag").addClass("d-none");
    //just for moving directly to that tab
    //this.currentTab = 'Tab9'

    function validate18plus(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
          return null;
        }
        const age = moment().diff(value, "years");
        const ageValid = age >= 18;
        return !ageValid ? { underage: false } : null;
      };
    }
    let fcUserBasic = await this.commonService.getLocalItem("fcUserBasic");
    // console.log(fcUserBasic, 'fcUserBasic')

    this.userForm = this.formBuilder.group({
      // email: new FormControl("", [Validators.required, Validators.email]),
      // phone: new FormControl("", [Validators.required]),
      firstName: new FormControl(fcUserBasic ? fcUserBasic["firstName"] : "", [Validators.required]),
      lastName: new FormControl(fcUserBasic ? fcUserBasic["lastName"] : "", [Validators.required]),
      dob: new FormControl(fcUserBasic ? fcUserBasic["dob"] : "", [Validators.required, validate18plus()]),
      relations: this.formBuilder.array([
        // this.formBuilder.group({
        //   firstName: ['', Validators.required],
        //   lastName: ['', Validators.required],
        //   dob: ['', [Validators.required, validate18plus()]],
        //   relation: ['', Validators.required],
        // })
      ]),
    });

    this.personData[0] = {
      first_name: fcUserBasic.firstName,
      last_name: fcUserBasic.lastName,
      birthday: fcUserBasic.dob,
      dob: fcUserBasic.dob,
    };
    // console.log('this.personData', this.personData)

    this.fcShowTermsAndConditions = !fcUserBasic.termsAndConditions;
  }

  

  ngDoCheck() {
    
      console.log('roof_status',this.roof_status)
      console.log('RoofShape',this.RoofShape)
      console.log('roof_type',this.roof_type)
      console.log('tab',this.currentTab)
    
    let tab8 = localStorage.getItem("tab");
    if (tab8 === "Tab9") {
      this.currentTab = tab8;
    }
  }

  async loadValue() {
    let data = await this.commonService.getLocalItem("total_data");
    data["construction_type"] == undefined ? this.constructionType : (this.constructionType = data["construction_type"]);
    data["foundation_type"] == undefined ? this.foundationType : (this.foundationType = data["foundation_type"]);
    data["square"] == undefined ? (this.square = data["zillow"]["square"]) : (this.square = data["square"]);
    data["built_year"] == undefined ? (this.built_year = data["zillow"]["built_year"]) : (this.built_year = data["built_year"]);
    data["is_basement"] == undefined ? this.isBasement : (this.isBasement = data["is_basement"]);
    data["ac_year"] == undefined ? this.ac_year : (this.ac_year = data["ac_year"]);
    data["building_type"] == undefined ? this.buildingType : (this.buildingType = data["building_type"]);
    data["electric_year"] == undefined ? this.electric_year : (this.electric_year = data["electric_year"]);
    data["plumbing_year"] == undefined ? this.plumbing_year : (this.plumbing_year = data["plumbing_year"]);
    data["roof_status"] == undefined ? this.roof_status : (this.roof_status = data["roof_status"]);
    data["roof_year"] == undefined ? this.roof_year : (this.roof_year = data["roof_year"]);
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

  slide(isLeft: boolean) {
    if (isLeft) {
      if (this.sliderCurrentIndex > 0) {
        this.sliderCurrentIndex--;
        this.cards = this.slides[this.sliderCurrentIndex];
      }
    } else {
      if (this.sliderCurrentIndex < this.cards.length - 1) this.sliderCurrentIndex++;
      this.cards = this.slides[this.sliderCurrentIndex];
    }
  }

  async moveTab(isForward: boolean) {
    console.log("isForward 1 ", isForward);
    console.log("isForward 2 ", this.currentTab);
    switch (this.currentTab) {
      case "Tab1": {
        if (isForward) {
          this.progress += 10;
          this.currentTab = "Tab2";
        }
        break;
      }
      case "Tab2": {
        if (isForward) {
          this.progress += 10;
          this.currentTab = "Tab3";
          console.log(this.currentTab);
        } else {
          this.progress -= 10;
          this.currentTab = "Tab1";
        }
        break;
      }
      case "Tab3": {
        if (isForward) {
          this.progress += 10;
          this.currentTab = "Tab4";
        } else {
          this.progress -= 10;
          this.currentTab = "Tab2";
        }
        break;
      }
      case "Tab4": {
        if (isForward) {
          this.progress += 10;
          this.currentTab = "Tab5";
        } else {
          this.progress -= 10;
          this.currentTab = "Tab3";
        }
        break;
      }
      case "Tab5": {
        if (isForward) {
          if (this.validateAllInputs(false)) {
            this.currentTab = "Tab6";
            this.progress += 10;
            var foundationType = "";
            var constructionType = "";

            if (this.foundationType === 1) {
              foundationType = "Basement";
            } else if (this.foundationType === 2) {
              foundationType = "Craw Space";
            } else {
              foundationType = "Slab";
            }

            if (this.constructionType === 1) {
              constructionType = "Wood Frame";
            } else if (this.constructionType === 2) {
              constructionType = "Steal Frame";
            } else if (this.constructionType === 3) {
              constructionType = "Masonry/Brick";
            } else {
              constructionType = "Concrete";
            }
            var property = {
              built_year: this.built_year,
              square: this.square,
              foundationType: foundationType,
              constructionType: constructionType,
            };
            var total_data = this.commonService.getLocalItem("total_data");
            total_data.property = property;
            this.commonService.setLocalItem("total_data", total_data);
          }
        } else {
          this.progress -= 10;
          this.currentTab = "Tab4";
        }
        break;
      }
      case "Tab6": {
        if (isForward) {
          this.currentTab = "Tab7";
          this.progress += 10;
          var isBasement = "";
          if (this.isBasement === 1) {
            isBasement = "Yes";
          } else {
            isBasement = "No";
          }
          var upgrade = {
            basement_finished: isBasement,
            roof_year: this.roof_year,
            plumbing_year: this.plumbing_year,
            ac_year: this.ac_year,
            electric_year: this.electric_year,
          };
          var total_data = this.commonService.getLocalItem("total_data");
          total_data.upgrade = upgrade;
          this.commonService.setLocalItem("total_data", total_data);
        } else {
          this.currentTab = "Tab5";
          this.progress -= 10;
        }
        break;
      }
      case "Tab7": {
        if (isForward) {
          if (this.validateAllInputs(false)) {
            let data = await this.commonService.getLocalItem("total_data");
            // if (data["personData"] != undefined) {
            //   this.personData = data["personData"];
            //   console.log('this.personData', this.personData)
            // }
            this.email = data["email"];
            this.phone = data["phone"] != undefined ? data["phone"].replace(/-/g, "") : "";
            this.calcPriceRange(data);
            this.currentTab = "Tab8";
            //this.validateUserForm();
            this.progress += 10;
            var exterior = "";

            switch (this.exterior_type) {
              case 1:
                exterior = "Aluminum Siding";
                break;
              case 2:
                exterior = "Brick Veneer";
                break;
              case 3:
                exterior = "Brick";
                break;
              case 4:
                exterior = "Concrete";
                break;
              case 5:
                exterior = "Hardiplank";
                break;
              case 6:
                exterior = "Stone Veneer";
                break;
              case 7:
                exterior = "Stone";
                break;
              case 8:
                exterior = "Stucco Siding";
                break;
              case 9:
                exterior = "Vinyl Siding";
                break;
              case 10:
                exterior = "Wood Siding";
                break;
              default:
              // code block
            }

            var total_data = this.commonService.getLocalItem("total_data");
            total_data.exterior = exterior;
            this.commonService.setLocalItem("total_data", total_data);
          }
        } else {
          this.currentTab = "Tab6";
          this.progress -= 10;
        }
        break;
      }
      case "Tab8": {
        if (!isForward) {
          this.currentTab = "Tab7";
          this.progress -= 10;
        } else {
          if (this.userForm.invalid) {
            this.commonService.modalOpen("Error", "Please complete all required fields.");
            return;
          }
          this.progress += 10;
          this.submitUserData();
          console.log("this.progress", this.progress);
          this.currentTab = "Tab9";
        }
        break;
      }
      case "Tab9": {
        if (!isForward) {
          this.currentTab = "Tab8";
        }
        break;
      }

      default:
        break;
    }
  }

  validateAllInputs(rtCheck: boolean) {
    switch (this.currentTab) {
      case "Tab5":
        if (this.RoofType == undefined) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct built year.");
          return false;
        }
        break;
      case "Tab6": {
        if (this.isBasement == undefined) {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct basement.");
          return false;
        }
        if (this.roof_year.trim() == "") {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct roof year.");
          return false;
        }
        if (this.plumbing_year.trim() == "") {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct plumbing year.");
          return false;
        }
        if (this.ac_year.trim() == "") {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct A/C year.");
          return false;
        }
        if (this.electric_year.trim() == "") {
          if (!rtCheck) this.commonService.modalOpen("Error", "Please type the correct electric year.");
          return false;
        }
        if (this.roof_type == undefined) {
          this.commonService.modalOpen("Error", "Please type the correct roof type.");
          return false;
        }
        break;
      }

      case "Tab7": {
        if (this.exterior_type == undefined) {
          this.commonService.modalOpen("Error", "Please type the correct exterior type.");
          return false;
        }
        break;
      }
      case "Tab8": {
        this.submitUserData();
        console.log("this.progress", this.currentTab);
        break;
      }
    }
    return true;
  }

  // async validateUserForm(){
  //   let formData = {
  //     "emailInput": new FormControl(this.email, [Validators.required]),
  //       "phoneInput": new FormControl(this.phone,Validators.required),
  //   };
  //   for (let i = 0; i < this.personData.length; i++) {
  //     formData['firstnameInput' + i] = new FormControl(this.personData[i]['first_name'],Validators.required);
  //     formData['lastnameInput' + i] = new FormControl(this.personData[i]['last_name'],Validators.required);
  //     formData['birthdayInput' + i] = new FormControl(this.personData[i]['dob'],Validators.required);
  //     formData['relationInput' + i] = new FormControl(this.personData[i]['relation'],Validators.required);
  //   }
  //   this.userForm = new FormGroup(formData);
  // }

  // addPerson() {
  //   if (this.personData.length < 5) {
  //     this.personData[this.personData.length] = {first_name: '', last_name: '',birthday:'1995-02-14', dob: ''};
  //   }
  //   this.validateUserForm();
  // };

  // deletePerson(key) {
  //   this.personData.splice(key, 1);
  //   this.validateUserForm();
  // }

  // get emailInput() {
  //   return this.userForm.get('emailInput');
  // }

  // get phoneInput() {
  //   return this.userForm.get('phoneInput');
  // }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + "-" + match[2] + "-" + match[3];
    }
    return null;
  }

  async submitUserData() {

    localStorage.removeItem("tab");
    this.commonService.spinnerService.show();
    let total_data = await this.commonService.getLocalItem("total_data");
    total_data["construction_type"] = this.constructionType;
    total_data["foundation_type"] = this.foundationType;
    total_data["square"] = this.square;
    total_data["built_year"] = this.built_year;
    total_data["ac_year"] = this.ac_year;
    total_data["electric_year"] = this.electric_year;
    total_data["plumbing_year"] = this.plumbing_year;
    total_data["roof_year"] = this.roof_year;
    total_data["is_basement"] = this.isBasement;
    total_data["exterior_type"] = this.exterior_type;
    total_data["roof_type"] == undefined ? this.roof_type : (this.roof_type = total_data["roof_type"]);
    total_data["personData"] = this.personData;
    total_data["email"] = this.email;
    total_data["phone"] = this.formatPhoneNumber(this.phone);
    total_data["low_price"] = this.lowPrice;
    total_data["high_price"] = this.highPrice;
    total_data["building_type"] = 1;
    total_data["roof_type"] = 1;
    total_data["roof_status"] = this.roof_status
    total_data["construction_type"] = this.constructionType;

    await this.commonService.setLocalItem("total_data", total_data);
  }

  async calcPriceRange(total_data) {
    const commonPricing = await this.commonService.getPricings(total_data);
    this.lowPrice = commonPricing["lowPrice"];
    this.highPrice = commonPricing["highPrice"];
  }

  setKeyValue(key, value) {
    this[key] = value;

    if(key==='RoofShape'){
      this.roof_status=this.RoofShape.toLocaleLowerCase()
    }

    if (this.foundationType && this.constructionType && this.built_year && this.square) {
      this.moveTab(true);
    }
    if (this.currentTab == "Tab1" && this.HomeType != "") {
      this.moveTab(true);
    }

    if (this.currentTab == "Tab3" && this.foundationType > 0) {
      this.moveTab(true);
    }

    if (this.currentTab == "Tab4" && this.RoofShape != "") {
      this.moveTab(true);
    }

    if (this.currentTab == "Tab5" && this.RoofType != "") {
      this.moveTab(true);
    }
  }

  setZillowData() {
    if (this.square == 0 || this.built_year == 0 || this.square == null || this.built_year == null) {
      this.commonService.modalOpen("Error", "Please fill proper square size / built year value.");
      return;
    }
    let zillowData = this.commonService.getLocalItem("total_data").zillow;
    zillowData.square = this.square;
    zillowData.built_year = this.built_year;
    this.commonService.applyTotalData("zillow", zillowData);
    this.moveTab(true);
  }

  setKeyBasement(key, value) {
    this[key] = value;
    /* if (this.roof_type && this.roof_year && this.plumbing_year && this.ac_year && this.electric_year && this.isBasement) { */
    if (this.roof_year && this.plumbing_year && this.ac_year && this.electric_year) {
      this.moveTab(true);
    }
  }

  setblur(event, key) {
    console.log(event.target.value);
    this.setKeyBasement(key, event.target.value);
  }

  setKeyExteriorType(key, value) {
    this[key] = value;
    this.moveTab(true);
  }

  // initUserForm(){
  //   this.userForm = this.formBuilder.group({
  //     birthdayInput0: new FormControl(['', Validators.required]),
  //     emailInput: new FormControl(['', Validators.required]),
  //     firstnameInput0: new FormControl(['', Validators.required]),
  //     lastnameInput0: new FormControl(['', Validators.required]),
  //     relationInput0: new FormControl(['', Validators.required]),
  //     phoneInput: new FormControl(['', Validators.required]),
  //   })
  // }

  sendMail(userForm) {
    this.modalService.dismissAll();

    // if(new Date(userForm.birthdayInput0) > new Date(this.minForDOB)){
    //   this.commonService.modalOpen("Error", "Age must be 18 and above.");
    //   return;
    // }

    //this.local.set('fcPropertyFormData',this.userForm.value)

    if (this.userForm.invalid) {
      this.commonService.modalOpen("Error", "Please complete all required fields.");
      return;
    }

    if (this.validateAllInputs(false)) {
      this.commonService.setLocalItem("fcUserBasic", this.userForm.value);
      var total_data = this.commonService.getLocalItem("total_data");
      var mailBody = {
        address: total_data.address_components.formatted_address,
        built_year: this.built_year,
        square: this.square,
        foundation: total_data.property.foundationType,
        RoofShape: this.RoofShape,
        RoofType: this.RoofType,
        roof_year: total_data.upgrade.roof_year,
        electric_year: total_data.upgrade.electric_year,
        plumbing_year: total_data.upgrade.plumbing_year,
        ac_year: total_data.upgrade.ac_year,
        construction_type: total_data.property.constructionType,
        exterior_type: total_data.exterior,
        personData: this.personData,
        HomeType: this.HomeType,
        // email: this.userForm.value.email,
        // phone: this.userForm.value.phone,
        name: this.userForm.value.firstname + " " + this.userForm.value.lastname,
        dob: this.userForm.value.dob,
        relations: this.userForm.value.relations,
      };
      console.log(mailBody, this.userForm.value);
      //this.apiService.sendMail(mailBody).subscribe(
      //(res) => {
      //console.log('API sendMail', res)
      //console.log('CCCCCCCCCC')
      //this.moveTab(true);
      //},
      //(err) => {
      //console.log(err);
      // }
      //);
      this.router.navigate(['/', 'course-relation']);
    }
  }

  refresh() {
    location.href = "/";
  }

  zillowEdit(e) {
    // For hide edit text
    document.getElementById("edit_zillow_btn").style.display = "none";

    // For add class in zillow-data-section id.
    var x = document.getElementById("zillow-data-section");

    let divs = document.getElementsByClassName("zillow-data-input");
    for (let index = 0; index < divs.length; ++index) {
      // divs[index].removeAttribute('readonly');
    }

    if ((<Element>x).classList.contains("update-zillow-detail")) {
      (<Element>x).classList.remove("update-zillow-detail");
    }
    if ((<Element>x).classList.contains("hide-zillow-update")) {
      (<Element>x).classList.remove("hide-zillow-update");
    }
    (<Element>x).classList.add("update-zillow-detail");
    this.update_zillow = true;
  }

  systemChange(event) {
    if (
      document.getElementById("roof_system").nodeValue != "" &&
      document.getElementById("eletrical_system").nodeValue != "" &&
      document.getElementById("plumbing_system").nodeValue != "" &&
      document.getElementById("eletrical_system").nodeValue != "" &&
      document.getElementById("ac_system").nodeValue != ""
    ) {
      this.moveTab(true);
    }
  }
  modalBackdrop() {
    $("body").addClass("heder_modal_backdrop");
  }
  tabback() {
    if (this.currentTab === "Tab1") {
      this.commonService.back("property-form");
    } else {
      let tab;
      tab = this.currentTab.split("Tab");
      tab = parseInt(tab[1]) - 1;
      this.currentTab = "Tab" + tab.toString();
    }
  }
}
