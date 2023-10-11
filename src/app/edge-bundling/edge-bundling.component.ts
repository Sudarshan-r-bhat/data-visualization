import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentConstants } from '../data/component-constants';
import { EdgeBundlingData } from '../data/edge-bundling-data';
import { MyLinksModel } from '../data/my-links-model';
import { MyNode } from '../data/my-node';

import * as d3 from 'd3';

@Component({
  selector: 'app-edge-bundling',
  templateUrl: './edge-bundling.component.html',
  styleUrls: ['./edge-bundling.component.css'],
  providers: [ComponentConstants, EdgeBundlingData]
})
export class EdgeBundlingComponent {
  @ViewChild("edgeBundling", {static: true}) edgeBundlingElement!: ElementRef;
  private data: any;
  constructor(
    private edgeBundlingData: EdgeBundlingData,
    private constants: ComponentConstants){}

  ngOnInit() {
    this.data = this.edgeBundlingData.get();
    this.renderEdgeBundlingDiagram(this.data);
  }
  private renderEdgeBundlingDiagram(data: any): void {
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight(2);
    const viewBoxX = this.constants.getViewBoxWidth(1.5);

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.05 };

    // --- calculations ---.
    // d3 layout calc
    const edgeBundleSvg: d3.Selection<any, unknown, null, undefined> = d3.select(this.edgeBundlingElement.nativeElement)
                        .attr('height', viewBoxY* 1/3)
                        .attr('width', viewBoxX / 2)
                        .style('background-color', 'white');

    const hierarchy = d3.hierarchy(data);
    const treeLayout = d3.tree()
    .size([2*Math.PI, viewBoxX / 7]) // [max-angle,inner-radius]
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
    const rootNode = treeLayout(hierarchy);
    const leaves = rootNode.leaves();
    const links: d3.HierarchyPointLink<any>[] = rootNode.links();

