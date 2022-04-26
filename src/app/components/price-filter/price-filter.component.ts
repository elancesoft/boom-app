import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit {
  @Output('filter') filter:EventEmitter<object> = new EventEmitter<object>();
  well:boolean = true;
  bundle:boolean = true;
  underground:boolean = true;
  extended:boolean = true;
  constructor() { }

  ngOnInit() {
    this.doFilter()
  }
  doFilter(){
    this.filter.emit(this.getConditions())
  }

  getConditions(){
    const {well, bundle, underground, extended} = this;
    return {well, bundle, underground, extended};
  }

}
