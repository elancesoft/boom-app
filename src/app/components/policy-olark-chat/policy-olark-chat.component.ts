import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OlarkService } from "../../services/olark.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../../services/common.service";
import { Options } from 'ng5-slider';
import * as $ from "jquery";
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import { ApiService } from 'src/app/services/api-service';

@Component({
  selector: 'app-policy-olark-chat',
  templateUrl: './policy-olark-chat.component.html',
  styleUrls: ['./policy-olark-chat.component.scss']
})
export class PolicyOlarkChatComponent implements OnInit, AfterViewInit {

  spectrum_val: number = 50;
  modal_range_picker: Options = {
    floor: 0,
    ceil: 100
  };

  showChat: boolean = false;
  chatPricing: number;
  chatType: number;
  imgURL: string;


  public start_date: string;
  public InsuranceData: any;
  public zillowData: any;
  public isHaveMortgage: boolean;
  public hippolink: string;
  public hippoprice: string;
  listpriceWidgetCommonClass = "mr-4 ml-md-0 ml-4 col-md-4 my-2 form-row";
  fullAddressText = "";
  public mortgageData: any;

  square = '';
  builtyear = '';
  estimate = '';
  lat: number = 0;
  lng: number = 0;

  popupStatus = 0;
  flood_zone = '';
  neptuneFlood = "";
  neptuneFloodPrice = 0;


  insuranceImgs = []
  selectedPlan=null

  // insuranceImgs = [
  //   {
  //     slideImg: '../../assets/images/metlife_new_logo.png',
  //     caroImages: [
  //       "../../../assets/images/insurelist-caro/insure-list-img-caro.jpg",
  //       "../../../assets/images/insurelist-caro/insure-list-img-caro.jpg",
  //       "../../../assets/images/insurelist-caro/insure-list-img-caro.jpg"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/SVG/nationwide-icon.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Nationwide_Good.png",
  //       "../../assets/images/caro-slider-images/Nationwide_Better.png",
  //       "../../assets/images/caro-slider-images/Nationwide_Best.png"
  //     ]
  //   },
  //   {
  //     slideImg: '../../assets/images/SVG/travelers-icon.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Travelers_Good.png",
  //       "../../assets/images/caro-slider-images/Travelers_Better.png",
  //       "../../assets/images/caro-slider-images/Travelers_Best.png"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/SVG/universal-icon.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Universal_Good.png",
  //       "../../assets/images/caro-slider-images/Universal_Better.png",
  //       "../../assets/images/caro-slider-images/Universal_Best.png"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/SVG/plymouth-rock-icon.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/PlymouthRock_Good.png",
  //       "../../assets/images/caro-slider-images/PlymouthRock_Better.png",
  //       "../../assets/images/caro-slider-images/PlymouthRock_Best.png"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/SVG/progressive-icon.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Progressive_Good.png",
  //       "../../assets/images/caro-slider-images/Progressive_Better.png",
  //       "../../assets/images/caro-slider-images/Progressive_Best.png"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/companies/hippo.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Hippo_Good.png",
  //       "../../assets/images/caro-slider-images/Hippo_Better.png",
  //       "../../assets/images/caro-slider-images/Hippo_Best.png"
  //     ]
  //   },{
  //     slideImg: '../../assets/images/companies/stillwater.png',
  //     caroImages: [
  //       "../../assets/images/caro-slider-images/Stillwater_Good.png",
  //       "../../assets/images/caro-slider-images/Stillwater_Better.png",
  //       "../../assets/images/caro-slider-images/Stillwater_Best.png"
  //     ]
  //   }
  // ];
  yearOptions = this.generateArrayOfYears()
  makeOptions = [
    {
      "value": "",
      "title": "Make"
    },
    {
      "value": "Tesla",
      "title": "Tesla"
    },
    {
      "value": "Acura",
      "title": "Acura"
    },
    {
      "value": "Alfa Romero",
      "title": "Alfa Romero"
    },
    {
      "value": "Audi",
      "title": "Audi"
    },
    {
      "value": "Bentley",
      "title": "Bentley"
    },
    {
      "value": "BMW",
      "title": "BMW"
    },
    {
      "value": "Buick",
      "title": "Buick"
    },
    {
      "value": "Cadilac",
      "title": "Cadilac"
    },
    {
      "value": "Chevrolet",
      "title": "Chevrolet"
    },
    {
      "value": "Chrysler",
      "title": "Chrysler"
    },
    {
      "value": "Dodge",
      "title": "Dodge"
    },
    {
      "value": "Ferrari",
      "title": "Ferrari"
    },
    {
      "value": "Fiat",
      "title": "Fiat"
    },
    {
      "value": "Ford",
      "title": "Ford"
    },
    {
      "value": "Genesis",
      "title": "Genesis"
    },
    {
      "value": "GMC",
      "title": "GMC"
    },
    {
      "value": "Honda",
      "title": "Honda"
    },
    {
      "value": "Hyundai",
      "title": "Hyundai"
    },
    {
      "value": "Infiniti",
      "title": "Infiniti"
    },
    {
      "value": "Isuzu",
      "title": "Isuzu"
    },
    {
      "value": "Jaguar",
      "title": "Jaguar"
    },
    {
      "value": "Jeep",
      "title": "Jeep"
    },
    {
      "value": "Kia",
      "title": "Kia"
    },
    {
      "value": "Lamborghini",
      "title": "Lamborghini"
    },
    {
      "value": "Land Rover",
      "title": "Land Rover"
    },
    {
      "value": "Lexus",
      "title": "Lexus"
    },
    {
      "value": "Lincoln",
      "title": "Lincoln"
    },
    {
      "value": "Maserati",
      "title": "Maserati"
    },
    {
      "value": "Mazda",
      "title": "Mazda"
    },
    {
      "value": "Mercedes",
      "title": "Mercedes"
    },
    {
      "value": "Mini",
      "title": "Mini"
    },
    {
      "value": "Mitsbushi",
      "title": "Mitsbushi"
    },
    {
      "value": "Nissan",
      "title": "Nissan"
    },
    {
      "value": "Porsche",
      "title": "Porsche"
    },
    {
      "value": "RAM",
      "title": "RAM"
    },
    {
      "value": "Rolls-Royce",
      "title": "Rolls-Royce"
    },
    {
      "value": "Saturn",
      "title": "Saturn"
    },
    {
      "value": "Subaru",
      "title": "Subaru"
    },
    {
      "value": "Tesla",
      "title": "Tesla"
    },
    {
      "value": "Toyota",
      "title": "Toyota"
    },
    {
      "value": "Volkswagen",
      "title": "Volkswagen"
    },
    {
      "value": "VOLVO",
      "title": "VOLVO"
    }
  ]
  mobInsuranceImgs: object = [
    // '../../assets/images/metlife_new_logo.png',
    // '../../assets/images/hous-illustrations/liberty-icon.png',
    '../../assets/images//hous-illustrations/Nationwide_Best.png',
    '../../assets/images/hous-illustrations/Travelers_Best.png',
    '../../assets/images/hous-illustrations/Universal_Best.png',
    '../../assets/images/hous-illustrations/PlymouthRock_Best.png',
    '../../assets/images/hous-illustrations/Progressive_Best.png',
    '../../assets/images/hous-illustrations/Hippo_Best.png',
    '../../assets/images/hous-illustrations/Stillwater_Best.icon'
  ];

