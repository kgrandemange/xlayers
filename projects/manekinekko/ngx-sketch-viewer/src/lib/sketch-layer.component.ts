import { CurrentLayer } from './../../../../../src/app/state/ui.state';
import { Store } from '@ngxs/store';
import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges, OnInit } from '@angular/core';
import { UiState } from 'src/app/state/ui.state';

@Component({
  selector: 'sketch-layer',
  template: `
    <sketch-layer
      sketchStopEventPropagation
      (click)="setCurrentLayer(layer)"
      *ngFor="let layer of layer?.layers"
      class="layer"
      [layer]="layer"
      [wireframe]="wireframe"
      [ngClass]="{ 'wireframe': wireframe }"
      [attr.data-id]="layer.do_objectID"
      [attr.data-name]="layer.name"
      [attr.data-class]="layer._class"
      [matTooltip]="tooltipInfo"></sketch-layer>
  `,
  styles: [
    `
    :host {
      display: block;
      border: 1px solid transparent;
      position: absolute;
      box-sizing: border-box;
      transition: border-color 0.1s linear;
    }

    :host(:hover) {
      border-color: #51C1F8 !important;
    }
    :host(.wireframe) {
      border-color: black;
    }
  `
  ]
})
export class SketchLayerComponent implements OnInit, AfterContentInit {
  @Input() layer: SketchMSSymbolMaster;
  @Input() wireframe = true;
  artboardFactor = 1;
  borderWidth = 1;

  tooltipInfo = '';

  constructor(public store: Store, public renderer: Renderer2, public element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
  }

  ngAfterContentInit() {
    if (!this.layer) {
      return;
    }

    this.updateLayerStyle();
    this.setTooltipInfo();
  }

  setCurrentLayer(layer: SketchMSSymbolMaster) {
    this.store.dispatch(new CurrentLayer(layer));
  }

  updateLayerStyle() {
    const ne = this.element.nativeElement;
    this.renderer.setStyle(ne, 'border-width', `${this.borderWidth}px`);
    this.renderer.setStyle(ne, 'left', `${this.layer.frame.x * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'top', `${this.layer.frame.y * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'width', `${this.layer.frame.width * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'height', `${this.layer.frame.height * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'visibility', this.layer.isVisible ? 'visibile' : 'hidden');
  }

  setTooltipInfo() {
    this.tooltipInfo = `
      ${this.layer.name} —
      top: ${this.layer.frame.y | 0},
      left: ${this.layer.frame.x | 0},
      width: ${this.layer.frame.width | 0},
      height: ${this.layer.frame.height | 0}`;
  }
}
