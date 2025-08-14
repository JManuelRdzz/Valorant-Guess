import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameState } from '../../../stores/game-store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'val-map-selection',
  imports: [
    NgClass
  ],
  template: `
    <div class="flex gap-4">
      @for (map of maps; track $index) {
        <button 
          (click)="onClickSelectMap( map )" 
          class="w-fit px-4 py-2 border-2 rounded-lg text-white font-medium text-xl cursor-pointer"
          [class]="gameStore.selectedMap === map 
            ? 'bg-[#FF3E47] hover:bg-[#ff1520] border-white' 
            : 'bg-[#111] hover:bg-[#1b1b1b] border-gray-500'"
          [ngClass]="{'bg-[#FF3E47] ': gameStore.selectedMap === map}"
        >
          {{ map}}
        </button>
      }
    </div>
  `,
  styleUrl: './map-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSelectionComponent {

  maps: string[] = ['Bind', 'Ascent', 'Haven'];

  constructor(
    public gameStore: GameState
  ){}

  onClickSelectMap( map: string) {
    if (this.gameStore.rondaTerminada) return;
    
    this.gameStore.selectedMap = map;
    this.gameStore.outputMessage = '';
  }
}
