import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api-service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService} from 'angular-web-storage';
import {NgbdModalContent} from '../home/ngbd.modal.content';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {carData, CarYearData} from '../home/models';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-esign',
  templateUrl: './esign.component.html',
  styleUrls: ['./esign.component.scss']
})
export class EsignComponent implements OnInit {
  start_date: string;
  policy_number: string;
  first_name: string;
  quote_id: string;
  evidencePDF: string;
  invoicePDF: string;
  bind_now: string;
  isAddCar = false;
  carData: carData[] = [{year: '', make: '', model: ''}];
  CarYearData: CarYearData[] = [];
  CarMakeData: object = ['Tesla', 'Alfa Romero', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadilac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
    'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'Mercedes',
    'Mini', 'Mitsbushi', 'Nissan', 'Porsche', 'RAM', 'Rolls-Royce', 'Saturn', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'VOLVO'];

  constructor(public apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private local: LocalStorageService,
              private modalService: NgbModal,
              private commonService: CommonService) {
  }

  Modalopen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;
  }

  ngOnInit() {
    this.makeCarYeardata();
    const date = this.route.snapshot.paramMap.get('start_date').split('-');
    this.policy_number = this.route.snapshot.paramMap.get('policy_number');
    this.first_name = this.route.snapshot.paramMap.get('first_name');
    this.quote_id = this.route.snapshot.paramMap.get('quote_id');
    this.start_date = (date[1] + '/') + (date[2] + '/') + date[0];
    this.invoicePDF = this.first_name + '-INVOICE' + this.quote_id + '.pdf';
    this.evidencePDF = this.route.snapshot.paramMap.get('policy_doc_url');
    this.bind_now = this.route.snapshot.paramMap.get('bind_now');
    if (this.bind_now == 'false') {
      this.router.navigate(['/index']);
    }
  }

  toggleCarInputs() {
    this.isAddCar = !this.isAddCar;

    if (this.isAddCar) {
      setTimeout(function () {
        document.getElementById('addCarBoard').scrollIntoView({behavior: 'smooth', block: 'start'});

      }, 300);
    }
  }

  makeCarYeardata() {
    const year = (new Date()).getFullYear();

    for (let i = year - 100; i < year + 2; i++) {
      this.CarYearData.push({
        year: i
      });
    }
    this.CarYearData.sort((a, b) => {
      return b.year - a.year;
    });
  }

  addCar() {
    if (this.carData.length < 4) {
      this.carData[this.carData.length] = {year: '', make: '', model: ''};
    } else {

    }
  }

  deleteCar(key) {
    this.carData.splice(key, 1);
  }

  sendCarData() {
    const uniqueId = this.commonService.getLocalItem('unique_id');
    const data = {carData: this.carData, uniqueId: uniqueId};
    this.apiService.addCarData(data).subscribe(res => {
      if (res['result'] == 'success') {
        this.apiService.bundleAuto({uniqueId: uniqueId}).subscribe(res => {
          if (res['result'] == 'success') {
            this.Modalopen('autoSuccess', 'Thank you! We will send you bundled rates as well! ' +
              'Please give us a call if you have any questions.');
          }
        }, (err) => {
        });
      }
    }, (err) => {
      this.Modalopen('Error', 'An error occured. ');
    });
  }
}

// <img src="../../assets/images/confirm.png" width="30"/>&nbsp;Quote Request Received!
