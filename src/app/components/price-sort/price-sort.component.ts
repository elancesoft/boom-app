import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-price-sort',
  templateUrl: './price-sort.component.html',
  styleUrls: ['./price-sort.component.scss']
})
export class PriceSortComponent implements OnInit {
  @Output('sort') sort: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  doSort(type: string) {
    this.sort.emit(type)
  }
}
