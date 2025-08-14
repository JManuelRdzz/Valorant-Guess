import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameState } from '../../../stores/game-store';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'val-controls',
  imports: [
    CommonModule
  ],
  template: `
  <div class="flex gap-4">
    @if (gameStore.rondaTerminada) {
      <button 
        class="w-fit px-4 py-2 border-2 rounded-lg text-white text-xl font-medium cursor-pointer bg-[#66C2A9] hover:bg-[#0e8968] border-white"
        (click)="onClickSiguienteRonda()"
      >
        {{ gameStore.rondaActual !== gameStore.MAX_LEVEL ? 'Siguiente ronda' : 'Finalizar'}}
      </button>
     }
  </div>
  `,
  styleUrl: './controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {

  constructor(
    public gameStore: GameState
  ){}

  onClickSiguienteRonda() {
    if (this.gameStore.rondaActual === this.gameStore.MAX_LEVEL) {
      this.gameStore.juegoFinalizado = true;
    } else {
      const rondaActual = this.gameStore.rondaActual;
      this.gameStore.rondaActual = rondaActual + 1;
      this.gameStore.rondaTerminada = false;
      this.gameStore.outputMessage = '';
      this.gameStore.marcador = null;
      this.gameStore.objetivo = this.gameStore.zonas[this.gameStore.rondaActual - 1].coords;
    }
  }
}
