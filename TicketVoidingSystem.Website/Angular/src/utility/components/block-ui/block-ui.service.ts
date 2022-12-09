import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlockUiService {
  public blockUIEvent: EventEmitter<boolean>;

  constructor() {
    this.blockUIEvent = new EventEmitter();
  }

  public start() {
    this.blockUIEvent.emit(true);
  }

  public stop() {
    this.blockUIEvent.emit(false);
  }
}
