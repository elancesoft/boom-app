import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-preparing-policy',
  templateUrl: './preparing-policy.component.html',
  styleUrls: ['./preparing-policy.component.scss']
})
export class PreparingPolicyComponent implements OnInit, OnDestroy {
  timeout:any;
  constructor(public router:Router) { }

  ngOnInit() {
    this.timeout = setTimeout(()=>this.next(),3000);
  }
  ngOnDestroy() {
    clearTimeout(this.timeout)
  }
  next(){
    this.router.navigateByUrl('/policy-start-date')
  }
}
