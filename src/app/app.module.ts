import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { PathLocationStrategy, LocationStrategy } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrderComponent } from "./order/order.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./home/home.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HttpClientModule } from "@angular/common/http";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbdDatepickerBasic } from "./directives/datepicker";
import { OnblurDirective } from "./directives/onblur.directive";
import { NgxMaskModule } from "ngx-mask";
import * as Hammer from "hammerjs";
import { BadgeModule, ButtonsModule, CardsModule, CarouselModule, CheckboxModule, DropdownModule, InputsModule, InputUtilitiesModule, MDBBootstrapModulesPro, PreloadersModule, ProgressbarModule, TooltipModule, WavesModule } from "ng-uikit-pro-standard";

import { AgmCoreModule } from "@agm/core";
import { NgbdModalContent } from "./home/ngbd.modal.content";
import { ApiService } from "./services/api-service";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { PolicyComponent } from "./policy/policy.component";
import { EsignComponent } from "./esign/esign.component";
import { RetrieveComponent } from "./retrieve/retrieve.component";
import { StepTwoComponent } from "./step-two/step-two.component";
import { StepThreeComponent } from "./step-three/step-three.component";
import { StepFourComponent } from "./step-four/step-four.component";
import { StepFiveComponent } from "./step-five/step-five.component";
import { StepSixComponent } from "./step-six/step-six.component";
import { StepSevenComponent } from "./step-seven/step-seven.component";
import { StepEightComponent } from "./step-eight/step-eight.component";
import { StepNineComponent } from "./step-nine/step-nine.component";
import { LoadingComponent } from "./loading/loading.component";
import { RoofComponent } from "./roof/roof.component";
import { ExteriorComponent } from "./exterior/exterior.component";
import { PreDetailsComponent } from "./pre-details/pre-details.component";
import { SubHeaderComponent } from "./sub-header/sub-header.component";
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";
import { IssuingComponent } from "./issuing/issuing.component";
import { StepOneComponent } from "./step-one/step-one.component";
import { ConnectingAPIComponent } from "./connecting-api/connecting-api.component";
import { ChatComponent } from "./chat/chat.component";
import { AboutComponent } from "./about/about.component";
import { SwipeComponent } from "./swipe/swipe.component";
import { SwipeComponentComponent } from "./swipe-component/swipe-component.component";
import { ContactComponent } from "./contact/contact.component";
import { PriceSortComponent } from "./components/price-sort/price-sort.component";
import { PriceFilterComponent } from "./components/price-filter/price-filter.component";
import { PriceWidgetComponent } from "./components/price-widget/price-widget.component";
import { PriceLoaderComponent } from "./components/price-loader/price-loader.component";
import { DemoPageComponent } from "./components/waleed/demo-page/demo-page.component";
import { BatchPageComponent } from "./components/batch-page/batch-page.component";
import { AddressInputComponent } from "./components/address-input/address-input.component";
import { AddCodePageComponent } from "./components/add-code-page/add-code-page.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { BulkListComponent } from "./components/bulk-list/bulk-list.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { DemoPriceHeaderComponent } from "./components/waleed/demo-price-header/demo-price-header.component";
import { DemoClaimsComponent } from "./components/demo-claims/demo-claims.component";
import { DemoEmailPdfComponent } from "./components/demo-email-pdf/demo-email-pdf.component";
import { DemoGmapComponent } from "./components/demo-gmap/demo-gmap.component";
import { DemoPriceSwiperComponent } from "./components/demo-price-swiper/demo-price-swiper.component";
import { DemoPriceInfoComponent } from "./components/demo-price-info/demo-price-info.component";
import { DemoCoverageInfoComponent } from "./components/demo-coverage-info/demo-coverage-info.component";
import { DemoPriceBindComponent } from "./components/demo-price-bind/demo-price-bind.component";
import { BubbleChartComponent } from "./components/bubble-chart/bubble-chart.component";
import { BarChartComponent } from "./components/bar-chart/bar-chart.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { PriceDetailsModalComponent } from "./components/useless/price-details-modal/price-details-modal.component";
import { DemoPageEmailModalComponent } from "./components/demo-page-email-modal/demo-page-email-modal.component";
import { PreparingPolicyComponent } from "./components/preparing-policy/preparing-policy.component";
import { PolicyStartDateComponent } from "./components/policy-start-date/policy-start-date.component";
import { PolicyHaveMortgageComponent } from "./components/policy-have-mortgage/policy-have-mortgage.component";
import { PolicyMortgageInfoComponent } from "./components/policy-mortgage-info/policy-mortgage-info.component";
import { PolicyOlarkChatComponent } from "./components/policy-olark-chat/policy-olark-chat.component";
import { HavenInputsComponent } from "./components/haven-inputs/haven-inputs.component";
import { SwiperContainerComponent } from "./components/swiper-container/swiper-container.component";
import { HavenResultComponent } from "./components/haven-result/haven-result.component";
import { PropertyFormComponent } from "./property-form/property-form.component";
import { InitialInfoForm } from "./components/waleed/initial-info-form/initial-info-form.component";

