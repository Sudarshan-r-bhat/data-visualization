import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ComponentConstants } from '../data/component-constants';
import { RadialTreeData } from '../data/radial-tree-data';
import * as d3 from 'd3';

@Component({
  selector: 'app-radial-tree',
  templateUrl: './radial-tree.component.html',
  styleUrls: ['./radial-tree.component.css'],
  providers: [ ComponentConstants, RadialTreeData]
})
export class RadialTreeComponent implements OnInit {
  @ViewChild('radialTree', {static: true}) radialTreeElement!: ElementRef;
  data: any;

  constructor(private constants: ComponentConstants, private radialTreeData: RadialTreeData) {}

  ngOnInit(): void {
    this.data = this.radialTreeData.get();
    this.renderRadialTree(this.data);
  }
  private renderRadialTree(data: any) {

    const hierarchy = d3.hierarchy(data);
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight();
    const viewBoxX = this.constants.getViewBoxWidth();

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.1 };

    const clusterLayout = d3.cluster().size([2 * Math.PI, viewBoxY* 0.4])   // set the co-ordinate system size x ranges form 0 to 2*pi, y ranges from 0 to viewBoxY/2
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);      // set separation b/w nodes wrt depth

    const rootNode = clusterLayout(hierarchy);
    const links = rootNode.links();
    var descendants = rootNode.descendants();

    const radialPathGenerator = d3.linkRadial<any, any>()
    .radius((d) => d.y)
    .angle((d) => d.x);

    const handleZoom = (event: any) => {
      d3.select('svg g')
        .attr('transform', event.transform)
        ;
    };
    let zoom = d3.zoom()
      .on('zoom', handleZoom);

    const treeSvg = d3.select(this.radialTreeElement.nativeElement);
    treeSvg.attr("width", windowScreenX * 0.8)
      .attr("height", windowScreenY);
    treeSvg.call(zoom);
    // move entire group 
    const group = treeSvg.append('g')
      .attr('transform', `translate(${viewBoxX* 0.5},${viewBoxY /2 })`)
    
    // draw path
    group.selectAll('path').data(links).enter()
    .append('path')
      .attr('d', radialPathGenerator)
      .attr("fill", "none")
      .attr('stroke', 'steelblue')
      .attr('stroke-width', viewBoxX/viewBoxY)
    ;

    // (x, y) from polar system
    function scaleX(d: any): number {
      return d.y * Math.cos(d.x - Math.PI/2); // CONVERT POLAR SYSTEM TO CARTESIAN SYSTEM
    }
    function scaleY(d: any): number  {
      return d.y * Math.sin(d.x - Math.PI/2); 
    }
    // draw circles
    const nodes = group.selectAll('circle').data(descendants).enter()
      .append('circle')
        .attr('cx', scaleX)
        .attr('cy', scaleY)
        .attr('r', 3 * viewBoxY/viewBoxX)
        .attr('fill', 'red');
        
    nodes.merge(nodes)
      .on('click', d => {
        if(d.children == undefined || d.children == null)
          d.children = d._children;
        else
          d.children = null;
        console.log('clicked', d._children);
      })
      ;

/*
    note:
      1. to covert radians to degree = [radians * (180/pi) ]
      2. Math behind, [(x - pi/2) * 180 / pi] this gives the acute angle from the center to 
        a node in the x-y plane.
        
        [(x + pi/2) * 180 / pi] this gives the acute angle from the center to 
        a node in the x-y plane in the negative direction.
      3. The rotation depends on the text-anchor as well. 

*/
    const getTextAngle = (x: number, y: number): number => {
      const pi = Math.PI;

      if(x > 0 && x < pi / 2 )                  // 1st Quad
        return (x - pi/2) * 180/pi; 
      else if(x > pi/2 && x < pi)               // 2nd Quad
        return (x - pi/2) * 180 / pi;
      else if(x > pi && x < 3 * pi/2 )          // 3rd Quad
        return (x + pi/2) * 180/pi;
      else if(x > 3 * pi/2 && x < 2 * pi)       // 4th Quad
        return (x + pi/2) * 180 / pi;
      return pi/2;

    }

    const getTextAnchor = (x: number, depth: number): string => {        
      const pi = Math.PI;
      if(x > 0 && x < pi / 2 ) {                 // 1st Quad
        if(depth > 0)
          return "end";
        return "start";
      }
      else if(x > pi/2 && x < pi)  {              // 2nd Quad
        if(depth > 0)
          return "end";
        return "start";
      }
      else if(x > pi && x < 3 * pi/2 ) {          // 3rd Quad
        if(depth > 0)
          return "start";
        return "end";
      }
      else if(x > 3 * pi/2 && x < 2 * pi) {      // 4th Quad
        if(depth > 0)
          return "start";
        return "end";
      }
      return "middle";
    }

    const maxHeight = Number(d3.max(descendants, d => d.height));
    const maxDepth = Number(d3.max(descendants, d => d.depth));
    
    // draw text
    group.selectAll('text').data(descendants).enter().append('text')
      .attr('x', scaleX) // CONVERT POLAR SYSTEM TO CARTESIAN SYSTEM
      .attr('y', scaleY)
    .text( (d: any) =>  { 
      return d.data.name;
    })
      .attr("text-anchor",(d: any) => getTextAnchor(d.x, -1))
      .attr('transform', d => `rotate(${getTextAngle(d.x, d.y)}, ${scaleX(d)},${scaleY(d)}) `) // rotate(angle,x,y) 
      .attr('fill', 'black')
      .style("font-size", "0.3em")
      ;

  }

}
