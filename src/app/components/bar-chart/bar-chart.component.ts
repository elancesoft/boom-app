import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexTooltip
} from "ng-apexcharts";
import {CommonService} from '../../services/common.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart', {static: false}) chart;

  public chartOptions: Partial<ChartOptions>;
  public apiResultPriceData: any;
  public pricesAry: Array<number> = [];
  public interval: any;
  public xaxisMax: number;

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.renderBarChart();
    this.interval = setInterval(async () => {
      // console.clear()
//      const data = await this.chart.dataURI();
//      this.commonService.applyTotalData('chartbase64Img', data);
//      this.updateBubbleChart();
    }, 2000);

  }

  updateBubbleChart() {
    const chartOptions = this.chartOptions;
    if (!chartOptions) {
      return;
    }
    const previousData = chartOptions.series;
    const newData = this.getChartSeries();
    this.xaxisMax = Math.max(...this.pricesAry) + 200;
    if (previousData.length !== newData.length) {
      chartOptions.series = newData;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  async getDataURI() {
  }

  renderBarChart() {
    let price_series = [];
    price_series = this.getChartSeries();
    this.chartOptions = {
      series:[
        {
	  data: price_series
	}
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: false,
	  // startingShape: 'rounded',
          // endingShape: 'rounded',
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: [
        "#0C71BC"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function(val:any, opt) {
          return " $" + String(Math.round(val).toString());
        },
        offsetX: 0,
        dropShadow: {
          enabled: false
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
	categories: [
	  "",
	  ""
	]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        enabled: false,
        theme: "dark",
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function() {
              return "";
            }
          }
        }
      }
    };
//    setTimeout(() => this.getDataURI(), 1500);
  }

  getChartSeries() {
    const series = [];
    const total_data = this.commonService.getLocalItem('total_data');
    if (total_data.demo) {
      this.apiResultPriceData = total_data.demo_condo_data;
    } else {
      this.apiResultPriceData = total_data.demo_homeowner_data;
    }
    if (!this.apiResultPriceData) {
      this.apiResultPriceData = [];
    }
    Object.keys(this.apiResultPriceData).map((item) => {
      series.push(this.getPricesForChart(item));
    });
    series.push(this.getPricesForChart('hippo'));

    var newArr = [];
    for(var i = 0; i < series.length; i++)
      {
        newArr = newArr.concat(series[i]);
      }

    return newArr.sort((function(a, b){return a - b})).slice(0, 10);
  }

  getPricesForChart(name) {
    let data = [];
    switch (name) {
      case 'plymouth':
        data = this.getPlymouthPrice();
        break;
      case 'stillwater':
        data = this.getStillwaterPrice();
        break;
      case 'universal':
        data = this.getUniversalPrice();
        break;
      case 'hippo':
        data = this.getHippoPrice();
        break;
    }
    name = name.toUpperCase();
    return data;
  }

  getPlymouthPrice() {
    const data = this.apiResultPriceData.plymouth;
    if (!data || Object.keys(data).length === 0) {
      return [];
    }
    const result = [];
    Object.keys(data).map((item) => {
      let pricing: any = parseFloat(data[item].pricing);
      pricing = pricing * 12;
      const {high, low} = this.commonService.getBurstPrices(pricing);
      this.pricesAry.push(high, pricing, low);
      result.push(this.getBubblePosition(high));
      result.push(this.getBubblePosition(pricing));
      result.push(this.getBubblePosition(low));
      // console.log(`plymouth ${item} burst high`, high);
      // console.log(`plymouth ${item} burst pricing`, pricing);
      // console.log(`plymouth ${item} burst low`, low);
    });
    return result;
  }

  getStillwaterPrice() {
    const data = this.apiResultPriceData.stillwater;
    const result = [];
    try {
      let pricing: number = data['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'];
      const uniqueId = data.ACORD.InsuranceSvcRs.HomePolicyQuoteInqRs.PolicySummaryInfo.PolicyNumber;
      this.commonService.setLocalItem('unique_id', uniqueId);
      pricing = parseFloat(String(pricing));
      let {high, low} = this.commonService.getBurstPrices(pricing);
      // console.log(`stillwater burst high`, high);
      // console.log(`stillwater burst pricing`, pricing);
      // console.log(`stillwater burst low`, low);
      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);
      result.push(this.getBubblePosition(high));
      result.push(this.getBubblePosition(pricing));
      result.push(this.getBubblePosition(low));
      this.pricesAry.push(high, pricing, low);
    } catch (e) {
      return [];
    }
    return result;
  }

  getUniversalPrice() {
    const data = this.apiResultPriceData.universal;
    const result = [];
    try {
      let pricing: number = data.QuoteWrapper.Premium;
      pricing = parseFloat(String(pricing));
      let {high, low} = this.commonService.getBurstPrices(pricing);
      // console.log(`universal burst high`, high);
      // console.log(`universal burst pricing`, pricing);
      // console.log(`universal burst low`, low);
      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);
      result.push(this.getBubblePosition(high));
      result.push(this.getBubblePosition(pricing));
      result.push(this.getBubblePosition(low));
      this.pricesAry.push(high, pricing, low);
    } catch (e) {
      return [];
    }
    return result;
  }

  getHippoPrice() {
    try {
      let data = this.commonService.getLocalItem('total_data').hippo;
      data = JSON.parse(data);
      let pricing: number = data.quote_premium;
      pricing = parseFloat(String(pricing));
      const result = [];
      let {high, low} = this.commonService.getBurstPrices(pricing);
      // console.log(`hippo burst high`, high);
      // console.log(`hippo burst pricing`, pricing);
      // console.log(`hippo burst low`, low);
      high = Math.floor(high);
      low = Math.floor(low);
      pricing = Math.floor(pricing);
      result.push(this.getBubblePosition(high));
      result.push(this.getBubblePosition(pricing));
      result.push(this.getBubblePosition(low));
      this.pricesAry.push(high, pricing, low);
      return result;
    } catch (e) {
      return [];
    }
  }

  getBubblePosition(xaxis) {
    return xaxis;
  }

}
