import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-email',
  imports: [],
  templateUrl: './confirmar-email.component.html',
  styleUrl: './confirmar-email.component.scss',
})
export class ConfirmarEmailComponent implements OnInit {

  private overlayRef?: OverlayRef;
  
  constructor(private router: Router, private overlay: Overlay) {}
  ngOnInit(): void {
    this.abrirTela();
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
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

    const portal = new ComponentPortal(ConfirmarEmailComponent);
    const componentRef = this.overlayRef.attach(portal);
    
    const ref = this.overlayRef;
    componentRef.instance.overlayRef = ref;

    // Passa referência para o componente poder fechar
    /*componentRef.instance.fechar.subscribe(() => {
      console.log("Evento fechar recebido");
      this.fecharTela()
    });*/
    

    // Fecha ao clicar fora (opcional)
    //this.overlayRef.backdropClick().subscribe(() => this.fecharTela());
  }

}
