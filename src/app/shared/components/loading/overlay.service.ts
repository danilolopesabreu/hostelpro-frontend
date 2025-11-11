// overlay.service.ts
import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingOverlayComponent } from './loading-overlay.component';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private injector: Injector) {}

  show() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'transparent-backdrop',
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
      });
    }
    this.overlayRef.attach(new ComponentPortal(LoadingOverlayComponent, null, this.injector));
  }

  hide() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