import { OwlModule } from "ngx-owl-carousel";
import { InsuranceDetailComponent } from "./insurance-detail/insurance-detail.component";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ChartsModule, ThemeService } from "ng2-charts";
import { Ng5SliderModule } from "ng5-slider";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DemoPageP2Component } from "./components/waleed/demo-page-p2/demo-page-p2.component";
import { HeaderComponent } from "./components/waleed/header/header.component";
import { MatNativeDateModule } from "@angular/material";
import { EditCoverageComponent } from "./components/waleed/edit-coverage/edit-coverage.component";
import { CourseRelation } from "./components/waleed/course-relation/course-relation.component";

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20, direction: Hammer.DIRECTION_ALL }, // override default settings
  };
}

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    HomeComponent,
    NgbdDatepickerBasic,
    NgbdModalContent,
    PolicyComponent,
    EsignComponent,
    RetrieveComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    StepSevenComponent,
    StepEightComponent,
    StepNineComponent,
    LoadingComponent,
    InitialInfoForm,
    RoofComponent,
    ExteriorComponent,
    PreDetailsComponent,
    SubHeaderComponent,
    IssuingComponent,
    ConnectingAPIComponent,
    ChatComponent,
    AboutComponent,
    SwipeComponent,
    SwipeComponentComponent,
    ContactComponent,
    PriceSortComponent,
    PriceFilterComponent,
    PriceWidgetComponent,
    PriceLoaderComponent,
    DemoPageComponent,
    BatchPageComponent,
    AddressInputComponent,
    AddCodePageComponent,
    UserListComponent,
    BulkListComponent,
    UserDetailsComponent,
    DemoPriceHeaderComponent,
    DemoGmapComponent,
    DemoClaimsComponent,
    DemoEmailPdfComponent,
    DemoPriceSwiperComponent,
    DemoPriceInfoComponent,
    DemoCoverageInfoComponent,
    DemoPriceBindComponent,
    BubbleChartComponent,
    BarChartComponent,
    PriceDetailsModalComponent,
    DemoPageEmailModalComponent,
    PreparingPolicyComponent,
    PolicyStartDateComponent,
    PolicyHaveMortgageComponent,
    PolicyMortgageInfoComponent,
    PolicyOlarkChatComponent,
    HavenInputsComponent,
    SwiperContainerComponent,
    HavenResultComponent,
    OnblurDirective,
    PropertyFormComponent,
    InsuranceDetailComponent,
    DemoPageP2Component,
    HeaderComponent,
    EditCoverageComponent,
    CourseRelation
  ],
  imports: [
    MatSlideToggleModule,
    NgbModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBqAaqErAb9CllThpl5z4H5tHJVDBpO0IE",
      libraries: ["places"],
    }),
    Ng4LoadingSpinnerModule.forRoot(),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    InputUtilitiesModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    CarouselModule,
    InputsModule,
    DatePickerModule,
    GooglePlaceModule,
    ButtonsModule,
    WavesModule,
    CardsModule,
    BrowserModule,
    PreloadersModule,
    ProgressbarModule,
    TooltipModule,
    BrowserAnimationsModule,
    MDBBootstrapModulesPro.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BadgeModule,
    ScrollToModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxUsefulSwiperModule,
    NgApexchartsModule,
    OwlModule,
    ChartsModule,
    Ng5SliderModule,
    MatMenuModule,

    MatDatepickerModule,
  ],
  providers: [
    ApiService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    ThemeService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NgbdModalContent, PriceWidgetComponent],
})
export class AppModule {}

/*comment*/
