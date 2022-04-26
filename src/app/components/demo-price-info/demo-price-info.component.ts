import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-demo-price-info",
  templateUrl: "./demo-price-info.component.html",
  styleUrls: ["./demo-price-info.component.scss"],
})
export class DemoPriceInfoComponent implements OnInit {
  constructor(public commonService: CommonService) {}

  public apiResultPriceData: any;
  addressInfo: object;
  zillowInfo: object;
  floodInfo: object;

  ngOnInit() {
    this.addressInfo = this.commonService.getAddressData();
    this.zillowInfo = this.getInfo("zillow");
    this.floodInfo = this.getInfo("flood").data;

    //    console.log ('zillow', this.getInfo('zillow'));

    // Debugging Prices
    const total_data = this.commonService.getLocalItem("total_data");

    console.log("hippo", JSON.parse(total_data.hippo));
    console.log("flood", this.floodInfo);

    if (total_data.demo) {
      console.log("condo");
      this.apiResultPriceData = total_data.demo_condo_data;
    } else {
      console.log("home owner");
      this.apiResultPriceData = total_data.demo_homeowner_data;
    }
    if (!this.apiResultPriceData) {
      this.apiResultPriceData = [];
    }
    this.commonService.setLocalItem('calculationData',{});
    this.getPrices("hippo");
    this.getPrices("plymouth");
    this.getPrices("stillwater");
    this.getPrices("universal");
    console.log("19. Flood Price:                ", total_data["flood"]["data"]["premium"]);
  }

  getInfo(key) {
    const total_data = this.commonService.getLocalItem("total_data");
    if (total_data) return total_data[key];
  }

  getPrices(name) {
    let data: any = [];
    switch (name) {
      case "plymouth":
        data = this.getPlymouthPrice();
        break;
      case "stillwater":
        data = this.getStillwaterPrice();
        break;
      case "universal":
        data = this.getUniversalPrice();
        break;
      case "hippo":
        data = this.getHippoPrice();
        break;
    }
  }

