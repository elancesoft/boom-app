import {Component, EventEmitter, Input, OnInit, ViewChild, QueryList, ViewChildren} from '@angular/core';
import {AfterViewInit, ElementRef, HostListener, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {ModalDirective} from "ng-uikit-pro-standard";
import {CommonService} from "../../services/common.service";
import { Guid } from 'guid-typescript';
import {ApiService} from "../../services/api-service";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {BatchService} from "../../services/batch.service";
import {MapsAPILoader} from "@agm/core";
import {LocalStorageService} from "angular-web-storage";
import CacheManager from "../../utils/CacheManager";
import {addressData} from "../../home/models";
import {AddressInputComponent} from "../address-input/address-input.component";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-batch-page',
  templateUrl: './batch-page.component.html',
  styleUrls: ['./batch-page.component.scss']
})

export class BatchPageComponent implements OnInit {
  @ViewChildren(AddressInputComponent) public placesRef: QueryList<AddressInputComponent>;
  @ViewChild("toastcmp", {static: false})
  public toastCmp: ElementRef;
  user = {
    user_email: '',
    code: ''
  };

  showToast = false;
  auth_success = false;
  cc_email = '';
  excel_data: string[][];

  data: any[] = null;
  history_view = false;
  quotes_view = false;

  window: any = window;
  cacheMode: boolean = false;

  addressData: addressData = {
    address: "",
    street_number: "",
    route: "",
    locality: "",
    administrative_area_level_1: "",
    country: "",
    postal_code: ""
  };
  GooglePlace: boolean = true;
  fullAddressText: string = "";
  isMobile: boolean;
  lat: string;
  lng: string;
  showLoader: boolean;
  loaderType: string = "slow";
  plymouth: object;
  universal: object;
  stillwater: object;
  isDisplay: boolean = false;
  isFinished: boolean = false;
  isProcessing: boolean = false;
  progress: number = 0;

  zillowData: object = {};
  totalProgress: number = 0;
  selectedMode: number = 0;
  coverage: number = 25000;
  zillowParams: object = {};

  bulk_done: boolean = false;
  bulk_doing: boolean = false;
  show =true;
  constructor(private commonService: CommonService,
              private apiService: ApiService,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,
              private batchService: BatchService,
              public local: LocalStorageService) {
  }

  ngOnInit() {
    this.auth_success = false;
  }

  close() {
    this.show = false;
    setTimeout(() => this.show = true, 150000);
  }

  toggle() {
    if(this.bulk_doing){
      this.bulk_done = true;
      this.bulk_doing = false;
    } else if(this.bulk_done) {
       this.bulk_doing = true;
       this.bulk_done = false;
    }
  }

closeToast(){
  this.showToast = false;
}

  codeEnter() {
    this.batchService.findAllByCode(this.user.code).subscribe(
      data=> {
        if (!data) {
          alert ("wrong user");
          return;
        }

        this.user.user_email = data['user_email'];
        this.user.code = data['code'];

        if (this.user.user_email) {
          this.auth_success = true;
        } else {
          alert ("wrong user");
        }
      },
      error => {
        console.log(error);
        alert ("wrong user");
      }
    )
  }

  sendBulkEmail () {
    this.bulk_done = false;
    let input_array = this.placesRef.toArray();
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].sendto !== '') {
  this.bulk_doing = true;
  this.showToast = true;
        setTimeout(()=>{
          if (i === (this.data.length - 1)) {
            this.bulk_done = true;
            this.bulk_doing = false;
            setTimeout(() =>{
              this.showToast = false;
            }, 3000);
          }
          input_array[i].sendEmail(this.data[i].sendto, this.data[i].cc, this.data[i].name, this.data[i].phone, true);
        }, 4000 * i);
      }
    }
  }

  clearBulkEmail () {
    this.data = [];
    this.bulk_done = false;
  }

  removeEmailRow(rowData) {
    this.data = this.data.filter((val) => val.id !==rowData.id);
  }

  addSingleEmailRow () {
    this.bulk_done = false;
    const guid = Guid.create();
    if (this.data == null) this.data = [];
    this.data.push({
      id: guid.toString(),
      address: "",
      sendto: "",
      cc: "",
      name: "",
      phone: ""
    });
  }

  uploadCsv(evt: any) {
    this.bulk_done = false;
    const target : DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error ('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = (e: any)=> {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname : string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.excel_data = (XLSX.utils.sheet_to_json (ws, {range: 1, header: 1}));

      if (this.data == null) this.data = [];
      for (let i = 0; i < this.excel_data.length; i++) {
        const guid = Guid.create();
        this.data.push({
          id: guid.toString()+"_"+(i+1),
          autoSelect: true,
          address: this.excel_data[i][0],
          sendto: this.excel_data[i][1],
          cc: this.excel_data[i][2],
          name: this.excel_data[i][3],
          phone: this.excel_data[i][4]
        });
      }
    };

    reader.readAsBinaryString(target.files[0]);
    evt.target.value = null;
  }

  historyClicked() {
    this.history_view = true;
    this.quotes_view = false;
  }

  quotesClicked() {
    this.history_view = false;
    this.quotes_view = true;
    window.scrollTo(0,document.body.scrollHeight);
    //$('html,body').animate({scrollTop: document.body.scrollHeight},"fast");
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['address','sendto', 'cc', 'name', 'phone']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = ''; // 'no,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      let count =0;
      for (let index in headerList) {
        let head = headerList[index];
        line += ((count > 0 ? ',' :'') + array[i][head].replace(/,/g, ""));
        count++;
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadCsv () {
    this.batchService.bulk_getAll().subscribe(
      data => {
        console.log (data);
        this.downloadFile(data, 'Download');
      },
      error => {
        console.log (error);
      }
    )
  }
}
