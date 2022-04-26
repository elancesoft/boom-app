import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SwiperComponent} from "ngx-useful-swiper";

@Component({
  selector: 'app-swiper-container',
  templateUrl: './swiper-container.component.html',
  styleUrls: ['./swiper-container.component.scss']
})
export class SwiperContainerComponent implements OnInit {

  @Output('next') next:EventEmitter<any> = new EventEmitter<any>();
  @Input('text') text:string='';
  @ViewChild("usefulSwiper", {static: false})
  public usefulSwiper: SwiperComponent;
  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        if (this.usefulSwiper && this.usefulSwiper.swiper && this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = true;
          this.next.emit();
        }
      }
    }
  };
  constructor() { }

  ngOnInit() {
  }

  goToThreeStep(){
    return null;
  }

}
