import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend, ApexGrid, ApexTooltip
} from 'ng-apexcharts';
import {CommonService} from '../../services/common.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  grid: ApexGrid;
  tooltip: ApexTooltip;

}

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart', {static: false}) chart;

  public chartOptions: Partial<ChartOptions>;
  public apiResultPriceData: any;
  public pricesAry: Array<number> = [];
  public interval: any;
  public xaxisMax: number;

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.renderBubbleChart();
    this.interval = setInterval(async () => {
      // console.clear()
      const data = await this.chart.dataURI();
      this.commonService.applyTotalData('chartbase64Img', data);
      this.updateBubbleChart();
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

  renderBubbleChart() {
    const series = [];
    this.chartOptions = {
      series,
      chart: {
        height: 500,
        type: 'bubble',
        toolbar: {
          show: true
        },
        background: '#FFF'
      },
      tooltip: {
        enabled: false
      },
      xaxis: {
        tickAmount: 12,
        type: 'category',
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        max: this.xaxisMax,
        sorted: false
      },
      fill: {
        opacity: 0.8
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'middle',
        formatter(val:number, opt) {
          return '$' + String(Math.round(val));
        }
      },
      legend: {
        show: false
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
        xaxis: {
          lines: {
            show: true
          }
        }
      }
    };
    setTimeout(() => this.getDataURI(), 1500);
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
    return series;
  }

  getPricesForChart(name) {
    let data: any = [];
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
    return {name, data};
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
    return [xaxis, Math.floor(Math.random() * 100 + 10), xaxis];
  }

}
