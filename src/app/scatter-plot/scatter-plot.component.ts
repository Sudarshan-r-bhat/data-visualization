import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScatterPlotData } from '../data/scatter-plot-data';
import { ComponentConstants, ComponentConstants as constants } from '../data/component-constants';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css'],
  providers: [ScatterPlotData, ComponentConstants]
})
export class ScatterPlotComponent implements OnInit {
  
  @ViewChild("scatterPlot", {static: true}) scatterPlot!: ElementRef;
  data: any;

  constructor(private scatterPlotData: ScatterPlotData, private constants: constants) {
    this.data = scatterPlotData.get();
  }
  ngOnInit(): void {
    this.renderScatterPlot(this.data);
  }
  
  private renderScatterPlot(data: {country: string; population: number;}[]): void {
    let width = this.constants.screenWidth;
    let height = this.constants.screenHieght;
    
    let viewBoxWidth = this.constants.getViewBoxWidth();
    let viewBoxHeight = this.constants.getViewBoxHeight();
    const margin = { "top": viewBoxHeight * 0.1, "right": 10, "bottom": 10, "left": viewBoxWidth * 0.1 };
    var scatterPlot = this.scatterPlot.nativeElement;
    const scatterPlotSvg = d3
      .select(scatterPlot)
      .attr("height", `${viewBoxHeight}`)
      .attr("width", `${viewBoxWidth}`)
      .attr("viewbox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)  // syntax: 
      .style("background-color", "white")
      ;
    // scaleLinear, this function generates ranges for the given min and max
    let min = 0; let max = d3.max(data, d => d.population);
    max = max == undefined ? min : max;
    const scaleLinear = d3.scaleLinear;
    const scaleX = scaleLinear()
      .domain([min, max])
      .range([0, viewBoxWidth * 0.8])
      .nice();

    // scaleBand helps you choose the  band for a given height / size
    // refer: https://www.w3schools.com/graphics/tryit.asp?filename=trysvg_rect2
    // https://www.w3schools.com/graphics/svg_rect.asp
    const scaleY = d3.scalePoint()
      .domain(data.map(d => d.country))
      .range([0, viewBoxHeight * 0.8])
      .padding(0.1)
      ;

    console.log('scaleY', data.map(d => scaleY(d.country)), 'scaleX', data.map(d => scaleX(d.population)), scaleX.range());
    const group2 = scatterPlotSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top} )`);

    const yAxis = d3.axisLeft(scaleY)
      .tickSize(-viewBoxWidth * 0.8)
      .tickFormat(d => d.replace('G', 'B'))
      ;
    group2.append("g")
    .call(yAxis)
    .selectAll(".domain").remove();

    const xAxis = d3.axisBottom(scaleX)
      .tickSize(-viewBoxHeight * 0.8);
    const xAxisGroup = group2.append("g");
    xAxisGroup.attr("transform", `translate(0, ${viewBoxHeight * 0.8})`);
    xAxis(xAxisGroup);

    group2.selectAll('circle').data(data)
      .enter()
      .append('circle')
        .attr('y', (d: any) => { var res = scaleY(d.country); return res == undefined ? "" : res; })
        .attr('cx', (d: any) => scaleX(d.population))
        .attr('cy', (d: any) => Number(scaleY(d.country)) )
        .attr('r', 10)
        .attr('fill', 'steelblue')
        .attr('stroke', 'purple')
        .attr('stroke-width', 2)
      ;


  }


}