  getPlymouthPrice() {
    const data = this.apiResultPriceData.plymouth;
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    const result = [];
    const calculationData = this.commonService.getLocalItem('calculationData');
    calculationData.Plymouth_Good_Burst_Price = 0;
    calculationData.Plymouth_Good_Burst_Low = 0;
    calculationData.Plymouth_Good_Burst_High = 0;

    calculationData.Plymouth_Better_Burst_Price = 0;
    calculationData.Plymouth_Better_Burst_Low = 0;
    calculationData.Plymouth_Better_Burst_High = 0;

    calculationData.Plymouth_Best_Burst_Price = 0;
    calculationData.Plymouth_Best_Burst_Low = 0;
    calculationData.Plymouth_Best_Burst_High = 0;
    this.commonService.setLocalItem('calculationData',calculationData);
    Object.keys(data).map((item) => {
      let pricing: any = parseFloat(data[item].pricing);
      pricing = pricing * 12;
      const { high, low } = this.commonService.getBurstPrices(pricing);

      let high1 = Math.floor(high);
      let low1 = Math.floor(low);
      let pricing1 = Math.floor(pricing);


      //console.log (item);
      if (item == "good") {
        //      console.log(`Plymouth ${item} Burst Price: `, pricing1);
        //      console.log(`Plymouth ${item} Burst Low: `, low1);
        //      console.log(`Plymouth ${item} Burst High: `, high1);
        const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Plymouth_Good_Burst_Price = pricing1;
        calculationData.Plymouth_Good_Burst_Low = low1;
        calculationData.Plymouth_Good_Burst_High = high1;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`4. Plymouth Good Burst Price:   `, pricing1);
        console.log(`5. Plymouth Good Burst Low:     `, low1);
        console.log(`6. Plymouth Good Burst High:    `, high1);
      } else if (item == "better") {
        const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Plymouth_Better_Burst_Price = pricing1;
        calculationData.Plymouth_Better_Burst_Low = low1;
        calculationData.Plymouth_Better_Burst_High = high1;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`7. Plymouth Better Burst Price: `, pricing1);
        console.log(`8. Plymouth Better Burst Low:   `, low1);
        console.log(`9. Plymouth Better Burst High:  `, high1);
      } else if (item == "best") {
        const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Plymouth_Best_Burst_Price = pricing1;
        calculationData.Plymouth_Best_Burst_Low = low1;
        calculationData.Plymouth_Best_Burst_High = high1;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`10. Plymouth Best Burst Price:  `, pricing1);
        console.log(`11. Plymouth Best Burst Low:    `, low1);
        console.log(`12. Plymouth Best Burst High:   `, high1);
      }
    });
  }

  getStillwaterPrice() {
    const data = this.apiResultPriceData.stillwater;
    try {
      const uniqueId = data.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.PolicySummaryInfo.PolicyNumber;
      this.commonService.setLocalItem("unique_id", uniqueId);
      if(typeof data["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"] != undefined){
        let pricing: number = data["ACORD"]["InsuranceSvcRs"]["HomePolicyQuoteInqRs"]["PolicySummaryInfo"]["FullTermAmt"]["Amt"];
        pricing = parseFloat(String(pricing));
        pricing = pricing < 0 ? 0 : pricing;
        if(pricing != 0){
          let { high, low } = this.commonService.getBurstPrices(pricing);
          high = Math.floor(high);
          low = Math.floor(low);
          pricing = Math.floor(pricing);

          const calculationData = this.commonService.getLocalItem('calculationData');
          calculationData.Stillwater_Burst_Price = pricing;
          calculationData.Stillwater_Burst_Low = low;
          calculationData.Stillwater_Burst_High = high;
          this.commonService.setLocalItem('calculationData',calculationData);

          console.log(`13. Stillwater Burst Price:     `, pricing);
          console.log(`14. Stillwater Burst Low:       `, low);
          console.log(`15. Stillwater Burst High:      `, high);
        }else{
         /*  const calculationData = this.commonService.getLocalItem('calculationData');
          calculationData.Stillwater_Burst_Price = pricing;
          calculationData.Stillwater_Burst_Low = 0;
          calculationData.Stillwater_Burst_High = 0;
          this.commonService.setLocalItem('calculationData',calculationData);

          console.log(`13. Stillwater Burst Price:     `, pricing);
          console.log(`14. Stillwater Burst Low:       `, 0);
          console.log(`15. Stillwater Burst High:      `, 0); */
        }
      }
    } catch (e) {}
  }

  getUniversalPrice() {
    const data = this.apiResultPriceData.universal;
    try {
      let pricing: number = data.QuoteWrapper.Premium;
      pricing = parseFloat(String(pricing));
      pricing = pricing < 0 ? 0 : pricing;

      if(pricing != 0){
        let { high, low } = this.commonService.getBurstPrices(pricing);
        high = Math.floor(high);
        low = Math.floor(low);
        pricing = Math.floor(pricing);

        const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Universal_API_Price = pricing;
        calculationData.Universal_Burst_Low = low;
        calculationData.Universal_Burst_High = high;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`16. Universal API Price:        `, pricing);
        console.log(`17. Universal Burst Low:        `, low);
        console.log(`18. Universal Burst High:       `, high);
      }else{
        /* const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.Universal_API_Price = pricing;
        calculationData.Universal_Burst_Low = 0;
        calculationData.Universal_Burst_High = 0;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`16. Universal API Price:        `, pricing);
        console.log(`17. Universal Burst Low:        `, 0);
        console.log(`18. Universal Burst High:       `, 0); */
      }

    } catch (e) {}
  }

  getHippoPrice() {
    try {
      let data = this.commonService.getLocalItem("total_data").hippo;
      data = JSON.parse(data);
      if (!data.success) return;
      let pricing: number = data.quote_premium;
      pricing = parseFloat(String(pricing));

      pricing = pricing < 0 ? 0 : pricing;
      if(pricing != 0){
        let { high, low } = this.commonService.getBurstPrices(pricing);

        high = Math.floor(high);
        low = Math.floor(low);
        pricing = Math.floor(pricing);

        const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.HIPPO_API_Price = pricing;
        calculationData.HIPPO_Burst_Low = low;
        calculationData.HIPPO_Burst_High = high;
        this.commonService.setLocalItem('calculationData',calculationData);
        console.log(`1. HIPPO API Price:             `, pricing);
        console.log(`2. HIPPO Burst Low:             `, low);
        console.log(`3. HIPPO Burst High:            `, high);
      }else{
        /* const calculationData = this.commonService.getLocalItem('calculationData');
        calculationData.HIPPO_API_Price = pricing;
        calculationData.HIPPO_Burst_Low = 0;
        calculationData.HIPPO_Burst_High = 0;
        this.commonService.setLocalItem('calculationData',calculationData);

        console.log(`1. HIPPO API Price:             `, pricing);
        console.log(`2. HIPPO Burst Low:             `, 0);
        console.log(`3. HIPPO Burst High:            `, 0); */
      }


    } catch (e) {}
  }
}
