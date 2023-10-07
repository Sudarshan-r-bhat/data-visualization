import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComponentConstants } from '../data/component-constants';
import { LineGraphData } from '../data/line-graph-data';
import { HttpClient } from '@angular/common/http';
import { environment as env }  from 'src/environments/environment';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
  providers: [ComponentConstants, LineGraphData]
})
export class LineGraphComponent implements OnInit {
  data: any;
  @ViewChild("lineGraph", {static: true}) lineGraph !: ElementRef;
  constructor(private constants: ComponentConstants, 
    private http: HttpClient,
    private lineGraphData: LineGraphData){}

  ngOnInit() {

    this.data = this.lineGraphData.get();
    
    if(this.data == undefined) {
      // this is the Bangalore, India's 15 days weather forecast data by https://weather.visualcrossing.com
      this.http.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Bangalore%2CIndia?unitGroup=metric&key=${env.WEATHER_DATA_API_KEY}&contentType=json`).subscribe((res) => {
        this.data = res;
        this.data = JSON.parse(this.data);
      },
      (err) => {
        console.log(err);
      });
    }
    
    this.data = this.data.days.map( (d: any) => {
      var date = d.datetime;
      var temp = d.temp;
      return {'date': date, 'temp': temp};
    });

    this.renderLineGraph(this.data);
  }

  private renderLineGraph(data: {date: string, temp: number}[]): void {
    let width = this.constants.screenWidth;
    let height = this.constants.screenHieght;
    
    let viewBoxWidth = this.constants.getViewBoxWidth();
    let viewBoxHeight = this.constants.getViewBoxHeight();
    const margin = { "top": viewBoxHeight * 0.1, "right": 10, "bottom": 10, "left": viewBoxWidth * 0.1 };
    var lineGraph = this.lineGraph.nativeElement;
    const lineGraphSvg = d3
      .select(lineGraph)
      .attr("height", `${viewBoxHeight}`)
      .attr("width", `${viewBoxWidth}`)
      .attr("viewbox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)  // syntax: 
      .style("background-color", "white")
      ;
    // scaleTime, this function generates ranges for the given dates
    const scaleTime = d3.scaleTime();
    const extent = d3.extent;
    const xEx =  extent(data.map(d => new Date(d.date)));
    const xMin = xEx[0] == undefined ? 0: xEx[0];
    const xMax = xEx[1] == undefined ? 0: xEx[1];
    const scaleX = scaleTime
      .domain([xMin, xMax])
      .range([0, viewBoxWidth * 0.8])
      .nice();

    const yEx =  extent(data.map(d => d.temp));
    const yMin = yEx[0] == undefined ? 0: yEx[0];
    const yMax = yEx[1] == undefined ? 0: yEx[1];
    const scaleY = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([0, viewBoxHeight * 0.8])
      .nice()
      ;

    const group2 = lineGraphSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top} )`);

    const yAxis = d3.axisLeft(scaleY)
      .tickSize(-viewBoxWidth * 0.8)
      ;
    group2.append("g")
    .call(yAxis)
    .selectAll(".domain").remove();

    const xAxis = d3.axisBottom(scaleX)
      .tickSize(-viewBoxHeight * 0.8);
    const xAxisGroup = group2.append("g");
    xAxisGroup.attr("transform", `translate(0, ${viewBoxHeight * 0.8})`);
    xAxis(xAxisGroup);

    var lineGenerator = d3.line().curve(d3.curveCatmullRom);
  
    var lineData: [number, number][] = data.map(d => [scaleX(new Date(d.date)), Number(scaleY(d.temp))]);
    console.log(lineData, 'lineGenerator', lineGenerator(lineData));
    
    group2.selectAll('path').data(lineData).enter().append('path')
      .attr('d', lineGenerator(lineData))
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      ;

    group2.selectAll('circle').data(data)
      .enter()
      .append('circle')
        .attr('y', (d: any) => { var res = scaleY(d.temp); return res == undefined ? "" : res; })
        .attr('cx', (d: any) => scaleX(new Date(d.date)))
        .attr('cy', (d: any) => Number(scaleY(d.temp)) )
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .attr('stroke', 'purple')
        .attr('stroke-width', 2)
      ;
  }
}
