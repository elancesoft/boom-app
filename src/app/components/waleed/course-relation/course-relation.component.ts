import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { CommonService } from "../../../services/common.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api-service";

@Component({
  selector: "app-course-relation",
  templateUrl: "./course-relation.component.html",
  styleUrls: ["./course-relation.component.scss"],
})
export class CourseRelation implements OnInit {

  userForm: FormGroup;
  lat:number=null
  lng:number=null
  exterior:any=null
  built_year:any=null
  square:any=null
  ac_year:any=null
  electric_year:any=null
  plumbing_year:any=null
  roof_year:any=null
  roof_status:any=null
  roof_type:any=null
  roofArr:Array<string>=['Other', 'Asphalt shingle', 'Wood shingle', 'Slate', 'Rubber', 'Concrete', 'Solar', 'Tile',
  'Tar and Gravel', 'Composite shingles'];
  foundation_type:any=null
  
  constructor(  public apiService: ApiService,private formBuilder: FormBuilder,public local: LocalStorageService, public commonService: CommonService, private router: Router) {
   
  }

  async ngOnInit() {

    this.userForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required]),
    });
    const total_data = this.commonService.getLocalItem("total_data");
    this.lat = total_data.address_components.geometry.location.lat;
    this.lng = total_data.address_components.geometry.location.lng;
    this.exterior=this.commonService.getLocalItem('total_data').exterior
    this.square=this.commonService.getLocalItem('total_data').square
    this.built_year=this.commonService.getLocalItem('total_data').built_year
    this.ac_year=this.commonService.getLocalItem('total_data').ac_year
    this.electric_year=this.commonService.getLocalItem('total_data').electric_year
    this.plumbing_year=this.commonService.getLocalItem('total_data').plumbing_year
    this.roof_year=this.commonService.getLocalItem('total_data').roof_year
    this.roof_status=this.commonService.getLocalItem('total_data').roof_status
    this.roof_status=this.roof_status.charAt(0).toUpperCase() + this.roof_status.slice(1);
    this.roof_type=this.roofArr[this.commonService.getLocalItem('total_data').roof_type]||this.roofArr[0]
    this.foundation_type=this.commonService.getLocalItem('total_data').foundation_type
  
    
    
    if (this.foundation_type === 1) {
      this.foundation_type = "Basement";
    } else if (this.foundation_type === 2) {
      this.foundation_type = "Crawl Space";
    } else {
      this.foundation_type = "Slab";
    }
  }


  submitAndSendMail(userForm){

    if (this.userForm.invalid) {
      this.commonService.modalOpen("Error", "Please complete all required fields.");
      return;
    }
    this.commonService.setLocalItem('fcUserBasic',
      {
        ...this.commonService.getLocalItem('fcUserBasic'),
        ...this.userForm.value
      }
    )
    let emailData={}
    
    emailData['firstName']=this.commonService.getLocalItem('fcUserBasic').firstName
    emailData['lastName']=this.commonService.getLocalItem('fcUserBasic').lastName
    emailData['dob']=this.commonService.getLocalItem('fcUserBasic').dob
    emailData['email']=this.commonService.getLocalItem('fcUserBasic').email
    emailData['phone']=this.commonService.getLocalItem('fcUserBasic').phone
    emailData['relations']=this.commonService.getLocalItem('fcUserBasic').relations||[]
    emailData['address']=this.commonService.getLocalItem('searchedAddress').formatted_address
    
    emailData['exterior']=this.commonService.getLocalItem('total_data').exterior
    emailData['square']=this.commonService.getLocalItem('total_data').square
    emailData['built_year']=this.commonService.getLocalItem('total_data').built_year
    emailData['ac_year']=this.commonService.getLocalItem('total_data').ac_year
    emailData['electric_year']=this.commonService.getLocalItem('total_data').electric_year
    emailData['plumbing_year']=this.commonService.getLocalItem('total_data').plumbing_year
    emailData['roof_year']=this.commonService.getLocalItem('total_data').roof_year
    emailData['roof_status']=this.commonService.getLocalItem('total_data').roof_status

    this.apiService.sendCompleteInfoMail(emailData).subscribe((response) => {
      console.log("email", response);
    });
    this.router.navigate(['/','step6'])
  }

}
