import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MinimapCanvasComponent } from '../minimap-canvas/minimap-canvas.component';
import { NgClass, NgIf } from '@angular/common';
import { ZoneImageComponent } from '../zone-image/zone-image.component';
import { MapSelectionComponent } from '../map-selection/map-selection.component';
import { ControlsComponent } from '../controls/controls.component';
import { GameState } from '../../../stores/game-store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'val-guess-the-place',
  imports: [
    NgClass,
    MinimapCanvasComponent,
    MapSelectionComponent,
    ZoneImageComponent,
    ControlsComponent
  ],
  templateUrl: './guess-the-place.component.html',
  styleUrl: './guess-the-place.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuessThePlaceComponent {

  private bpo = inject(BreakpointObserver);

  juegoIniciado: boolean = false;

  constructor(
    public gameStore: GameState
  ){ }

  readonly isTouchLayout = toSignal(
    this.bpo.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(map(r => r.matches)),
    { initialValue: false }
  );
}