  bgColor: any = [
    "darkblue", "darkgreen", "red", "darkred", "#5bc0de", "lightblue", "#167EF8", "green", "darkyellow"
  ];

  constructor(
    private fb: FormBuilder,
    private olark: OlarkService,
    public router: Router,
    public commonService: CommonService,
    private apiService: ApiService,
  ) {


    this.InsuranceData = this.commonService.getLocalItem('total_data').selected_insurance_data;
    this.selectedPlan = this.commonService.getLocalItem('selectedPlan');
    this.fullAddressText = this.commonService.getLocalItem("total_data").address_components.formatted_address;
    this.zillowData = this.commonService.getLocalItem("total_data").zillow;

    let hippo = this.commonService.getLocalItem("total_data").hippo;
    this.hippolink = JSON.parse(hippo).quote_url;
    this.hippoprice = JSON.parse(hippo).quote_premium;

    this.mortgageData = this.commonService.getLocalItem("total_data").mortgage_data;
    this.mortgageData.startdate = this.GetFormattedDate(this.mortgageData.startdate);

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

    if (typeof totalData.flood != "undefined" && typeof totalData.flood.data != "undefined" && typeof totalData.flood.data.premium != "undefined") {
      this.neptuneFloodPrice = totalData.flood.data.premium;
      this.neptuneFlood = totalData.flood.data.zone;
    }
    // this.insuranceImgs = [
    //   {
    //     slideImg: this.InsuranceData.imgURL,
    //     caroImages: [this.InsuranceData.caroImages[0]]
    //   }
    // ]

  }

