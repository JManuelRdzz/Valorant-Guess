import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameState } from '../../../stores/game-store';

@Component({
  selector: 'val-zone-image',
  imports: [],
  template: `
  <div class="w-[500px] h-[500px]">
    <img
      id="imagen-ronda"
      src="assets/zones/{{this.gameStore.zonas[gameStore.rondaActual - 1].archivo}}"
      alt="Zona del mapa"
      class="min-w-full h-full mx-auto max-w-sm border-2 border-white"
    />
  </div>
  `,
  styleUrl: './zone-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneImageComponent {

  constructor(
    public gameStore: GameState
  ){}
}
