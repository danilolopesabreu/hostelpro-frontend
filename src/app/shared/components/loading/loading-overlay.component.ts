// loading-overlay.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="overlay">
      <mat-progress-spinner mode="indeterminate" diameter="80"></mat-progress-spinner>
    </div>
  `,
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {}