    const colorScale:any = d3.scaleOrdinal()
          .domain(Array.of(leaves.length).map(d => String(d)))
          .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.2), leaves.length));
          
    const lineGenerator = d3.lineRadial()
                .curve(d3.curveBundle.beta(0.85))
                .angle(d => d[0])
                .radius(d => d[1]);

    // create your own nodes, to generate links.
    let myNodesMap: Map<string, MyNode> = new Map();
    leaves.forEach((l:any, idx) => {
      let myNode = new MyNode();
      l.color = colorScale(String(idx));
      myNode.color = colorScale(String(idx));
      myNode.name = l.data.name;
      myNode.points = [l.x, l.y];      
      myNodesMap.set(l.data.name, myNode);
    });
    console.log('mynodes-map', myNodesMap);
    
    // create links using the nodes created above.
    let myLinks: Array<MyLinksModel> = new Array();
    this.data.children.forEach((d: any) => {
      let name: string = d.name;
      let inbounds: string[] = d.inbound;
      let outBounds: string[] = d.outbound;
      if(inbounds != undefined) {
        inbounds.forEach(ib => {
          let obj: MyLinksModel = new MyLinksModel();
          let sourceNode: MyNode = myNodesMap.get(name) as MyNode;
          let targetNode: MyNode = myNodesMap.get(ib) as MyNode;
          obj.source = sourceNode?.points as [number, number];
          obj.target = targetNode?.points as [number, number];
          obj._color = sourceNode?.color as string;
          obj.color = this.constants.pathColor;
          obj.targetName = targetNode?.name as string;
          obj.sourceName = sourceNode?.name as string;
          myLinks.push(obj);
        });
      }
      if(outBounds != undefined) {
        outBounds.forEach(ob => {
          let obj: MyLinksModel = new MyLinksModel();
          let sourceNode = myNodesMap.get(name);
          let targetNode = myNodesMap.get(ob);          
          obj.source = sourceNode?.points as [number, number];
          obj.target = targetNode?.points as [number, number];
          obj.color = this.constants.pathColor;
          obj._color = targetNode?.color as string;
          obj.targetName = targetNode?.name as string;
          obj.sourceName = sourceNode?.name as string;
          myLinks.push(obj);
        });
      }
    });
    console.log('DEBUG:', myNodesMap, myLinks);
    
    // drawings
    const g = edgeBundleSvg.append('g')
                .attr('transform', `translate(${viewBoxX/4},${viewBoxY/6})`);

    const paths = g.selectAll('path').data(myLinks).enter().append('path');
    this.renderPaths(paths, colorScale, myLinks, lineGenerator);
  
    const circles: d3.Selection<SVGCircleElement, d3.HierarchyPointNode<any>, SVGGElement, any> =
    g.selectAll('circle').data(leaves).enter().append('circle');
    this.renderCircles(circles, colorScale, leaves, paths, myLinks, lineGenerator);

    const texts: d3.Selection<SVGTextElement, d3.HierarchyPointNode<unknown>, SVGGElement, unknown> =
    g.selectAll('text').data(leaves).enter().append('text');
    this.renderTexts(texts);

  }
  renderPaths(paths: d3.Selection<SVGPathElement, MyLinksModel, SVGGElement, any>, 
    colorScale: any, 
    links: any,
    pathGenerator: any) {
      const p = paths.join(links)
        .attr('d', (d: any) => {
          console.log(d);
          return pathGenerator([d.source, [0,0], d.target]);
        })
        .attr('fill', 'none')
        .attr('stroke', "black");
      p.merge(p)
        .transition().duration(500)
          .attr('stroke', (d: any) => d.color)
          .attr('stroke-width', (d: any) => d.color == this.constants.pathColor ? 1: 5)
        ;

  }

  private togglePathColor(myLinks: MyLinksModel[], name: string, event: string): void {
    myLinks.filter(link => link.sourceName == name)
        .forEach(link => {
          let _color = link._color;
          if(event == 'mouseover') {
            link.color = _color;
          } else {
            link.color = this.constants.pathColor;
          }
        });
  }
  private renderCircles(circles: d3.Selection<SVGCircleElement, d3.HierarchyPointNode<any>, SVGGElement, any>,
    colorScale: d3.ScaleOrdinal<string, any, any>,
    leaves: any,
    paths: d3.Selection<SVGPathElement, MyLinksModel, SVGGElement, any>, 
    links: any,
    pathGenerator: any): void {
    circles.join(leaves)
        .attr('cx', d => d.y * Math.cos(d.x - Math.PI/2))
        .attr('cy', d => d.y * Math.sin(d.x - Math.PI/2))
        .attr('r', 15)
        .attr('fill', (d, idx) => colorScale(String(idx)))
      .on('mouseover', (event, d: any) => {
        d._color = d.color;
        d.color = 'black';
        this.togglePathColor(links, d.data.name, 'mouseover');
        this.renderCircles(circles, colorScale, leaves, paths, links, pathGenerator);
        this.renderPaths(paths, colorScale, links, pathGenerator);
      })
      .on('mouseout', (event, d:any) => {
        d.color = d._color;
        this.togglePathColor(links, d.data.name, 'mouseout');
        this.renderCircles(circles, colorScale, leaves, paths, links, pathGenerator);
        this.renderPaths(paths, colorScale, links, pathGenerator);
      })

    circles
    .merge(circles)
      .transition().duration(500)
      .attr('stroke', (d: any) => { if(d.color== 'black') return 'black'; else return 'none';})
      .attr('stroke-width', (d: any) => { if(d.color== 'black') return 3; else return 0;});
  }
  private renderTexts(texts: d3.Selection<SVGTextElement, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>): void {
    texts
        .attr('x', d => d.y * Math.cos(d.x - Math.PI/2))
        .attr('y', d => d.y * Math.sin(d.x - Math.PI/2) + 30)
        .attr('fill', 'black')
        .text((d: any) => d.data.name)
        ;
  }

}
