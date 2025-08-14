import { ChangeDetectionStrategy, Component, effect, EffectRef, OnDestroy, OnInit } from '@angular/core';
import { GameState } from '../../../stores/game-store';
import zonas_data from '../../../data/zonas.json';
import confetti from 'canvas-confetti';

@Component({
  selector: 'val-minimap-canvas',
  imports: [],
  templateUrl: './minimap-canvas.component.html',
  styleUrl: './minimap-canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimapCanvasComponent implements OnInit {

  PIXELES_POR_METRO = 20;
  RANGO_ACIERTO_METROS = 1;
  RANGO_ACIERTO_PIXELES = this.PIXELES_POR_METRO * this.RANGO_ACIERTO_METROS;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  imgMapa = new Image();

  initialScale = 1;
  escala = 1;
  offsetX = 0;
  offsetY = 0;
  dragging = false;
  dragStartX = 0;
  dragStartY = 0;
  zonas!: any;

  canvasEfect!: EffectRef;

  constructor(
    public gameStore: GameState
  ) {
    this.cargarMinimapa();
    this.effectObjetivo();
  }

  effectObjetivo() {
    effect(() => {
      this.gameStore.marcador;
      this.dibujar();
    });
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('minimap') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.gameStore.zonas = this.mezclarArray(zonas_data);
    this.gameStore.objetivo = this.gameStore.zonas[this.gameStore.rondaActual - 1].coords;
    this.setupCanvasInteractions();
  }

  mezclarArray<T>(array: T[]): T[] {
    const copia = [...array]; // Para no modificar el original
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]]; // Intercambio
    }
    return copia;
  }

  cargarMinimapa() {
     effect(() => {
      this.imgMapa.src = `assets/mapas/${this.gameStore.selectedMap.toLocaleLowerCase()}.webp`;
      this.imgMapa.onload = () => {
      this.centrarImagen();
      this.dibujar();
    }
    });
  }

  centrarImagen() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.escala = Math.min(cw / this.imgMapa.width, ch / this.imgMapa.height);
    this.initialScale = this.escala;
    this.offsetX = (cw / this.escala - this.imgMapa.width) / 2;
    this.offsetY = (ch / this.escala - this.imgMapa.height) / 2;
  }

  dibujar() {
    if (!this.ctx || !this.imgMapa.complete) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.escala, this.escala);
    this.ctx.drawImage(this.imgMapa, this.offsetX, this.offsetY);

    if (this.gameStore.marcador) {
      // línea
      this.ctx.strokeStyle = 'yellow';
      this.ctx.lineWidth = 2 / this.escala;
      this.ctx.beginPath();
      this.ctx.moveTo(this.offsetX + this.gameStore.marcador.x, this.offsetY + this.gameStore.marcador.y);
      this.ctx.lineTo(this.offsetX + this.gameStore.objetivo!.x, this.offsetY + this.gameStore.objetivo!.y);
      this.ctx.stroke();

      // this.marcador
      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      this.ctx.arc(this.offsetX + this.gameStore.marcador.x, this.offsetY + this.gameStore.marcador.y, 5 / this.escala, 0, 2 * Math.PI);
      this.ctx.fill();

      // objetivo real
      this.ctx.fillStyle = 'lime';
      this.ctx.beginPath();
      this.ctx.arc(this.offsetX + this.gameStore.objetivo!.x, this.offsetY + this.gameStore.objetivo!.y, 5 / this.escala, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  setupCanvasInteractions() {
    // clic derecho
    this.canvas.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (this.gameStore.rondaTerminada) return;

      if (!this.gameStore.selectedMap) {
        this.gameStore.outputMessage = '⚠️ Primero selecciona un mapa.';
        return;
      }
      
      const zona = this.gameStore.zonas[this.gameStore.rondaActual - 1];
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.escala - this.offsetX;
      const y = (e.clientY - rect.top) / this.escala - this.offsetY;
      this.gameStore.marcador = { x, y };

      // ---- Validación de mapa ----
      if (this.gameStore.selectedMap !== zona.mapa) {
        this.gameStore.outputMessage = `❌ Incorrecto. El mapa es ${zona.mapa}.`
        this.gameStore.marcador = null;
      } else {
        this.dibujar();
        const distPx = Math.hypot(zona.coords.x - x, zona.coords.y - y);
        const distM = distPx / this.PIXELES_POR_METRO;

        if (distPx <= this.RANGO_ACIERTO_PIXELES) {
          this.gameStore.outputMessage = '✅ ¡Acertaste el lugar exacto!';
          this.gameStore.rondaTerminada = true;
          this.gameStore.aciertos = this.gameStore.aciertos + 1; 

          this.dispararConfetti();
        } else {
          this.gameStore.outputMessage = `🔍 Estuviste a ${distM.toFixed(1)} m del punto real.`;
          this.gameStore.rondaTerminada = true;
          this.gameStore.errores = this.gameStore.errores + 1;
        }
      }
    });

    // zoom
    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / this.escala;
      const my = (e.clientY - rect.top) / this.escala;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const proposedScale = this.escala * zoomFactor;
      const maxScale = this.initialScale * 3;
      const newScale = Math.min(Math.max(this.initialScale, proposedScale), maxScale);
      const ratio = newScale / this.escala;

      this.offsetX = mx - (mx - this.offsetX) * ratio;
      this.offsetY = my - (my - this.offsetY) * ratio;
      this.escala = newScale;

      this.dibujar();
    });

    // pan
    this.canvas.addEventListener('mousedown', e => {
      this.dragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    });
    this.canvas.addEventListener('mouseup', () => {
      this.dragging = false;
      this.canvas.style.cursor = 'grab';
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.dragging = false;
      this.canvas.style.cursor = 'grab';
    });
    this.canvas.addEventListener('mousemove', e => {
      if (!this.dragging) return;
      const dx = (e.clientX - this.dragStartX) / this.escala;
      const dy = (e.clientY - this.dragStartY) / this.escala;
      this.offsetX += dx;
      this.offsetY += dy;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dibujar();
    });
  }

  dispararConfetti() {
    setTimeout(() => {
      this.confetti()
    }, 0);
    setTimeout(() => {
      this.confetti()
    }, 100);
    setTimeout(() => {
      this.confetti()
    }, 200);
  }

  confetti() {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 1.2,
      shapes: ['star'],
    });
  }
}
