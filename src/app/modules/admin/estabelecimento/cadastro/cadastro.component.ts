import { Component, OnInit } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalCadastroComponent } from './modal-cadastro/modal-cadastro.component';

@Component({
  selector: 'app-cadastro',
  imports: [],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent implements OnInit {
  private overlayRef?: OverlayRef;
  constructor(private overlay: Overlay) { }

  ngOnInit(): void {
    this.abrirTela();
  }


  abrirTela() {
    // Se já existe, não cria outra
    if (this.overlayRef) return;

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'overlay-panel',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    const portal = new ComponentPortal(ModalCadastroComponent);
    const componentRef = this.overlayRef.attach(portal);

    // Passa referência para o componente poder fechar
    componentRef.instance.fechar.subscribe(() => this.fecharTela());

    // Fecha ao clicar fora (opcional)
    this.overlayRef.backdropClick().subscribe(() => this.fecharTela());
  }

  fecharTela() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
