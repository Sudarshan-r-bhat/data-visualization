import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentConstants } from '../data/component-constants';
import { PiechartData } from '../data/piechart-data';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  providers: [ComponentConstants, PiechartData]
})
export class PieChartComponent {
  @ViewChild("pieChart", {static: true}) pieChartElement!: ElementRef;
  private data: any;
  constructor(
    private pieChartData: PiechartData,
    private constants: ComponentConstants){}

  ngOnInit() {
    this.data = this.pieChartData.get();
    this.renderPieChart(this.data);
  }

  private renderPieChart(data: any): void {
    
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight(2);
    const viewBoxX = this.constants.getViewBoxWidth(1.5);

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.05 };
   
  }


}