  ngOnInit() {
    setTimeout(() => {
      document.getElementById('tick_icon').style.display = "none"
      document.getElementById('tick_icon_success').style.display = "block"
      document.getElementsByClassName('chat_box ')[0]['style'].display = "block"
    }, 4000);
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.setUpOlark();

  }

  async showChatWidget() {
    if (this.commonService.isMobileMode()) {
      this.olark.show();
    } else {
      const total_data = this.commonService.getLocalItem('total_data');
      this.showChat = true;
      this.imgURL = total_data['mortgage_data']['imgURL'];
      this.chatPricing = total_data['mortgage_data']['price'];
      await this.olark.load(window, document, "static.olark.com/jsclient/loader.js");
      this.olark.identify('4797-648-10-9515');
      setTimeout(() => {
        document.querySelector('.chat-container').scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      })
    }
  }
  async setUpOlark() {
    await this.olark.load(window, document, "static.olark.com/jsclient/loader.js");
    this.olark.identify('4797-648-10-9515');
    this.showChatWidget();
  };


  next(value: boolean) {
    if (!this.start_date) return;
    const total_data = this.commonService.getLocalItem('total_data');
    let mortgage_data = total_data['mortgage_data'];
    this.isHaveMortgage = value;
    if (!mortgage_data) mortgage_data = {};
    mortgage_data['is_mortgage'] = this.isHaveMortgage;
    mortgage_data['startdate'] = this.start_date;
    if (!this.isHaveMortgage) {
      mortgage_data['lender_email'] = '';
      this.router.navigateByUrl('/policy-chat');
      return;
    }
    this.commonService.applyTotalData('mortgage_data', mortgage_data);
    this.router.navigateByUrl('/policy-mortgage-info');
  }

  refresh() {
    location.href = "/";
  }

  GetFormattedDate(date) {
    var todayTime = new Date(date);
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();

    return ('0' + month).slice(-2) + '/'
      + ('0' + day).slice(-2) + '/'
      + year;
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
  modalBackdrop() {
    $("body").addClass("heder_modal_backdrop");
  }




  carForm = this.fb.group({

    cars: this.fb.array([
      this.fb.group({
        carModel: ['', Validators.required],
        year: ['', Validators.required],
        make: ['', Validators.required],


      })
    ])
  });
  get cars() {
    return this.carForm.controls["cars"] as FormArray;
  }



  addCar() {

    this.cars.push(this.fb.group({
      carModel: ['', Validators.required],
      year: ['', Validators.required],
      make: ['', Validators.required],

    }));
  }

  deleteCar(carIndex: number) {
    this.cars.removeAt(carIndex);
  }


  saveCarInfo(form) {
    let emailData={}

    emailData['firstName']=this.commonService.getLocalItem('fcUserBasic').firstName
    emailData['lastName']=this.commonService.getLocalItem('fcUserBasic').lastName
    emailData['dob']=this.commonService.getLocalItem('fcUserBasic').dob
    emailData['email']=this.commonService.getLocalItem('fcUserBasic').email
    emailData['phone']=this.commonService.getLocalItem('fcUserBasic').phone
    emailData['relations']=this.commonService.getLocalItem('fcUserBasic').relations||[]
    emailData['address']=this.commonService.getLocalItem('searchedAddress').formatted_address
    emailData['cars']=form.value.cars
    emailData['exterior']=this.commonService.getLocalItem('total_data').exterior
    emailData['square']=this.commonService.getLocalItem('total_data').square
    emailData['built_year']=this.commonService.getLocalItem('total_data').built_year
    emailData['ac_year']=this.commonService.getLocalItem('total_data').ac_year
    emailData['electric_year']=this.commonService.getLocalItem('total_data').electric_year
    emailData['plumbing_year']=this.commonService.getLocalItem('total_data').plumbing_year
    emailData['roof_year']=this.commonService.getLocalItem('total_data').roof_year
    emailData['roof_status']=this.commonService.getLocalItem('total_data').roof_status



    this.apiService.sendCarInfoEmail(emailData).subscribe(res => {
      localStorage.clear()
      console.log('email car', res)
    }, (error) => {
      console.log("Failed to send car email", error);
    });

    console.log(form.value)

  }

  generateArrayOfYears() {
    let max = new Date().getFullYear()
    let min = max - 50
    let years = []

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    console.log(`years`, years)
    return years
  }





}
