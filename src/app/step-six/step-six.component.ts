import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, Input, OnInit, EventEmitter, ViewChild, Directive, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { CommonService } from '../services/common.service';
import { ApiService } from '../services/api-service';
import { OlarkService } from '../services/olark.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss'],
  providers: [OlarkService]
})

export class StepSixComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedValue = 0;
  roofTypeValues = [
    { id: 0, value: ' low to high' },
    { id: 1, value: ' high to low' }
  ];

  apiCallsResults = [
    {
      name: 'hippo',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/companies/hippo.png',
      static:true

    },
    {
      name: 'nationwide',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/SVG/nationwide-icon.png',
      static:true

    },
    {
      name: 'plymouth',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/SVG/plymouth-rock-icon.png',
      static:true


    },
    {
      name: 'universal',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/SVG/universal-icon.png',
      static:true

    },

    {
      name: 'stillwater',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/companies/stillwater.png',
      static:true

    },
    {
      name: 'ourbranch',
      success: false,
      loading: true,
      result: {price:100000000},
      slideImg: '../../../assets/images/ourbranchlogo.png',
      static:true

    },

//loading false for them as they are static



  ]


  staticCallResults=[]


  filterValue=this.commonService.getLocalItem('fcFilterData')

  // insuranceImgs = [
  //   {
  //     slideImg: '../../assets/images/metlife_new_logo.png',

  //   }, {
  //     slideImg: '../../assets/images/SVG/nationwide-icon.png',

  //   },
  //   {
  //     slideImg: '../../assets/images/SVG/travelers-icon.png',

  //   }, {
  //     slideImg: '../../assets/images/SVG/universal-icon.png',

  //   }, {
  //     slideImg: '../../assets/images/SVG/plymouth-rock-icon.png',

  //   }, {
  //     slideImg: '../../assets/images/SVG/progressive-icon.png',

  //   }, {
  //     slideImg: '../../assets/images/companies/hippo.png',

  //   }, {
  //     slideImg: '../../assets/images/companies/stillwater.png',

  //   }
  // ];






  constructor(
    private modalService: NgbModal,
    public router: Router,
    public local: LocalStorageService,
    public commonService: CommonService,
    private apiService: ApiService,
    public elemRef: ElementRef,
    private olark: OlarkService
  ) {

  }


  ngOnInit() {
    this.initApiCalls();


    setTimeout(() => {

      this.staticCallResults=[
         {
        name: 'progessive',
        success: false,
        loading: false,
        result: {price:100000000},
        slideImg: '../../../assets/images/SVG/progressive-icon.png',
        static:true,
        fadeIn:true

      },
      {
        name: 'travellers',
        success: false,
        loading: false,
        result: {price:100000000},
        slideImg: '../../../assets/images/SVG/travelers-icon.png',
        static:true,
        fadeIn:true
      },
      {
        name: 'metlife',
        success: false,
        loading: false,
        result: {price:100000000},
        slideImg: '../../../assets/images/SVG/metlife_new_logo.png',
        static:true,
        fadeIn:true

      }
    ]

    }, 7000);
  }

  ngOnDestroy(): void {
    // this.olark.hide();
  }

  ngAfterViewInit() {


  }


  checkStringAndReplace(data) {
    if ((typeof data) == 'string') {
      return parseInt(data.replace(',', ''));
    }
    return data
  }

   initApiCalls() {
    //here getting parameters that are needed to pass to api calls from different localstorage indexes.
    let square, estimate, dwelling, year_built = null
    const addressData = this.commonService.getAddressData();
    const street = addressData['address']
    const city = addressData['locality']
    const state = addressData['administrative_area_level_1']
    const postal_code = addressData['postal_code']
    let {
      zillow,
      hippo,
      personData,
      // phone,
      ac_year,
      plumbing_year,
      electric_year,
      roof_year,
      construction_type,
      building_type,
      roof_type,
      exterior_type,
      roof_status,
      is_basement,
      is_bundle,
      is_security,
      is_smart,
      foundation_type
    } = this.local.get('total_data');
    const {
      dob,
      email,
      firstName,
      lastName,
      phone
    } = this.local.get('fcUserBasic');

    let { fcDwelling, fcDeductible, fcDwellingExtension } = this.local.get('fcFilterData');
    hippo = JSON.parse(hippo)


    estimate = this.checkStringAndReplace(zillow['estimate'])
    square = this.checkStringAndReplace(zillow['square'])
    year_built = this.checkStringAndReplace(zillow['built_year'])

    if ((typeof zillow['square']) == 'string') {
      square = parseInt(zillow['square'].replace(',', ''));
      estimate = parseInt(zillow['estimate'].replace(',', ''));
    } else {
      square = zillow['square'];
      estimate = zillow['estimate'];
    }

    if (hippo && hippo.coverage_a) {
      dwelling = hippo.coverage_a
    }

    if (fcDwelling) {
      dwelling = fcDwelling
    }

    personData
    const apiParams = {
      street,
      city,
      state,
      postal_code,
      square,
      email: email,
      year_built,
      estimate,
      dob,
      firstName,
      lastName,
      phone,
      ac_year,
      plumbing_year,
      electric_year,
      roof_year,
      construction_type,
      building_type,
      roof_type,
      exterior_type,
      roof_status,
      is_basement,


      foundation_type,
      is_security: true,
      is_smart: true,
      is_bundle: true
    };


    // console.log(
    //   {
    //     dob,
    //     email,
    //     firstName,
    //     lastName,
    //     phone,

    //     ac_year,
    //     plumbing_year,
    //     electric_year,
    //     roof_year,
    //     construction_type,
    //     building_type,
    //     roof_type,
    //     exterior_type,
    //     roof_status,
    //     is_basement,
    //     is_bundle,
    //     is_security,
    //     is_smart,
    //     foundation_type
    //   })



    const HippoParam = {
      street, city, state, postal_code, square, roof_year, year_built
    }

    const plymouthParam = {
      city, state, postal_code, street, firstName, lastName, dob, type: 'HO3',year_built
    }

    const universalParam = {
      construction_type, foundation_type, building_type, roof_type, exterior_type, is_basement, personData,
      city, state, postal_code, street, firstname: firstName, lastname: lastName, email,
      birthday: dob, year_built, sqft: square, dwell_coverage: dwelling, ac_year, electric_year, plumbing_year,
      roof_year, phone
      // effective_date,
      // expiration_date,
      // yearOccupancy,
      // purchaseDt,

    }

    const nationwideParam = {
      email,
      firstName,
      lastName,
      dob,
      street,
      city,
      state,
      postal_code,
      liability: 500000,
      dwelling_extension: fcDwellingExtension,
      deductible: fcDeductible,
      dwelling: fcDwelling,
      water_backup: 10000,
      service_line: 1,
      equipment_breakdown: 'true',
      square,
      year_built
    }

    const stillwaterParam = {
      city, state, postal_code, street,
      dwell_coverage: dwelling,
      firstname: firstName,
      lastname: lastName,
      dob,
      email,
      phone,
      deductible: fcDeductible

    }


    const ourBranchParam={
      fname: firstName,
      lname: lastName,
      address: street,
      city,
      state,
      zip:postal_code,
      dob
    }

    this.getHippo(HippoParam);
    this.getNationWide(nationwideParam);
    this.getUniversal(universalParam);
    this.getStillwater(stillwaterParam);
    this.getPlymouth(plymouthParam);
    this.getOurBranch(ourBranchParam);




  }



  getHippo(param) {

    this.apiService.getHippoData(param).subscribe(
      (res) => {
        if (res.success) {
          const result = JSON.parse(res.data)
          const data = {
              dwelling: result['coverage_a'],
              price: result['quote_premium'],
              liability: this.filterValue['fcLiability'],
              personalProperty: this.filterValue['fcProperty'],
              deductible: this.filterValue['fcDeductible']
             }
          this.setResultInApi('hippo', data)

        } else {
          this.setErrorInApi('hippo')
        }
      },
      (err) => {
        this.setErrorInApi('hippo')
      }
    )

  }

  getNationWide(nationwideParam) {



    this.apiService.getNationWideData(nationwideParam).subscribe(
      (res) => {

        if (res['result']['offeredQuotes'] != undefined && res['result']['offeredQuotes'].length > 0) {
          var quotePremium = res['result']['offeredQuotes'][0];
          const price = typeof quotePremium['premium'] != "undefined" && typeof quotePremium['premium']['total'] != "undefined" && typeof quotePremium['premium']['total']['amount'] != "undefined" ? quotePremium['premium']['total']['amount'] : 0
          let liability,personalProperty,deductible,dwelling=null

          const coverages=res['result']['offeredQuotes'][0]['coverages']
          coverages.forEach(coverage => {

            if(coverage.name==='Dwelling'){
              coverage['selectedValue'].forEach(element => {
                if(element.code==="BasicCoverageLimit"){
                  dwelling = element.description
                }
              });
            }

            if(coverage.name==='Section I Deductibles'){
            coverage['selectedValue'].forEach(element => {
                if(element.code==="AllPerilDeductible"){
                  deductible = element.description
                }
              });
            }

            if(coverage.name==='Personal Property'){
             console.log( coverage['selectedValue'])
             coverage['selectedValue'].forEach(element => {
                if(element.code==="UnscheduledPersonalPropertyLimit"){
                  personalProperty = element.description
                }
              });
            }

            if(coverage.name==='Personal Liability'){
              coverage['selectedValue'].forEach(element => {
                if(element.code==="PersonalLiabilityLimit"){
                  liability = element.description
                }
              });
            }

          });

          const data = {
            dwelling: dwelling,
            price: price,
            liability: liability,
            personalProperty: personalProperty,
            deductible: deductible
          }

          this.setResultInApi('nationwide', data)
        } else {
          this.setErrorInApi('nationwide')
        }
      },
      (err) => {
        this.setErrorInApi('nationwide')
      }
    )
  }

  getUniversal(universalParam) {
    this.apiService.getUniversalData(universalParam).subscribe(
      (res) => {
        try {
          if (res['data']['QuoteWrapper']['Message']!=='ERROR'&&res['data']['QuoteWrapper']['Premium']) {

            const data = {
              dwelling: res['data']['QuoteWrapper']['Quote']['CoverageA'],
              price: parseInt(res['data']['QuoteWrapper']['Premium']),
              liability: '',
              personalProperty: res['data']['QuoteWrapper']['Quote']['CoverageC'],
              deductible: ''
            }
             this.setResultInApi('universal', data)
          } else {
            this.setErrorInApi('universal')
          }
        } catch (error) {
          console.log('universal Err',error)
          this.setErrorInApi('universal')

        }

      },
      (err) => {

        this.setErrorInApi('universal')
      }
    )
  }

  getStillwater(stillwaterParam) {





    this.apiService.getStillwaterData(stillwaterParam).subscribe(
      (res) => {
        try {
          let result = res
          const status = result['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['MsgStatus']['MsgStatusCd']
          if (status == 'Success') {
            const coverages = result['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['HomeLineBusiness']['Dwell']['Coverage']
            const price = result['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt']


            let dwell, personalProperty, liability=null

            coverages.forEach(cov => {
              // console.log(cov)
              if (cov['CoverageCd'] === 'DWELL') {
                dwell = cov['Limit']['FormatInteger']
              }
              if (cov['CoverageCd'] === 'PP') {
                personalProperty = cov['Limit']['FormatInteger']
              }
              if (cov['CoverageCd'] === 'PL') {
                liability = cov['Limit']['FormatInteger']
              }
            });


            const data = {
              dwelling: dwell,
              price: price,
              liability:liability ,
              personalProperty: personalProperty,
              deductible: this.filterValue['fcDeductible']
            }
            this.setResultInApi('stillwater', data)

          } else {
            this.setErrorInApi('stillwater')
          }
        } catch (error) {
          this.setErrorInApi('stillwater')
        }

      },
      (err) => {
        this.setErrorInApi('plymouth')
      }
    )
  }

  getPlymouth(plymouthParam) {



    this.apiService.getPlymouthData(plymouthParam).subscribe(
      (res) => {
        if (res.result === 'success') {
          let  result = res.data.better

          let price=this.updatePlymouthValue(result['pricing']*12)

          const data = {
            dwelling: result['dwelling'],
            price: price,
            liability: result['personalLiability'],
            personalProperty: result['personalProperty'],
            deductible: result['policyDeductible']
          }
          this.setResultInApi('plymouth', data)

        } else {
          alert('h')
          console.log('res :>> ', res);
          this.setErrorInApi('plymouth')
        }
      },
      (err) => {
        console.log('err :>> ', err);
        this.setErrorInApi('plymouth')
      }
    )

  }

  getOurBranch(ourBranchParam){
    this.apiService.getOurBranch(ourBranchParam).subscribe(
      (res) => {
        console.log({'ourbranch':res})
        if (res.data ) {
          let  price = res['data']['requestQuote']['options'].filter((option:any) => option.description === 'Homeowners')[0]['homeTotal']

          const data = {
            dwelling: this.filterValue['fcDwelling'],
            price,
            liability: this.filterValue['fcLiability'],
            personalProperty: this.filterValue['fcProperty'],
            deductible: this.filterValue['fcDeductible']
          }
          this.setResultInApi('ourbranch', data)

        } else {

          console.log('res :>> ', res);
          this.setErrorInApi('ourbranch')
        }
      },
      (err) => {
        console.log('err :>> ', err);
        this.setErrorInApi('ourbranch')
      }
    )
  }



  setErrorInApi(name) {
    this.apiCallsResults = this.apiCallsResults.map((api) => {
      if (api.name === name) {
        api.loading = false
      }
      return api
    })
    this.setOrder()

  }

  setResultInApi(name, result) {
    this.apiCallsResults = this.apiCallsResults.map((api) => {
      if (api.name === name) {
        api.loading = false
        api.result = result
        api.static=false
      }
      return api
    })
    this.setOrder()

  }

  setOrder(){
    this.apiCallsResults.sort((a, b) => a.result['price'] > b.result['price'] ? 1 : -1);
    //shifting nationwide on top
    const index=this.apiCallsResults.findIndex(api=>api.name==='nationwide')
    const removed=this.apiCallsResults.splice(index,1)
    this.apiCallsResults.unshift(removed[0])

  }



  selectPlan(plan){
    this.commonService.setLocalItem('selectedPlan',plan)
    this.router.navigate(['/','preparing-policy'])
  }

  updatePlymouthValue(result){
    const filter=this.local.get('fcFilterData');


    if(filter.fcDeductible){
      filter.fcDeductible=filter.fcDeductible.toString()
      filter.fcDeductible=filter.fcDeductible.replace(',','')
      if(parseInt(filter.fcDeductible)===2500){
        // console.log('filter.fcDeductible)===2500')
        result=result* (1-0.097)
      }
      if(parseInt(filter.fcDeductible)===5000){
        // console.log('filter.fcDeductible)===5000')
        result=result* (1-0.22)
      }
    }

    if(filter.fcDwellingExtension){
      if(parseInt(filter.fcDwellingExtension)===15){
        // console.log('filter.fcDwellingExtension)===15');
        result=result+12
      }
      if(parseInt(filter.fcDwellingExtension)===35){
        // console.log('filter.fcDwellingExtension)===35');

        result=result+18
      }
    }

    if(filter.fcLiability){
      // console.log('filter.fcLiability');
      filter.fcLiability=filter.fcLiability.toString()
      filter.fcLiability=filter.fcLiability.replace(',','')
      if(parseInt(filter.fcLiability)===100000){
        // console.log('filter.fcLiability)===100000');
        result=result-16
      }
      if(parseInt(filter.fcLiability)===300000){
        // console.log('filter.fcLiability)===300000');
        result=result-8
      }
      if(parseInt(filter.fcLiability)===500000){
        // console.log('filter.fcLiability)===500000');
        result=result+8
      }
    }

    if(filter.fcWaterBackup){
      // console.log('fcWaterBackup');

      result=result+96
    }

    if(filter.fcSewerLine){
      // console.log('sweverline');
      result=result+24
    }

    if(filter.fcEquipmentBreakdown){
      // console.log('fcEquipmentBreakdown');
      result=result+18
    }

    if(filter.fcReplacementCost){
      // console.log('fcReplacementCost');
      result=result+80
    }

    //adding bundle discount
    result=result* (1-0.185)

    return result
  }


}
