import { Injectable, signal } from '@angular/core';
import { Coordenadas } from '../models/types';
import zonas_data from '../data/zonas.json';

export interface User { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class GameState {
  private _MAX_LEVEL = zonas_data.length;
  get MAX_LEVEL() { return this._MAX_LEVEL };

  private _rondaTerminada = signal<boolean>(false);
  get rondaTerminada() { return this._rondaTerminada() };
  set rondaTerminada( newEstadoRonda: boolean ) { this._rondaTerminada.set(newEstadoRonda) };

  private _zonas = signal<any[]>([]);
  get zonas() { return this._zonas() };
  set zonas( newZomas: any[] ) { this._zonas.set(newZomas) };

  private _selectedMap = signal<string>('Bind');
  get selectedMap() { return this._selectedMap()};
  set selectedMap( newMap: string ) {this._selectedMap.set(newMap) };

  private _outputMessage = signal<string>('');
  get outputMessage() { return this._outputMessage() };
  set outputMessage( newMessage: string ) { this._outputMessage.set(newMessage) };

  private _rondaActual = signal<number>(1);
  get rondaActual() { return this._rondaActual() };
  set rondaActual( newRonda: number ) { this._rondaActual.set(newRonda) };

  private _marcador = signal<Coordenadas | null>(null);
  get marcador() { return this._marcador() };
  set marcador( newMarcador: Coordenadas | null ) { this._marcador.set(newMarcador) };

  private _objetivo = signal<Coordenadas | null>(null);
  get objetivo() { return this._objetivo() };
  set objetivo( newObjetivo: Coordenadas | null ) { this._objetivo.set(newObjetivo) };

  private _aciertos = signal<number>(0);
  get aciertos() { return this._aciertos() };
  set aciertos( newValor: number ) { this._aciertos.set(newValor) };

  private _errores = signal<number>(0);
  get errores() { return this._errores() };
  set errores( newValor: number ) { this._errores.set(newValor) };

  private _juegoFinalizado = signal<boolean>(false);
  get juegoFinalizado() { return this._juegoFinalizado() };
  set juegoFinalizado( newValor: boolean ) { this._juegoFinalizado.set(newValor) };

}
