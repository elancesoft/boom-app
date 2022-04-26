import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SwiperComponent} from "ngx-useful-swiper";

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss']
})

export class SwipeComponent implements OnInit, AfterViewInit {
  @ViewChild('usefulSwiper', {static: false}) public usefulSwiper: SwiperComponent;

  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        if (this.usefulSwiper.swiper.activeIndex == 0) {
          this.usefulSwiper.swiper.allowSlidePrev = false;
        }
      }
    }
  };

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.usefulSwiper.swiper.allowSlideNext = false;
    console.log(this.usefulSwiper)
  }
}
