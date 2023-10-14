import { Component, ElementRef, ViewChild } from '@angular/core';
import { barChartData } from './data';
import { ComponentConstants } from '../data/component-constants';
import * as d3 from 'd3';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  providers: [ComponentConstants]
})
export class BarChartComponent {

  @ViewChild("barchart", { static: true }) barChart!: ElementRef;
  data: any;
  
  constructor(private constants: ComponentConstants){

  }

  ngOnInit() {
    this.data = barChartData;
    this.renderBarChart(this.data);
  }

  renderBarChart(data: any): void {
    console.log('data = ', data);
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight();
    const viewBoxX = this.constants.getViewBoxWidth();
    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.1 };
    var barChart = this.barChart.nativeElement;
    const barChartSvg = d3
      .select(barChart)
      .attr("height", `${viewBoxY* 2/3}`)
      .attr("width", `${viewBoxX *2/3}`)
      .attr("viewbox", `0 0 ${viewBoxX*2/3 } ${viewBoxY *2/3}`)  // syntax: 
      .style("background-color", "orange")
      ;
    // scaleLinear, this function generates ranges for the given min and max
    let min = 0; let max = d3.max(barChartData, d => d.population);
    max = max == undefined ? min : max;
    const scaleLinear = d3.scaleLinear;
    const scaleX = scaleLinear()
      .domain([min, max])
      .range([0, viewBoxX/2 * 0.8]);

    // scaleBand helps you choose the  band for a given height / size
    // refer: https://www.w3schools.com/graphics/tryit.asp?filename=trysvg_rect2
    // https://www.w3schools.com/graphics/svg_rect.asp
    const scaleY = d3.scaleBand()
      .domain(barChartData.map(d => d.country))
      .range([0, viewBoxY/2 * 0.8])
      .padding(0.1)
      ;

    console.log('scaleY', barChartData.map(d => scaleY(d.country)), 'scaleX', barChartData.map(d => scaleX(d.population)), scaleX.range());
    const group2 = barChartSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top} )`);

    const yAxis = d3.axisLeft(scaleY);
    yAxis(group2.append("g"));

    const xAxis = d3.axisBottom(scaleX)
      .tickSize(-viewBoxY/2 * 0.8);
    const xAxisGroup = group2.append("g");
    xAxisGroup.attr("transform", `translate(0, ${viewBoxY/2 * 0.8})`);
    xAxis(xAxisGroup);

    group2.selectAll('rect').data(barChartData)
      .enter()
      .append('rect')
      .attr('y', (d: any) => { var res = scaleY(d.country); return res == undefined ? "" : res; })
      .attr('width', (d: any) => scaleX(d.population))
      .attr('height', (d: any) => scaleY.bandwidth())
      .attr('fill', 'beige')
      .attr('stroke', 'purple')
      .attr('stroke-width', 2)
      ;
  }
}
