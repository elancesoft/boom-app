import {Component, OnInit, ViewChild} from '@angular/core';
import {SwiperComponent} from "ngx-useful-swiper";
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-demo-price-swiper',
  templateUrl: './demo-price-swiper.component.html',
  styleUrls: ['./demo-price-swiper.component.scss']
})
export class DemoPriceSwiperComponent implements OnInit {
  @ViewChild('usefulSwiper', {static: false}) public usefulSwiper: SwiperComponent;

  config: any = {
    initialSlide: 1,
    runCallbacksOnInit: true,
    on: {
      slideChange: () => {
        if (this.usefulSwiper && this.usefulSwiper.swiper) {
          this.usefulSwiper.swiper.allowSlideNext = false;
          if (this.usefulSwiper.swiper.activeIndex == 0) {
            this.usefulSwiper.swiper.allowSlidePrev = false;
            this.goToThreeStep();
          }
        }
      }
    }
  };

  constructor(public commonService: CommonService, private router: Router) {

  }



  ngOnInit() {
  }

  async goToThreeStep() {
    const total_data = this.commonService.getLocalItem('total_data');
    // total_data['mode'] = this.selectedMode;
    total_data['mode'] = 0;
    this.commonService.setLocalItem('total_data', total_data);
    this.router.navigate(['/step3']);

  }
}
